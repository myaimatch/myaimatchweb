# Assessment Automation Flow

Flujo end-to-end del Free Assessment.

```
Typeform submission
  → Zapier
    → Claude API (genera recomendaciones personalizadas)
      → myAImatch API (Supabase persistence + affiliate URL resolver)
      → Klaviyo (trigger email)
      → Supabase CRM (upsert lead)
```

## Componentes clave

- **Typeform**: formulario público. El trigger inicial.
- **Zapier**: orquesta el flujo. Llama a Claude API con el payload del Typeform y luego llama `/api/zapier/assessment-completed`.
- **Claude API**: genera matches personalizados. Prompt maestro en `.claude/context/ai-match-engine-prompt.md`.
- **myAImatch API**: parsea JSON, guarda lead/assessment en Supabase, matchea tools y devuelve `tool_*_url`, `tool_*_promo`, `tool_*_has_affiliate`.
- **Klaviyo**: envía email con recomendación. Template HTML en `brand_assets/klaviyo-email-template.html`.
- **Supabase**: persiste lead, assessment, recomendaciones y monetization metadata.

## Setup operativo

- Typeform setup: `.claude/context/ai-match-engine-tally-setup.md` (nombre legacy — ya no usamos Tally, el doc cubre la migración a Typeform).
- Supabase setup: crear project, aplicar migrations, correr `npm run migrate:affiliate-os:dry`, luego `npm run migrate:affiliate-os`.
- Zapier debe enviar el JSON de Claude al endpoint de myAImatch y usar las `properties` devueltas para Klaviyo.
- Zapier no debe enviar `implementation_order` ni `cost_notes` al email premium actual.
