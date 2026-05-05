import "server-only";

import { createHash } from "node:crypto";
import {
  resolveToolDestination,
  type AffiliateResolution,
  type AffiliateLinkCandidate,
  type DealCandidate,
  type LinkSource,
} from "@/lib/affiliate-links";
import { getSupabaseAdminClient, getSupabaseDataClient } from "./server";

export interface ResolvedAffiliateDestination {
  toolId: string;
  toolSlug: string;
  toolName: string;
  websiteUrl: string;
  resolution: AffiliateResolution;
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function nullableString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null;
}

function nullableNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function mapAffiliateLink(row: Record<string, unknown>): AffiliateLinkCandidate {
  return {
    id: asString(row.id),
    url: asString(row.url),
    status: asString(row.status) as AffiliateLinkCandidate["status"],
    priority: nullableNumber(row.priority),
    approvedAt: nullableString(row.approved_at),
    validFrom: nullableString(row.valid_from),
    validUntil: nullableString(row.valid_until),
  };
}

function mapDeal(row: Record<string, unknown>): DealCandidate {
  return {
    id: asString(row.id),
    affiliateLinkId: nullableString(row.affiliate_link_id),
    url: nullableString(row.url),
    promoCode: nullableString(row.promo_code),
    status: asString(row.status) as DealCandidate["status"],
    activeFrom: nullableString(row.active_from),
    activeUntil: nullableString(row.active_until),
    rank: nullableNumber(row.rank),
  };
}

export async function resolveAffiliateDestinationForTool(
  tool: { id: string; slug: string; name: string; websiteUrl: string },
  source: LinkSource = "directory",
): Promise<ResolvedAffiliateDestination> {
  const supabase = getSupabaseDataClient();

  if (!supabase) {
    return {
      toolId: tool.id,
      toolSlug: tool.slug,
      toolName: tool.name,
      websiteUrl: tool.websiteUrl,
      resolution: resolveToolDestination({
        slug: tool.slug,
        websiteUrl: tool.websiteUrl,
        affiliateLinks: [],
        deals: [],
        source,
      }),
    };
  }

  const [{ data: affiliateLinks, error: linksError }, { data: deals, error: dealsError }] =
    await Promise.all([
      supabase
        .from("affiliate_links")
        .select("id, url, status, priority, approved_at, valid_from, valid_until")
        .eq("tool_id", tool.id)
        .in("status", ["active", "approved"])
        .order("priority", { ascending: true }),
      supabase
        .from("deals")
        .select("id, affiliate_link_id, url, promo_code, status, active_from, active_until, rank")
        .eq("tool_id", tool.id)
        .eq("status", "active")
        .order("rank", { ascending: true }),
    ]);

  if (linksError) throw new Error(`Affiliate links fetch failed: ${linksError.message}`);
  if (dealsError) throw new Error(`Deals fetch failed: ${dealsError.message}`);

  return {
    toolId: tool.id,
    toolSlug: tool.slug,
    toolName: tool.name,
    websiteUrl: tool.websiteUrl,
    resolution: resolveToolDestination({
      slug: tool.slug,
      websiteUrl: tool.websiteUrl,
      affiliateLinks: ((affiliateLinks ?? []) as Record<string, unknown>[]).map(mapAffiliateLink),
      deals: ((deals ?? []) as Record<string, unknown>[]).map(mapDeal),
      source,
    }),
  };
}

export async function resolveAffiliateDestinationForSlug(
  slug: string,
  source: LinkSource = "directory",
): Promise<ResolvedAffiliateDestination | null> {
  const supabase = getSupabaseDataClient();
  if (!supabase) return null;

  const { data: tool, error } = await supabase
    .from("tools")
    .select("id, slug, name, website_url")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error) throw new Error(`Tool lookup failed: ${error.message}`);
  if (!tool) return null;

  const row = tool as Record<string, unknown>;
  return resolveAffiliateDestinationForTool(
    {
      id: asString(row.id),
      slug: asString(row.slug),
      name: asString(row.name),
      websiteUrl: asString(row.website_url),
    },
    source,
  );
}

function hashIp(ip?: string | null) {
  if (!ip) return null;
  const salt = process.env.CLICK_EVENT_HASH_SALT || process.env.SUPABASE_SERVICE_ROLE_KEY || "myaimatch";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export async function logAffiliateClick(input: {
  resolved: ResolvedAffiliateDestination;
  source: LinkSource;
  recommendationId?: string | null;
  referer?: string | null;
  userAgent?: string | null;
  ip?: string | null;
}) {
  const supabase = getSupabaseAdminClient();
  const resolution = input.resolved.resolution;

  await supabase.from("click_events").insert({
    tool_id: input.resolved.toolId,
    affiliate_link_id: resolution.linkId,
    deal_id: resolution.dealId,
    assessment_recommendation_id: input.recommendationId || null,
    source: input.source || "unknown",
    destination_url: resolution.destinationUrl,
    referer: input.referer || null,
    user_agent: input.userAgent || null,
    ip_hash: hashIp(input.ip),
  });
}
