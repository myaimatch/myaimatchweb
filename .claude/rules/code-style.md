# Code Style

Cómo escribir código en este repo. Aplica a todo TS/TSX.

## Fundamentos

- TypeScript **strict mode**, ES modules en todo el codebase.
- Components → `/src/components`
- Pages / routes → `/src/app` (Next.js 14 App Router)
- Usar **shadcn/ui** siempre que sea posible. No instalar otras librerías de UI.

## Data

- **Nunca hardcodear tool data ni market data.** Toda info de herramientas viene de Airtable vía API.
- Fetching en Server Components por defecto; solo usar Client Components cuando haya interactividad (`"use client"` explícito).

## Workflow de build

- Correr `npm run build` después de cada cambio. Arreglar errores antes de seguir.
- Correr `npm run lint` antes de commit.

## Qué NO hacer

- No añadir event handlers en Server Components (romperá build).
- No usar `window` / `document` en `useState` inicial — rompe SSR. Usar `useEffect`.
- No usar `display` inline cuando hay clases `md:hidden` — el inline gana y rompe responsive.
