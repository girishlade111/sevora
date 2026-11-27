# Design System, Typography & Background Forensics

## Typography (Verified via `document.fonts` & CDP `CSS.getPlatformFontsForNode`)
- **Display Serif**: `Lora` (weights `500`, `600`).
  - Hero H1: `72px` / `72px`, weight `500`, letter-spacing `-1.44px` (`-0.02em`), color `rgb(18, 18, 24)`.
  - Section H2: `36px` / `48px`, weight `600`, letter-spacing `-0.72px`.
  - Big Stat / Pricing H1: `56px` / `64px`, weight `600`, letter-spacing `-1.12px`.
- **Body & UI Sans**: `Instrument Sans` (weights `400`, `500`, `600`).
  - Hero Lead: `18px` / `28px`, weight `400`, letter-spacing `-0.36px`, color `rgb(68, 69, 76)`.
  - Card H3: `24px` / `32px`, weight `500`, letter-spacing `-0.48px`.
  - Project Card H4: `20px` / `30px`, weight `500`, letter-spacing `-0.8px`.
  - Footer Links: `14px` / `20px`, weight `500`, letter-spacing `-0.14px`, color `rgb(97, 100, 107)`.

## Background Pattern (Browser-Measured)
- `background-color: rgb(247, 247, 248)` (`#F7F7F8`)
- `background-image: repeating-linear-gradient(145deg, rgb(237, 238, 241), rgb(237, 238, 241) 1px, rgba(0, 0, 0, 0) 1px, rgba(0, 0, 0, 0) 4px)`

## Layout Geometry
- Desktop Header: `84px` height, `1152px` inner content width (`144px` gutters at `1440px`).
- Scroll Flyout Capsule: Fixed centered `678px x 52px`, `border-radius: 12px`, `background: #ffffff`, activates past `scrollY > 148`.
- Hero Panel: `1152px x 612px`, `border-radius: 32px`, portrait extends `88px` above panel top.
- Footer Shell: `1248px` outer width, `24px` outer radius, `18px` inner radius, `10%` bottom mask fade over metallic wordmark.
