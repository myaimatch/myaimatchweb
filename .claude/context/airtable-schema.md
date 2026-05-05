# Data Schema

Supabase es la fuente de verdad v1 para tools, leads, assessments, affiliates, deals, clicks y revenue.
Airtable queda como fuente legacy/import backup mientras se completa la migración.

## Supabase core tables

- `tools`, `categories`, `tool_categories`
- `leads`, `assessments`, `assessment_recommendations`
- `affiliate_programs`, `affiliate_links`, `deals`
- `click_events`, `revenue_events`
- `agent_findings`, `audit_log`, `admin_users`

Ver migration en `supabase/migrations/202605050001_affiliate_operating_system.sql`.

## Airtable legacy import

## Tabla: AI Tools

Campos:
`name`, `slug`, `category`, `subcategory`, `pricing_model`, `price_from`, `price_to`, `description`, `features`, `affiliate_link`, `logo_url`, `website_url`, `g2_score`, `trustpilot_score`, `review_snippet_1`, `review_source_1`, `review_url_1`, `comparison_specs`, `last_verified_date`

## Tabla: Leads / CRM

Campos:
`name`, `email`, `business_type`, `team_size`, `assessment_date`, `assessment_result`, `paid_services`, `stripe_payment_id`, `status`

## Guía de setup

Setup operativo (keys, bases, etc.): `.claude/context/airtable-setup.md`.
