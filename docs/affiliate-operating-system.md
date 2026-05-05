# Affiliate Operating System

Supabase is now the v1 source of truth for tools, leads, assessments, affiliate links,
deals, clicks, revenue events, and agent findings.

## Setup

1. Create a Supabase project.
2. Add the environment variables from `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ZAPIER_WEBHOOK_SECRET`
   - `CRON_SECRET`
3. Apply the SQL migration:
   `supabase/migrations/202605050001_affiliate_operating_system.sql`
4. Seed the first admin:
   ```sql
   insert into public.admin_users (email) values ('angel@myaimatch.ai');
   ```
5. Validate the Airtable import:
   ```bash
   npm run migrate:affiliate-os:dry
   ```
6. Apply the import:
   ```bash
   npm run migrate:affiliate-os
   ```

## Routes

- `/go/[toolSlug]`: logs outbound clicks and redirects to the active deal, active affiliate link, or website fallback.
- `/admin/login`: Supabase magic-link login.
- `/admin/affiliates`: internal affiliate operations dashboard.
- `/api/zapier/assessment-completed`: signed Zapier endpoint that stores assessment data and returns Klaviyo properties.
- `/api/cron/affiliate-checks`: Vercel Cron endpoint that queues agent findings for human review.

## Zapier

After the Claude step, call:

```text
POST https://myaimatch.ai/api/zapier/assessment-completed
Authorization: Bearer <ZAPIER_WEBHOOK_SECRET>
Content-Type: application/json
```

The response includes `properties`. Send those properties to the Klaviyo `Completed Assessment` event.

## Publication Policy

Agents can create `agent_findings`, but they cannot publish links or deals. A human admin must approve
affiliate changes before they become active on the public website or in assessment emails.
