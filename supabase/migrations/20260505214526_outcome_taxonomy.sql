-- Outcome-based directory taxonomy
-- Renames categories/tool_categories to outcomes/tool_outcomes and seeds the
-- approved 14-outcome taxonomy with real subcategory rows.

-- 1) Rename existing directory taxonomy tables.
do $$
begin
  if to_regclass('public.categories') is not null and to_regclass('public.outcomes') is null then
    alter table public.categories rename to outcomes;
  end if;

  if to_regclass('public.tool_categories') is not null and to_regclass('public.tool_outcomes') is null then
    alter table public.tool_categories rename to tool_outcomes;
  end if;

  if to_regclass('public.tool_outcomes') is not null
     and exists (
       select 1
       from information_schema.columns
       where table_schema = 'public'
         and table_name = 'tool_outcomes'
         and column_name = 'category_id'
     )
     and not exists (
       select 1
       from information_schema.columns
       where table_schema = 'public'
         and table_name = 'tool_outcomes'
         and column_name = 'outcome_id'
     )
  then
    alter table public.tool_outcomes rename column category_id to outcome_id;
  end if;
end $$;

-- 2) Primary outcome flag.
alter table public.tool_outcomes
  add column if not exists is_primary boolean not null default false;

create unique index if not exists tool_outcomes_one_primary
  on public.tool_outcomes(tool_id)
  where is_primary;

-- 3) Real subcategory rows.
create table if not exists public.subcategories (
  id uuid primary key default gen_random_uuid(),
  outcome_id uuid not null references public.outcomes(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  display_order integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (outcome_id, slug)
);

create table if not exists public.tool_subcategories (
  tool_id uuid not null references public.tools(id) on delete cascade,
  subcategory_id uuid not null references public.subcategories(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (tool_id, subcategory_id)
);

create table if not exists public.outcome_migration_legacy_tool_categories (
  tool_id uuid not null references public.tools(id) on delete cascade,
  tool_slug text not null,
  category_name text,
  subcategory text,
  created_at timestamptz not null default now()
);

-- 4) Indexes.
create index if not exists tool_outcomes_outcome_idx on public.tool_outcomes(outcome_id);
create index if not exists tool_outcomes_tool_idx on public.tool_outcomes(tool_id);
create index if not exists subcategories_outcome_idx on public.subcategories(outcome_id);
create index if not exists tool_subcategories_tool_idx on public.tool_subcategories(tool_id);
create index if not exists tool_subcategories_sub_idx on public.tool_subcategories(subcategory_id);

-- 5) RLS and grants for public Data API reads plus admin writes.
alter table public.outcomes enable row level security;
alter table public.tool_outcomes enable row level security;
alter table public.subcategories enable row level security;
alter table public.tool_subcategories enable row level security;
alter table public.outcome_migration_legacy_tool_categories enable row level security;

grant select on public.outcomes, public.tool_outcomes, public.subcategories, public.tool_subcategories to anon, authenticated;
grant insert, update, delete on public.outcomes, public.tool_outcomes, public.subcategories, public.tool_subcategories to authenticated;

drop policy if exists "public can read active categories" on public.outcomes;
drop policy if exists "admins manage categories" on public.outcomes;
drop policy if exists "categories_select" on public.outcomes;
drop policy if exists "categories_write" on public.outcomes;
drop policy if exists "outcomes_select" on public.outcomes;
drop policy if exists "outcomes_write" on public.outcomes;
create policy "outcomes_select" on public.outcomes
  for select to anon, authenticated
  using (true);
create policy "outcomes_write" on public.outcomes
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public can read active tool categories" on public.tool_outcomes;
drop policy if exists "admins manage tool categories" on public.tool_outcomes;
drop policy if exists "tool_categories_select" on public.tool_outcomes;
drop policy if exists "tool_categories_write" on public.tool_outcomes;
drop policy if exists "tool_outcomes_select" on public.tool_outcomes;
drop policy if exists "tool_outcomes_write" on public.tool_outcomes;
create policy "tool_outcomes_select" on public.tool_outcomes
  for select to anon, authenticated
  using (true);
