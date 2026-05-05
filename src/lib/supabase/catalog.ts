import "server-only";

import type {
  Category,
  Outcome,
  Subcategory,
  Tool,
  ToolOutcomeRef,
  ToolSubcategoryRef,
} from "@/lib/tool-types";
import { slugifyTaxonomyLabel } from "@/lib/outcome-taxonomy";
import { getSupabaseDataClient } from "./server";

type ToolRow = Record<string, unknown>;
type OutcomeRow = Record<string, unknown>;
type SubcategoryRow = Record<string, unknown>;

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asOptionalString(value: unknown) {
  const parsed = asString(value).trim();
  return parsed || undefined;
}

function asNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function asBoolean(value: unknown) {
  return typeof value === "boolean" ? value : undefined;
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) return undefined;
  const values = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  return values.length ? values : undefined;
}

function mapOutcome(row: OutcomeRow): Outcome {
  return {
    id: asString(row.id),
    name: asString(row.name),
    slug: asString(row.slug),
    description: asOptionalString(row.description),
    icon: asOptionalString(row.icon),
    displayOrder: asNumber(row.display_order),
  };
}

function mapSubcategory(row: SubcategoryRow): Subcategory {
  return {
    id: asString(row.id),
    outcomeId: asString(row.outcome_id),
    name: asString(row.name),
    slug: asString(row.slug),
    description: asOptionalString(row.description),
    displayOrder: asNumber(row.display_order),
  };
}

function normalizeOutcomeRefs(outcomes: ToolOutcomeRef[]) {
  if (outcomes.some((outcome) => outcome.isPrimary)) return outcomes;
  if (outcomes.length === 0) return outcomes;
  return outcomes.map((outcome, index) => ({ ...outcome, isPrimary: index === 0 }));
}

function legacySubcategoryRef(value: string | undefined, outcomeId: string | undefined): ToolSubcategoryRef[] {
  if (!value) return [];
  return [{
    id: `legacy:${value}`,
    name: value,
    slug: slugifyTaxonomyLabel(value),
    outcomeId: outcomeId ?? "",
  }];
}

function mapTool(
  row: ToolRow,
  outcomeRefs: ToolOutcomeRef[],
  subcategoryRefs: ToolSubcategoryRef[],
  affiliateSummary?: {
    affiliateLink?: string;
    affiliateStatus?: string;
    dealActive?: boolean;
    promo?: string;
    dealDescription?: string;
    dealRank?: number;
  },
): Tool {
  const outcomes = normalizeOutcomeRefs(outcomeRefs);
  const primaryOutcomeId = outcomes.find((outcome) => outcome.isPrimary)?.id ?? outcomes[0]?.id;
  const legacySubcategory = asOptionalString(row.subcategory);
  const subcategories = subcategoryRefs.length ? subcategoryRefs : legacySubcategoryRef(legacySubcategory, primaryOutcomeId);

  return {
    id: asString(row.id),
    name: asString(row.name),
    slug: asString(row.slug),
    shortDescription: asString(row.short_description),
    fullDescription: asString(row.full_description),
    outcomes,
    primaryOutcomeId,
    subcategories,
    category: outcomes.map((outcome) => outcome.id),
    subcategory: subcategories[0]?.name ?? legacySubcategory,
    websiteUrl: asString(row.website_url),
    affiliateLink: affiliateSummary?.affiliateLink,
    affiliateStatus: affiliateSummary?.affiliateStatus,
    logoUrl: asOptionalString(row.logo_url),
    pricingSummary: asOptionalString(row.pricing_summary),
    communityReputation: asNumber(row.community_reputation),
    featured: asBoolean(row.featured) ?? false,
    dealActive: affiliateSummary?.dealActive ?? false,
    promo: affiliateSummary?.promo,
    dealDescription: affiliateSummary?.dealDescription,
    dealRank: affiliateSummary?.dealRank,
    supportLanguages: asStringArray(row.support_languages),
    uiLanguages: asStringArray(row.ui_languages),
    foundedYear: asNumber(row.founded_year),
    hasFreePlan: asBoolean(row.has_free_plan),
    trialDays: asNumber(row.trial_days),
    bestFor: asOptionalString(row.best_for),
    hasApi: asBoolean(row.has_api),
    integrations: asStringArray(row.integrations),
    companyHq: asOptionalString(row.company_hq),
    employeeCount: asOptionalString(row.employee_count),
    gdprCompliant: asBoolean(row.gdpr_compliant),
    hasMobileApp: asBoolean(row.has_mobile_app),
    soc2Certified: asBoolean(row.soc2_certified),
    minMonthlyPrice: asNumber(row.min_monthly_price),
    maxMonthlyPrice: asNumber(row.max_monthly_price),
  };
}

