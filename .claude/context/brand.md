# Brand

Sistema de diseño concreto. Para reglas de comportamiento al diseñar, ver `.claude/rules/frontend-design.md`.

## Brand assets

Siempre chequear `brand_assets/` antes de diseñar. Contiene logos, design system, style guides y imágenes.
- Si hay logo, usarlo — no placeholder.
- Si hay paleta, typography o animations definidos, usar esos valores exactos — no inventar.

## Color

```css
/* Backgrounds — siempre true black, nunca gris */
--color-bg:      #000000;
--color-surface: #0d0d0dcc;
--color-card:    rgba(255, 255, 255, 0.04);
--color-border:  rgba(255, 255, 255, 0.08);

/* Primary — púrpura de marca */
--color-primary: #814ac8;  /* NO #8468EB — ese era el valor incorrecto */
```

## Typography

- Pairing: display/serif + clean sans. Nunca misma fuente para heading y body.
- Headings grandes: tracking `-0.03em`.
- Body: line-height `1.7`.

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
