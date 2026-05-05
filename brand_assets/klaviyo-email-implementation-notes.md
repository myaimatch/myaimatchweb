# Klaviyo Email Implementation Notes

This is the current source of truth for the AI Match assessment email flow.

## Flow

1. Typeform captures the assessment response.
   - Name: `field_seReSpkmjWiT`
   - Email: `field_W5LUrfXXlDwl`
   - Role: `field_waEEXvnnBh41`
   - Business Type: `field_DPx3iasLwCmL`
   - Team Size: `field_08urThimI5ds`
   - Main Workflow to Improve: `field_2PVxfL3OJqrd`
   - Current Tools: `field_zHTuQ9XOOaue`
   - AI Experience Level: `field_Msg5io0bvsoX`

2. Anthropic returns one JSON object.
   - Required top-level keys: `summary`, `recommended_stack`.
   - Optional top-level key: `services_cta`.
   - `recommended_stack` must contain 3 to 5 tools.
   - Each tool must include `tool_name`, `why_it_fits`, and `notes`.

3. Code by Zapier sends the parsed assessment payload to myAImatch before Klaviyo.
   - POST to `https://myaimatch.ai/api/zapier/assessment-completed`.
   - Use `Authorization: Bearer {{ZAPIER_WEBHOOK_SECRET}}` or send `x-myaimatch-signature`.
   - The endpoint stores the lead/result in Supabase, resolves tool links, and returns flattened Klaviyo properties.

4. Airtable stores the raw Anthropic JSON for history and debugging.

5. Klaviyo receives the `Completed Assessment` event and renders the email from event properties.
   - This must be a metric-triggered flow email so `event` variables are available.
   - The template uses `event|lookup:'property_name'` to match the event payload exactly.

## Final Klaviyo Event Properties

Use these exact property keys in the Klaviyo Track Event step:

| Klaviyo key | Zapier value |
|---|---|
| `first_name` | `{{=gives["360734699"]["first_name"]}}` |
| `summary` | `{{=gives["360734699"]["summary"]}}` |
| `services_cta` | `{{=gives["360734699"]["services_cta"]}}` |
| `tool_1_name` | `{{=gives["360734699"]["tool_1_name"]}}` |
| `tool_1_why` | `{{=gives["360734699"]["tool_1_why"]}}` |
| `tool_1_notes` | `{{=gives["360734699"]["tool_1_notes"]}}` |
| `tool_1_url` | `{{=gives["360734699"]["tool_1_url"]}}` |
| `tool_1_promo` | `{{=gives["360734699"]["tool_1_promo"]}}` |
| `tool_1_has_affiliate` | `{{=gives["360734699"]["tool_1_has_affiliate"]}}` |
| `tool_2_name` | `{{=gives["360734699"]["tool_2_name"]}}` |
| `tool_2_why` | `{{=gives["360734699"]["tool_2_why"]}}` |
| `tool_2_notes` | `{{=gives["360734699"]["tool_2_notes"]}}` |
| `tool_2_url` | `{{=gives["360734699"]["tool_2_url"]}}` |
| `tool_2_promo` | `{{=gives["360734699"]["tool_2_promo"]}}` |
| `tool_2_has_affiliate` | `{{=gives["360734699"]["tool_2_has_affiliate"]}}` |
| `tool_3_name` | `{{=gives["360734699"]["tool_3_name"]}}` |
| `tool_3_why` | `{{=gives["360734699"]["tool_3_why"]}}` |
| `tool_3_notes` | `{{=gives["360734699"]["tool_3_notes"]}}` |
| `tool_3_url` | `{{=gives["360734699"]["tool_3_url"]}}` |
| `tool_3_promo` | `{{=gives["360734699"]["tool_3_promo"]}}` |
| `tool_3_has_affiliate` | `{{=gives["360734699"]["tool_3_has_affiliate"]}}` |
| `tool_4_name` | `{{=gives["360734699"]["tool_4_name"]}}` |
| `tool_4_why` | `{{=gives["360734699"]["tool_4_why"]}}` |
| `tool_4_notes` | `{{=gives["360734699"]["tool_4_notes"]}}` |
| `tool_4_url` | `{{=gives["360734699"]["tool_4_url"]}}` |
| `tool_4_promo` | `{{=gives["360734699"]["tool_4_promo"]}}` |
| `tool_4_has_affiliate` | `{{=gives["360734699"]["tool_4_has_affiliate"]}}` |
| `tool_5_name` | `{{=gives["360734699"]["tool_5_name"]}}` |
| `tool_5_why` | `{{=gives["360734699"]["tool_5_why"]}}` |
| `tool_5_notes` | `{{=gives["360734699"]["tool_5_notes"]}}` |
| `tool_5_url` | `{{=gives["360734699"]["tool_5_url"]}}` |
| `tool_5_promo` | `{{=gives["360734699"]["tool_5_promo"]}}` |
| `tool_5_has_affiliate` | `{{=gives["360734699"]["tool_5_has_affiliate"]}}` |

