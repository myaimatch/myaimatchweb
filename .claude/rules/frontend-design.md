# Frontend Design Guardrails

Reglas de comportamiento al diseñar UI. Los valores concretos (colores, tokens) viven en `.claude/context/brand.md`.

## Siempre hacer primero

- Invocar el skill `frontend-design` antes de escribir código de UI, cada sesión, sin excepciones. El skill vive en `.claude/skills/frontend-design/SKILL.md`.

## Si hay imagen de referencia

- Matchear layout, spacing, typography y color **exactamente**.
- Reemplazar contenido con placeholders (`https://placehold.co/WIDTHxHEIGHT`, copy genérico).
- No "mejorar" ni añadir al diseño — replicarlo.
- Screenshot → comparar contra la referencia → arreglar → screenshot otra vez. Mínimo 2 rondas. Parar solo cuando no queden diferencias visibles o el usuario lo diga.

## Si NO hay referencia

- Diseñar con alta artesanía siguiendo los guardrails de abajo.

## Anti-Generic Guardrails

| Aspecto | Regla |
|---|---|
| **Colors** | Nunca paleta default de Tailwind (indigo-500, blue-600). Usar brand color custom y derivar. |
| **Shadows** | Nunca `shadow-md` plano. Layered, color-tinted, baja opacidad. |
| **Typography** | Nunca misma fuente para heading y body. Pairing display/serif + sans limpia. Tracking `-0.03em` en headings grandes, line-height `1.7` en body. |
| **Gradients** | Layer múltiples radial gradients. Añadir noise/grain vía SVG filter. |
| **Animations** | Solo `transform` y `opacity`. Nunca `transition-all`. Spring easing. |
| **Interactive states** | Todo clickable: hover, focus-visible, active. Sin excepciones. |
| **Images** | Gradient overlay (`bg-gradient-to-t from-black/60`) + color layer con `mix-blend-multiply`. |
| **Spacing** | Tokens intencionales y consistentes — no Tailwind steps random. |
| **Depth** | Sistema de capas (base → elevated → floating). No todo al mismo z-plane. |

## Hard Rules

- No añadir secciones, features ni contenido que no estén en la referencia.
- No "mejorar" un diseño de referencia — matchearlo.
- No parar después de un solo screenshot.
- No usar `transition-all`.
- No usar default Tailwind blue/indigo como primary.

## Defaults de output (prototipos sueltos)

- Un solo `index.html` con estilos inline, salvo que se pida otra cosa.
- Tailwind vía CDN: `<script src="https://cdn.tailwindcss.com"></script>`.
- Placeholders: `https://placehold.co/WIDTHxHEIGHT`.
- Mobile-first responsive.