async function getToolOutcomeMap(toolIds?: string[]) {
  const supabase = getSupabaseDataClient();
  if (!supabase) return new Map<string, ToolOutcomeRef[]>();

  let query = supabase.from("tool_outcomes").select("tool_id, outcome_id, is_primary");
  if (toolIds?.length) query = query.in("tool_id", toolIds);

  const { data, error } = await query;
  const map = new Map<string, ToolOutcomeRef[]>();

  if (!error) {
    for (const row of (data ?? []) as Array<{ tool_id: string; outcome_id: string; is_primary?: boolean }>) {
      const current = map.get(row.tool_id) ?? [];
      current.push({ id: row.outcome_id, isPrimary: row.is_primary ?? false });
      map.set(row.tool_id, current);
    }
    return map;
  }

  let legacyQuery = supabase.from("tool_categories").select("tool_id, category_id");
  if (toolIds?.length) legacyQuery = legacyQuery.in("tool_id", toolIds);
  const { data: legacyData } = await legacyQuery;

  for (const row of (legacyData ?? []) as Array<{ tool_id: string; category_id: string }>) {
    const current = map.get(row.tool_id) ?? [];
    current.push({ id: row.category_id, isPrimary: current.length === 0 });
    map.set(row.tool_id, current);
  }

  return map;
}

async function getToolSubcategoryMap(toolIds?: string[]) {
  const supabase = getSupabaseDataClient();
  const map = new Map<string, ToolSubcategoryRef[]>();
  if (!supabase) return map;

  let query = supabase.from("tool_subcategories").select("tool_id, subcategory_id");
  if (toolIds?.length) query = query.in("tool_id", toolIds);

  const { data: links, error } = await query;
  if (error || !links?.length) return map;

  const subcategoryIds = Array.from(new Set((links as Array<{ subcategory_id: string }>).map((row) => row.subcategory_id)));
  const { data: subcategories, error: subcategoryError } = await supabase
    .from("subcategories")
    .select("id, outcome_id, name, slug")
    .in("id", subcategoryIds);

  if (subcategoryError) return map;

  const subcategoryById = new Map(
    ((subcategories ?? []) as Array<{ id: string; outcome_id: string; name: string; slug: string }>).map((row) => [
      row.id,
      {
        id: row.id,
        outcomeId: row.outcome_id,
        name: row.name,
        slug: row.slug,
      },
    ]),
  );

  for (const row of links as Array<{ tool_id: string; subcategory_id: string }>) {
    const subcategory = subcategoryById.get(row.subcategory_id);
    if (!subcategory) continue;
    const current = map.get(row.tool_id) ?? [];
    current.push(subcategory);
    map.set(row.tool_id, current);
  }

  return map;
}

async function getAffiliateSummaryMap(toolIds: string[]) {
  const supabase = getSupabaseDataClient();
  const map = new Map<string, {
    affiliateLink?: string;
    affiliateStatus?: string;
    dealActive?: boolean;
    promo?: string;
    dealDescription?: string;
    dealRank?: number;
  }>();

  if (!supabase || toolIds.length === 0) return map;

  const [{ data: links }, { data: deals }] = await Promise.all([
    supabase
      .from("affiliate_links")
      .select("tool_id, url, status, priority")
      .in("tool_id", toolIds)
      .eq("status", "active")
      .order("priority", { ascending: true }),
    supabase
      .from("deals")
      .select("tool_id, promo_code, description, rank, status")
      .in("tool_id", toolIds)
      .eq("status", "active")
      .order("rank", { ascending: true }),
  ]);

  for (const row of (links ?? []) as Array<{ tool_id: string; url: string; status: string }>) {
    if (!map.has(row.tool_id)) {
      map.set(row.tool_id, {
        affiliateLink: row.url,
        affiliateStatus: row.status,
        dealActive: false,
      });
    }
  }

  for (const row of (deals ?? []) as Array<{ tool_id: string; promo_code?: string; description?: string; rank?: number }>) {
    const current = map.get(row.tool_id) ?? {};
    if (!current.dealActive) {
      map.set(row.tool_id, {
        ...current,
        dealActive: true,
        promo: row.promo_code,
        dealDescription: row.description,
        dealRank: row.rank,
      });
    }
  }

  return map;
}

