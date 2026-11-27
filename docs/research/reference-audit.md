# Reference Audit & Route / Content Inventory

- **Reference URL**: https://sevora.framer.website/
- **Template Creator**: Dmytri Ivanov / Stylokit
- **Live Probe Date**: 2026-11-26

## Verified Routes (`sitemap.xml` + Live Playwright Verification)
- `/` (200) — Portrait Hero, Client Logo Strip (8 logos), Benefits (3 cards), Featured Projects (6 cards), Credibility Bento, Interactive Sticky Services (3 services), Process Timeline (6 phases), Expertise Bento (8 cards), Testimonials (3 records + trust CTA), Pricing (2 packages), FAQ (8 items), Metallic Wordmark Footer.
- `/about` (200) — About Hero (portrait + overlapping mug & books + signature), 3 Profile Stats, 3-Step Approach + desk photograph, 4 Principles (card 02 dark), 3 Tool Categories + 5 Floating Tool Cards, Personal Story (`Since 2016`), Project CTA + dark availability panel.
- `/projects` (200) — 27 total projects across 5 categories (`AI`: 3, `Business`: 9, `One page`: 2, `Portfolio`: 11, `Online course`: 2) with Load More pagination (`10 -> 20 -> 27`). All project cards link to external Framer demo sites (`target="_blank"`).
- `/articles` (200) — 12 total articles across 3 categories (`Web design`: 3, `Product design`: 3, `UI Design`: 6) with Load More pagination (`9 -> 12`).
- `/articles/[slug]` (200) — All 12 article detail routes verified, preserving legacy slug `/articles/10-web-design-trends-to-watch-in-2023` for title "Web Design Trends Shaping 2026".
- `/contact` (200) — Two-column Contact form (`Name`, `Email`, `Project type`, `Budget range`, `Message`) and Dark Availability Panel (`sevora-fluid-dark.gif`).
- `/hero-sections` (200) — Alternative hero layout showcase discovered via `sitemap.xml`.
- `/404` / unknown routes (404) — Custom 404 page (`404 error` badge, `Page not found`, `Back to Home`).
- `/robots.txt` & `/sitemap.xml` (200).
- `/style-guide`, `/styleguide`, `/guidelines`, `/home-2`, `/hero-2`, `/integrations`: all returned HTTP `404` on live reference.
