import json
import os
import re
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE_URL = "https://sevora.framer.website"
OUT_DIR = Path("research/reference")
OUT_DIR.mkdir(parents=True, exist_ok=True)
SCREENSHOTS_DIR = OUT_DIR / "screenshots"
for d in ["desktop", "tablet", "mobile", "sections", "interaction-states", "animation-frames"]:
    (SCREENSHOTS_DIR / d).mkdir(parents=True, exist_ok=True)

def save_json(rel_path: str, data):
    p = OUT_DIR / rel_path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")

def wait_ready(page):
    page.wait_for_load_state("domcontentloaded")
    page.wait_for_timeout(1500)
    page.evaluate("async () => { await document.fonts.ready; }")
    page.evaluate("""async () => {
        const imgs = Array.from(document.querySelectorAll('img'));
        await Promise.all(imgs.map(img => img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; setTimeout(r, 4000); })));
    }""")
    page.wait_for_timeout(600)

def collect_network_and_dom_assets(page):
    return page.evaluate("""() => {
        const imgs = Array.from(document.querySelectorAll('img')).map(el => ({
            src: el.currentSrc || el.src || el.getAttribute('src'),
            srcset: el.getAttribute('srcset'),
            alt: el.getAttribute('alt') || '',
            naturalWidth: el.naturalWidth,
            naturalHeight: el.naturalHeight,
            rect: el.getBoundingClientRect().toJSON(),
            style: {
                objectFit: getComputedStyle(el).objectFit,
                objectPosition: getComputedStyle(el).objectPosition,
                filter: getComputedStyle(el).filter,
                opacity: getComputedStyle(el).opacity,
                borderRadius: getComputedStyle(el).borderRadius,
                transform: getComputedStyle(el).transform
            }
        }));
        const svgs = Array.from(document.querySelectorAll('svg')).map((el, i) => {
            const r = el.getBoundingClientRect();
            return {
                index: i,
                viewBox: el.getAttribute('viewBox'),
                width: r.width,
                height: r.height,
                visible: r.width > 0 && r.height > 0 && getComputedStyle(el).display !== 'none',
                outerHTML: el.outerHTML.length < 15000 ? el.outerHTML : el.outerHTML.slice(0, 500) + '...TRUNCATED',
                parentText: (el.parentElement && el.parentElement.innerText || '').slice(0, 80)
            };
        });
        const bgUrls = [];
        document.querySelectorAll('*').forEach(el => {
            const cs = getComputedStyle(el);
            for (const prop of ['backgroundImage', 'maskImage', 'webkitMaskImage']) {
                const val = cs[prop];
                if (val && val !== 'none') {
                    bgUrls.push({
                        tag: el.tagName,
                        cls: (el.className && typeof el.className === 'string') ? el.className.slice(0, 80) : '',
                        prop,
                        val: val.slice(0, 500),
                        rect: el.getBoundingClientRect().toJSON()
                    });
                }
            }
        });
        const links = Array.from(document.querySelectorAll('a[href]')).map(a => ({
            href: a.href,
            rawHref: a.getAttribute('href'),
            text: (a.innerText || '').trim().replace(/\\s+/g, ' ').slice(0, 120),
            target: a.getAttribute('target'),
            rel: a.getAttribute('rel'),
            rect: a.getBoundingClientRect().toJSON()
        }));
        return { imgs, svgs, bgUrls, links };
    }""")

def inspect_fonts(page, cdp):
    font_faces = page.evaluate("""() => {
        const list = [];
        for (const ff of document.fonts) {
            list.push({
                family: ff.family,
                weight: ff.weight,
                style: ff.style,
                status: ff.status,
                unicodeRange: ff.unicodeRange
            });
        }
        const cssRules = [];
        for (const sheet of document.styleSheets) {
            try {
                for (const rule of sheet.cssRules) {
                    if (rule.type === CSSRule.FONT_FACE_RULE) {
                        cssRules.push(rule.cssText);
                    }
                }
            } catch (e) {}
        }
        return { loadedFonts: list, fontFaceRules: cssRules };
    }""")
    # Sample platform fonts on h1, h2, p, nav a, button
    doc = cdp.send("DOM.getDocument", {"depth": -1})
    selectors = ["h1", "h2", "h3", "p", "nav a", "button", "a"]
    platform_fonts = {}
    for sel in selectors:
        try:
            res = cdp.send("DOM.querySelector", {"nodeId": doc["root"]["nodeId"], "selector": sel})
            if res and res.get("nodeId"):
                pf = cdp.send("CSS.getPlatformFontsForNode", {"nodeId": res["nodeId"]})
                platform_fonts[sel] = pf
        except Exception as e:
            platform_fonts[sel] = {"error": str(e)}
    return {"fontFaces": font_faces, "platformFonts": platform_fonts}

