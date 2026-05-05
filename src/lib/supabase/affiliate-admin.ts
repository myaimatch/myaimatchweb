import "server-only";

import { getSupabaseAdminClient, hasSupabaseServiceConfig } from "./server";

export interface AffiliateAdminToolRow {
  id: string;
  name: string;
  slug: string;
  websiteUrl: string;
  programStatus: string;
  activeLinks: number;
  pendingLinks: number;
  activeDeals: number;
  pendingFindings: number;
  clicks30d: number;
  revenueTotal: number;
}

export interface AffiliateAdminOverview {
  configured: boolean;
  stats: {
    tools: number;
    activeLinks: number;
    applyNeeded: number;
    pendingFindings: number;
    activeDeals: number;
    clicks30d: number;
    revenueTotal: number;
  };
  rows: AffiliateAdminToolRow[];
  pendingFindings: Array<{
    id: string;
    toolId: string | null;
    toolName: string;
    findingType: string;
    summary: string;
    createdAt: string;
  }>;
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export async function isAdminEmail(email?: string | null) {
  if (!email || !hasSupabaseServiceConfig()) return false;
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("admin_users")
    .select("email")
    .ilike("email", email)
    .maybeSingle();

  if (error) throw new Error(`Admin lookup failed: ${error.message}`);
  return !!data;
}

export async function fetchAffiliateAdminOverview(): Promise<AffiliateAdminOverview> {
  if (!hasSupabaseServiceConfig()) {
    return {
      configured: false,
      stats: {
        tools: 0,
        activeLinks: 0,
        applyNeeded: 0,
        pendingFindings: 0,
        activeDeals: 0,
        clicks30d: 0,
        revenueTotal: 0,
      },
      rows: [],
      pendingFindings: [],
    };
  }

  const supabase = getSupabaseAdminClient();
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [
    toolsResult,
    programsResult,
    linksResult,
    dealsResult,
    findingsResult,
    clicksResult,
    revenueResult,
  ] = await Promise.all([
    supabase.from("tools").select("id, name, slug, website_url").eq("status", "active").order("name"),
    supabase.from("affiliate_programs").select("tool_id, status"),
    supabase.from("affiliate_links").select("tool_id, status"),
    supabase.from("deals").select("tool_id, status"),
    supabase.from("agent_findings").select("tool_id, status"),
    supabase.from("click_events").select("tool_id").gte("created_at", since30d),
    supabase.from("revenue_events").select("tool_id, amount"),
  ]);

  for (const result of [toolsResult, programsResult, linksResult, dealsResult, findingsResult, clicksResult, revenueResult]) {
    if (result.error) throw new Error(result.error.message);
  }

  const programs = new Map<string, string>();
  for (const row of (programsResult.data ?? []) as Array<{ tool_id: string; status: string }>) {
    if (!programs.has(row.tool_id)) programs.set(row.tool_id, row.status);
  }

  const links = new Map<string, { active: number; pending: number }>();
  for (const row of (linksResult.data ?? []) as Array<{ tool_id: string; status: string }>) {
    const current = links.get(row.tool_id) ?? { active: 0, pending: 0 };
    if (row.status === "active") current.active += 1;
    if (row.status === "pending" || row.status === "needs_review") current.pending += 1;
    links.set(row.tool_id, current);
  }

  const deals = new Map<string, number>();
  for (const row of (dealsResult.data ?? []) as Array<{ tool_id: string; status: string }>) {
    if (row.status === "active") deals.set(row.tool_id, (deals.get(row.tool_id) ?? 0) + 1);
  }

  const findings = new Map<string, number>();
  for (const row of (findingsResult.data ?? []) as Array<{ tool_id: string; status: string }>) {
    if (row.status === "pending_review") findings.set(row.tool_id, (findings.get(row.tool_id) ?? 0) + 1);
  }

  const clicks = new Map<string, number>();
  for (const row of (clicksResult.data ?? []) as Array<{ tool_id: string | null }>) {
    if (row.tool_id) clicks.set(row.tool_id, (clicks.get(row.tool_id) ?? 0) + 1);
  }

  const revenue = new Map<string, number>();
  for (const row of (revenueResult.data ?? []) as Array<{ tool_id: string | null; amount: number }>) {
    if (row.tool_id) revenue.set(row.tool_id, (revenue.get(row.tool_id) ?? 0) + asNumber(row.amount));
  }

  const rows = ((toolsResult.data ?? []) as Array<Record<string, unknown>>).map((tool) => {
    const id = asString(tool.id);
    const linkCounts = links.get(id) ?? { active: 0, pending: 0 };
    return {
      id,
      name: asString(tool.name),
      slug: asString(tool.slug),
      websiteUrl: asString(tool.website_url),
      programStatus: programs.get(id) ?? "apply_needed",
      activeLinks: linkCounts.active,
      pendingLinks: linkCounts.pending,
      activeDeals: deals.get(id) ?? 0,
      pendingFindings: findings.get(id) ?? 0,
      clicks30d: clicks.get(id) ?? 0,
      revenueTotal: revenue.get(id) ?? 0,
    };
  });

  const stats = rows.reduce(
    (acc, row) => {
      acc.tools += 1;
      acc.activeLinks += row.activeLinks;
      if (row.programStatus === "apply_needed" || row.activeLinks === 0) acc.applyNeeded += 1;
      acc.pendingFindings += row.pendingFindings;
      acc.activeDeals += row.activeDeals;
      acc.clicks30d += row.clicks30d;
      acc.revenueTotal += row.revenueTotal;
      return acc;
    },
    {
      tools: 0,
      activeLinks: 0,
      applyNeeded: 0,
      pendingFindings: 0,
      activeDeals: 0,
      clicks30d: 0,
      revenueTotal: 0,
    },
  );

  const toolNameById = new Map(rows.map((row) => [row.id, row.name]));
  const pendingFindings = ((findingsResult.data ?? []) as Array<{
    id: string;
    tool_id: string | null;
    finding_type: string;
    summary: string | null;
    status: string;
    created_at: string;
  }>)
    .filter((finding) => finding.status === "pending_review")
    .slice(0, 12)
    .map((finding) => ({
      id: finding.id,
      toolId: finding.tool_id,
      toolName: finding.tool_id ? toolNameById.get(finding.tool_id) ?? "Unknown tool" : "Unknown tool",
      findingType: finding.finding_type,
      summary: finding.summary ?? "Review proposed affiliate change.",
      createdAt: finding.created_at,
    }));

  return {
    configured: true,
    stats,
    rows,
    pendingFindings,
  };
}
