---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces aligned with the MyAIMatch design system. Use this skill when the user asks to build web components, pages, or applications. Generates creative, polished code within the dark-first, purple-led brand identity.
---

This skill guides creation of distinctive, production-grade frontend interfaces for MyAIMatch. Implement real working code with exceptional attention to aesthetic detail — always within the established brand system.

## Design Thinking

Before coding, understand the context and commit to a clear direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Smart, calm, trustworthy — the "knowledgeable friend" who has already done the research. Not hype-driven, not a vendor pitch. The aesthetic is dark, refined, and confident.
- **Constraints**: Technical requirements (Next.js 14, Tailwind CSS, Framer Motion, shadcn/ui).
- **Differentiation**: What makes this component or page section UNFORGETTABLE within the system? The brand is fixed — the creativity lives in layout, composition, motion, and spatial decisions.

**CRITICAL**: Execute within the design system with precision and intention. The brand constraints are not a ceiling — they are the canvas. Maximalism and minimalism both work inside the dark/purple world.

---

## MyAIMatch Design System (Required Tokens)

All components MUST use these values. Never deviate.

### Color
```css
/* Backgrounds — always true black, never gray */
--color-bg:      #000000;
--color-surface: #0d0d0dcc;
--color-card:    rgba(255, 255, 255, 0.04);
--color-border:  rgba(255, 255, 255, 0.08);

/* Purple — the only brand hue */
--color-primary: #814ac8;
--color-accent:  #df7afe;

/* Text hierarchy */
--color-text-primary: #ffffff;
--color-text-muted:   rgba(255, 255, 255, 0.4);
--color-text-dim:     rgba(255, 255, 255, 0.25);

/* Gradients */
--gradient-cta:  linear-gradient(135deg, #814ac8, #a066d4);
--gradient-glow: radial-gradient(ellipse, rgba(129, 74, 200, 0.5), transparent 70%);
--gradient-beam: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(129, 74, 200, 0.45), transparent);
```

**Rule**: Never introduce a second hue family. Purple is the only color. Section depth is created through glow intensity and surface opacity — not light/dark alternation.

### Typography
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Scale */
/* Display  */ font-size: 40–48px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.1;
/* H1       */ font-size: 32–36px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.2;
/* H2       */ font-size: 24px;    font-weight: 600; letter-spacing: -0.01em;
/* H3       */ font-size: 18–20px; font-weight: 600;
/* Body     */ font-size: 15–16px; font-weight: 400; line-height: 1.65; color: rgba(255,255,255,.6);
/* Small    */ font-size: 13px;    font-weight: 400; color: rgba(255,255,255,.4);
/* Label    */ font-size: 10px;    font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #814ac8;
```

**Rule**: Inter is the primary and only typeface. Do not substitute or supplement with display fonts unless building a one-off marketing moment — and even then, Inter must remain the body font.

For scroll-driven hero sections, display text may go up to 6rem+ with tight line-height (0.9–1.0) — this is an extension of the scale, not a replacement.

### Shape Language
```css
/* Radius */
--radius-sm:   4px;   /* icon interiors */
--radius-md:   8px;   /* inner UI, tool logos */
--radius-lg:   12px;  /* panels */
--radius-xl:   18px;  /* cards */
--radius-pill: 999px; /* all CTAs, navbars, inputs, badges */

/* Borders */
/* Default card   */ border: 1px solid rgba(255,255,255,.08);
/* Hover/active   */ border: 1px solid rgba(129,74,200,.4); box-shadow: 0 0 24px rgba(129,74,200,.25);
/* Elevated modal */ box-shadow: 0 15px 35px rgba(0,0,0,.4);
```

**Rule**: All CTAs, navbars, and inputs use `border-radius: 999px`. Cards use 18px. This is non-negotiable.

### Glow System (replaces shadows)
Three glow types — use them, never flat box-shadows:
- **Beam**: vertical purple beam at top-center of sections — `::before` pseudo-element, 2px wide, gradient to transparent. Used on footer, CTA sections.
- **Bloom**: card-level radial glow at bottom-center — 200×80px, blur 8px, rgba(129,74,200,.5). Intensifies on hover.
- **Ambient**: section-level breathing — `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(129,74,200,.45), transparent)`. Background of CTA and hero sections.

---

## Motion (Framer Motion — Required)

All animations use Framer Motion. Never use CSS transitions alone for interactive components.

```
/* Spring config */
Spring: stiffness 300–400 / damping 20–25

