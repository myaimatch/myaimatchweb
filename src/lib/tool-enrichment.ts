import {
  classifyToolForOutcomeMigration,
  validateOutcomeProposal,
  type OutcomeMigrationProposal,
} from "./outcome-migration";

export type EnrichmentProvider =
  | "firecrawl"
  | "cloudflare"
  | "browserbase"
  | "local-fetch";

export type EvidenceSourceType =
  | "homepage"
  | "pricing"
  | "about"
  | "features"
  | "integrations"
  | "security"
  | "docs"
  | "changelog"
  | "blog"
  | "other";

export interface EnrichmentEvidencePage {
  url: string;
  provider: EnrichmentProvider;
  sourceType: EvidenceSourceType;
  fetchedAt: string;
  contentHash: string;
  statusCode?: number;
  title?: string | null;
  excerpt: string;
  markdown: string;
}

export interface NormalizedEnrichmentResult {
  mini_summary: string | null;
  full_description: string | null;
  short_description: string | null;
  pricing_summary: string | null;
  best_for: string | null;
  has_free_plan: boolean | null;
  gdpr_compliant: boolean | null;
  founded_year: number | null;
  employee_count: string | null;
  community_reputation: number | null;
  has_api: boolean | null;
  has_mobile_app: boolean | null;
  soc2_certified: boolean | null;
  trial_days: number | null;
  company_hq: string | null;
  integrations: string[] | null;
  support_languages: string[] | null;
  ui_languages: string[] | null;
  min_monthly_price: number | null;
  max_monthly_price: number | null;
}

export interface EnrichmentValidationInput {
  toolName: string;
  toolSlug: string;
  evidencePages: EnrichmentEvidencePage[];
  normalized: NormalizedEnrichmentResult;
  classification: OutcomeMigrationProposal;
  minPages: number;
}

export interface EnrichmentValidationResult {
  valid: boolean;
  errors: string[];
}

export interface EnrichmentBackupPayload<T extends Record<string, unknown> = Record<string, unknown>> {
  runId: string;
  createdAt: string;
  tools: T[];
}

const ALLOWED_BEST_FOR = new Set(["Solo", "Small Team", "Mid-Market", "Enterprise", "All"]);
const ALLOWED_INTEGRATIONS = new Set([
  "Zapier",
  "Slack",
  "Make",
  "Google Workspace",
  "HubSpot",
  "Notion",
  "Stripe",
  "Other",
]);
const ALLOWED_COMPANY_HQ = new Set(["USA", "EU", "UK", "Canada", "LATAM", "Asia", "Other"]);
const ALLOWED_EMPLOYEE_COUNT = new Set(["1-10", "11-50", "51-200", "200+"]);

function text(value: unknown, maxLen: number) {
  if (typeof value !== "string") return null;
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized ? normalized.slice(0, maxLen) : null;
}

function booleanValue(value: unknown) {
  return typeof value === "boolean" ? value : null;
}

function numberValue(value: unknown, opts: { min?: number; max?: number } = {}) {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  if (opts.min != null && value < opts.min) return null;
  if (opts.max != null && value > opts.max) return null;
  return value;
}

function enumValue(value: unknown, allowed: Set<string>) {
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  return allowed.has(cleaned) ? cleaned : null;
}

function stringArray(value: unknown, allowed?: Set<string>) {
  if (!Array.isArray(value)) return null;
  const cleaned = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, arr) => arr.indexOf(item) === index)
    .filter((item) => !allowed || allowed.has(item));
  return cleaned.length ? cleaned : null;
}

function hasUsefulContent(page: EnrichmentEvidencePage) {
  const content = page.markdown || page.excerpt || "";
  return content.replace(/\s+/g, " ").trim().length >= 40;
}

export function hasMinimumEvidence(pages: EnrichmentEvidencePage[], minPages: number) {
  return pages.filter(hasUsefulContent).length >= minPages;
}

export function normalizeEnrichmentResult(raw: unknown): NormalizedEnrichmentResult {
  const value = raw && typeof raw === "object" ? raw as Record<string, unknown> : {};
  const currentYear = new Date().getFullYear();

  return {
    mini_summary: text(value.mini_summary, 800),
    full_description: text(value.full_description, 3000),
    short_description: text(value.short_description, 160),
    pricing_summary: text(value.pricing_summary, 240),
    best_for: enumValue(value.best_for, ALLOWED_BEST_FOR),
    has_free_plan: booleanValue(value.has_free_plan),
    gdpr_compliant: booleanValue(value.gdpr_compliant),
    founded_year: numberValue(value.founded_year, { min: 1950, max: currentYear + 1 }),
    employee_count: enumValue(value.employee_count, ALLOWED_EMPLOYEE_COUNT),
    community_reputation: numberValue(value.community_reputation, { min: 0, max: 5 }),
    has_api: booleanValue(value.has_api),
    has_mobile_app: booleanValue(value.has_mobile_app),
    soc2_certified: booleanValue(value.soc2_certified),
    trial_days: numberValue(value.trial_days, { min: 0, max: 365 }),
    company_hq: enumValue(value.company_hq, ALLOWED_COMPANY_HQ),
    integrations: stringArray(value.integrations, ALLOWED_INTEGRATIONS),
    support_languages: stringArray(value.support_languages),
    ui_languages: stringArray(value.ui_languages),
    min_monthly_price: numberValue(value.min_monthly_price, { min: 0 }),
    max_monthly_price: numberValue(value.max_monthly_price, { min: 0 }),
  };
}

export function classifyToolFromMiniSummary(input: {
  id?: string;
  name: string;
  slug: string;
  miniSummary: string;
}) {
  return classifyToolForOutcomeMigration({
    id: input.id,
    name: input.name,
    slug: input.slug,
    currentCategories: [],
    currentSubcategory: "",
    shortDescription: input.miniSummary,
    fullDescription: input.miniSummary,
  });
}

export function validateEnrichmentResult(input: EnrichmentValidationInput): EnrichmentValidationResult {
  const errors: string[] = [];

  if (!hasMinimumEvidence(input.evidencePages, input.minPages)) {
    errors.push(`at least ${input.minPages} evidence pages are required`);
  }
  if (!input.normalized.mini_summary) errors.push("mini_summary is required");
  if (!input.normalized.full_description) errors.push("full_description is required");
  if (!input.normalized.short_description) errors.push("short_description is required");

  const classificationValidation = validateOutcomeProposal(input.classification);
  errors.push(...classificationValidation.errors);

  return { valid: errors.length === 0, errors };
}

export function buildEnrichmentBackupPayload<T extends Record<string, unknown>>(
  payload: EnrichmentBackupPayload<T>,
): EnrichmentBackupPayload<T> {
  return payload;
}

export function buildToolUpdatePayload(normalized: NormalizedEnrichmentResult) {
  const update: Record<string, unknown> = {
    last_enriched_at: new Date().toISOString(),
  };

  for (const [key, value] of Object.entries(normalized)) {
    if (key === "mini_summary") continue;
    if (value !== null) update[key] = value;
  }

  if (normalized.mini_summary) update.enrichment_summary = normalized.mini_summary;
  return update;
}

export function extractJsonObject(textValue: string) {
  const codeBlock = textValue.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) return codeBlock[1].trim();
  const objectMatch = textValue.match(/\{[\s\S]*\}/);
  return objectMatch ? objectMatch[0].trim() : null;
}
