import { buildGoHref } from "./affiliate-links";

export interface ParsedRecommendation {
  tool_name: string;
  use_case?: string;
  why_it_fits: string;
  setup_priority?: number;
  notes: string;
}

export interface ParsedAnthropicResponse {
  summary: string;
  recommended_stack: ParsedRecommendation[];
  services_cta?: string;
}

export interface ToolNameCandidate {
  id: string;
  name: string;
  slug: string;
  websiteUrl: string;
}

export interface FlattenedRecommendation {
  toolName: string;
  useCase?: string;
  why: string;
  notes: string;
  url: string;
  promo?: string | null;
  hasAffiliate: boolean;
}

export interface FlattenAssessmentInput {
  firstName?: string;
  parsed: ParsedAnthropicResponse;
  recommendations: FlattenedRecommendation[];
}

export type KlaviyoAssessmentProperties = Record<string, string>;

function stripCodeFence(value: string) {
  return value
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function normalizeName(value: string) {
  return value
    .toLowerCase()
    .replace(/\b(ai|app|software|platform|tool)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function parseAnthropicResponse(rawJson: string): ParsedAnthropicResponse {
  try {
    const data = JSON.parse(stripCodeFence(rawJson)) as Record<string, unknown>;
    const summary = asString(data.summary);
    const recommendedStack = Array.isArray(data.recommended_stack) ? data.recommended_stack : [];

    if (!summary || recommendedStack.length === 0) {
      throw new Error("Anthropic response is missing summary or recommended_stack");
    }

    return {
      summary,
      services_cta: asString(data.services_cta) || undefined,
      recommended_stack: recommendedStack
        .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
        .slice(0, 5)
        .map((item, index) => ({
          tool_name: asString(item.tool_name),
          use_case: asString(item.use_case) || undefined,
          why_it_fits: asString(item.why_it_fits),
          setup_priority:
            typeof item.setup_priority === "number" && Number.isFinite(item.setup_priority)
              ? item.setup_priority
              : index + 1,
          notes: asString(item.notes),
        }))
        .filter((item) => item.tool_name && item.why_it_fits && item.notes),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown parse error";
    throw new Error(`Anthropic response was not valid JSON: ${message}`);
  }
}

export function matchToolByName(toolName: string, candidates: ToolNameCandidate[]) {
  const normalizedToolName = normalizeName(toolName);
  if (!normalizedToolName) return null;

  const exact = candidates.find((candidate) => normalizeName(candidate.name) === normalizedToolName);
  if (exact) return exact;

  return (
    candidates.find((candidate) => {
      const candidateName = normalizeName(candidate.name);
      return normalizedToolName.includes(candidateName) || candidateName.includes(normalizedToolName);
    }) ?? null
  );
}

export function flattenAssessmentForKlaviyo(input: FlattenAssessmentInput): KlaviyoAssessmentProperties {
  const output: KlaviyoAssessmentProperties = {
    first_name: input.firstName ?? "",
    summary: input.parsed.summary,
    services_cta:
      input.parsed.services_cta ??
      "If you would rather have us handle the setup, we can build and connect these tools for you.",
  };

  for (let index = 1; index <= 5; index++) {
    output[`tool_${index}_name`] = "";
    output[`tool_${index}_use_case`] = "";
    output[`tool_${index}_why`] = "";
    output[`tool_${index}_notes`] = "";
    output[`tool_${index}_url`] = "";
    output[`tool_${index}_promo`] = "";
    output[`tool_${index}_has_affiliate`] = "false";
  }

  input.recommendations.slice(0, 5).forEach((recommendation, index) => {
    const key = index + 1;
    output[`tool_${key}_name`] = recommendation.toolName;
    output[`tool_${key}_use_case`] = recommendation.useCase ?? "";
    output[`tool_${key}_why`] = recommendation.why;
    output[`tool_${key}_notes`] = recommendation.notes;
    output[`tool_${key}_url`] = recommendation.url || buildGoHref(recommendation.toolName, "assessment_email");
    output[`tool_${key}_promo`] = recommendation.promo ?? "";
    output[`tool_${key}_has_affiliate`] = recommendation.hasAffiliate ? "true" : "false";
  });

  return output;
}