def main():
    network_resources = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
        page = context.new_page()
        cdp = context.new_cdp_session(page)
        cdp.send("DOM.enable")
        cdp.send("CSS.enable")

        def on_response(resp):
            try:
                ct = resp.headers.get("content-type", "")
                if any(k in ct for k in ["font", "image", "svg", "css", "javascript", "video"]) or "framerusercontent" in resp.url:
                    network_resources.append({
                        "url": resp.url,
                        "status": resp.status,
                        "contentType": ct,
                        "resourceType": resp.request.resource_type
                    })
            except Exception:
                pass

        page.on("response", on_response)

        # 1. Probe utility routes, robots.txt, sitemap.xml
        probes = {}
        for route in ["/robots.txt", "/sitemap.xml", "/404", "/non-existent-route-xyz", "/style-guide", "/styleguide", "/guidelines", "/home-2", "/hero-2", "/integrations"]:
            try:
                r = page.goto(BASE_URL + route, wait_until="domcontentloaded", timeout=15000)
                page.wait_for_timeout(500)
                probes[route] = {
                    "status": r.status if r else None,
                    "finalUrl": page.url,
                    "title": page.title(),
                    "snippet": (page.inner_text("body") or "")[:400]
                }
            except Exception as e:
                probes[route] = {"error": str(e)}
        save_json("probes.json", probes)

        # 2. Inspect Homepage thoroughly
        page.goto(BASE_URL + "/", wait_until="domcontentloaded", timeout=30000)
        wait_ready(page)

        fonts_info = inspect_fonts(page, cdp)
        save_json("typography/home_fonts.json", fonts_info)

        # Capture top hero before scrolling
        page.screenshot(path=str(SCREENSHOTS_DIR / "desktop/home-1440-top.png"))

        # Scroll through entire page incrementally to trigger all animations and inspect long scroll region
        doc_height = page.evaluate("() => document.documentElement.scrollHeight")
        scroll_samples = []
        for y in range(0, doc_height, 700):
            page.evaluate(f"window.scrollTo(0, {y})")
            page.wait_for_timeout(450)
            scroll_samples.append({
                "y": y,
                "stats": page.evaluate("""() => {
                    const text = document.body.innerText;
                    return {
                        scrollY: window.scrollY,
                        hasFramerPrice: text.match(/\\$[0-9,]+/g)
                    };
                }""")
            })
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(1200)
        # Re-scroll smoothly down to settle all AnimatedNumbers and reveal sections
        for frac in [0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1.0]:
            page.evaluate(f"window.scrollTo(0, Math.floor(document.documentElement.scrollHeight * {frac}))")
            page.wait_for_timeout(700)
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(1000)

        page.screenshot(path=str(SCREENSHOTS_DIR / "desktop/home-1440-full.png"), full_page=True)

        home_data = page.evaluate("""() => {
            const bodyCs = getComputedStyle(document.body);
            const mainDiv = document.querySelector('#main') || document.body.firstElementChild;
            const mainCs = mainDiv ? getComputedStyle(mainDiv) : null;

            // Measure headings, buttons, cards, header, footer
            const header = document.querySelector('header, nav');
            const headerRect = header ? header.getBoundingClientRect().toJSON() : null;
            const footer = document.querySelector('footer');
            const footerRect = footer ? footer.getBoundingClientRect().toJSON() : null;

            // Collect all visible text sections with bounding boxes
            const sections = Array.from(document.querySelectorAll('section, [data-framer-name]')).map(el => {
                const r = el.getBoundingClientRect();
                const cs = getComputedStyle(el);
                return {
                    tag: el.tagName,
                    framerName: el.getAttribute('data-framer-name'),
                    y: r.top + window.scrollY,
                    x: r.left,
                    width: r.width,
                    height: r.height,
                    display: cs.display,
                    position: cs.position,
                    backgroundColor: cs.backgroundColor,
                    backgroundImage: cs.backgroundImage !== 'none' ? cs.backgroundImage.slice(0, 200) : 'none',
                    borderRadius: cs.borderRadius,
                    overflow: cs.overflow,
                    textPreview: (el.innerText || '').trim().replace(/\\s+/g, ' ').slice(0, 140)
                };
            }).filter(s => s.width > 50 && s.height > 20 && s.display !== 'none');

            // Typography samples
            const typeSamples = [];
            for (const sel of ['h1', 'h2', 'h3', 'h4', 'p', 'nav a', 'header a', 'footer a', 'button']) {
                const els = Array.from(document.querySelectorAll(sel)).filter(e => {
                    const r = e.getBoundingClientRect();
                    return r.width > 0 && r.height > 0;
                }).slice(0, 6);
                for (const el of els) {
                    const cs = getComputedStyle(el);
                    typeSamples.push({
                        sel,
                        text: (el.innerText || '').trim().replace(/\\s+/g, ' ').slice(0, 80),
                        fontFamily: cs.fontFamily,
                        fontSize: cs.fontSize,
                        fontWeight: cs.fontWeight,
                        lineHeight: cs.lineHeight,
                        letterSpacing: cs.letterSpacing,
                        color: cs.color,
                        rect: el.getBoundingClientRect().toJSON()
                    });
                }
            }

            return {
                docHeight: document.documentElement.scrollHeight,
                bodyBg: bodyCs.backgroundColor,
                bodyBgImg: bodyCs.backgroundImage,
                mainBg: mainCs ? mainCs.backgroundColor : null,
                mainBgImg: mainCs ? mainCs.backgroundImage : null,
                headerRect,
                footerRect,
                sections: sections.slice(0, 120),
                typeSamples,
                fullText: document.body.innerText
            };
        }""")
        home_assets = collect_network_and_dom_assets(page)
        save_json("pages/home/dom_summary.json", home_data)
        save_json("pages/home/assets.json", home_assets)
        save_json("pages/home/scroll_samples.json", scroll_samples)

        # Inspect Services section specifically & scroll through it
        services_info = page.evaluate("""() => {
            const h2s = Array.from(document.querySelectorAll('h2, h1, h3'));
            const srv = h2s.find(h => (h.innerText || '').includes('Creative services'));
            if (!srv) return null;
            let parent = srv.parentElement;
            while (parent && parent.parentElement && parent.getBoundingClientRect().height < 1200) {
                if (parent.parentElement === document.body || parent.parentElement.id === 'main') break;
                parent = parent.parentElement;
            }
            const r = parent.getBoundingClientRect();
            const stickies = Array.from(parent.querySelectorAll('*')).filter(e => getComputedStyle(e).position === 'sticky').map(e => ({
                framerName: e.getAttribute('data-framer-name'),
                rect: e.getBoundingClientRect().toJSON(),
                top: getComputedStyle(e).top,
                height: e.getBoundingClientRect().height
            }));
            return {
                containerFramerName: parent.getAttribute('data-framer-name'),
                topY: r.top + window.scrollY,
                height: r.height,
                stickies
            };
        }""")
        save_json("pages/home/services_scroll.json", services_info)

        # Click service tabs and FAQ items on homepage
        faq_results = page.evaluate("""async () => {
            const questions = [
                'How do I submit a design request?',
                'How does onboarding work?',
                'How fast will I receive my designs?',
                'Do you work at our company?',
                'Why not hire full-time?',
                'Can I order a one-time logo service?',
                'What tools do you use?',
                'What is your refund policy?'
            ];
            const out = [];
            for (const q of questions) {
                const el = Array.from(document.querySelectorAll('*')).find(e => e.children.length === 0 && (e.innerText || '').trim() === q);
                if (el) {
                    const clickable = el.closest('[tabindex], button, [role="button"], [data-framer-name]') || el.parentElement;
                    clickable.click();
                    await new Promise(r => setTimeout(r, 450));
                    let container = clickable.parentElement;
                    for (let i = 0; i < 3 && container; i++) {
                        if ((container.innerText || '').length > q.length + 10) break;
                        container = container.parentElement;
                    }
                    out.push({ question: q, expandedText: container ? container.innerText : '' });
                }
            }
            return out;
        }""")
        save_json("pages/home/faqs.json", faq_results)

        # 3. Inspect /about
        page.goto(BASE_URL + "/about", wait_until="domcontentloaded", timeout=30000)
        wait_ready(page)
        for frac in [0.25, 0.5, 0.75, 1.0]:
            page.evaluate(f"window.scrollTo(0, Math.floor(document.documentElement.scrollHeight * {frac}))")
            page.wait_for_timeout(500)
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(500)
        page.screenshot(path=str(SCREENSHOTS_DIR / "desktop/about-1440-full.png"), full_page=True)
        about_assets = collect_network_and_dom_assets(page)
        about_text = page.evaluate("() => ({ text: document.body.innerText, docHeight: document.documentElement.scrollHeight })")
        save_json("pages/about/summary.json", about_text)
        save_json("pages/about/assets.json", about_assets)

        # 4. Inspect /projects + Load More + Category Filters
        page.goto(BASE_URL + "/projects", wait_until="domcontentloaded", timeout=30000)
        wait_ready(page)
        projects_info = {"categories": {}, "loadMoreSteps": []}

        def read_visible_projects():
            return page.evaluate("""() => {
                return Array.from(document.querySelectorAll('a[href]')).filter(a => {
                    const r = a.getBoundingClientRect();
                    const href = a.href || '';
                    return r.width > 150 && r.height > 150 && !href.includes('sevora.framer.website') && !href.includes('framer.com');
                }).map(a => {
                    const img = a.querySelector('img');
                    return {
                        href: a.href,
                        target: a.getAttribute('target'),
                        text: (a.innerText || '').trim().replace(/\\s+/g, ' '),
                        imgSrc: img ? (img.currentSrc || img.src) : null,
                        imgAlt: img ? img.alt : ''
                    };
                });
            }""")

        projects_info["initial"] = read_visible_projects()
        step = 0
        while step < 10:
            btn = page.locator("text=Load More").first
            if btn.count() > 0 and btn.is_visible():
                btn.scroll_into_view_if_needed()
                btn.click()
                page.wait_for_timeout(1200)
                step += 1
                projects_info["loadMoreSteps"].append({"step": step, "projects": read_visible_projects()})
            else:
                break
        page.screenshot(path=str(SCREENSHOTS_DIR / "desktop/projects-1440-all.png"), full_page=True)

        for cat in ["All projects", "AI", "Business", "One page", "Portfolio", "Online course"]:
            tab = page.locator(f"text='{cat}'").first
            if tab.count() > 0:
                tab.click()
                page.wait_for_timeout(800)
                # Also click Load More if present inside category
                while True:
                    btn = page.locator("text=Load More").first
                    if btn.count() > 0 and btn.is_visible():
                        btn.click()
                        page.wait_for_timeout(1000)
                    else:
                        break
                projects_info["categories"][cat] = read_visible_projects()
        save_json("pages/projects/summary.json", projects_info)
        save_json("pages/projects/assets.json", collect_network_and_dom_assets(page))

        # 5. Inspect /articles + Load More + Category Filters + All Article Detail Pages
        page.goto(BASE_URL + "/articles", wait_until="domcontentloaded", timeout=30000)
        wait_ready(page)
        articles_info = {"categories": {}, "loadMoreSteps": [], "details": {}}

        def read_visible_articles():
            return page.evaluate("""() => {
                return Array.from(document.querySelectorAll('a[href*="/articles/"]')).filter(a => {
                    const r = a.getBoundingClientRect();
                    return r.width > 120 && r.height > 100;
                }).map(a => {
                    const img = a.querySelector('img');
                    return {
                        href: a.getAttribute('href'),
                        fullHref: a.href,
                        text: (a.innerText || '').trim().replace(/\\s+/g, ' | '),
                        imgSrc: img ? (img.currentSrc || img.src) : null
                    };
                });
            }""")

        articles_info["initial"] = read_visible_articles()
        step = 0
        while step < 10:
            btn = page.locator("text=Load More").first
            if btn.count() > 0 and btn.is_visible():
                btn.scroll_into_view_if_needed()
                btn.click()
                page.wait_for_timeout(1200)
                step += 1
                articles_info["loadMoreSteps"].append({"step": step, "articles": read_visible_articles()})
            else:
                break
        page.screenshot(path=str(SCREENSHOTS_DIR / "desktop/articles-1440-all.png"), full_page=True)

        all_article_hrefs = []
        for a in (articles_info["loadMoreSteps"][-1]["articles"] if articles_info["loadMoreSteps"] else articles_info["initial"]):
            if a["href"] not in all_article_hrefs:
                all_article_hrefs.append(a["href"])

        for cat in ["All articles", "Web design", "Product design", "UI Design"]:
            tab = page.locator(f"text='{cat}'").first
            if tab.count() > 0:
                tab.click()
                page.wait_for_timeout(800)
                while True:
                    btn = page.locator("text=Load More").first
                    if btn.count() > 0 and btn.is_visible():
                        btn.click()
                        page.wait_for_timeout(1000)
                    else:
                        break
                articles_info["categories"][cat] = read_visible_articles()

        # Visit every discovered article detail page
        for href in all_article_hrefs:
            slug_path = href if href.startswith("/") else "/" + href.split("sevora.framer.website/")[-1]
            if not slug_path.startswith("/"):
                slug_path = "/" + slug_path
            full_url = BASE_URL + slug_path.replace("./", "/")
            page.goto(full_url, wait_until="domcontentloaded", timeout=30000)
            wait_ready(page)
            detail = page.evaluate("""() => {
                const imgs = Array.from(document.querySelectorAll('img')).map(i => ({ src: i.currentSrc || i.src, alt: i.alt, w: i.naturalWidth, h: i.naturalHeight, rect: i.getBoundingClientRect().toJSON() }));
                const richBlocks = Array.from(document.querySelectorAll('h1, h2, h3, h4, p, ul, ol, blockquote')).map(el => {
                    const r = el.getBoundingClientRect();
                    if (r.width === 0 || r.height === 0) return null;
                    return {
                        tag: el.tagName,
                        text: (el.innerText || '').trim(),
                        html: el.innerHTML.slice(0, 1000),
                        y: r.top + window.scrollY,
                        fontFamily: getComputedStyle(el).fontFamily,
                        fontSize: getComputedStyle(el).fontSize
                    };
                }).filter(Boolean);
                return {
                    title: document.title,
                    url: location.href,
                    innerText: document.body.innerText,
                    imgs,
                    richBlocks
                };
            }""")
            articles_info["details"][slug_path] = detail
            if len(articles_info["details"]) == 1:
                page.screenshot(path=str(SCREENSHOTS_DIR / "desktop/article-detail-sample-1440.png"), full_page=True)

        save_json("pages/articles/summary.json", articles_info)

        # 6. Inspect /contact + dropdowns
        page.goto(BASE_URL + "/contact", wait_until="domcontentloaded", timeout=30000)
        wait_ready(page)
        page.screenshot(path=str(SCREENSHOTS_DIR / "desktop/contact-1440-full.png"), full_page=True)
        contact_data = page.evaluate("""() => {
            const selects = Array.from(document.querySelectorAll('select')).map(s => ({
                name: s.name,
                required: s.required,
                options: Array.from(s.options).map(o => ({ value: o.value, text: o.text, disabled: o.disabled, selected: o.selected })),
                rect: s.getBoundingClientRect().toJSON()
            }));
            const inputs = Array.from(document.querySelectorAll('input, textarea, button[type="submit"]')).map(i => ({
                tag: i.tagName,
                type: i.type,
                name: i.name,
                placeholder: i.placeholder,
                required: i.required,
                rect: i.getBoundingClientRect().toJSON(),
                cs: {
                    height: getComputedStyle(i).height,
                    borderRadius: getComputedStyle(i).borderRadius,
                    backgroundColor: getComputedStyle(i).backgroundColor,
                    border: getComputedStyle(i).border
                }
            }));
            return { selects, inputs, text: document.body.innerText };
        }""")
        save_json("pages/contact/summary.json", contact_data)
        save_json("pages/contact/assets.json", collect_network_and_dom_assets(page))

        # 7. Capture Mobile (390x844) & Tablet (768x1024) of Homepage + open mobile menu
        page.set_viewport_size({"width": 390, "height": 844})
        page.goto(BASE_URL + "/", wait_until="domcontentloaded", timeout=30000)
        wait_ready(page)
        page.screenshot(path=str(SCREENSHOTS_DIR / "mobile/home-390-top.png"))
        page.screenshot(path=str(SCREENSHOTS_DIR / "mobile/home-390-full.png"), full_page=True)
        mobile_info = page.evaluate("""() => {
            return {
                scrollWidth: document.documentElement.scrollWidth,
                innerWidth: window.innerWidth,
                h1FontSize: getComputedStyle(document.querySelector('h1')).fontSize,
                headerRect: document.querySelector('header, nav')?.getBoundingClientRect().toJSON()
            };
        }""")
        save_json("pages/home/mobile_390.json", mobile_info)

        page.set_viewport_size({"width": 768, "height": 1024})
        page.goto(BASE_URL + "/", wait_until="domcontentloaded", timeout=30000)
        wait_ready(page)
        page.screenshot(path=str(SCREENSHOTS_DIR / "tablet/home-768-top.png"))

        save_json("network/resources.json", network_resources)
        browser.close()
    print("DONE inspecting reference!")

if __name__ == "__main__":
    main()
