01. PROJECT OVERVIEW

Website: Sevora
Reference URL: https://sevora.framer.website/
Framework: Next.js 15.5.29 (App Router) + React 19 + TypeScript 5.8.3
Architecture: Independent modular App Router application with CSS Modules, centralized CSS custom properties (src/styles/tokens.css), typed local CMS collections (src/content/*), and Zod-validated /api/contact endpoint
Libraries: next, react, react-dom, lucide-react, motion, zod; dev: @playwright/test, @axe-core/playwright, sharp, pixelmatch, pngjs, vitest, eslint
Implementation status: Completed and verified against production preview build (next build + next start)
Development server: npm run dev (not kept running; verified via production server)
Production preview: Verified via next start -p 3100 -H 127.0.0.1 in scripts/testing/run_full_audit.mjs

02. REFERENCE RESEARCH

Main routes: /, /about, /projects, /articles, /contact (all verified 200 OK)
Initial article routes: 9 initial slugs verified (/articles/crafting-exceptional-user-experiences through /articles/the-art-of-responsive-web-design)
Additional routes: /hero-sections (discovered in sitemap.xml), /404 (custom 404 page), /robots.txt, /sitemap.xml, plus 3 Load More article routes (/articles/boosting-website-performance-with-smart-design-practices, /articles/crafting-exceptional-user-interfaces, /articles/mastering-mobile-ui-design-best-practices-for-a-seamless-experience)
Internal project detail routes: None (all 27 project cards link externally to separate demo domains; verified zero internal project detail routes in sitemap.xml)
Alternative layouts: /hero-sections (exists in sitemap.xml; /home-2, /hero-2, /style-guide, /styleguide, /guidelines, /integrations all returned 404)
Reference screenshots: 6 user-provided full-resolution PNGs stored in research/reference/screenshots/user-provided/ (all 1910px wide: home x2 1910x16196, about 1910x6593, projects 1910x4840, articles 1910x3208, contact 1910x2391) plus Playwright captures at 1440x900, 768x1024, and 390x844
Verified technologies: Framer site runtime, repeating-linear-gradient background pattern, SVG <symbol> sprite logos, <canvas> isometric service layers, WebGL/Canvas Shader footer wordmark, AnimatedNumber counters
Unavailable reference information: Original Framer project source, private contact form submission endpoint, and third-party stock/project commercial license documents beyond Framer Marketplace Limited license notice

03. CONTENT RECONCILIATION

Initial projects: 10 (Brandora, Nivora, Codify, Neutra, Snapkit, Todofusion, Grido, Trainly, Landify, Thinkbot)
Additional projects: 17 discovered via Load More steps [10 -> 20 -> 27] (Groomix, Studyflow, AI Nest, Gradia, Designor, Pixor, Residra, Kavro, Taskify, Flexify, Nexus AI, Dailyhub, Agentify, Protify, Startify, Flowboard, Platify)
Final project count: 27 across 5 disjoint categories (AI: 3, Business: 9, One page: 2, Portfolio: 11, Online course: 2)
Initial articles: 9
Additional articles: 3 discovered via Load More [9 -> 12]
Final article count: 12 across 3 categories (Web design: 3, Product design: 3, UI Design: 6)
Pricing screenshot values: $1,200 (Framer), $2,800 (Premium) — preserved via NEXT_PUBLIC_PRICING_FIXTURE=screenshot or ?pricing=screenshot
Pricing stable reference values: $1,000 USD (Framer), $2,400 USD (Premium) — default rendered fixture
Verified final statistics: Hero settled values 30+ Projects completed, 8yr Experience, 40+ Happy clients; Credibility Bento +3K clients, 92% Client satisfaction, 56+ Projects completed, 4.9 rating
Reference version differences: Discrepancies A (pricing), B (zero initial vs settled counters), C (3644px sticky scroll container for Services), D (/hero-sections showcase) all documented in research/manifests/discrepancies.json
Legacy article routes: /articles/10-web-design-trends-to-watch-in-2023 preserved verbatim for title "Web Design Trends Shaping 2026" (published November 22, 2023)

04. DESIGN SYSTEM

Verified display font: Lora (weights 500, 600; loaded via next/font/google; measured via document.fonts and CDP CSS.getPlatformFontsForNode)
Verified body font: Instrument Sans (weights 400, 500, 600)
Font weights: Lora 500/600; Instrument Sans 400/500/600
Typography scale: Hero H1 72px/72px (-1.44px), Section H2 36px/48px (-0.72px), Big Stat/Pricing 56px/64px (-1.12px), Card H3 24px/32px (-0.48px), Project H4 20px/30px (-0.8px), Hero Lead 18px/28px (-0.36px), Body 16px/24px, Footer nav 14px/20px (-0.14px)
Primary colors: #F7F7F8 page bg, #EDEEF1 pattern line, #FFFFFF white surface, #121218 primary text & dark base, #24242A dark card gradient top, #44454C secondary text, #61646B footer link, #E0E2E6 subtle border
Background pattern: repeating-linear-gradient(145deg, rgb(237, 238, 241), rgb(237, 238, 241) 1px, rgba(0, 0, 0, 0) 1px, rgba(0, 0, 0, 0) 4px)
Light surfaces: #FFFFFF cards and subtle vertical gradient hero container (#F3F3F5 -> #EBECEE)
Dark surfaces: linear-gradient(180deg, #24242A 0%, #121218 100%) with optional grayscale-filtered animated fluid texture
Button system: Dark gradient primary button (#2B2B33 -> #121218, radius 8px-10px), light bordered secondary button, dark pill filter tabs, light Load More button, white CTA inside dark Premium pricing card
Shadow system: Subtle soft shadows (--shadow-soft), floating card shadow (--shadow-floating), deep dark panel shadow (--shadow-dark-panel), claymorphic inset+outer tool card shadow (--shadow-tool-clay)
Container widths: Header & main container 1152px (144px gutters at 1440px), Footer 1248px, Article reading column 580px (780px cover)
Breakpoints: Base mobile layout (<720px / 768px), tablet/grid transition at 720px / 768px, full desktop layout at 900px / 1024px

05. ORIGINAL ASSET DISCOVERY

Total resource references: 61 binary/SVG asset downloads logged in research/manifests/assets.json + 8 extracted SVG client logos + 3 service state captures + 1 footer shader wordmark capture
Unique images: 61 unique SHA-256 verified files across hero, about, benefits, projects, articles, testimonials, contact, textures, brand
Portrait assets: sevora-monochrome-portrait.png (2244x1904 transparent PNG), sevora-profile-portrait.jpg (2244x2244)
Project thumbnails: 27 project cover assets in public/assets/images/projects/
Article covers: 12 article cover images in public/assets/images/articles/
SVG assets: sevora-mark.svg, client-logo-1..8.svg (extracted from Framer <symbol> definitions), framer-logo-badge.svg, Figma/Photoshop/Webflow tool SVGs
Font assets: Lora and Instrument Sans loaded cleanly via next/font/google (SIL Open Font License)
Animated media: sevora-fluid-dark.gif (500x500 animated monochrome fluid GIF)
Footer artwork: sevora-wordmark-shader.png (captured 2x from live Framer Shader component and trimmed to 2176x328)
Duplicate resources: Deduplicated via SHA-256 in scripts/extraction/extract_svgs_and_prepare_assets.py

06. ORIGINAL ASSET ACQUISITION

Authorized original assets: 61 reference media/icon assets archived in assets-source/original/ and mapped in public/assets/
Optimized derivatives: Trimmed footer wordmark and deduplicated delivery assets under public/assets/
Independent reconstructions: Benefit Card 01 (Design System preview), Benefit Card 02 (Analytics SVG chart), Benefit Card 03 (Framer Expert preview card), CustomSelect ARIA combobox
Generated replacements: None (all photographic, texture, logo, and project/article media acquired directly from public reference resources or reconstructed as UI/SVG)
Unavailable assets: Raw WebGL shader source for Footer S SEVORA wordmark (replaced with 2x captured raster + CSS bottom fade mask) and raw vector source for the 3 <canvas> isometric service layers (captured at 2x without Framer promo overlay)
Unresolved licensing: Third-party stock photography, Kinfolk/Aesop book-spine artwork in books-and-black-mug.png, and portfolio project thumbnails carry template-demo attribution only; flagged under NEXT_PUBLIC_DEMO_MODE=true
Asset manifest: research/manifests/assets.json

07. HOMEPAGE

Hero: Left-aligned Lora 72px headline ("Craft better / brands, faster") with muted "faster", description, 2 CTAs, 3 AnimatedNumber stats
Portrait: Monochrome cutout extending 88px above the 612px hero panel top edge, clipped bottom-right at 32px radius
Availability card: Translucent blurred dark overlay card at bottom-right linking to /contact
Statistics: 30+ Projects completed, 8yr Experience, 40+ Happy clients; Credibility +3K clients, 92% Client satisfaction, 56+ Projects completed, 4.9 rating
Logo strip: 8 monochrome SVG logos in infinite horizontal marquee with edge fade mask and reduced-motion wrap fallback
Benefits: 3 equal cards with reconstructed Design System UI, SVG Analytics chart (Aug 3, 2026 / 9,706 / 6,816), and Framer Expert notification UI
Featured projects: 2x3 grid of Brandora, Nivora, Codify, Neutra, Snapkit, Todofusion linking externally
Credibility bento: Asymmetric 3-column bento with overlapping client avatars, animated 92% and 56+, live availability dot, and dark 4.9 rating panel
Services: Sticky 2600px scroll container on desktop with 3 interactive tabs (Development, Visual system, Product design)
Isometric graphic: 3 verified high-res isometric states crossfading cleanly on scroll or click
Scroll scenes: Sticky Services scene + sticky Process left heading column
Process: 6 vertical steps (Discovery, Strategy, Direction, Design, Development, Delivery) with connector line and proximity highlight
Expertise: 5-column asymmetric bento (Affordability, Consistency, Scalability, wide dark Speed card with fluid GIF, Flexibility, wide Diversity card, Support, Convenience)
Testimonials: Asymmetric 3-column layout (tall dark Ethan Brooks card, Maya Chen + "Trusted by 24+ clients", "Let's work together" CTA + Liam Carter)
Pricing: 2 centered cards (light Framer, dark Premium with fluid texture) supporting both published and screenshot price fixtures
FAQ: 8 accessible button-triggered accordion items with verified reference Q&A text

08. ABOUT PAGE

Hero: "About me" badge, Lora heading, bio, signature PNG
Portrait: Warm square studio portrait (2244x2244)
Foreground assets: Independent transparent books-and-black-mug.png overlapping bottom-left corner of portrait
Signature: sevora-signature.png placed in hero and personal story author block
Statistics: 3 horizontal cards (8+ Years of experience, 24+ Happy clients, Available For new project)
Approach: Sticky/left 3-step list (Strategy first, Clear direction, Refined execution) paired with design-approach-workspace.png
Principles: 4 staggered cards (01 Clarity first, dark elevated 02 Purposeful details, 03 Simple systems, 04 Thoughtful execution)
Tools: Left 3 numbered categories (Design, Build, Motion) + right tilted (-7deg) composition of Framer link card and 4 claymorphic-shadowed cards (Figma, illustrator, Photoshop, Webflow)
Story: Studio workspace photo with "Since 2016 / Design & digital experiences" glass overlay + 3 narrative paragraphs + signature
Project CTA: Rounded light outer shell with Get in touch / View projects CTAs, service tags, and dark availability panel

09. PROJECTS PAGE

Initial records: 10 projects rendered in 2-column grid
Additional records: 17 more projects loaded in batches of 10 (10 -> 20 -> 27)
All filters: All projects, AI (3), Business (9), One page (2), Portfolio (11), Online course (2)
Load More: Functional client pagination resetting to 10 on category switch and hiding button once exhausted
External destinations: All 27 external URLs verified (including Thinkbot's https://thinkbot.framer.ai/) with target="_blank" rel="noopener noreferrer"
Thumbnail fidelity: 4:3 framed thumbnails using local deduplicated assets
Responsive grid: 1 column on mobile, 2 columns >= 768px

10. ARTICLES

Article records: 12 verified articles
Category filters: All articles (12), Web design (3), Product design (3), UI Design (6)
Load More: Functional pagination (9 -> 12)
Detail routes: All 12 SSG routes generated under /articles/[slug], including legacy 2023 slug
Metadata: Unique page title, description, OpenGraph article metadata, and cover image per route
Article content: Structured rich-text blocks (h2, h3, p, ul, ol, quote) extracted from all 12 reference routes
Related articles: 3-column Related articles grid on every detail page
Responsive reading layout: Centered header (700px), cover (780px), reading column (580px)

11. CONTACT

Form: Pale gray rounded card with 5 field groups (Name, Email, Project type, Budget range, Message) + honeypot + full-width dark submit button
Project-type options: Brand identity, Website design, Framer development, Product design, Landing page, Other
Budget options: Under $1,000, $1,000 - $3,000, $3,000 - $5,000, $5,000 - $10,000, $10,000+, Not sure yet
Validation: Client-side validation + server-side Zod schema validation + duplicate-submit guard
Backend: POST /api/contact with rate limiting, honeypot check, optional CONTACT_WEBHOOK_URL forwarding, and explicit local demo mode fallback
Submission behavior: Displays validation errors inline with aria-invalid/role="alert"; clears fields and shows demo-mode confirmation banner on 200 OK
Availability panel: Dark card with circular arrow icon, "Available for selected projects", "Currently accepting new projects"
Animated background: sevora-fluid-dark.gif with grayscale/contrast filter and lower dark gradient fade
Contact information: Email (mailto:hello@sevora.com), Location (Tallinn, Estonia / Remote), Responsive time (Within 24 hours)

12. FOOTER

Outer shell: 1248px max-width layered frame with outer 24px radius and inner white 18px radius card
Navigation: Pages column (Home, About, Projects, Articles, Contact)
Social links: X link, Linkedin, Dribbble (external with rel="noopener noreferrer")
Metallic artwork: Oversized S SEVORA wordmark spanning card width
Artwork technology: 2x high-res capture of Framer shader wordmark (trimmed to 2176x328) with CSS bottom linear-gradient mask
Fade: -webkit-mask-image / mask-image linear-gradient(0deg, rgba(0,0,0,0) 8%, rgb(0,0,0) 96%)
Attribution: Retained "© Sevora Template | Created by Stylokit"; replaced "Made in Framer" with "Independent Next.js Reconstruction"
Promotional overlay treatment: Omitted Framer "Get the template" and floating "Made in Framer" promotional badges

13. MOTION

Verified effects: AnimatedNumber count-up, infinite logo marquee, sticky Services scroll progression, Process proximity highlight, FAQ icon rotation, card hover scale/elevation, animated dark fluid GIF, scroll-triggered floating header capsule
Implemented effects: All verified effects implemented independently without proprietary Framer runtime
Measured timings: AnimatedNumber 1100ms easeOutCubic; logo marquee 30s linear infinite; flyout header 220ms cubic-bezier(0.22, 1, 0.36, 1); hover transforms 160ms-420ms
Animated numbers: IntersectionObserver trigger with instant settlement on prefers-reduced-motion or ?deterministic=1
Service transitions: Scroll-progress thresholds (0.34 / 0.68) with manual click override and 280ms image crossfade
Scroll scenes: 2600px sticky Services viewport on desktop (>=900px); sticky left column on ProcessTimeline
Responsive motion: Sticky Services scroll disabled below 900px for clean mobile stacking
Reduced motion: Global @media (prefers-reduced-motion: reduce) disables transitions/animations, flattens sticky scenes, wraps client logos statically, and shows final counter numbers immediately
Unverified behavior: Sub-frame WebGL shader dynamics of the footer metallic wordmark beyond static 2x frame capture

14. RESPONSIVE TESTING

Desktop: Tested at 1440x900 across /, /about, /projects, /articles, /contact — 0 horizontal overflows
Tablet: Tested at 768x1024 across all 5 main routes — 0 horizontal overflows
Mobile: Tested at 390x844 and 320x700 across all 5 main routes — 0 horizontal overflows
Breakpoint transitions: Mobile base -> 720px/768px multi-column grids -> 900px/1024px full desktop hero/header/bento layouts
Overflow: scrollWidth === innerWidth verified on all 20 viewport-route combinations
Remaining issues: None detected at tested breakpoints; Firefox and WebKit engines not executed in this environment (Chromium 136 headless only)

15. VISUAL REGRESSION

Routes compared: /, /about, /projects, /articles, /contact at 1440x900
Viewports compared: 1440x900 against live Playwright reference captures
Sections compared: Above-the-fold Hero (home-top) and full-page layouts (contact-full, about-full, projects-full, articles-full)
Pixel differences: home-top 5.24% (67,894 / 1,296,000 px), contact-full 12.55%, about-full 23.65%, projects-full 23.95%, articles-full 33.47%
SSIM where measured: Not separately computed (Pixelmatch pixel-diff metrics recorded in research/comparisons/*/metrics.json)
Geometry differences: Reference full-page heights vs implementation: contact 1913 vs 1734, projects 3872 vs 3754, about 5275 vs 4665, articles 2983 (12 loaded) vs 2348 (9 initial before Load More)
Typography differences: Matched Lora and Instrument Sans weights, sizes, and tracking
Pattern differences: Matched exact repeating-linear-gradient(145deg, rgb(237, 238, 241) 1px, transparent 4px) over #F7F7F8
Asset differences: Live Framer promotional floating overlays omitted; footer bottom strip shows "Independent Next.js Reconstruction" instead of "Made in Framer"
Motion differences: Static deterministic comparison mode (?deterministic=1) verified final states
Comparison artifacts: research/comparisons/{home,about,projects,articles,contact}/desktop-1440/*/difference.png, side-by-side.png, metrics.json

16. ITERATIVE CORRECTIONS

Discrepancies discovered: (1) Visible "(required)" label on CustomSelect due to missing .sr-only utility, (2) Default 3 min read on all articles instead of per-article verified minutes, (3) Axe aria-prohibited-attr on star rating divs without role="img", (4) Axe heading-order h1->h3 skip on /projects, (5) Axe color-contrast on #8B5CF6 badgeExpert pill, (6) Flat Principles row instead of staggered desktop cascade on /about, (7) Dark bottom sliver on initial wordmark crop
Discrepancies corrected: All 7 items fixed, rebuilt, and re-verified with 0 axe violations across all 5 main routes
Remaining discrepancies: Full-page vertical spacing offsets on inner pages (documented in research/manifests/discrepancies.json) and omitted Framer promotional widgets
Comparison iterations: 2 full production build + Playwright + Pixelmatch + Axe cycles
Discrepancy ledger: research/manifests/discrepancies.json

17. PERFORMANCE

Lighthouse results: Not executed (Lighthouse CLI not run against local server)
LCP: Not measured via field/Lighthouse run
CLS: Not measured via field/Lighthouse run
INP where actually measured: Not measured
Optimization changes: next/font/google self-hosted font subsetting, SHA-256 asset deduplication, eager loading on above-the-fold hero/top cards, lazy loading on lower cards and footer wordmark, 103 kB shared First Load JS
Measurement conditions: Next.js production build metrics reported by next build; Chromium headless audit verified zero broken images and zero network errors

18. ACCESSIBILITY

Automated checks: @axe-core/playwright run on /, /about, /projects, /articles, /contact — 0 violations on all 5 routes (44-45 passes each)
Keyboard verification: CustomSelect supports ArrowUp/ArrowDown/Home/End/Enter/Space/Escape/typeahead; mobile drawer supports Escape; skip-to-content link and :focus-visible rings implemented
Reduced-motion verification: Verified CSS prefers-reduced-motion rules across globals, marquee, sticky sections, and AnimatedNumber
Form accessibility: Associated labels, aria-invalid, aria-describedby error alerts, role="combobox" + role="listbox" custom selects, live status region on submission
Remaining issues: Manual screen-reader walkthrough (NVDA/VoiceOver) not performed in this headless environment

19. TEST RESULTS

Tests executed: 5 Vitest tests (tests/unit/content.test.ts, tests/integration/contact-api.test.ts) + Playwright audit across 10 routes, 20 viewport-overflow checks, 4 page interaction suites, and 5 Axe scans
Passed: 5/5 Vitest tests; 10/10 route HTTP/title/image checks; 20/20 overflow checks; 4/4 interactive suites; 5/5 zero-violation Axe scans
Failed: 0
Skipped: 0
Broken links: 0 internal broken links or missing assets detected across verified routes
Missing assets: 0 broken images (brokenImgs: [])
Console errors: 0
Network errors: 0

20. BUILD VERIFICATION

Type checking: npm run typecheck (tsc --noEmit) — exited 0
Linting: npm run lint (eslint .) — exited 0 (warnings only for native <img> elements intentionally used for unoptimized local assets)
Production build: npm run build (next build) — exited 0, generated 24/24 routes
Production preview: Verified live HTTP serving and headless Chromium rendering on http://127.0.0.1:3100

21. FILES CREATED OR MODIFIED

Routes: src/app/layout.tsx, page.tsx, about/page.tsx, projects/page.tsx, articles/page.tsx, articles/[slug]/page.tsx, contact/page.tsx, hero-sections/page.tsx, not-found.tsx, api/contact/route.ts, sitemap.ts, robots.ts
Components: src/components/layout/{SiteHeader,SiteFooter}*, src/components/primitives/{AnimatedNumber,SectionBadge}*, src/components/home/{HeroSection,ClientLogoStrip,BenefitsSection,FeaturedProjectsSection,CredibilityBento,ServicesSection,ProcessTimeline,ExpertiseBento,TestimonialsSection,PricingSection,FaqAccordion}*, src/components/about/AboutPageView*, src/components/projects/{ProjectCard,ProjectsDirectory}*, src/components/articles/{ArticleCard,ArticleDetailView,ArticlesDirectory}*, src/components/contact/{CustomSelect,ContactPageView}*
Content: src/content/{projects,articles,home,about}.ts, src/config/site.ts, src/types/content.ts
Styles: src/styles/{tokens,globals}.css
Assets: assets-source/original/*, public/assets/*
Animations: CSS keyframes & IntersectionObserver / scroll-progress modules inside respective components
Scripts: scripts/research/*, scripts/extraction/*, scripts/testing/run_full_audit.mjs
Tests: tests/unit/content.test.ts, tests/integration/contact-api.test.ts, vitest.config.ts
Documentation: README.md, docs/research/{reference-audit,content-version-discrepancies,design-system,asset-inventory}.md, docs/implementation/{architecture,components}.md, docs/testing/visual-regression.md, research/manifests/{assets,routes,discrepancies,interactions,animations}.json, research/reports/audit_report.json

22. KNOWN LIMITATIONS

Unavailable resources: Private Framer source project, backend email delivery credentials, and WebGL shader source for footer wordmark
Unverified reference states: Cross-browser rendering in Firefox/WebKit and Lighthouse/Core Web Vitals scores were not measured
Version differences: Live pricing ($1,000 / $2,400) differs from user screenshot ($1,200 / $2,800); both supported via configuration
Replacement media: None generated; 3 Benefit card UI previews were independently reconstructed in HTML/CSS/SVG, and footer metallic wordmark uses a 2x capture of the reference shader
Licensing limitations: Reference template photography, brand marks, and project thumbnails are retained under demonstration mode pending user replacement with their own owned assets
Unconfigured services: Contact form runs in local demonstration mode until CONTACT_WEBHOOK_URL is configured in .env
Remaining visual differences: Pixelmatch full-page differences (5.24% hero top, 12.55%-33.47% full pages) stem from vertical section padding differences, initial 9 vs loaded 12 article count on /articles, and omitted Framer promotional overlays
Remaining functional defects: None observed in executed checks
Decisions made without explicit user guidance: Used live verified pricing ($1,000 / $2,400) as default while keeping screenshot pricing ($1,200 / $2,800) behind NEXT_PUBLIC_PRICING_FIXTURE / ?pricing=screenshot; replaced "Made in Framer" footer label with "Independent Next.js Reconstruction"

23. REQUIRED USER ACTIONS

- Replace demonstration identity, portfolio project records, testimonials, and contact email/webhook in src/config/site.ts, src/content/*, and .env before commercial publication.
- Configure CONTACT_WEBHOOK_URL (or an email delivery integration) in .env if real contact inquiry forwarding is required.
- Review asset licensing for original Framer-hosted media in public/assets/ before commercial deployment.

24. FINAL COMPLETION STATUS

Completed: Reference route/content/asset discovery, asset acquisition and deduplication, design token system, layout shell, all 19 verified routes (including /hero-sections, /404, and all 12 article detail routes), 27-project directory with 6 filters and Load More, 12-article CMS with 4 filters and Load More, Contact page with custom ARIA comboboxes and Zod API route, Vitest suite, TypeScript, ESLint, production build, and Playwright/Pixelmatch/Axe verification
Partially completed: Documentation covers core research, architecture, discrepancies, and verification reports; Firefox/WebKit and Lighthouse audits were not run
Not completed: Production deployment (intentionally withheld pending user approval)