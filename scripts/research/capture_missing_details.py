import json
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE_URL = "https://sevora.framer.website"

def main():
    hd = json.loads(Path("research/reference/pages/home/dom_summary.json").read_text(encoding="utf-8"))
    print("=== SECTIONS ===")
    for s in hd["sections"][:35]:
        print(round(s["y"],1), round(s["x"],1), round(s["width"],1), round(s["height"],1), s["borderRadius"], s["backgroundColor"], s["framerName"], "|", s["textPreview"][:40])
    print("=== TYPE SAMPLES ===")
    for t in hd["typeSamples"]:
        print(t["sel"], t["fontFamily"][:25], t["fontSize"], t["fontWeight"], t["lineHeight"], t["letterSpacing"], t["color"], "|", t["text"][:35])

    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        pg = b.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=2)
        pg.goto(BASE_URL + "/articles/crafting-exceptional-user-experiences", wait_until="domcontentloaded", timeout=30000)
        pg.wait_for_timeout(1500)
        pg.screenshot(path="research/reference/screenshots/desktop/article-detail-1440.png", full_page=True)

        # Capture the 3 isometric service states inside the Creative services section
        pg.goto(BASE_URL + "/", wait_until="domcontentloaded", timeout=30000)
        pg.wait_for_timeout(1500)
        for idx, y in enumerate([4450, 6200, 7050]):
            pg.evaluate(f"window.scrollTo(0, {y})")
            pg.wait_for_timeout(900)
            clip = pg.evaluate("""() => {
                const h2 = Array.from(document.querySelectorAll('h2')).find(h => (h.innerText||'').includes('Creative services'));
                const sec = h2?.closest('[data-framer-name="Container"]');
                if (!sec) return null;
                const box = Array.from(sec.querySelectorAll('[data-framer-name="Trailing"]')).find(e => e.getBoundingClientRect().width > 450);
                return box ? box.getBoundingClientRect().toJSON() : null;
            }""")
            if clip:
                pg.screenshot(
                    path=f"public/assets/images/services/isometric-state-{idx+1}.png",
                    clip={"x": clip["x"], "y": clip["y"], "width": clip["width"], "height": clip["height"]}
                )
        b.close()
    print("DONE missing captures!")

if __name__ == "__main__":
    main()
