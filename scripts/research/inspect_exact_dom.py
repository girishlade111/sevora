import json
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE_URL = "https://sevora.framer.website"
OUT_DIR = Path("research/reference")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900})

        # 1. Inspect /hero-sections
        page.goto(BASE_URL + "/hero-sections", wait_until="domcontentloaded", timeout=30000)
        page.wait_for_timeout(1500)
        page.screenshot(path="research/reference/screenshots/desktop/hero-sections-1440.png", full_page=True)
        hero_sec_data = page.evaluate("""() => ({
            title: document.title,
            text: document.body.innerText,
            imgs: Array.from(document.querySelectorAll('img')).map(i => ({ src: i.currentSrc || i.src, w: i.naturalWidth, h: i.naturalHeight, rect: i.getBoundingClientRect().toJSON() }))
        })""")
        (OUT_DIR / "pages/variants/hero_sections.json").parent.mkdir(parents=True, exist_ok=True)
        (OUT_DIR / "pages/variants/hero_sections.json").write_text(json.dumps(hero_sec_data, indent=2), encoding="utf-8")

        # 2. Inspect Homepage exact CSS for background pattern, footer metallic wordmark, pricing rendered text, hero stats, header scroll transition, and isometric service graphic
        page.goto(BASE_URL + "/", wait_until="domcontentloaded", timeout=30000)
        page.wait_for_timeout(1500)
        for frac in [0.1, 0.3, 0.5, 0.7, 0.85, 1.0]:
            page.evaluate(f"window.scrollTo(0, Math.floor(document.documentElement.scrollHeight * {frac}))")
            page.wait_for_timeout(600)
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(800)

        exact_inspect = page.evaluate("""() => {
            // Background pattern
            const bgEl = Array.from(document.querySelectorAll('*')).find(el => {
                const bg = getComputedStyle(el).backgroundImage;
                return bg && bg.includes('repeating-linear-gradient');
            });
            const bgStyle = bgEl ? {
                backgroundImage: getComputedStyle(bgEl).backgroundImage,
                backgroundColor: getComputedStyle(bgEl).backgroundColor,
                opacity: getComputedStyle(bgEl).opacity,
                position: getComputedStyle(bgEl).position,
                zIndex: getComputedStyle(bgEl).zIndex,
                rect: bgEl.getBoundingClientRect().toJSON()
            } : null;

            // Footer metallic wordmark DOM
            const footer = document.querySelector('footer');
            const footerHtml = footer ? footer.innerHTML : '';
            const footerWordmarkElements = footer ? Array.from(footer.querySelectorAll('*')).filter(el => {
                const r = el.getBoundingClientRect();
                const cs = getComputedStyle(el);
                return r.height > 80 && r.width > 200 && (cs.backgroundImage !== 'none' || cs.maskImage !== 'none' || cs.webkitMaskImage !== 'none' || el.tagName === 'IMG' || el.tagName === 'SVG' || el.tagName === 'CANVAS');
            }).map(el => ({
                tag: el.tagName,
                framerName: el.getAttribute('data-framer-name'),
                rect: el.getBoundingClientRect().toJSON(),
                bg: getComputedStyle(el).backgroundImage.slice(0, 300),
                mask: (getComputedStyle(el).webkitMaskImage || getComputedStyle(el).maskImage).slice(0, 300),
                innerHTML: el.innerHTML.slice(0, 400)
            })) : [];

            // Pricing actual rendered numbers
            const pricingH2 = Array.from(document.querySelectorAll('h2')).find(h => (h.innerText||'').includes('Simple packages'));
            const pricingSec = pricingH2 ? pricingH2.parentElement.parentElement.parentElement : null;
            const pricingText = pricingSec ? pricingSec.innerText : '';

            // Hero stats actual rendered numbers
            const heroH1 = document.querySelector('h1');
            const heroSec = heroH1 ? heroH1.parentElement.parentElement.parentElement : null;
            const heroText = heroSec ? heroSec.innerText : '';

            // Credibility stats
            const credH2 = Array.from(document.querySelectorAll('h2')).find(h => (h.innerText||'').includes('Design built around'));
            const credSec = credH2 ? credH2.parentElement.parentElement.parentElement.parentElement : null;
            const credText = credSec ? credSec.innerText : '';

            // Services isometric graphic DOM
            const srvH2 = Array.from(document.querySelectorAll('h2')).find(h => (h.innerText||'').includes('Creative services'));
            const srvSec = srvH2 ? srvH2.closest('[data-framer-name="Container"]') : null;
            const srvImgs = srvSec ? Array.from(srvSec.querySelectorAll('img')).map(i => ({
                src: i.currentSrc || i.src,
                w: i.naturalWidth,
                h: i.naturalHeight,
                rect: i.getBoundingClientRect().toJSON()
            })) : [];
            const srvSvgs = srvSec ? Array.from(srvSec.querySelectorAll('svg')).map(s => ({
                w: s.getBoundingClientRect().width,
                h: s.getBoundingClientRect().height,
                viewBox: s.getAttribute('viewBox')
            })) : [];

            return { bgStyle, footerWordmarkElements, pricingText, heroText, credText, srvImgs, srvSvgs, footerLinksCount: footer ? footer.querySelectorAll('a').length : 0 };
        }""")
        (OUT_DIR / "pages/home/exact_dom_inspect.json").write_text(json.dumps(exact_inspect, indent=2), encoding="utf-8")

        # 3. Also inspect mobile header & open menu properly
        page.set_viewport_size({"width": 390, "height": 844})
        page.goto(BASE_URL + "/", wait_until="domcontentloaded", timeout=30000)
        page.wait_for_timeout(1200)
        header_info = page.evaluate("""() => {
            const nav = document.querySelector('nav, header');
            if (!nav) return null;
            const btns = Array.from(nav.querySelectorAll('div, button')).filter(el => {
                const r = el.getBoundingClientRect();
                return r.width > 20 && r.width < 60 && r.height > 20 && r.height < 60 && r.x > 250;
            }).map(el => ({ x: el.getBoundingClientRect().x, y: el.getBoundingClientRect().y, w: el.getBoundingClientRect().width, h: el.getBoundingClientRect().height, framerName: el.getAttribute('data-framer-name') }));
            return { navRect: nav.getBoundingClientRect().toJSON(), btns };
        }""")
        if header_info and header_info["btns"]:
            b = header_info["btns"][-1]
            page.mouse.click(b["x"] + b["w"]/2, b["y"] + b["h"]/2)
            page.wait_for_timeout(600)
            page.screenshot(path="research/reference/screenshots/mobile/home-390-menu-open.png")
        (OUT_DIR / "pages/home/mobile_header.json").write_text(json.dumps(header_info, indent=2), encoding="utf-8")

        browser.close()
    print("DONE exact inspect!")

if __name__ == "__main__":
    main()
