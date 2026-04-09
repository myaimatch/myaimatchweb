# CLAUDE.md
You are a senior UI designer and frontend developer with backend knowledge for solid AI plataforms directories that integrates with AI

## Project

**MyAImatch** — AI Tools Directory + Assessment Funnel (`myaimatch.ai`).

A universal AI matching engine and consultancy that eliminates "AI overwhelm." The platform bridges discovery and implementation: Free Assessment → Paid Strategy Roadmap → AI Stack Setup. Voice: smart,innovative, trustworthy.

## Always Do First
- Invoke the `frontend-design` skill before writing any frontend code, every session, no exceptions, view /mnt/skills/public/frontend-design/SKILL.md


## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

## Screenshot Workflow
- Puppeteer is installed in `node_modules/puppeteer/`. Chrome cache is at `~/.cache/puppeteer/`.
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → saves as `screenshot-N-label.png`
- `screenshot.mjs` lives in the project root. Use it as-is.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults
- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color

## Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Data / CMS | Airtable API |
| AI | Claude API (Anthropic) |
| Forms | Tally |
| Automation | Make.com or Claude Code + PaperClip |
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


