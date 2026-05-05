import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const expectedSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdminClient();
  const { data: tools, error } = await supabase
    .from("tools")
    .select("id, name, website_url")
    .eq("status", "active")
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const findings = ((tools ?? []) as Array<{ id: string; name: string; website_url: string }>)
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

  return NextResponse.json({ queued_findings: findings.length });
}
