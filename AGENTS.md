# AGENTS.md

Entry point para Codex y Codex. Solo delega — el contenido vive en `.Codex/`.

**Proyecto:** myAImatch (`myaimatch.ai`) — AI Tools Directory + Assessment Funnel. Ver `.Codex/context/project-overview.md`.

## Always Do First

- Invocar `superpowers` para analizar paso a paso.
- Invocar el skill `frontend-design` antes de escribir cualquier código de UI, cada sesión, sin excepciones. Skill en `.Codex/skills/frontend-design/SKILL.md`.

## Por tipo de tarea

| Tarea | Leer primero |
|---|---|
| Código (TS, componentes) | `.Codex/rules/code-style.md` |
| Diseño frontend / UI | `.Codex/rules/frontend-design.md` + `.Codex/context/brand.md` |
| Screenshot / comparación visual | `.Codex/rules/screenshot-workflow.md` |
| SEO / meta tags | `.Codex/rules/seo.md` |
| Git / commits / branches | `.Codex/rules/git-workflow.md` |
| Copy / contenido | `.Codex/context/copywriting-guide.md` + `.Codex/context/audience.md` |
| Data / schemas | `.Codex/context/airtable-schema.md` |
| Assessment flow | `.Codex/context/assessment-flow.md` |
| Rutas de la web | `.Codex/context/routes.md` |
| Stack / comandos | `.Codex/context/stack.md` |
| Prompt del match engine | `.Codex/context/ai-match-engine-prompt.md` |
| GTM / estrategia | `.Codex/context/gtm-strategy.md` |

## Comandos mínimos

```bash
npm run dev       # dev server en localhost:3000
npm run build     # correr después de cada cambio
npm run lint
```

## Workflow

1. Toda feature nueva arranca en **Plan Mode**.
2. Trabajar siempre en `dev`. Nunca push directo a `main`.
3. `npm run build` después de cada cambio.

Detalles en `.Codex/rules/git-workflow.md`.
