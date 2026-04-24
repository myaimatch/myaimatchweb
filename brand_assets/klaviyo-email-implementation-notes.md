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

3. Code by Zapier parses and flattens the JSON.
   - It must output underscore-based keys only.
   - It should prefill tool keys 1 through 5 with empty strings.
   - It should not output `tool1name`, `firstname`, `servicescta`, or any key with leading/trailing spaces.

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
| `tool_2_name` | `{{=gives["360734699"]["tool_2_name"]}}` |
| `tool_2_why` | `{{=gives["360734699"]["tool_2_why"]}}` |
| `tool_2_notes` | `{{=gives["360734699"]["tool_2_notes"]}}` |
| `tool_3_name` | `{{=gives["360734699"]["tool_3_name"]}}` |
| `tool_3_why` | `{{=gives["360734699"]["tool_3_why"]}}` |
| `tool_3_notes` | `{{=gives["360734699"]["tool_3_notes"]}}` |
| `tool_4_name` | `{{=gives["360734699"]["tool_4_name"]}}` |
| `tool_4_why` | `{{=gives["360734699"]["tool_4_why"]}}` |
| `tool_4_notes` | `{{=gives["360734699"]["tool_4_notes"]}}` |
| `tool_5_name` | `{{=gives["360734699"]["tool_5_name"]}}` |
| `tool_5_why` | `{{=gives["360734699"]["tool_5_why"]}}` |
| `tool_5_notes` | `{{=gives["360734699"]["tool_5_notes"]}}` |

## Code by Zapier Python

Paste this into the Code by Zapier step that parses the Anthropic response.

```python
import json
import re

raw_json = input_data.get("raw_json", "{}")
first_name = input_data.get("first_name", "")

raw_json = raw_json.strip()
raw_json = re.sub(r"^```(?:json)?\s*", "", raw_json, flags=re.IGNORECASE)
raw_json = re.sub(r"\s*```$", "", raw_json).strip()

try:
    data = json.loads(raw_json)
except json.JSONDecodeError:
    data = {}

output = {
    "first_name": first_name,
    "summary": data.get("summary", ""),
    "services_cta": data.get(
        "services_cta",
        "If you would rather have us handle the setup, we can build and connect these tools for you.",
    ),
}

for i in range(1, 6):
    output[f"tool_{i}_name"] = ""
    output[f"tool_{i}_why"] = ""
    output[f"tool_{i}_notes"] = ""

recommended_stack = data.get("recommended_stack", [])
if not isinstance(recommended_stack, list):
    recommended_stack = []

for i, tool in enumerate(recommended_stack[:5], start=1):
    if not isinstance(tool, dict):
        continue

    output[f"tool_{i}_name"] = tool.get("tool_name", "")
    output[f"tool_{i}_why"] = tool.get("why_it_fits", "")
    output[f"tool_{i}_notes"] = tool.get("notes", "")

return output
```

## Troubleshooting Checklist

If Canva or any tool shows the name but not `Why it fits` or `Smart Tip`, check these in order:

1. In Code by Zapier, confirm `recommended_stack = data.get("recommended_stack", [])` uses the underscore. `recommendedstack` is wrong.
2. In the Code by Zapier test output, confirm `tool_1_why` and `tool_1_notes` have values.
3. In the Klaviyo Track Event step, confirm the property keys are exactly `tool_1_why` and `tool_1_notes`.
4. Remove leading or trailing spaces from all Klaviyo keys and Zapier values.
5. In Klaviyo Preview and test, choose an actual `Completed Assessment` event and copy the event variables exactly.
6. Confirm the email is inside a metric-triggered flow. Event variables do not work in regular campaigns.

## Footer Rules

- The footer must not show standalone `myaimatch.ai` or `Services` links.
- The logo should link to `https://myaimatch.ai`.
- The final receipt text is:
  `You received this because you completed the AI Match Free Assessment at myaimatch.ai.`
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
