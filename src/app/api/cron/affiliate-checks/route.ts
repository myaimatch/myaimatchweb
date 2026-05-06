import { NextRequest, NextResponse } from "next/server";
import { buildGoHref } from "@/lib/affiliate-links";
import { verifyLinkTarget } from "@/lib/affiliate-link-checker";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const expectedSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdminClient();
  const limit = Math.min(Number(request.nextUrl.searchParams.get("limit") || 10), 25);
  const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const { data: tools, error } = await supabase
    .from("tools")
    .select("id, name, slug, website_url")
    .eq("status", "active")
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const typedTools = ((tools ?? []) as Array<{ id: string; name: string; slug: string; website_url: string }>)
    .filter((tool) => tool.website_url);
  const toolIds = typedTools.map((tool) => tool.id);

  const [{ data: affiliateLinks, error: linksError }, { data: deals, error: dealsError }] = await Promise.all([
    toolIds.length
      ? supabase
          .from("affiliate_links")
          .select("id, tool_id, url, status")
          .in("tool_id", toolIds)
          .in("status", ["active", "approved"])
      : Promise.resolve({ data: [], error: null }),
    toolIds.length
      ? supabase
          .from("deals")
          .select("id, tool_id, url, status")
          .in("tool_id", toolIds)
          .eq("status", "active")
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (linksError) return NextResponse.json({ error: linksError.message }, { status: 500 });
  if (dealsError) return NextResponse.json({ error: dealsError.message }, { status: 500 });

  const checks: Array<{
    entityType: "tool_website" | "go_route" | "affiliate_link" | "deal";
    entityId?: string;
    toolId: string;
    url: string;
  }> = [];

  for (const tool of typedTools) {
    checks.push({
      entityType: "tool_website",
      entityId: tool.id,
      toolId: tool.id,
      url: tool.website_url,
    });
    checks.push({
      entityType: "go_route",
      entityId: tool.id,
      toolId: tool.id,
      url: new URL(buildGoHref(tool.slug, "link_check"), siteOrigin).toString(),
    });
  }

  for (const link of (affiliateLinks ?? []) as Array<{ id: string; tool_id: string; url: string }>) {
    if (!link.url) continue;
    checks.push({
      entityType: "affiliate_link",
      entityId: link.id,
      toolId: link.tool_id,
      url: link.url,
    });
  }

  for (const deal of (deals ?? []) as Array<{ id: string; tool_id: string; url: string | null }>) {
    if (!deal.url) continue;
    checks.push({
      entityType: "deal",
      entityId: deal.id,
      toolId: deal.tool_id,
      url: deal.url,
    });
  }

  let verified = 0;
  let broken = 0;
  async function runCheck(check: (typeof checks)[number]) {
    const result = await verifyLinkTarget(check.url, { maxRedirects: 6, timeoutMs: 12000 });
    if (result.ok) verified += 1;
    else broken += 1;

    await supabase.from("link_verification_results").insert({
      entity_type: check.entityType,
      entity_id: check.entityId,
      tool_id: check.toolId,
      input_url: result.inputUrl,
      ok: result.ok,
      status_code: result.statusCode,
      final_url: result.finalUrl,
      redirect_chain: result.redirectChain,
      latency_ms: result.latencyMs,
      error: result.error,
      checked_at: result.checkedAt,
    });

    if (check.entityType === "tool_website") {
      await supabase.from("tools").update({
        website_last_verified_at: result.checkedAt,
        website_verification_status: result.ok ? "ok" : "failed",
        website_final_url: result.finalUrl,
      }).eq("id", check.toolId);
    }

    if (check.entityType === "affiliate_link" && check.entityId) {
      await supabase.from("affiliate_links").update({
        last_verified_at: result.checkedAt,
        verification_status: result.ok ? "ok" : "failed",
        final_url: result.finalUrl,
        verification_error: result.error,
      }).eq("id", check.entityId);
    }

    if (check.entityType === "deal" && check.entityId) {
      await supabase.from("deals").update({
        last_verified_at: result.checkedAt,
        verification_status: result.ok ? "ok" : "failed",
        final_url: result.finalUrl,
        verification_error: result.error,
      }).eq("id", check.entityId);
    }
  }

  for (let index = 0; index < checks.length; index += 4) {
    await Promise.all(checks.slice(index, index + 4).map(runCheck));
  }

  const findings = typedTools
    .filter((tool) => tool.website_url)
    .map((tool) => ({
      tool_id: tool.id,
      finding_type: "affiliate_program_review",
      status: "pending_review",
      summary: `Review affiliate program availability and active promo codes for ${tool.name}.`,
      proposed_fields: {
        website_url: tool.website_url,
        automation_policy: "human_approval_required",
      },
      evidence: [],
    }));

  if (findings.length > 0) {
    const { error: insertError } = await supabase.from("agent_findings").insert(findings);
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  }

  return NextResponse.json({
    queued_findings: findings.length,
    verified_links: verified,
    broken_links: broken,
  });
}
