# Testing Guide — Enrichment Script
**Ejecutar cuando los créditos de Anthropic estén activos**

---

## Paso 1 — Dry-run (NO escribe a Airtable)

```bash
npm run enrich:dry
```

**Qué verificar:**
- 5 herramientas procesadas sin errores
- Cada tool muestra `✅ dry-run (N fields)`
- El JSON impreso tiene valores coherentes (no todo null)
- Summary final: `✅ Updated: 0 / ⚠️ Skipped: <2 / ❌ Failed: 0`

---

## Paso 2 — Live test con 5 tools (SÍ escribe a Airtable)

```bash
npx tsx scripts/enrich-tools.ts --limit=5
```

**Qué verificar en terminal:**
```
[1/5] Monday.com ... ✅ updated (8 fields)
[2/5] Make ... ✅ updated (11 fields)
...
─────────────────────────────────
✅ Updated:  5
⚠️  Skipped:  0
❌ Failed:   0
─────────────────────────────────
```

**Qué verificar en Airtable** (tabla Tools, primeras 5 filas):

| Campo | Valor esperado |
|---|---|
| `Support Languages` | Al menos ["English"] |
| `Founded Year` | Número entre 2010–2024 |
| `Has Free Plan` | true o false (no vacío) |
| `Best For` | Uno de: Solo, Small Team, Mid-Market, Enterprise, All |
| `Company HQ` | Uno de: USA, EU, UK, Canada, LATAM, Asia, Other |
| `Has API` | true o false |
| `Trial Days` | Número ≥ 0, o vacío si desconocido |

Si algún campo está siempre vacío (null) en los 5 tools → revisar el prompt en `extractWithClaude()`.

---

## Paso 3 — Full batch (233 tools)

Solo ejecutar si el Paso 2 fue exitoso.

```bash
npm run enrich
```

**Tiempo estimado:** ~10–15 minutos para 233 tools.

**Summary esperado al finalizar:**
- ✅ Updated: > 200
- ⚠️ Skipped: < 20 (tools sin website accesible o con bloqueo)
- ❌ Failed: < 5

---

## Paso 4 — GitHub Actions (automatización semanal)

1. Ir a: `github.com/myaimatch/myaimatchweb` → **Actions** → **Enrich AI Tools**
2. Hacer clic en **Run workflow** → **Run workflow** (botón verde)
3. Esperar ~15 min y verificar que el run aparece en verde

**Secrets requeridos en GitHub** (Settings → Secrets → Actions):
- `AIRTABLE_API_KEY`
- `AIRTABLE_BASE_ID`
- `ANTHROPIC_API_KEY`

---

## Troubleshooting

| Error | Causa probable | Solución |
|---|---|---|
| `credit balance too low` | API key sin créditos | Recargar en console.anthropic.com |
| `⚠️ no pages fetched` | Website bloquea bots | Normal, se saltea automáticamente |
| `⚠️ Claude parse error` | Respuesta no es JSON válido | Revisar el prompt en el script |
| `❌ error: ...Airtable...` | Campo no existe en Airtable | Verificar que los 13 campos están creados |
