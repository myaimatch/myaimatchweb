import assert from "node:assert/strict";
import {
  classifyToolForOutcomeMigration,
  validateOutcomeProposal,
} from "./outcome-migration";

const zapier = classifyToolForOutcomeMigration({
  name: "Zapier",
  slug: "zapier",
  currentCategories: ["Productivity & Ops"],
  currentSubcategory: "Process Automation",
  shortDescription: "Connect apps and automate workflows.",
  fullDescription: "",
});

assert.equal(zapier.primaryOutcomeSlug, "automate-workflows");
assert.deepEqual(zapier.subcategorySlugs, ["connect-apps"]);
assert.equal(validateOutcomeProposal(zapier).valid, true);

const bill = classifyToolForOutcomeMigration({
  name: "Bill",
  slug: "bill",
  currentCategories: [],
  currentSubcategory: "",
  shortDescription: "Automate accounts payable and receivable.",
  fullDescription: "",
});

assert.equal(bill.primaryOutcomeSlug, "run-operations");
assert.ok(bill.subcategorySlugs.includes("bookkeeping-finance"));

const semrush = classifyToolForOutcomeMigration({
  name: "Semrush",
  slug: "semrush",
  currentCategories: ["Marketing & SEO"],
  currentSubcategory: "Marketing Automation",
  shortDescription: "SEO and market research tools.",
  fullDescription: "",
});

assert.equal(semrush.primaryOutcomeSlug, "grow-audience");
assert.deepEqual(semrush.subcategorySlugs, ["seo-research-audits"]);

const amelia = classifyToolForOutcomeMigration({
  name: "Amelia",
  slug: "amelia",
  currentCategories: [],
  currentSubcategory: "",
  shortDescription: "Enterprise conversational AI agent platform for voice and text customer interactions.",
  fullDescription: "Amelia deploys voice and text AI agents with autonomous reasoning, task automation, and enterprise integrations.",
});

assert.equal(amelia.primaryOutcomeSlug, "build-ai-agents");
assert.ok(amelia.subcategorySlugs.includes("build-voice-agents"));

assert.deepEqual(validateOutcomeProposal({
  toolId: "tool_1",
  toolName: "Broken",
  toolSlug: "broken",
  primaryOutcomeSlug: "",
  secondaryOutcomeSlugs: [],
  subcategorySlugs: [],
  confidence: "low",
  reason: "missing",
}).errors, [
  "primaryOutcomeSlug is required",
  "at least one subcategorySlug is required",
]);
