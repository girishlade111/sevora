import json
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE_URL = "https://sevora.framer.website"
OUT_DIR = Path("research/reference")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900})

        # 1. Exact FAQ extraction via real mouse clicks
        page.goto(BASE_URL + "/", wait_until="domcontentloaded", timeout=30000)
        page.wait_for_timeout(1500)
        questions = [
            "How do I submit a design request?",
            "How does onboarding work?",
            "How fast will I receive my designs?",
            "Do you work at our company?",
            "Why not hire full-time?",
            "Can I order a one-time logo service?",
            "What tools do you use?",
            "What is your refund policy?"
        ]
        faqs = []
        for q in questions:
            loc = page.get_by_text(q, exact=True).first
            loc.scroll_into_view_if_needed()
            page.wait_for_timeout(200)
            box = loc.bounding_box()
            if box:
                page.mouse.click(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
                page.wait_for_timeout(500)
                ans = page.evaluate("""(q) => {
                    const el = Array.from(document.querySelectorAll('*')).find(e => e.children.length === 0 && (e.innerText||'').trim() === q);
                    if (!el) return '';
                    let cur = el.parentElement;
                    for (let i = 0; i < 4 && cur; i++) {
                        const txt = (cur.innerText || '').trim();
                        if (txt.length > q.length + 5 && txt.startsWith(q)) return txt;
                        cur = cur.parentElement;
                    }
                    return cur ? cur.innerText : '';
                }""", q)
                faqs.append({"question": q, "fullText": ans})
        (OUT_DIR / "pages/home/faqs_real.json").write_text(json.dumps(faqs, indent=2, ensure_ascii=False), encoding="utf-8")

        # 2. Exact Projects Load More + per-category project extraction
        page.goto(BASE_URL + "/projects", wait_until="domcontentloaded", timeout=30000)
        page.wait_for_timeout(1500)

        def get_projects():
            return page.evaluate("""() => {
                return Array.from(document.querySelectorAll('a[href]')).filter(a => {
                    const r = a.getBoundingClientRect();
                    const href = a.href || '';
                    return r.width > 150 && r.height > 150 && !href.includes('sevora.framer.website') && !href.includes('framer.com');
                }).map(a => {
                    const img = a.querySelector('img');
                    return {
                        name: (a.innerText || '').trim().split('\\n')[0].trim(),
                        href: a.href,
                        imgSrc: img ? (img.currentSrc || img.src) : null,
                        imgAlt: img ? img.alt : ''
                    };
                });
            }""")

        all_by_cat = {}
        for cat in ["All projects", "AI", "Business", "One page", "Portfolio", "Online course"]:
            page.goto(BASE_URL + "/projects", wait_until="domcontentloaded", timeout=30000)
            page.wait_for_timeout(1200)
            if cat != "All projects":
                page.get_by_text(cat, exact=True).first.click()
                page.wait_for_timeout(900)
            steps = [get_projects()]
            for _ in range(5):
                btn = page.get_by_text("Load More", exact=True).first
                if btn.count() > 0 and btn.is_visible():
                    btn.scroll_into_view_if_needed()
                    page.wait_for_timeout(200)
                    btn.click()
                    page.wait_for_timeout(1200)
                    steps.append(get_projects())
                else:
                    break
            all_by_cat[cat] = {"stepCounts": [len(s) for s in steps], "final": steps[-1]}
        (OUT_DIR / "pages/projects/categories_exact.json").write_text(json.dumps(all_by_cat, indent=2, ensure_ascii=False), encoding="utf-8")
        browser.close()
    print("DONE faqs & projects exact!")

if __name__ == "__main__":
    main()
