import assert from "node:assert/strict";
import {
  flattenAssessmentForKlaviyo,
  matchToolByName,
  parseAnthropicResponse,
} from "./zapier-assessment";

const parsed = parseAnthropicResponse(`
\`\`\`json
{
  "summary": "Angel should start with one focused workflow.",
  "recommended_stack": [
    {
      "tool_name": "Notion",
      "use_case": "Centralize operating docs.",
      "why_it_fits": "It gives the team one place to work. It is simple enough to adopt.",
      "setup_priority": 1,
      "notes": "Start with one workflow database."
    }
  ],
  "services_cta": "We can handle the setup if you want the tools connected."
}
\`\`\`
`);

assert.equal(parsed.summary, "Angel should start with one focused workflow.");
assert.equal(parsed.recommended_stack[0]?.tool_name, "Notion");

const notion = matchToolByName("notion ai", [
  { id: "tool_1", name: "Notion", slug: "notion", websiteUrl: "https://www.notion.so" },
  { id: "tool_2", name: "ChatGPT", slug: "chatgpt", websiteUrl: "https://chatgpt.com" },
]);

assert.equal(notion?.id, "tool_1");

const flattened = flattenAssessmentForKlaviyo({
  firstName: "Angel",
  parsed,
  recommendations: [
    {
      toolName: "Notion",
      useCase: "Centralize operating docs.",
      why: "It gives the team one place to work. It is simple enough to adopt.",
      notes: "Start with one workflow database.",
      url: "/go/notion?src=assessment_email&rid=rec_1",
      promo: "SAVE20",
      hasAffiliate: true,
    },
  ],
});

assert.equal(flattened.first_name, "Angel");
assert.equal(flattened.tool_1_name, "Notion");
assert.equal(flattened.tool_1_url, "/go/notion?src=assessment_email&rid=rec_1");
assert.equal(flattened.tool_1_promo, "SAVE20");
assert.equal(flattened.tool_1_has_affiliate, "true");
assert.equal(flattened.tool_5_name, "");
assert.equal(flattened.tool_5_url, "");

assert.throws(
  () => parseAnthropicResponse("{not-json"),
  /Anthropic response was not valid JSON/,
);
