import assert from "node:assert/strict";
import {
  OUTCOME_TAXONOMY,
  getAllSubcategories,
  slugifyTaxonomyLabel,
} from "./outcome-taxonomy";

assert.equal(OUTCOME_TAXONOMY.length, 14);
assert.deepEqual(
  OUTCOME_TAXONOMY.map((outcome) => outcome.name),
  [
    "Create Content",
    "Design Visuals",
    "Produce Video & Audio",
    "Build Software",
    "Build AI Agents",
    "Automate Workflows",
    "Grow Audience",
    "Launch Campaigns",
    "Sell & Close Deals",
    "Support Customers",
    "Analyze Data",
    "Research & Learn",
    "Plan & Collaborate",
    "Run Operations",
  ],
);

assert.equal(getAllSubcategories().length, 82);

assert.equal(slugifyTaxonomyLabel("Long-form writing (articles, blogs)"), "long-form-writing");
assert.equal(slugifyTaxonomyLabel("Voice generation & dubbing"), "voice-generation-dubbing");
assert.equal(slugifyTaxonomyLabel("SEO research & audits"), "seo-research-audits");
assert.equal(slugifyTaxonomyLabel("CRM & pipeline management"), "crm-pipeline-management");
assert.equal(slugifyTaxonomyLabel("Dashboards & BI"), "dashboards-bi");
assert.equal(slugifyTaxonomyLabel("Meetings & AI notetakers"), "meetings-ai-notetakers");
assert.equal(slugifyTaxonomyLabel("Expenses & spend management"), "expenses-spend-management");

for (const outcome of OUTCOME_TAXONOMY) {
  assert.equal(outcome.slug, slugifyTaxonomyLabel(outcome.name));
  assert.ok(outcome.subcategories.length > 0, `${outcome.name} must have subcategories`);

  for (const subcategory of outcome.subcategories) {
    assert.equal(subcategory.slug, slugifyTaxonomyLabel(subcategory.name));
  }
}