create policy "tool_outcomes_write" on public.tool_outcomes
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "subcategories_select" on public.subcategories;
drop policy if exists "subcategories_write" on public.subcategories;
create policy "subcategories_select" on public.subcategories
  for select to anon, authenticated
  using (true);
create policy "subcategories_write" on public.subcategories
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "tool_subcategories_select" on public.tool_subcategories;
drop policy if exists "tool_subcategories_write" on public.tool_subcategories;
create policy "tool_subcategories_select" on public.tool_subcategories
  for select to anon, authenticated
  using (true);
create policy "tool_subcategories_write" on public.tool_subcategories
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- 6) Snapshot legacy category context for the migration classifier, then replace
-- legacy functional categories with the approved outcome taxonomy.
delete from public.outcome_migration_legacy_tool_categories;
insert into public.outcome_migration_legacy_tool_categories (tool_id, tool_slug, category_name, subcategory)
select tools.id, tools.slug, outcomes.name, tools.subcategory
from public.tools tools
left join public.tool_outcomes tool_outcomes on tool_outcomes.tool_id = tools.id
left join public.outcomes outcomes on outcomes.id = tool_outcomes.outcome_id
where tools.status = 'active';

delete from public.tool_subcategories;
delete from public.subcategories;
delete from public.tool_outcomes;
delete from public.outcomes;

insert into public.outcomes (name, slug, description, icon, display_order)
values
  ('Create Content', 'create-content', 'Write, draft, generate, or repurpose text.', 'PenLine', 1),
  ('Design Visuals', 'design-visuals', 'Make images, graphics, brand assets, slides, and mockups.', 'Palette', 2),
  ('Produce Video & Audio', 'produce-video-audio', 'Record, edit, dub, transcribe, score, and publish media.', 'Video', 3),
  ('Build Software', 'build-software', 'Ship code, sites, or apps with or without code.', 'Code2', 4),
  ('Build AI Agents', 'build-ai-agents', 'Create chatbots, voice agents, copilots, and autonomous workers.', 'Bot', 5),
  ('Automate Workflows', 'automate-workflows', 'Connect apps, scrape, process documents, and run repeatable flows.', 'Workflow', 6),
  ('Grow Audience', 'grow-audience', 'Get found organically through search, social, community, and reputation.', 'TrendingUp', 7),
  ('Launch Campaigns', 'launch-campaigns', 'Run paid, email, outbound, landing page, and funnel campaigns end to end.', 'Rocket', 8),
  ('Sell & Close Deals', 'sell-close-deals', 'Prospect, qualify, manage pipeline, and close revenue.', 'Handshake', 9),
  ('Support Customers', 'support-customers', 'Answer, deflect, and manage customer help across chat, tickets, and voice.', 'Headphones', 10),
  ('Analyze Data', 'analyze-data', 'Turn data into dashboards, insights, forecasts, and answers.', 'BarChart2', 11),
  ('Research & Learn', 'research-learn', 'Study, summarize, take notes, and build knowledge faster.', 'GraduationCap', 12),
  ('Plan & Collaborate', 'plan-collaborate', 'Manage tasks, docs, calendar, meetings, and team communication.', 'Users', 13),
  ('Run Operations', 'run-operations', 'Handle finance, HR, legal, admin, compliance, and operational work.', 'Building', 14)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  icon = excluded.icon,
  display_order = excluded.display_order,
  updated_at = now();