## Code by Zapier Python

If Zapier still needs a Python step, use it only to assemble the request body for the
myAImatch endpoint. The endpoint now does the canonical parsing, Supabase write, tool
matching, affiliate URL resolution, and final flattening.

```python
import json

raw_json = input_data.get("raw_json", "{}")
payload = {
    "raw_json": raw_json,
    "first_name": input_data.get("first_name", ""),
    "name": input_data.get("name", ""),
    "email": input_data.get("email", ""),
    "role": input_data.get("role", ""),
    "business_type": input_data.get("business_type", ""),
    "team_size": input_data.get("team_size", ""),
    "main_workflow_to_improve": input_data.get("main_workflow_to_improve", ""),
    "current_tools": input_data.get("current_tools", ""),
    "ai_experience_level": input_data.get("ai_experience_level", ""),
}
return {"payload_json": json.dumps(payload)}
```

## Troubleshooting Checklist

If Canva or any tool shows the name but not `Why it fits` or `Smart Tip`, check these in order:

1. In Code by Zapier, confirm `recommended_stack = data.get("recommended_stack", [])` uses the underscore. `recommendedstack` is wrong.
2. In the Code by Zapier test output, confirm `tool_1_why` and `tool_1_notes` have values.
3. In the Klaviyo Track Event step, confirm the property keys include `tool_1_url`, `tool_1_promo`, and `tool_1_has_affiliate`.
4. Remove leading or trailing spaces from all Klaviyo keys and Zapier values.
5. In Klaviyo Preview and test, choose an actual `Completed Assessment` event and copy the event variables exactly.
6. Confirm the email is inside a metric-triggered flow. Event variables do not work in regular campaigns.

## Footer Rules

- The footer must not show standalone `myaimatch.ai` or `Services` links.
- The logo should link to `https://myaimatch.ai`.
- The final receipt text is:
  `You received this because you completed the AI Match Free Assessment at myaimatch.ai.`
- Include affiliate disclosure text above the receipt text.
- Keep `myaimatch.ai` as plain text in that sentence.
- Use `{% unsubscribe_link %}` inside the custom HTML anchor:
  `<a href="{% unsubscribe_link %}">Unsubscribe</a>`

## Paste-Ready HTML

The final paste-ready Klaviyo HTML is the complete contents of:

`brand_assets/klaviyo-email-template.html`

Keep this file as the single HTML source of truth so the template and this documentation do not drift apart.

## References

- Klaviyo event variables and personalization syntax: https://help.klaviyo.com/hc/en-us/articles/4408802648731
- Klaviyo event data in flow emails: https://help.klaviyo.com/hc/en-us/articles/115002779071-About-Using-Event-Variables-to-Personalize-Flows
- Klaviyo unsubscribe tags: https://help.klaviyo.com/hc/en-us/articles/115006054267
- FTC CAN-SPAM compliance guide: https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business
