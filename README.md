# Sevora — Portfolio Website Reconstruction

An independent, production-quality Next.js (App Router) + TypeScript reconstruction of the **Sevora** portfolio template (`https://sevora.framer.website/`, originally created by Dmytri Ivanov / Stylokit).

## Stack
- **Framework**: Next.js 15 (App Router), React 19, TypeScript (strict)
- **Typography**: `Lora` (500, 600) & `Instrument Sans` (400, 500, 600) via `next/font/google`
- **Styling**: CSS Modules + centralized tokens (`src/styles/tokens.css`, `src/styles/globals.css`)
- **Validation**: `zod` (`POST /api/contact`)
- **Testing & Verification**: Vitest, Playwright, `@axe-core/playwright`, Sharp, Pixelmatch

## Routes Implemented
- `/` — Homepage (Hero portrait + overflow, availability card, animated stats, client logo marquee, 3 benefit previews, 6 featured projects, credibility bento, sticky scroll services with isometric graphics, 6-step process timeline, 8-card expertise bento, testimonials, 2-tier pricing, 8-item FAQ accordion)
- `/about` — About hero with overlapping mug/books cutout & signature, profile stats, 3-step approach, 4 staggered principles, floating tools composition, personal story (`Since 2016`), project CTA
- `/projects` — 27 verified projects across 6 category filters with Load More pagination (`10 -> 20 -> 27`)
- `/articles` — 12 verified articles across 4 category filters with Load More pagination (`9 -> 12`)
- `/articles/[slug]` — Static/SSG rich-text article detail pages for all 12 articles (preserving legacy slug `/articles/10-web-design-trends-to-watch-in-2023`)
- `/contact` — Accessible inquiry form with custom ARIA comboboxes (`Project type`, `Budget range`), client + Zod server validation, and dark availability panel
- `/hero-sections` — Hero showcase route discovered via `sitemap.xml`
- `/404` (`not-found.tsx`), `/sitemap.xml`, `/robots.txt`, `/api/contact`

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```

## Verification Commands

```bash
npm test
npm run typecheck
npm run lint
npm run build
node scripts/testing/run_full_audit.mjs
```

## Attribution & Demonstration Notice
- Original template design created by [Stylokit](https://stylokit.com/).
- Portfolio case records, testimonials, statistics, booking dates, and contact details are preserved as template demonstration fixtures (`NEXT_PUBLIC_DEMO_MODE=true`).
- Contact form submissions run in local demonstration mode unless `CONTACT_WEBHOOK_URL` is configured in `.env`.
