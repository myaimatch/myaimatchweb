# Brand

Sistema de diseño concreto. Para reglas de comportamiento al diseñar, ver `.claude/rules/frontend-design.md`.

## Brand assets

Siempre chequear `brand_assets/` antes de diseñar. Contiene logos, design system, style guides y imágenes.
- Si hay logo, usarlo — no placeholder.
- Si hay paleta, typography o animations definidos, usar esos valores exactos — no inventar.

## Color

**Official MYAM KIT 2026 — Escala completa:**

```css
/* Backgrounds — siempre deep black #111111, nunca gris */
--color-bg:      #111111;
--color-surface: rgba(17, 17, 17, 0.8);
--color-card:    rgba(255, 255, 255, 0.04);
--color-border:  rgba(255, 255, 255, 0.08);

/* Primary — púrpura de marca (oficial kit 2026) */
--color-primary: #8468EB;

/* Color scale — 5 stops */
--color-purple-50:  #F0EDFF;   /* lightest tint */
--color-purple-200: #C4B5FD;   /* light accent */
--color-purple-500: #8468EB;   /* primary (main brand) */
--color-purple-700: #5B42C3;   /* mid-dark for gradients */
--color-purple-900: #311B92;   /* darkest depth */
```

## Typography

- **Inter only** — no display/serif pairing. Misma familia para headings y body.
- Headings grandes: tracking `-0.03em`.
- Body: line-height `1.7`.

## Gradients

- Ángulo: preferentemente 135° para transiciones naturales.
- Opacidad de glow: máximo 15-20% para efectos de profundidad sutiles.
- Propósito: guiar atención y añadir profundidad sin saturar.

## Animaciones

- Solo `transform` y `opacity`.
- Spring easing.
- Nunca `transition-all`.
- Keyframes del proyecto viven en `src/app/globals.css`.

## Visual language

- Dark-first. Surface layering: base → elevated → floating.
- Gradients radiales layered + noise grain vía SVG filter.
- Mix-blend-multiply para tratamientos de imagen.

## Referencias a archivos

- Logo: `brand_assets/Logo MyAIMatch.png` (también en `public/logo.png`).
- Design system visual: `brand_assets/Design System 1.png`, `Design System 2.png`, `myaimatch_design_system.html`.
