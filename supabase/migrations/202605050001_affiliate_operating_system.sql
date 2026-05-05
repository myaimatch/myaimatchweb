create extension if not exists pgcrypto;

create type public.affiliate_program_status as enum (
  'no_program_found',
  'apply_needed',
  'application_prepared',
  'applied',
  'pending',
  'approved',
  'active',
  'rejected',
  'paused',
  'expired',
  'needs_review'
);

create type public.affiliate_link_status as enum (
  'draft',
  'pending',
  'approved',
  'active',
  'paused',
  'expired',
  'rejected',
  'needs_review'
);

create type public.deal_status as enum (
  'draft',
  'pending',
  'active',
  'paused',
  'expired',
  'needs_review'
);

create type public.agent_finding_status as enum (
  'pending_review',
  'approved',
  'rejected',
  'applied'
);

create table public.admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  airtable_id text unique,
  name text not null,
  slug text not null unique,
  description text,
  icon text,
  display_order integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tools (
  id uuid primary key default gen_random_uuid(),
  airtable_id text unique,
  name text not null,
  slug text not null unique,
  short_description text not null default '',
  full_description text not null default '',
  subcategory text,
  website_url text not null default '',
  logo_url text,
  pricing_summary text,
  community_reputation numeric,
  featured boolean not null default false,
  status text not null default 'active',
  support_languages text[] not null default '{}',
  ui_languages text[] not null default '{}',
  founded_year integer,
  has_free_plan boolean,
  trial_days integer,
  best_for text,
  has_api boolean,
  integrations text[] not null default '{}',
  company_hq text,
  employee_count text,
  gdpr_compliant boolean,
  has_mobile_app boolean,
  soc2_certified boolean,
  min_monthly_price numeric,
  max_monthly_price numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tool_categories (
  tool_id uuid not null references public.tools(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (tool_id, category_id)
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  first_name text,
  full_name text,
  business_type text,
  team_size text,
  status text not null default 'new',
  source text not null default 'assessment',
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  email text not null,
  role text,
  business_type text,
  team_size text,
  main_workflow_to_improve text,
  current_tools text,
  ai_experience_level text,
  summary text,
  services_cta text,
  raw_anthropic_response jsonb not null default '{}'::jsonb,
  raw_typeform_payload jsonb not null default '{}'::jsonb,
  status text not null default 'completed',
  created_at timestamptz not null default now()
);

create table public.affiliate_programs (
  id uuid primary key default gen_random_uuid(),
  tool_id uuid not null references public.tools(id) on delete cascade,
  network text,
  program_name text,
  signup_url text,
  dashboard_url text,
  status public.affiliate_program_status not null default 'apply_needed',
  commission_terms text,
  cookie_window_days integer,
  application_notes text,
  applied_at timestamptz,
  approved_at timestamptz,
  last_checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.affiliate_links (
  id uuid primary key default gen_random_uuid(),
  tool_id uuid not null references public.tools(id) on delete cascade,
  affiliate_program_id uuid references public.affiliate_programs(id) on delete set null,
  url text not null,
  label text,
  network text,
  status public.affiliate_link_status not null default 'pending',
  priority integer not null default 100,
  approved_by text,
  approved_at timestamptz,
  valid_from timestamptz,
  valid_until timestamptz,
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.deals (
  id uuid primary key default gen_random_uuid(),
  tool_id uuid not null references public.tools(id) on delete cascade,
  affiliate_link_id uuid references public.affiliate_links(id) on delete set null,
  title text,
  promo_code text,
  description text,
  url text,
  status public.deal_status not null default 'draft',
  rank integer not null default 100,
  active_from timestamptz,
  active_until timestamptz,
  approved_by text,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.assessment_recommendations (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  tool_id uuid references public.tools(id) on delete set null,
  tool_name text not null,
  use_case text,
  why_it_fits text,
  notes text,
  setup_priority integer not null,
  resolved_url text,
  affiliate_link_id uuid references public.affiliate_links(id) on delete set null,
  deal_id uuid references public.deals(id) on delete set null,
  has_affiliate boolean not null default false,
  promo_code text,
  created_at timestamptz not null default now()
);

create table public.click_events (
  id uuid primary key default gen_random_uuid(),
  tool_id uuid references public.tools(id) on delete set null,
  affiliate_link_id uuid references public.affiliate_links(id) on delete set null,
  deal_id uuid references public.deals(id) on delete set null,
  assessment_recommendation_id uuid references public.assessment_recommendations(id) on delete set null,
  source text not null default 'unknown',
  destination_url text not null,
  referer text,
  user_agent text,
  ip_hash text,
  created_at timestamptz not null default now()
);

create table public.revenue_events (
  id uuid primary key default gen_random_uuid(),
  tool_id uuid references public.tools(id) on delete set null,
  affiliate_program_id uuid references public.affiliate_programs(id) on delete set null,
  affiliate_link_id uuid references public.affiliate_links(id) on delete set null,
  amount numeric not null default 0,
  currency text not null default 'USD',
  external_reference text,
  event_date date not null default current_date,
  notes text,
  created_by text,
  created_at timestamptz not null default now()
);

create table public.agent_findings (
  id uuid primary key default gen_random_uuid(),
  tool_id uuid references public.tools(id) on delete cascade,
  finding_type text not null,
  status public.agent_finding_status not null default 'pending_review',
  proposed_fields jsonb not null default '{}'::jsonb,
  evidence jsonb not null default '[]'::jsonb,
  summary text,
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_email text,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before jsonb,
  after jsonb,
  created_at timestamptz not null default now()
);

create index tools_slug_idx on public.tools(slug);
create index tools_status_idx on public.tools(status);
create index tool_categories_category_idx on public.tool_categories(category_id);
create index affiliate_links_tool_status_idx on public.affiliate_links(tool_id, status, priority);
create index deals_tool_status_idx on public.deals(tool_id, status, rank);
create index click_events_created_at_idx on public.click_events(created_at);
create index click_events_tool_source_idx on public.click_events(tool_id, source);
create index assessments_email_idx on public.assessments(email);
create index agent_findings_status_idx on public.agent_findings(status);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.tools enable row level security;
alter table public.tool_categories enable row level security;
alter table public.leads enable row level security;
alter table public.assessments enable row level security;
alter table public.assessment_recommendations enable row level security;
alter table public.affiliate_programs enable row level security;
alter table public.affiliate_links enable row level security;
alter table public.deals enable row level security;
alter table public.click_events enable row level security;
alter table public.revenue_events enable row level security;
alter table public.agent_findings enable row level security;
alter table public.audit_log enable row level security;

create policy "public can read active categories" on public.categories
  for select using (true);

create policy "public can read active tools" on public.tools
  for select using (status = 'active');

create policy "public can read active tool categories" on public.tool_categories
  for select using (true);

create policy "public can read approved affiliate links" on public.affiliate_links
  for select using (status = 'active' and approved_at is not null);

create policy "public can read active deals" on public.deals
  for select using (status = 'active');

create policy "admins manage admin users" on public.admin_users
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admins manage categories" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admins manage tools" on public.tools
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admins manage tool categories" on public.tool_categories
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admins manage leads" on public.leads
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admins manage assessments" on public.assessments
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admins manage assessment recommendations" on public.assessment_recommendations
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admins manage affiliate programs" on public.affiliate_programs
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admins manage affiliate links" on public.affiliate_links
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admins manage deals" on public.deals
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admins read clicks" on public.click_events
  for select using (public.is_admin());

create policy "admins manage revenue" on public.revenue_events
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admins manage findings" on public.agent_findings
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admins read audit log" on public.audit_log
  for select using (public.is_admin());
