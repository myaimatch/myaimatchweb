# CLAUDE.md

Entry point para Claude Code. Solo delega — el contenido vive en `.claude/`.

**Proyecto:** MyAIMatch (`myaimatch.ai`) — AI Tools Directory + Assessment Funnel. Ver `.claude/context/project-overview.md`.

## Always Do First

- Invocar `superpowers` para analizar paso a paso.
- Invocar el skill `frontend-design` antes de escribir cualquier código de UI, cada sesión, sin excepciones. Skill en `.claude/skills/frontend-design/SKILL.md`.

## Por tipo de tarea

| Tarea | Leer primero |
|---|---|
| Código (TS, componentes) | `.claude/rules/code-style.md` |
| Diseño frontend / UI | `.claude/rules/frontend-design.md` + `.claude/context/brand.md` |
| Screenshot / comparación visual | `.claude/rules/screenshot-workflow.md` |
| SEO / meta tags | `.claude/rules/seo.md` |
| Git / commits / branches | `.claude/rules/git-workflow.md` |
| Copy / contenido | `.claude/context/copywriting-guide.md` + `.claude/context/audience.md` |
| Data / schemas | `.claude/context/airtable-schema.md` |
| Assessment flow | `.claude/context/assessment-flow.md` |
| Rutas de la web | `.claude/context/routes.md` |
| Stack / comandos | `.claude/context/stack.md` |
| Prompt del match engine | `.claude/context/ai-match-engine-prompt.md` |
| GTM / estrategia | `.claude/context/gtm-strategy.md` |

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

Detalles en `.claude/rules/git-workflow.md`.
