import "server-only";

import type { Category, Tool } from "@/lib/tool-types";
import { getSupabaseDataClient } from "./server";

type ToolRow = Record<string, unknown>;
type CategoryRow = Record<string, unknown>;

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

function mapCategory(row: CategoryRow): Category {
  return {
    id: asString(row.id),
    name: asString(row.name),
    slug: asString(row.slug),
    description: asOptionalString(row.description),
    icon: asOptionalString(row.icon),
    displayOrder: asNumber(row.display_order),
  };
}

function mapTool(
  row: ToolRow,
  categoryIds: string[],
  affiliateSummary?: {
    affiliateLink?: string;
    affiliateStatus?: string;
    dealActive?: boolean;
    promo?: string;
    dealDescription?: string;
    dealRank?: number;
  },
): Tool {
  return {
    id: asString(row.id),
    name: asString(row.name),
    slug: asString(row.slug),
    shortDescription: asString(row.short_description),
    fullDescription: asString(row.full_description),
    category: categoryIds,
    subcategory: asOptionalString(row.subcategory),
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

async function getToolCategoryMap(toolIds?: string[]) {
  const supabase = getSupabaseDataClient();
  if (!supabase) return new Map<string, string[]>();

  let query = supabase.from("tool_categories").select("tool_id, category_id");
  if (toolIds?.length) query = query.in("tool_id", toolIds);

  const { data } = await query;
  const map = new Map<string, string[]>();

  for (const row of (data ?? []) as Array<{ tool_id: string; category_id: string }>) {
    const current = map.get(row.tool_id) ?? [];
    current.push(row.category_id);
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
  const [categoryMap, affiliateMap] = await Promise.all([
    getToolCategoryMap(toolIds),
    getAffiliateSummaryMap(toolIds),
  ]);

  return rows.map((row) => {
    const id = asString(row.id);
    return mapTool(row, categoryMap.get(id) ?? [], affiliateMap.get(id));
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
  const [categoryMap, affiliateMap] = await Promise.all([
    getToolCategoryMap([id]),
    getAffiliateSummaryMap([id]),
  ]);

  return mapTool(data as ToolRow, categoryMap.get(id) ?? [], affiliateMap.get(id));
}

export async function fetchToolsByCategoryFromSupabase(categorySlug: string): Promise<Tool[]> {
  const supabase = getSupabaseDataClient();
  if (!supabase) return [];

  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .maybeSingle();

  if (categoryError) throw new Error(`Supabase category fetch failed: ${categoryError.message}`);
  if (!category) return [];

  const { data: links, error: linkError } = await supabase
    .from("tool_categories")
    .select("tool_id")
    .eq("category_id", (category as { id: string }).id);

  if (linkError) throw new Error(`Supabase category tools fetch failed: ${linkError.message}`);

  const toolIds = ((links ?? []) as Array<{ tool_id: string }>).map((link) => link.tool_id);
  if (toolIds.length === 0) return [];

  const { data: tools, error: toolsError } = await supabase
    .from("tools")
    .select("*")
    .in("id", toolIds)
    .eq("status", "active")
    .order("name", { ascending: true });

  if (toolsError) throw new Error(`Supabase tools by category fetch failed: ${toolsError.message}`);

  const [categoryMap, affiliateMap] = await Promise.all([
    getToolCategoryMap(toolIds),
    getAffiliateSummaryMap(toolIds),
  ]);

  return ((tools ?? []) as ToolRow[]).map((row) => {
    const id = asString(row.id);
    return mapTool(row, categoryMap.get(id) ?? [], affiliateMap.get(id));
  });
}

export async function fetchAllCategoriesFromSupabase(): Promise<Category[]> {
  const supabase = getSupabaseDataClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true, nullsFirst: false });

  if (error) throw new Error(`Supabase categories fetch failed: ${error.message}`);
  return ((data ?? []) as CategoryRow[]).map(mapCategory);
}