/* Card */
Hover lift:   y –8px, spring
3D tilt:      rotateX/Y ±8° from mouse position, spring
Glow reveal:  opacity 0→0.6, scale 1→1.1, 0.3s

/* Search bar */
Expand:       width 240→340px, scale 1→1.05, spring
Particles:    x/y ±20px, 1.5–3s, reverse loop
Click burst:  14 particles, 0.5–1.3s ease-out

/* Page / section enter */
Stagger:      opacity 0→1, y 20→0, 0.5s — label first, then heading, then body, then CTA
Gradient bg:  15s linear loop (3 gradient stops)

/* Button */
Tap: scale 0.95–0.98
```

---

## Scroll-Driven Website Guidelines

For scroll-animated pages and marketing sections.

### Typography at Scale
- Hero headings: **6rem minimum**, tight line-height (0.9–1.0), weight 700–800
- Section headings: **3rem minimum**, weight 600–700
- Horizontal marquee: **10–15vw**, uppercase, letter-spaced
- Section labels: 0.7rem, uppercase, letter-spacing 0.15em+, `color: #814ac8`
- Text hierarchy replaces card containers — size, weight, and opacity ARE the structure

### Section Depth (Not Light/Dark Zones)
Sections don't alternate light/dark — they stay dark. Depth shifts via:
- Glow beam presence/absence
- Surface opacity: `rgba(255,255,255,.04)` card → `rgba(255,255,255,.02)` deep section → `#0d0d0d` solid panel
- Purple ambient intensity: faint glow → strong bloom → full radial beam

### Layout Variety
Every scroll page needs at least 3 different layout patterns:
1. **Centered** — hero sections, CTAs
2. **Left-aligned** — feature descriptions with visual on right
3. **Right-aligned** — alternating features
4. **Full-width** — horizontal marquee, stats rows
5. **Split** — text one side, supporting visual the other

Never use the same layout for consecutive sections.

### Animation Choreography
- Every section uses a DIFFERENT entrance: fade-up, slide-left, slide-right, scale-up, clip-path reveal
- Stagger delays: 0.08–0.12s between elements within a section
- Entry sequence: label → heading → body → CTA
- At least one section pins (fixed) while its contents animate internally
- At least one oversized text element moves horizontally on scroll

### Stats & Numbers
- Display at **4rem+**
- Numbers count up via Framer Motion animate — never appear statically
- Unit suffix at a smaller size
- Labels in small-caps or uppercase muted text below

---

## What Makes This System Creative

The design constraints are fixed (dark, purple, Inter, pill shapes). Creativity lives in:

- **Spatial composition**: Asymmetry, grid-breaking, diagonal flow, overlap, generous negative space
- **Glow choreography**: Where beams appear, how blooms sequence, which elements pulse
- **Glass layering**: Depth through stacked transparencies — rgba at .02, .04, .08
- **Motion timing**: Spring feel vs. eased vs. instant — choosing the right physics for each interaction
- **Layout density**: Controlled density for data-heavy sections vs. vast negative space for emotional sections
- **Scale contrast**: Massive display type next to micro-labels creates tension and hierarchy

---

## Do Not

- Use any background color other than `#000` or `#0d0d0d`
- Introduce any hue other than the purple family
- Use opaque card surfaces (always semi-transparent)
- Use `box-shadow` for depth — use glow radial gradients instead
- Use Inter replacements (no Space Grotesk, no Syne, no display fonts as primary)
- Substitute flat easing for spring physics on interactive elements
- Create light mode variants — this system is dark-only
