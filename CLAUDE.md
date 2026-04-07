# CLAUDE.md

This file is Claude Code's memory for the myAIMatch project. Read it at the start of every session. Follow every rule during every session.

---

## Project

**myAIMatch** — AI Tools Directory + Assessment Funnel (`myaimatch.ai`).

A universal AI matching engine and consultancy that eliminates "AI overwhelm." The platform bridges discovery and implementation: Free Assessment → Paid Strategy Roadmap ($200–$800) → AI Stack Setup ($1,500–$5,000). Voice: smart, calm, trustworthy — a knowledgeable friend, not a hype-driven vendor.

---

## Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Data / CMS | Airtable API |
| AI | Claude API (Anthropic) |
| Forms | Tally |
| Automation | Make.com |
| Email | Klaviyo |
| Payments | Stripe |
| Scheduling | Cal.com |

---

## Commands

```bash
npm run dev       # start dev server at localhost:3000
npm run build     # verify build — run after every change
npm run lint      # lint
```

---

## Workflow (Non-Negotiable)

1. Always work on the `dev` branch. Never push directly to `main`.
2. Start every new feature in **Plan Mode** — read existing files first, propose approach, wait for approval before writing code.
3. Run `npm run build` after every change to verify. Fix errors before moving on.
4. Commit after every working feature with a descriptive message.
5. `/clear` between tasks — never carry polluted context from one task to the next.

---

## Code Style

- TypeScript strict mode, ES modules throughout
- Components → `/src/components`
- Pages / routes → `/src/app`
- Use shadcn/ui components wherever possible — do not install other UI libraries
- **Never hardcode tool or market data.** All tool information comes from Airtable via API.

---

## SEO (Required on Every Page)

Every page must include:
- `<title>` meta tag
- `<meta name="description">`
- Open Graph tags (`og:title`, `og:description`, `og:url`, `og:type`)
- Clean URL structure: `/tools/[slug]`, `/compare/[tool-a]-vs-[tool-b]`, `/blog/[slug]`
- JSON-LD structured data on tool detail and comparison pages

---

## Design System

### Theme
Dark mode only.

### Colors (use these exact values — do not use default Tailwind palette)
| Role | Value |
|---|---|
| Page background | `#131313` |
| Card background | `#232323` |
| Elevated surface | `#2F2F2F` |
| Border | `#343434` |
| Primary accent | `#8468EB` |
| Heading text | `#FFFFFF` |
| Body / muted text | `#A0A0A0` |
| CTA gradient | `linear-gradient(156deg, #232323 15.44%, #8468EB 111.39%)` |
| Hero radial glow | `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(132,104,235,0.15) 0%, #131313 70%)` |

### Typography
- Font: Inter or system sans-serif
- Large headings: tight tracking (`letter-spacing: -0.03em`), `font-weight: 700`
- Body text: generous line-height (`1.7`)
- Never use the same weight for headings and body at the same visual level

### Spacing & Depth
- Use consistent spacing tokens — not arbitrary Tailwind steps
- Surfaces must have a layering system: base → elevated → floating (not all at the same z-plane)
- Cards: `rounded-2xl`, border `#343434`, background `#2F2F2F`
- Buttons / pills: `rounded-full`

### Shadows
- Never use flat `shadow-md`
- Use layered, color-tinted shadows with low opacity
- Accent shadow: `0 0 24px rgba(132, 104, 235, 0.1)`

### Gradients & Texture
- Layer multiple radial gradients for depth
- Add grain/texture via SVG noise filter on hero sections where appropriate

### Animations
- Only animate `transform` and `opacity`
- **Never use `transition-all`**
- Use spring-style easing (`cubic-bezier(0.34, 1.56, 0.64, 1)` for scale, ease-out for fades)

### Interactive States
Every clickable element must have:
- `hover` state
- `focus-visible` state (keyboard accessible)
- `active` state
No exceptions.

---

## Frontend Rules

### Before Writing Any Frontend Code
Invoke the `frontend-design` skill first — every session, no exceptions:
```
view /mnt/skills/public/frontend-design/SKILL.md
```

### Reference Images
- If a reference image is provided: match layout, spacing, typography, and color **exactly**. Swap in placeholder content where needed. Do not improve or add to the design.
- If no reference: design from scratch with high craft using the design system above.
- After building: screenshot → compare → fix mismatches → screenshot again. Do at least 2 comparison rounds. Stop only when no visible differences remain or user approves.

### Screenshot Workflow (when verifying UI)
- Always screenshot from `localhost:3000`, never from a `file:///` URL
- After screenshotting, read the PNG and analyze it directly — be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

### Anti-Generic Guardrails
- **Colors**: Never use default Tailwind palette (indigo-500, blue-600, etc.). Use the design system above.
- **Images**: Add gradient overlays (`bg-gradient-to-t from-black/60`) where images appear
- **Responsive**: Mobile-first. Test every component at 375px width. Directory grids: 1 column mobile → 2–3 desktop. Comparison tables scroll horizontally on mobile.

### Hard Rules
- Do not add sections, features, or content not in the reference or spec
- Do not "improve" a reference design without being asked — match it
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color
- Do not hardcode tool data — ever

---

## Key Pages & Routes

| Route | Purpose |
|---|---|
| `/` | Homepage: hero, search, category grid, deals, assessment CTA |
| `/directory` | Tool grid with filters and categories (data from Airtable) |
| `/tools/[slug]` | Individual tool detail pages (static, generated from Airtable) |
| `/compare/[tool-a]-vs-[tool-b]` | Side-by-side comparison (Versus-style, SEO URL) |
| `/assessment` | Free Tech Stack Assessment (Tally embed) |
| `/services` | Full Strategy Assessment + AI Stack Setup pages with Cal.com + Stripe |
| `/blog/[slug]` | MDX blog posts (comparison articles, "Tool A vs Tool B") |

---

## Airtable Schema Reference

**AI Tools table fields (do not hardcode — fetch from Airtable):**
`name`, `slug`, `category`, `subcategory`, `pricing_model`, `price_from`, `price_to`, `description`, `features`, `affiliate_link`, `logo_url`, `website_url`, `g2_score`, `trustpilot_score`, `review_snippet_1`, `review_source_1`, `review_url_1`, `comparison_specs`, `last_verified_date`

**Leads/CRM table:**
`name`, `email`, `business_type`, `team_size`, `assessment_date`, `assessment_result`, `paid_services`, `stripe_payment_id`, `status`

---

## Assessment Automation Flow

Tally form submission → Make.com webhook → Claude API (generate personalized recommendations) → Klaviyo (deliver email with branded PDF report) → Airtable CRM (log lead)

---

## When Things Break

1. Build fails → paste error, ask Claude to fix root cause, run build to verify
2. Same mistake twice → `/clear`, rewrite prompt with the exact error and what NOT to do
3. Visual looks wrong → paste screenshot, describe what it should look like
4. Want to undo → `Escape + Escape` to open rewind menu, or `git revert [hash]`

---

## Daily Mantra

**Plan → Code → Verify → Commit → /clear → Repeat.**
