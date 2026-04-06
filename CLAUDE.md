# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**myAIMatch** — AI Tools Directory + Assessment Funnel (`myaimatch.ai`).

## Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Data**: Airtable API (all tool data — never hardcode tool information)
- **AI**: Claude API
- **Email**: Klaviyo
- **Payments**: Stripe
- **Scheduling**: Cal.com

## Commands

```bash
npm run dev       # start dev server
npm run build     # verify build — run after every change
npm run lint      # lint
```

## Code Style

- TypeScript strict mode, ES modules throughout
- Components: `/src/components`
- Pages/routes: `/src/app`
- Use shadcn/ui components wherever possible — do not install other UI libraries

## Design System

- **Theme**: Dark
- **Primary accent**: `#8468EB` (purple)
- **Backgrounds**:
  - `#131313` — darkest / page background
  - `#232323` — cards
  - `#2F2F2F` — elevated surfaces
  - `#343434` — borders
- **Text**: `#FFFFFF` for headings, `#A0A0A0` for body text
- **Gradient**: `linear-gradient(156deg, #232323 15.44%, #8468EB 111.39%)`
- **Border radius**: `rounded-full` (88px) for buttons and pills, `rounded-2xl` for cards
- **Font**: Inter or system sans-serif

## SEO

Every page must include meta title, description, and OG tags.

## Workflow

- Always work on the `dev` branch — never push directly to `main`
- Run `npm run build` after every change to verify
- Commit after every working feature

## IMPORTANT Rules

- **Airtable**: All tool data comes from Airtable. Never hardcode tool information.
- **UI library**: Use shadcn/ui components wherever possible. Do not install other UI libraries.
- **Responsive**: Mobile-first responsive design. Test every component at 375px width.
