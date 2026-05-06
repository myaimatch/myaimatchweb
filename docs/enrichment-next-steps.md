# AI Tool Enrichment Next Steps

Use this when resuming the enrichment work in a new session.

## Current Status

- The enrichment audit migration is applied locally and remotely:
  `20260506171351_enrichment_audit_system.sql`.
- Firecrawl was validated with smoke tests.
- The enrichment script can update tool descriptions and metadata.
- Taxonomy updates are intentionally guarded. `--apply` does not rewrite
  `tool_outcomes` or `tool_subcategories` unless `--apply-taxonomy` is passed.
- Do not commit real API keys. `.env.local` is ignored; `.env.example` only has
  placeholders.

## Recommended Flow

1. Rotate the Firecrawl key that was shared in chat, then update `.env.local`.

2. Run a full dry-run and save an audit file:

```bash
npx tsx scripts/enrich-tools-from-web.ts \
  --dry-run \
  --all \
  --min-pages=3 \
  --provider=firecrawl \
  --quiet \
  --output=data/enrichment-dry-runs/full-firecrawl.jsonl
```

3. Review the dry-run output before applying:

```bash
node - <<'NODE'
const fs = require('fs');
const rows = fs.readFileSync('data/enrichment-dry-runs/full-firecrawl.jsonl', 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map(JSON.parse);

const summary = rows.reduce((acc, row) => {
  acc[row.status] = (acc[row.status] || 0) + 1;
  return acc;
}, {});
console.log(summary);

for (const row of rows) {
  const cls = row.classification;
  if (!cls) continue;
  console.log(`${row.tool_slug}: ${cls.primaryOutcomeSlug} / ${cls.subcategorySlugs.join(', ')}`);
}
NODE
```

4. Apply enrichment fields only:

```bash
npx tsx scripts/enrich-tools-from-web.ts \
  --apply \
  --all \
  --min-pages=3 \
  --provider=firecrawl
```

5. Do not apply taxonomy globally yet. Only use this after manual review of the
JSONL and spot checks in the directory UI:

```bash
npx tsx scripts/enrich-tools-from-web.ts \
  --apply \
  --all \
  --min-pages=3 \
  --provider=firecrawl \
  --apply-taxonomy
```

## Known Quality Notes

- Descriptions from Firecrawl + Claude looked useful in the sample.
- Taxonomy classification can drift toward current AI marketing language.
- Examples that need review:
  - Zapier may classify as `build-ai-agents`, but directory placement may need
    `automate-workflows`.
  - Bardeen may classify as agents or sales, but likely belongs under workflow
    automation or scraping/data-entry depending on positioning.
  - AnswerThePublic improved to `grow-audience` after prompt updates.

## Verification Commands

```bash
npm run test
npx tsc --noEmit --pretty false
npm run lint
npm run build
```

## Supabase Checks

```bash
supabase migration list --linked
supabase migration list --local
```

If local Supabase is not running:

```bash
supabase start
supabase db reset
```