export async function fetchAllToolsFromSupabase(): Promise<Tool[]> {
  const supabase = getSupabaseDataClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .eq("status", "active")
    .order("name", { ascending: true });

  if (error) throw new Error(`Supabase tools fetch failed: ${error.message}`);

  const rows = (data ?? []) as ToolRow[];
  const toolIds = rows.map((row) => asString(row.id)).filter(Boolean);
  const [outcomeMap, subcategoryMap, affiliateMap] = await Promise.all([
    getToolOutcomeMap(toolIds),
    getToolSubcategoryMap(toolIds),
    getAffiliateSummaryMap(toolIds),
  ]);

  return rows.map((row) => {
    const id = asString(row.id);
    return mapTool(row, outcomeMap.get(id) ?? [], subcategoryMap.get(id) ?? [], affiliateMap.get(id));
  });
}

export async function fetchToolBySlugFromSupabase(slug: string): Promise<Tool | null> {
  const supabase = getSupabaseDataClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error) throw new Error(`Supabase tool fetch failed: ${error.message}`);
  if (!data) return null;

  const id = asString((data as ToolRow).id);
  const [outcomeMap, subcategoryMap, affiliateMap] = await Promise.all([
    getToolOutcomeMap([id]),
    getToolSubcategoryMap([id]),
    getAffiliateSummaryMap([id]),
  ]);

  return mapTool(data as ToolRow, outcomeMap.get(id) ?? [], subcategoryMap.get(id) ?? [], affiliateMap.get(id));
}

async function fetchDirectoryGroupId(slug: string) {
  const supabase = getSupabaseDataClient();
  if (!supabase) return null;

  const { data: outcome, error } = await supabase
    .from("outcomes")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (!error && outcome) return { id: (outcome as { id: string }).id, table: "tool_outcomes" as const };

  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (categoryError) throw new Error(`Supabase outcome/category fetch failed: ${categoryError.message}`);
  if (!category) return null;
  return { id: (category as { id: string }).id, table: "tool_categories" as const };
}

export async function fetchToolsByOutcomeFromSupabase(outcomeSlug: string): Promise<Tool[]> {
  const supabase = getSupabaseDataClient();
  if (!supabase) return [];

  const group = await fetchDirectoryGroupId(outcomeSlug);
  if (!group) return [];

  const linkQuery = group.table === "tool_outcomes"
    ? supabase.from("tool_outcomes").select("tool_id").eq("outcome_id", group.id)
    : supabase.from("tool_categories").select("tool_id").eq("category_id", group.id);

  const { data: links, error: linkError } = await linkQuery;
  if (linkError) throw new Error(`Supabase outcome tools fetch failed: ${linkError.message}`);

  const toolIds = ((links ?? []) as Array<{ tool_id: string }>).map((link) => link.tool_id);
  if (toolIds.length === 0) return [];

  const { data: tools, error: toolsError } = await supabase
    .from("tools")
    .select("*")
    .in("id", toolIds)
    .eq("status", "active")
    .order("name", { ascending: true });

  if (toolsError) throw new Error(`Supabase tools by outcome fetch failed: ${toolsError.message}`);

  const [outcomeMap, subcategoryMap, affiliateMap] = await Promise.all([
    getToolOutcomeMap(toolIds),
    getToolSubcategoryMap(toolIds),
    getAffiliateSummaryMap(toolIds),
  ]);

  return ((tools ?? []) as ToolRow[]).map((row) => {
    const id = asString(row.id);
    return mapTool(row, outcomeMap.get(id) ?? [], subcategoryMap.get(id) ?? [], affiliateMap.get(id));
  });
}

export async function fetchAllOutcomesFromSupabase(): Promise<Outcome[]> {
  const supabase = getSupabaseDataClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("outcomes")
    .select("*")
    .order("display_order", { ascending: true, nullsFirst: false });

  if (!error) return ((data ?? []) as OutcomeRow[]).map(mapOutcome);

  const { data: categories, error: categoryError } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true, nullsFirst: false });

  if (categoryError) throw new Error(`Supabase outcomes/categories fetch failed: ${categoryError.message}`);
  return ((categories ?? []) as OutcomeRow[]).map(mapOutcome);
}

export async function fetchAllSubcategoriesFromSupabase(): Promise<Subcategory[]> {
  const supabase = getSupabaseDataClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("subcategories")
    .select("*")
    .order("display_order", { ascending: true, nullsFirst: false });

  if (error) return [];
  return ((data ?? []) as SubcategoryRow[]).map(mapSubcategory);
}

export async function fetchToolsByCategoryFromSupabase(categorySlug: string): Promise<Tool[]> {
  return fetchToolsByOutcomeFromSupabase(categorySlug);
}

export async function fetchAllCategoriesFromSupabase(): Promise<Category[]> {
  return fetchAllOutcomesFromSupabase();
}
