# Assessment Automation Flow

Flujo end-to-end del Free Assessment.

```
Typeform submission
  → Zapier
    → Claude API (genera recomendaciones personalizadas)
      → Klaviyo (trigger email)
      → Airtable CRM (upsert lead)
```

## Componentes clave

- **Typeform**: formulario público. El trigger inicial.
- **Zapier**: orquesta el flujo. Llama a Claude API con el payload del Typeform.
- **Claude API**: genera matches personalizados. Prompt maestro en `.claude/context/ai-match-engine-prompt.md`.
- **Klaviyo**: envía email con recomendación. Template HTML en `brand_assets/klaviyo-email-template.html`.
- **Airtable**: persiste el lead en la tabla `Leads / CRM`. Schema en `.claude/context/airtable-schema.md`.

## Setup operativo

- Typeform setup: `.claude/context/ai-match-engine-tally-setup.md` (nombre legacy — ya no usamos Tally, el doc cubre la migración a Typeform).
- Airtable setup: `.claude/context/airtable-setup.md`.
