# Implementation Architecture

- **Framework**: Next.js 15 App Router + React 19 + TypeScript (strict mode)
- **Styling**: CSS Modules + centralized design tokens in `src/styles/tokens.css` and `src/styles/globals.css`
- **Fonts**: `next/font/google` (`Lora` 500/600, `Instrument Sans` 400/500/600)
- **Validation**: `zod` schema validation in `POST /api/contact`
- **Configuration**: `src/config/site.ts` and `.env.example`

## Directory Structure
- `src/app/`: Route entry points (`/`, `/about`, `/projects`, `/articles`, `/articles/[slug]`, `/contact`, `/hero-sections`, `/api/contact`, `not-found.tsx`, `sitemap.ts`, `robots.ts`)
- `src/components/`: `layout/`, `primitives/`, `home/`, `about/`, `projects/`, `articles/`, `contact/`
- `src/content/`: Typed CMS data collections (`projects.ts`, `articles.ts`, `home.ts`, `about.ts`)
- `src/types/`: Shared TypeScript interfaces (`content.ts`)
- `tests/`: Vitest unit and integration tests (`tests/unit/`, `tests/integration/`)
- `scripts/`: Playwright research, asset extraction, and visual/a11y verification scripts
