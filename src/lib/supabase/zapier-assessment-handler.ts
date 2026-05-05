import "server-only";

import { randomUUID } from "node:crypto";
import { buildGoHref } from "@/lib/affiliate-links";
import {
  flattenAssessmentForKlaviyo,
  matchToolByName,
  parseAnthropicResponse,
  type FlattenedRecommendation,
} from "@/lib/zapier-assessment";
import { fetchAllToolsFromSupabase } from "./catalog";
import { resolveAffiliateDestinationForTool } from "./affiliate-resolver";
import { getSupabaseAdminClient } from "./server";

type ZapierPayload = Record<string, unknown>;

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function firstNonEmpty(...values: unknown[]) {
  for (const value of values) {
    const parsed = asString(value);
    if (parsed) return parsed;
  }
  return "";
}

function firstNameFromPayload(payload: ZapierPayload) {
  const explicit = firstNonEmpty(payload.first_name, payload.firstName);
  if (explicit) return explicit;
  const fullName = firstNonEmpty(payload.name, payload.full_name, payload.fullName);
  return fullName.split(/\s+/)[0] ?? "";
}

function getRawAnthropicJson(payload: ZapierPayload) {
  return firstNonEmpty(
    payload.raw_json,
    payload.anthropic_response,
    payload.response_content_text,
    payload.assessment_result,
  );
}

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://myaimatch.ai").replace(/\/$/, "");
}

export async function handleZapierAssessmentCompleted(payload: ZapierPayload) {
  const supabase = getSupabaseAdminClient();
  const email = firstNonEmpty(payload.email, payload.Email);
  const fullName = firstNonEmpty(payload.name, payload.full_name, payload.Name);
  const firstName = firstNameFromPayload(payload);
  const rawAnthropicJson = getRawAnthropicJson(payload);

  if (!email) throw new Error("Zapier payload missing email");
  if (!rawAnthropicJson) throw new Error("Zapier payload missing Anthropic response");

  const parsed = parseAnthropicResponse(rawAnthropicJson);

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .upsert(
      {
        email,
        first_name: firstName,
        full_name: fullName,
        business_type: firstNonEmpty(payload.business_type, payload.businessType),
        team_size: firstNonEmpty(payload.team_size, payload.teamSize),
        status: "assessment_completed",
        raw_payload: payload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" },
    )
    .select("id")
    .single();

  if (leadError) throw new Error(`Lead upsert failed: ${leadError.message}`);

  const { data: assessment, error: assessmentError } = await supabase
    .from("assessments")
    .insert({
      lead_id: (lead as { id: string }).id,
      email,
      role: firstNonEmpty(payload.role, payload.Role),
      business_type: firstNonEmpty(payload.business_type, payload.businessType),
      team_size: firstNonEmpty(payload.team_size, payload.teamSize),
      main_workflow_to_improve: firstNonEmpty(
        payload.main_workflow_to_improve,
        payload.mainWorkflowToImprove,
      ),
      current_tools: firstNonEmpty(payload.current_tools, payload.currentTools),
      ai_experience_level: firstNonEmpty(payload.ai_experience_level, payload.aiExperienceLevel),
      summary: parsed.summary,
      services_cta: parsed.services_cta,
      raw_anthropic_response: parsed,
      raw_typeform_payload: payload,
      status: "completed",
    })
    .select("id")
    .single();

  if (assessmentError) throw new Error(`Assessment insert failed: ${assessmentError.message}`);

  const assessmentId = (assessment as { id: string }).id;
  const tools = await fetchAllToolsFromSupabase();
  const recommendations: FlattenedRecommendation[] = [];
  const rows = [];

  for (let index = 0; index < parsed.recommended_stack.length; index += 1) {
    const recommendation = parsed.recommended_stack[index];
    const recommendationId = randomUUID();
    const matchedTool = matchToolByName(recommendation.tool_name, tools);
    let resolvedUrl = "";
    let affiliateLinkId: string | null = null;
    let dealId: string | null = null;
    let hasAffiliate = false;
    let promoCode: string | null = null;

    if (matchedTool) {
      const resolved = await resolveAffiliateDestinationForTool(
        {
          id: matchedTool.id,
          slug: matchedTool.slug,
          name: matchedTool.name,
          websiteUrl: matchedTool.websiteUrl,
        },
        "assessment_email",
      );

      resolvedUrl = `${siteUrl()}${buildGoHref(matchedTool.slug, "assessment_email", recommendationId)}`;
      affiliateLinkId = resolved.resolution.linkId;
      dealId = resolved.resolution.dealId;
      hasAffiliate = resolved.resolution.hasAffiliate;
      promoCode = resolved.resolution.promoCode;
    } else {
      resolvedUrl = `${siteUrl()}/#match-tools`;
    }

    rows.push({
      id: recommendationId,
      assessment_id: assessmentId,
      tool_id: matchedTool?.id ?? null,
      tool_name: recommendation.tool_name,
      use_case: recommendation.use_case ?? "",
      why_it_fits: recommendation.why_it_fits,
      notes: recommendation.notes,
      setup_priority: recommendation.setup_priority ?? index + 1,
      resolved_url: resolvedUrl,
      affiliate_link_id: affiliateLinkId,
      deal_id: dealId,
      has_affiliate: hasAffiliate,
      promo_code: promoCode,
    });

    recommendations.push({
      toolName: recommendation.tool_name,
      useCase: recommendation.use_case,
      why: recommendation.why_it_fits,
      notes: recommendation.notes,
      url: resolvedUrl,
      promo: promoCode,
      hasAffiliate,
    });
  }

  if (rows.length > 0) {
    const { error: recommendationsError } = await supabase
      .from("assessment_recommendations")
      .insert(rows);

    if (recommendationsError) {
      throw new Error(`Assessment recommendations insert failed: ${recommendationsError.message}`);
    }
  }

  return {
    assessment_id: assessmentId,
    lead_id: (lead as { id: string }).id,
    properties: flattenAssessmentForKlaviyo({
      firstName,
      parsed,
      recommendations,
    }),
  };
}