with subcategory_seed(outcome_slug, name, slug, description, display_order) as (
  values
    ('create-content', 'Long-form writing (articles, blogs)', 'long-form-writing', 'Articles, blogs, and deeper written assets.', 1),
    ('create-content', 'Social posts', 'social-posts', null, 2),
    ('create-content', 'Marketing & ad copy', 'marketing-ad-copy', null, 3),
    ('create-content', 'Email & newsletters', 'email-newsletters', null, 4),
    ('create-content', 'Scripts & screenplays', 'scripts-screenplays', null, 5),
    ('create-content', 'Translation & localization', 'translation-localization', null, 6),
    ('create-content', 'Content repurposing', 'content-repurposing', null, 7),
    ('design-visuals', 'Generate images', 'generate-images', null, 1),
    ('design-visuals', 'Edit & retouch photos', 'edit-retouch-photos', null, 2),
    ('design-visuals', 'Brand & logo design', 'brand-logo-design', null, 3),
    ('design-visuals', 'Slides & decks', 'slides-decks', null, 4),
    ('design-visuals', 'UI & web mockups', 'ui-web-mockups', null, 5),
    ('design-visuals', 'Icons & illustrations', 'icons-illustrations', null, 6),
    ('produce-video-audio', 'Generate video', 'generate-video', null, 1),
    ('produce-video-audio', 'Edit & cut video', 'edit-cut-video', null, 2),
    ('produce-video-audio', 'AI avatars & spokespersons', 'ai-avatars-spokespersons', null, 3),
    ('produce-video-audio', 'Voice generation & dubbing', 'voice-generation-dubbing', null, 4),
    ('produce-video-audio', 'Transcribe & caption', 'transcribe-caption', null, 5),
    ('produce-video-audio', 'Music & sound design', 'music-sound-design', null, 6),
    ('produce-video-audio', 'Podcast production', 'podcast-production', null, 7),
    ('build-software', 'Code completion & pair programming', 'code-completion-pair-programming', null, 1),
    ('build-software', 'Generate full apps & sites', 'generate-full-apps-sites', null, 2),
    ('build-software', 'Build without code', 'build-without-code', null, 3),
    ('build-software', 'Debug & code review', 'debug-code-review', null, 4),
    ('build-software', 'Test & QA automation', 'test-qa-automation', null, 5),
    ('build-software', 'Deploy & monitor', 'deploy-monitor', null, 6),
    ('build-ai-agents', 'Build chatbots', 'build-chatbots', null, 1),
    ('build-ai-agents', 'Build voice agents', 'build-voice-agents', null, 2),
    ('build-ai-agents', 'Build internal copilots', 'build-internal-copilots', null, 3),
    ('build-ai-agents', 'Multi-step agentic workflows', 'multi-step-agentic-workflows', null, 4),
    ('build-ai-agents', 'RAG & knowledge bases', 'rag-knowledge-bases', null, 5),
    ('build-ai-agents', 'Custom GPTs / assistants', 'custom-gpts-assistants', null, 6),
    ('automate-workflows', 'Connect apps', 'connect-apps', null, 1),
    ('automate-workflows', 'Web scraping & data entry', 'web-scraping-data-entry', null, 2),
    ('automate-workflows', 'Document processing & OCR', 'document-processing-ocr', null, 3),
    ('automate-workflows', 'Background jobs & scheduled tasks', 'background-jobs-scheduled-tasks', null, 4),
    ('automate-workflows', 'Custom automation builders', 'custom-automation-builders', null, 5),
    ('grow-audience', 'SEO research & audits', 'seo-research-audits', null, 1),
    ('grow-audience', 'On-page SEO optimization', 'on-page-seo-optimization', null, 2),
    ('grow-audience', 'Content for SEO', 'content-for-seo', null, 3),
    ('grow-audience', 'Social media growth', 'social-media-growth', null, 4),
    ('grow-audience', 'Influencer & community', 'influencer-community', null, 5),
    ('grow-audience', 'Reputation & reviews', 'reputation-reviews', null, 6),
    ('launch-campaigns', 'Email marketing', 'email-marketing', null, 1),
    ('launch-campaigns', 'Paid ads (creative & buying)', 'paid-ads', null, 2),
    ('launch-campaigns', 'Outbound & cold email', 'outbound-cold-email', null, 3),
    ('launch-campaigns', 'Landing pages', 'landing-pages', null, 4),
    ('launch-campaigns', 'A/B testing & CRO', 'a-b-testing-cro', null, 5),
    ('launch-campaigns', 'Funnels & sequences', 'funnels-sequences', null, 6),
    ('sell-close-deals', 'Prospect & enrich leads', 'prospect-enrich-leads', null, 1),
    ('sell-close-deals', 'CRM & pipeline management', 'crm-pipeline-management', null, 2),
    ('sell-close-deals', 'Meeting intelligence', 'meeting-intelligence', null, 3),
    ('sell-close-deals', 'Proposal & quoting', 'proposal-quoting', null, 4),
    ('sell-close-deals', 'Revenue intelligence & forecasting', 'revenue-intelligence-forecasting', null, 5),
    ('support-customers', 'AI chatbots & live chat', 'ai-chatbots-live-chat', null, 1),
    ('support-customers', 'Helpdesk & ticketing', 'helpdesk-ticketing', null, 2),
    ('support-customers', 'Voice support agents', 'voice-support-agents', null, 3),
    ('support-customers', 'Knowledge base & self-serve', 'knowledge-base-self-serve', null, 4),
    ('support-customers', 'Feedback, NPS & VoC', 'feedback-nps-voc', null, 5),
    ('analyze-data', 'Dashboards & BI', 'dashboards-bi', null, 1),
    ('analyze-data', 'Spreadsheet AI', 'spreadsheet-ai', null, 2),
    ('analyze-data', 'Forecasting & prediction', 'forecasting-prediction', null, 3),
    ('analyze-data', 'Customer & product analytics', 'customer-product-analytics', null, 4),
    ('analyze-data', 'Document Q&A (chat with PDFs)', 'document-q-a', 'Chat with PDFs and documents.', 5),
    ('research-learn', 'Deep research', 'deep-research', null, 1),
    ('research-learn', 'Summarize papers & docs', 'summarize-papers-docs', null, 2),
    ('research-learn', 'Study & flashcards', 'study-flashcards', null, 3),
    ('research-learn', 'Note-taking & PKM', 'note-taking-pkm', null, 4),
    ('research-learn', 'Tutoring, courses & languages', 'tutoring-courses-languages', null, 5),
    ('plan-collaborate', 'Tasks & project management', 'tasks-project-management', null, 1),
    ('plan-collaborate', 'Docs & wikis', 'docs-wikis', null, 2),
    ('plan-collaborate', 'OKRs & goals', 'okrs-goals', null, 3),
    ('plan-collaborate', 'Personal productivity', 'personal-productivity', null, 4),
    ('plan-collaborate', 'Time & calendar management', 'time-calendar-management', null, 5),
    ('plan-collaborate', 'Meetings & AI notetakers', 'meetings-ai-notetakers', null, 6),
    ('plan-collaborate', 'Async video & internal comms', 'async-video-internal-comms', null, 7),
    ('run-operations', 'Bookkeeping & finance', 'bookkeeping-finance', null, 1),
    ('run-operations', 'Expenses & spend management', 'expenses-spend-management', null, 2),
    ('run-operations', 'Recruit & hire (HR/ATS)', 'recruit-hire', null, 3),
    ('run-operations', 'Legal & contracts', 'legal-contracts', null, 4),
    ('run-operations', 'Admin & executive assistant', 'admin-executive-assistant', null, 5),
    ('run-operations', 'Compliance & risk', 'compliance-risk', null, 6)
)
insert into public.subcategories (outcome_id, name, slug, description, display_order)
select outcomes.id, seed.name, seed.slug, seed.description, seed.display_order
from subcategory_seed seed
join public.outcomes outcomes on outcomes.slug = seed.outcome_slug
on conflict (outcome_id, slug) do update set
  name = excluded.name,
  description = excluded.description,
  display_order = excluded.display_order,
  updated_at = now();
