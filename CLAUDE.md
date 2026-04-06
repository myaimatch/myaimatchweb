# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**myAIMatch** — AI Tools Directory + Assessment Funnel (`myaimatch.ai`).

## Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Data**: Airtable API (all tool data — never hardcode tool information)
- **AI**: Claude API
- **Email**: Brevo
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

## SEO

Every page must include meta title, description, and OG tags.

## Workflow

- Always work on the `dev` branch — never push directly to `main`
- Commit after every working feature
