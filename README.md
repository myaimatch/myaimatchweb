# MyAIMatch

AI Tools Directory + Assessment Funnel en [myaimatch.ai](https://myaimatch.ai).

Universal AI matching engine + consultoría para eliminar "AI overwhelm". Une discovery e implementación: Free Assessment → Paid Strategy Roadmap → AI Stack Setup.

## Stack

Next.js 14 (App Router) · Tailwind CSS + shadcn/ui · Airtable API · Claude API · Typeform · Zapier · Klaviyo · Stripe · Cal.com

## Quick start

```bash
npm install
cp .env.local.example .env.local   # si existe; añadir keys de Airtable/Claude
npm run dev                         # http://localhost:3000
```

Otros comandos:

```bash
npm run build     # verificación completa; correr después de cada cambio
npm run lint
```

## Estructura del repo

```
myaimatchweb/
├── src/
│   ├── app/              # Next.js App Router (rutas)
│   ├── components/       # React components (incluye shadcn/ui)
│   └── lib/              # utilidades (airtable client, helpers)
├── public/               # assets estáticos servidos por Next
├── brand_assets/         # logos y design system (imports de UI)
├── docs/
│   ├── marketing/        # briefs, scripts
│   └── references/       # capturas de referencia para diseño
├── scripts/              # scripts one-off (ej. enrich-tools.ts)
├── .claude/              # configuración de Claude Code (rules, context, skills)
└── CLAUDE.md             # entry point para Claude Code
```

## Claude Code

Este repo está optimizado para trabajar con Claude Code. Toda la configuración vive en `.claude/`:

- `.claude/rules/` — cómo se comporta Claude (code style, diseño, git, SEO)
- `.claude/context/` — qué sabe Claude (brand, stack, Airtable schema, audience)
- `.claude/skills/` — skills del proyecto (ej. `frontend-design`)

Punto de entrada: [CLAUDE.md](CLAUDE.md).

## Workflow

- Trabajar siempre en branch `dev`. Nunca push directo a `main`.
- Toda feature arranca en Plan Mode.
- `npm run build` después de cada cambio.

Detalles en [.claude/rules/git-workflow.md](.claude/rules/git-workflow.md).
