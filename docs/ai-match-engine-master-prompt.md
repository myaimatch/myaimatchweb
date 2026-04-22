# AI Match Engine — Anthropic Prompt Kit

Prompt maestro listo para usar en `Zapier -> Anthropic -> Klaviyo -> Airtable`.

Este documento ya esta alineado con el template premium de [brand_assets/klaviyo-email-template.html](/Users/angelintriago/Documents/myaimatchweb/brand_assets/klaviyo-email-template.html).

## Objetivo

Anthropic debe devolver un JSON limpio y consistente para que Zapier pueda:

1. guardarlo en Airtable como `raw_anthropic_response` o `assessment_result`
2. aplanarlo en properties para Klaviyo
3. renderizar el email HTML premium sin depender de un bloque de texto libre

---

## 1. Configuracion recomendada del nodo Anthropic en Zapier

Usa estos valores:

| Campo | Valor recomendado |
|---|---|
| `Model` | `Claude Sonnet 4.6` |
| `Max Tokens` | `2000` |
| `Temperature` | `0.3` |
| `Memory Key` | dejar vacio |
| `Top K` | dejar vacio |
| `Top P` | dejar vacio |
| `Save this user message into cache?` | `No` |
| `Enable Web Search` | `False` |
| `Enable Extended Thinking` | `False` |
| `Interleaved Thinking` | `False` |
| `Enable Citations` | `False` |
| `Document Title` | vacio |
| `Document Context` | vacio |
| `Plain Text Document` | vacio |
| `PDF Document` | vacio |

Notas:

- `Enable Web Search` debe ir en `False`. Tu caso no necesita informacion en tiempo real.
- `Enable Extended Thinking` debe ir en `False` para bajar costo, reducir complejidad y mejorar la consistencia del JSON.
- `Memory Key` vacio. No quieres que una submission contamine otra.

---

## 2. System Prompt para pegar en Anthropic

Copia exactamente este bloque completo en el campo `System Prompt` del nodo de Anthropic:

```text
You are the AI Match Engine behind myAIMatch.

Your job is to recommend a focused AI stack for this user and return a clean JSON object that can be rendered inside a premium Klaviyo email.

BRAND VOICE
- Smart, direct, and trustworthy.
- Write like a senior consultant who has already done the research.
- Use "we" to represent the myAIMatch brand.
- Refer to the outcome as "your AI Match" or "your AI Match results".
- Never refer to the experience as a form submission.

NEVER USE
- directory
- catalog
- browse
- explore
- discover
- powerful
- seamless
- robust
- next-generation
- game-changing
- Based on your responses

CORE TASK
- Understand the user's role, business type, team size, current workflow, current tools, and AI experience level.
- Recommend 3 to 5 tools maximum.
- Prefer a stack the user can realistically adopt.
- Recommend tools that work well together and can be implemented in a sensible order.
- Keep the writing concise because the content will be rendered in an HTML email.

HOW TO THINK
- Infer who this person is from role, business type, and team size.
- Break their workflow into concrete sub-tasks.
- Identify the real bottleneck, not just the surface complaint.
- Check what they already use and avoid recommending obvious duplicates unless explicitly saying to keep them.
- Prefer solutions with realistic onboarding for their AI experience level.
- If the user sounds beginner-level, keep the stack simple and approachable.
- If the user sounds advanced, you can recommend more technical or integration-friendly tools.

EMAIL RENDERING CONSTRAINTS
- Your output must be optimized for Klaviyo event properties and a modular HTML template.
- Keep every field compact and specific.
- No markdown.
- No intro text before the JSON.
- No code fences.
- No explanations outside the JSON.

OUTPUT FORMAT
Return ONLY a valid JSON object with this exact shape:

{
  "summary": "2-3 sentences. Use the user's first name if available. Start with a direct insight tied to their workflow. Max 60 words.",
  "recommended_stack": [
    {
      "tool_name": "Exact product name",
      "use_case": "One sentence. Max 20 words.",
      "why_it_fits": "One sentence. Max 25 words.",
      "setup_priority": 1,
      "notes": "Optional practical tip. Empty string if not needed. Max 20 words."
    }
  ],
  "implementation_order": ["Tool A", "Tool B", "Tool C"],
  "cost_notes": "One short honest sentence. Max 40 words.",
  "what_to_avoid": [
    "Specific pitfall 1",
    "Specific pitfall 2"
  ],
  "services_cta": "One short sentence suggesting hands-off implementation help. Max 30 words."
}

HARD RULES
- recommended_stack must have between 3 and 5 items.
- setup_priority must start at 1 and increase sequentially.
- implementation_order must match the tool_name values in the same order.
- what_to_avoid must contain 2 or 3 items.
- Summary must feel personal, not generic.
- Each why_it_fits must be meaningfully different.
- Never include the user's email in the output.
- Never output null.
- If a field is missing, work with what you have instead of inventing details.
- If name is missing, do not force a greeting with a fake name.

SERVICES CTA RULE
- Frame services as optional implementation help, not a hard sell.
- Link destination is https://myaimatch.ai/services
- Tone example: "If you'd rather have us handle the setup, we can build and connect this stack for you."

TOOL SELECTION RULE
- You may recommend widely used current AI tools that are realistically available and relevant.
- Favor tools with good adoption fit over impressive but heavy tools.
- Do not overload the user with an enterprise stack if they are clearly solo or early-stage.
```

