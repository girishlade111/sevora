# Content Version Discrepancies Ledger

## Discrepancy A: Pricing Amounts
- **User-provided screenshot (`screencapture-sevora-framer-website-2026-11-26-19_06_51.png`)**: Framer `$1,200`, Premium `$2,800`.
- **Live DOM & public text**: Framer `$1,000 USD`, Premium `$2,400 USD`.
- **Resolution**: Default configuration uses live verified values (`$1,000 USD` / `$2,400 USD`). Screenshot values (`$1,200` / `$2,800`) are preserved as an explicit fixture switch (`NEXT_PUBLIC_PRICING_FIXTURE=screenshot` or `?pricing=screenshot`).

## Discrepancy B: Animated Statistics
- **Initial SSR/pre-scroll DOM**: `0+`, `0yr`, `0+`.
- **Settled Live DOM**: Hero `30+`, `8yr`, `40+`; Credibility Bento `+3K clients`, `92%`, `56+`, `4.9`.
- **Resolution**: Implemented IntersectionObserver-driven `AnimatedNumber` counting to verified final values, with `?deterministic=1` and `prefers-reduced-motion` instant settlement.

## Discrepancy C: Long Homepage Scroll Region
- **Observation**: Full-page user screenshot contains a large patterned spacer below the Services section.
- **Live Browser Measurement**: Services container is a `3644px` tall scroll region at `topY: 4382px` with a `position: sticky; top: 96px` viewport (`1152x752px`) transitioning `Development` -> `Visual system` -> `Product design` across scroll progress.
- **Resolution**: Implemented as a `2600px` sticky scroll scene on desktop (`>=900px`) with interactive click tabs and reduced-motion static fallback.

## Discrepancy D: Alternative Hero
- **Discovery**: `/hero-sections` exists in `sitemap.xml` and exposes the published Hero 01 plus two alternate hero blocks. `/home-2` and `/hero-2` returned 404.
- **Resolution**: Primary homepage uses published Hero 01; `/hero-sections` route is also implemented.
