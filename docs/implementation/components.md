# Component & CMS Documentation

## Layout & Primitives
- `SiteHeader` (`src/components/layout/SiteHeader.tsx`): 84px top header, scroll-triggered (`scrollY > 148`) fixed `678x52px` white capsule flyout, and accessible mobile drawer (`<900px`) with Escape key handling.
- `SiteFooter` (`src/components/layout/SiteFooter.tsx`): `1248px` outer layered white rounded frame, `Pages` and `Social` columns, oversized metallic `S SEVORA` artwork with `10%` linear-gradient bottom mask fade, and dark textured attribution bar.
- `AnimatedNumber` (`src/components/primitives/AnimatedNumber.tsx`): IntersectionObserver count-up with `tabular-nums`, `prefers-reduced-motion` support, and `?deterministic=1` fixture mode.
- `CustomSelect` (`src/components/contact/CustomSelect.tsx`): Accessible ARIA `combobox` + `listbox` replacement (zero native `<select>`) supporting ArrowUp/ArrowDown/Home/End/Enter/Space/Escape and typeahead.

## Typed CMS Collections (`src/content/`)
- `projects.ts`: 27 verified records across `AI` (3), `Business` (9), `One page` (2), `Portfolio` (11), `Online course` (2).
- `articles.ts`: 12 verified records across `Web design` (3), `Product design` (3), `UI Design` (6) with structured rich-text blocks and related-article links.
- `home.ts` & `about.ts`: Typed data for Hero, Logos, Benefits, Credibility, Services, Process, Expertise, Testimonials, Pricing (`published` & `screenshot` fixtures), FAQs, Principles, Tools, and Story.
