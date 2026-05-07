-- AI tool enrichment audit system
-- Stores crawl evidence, run backups, monitored update sources, update events,
-- and link verification results for the web-first enrichment pipeline.

alter table public.tools
  add column if not exists enrichment_summary text,
  add column if not exists enrichment_metadata jsonb not null default '{}'::jsonb,
  add column if not exists website_last_verified_at timestamptz,
  add column if not exists website_verification_status text,
  add column if not exists website_final_url text;

alter table public.affiliate_links
  add column if not exists verification_status text,
  add column if not exists final_url text,
  add column if not exists verification_error text;

alter table public.deals
  add column if not exists last_verified_at timestamptz,
  add column if not exists verification_status text,
  add column if not exists final_url text,
  add column if not exists verification_error text;

create table if not exists public.tool_enrichment_runs (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  status text not null default 'running'
    check (status in ('running', 'completed', 'completed_with_errors', 'failed')),
  min_pages integer not null default 3 check (min_pages > 0),
  requested_slugs text[] not null default '{}',
  total_tools integer not null default 0,
  applied_tools integer not null default 0,
  skipped_tools integer not null default 0,
  failed_tools integer not null default 0,
  backup_json jsonb not null default '{}'::jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.tool_enrichment_evidence (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.tool_enrichment_runs(id) on delete cascade,
  tool_id uuid not null references public.tools(id) on delete cascade,
  url text not null,
  provider text not null,
  source_type text not null,
  status_code integer,
  content_hash text not null,
  title text,
  excerpt text not null default '',
  fetched_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.tool_update_sources (
  id uuid primary key default gen_random_uuid(),
  tool_id uuid not null references public.tools(id) on delete cascade,
  source_url text not null,
  source_type text not null,
  provider text not null default 'monitor',
  status text not null default 'active'
    check (status in ('active', 'paused', 'failed')),
  last_checked_at timestamptz,
  last_content_hash text,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tool_id, source_url)
);

create table if not exists public.tool_update_events (
  id uuid primary key default gen_random_uuid(),
  tool_id uuid not null references public.tools(id) on delete cascade,
  source_id uuid references public.tool_update_sources(id) on delete set null,
  event_type text not null default 'content_change',
  status text not null default 'pending'
    check (status in ('pending', 'processed', 'ignored', 'drafted')),
  title text,
  summary text,
  source_url text,
  evidence jsonb not null default '{}'::jsonb,
  blog_draft_status text not null default 'not_started'
    check (blog_draft_status in ('not_started', 'draft_needed', 'draft_created', 'published', 'skipped')),
  detected_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.link_verification_results (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null
    check (entity_type in ('tool_website', 'go_route', 'affiliate_link', 'deal')),
  entity_id uuid,
  tool_id uuid references public.tools(id) on delete cascade,
  input_url text not null,
  ok boolean not null default false,
  status_code integer,
  final_url text,
  redirect_chain jsonb not null default '[]'::jsonb,
  latency_ms integer,
  error text,
  checked_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists tool_enrichment_runs_created_idx
  on public.tool_enrichment_runs(created_at desc);
create index if not exists tool_enrichment_evidence_tool_idx
  on public.tool_enrichment_evidence(tool_id, fetched_at desc);
create index if not exists tool_enrichment_evidence_run_idx
  on public.tool_enrichment_evidence(run_id);
create index if not exists tool_update_sources_tool_idx
  on public.tool_update_sources(tool_id);
create index if not exists tool_update_events_tool_status_idx
  on public.tool_update_events(tool_id, status, detected_at desc);
create index if not exists link_verification_results_tool_idx
  on public.link_verification_results(tool_id, checked_at desc);
create index if not exists link_verification_results_entity_idx
  on public.link_verification_results(entity_type, entity_id, checked_at desc);

alter table public.tool_enrichment_runs enable row level security;
alter table public.tool_enrichment_evidence enable row level security;
alter table public.tool_update_sources enable row level security;
alter table public.tool_update_events enable row level security;
alter table public.link_verification_results enable row level security;

grant select, insert, update, delete on
  public.tool_enrichment_runs,
  public.tool_enrichment_evidence,
  public.tool_update_sources,
  public.tool_update_events,
  public.link_verification_results
to authenticated;

drop policy if exists "admins manage enrichment runs" on public.tool_enrichment_runs;
create policy "admins manage enrichment runs" on public.tool_enrichment_runs
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage enrichment evidence" on public.tool_enrichment_evidence;
create policy "admins manage enrichment evidence" on public.tool_enrichment_evidence
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage update sources" on public.tool_update_sources;
create policy "admins manage update sources" on public.tool_update_sources
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage update events" on public.tool_update_events;
create policy "admins manage update events" on public.tool_update_events
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage link verification results" on public.link_verification_results;
create policy "admins manage link verification results" on public.link_verification_results
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
