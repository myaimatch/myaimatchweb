import assert from "node:assert/strict";
import {
  buildEnrichmentBackupPayload,
  classifyToolFromMiniSummary,
  hasMinimumEvidence,
  normalizeEnrichmentResult,
  validateEnrichmentResult,
  type EnrichmentEvidencePage,
} from "./tool-enrichment";

const pages: EnrichmentEvidencePage[] = [
  {
    url: "https://zapier.com/",
    provider: "firecrawl",
    sourceType: "homepage",
    fetchedAt: "2026-05-06T10:00:00.000Z",
    contentHash: "hash-home",
    statusCode: 200,
    excerpt: "Zapier automates work across thousands of apps using workflows called Zaps.",
    markdown: "Zapier automates work across thousands of apps using workflows called Zaps.",
  },
  {
    url: "https://zapier.com/pricing",
    provider: "firecrawl",
    sourceType: "pricing",
    fetchedAt: "2026-05-06T10:00:01.000Z",
    contentHash: "hash-pricing",
    statusCode: 200,
    excerpt: "Plans include free and paid tiers for teams.",
    markdown: "Plans include free and paid tiers for teams.",
  },
  {
    url: "https://zapier.com/features",
    provider: "firecrawl",
    sourceType: "features",
    fetchedAt: "2026-05-06T10:00:02.000Z",
    contentHash: "hash-features",
    statusCode: 200,
    excerpt: "Build app integrations, automate processes, and connect business systems.",
    markdown: "Build app integrations, automate processes, and connect business systems.",
  },
];

assert.equal(hasMinimumEvidence(pages, 3), true);
assert.equal(hasMinimumEvidence(pages.slice(0, 2), 3), false);
assert.equal(hasMinimumEvidence([{ ...pages[0], markdown: "too short" }, ...pages.slice(1)], 3), false);

const normalized = normalizeEnrichmentResult({
  mini_summary:
    "Zapier is an automation platform that connects business apps and lets teams build multi-step workflows without code.",
  full_description:
    "Zapier helps users connect apps, move data, and automate repetitive business workflows. It is useful for teams that need to coordinate tools across sales, marketing, operations, and support without writing custom integrations.",
  short_description: "Automate workflows across business apps without code.",
  pricing_summary: "Free / paid plans / custom enterprise",
  best_for: "Small Team",
  has_free_plan: true,
  integrations: ["Slack", "Google Workspace", "Unknown App", "Slack"],
});

assert.equal(
  normalized.mini_summary,
  "Zapier is an automation platform that connects business apps and lets teams build multi-step workflows without code.",
);
assert.equal(normalized.best_for, "Small Team");
assert.deepEqual(normalized.integrations, ["Slack", "Google Workspace"]);

const classification = classifyToolFromMiniSummary({
  id: "tool-zapier",
  name: "Zapier",
  slug: "zapier",
  miniSummary: normalized.mini_summary!,
});

assert.equal(classification.primaryOutcomeSlug, "automate-workflows");
assert.deepEqual(classification.subcategorySlugs, ["connect-apps"]);

const validation = validateEnrichmentResult({
  toolName: "Zapier",
  toolSlug: "zapier",
  evidencePages: pages,
  normalized,
  classification,
  minPages: 3,
});

assert.deepEqual(validation, { valid: true, errors: [] });

const invalidValidation = validateEnrichmentResult({
  toolName: "Zapier",
  toolSlug: "zapier",
  evidencePages: pages.slice(0, 2),
  normalized: { ...normalized, mini_summary: "" },
  classification,
  minPages: 3,
});

assert.equal(invalidValidation.valid, false);
assert.ok(invalidValidation.errors.includes("at least 3 evidence pages are required"));
assert.ok(invalidValidation.errors.includes("mini_summary is required"));

const backup = buildEnrichmentBackupPayload({
  runId: "run_123",
  createdAt: "2026-05-06T10:00:00.000Z",
  tools: [
    {
      id: "tool-zapier",
      name: "Zapier",
      slug: "zapier",
      short_description: "Old short",
      full_description: "Old full",
      pricing_summary: null,
    },
  ],
});

assert.equal(backup.runId, "run_123");
assert.equal(backup.tools[0].full_description, "Old full");