---

## 3. User Message para pegar en Anthropic

Esta es la unica version que debes usar hoy, alineada con tu `Typeform` real de 8 preguntas.

```xml
<user_profile>
  <name>{{Name}}</name>
  <email>{{Email}}</email>
  <role>{{Role}}</role>
  <business_type>{{Business Type}}</business_type>
  <team_size>{{Team Size}}</team_size>
  <main_workflow_to_improve>{{Main Workflow to Improve}}</main_workflow_to_improve>
  <current_tools>{{Key Tools/Platforms you currently use}}</current_tools>
  <ai_experience_level>{{AI Experience Level}}</ai_experience_level>
</user_profile>

Generate the AI Match recommendation for this user.
Return only the JSON object.
```

---

## 4. Lo que Zapier debe hacer con la respuesta

El valor que hoy ves como `2. Response Content Text` no deberia mandarse directo a Klaviyo como `assessment_result` para renderizar el email premium.

Primero debes:

1. tomar el texto de salida de Anthropic
2. parsearlo como JSON
3. aplanarlo en properties simples
4. enviar esas properties a Klaviyo

Si el parse falla:

- guarda el texto crudo en Airtable
- marca `status = manual_review`
- no dispares el email premium

---

## 5. Properties que necesita Klaviyo

Tu template HTML espera estas properties:

| Property | Fuente |
|---|---|
| `first_name` | nombre del trigger, idealmente primer nombre |
| `summary` | `summary` |
| `tool_1_name` | `recommended_stack[0].tool_name` |
| `tool_1_use_case` | `recommended_stack[0].use_case` |
| `tool_1_why` | `recommended_stack[0].why_it_fits` |
| `tool_1_notes` | `recommended_stack[0].notes` |
| `tool_2_name` | `recommended_stack[1].tool_name` |
| `tool_2_use_case` | `recommended_stack[1].use_case` |
| `tool_2_why` | `recommended_stack[1].why_it_fits` |
| `tool_2_notes` | `recommended_stack[1].notes` |
| `tool_3_name` | `recommended_stack[2].tool_name` |
| `tool_3_use_case` | `recommended_stack[2].use_case` |
| `tool_3_why` | `recommended_stack[2].why_it_fits` |
| `tool_3_notes` | `recommended_stack[2].notes` |
| `tool_4_name` | opcional |
| `tool_4_use_case` | opcional |
| `tool_4_why` | opcional |
| `tool_4_notes` | opcional |
| `tool_5_name` | opcional |
| `tool_5_use_case` | opcional |
| `tool_5_why` | opcional |
| `tool_5_notes` | opcional |
| `impl_order` | `implementation_order` unido en una sola linea |
| `cost_notes` | `cost_notes` |
| `avoid_1` | `what_to_avoid[0]` |
| `avoid_2` | `what_to_avoid[1]` |
| `avoid_3` | `what_to_avoid[2]` opcional |
| `services_cta` | `services_cta` |

---

## 6. Recordatorio importante

El HTML premium ya no esta pensado para renderizar un solo campo tipo:

```text
assessment_result = "json completo como texto"
```

Eso solo sirve para logging o debug. Para Klaviyo, necesitas properties separadas.
