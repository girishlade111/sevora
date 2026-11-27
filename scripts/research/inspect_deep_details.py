import json
import urllib.request
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE_URL = "https://sevora.framer.website"
OUT_DIR = Path("research/reference")

def save_json(rel_path: str, data):
    p = OUT_DIR / rel_path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")

def main():
    # Fetch sitemap.xml & robots.txt raw
    for path in ["/robots.txt", "/sitemap.xml"]:
        try:
            with urllib.request.urlopen(BASE_URL + path, timeout=15) as r:
                txt = r.read().decode("utf-8", errors="replace")
                (OUT_DIR / path.lstrip("/")).write_text(txt, encoding="utf-8")
        except Exception as e:
            print(f"Fetch {path} err:", e)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
        page.goto(BASE_URL + "/", wait_until="domcontentloaded", timeout=30000)
        page.wait_for_timeout(2000)

        # 1. Inspect background pattern, hero geometry, pricing, stats, services, benefits, footer wordmark
        details = page.evaluate("""() => {
            // Find any element with background-image or svg pattern
            const bgCandidates = [];
            document.querySelectorAll('*').forEach(el => {
                const cs = getComputedStyle(el);
                const bef = getComputedStyle(el, '::before');
                const aft = getComputedStyle(el, '::after');
                for (const [label, s] of [['self', cs], ['::before', bef], ['::after', aft]]) {
                    if (s.backgroundImage && s.backgroundImage !== 'none' && (s.backgroundImage.includes('gradient') || s.backgroundImage.includes('url(') || s.backgroundImage.includes('svg'))) {
                        const r = el.getBoundingClientRect();
                        if (r.width > 100 && r.height > 100) {
                            bgCandidates.push({
                                tag: el.tagName,
                                framerName: el.getAttribute('data-framer-name'),
                                pseudo: label,
                                backgroundImage: s.backgroundImage,
                                backgroundSize: s.backgroundSize,
                                backgroundRepeat: s.backgroundRepeat,
                                opacity: s.opacity,
                                position: s.position,
                                rect: r.toJSON()
                            });
                        }
                    }
                }
            });

            // Footer inspection
            const footer = document.querySelector('footer');
            const footerDetails = footer ? {
                rect: footer.getBoundingClientRect().toJSON(),
                imgs: Array.from(footer.querySelectorAll('img')).map(i => ({ src: i.currentSrc || i.src, alt: i.alt, w: i.naturalWidth, h: i.naturalHeight, rect: i.getBoundingClientRect().toJSON(), cs: { maskImage: getComputedStyle(i).maskImage, filter: getComputedStyle(i).filter, opacity: getComputedStyle(i).opacity } })),
                svgs: Array.from(footer.querySelectorAll('svg')).map(s => ({ viewBox: s.getAttribute('viewBox'), rect: s.getBoundingClientRect().toJSON(), html: s.outerHTML.slice(0, 1500) })),
                links: Array.from(footer.querySelectorAll('a[href]')).map(a => ({ text: (a.innerText||'').trim(), href: a.href })),
                text: footer.innerText
            } : null;

            // Hero inspection
            const h1 = document.querySelector('h1');
            const heroContainer = h1 ? h1.closest('section, [data-framer-name]') : null;

            // Logo strip
            const logoImgs = Array.from(document.querySelectorAll('img')).filter(i => {
                const r = i.getBoundingClientRect();
                const y = r.top + window.scrollY;
                return y > 650 && y < 1050;
            }).map(i => ({ src: i.currentSrc || i.src, alt: i.alt, w: i.naturalWidth, h: i.naturalHeight, rect: i.getBoundingClientRect().toJSON() }));

            // All SVG in hero / logo strip / benefits
            const stripSvgs = Array.from(document.querySelectorAll('svg')).filter(s => {
                const r = s.getBoundingClientRect();
                const y = r.top + window.scrollY;
                return y > 650 && y < 1050 && r.width > 10;
            }).map(s => ({ rect: s.getBoundingClientRect().toJSON(), html: s.outerHTML.slice(0, 600) }));

            return { bgCandidates: bgCandidates.slice(0, 60), footerDetails, logoImgs, stripSvgs };
        }""")
        save_json("pages/home/deep_details.json", details)

        # 2. Scroll through Services section (topY ~ 4382, height ~ 3644) and capture frames at 0%, 25%, 50%, 75%, 100%
        srv_top = 4382
        srv_h = 3644
        srv_states = []
        for idx, frac in enumerate([0.0, 0.25, 0.5, 0.75, 0.95]):
            y = int(srv_top + (srv_h - 900) * frac)
            page.evaluate(f"window.scrollTo(0, {y})")
            page.wait_for_timeout(800)
            page.screenshot(path=f"research/reference/screenshots/animation-frames/services_{idx}_{int(frac*100)}.png")
            st = page.evaluate("""() => {
                const names = ['Development', 'Visual system', 'Product design'];
                const info = names.map(n => {
                    const el = Array.from(document.querySelectorAll('*')).find(e => e.children.length === 0 && (e.innerText||'').trim() === n);
                    if (!el) return { name: n, found: false };
                    const card = el.closest('[data-framer-name]')?.parentElement;
                    const cs = card ? getComputedStyle(card) : null;
                    return { name: n, bg: cs ? cs.backgroundColor : null, opacity: cs ? cs.opacity : null };
                });
                // Check transforms on service graphic layers
                const srvSec = Array.from(document.querySelectorAll('h2')).find(h => (h.innerText||'').includes('Creative services'))?.closest('[data-framer-name="Container"]');
                const imgs = srvSec ? Array.from(srvSec.querySelectorAll('img')).map(i => ({
                    src: (i.currentSrc || i.src).slice(-40),
                    rect: i.getBoundingClientRect().toJSON(),
                    transform: getComputedStyle(i.parentElement).transform,
                    opacity: getComputedStyle(i.parentElement).opacity
                })) : [];
                return { info, imgs };
            }""")
            srv_states.append({"frac": frac, "y": y, "state": st})
        save_json("pages/home/services_frames.json", srv_states)

        # 3. Scroll to Pricing & Stats to record stable final values
        page.evaluate("window.scrollTo(0, 9500)")
        page.wait_for_timeout(1500)
        pricing_stats = page.evaluate("""() => {
            const text = document.body.innerText;
            return {
                prices: text.match(/\\$[0-9,]+(\\s*USD)?/g),
                has1200: text.includes('1,200'),
                has1000: text.includes('1,000'),
                has2800: text.includes('2,800'),
                has2400: text.includes('2,400')
            };
        }""")
        # Also scroll back up to credibility bento (~3200) and hero (0)
        page.evaluate("window.scrollTo(0, 3200)")
        page.wait_for_timeout(1500)
        cred_text = page.evaluate("""() => {
            const h2 = Array.from(document.querySelectorAll('h2')).find(h => (h.innerText||'').includes('Design built around'));
            const sec = h2 ? h2.closest('section, [data-framer-name]')?.parentElement : null;
            return sec ? sec.innerText : '';
        }""")
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(1500)
        hero_text = page.evaluate("""() => {
            const h1 = document.querySelector('h1');
            const sec = h1 ? h1.closest('section, [data-framer-name]')?.parentElement?.parentElement : null;
            return sec ? sec.innerText : '';
        }""")
        save_json("pages/home/reconciled_numbers.json", {
            "pricing": pricing_stats,
            "credibilityText": cred_text,
            "heroText": hero_text
        })

        # 4. Inspect 404 page
        page.goto(BASE_URL + "/non-existent-route-xyz", wait_until="domcontentloaded", timeout=15000)
        page.wait_for_timeout(1000)
        page.screenshot(path="research/reference/screenshots/desktop/not-found-1440.png")
        not_found_text = page.evaluate("() => document.body.innerText")
        save_json("pages/utilities/not_found.json", {"text": not_found_text})

        # 5. Inspect Mobile Menu on 390px
        page.set_viewport_size({"width": 390, "height": 844})
        page.goto(BASE_URL + "/", wait_until="domcontentloaded", timeout=30000)
        page.wait_for_timeout(1500)
        # Try clicking hamburger button in header
        header_btns = page.evaluate("""() => {
            const hdr = document.querySelector('header, nav');
            if (!hdr) return [];
            return Array.from(hdr.querySelectorAll('button, [role="button"], svg')).map(el => {
                const r = el.getBoundingClientRect();
                return { tag: el.tagName, x: r.x, y: r.y, w: r.width, h: r.height };
            });
        }""")
        if header_btns:
            # Click rightmost button/icon in mobile header
            rightmost = max(header_btns, key=lambda b: b["x"])
            page.mouse.click(rightmost["x"] + rightmost["w"]/2, rightmost["y"] + rightmost["h"]/2)
            page.wait_for_timeout(600)
            page.screenshot(path="research/reference/screenshots/mobile/home-390-menu-open.png")

        browser.close()
    print("DONE deep details!")

if __name__ == "__main__":
    main()
