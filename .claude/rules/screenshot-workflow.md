# Screenshot Workflow

Cómo screenshotear y comparar contra referencia.

## Servidor local

- **Siempre servir en localhost.** Nunca screenshotear un `file:///`.
- Arrancar dev server: `npm run dev` (Next.js en `http://localhost:3000`, a veces cae a 3001 si 3000 está ocupado).
- Si el server ya está corriendo, no arrancar otra instancia.

## Screenshotear

- Puppeteer vive en `node_modules/puppeteer/`. Chrome cache en `~/.cache/puppeteer/`.
- Comando: `node screenshot.mjs http://localhost:3000`
- Los screenshots se guardan en `./temporary screenshots/screenshot-N.png` (auto-incremento, no sobrescribe).
- Label opcional: `node screenshot.mjs http://localhost:3000 label` → `screenshot-N-label.png`.
- `screenshot.mjs` vive en el root del proyecto.

## Comparar

- Leer el PNG desde `temporary screenshots/` con la tool `Read` — Claude puede ver la imagen.
- Ser específico al comparar: "heading es 32px pero la referencia muestra ~24px", "card gap es 16px, debería ser 24px".
- Checklist visual: spacing/padding, font size/weight/line-height, colors (hex exacto), alignment, border-radius, shadows, image sizing.
- Mínimo 2 rondas de comparación.
