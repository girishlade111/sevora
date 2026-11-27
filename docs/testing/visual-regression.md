# Visual, Functional, Responsive & Accessibility Verification

All automated checks run against the production Next.js build (`next start -p 3100`).

## Scripts
- `npm test`: Vitest unit & integration suite (`tests/unit/content.test.ts`, `tests/integration/contact-api.test.ts`).
- `node scripts/testing/run_full_audit.mjs`:
  - Verifies HTTP status, document title, and zero broken images across 10 routes (`/`, `/about`, `/projects`, `/articles`, `/contact`, `/hero-sections`, 3 `/articles/[slug]` routes, and 404).
  - Checks horizontal overflow across 4 viewports (`1440x900`, `768x1024`, `390x844`, `320x700`) on all 5 main routes (20 viewport-route combinations).
  - Executes interactive E2E tests (Services tabs, FAQ accordion, Projects Load More `10 -> 20 -> 27` & category filter, Articles Load More `9 -> 12` & category filter, Contact validation & demo-mode submission).
  - Runs `@axe-core/playwright` across `/`, `/about`, `/projects`, `/articles`, and `/contact`.
  - Generates Pixelmatch difference and side-by-side images under `research/comparisons/`.

## Comparison Exclusions
- Framer promotional floating overlays (`Get the template`, `Made in Framer`) are omitted in the independent implementation and account for a portion of the lower-right pixel differences against live Framer captures.
- `articles-full` differs visually below the initial 9-card fold because reference screenshot captured all 12 loaded articles while default initial state renders 9 cards before Load More.
