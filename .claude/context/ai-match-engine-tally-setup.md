# AI Match Engine Tally Setup Guide
**Docs-only setup for the free AI Match Engine questionnaire**

---

## Goal

The first live funnel should be:

```
MyAIMatch CTA
  → /assessment
  → embedded Tally questionnaire
  → Tally submission
  → Zapier
  → Claude recommendation
  → Klaviyo email
  → Airtable lead record
```

This guide is the setup checklist for the external tools. Do not build webhook/API routes yet. Add website code only after the final Tally form URL and automation accounts exist.

---

## Key Decisions

| Area | Decision |
|---|---|
| Form provider | Tally |
| Website UX | Embedded Tally form inside `/assessment` |
| User-facing name | AI Match Engine |
| Recommendation delivery | Email |
| Automation tool | Zapier |
| AI generation | Claude API |
| Email delivery | Klaviyo |
| CRM/logging | Airtable Leads table |
| Current phase | Documentation and account setup only |

Important copy rule: do not describe the experience as "a form" in user-facing copy. Frame it as the **AI Match Engine** doing its work.

---

## Step 1: Create The Tally Account

1. Create a Tally account.
2. Create a new form named exactly:

```text
AI Match Engine
```

3. Draft the questionnaire first on the free plan.
4. Before public launch, upgrade to **Tally Pro** if you want:
   - remove Tally branding
   - custom domain
   - custom CSS
   - partial submissions/drop-off insights
   - a more polished embedded experience
5. Consider **Tally Business** later if you need:
   - automatic submission data retention
   - email verification
   - stricter privacy operations

---

## Step 2: Build The Tally Questionnaire

Use these fields as the minimum required question set.

| # | User-facing question | Tally field key / internal name | Type |
|---|---|---|---|
| 1 | What is your name? | `name` | Short answer |
| 2 | What email should receive your AI Match results? | `email` | Email |
| 3 | What best describes your role? | `role` | Multiple choice or dropdown |
| 4 | What type of business are you building or operating? | `business_type` | Multiple choice or dropdown |
| 5 | How many people are on your team? | `team_size` | Multiple choice or dropdown |
| 6 | Which workflow do you most want to improve? | `main_workflow` | Multiple choice + Other |
| 7 | What tools are you already using? | `current_tools` | Long answer |
| 8 | How comfortable are you with AI tools today? | `ai_experience_level` | Multiple choice |
| 9 | What monthly budget range feels realistic? | `budget_range` | Multiple choice |
| 10 | What is the main outcome you want from AI? | `top_goal` | Multiple choice + Other |
| 11 | What is the biggest frustration in your current workflow? | `biggest_frustration` | Long answer |
| 12 | How ready are you to implement new tools? | `implementation_readiness` | Multiple choice |
| 13 | Consent to receive the recommendation by email | `consent` | Checkbox |

Recommended consent copy:

```text
I agree to let MyAIMatch use my answers to generate and email my AI Match results. I can unsubscribe anytime.
```

Recommended submit button:

```text
Get My AI Match
```

Avoid:
- "Submit form"
- "Browse tools"
- "Explore catalog"

---

## Step 3: Add Hidden Fields

Add these hidden fields in Tally so the website can pass attribution and CTA context later:

| Hidden field | Purpose |
|---|---|
| `utm_source` | Traffic source |
| `utm_medium` | Traffic medium |
| `utm_campaign` | Campaign name |
| `ref` | Referral or partner code |
| `origin_page` | Page where the user clicked |
| `cta_location` | Specific CTA location, such as `homepage_hero` or `navbar` |

Future examples:

```text
/assessment?utm_source=google&utm_medium=organic&origin_page=home&cta_location=homepage_hero
/assessment?origin_page=services&cta_location=services_final_cta
```

---

## Step 4: Capture Embed Details

Once the Tally form is ready, save these values for the future website implementation:

```bash
NEXT_PUBLIC_TALLY_AI_MATCH_FORM_URL=
NEXT_PUBLIC_TALLY_AI_MATCH_FORM_ID=
```

Use `NEXT_PUBLIC_TALLY_AI_MATCH_FORM_URL` for the embed and fallback link.

Use `NEXT_PUBLIC_TALLY_AI_MATCH_FORM_ID` only if the embed method needs a separate form ID.

Do not hardcode the production Tally URL directly in React components.

---

## Step 5: Configure The Thank-You Redirect

In Tally, configure the post-submission redirect to:

```text
https://myaimatch.ai/assessment/thanks
```

Future thank-you page message:

```text
Your AI Match is being prepared.
```

Supporting copy:

```text
The AI Match Engine is reviewing your workflow and recommendations. Your AI Match results will arrive by email.
```

Secondary CTA:

```text
Want help implementing it? View Services.
```

Target:

```text
/services
```

---

## Step 6: Create The Zapier Workflow

Create the workflow after the Tally form is finalized.

Recommended scenario name:

```text
AI Match Engine - Recommendation Delivery
```

Scenario flow:

1. **Trigger:** Tally submission webhook.
2. **Normalize answers:** map Tally field names into clean keys.
3. **Generate recommendation:** send structured prompt to Claude.
4. **Parse JSON:** validate the Claude response before sending anything to Klaviyo.
5. **Flatten properties:** map `summary`, `tool_1_*` ... `tool_5_*`, `avoid_*`, and `services_cta`.
6. **Do not send:** `implementation_order` or `cost_notes`.
7. **Save lead:** create/update record in Airtable Leads table.
8. **Send email:** trigger Klaviyo email with the recommendation.
9. **Log status:** update Airtable `status` after email send.

Suggested normalized payload:

```json
{
  "name": "",
  "email": "",
  "role": "",
  "business_type": "",
  "team_size": "",
  "main_workflow": "",
  "current_tools": "",
  "ai_experience_level": "",
  "budget_range": "",
  "top_goal": "",
  "biggest_frustration": "",
  "implementation_readiness": "",
  "consent": true,
  "source": "",
  "cta_location": ""
}
```

---

## Step 7: Claude Recommendation Prompt Shape

Use Claude to generate a recommendation that is useful, direct, and not hype-driven.

Required output sections:

1. Recommended AI tools
2. Why each tool fits
3. Smart tip for each tool
4. What to avoid
5. Next step

Prompt guardrails:

- Recommend tools based on workflow fit, role, budget, team size, and implementation readiness.
- Do not promise exact ROI.
- Do not recommend too many tools.
- Prefer a focused set of tools the user can actually adopt.
- If the answers are vague, give a conservative recommendation and explain what extra context would improve it.

Suggested JSON output shape:

```json
{
  "summary": "",
  "recommended_stack": [
    {
      "tool_name": "",
      "use_case": "",
      "why_it_fits": "",
      "setup_priority": 1,
      "notes": ""
    }
  ],
  "what_to_avoid": [],
  "services_cta": ""
}
```

---

## Step 8: Create Airtable Leads Fields

Create or confirm a `Leads` table with these fields.

| Field name | Type | Notes |
|---|---|---|
| `name` | Single line text | User name |
| `email` | Email | Primary identifier |
| `business_type` | Single select or text | Match Tally options if using select |
| `team_size` | Single select or text | Match Tally options if using select |
| `assessment_date` | Date/time | Submission date |
| `assessment_result` | Long text | Store Claude output or summary |
| `paid_services` | Checkbox | Mark true if they become a services lead |
| `status` | Single select | See options below |
| `source` | Single line text | UTM/source/ref |
| `cta_location` | Single line text | CTA context |

Recommended `status` options:

- `new`
- `recommendation_generated`
- `email_sent`
- `email_failed`
- `services_interested`
- `manual_review`

---

## Step 9: Create The Klaviyo Email

Create a Klaviyo flow or transactional-style email triggered by Zapier.

Recommended subject:

```text
Your AI Match is ready
```

Email sections:

1. Short intro: "The AI Match Engine reviewed your workflow."
2. Your AI Match tools
3. Why each tool fits
4. One smart tip per tool
5. CTA to services:

```text
Want help setting this up?
```

CTA target:

```text
https://myaimatch.ai/services
```

---

## Future Website Implementation Checklist

Only start this after the Tally form URL exists.

- [ ] Add `/assessment`
- [ ] Add `/assessment/thanks`
- [ ] Add `NEXT_PUBLIC_TALLY_AI_MATCH_FORM_URL`
- [ ] Add optional `NEXT_PUBLIC_TALLY_AI_MATCH_FORM_ID`
- [ ] Embed Tally inside `/assessment`
- [ ] Add fallback link to open the Tally form in a new tab
- [ ] Pass hidden fields from URL params into the embed/link
- [ ] Keep all AI Match Engine CTAs pointing to `/assessment`
- [ ] Frame the page as the **AI Match Engine**, not a form
- [ ] Run `npm run build`
- [ ] Static scan for banned words in user-facing copy:
  - `directory`
  - `catalog`
  - `browse`

---

## Final Launch Checklist

- [ ] Tally form is complete
- [ ] Tally hidden fields are configured
- [ ] Consent checkbox is present
- [ ] Privacy Policy is linked near the consent step
- [ ] Tally redirect points to `/assessment/thanks`
- [ ] Zapier workflow receives a test submission
- [ ] Claude returns valid structured output
- [ ] Airtable lead record is created
- [ ] Klaviyo email sends successfully
- [ ] Recommendation email includes Services CTA
- [ ] Test submission is marked `email_sent` in Airtable

---

## What Not To Build Yet

- No custom webhook API route yet.
- No database migration yet.
- No instant on-page recommendation result yet.
- No hardcoded Tally production URL in the codebase.
- No Make/Klaviyo/Airtable automation code until accounts and secrets exist.
