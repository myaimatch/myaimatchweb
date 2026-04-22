# Git Workflow

## Branch

1. Trabajar siempre en `dev`. **Nunca** push directo a `main`.
2. Commit + push solo cuando el usuario lo pida explícitamente.

## Plan Mode

3. Arrancar toda feature nueva en **Plan Mode** — leer archivos existentes, proponer approach, esperar aprobación antes de escribir código.

## Verificación

4. Correr `npm run build` después de cada cambio. Arreglar errores antes de seguir.
5. Correr `npm run lint` antes de commit.

## Mensajes de commit

- Concisos, 1-2 oraciones, enfocados en el "por qué", no el "qué".
- Verbos: `add` (nuevo feature), `update` (mejora a existente), `fix` (bug), `refactor`, `docs`.

## Nunca

- No usar `--no-verify` ni saltar hooks sin permiso explícito.
- No force-push a `main` ni `dev` sin permiso.
- No commitear archivos con secretos (`.env*`).
