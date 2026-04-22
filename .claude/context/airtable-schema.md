# Airtable Schema

Fuente de verdad para toda la data de tools y leads. **No hardcodear** — fetch vía Airtable API.

## Tabla: AI Tools

Campos:
`name`, `slug`, `category`, `subcategory`, `pricing_model`, `price_from`, `price_to`, `description`, `features`, `affiliate_link`, `logo_url`, `website_url`, `g2_score`, `trustpilot_score`, `review_snippet_1`, `review_source_1`, `review_url_1`, `comparison_specs`, `last_verified_date`

## Tabla: Leads / CRM

Campos:
`name`, `email`, `business_type`, `team_size`, `assessment_date`, `assessment_result`, `paid_services`, `stripe_payment_id`, `status`

## Guía de setup

Setup operativo (keys, bases, etc.): `.claude/context/airtable-setup.md`.
