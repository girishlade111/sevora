import json
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE_URL = "https://sevora.framer.website"

def main():
    ar = json.loads(Path("research/reference/pages/articles/summary.json").read_text(encoding="utf-8"))
    print("Detail keys:", list(ar["details"].keys()))
    for k, v in ar["details"].items():
        print(" ", k, "blocks:", len(v.get("richBlocks", [])), "textLen:", len(v.get("innerText", "")))

    # Re-fetch richBlocks cleanly for any article that had 0 blocks, or parse innerText + DOM inside article main
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        pg = b.new_page(viewport={"width": 1440, "height": 900})

        # 1. Capture service isometric graphic in all 3 active states at 2x DPR
        pg2 = b.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=2)
        pg2.goto(BASE_URL + "/", wait_until="domcontentloaded", timeout=30000)
        pg2.wait_for_timeout(1500)
        for idx, y in enumerate([4450, 6200, 7050]):
            pg2.evaluate(f"window.scrollTo(0, {y})")
            pg2.wait_for_timeout(900)
            box = pg2.locator("[data-framer-name='Image (Replace here)']").first
            if box.count() > 0:
                box.screenshot(path=f"assets-source/original/services/isometric-state-{idx+1}.png")
        pg2.close()

        # 2. Extract structured article content for all 12 articles
        all_12 = json.loads(Path("research/reference/content/articles_all_12.json").read_text(encoding="utf-8"))
        enriched = []
        for item in all_12:
            route = item["route"]
            pg.goto(BASE_URL + route, wait_until="domcontentloaded", timeout=30000)
            pg.wait_for_timeout(1200)
            data = pg.evaluate("""() => {
                // Collect text elements in reading order between cover image and "Related"
                const h1 = document.querySelector('h1');
                const title = h1 ? h1.innerText.trim() : '';
                const bodyText = document.body.innerText;
                // Extract rich elements visible on desktop
                const els = Array.from(document.querySelectorAll('h1, h2, h3, h4, p, li, blockquote')).filter(el => {
                    const r = el.getBoundingClientRect();
                    return r.width > 100 && r.height > 10 && getComputedStyle(el).display !== 'none';
                }).map(el => ({
                    tag: el.tagName,
                    y: Math.round(el.getBoundingClientRect().top + window.scrollY),
                    text: (el.innerText || '').trim(),
                    fontSize: getComputedStyle(el).fontSize
                }));
                const relatedLinks = Array.from(document.querySelectorAll('a[href*="/articles/"]')).map(a => ({
                    href: a.getAttribute('href'),
                    text: (a.innerText || '').trim().replace(/\\s+/g, ' | ')
                }));
                return { title, els, bodyText, relatedLinks };
            }""")
            item["extractedTitle"] = data["title"]
            item["elements"] = data["els"]
            item["bodyText"] = data["bodyText"]
            item["relatedLinks"] = data["relatedLinks"]
            enriched.append(item)
            print("Extracted article:", item["slug"], "elements:", len(data["els"]))

        Path("research/reference/content/articles_all_12_enriched.json").write_text(
            json.dumps(enriched, indent=2, ensure_ascii=False), encoding="utf-8"
        )
        b.close()
    print("DONE articles & service states!")

if __name__ == "__main__":
    main()
