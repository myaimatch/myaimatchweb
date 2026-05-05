-- Post-Airtable-decommission improvements
-- A) Lock down is_admin()
-- B) Add indexes on FKs
-- C) Consolidate duplicate RLS SELECT policies
-- D) Add tools.last_enriched_at, featured_priority, search_tsv

-- ─── A) Security: revoke is_admin() from public roles ─────────────────────────
revoke execute on function public.is_admin() from public, anon, authenticated;

-- ─── B) Performance: index 15 unindexed FKs ───────────────────────────────────
create index if not exists affiliate_links_program_idx        on public.affiliate_links(affiliate_program_id);
create index if not exists affiliate_programs_tool_idx        on public.affiliate_programs(tool_id);
create index if not exists agent_findings_tool_idx            on public.agent_findings(tool_id);
create index if not exists assessment_recs_assessment_idx     on public.assessment_recommendations(assessment_id);
create index if not exists assessment_recs_tool_idx           on public.assessment_recommendations(tool_id);
create index if not exists assessment_recs_link_idx           on public.assessment_recommendations(affiliate_link_id);
create index if not exists assessment_recs_deal_idx           on public.assessment_recommendations(deal_id);
create index if not exists assessments_lead_idx               on public.assessments(lead_id);
create index if not exists click_events_link_idx              on public.click_events(affiliate_link_id);
create index if not exists click_events_deal_idx              on public.click_events(deal_id);
create index if not exists click_events_rec_idx               on public.click_events(assessment_recommendation_id);
create index if not exists deals_link_idx                     on public.deals(affiliate_link_id);
create index if not exists revenue_link_idx                   on public.revenue_events(affiliate_link_id);
create index if not exists revenue_program_idx                on public.revenue_events(affiliate_program_id);
create index if not exists revenue_tool_idx                   on public.revenue_events(tool_id);

-- ─── C) Consolidate duplicate RLS SELECT policies ─────────────────────────────
-- tools
drop policy if exists "admins manage tools"            on public.tools;
drop policy if exists "public can read active tools"   on public.tools;
create policy "tools_select" on public.tools for select
  using (status = 'active' or public.is_admin());
create policy "tools_write"  on public.tools for all
  using (public.is_admin()) with check (public.is_admin());

-- categories
drop policy if exists "admins manage categories"          on public.categories;
drop policy if exists "public can read active categories" on public.categories;
create policy "categories_select" on public.categories for select using (true);
create policy "categories_write"  on public.categories for all
  using (public.is_admin()) with check (public.is_admin());

-- tool_categories
drop policy if exists "admins manage tool categories"          on public.tool_categories;
drop policy if exists "public can read active tool categories" on public.tool_categories;
create policy "tool_categories_select" on public.tool_categories for select using (true);
create policy "tool_categories_write"  on public.tool_categories for all
  using (public.is_admin()) with check (public.is_admin());

-- affiliate_links
drop policy if exists "admins manage affiliate links"            on public.affiliate_links;
drop policy if exists "public can read approved affiliate links" on public.affiliate_links;
create policy "affiliate_links_select" on public.affiliate_links for select
  using ((status = 'active' and approved_at is not null) or public.is_admin());
create policy "affiliate_links_write"  on public.affiliate_links for all
  using (public.is_admin()) with check (public.is_admin());

-- deals
drop policy if exists "admins manage deals"          on public.deals;
drop policy if exists "public can read active deals" on public.deals;
create policy "deals_select" on public.deals for select
  using (status = 'active' or public.is_admin());
create policy "deals_write"  on public.deals for all
  using (public.is_admin()) with check (public.is_admin());

-- ─── D) New tools columns ─────────────────────────────────────────────────────
alter table public.tools
  add column if not exists last_enriched_at  timestamptz,
  add column if not exists featured_priority int default 0;

-- search_tsv (full-text search on name + descriptions + best_for)
alter table public.tools
  add column if not exists search_tsv tsvector
    generated always as (
      to_tsvector('english',
        coalesce(name, '') || ' ' ||
        coalesce(short_description, '') || ' ' ||
        coalesce(full_description, '') || ' ' ||
        coalesce(best_for, ''))
    ) stored;

create index if not exists tools_search_tsv_idx on public.tools using gin(search_tsv);
create index if not exists tools_featured_idx
  on public.tools(featured_priority desc)
  where status = 'active';
