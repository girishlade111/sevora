import hashlib
import json
import os
import re
import urllib.parse
import urllib.request
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE_URL = "https://sevora.framer.website"
OUT_DIR = Path("research/reference")
ORIG_DIR = Path("assets-source/original")

def safe_filename(url: str, fallback: str = "asset") -> str:
    parsed = urllib.parse.urlparse(url)
    name = os.path.basename(parsed.path) or fallback
    name = re.sub(r"[^a-zA-Z0-9._-]", "_", name)
    return name

def download_file(url: str, dest: Path) -> dict:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_size > 0:
        data = dest.read_bytes()
        return {"status": "cached", "size": len(data), "sha256": hashlib.sha256(data).hexdigest()}
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = resp.read()
        ct = resp.headers.get("Content-Type", "")
    dest.write_bytes(data)
    return {"status": "downloaded", "size": len(data), "contentType": ct, "sha256": hashlib.sha256(data).hexdigest()}

def main():
    assets_manifest = []
    seen_urls = {}

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1)

        # 1. Extract Home SVGs (Logo Strip, Benefits, Services Isometric, Icons) & Home Images
        page.goto(BASE_URL + "/", wait_until="domcontentloaded", timeout=30000)
        page.wait_for_timeout(1800)
        for frac in [0.15, 0.3, 0.45, 0.65, 0.85, 1.0]:
            page.evaluate(f"window.scrollTo(0, Math.floor(document.documentElement.scrollHeight * {frac}))")
            page.wait_for_timeout(500)
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(600)

        home_visuals = page.evaluate("""() => {
            // Logo strip container (y between 720 and 960)
            const logos = Array.from(document.querySelectorAll('svg')).filter(s => {
                const r = s.getBoundingClientRect();
                const y = r.top + window.scrollY;
                return y > 700 && y < 980 && r.width > 12;
            }).map(s => ({
                y: s.getBoundingClientRect().top + window.scrollY,
                x: s.getBoundingClientRect().left,
                w: s.getBoundingClientRect().width,
                h: s.getBoundingClientRect().height,
                parentText: (s.parentElement?.parentElement?.innerText || '').trim().replace(/\\s+/g, ' '),
                html: s.outerHTML
            }));

            // Services isometric SVGs (inside section with 'Creative services')
            const srvH2 = Array.from(document.querySelectorAll('h2')).find(h => (h.innerText||'').includes('Creative services'));
            const srvSec = srvH2 ? srvH2.closest('[data-framer-name="Container"]') : null;
            const srvDiagrams = srvSec ? Array.from(srvSec.querySelectorAll('svg')).filter(s => s.getBoundingClientRect().width > 100).map(s => ({
                w: s.getBoundingClientRect().width,
                h: s.getBoundingClientRect().height,
                html: s.outerHTML
            })) : [];

            // Benefits cards HTML/SVGs/IMGs
            const benH2 = Array.from(document.querySelectorAll('h2')).find(h => (h.innerText||'').includes('Discover why we stand out'));
            const benSec = benH2 ? benH2.parentElement.parentElement : null;
            const benImgs = benSec ? Array.from(benSec.querySelectorAll('img')).map(i => ({ src: i.currentSrc || i.src, alt: i.alt, w: i.naturalWidth, h: i.naturalHeight })) : [];

            // All images on home
            const allImgs = Array.from(document.querySelectorAll('img')).map(i => ({
                src: i.currentSrc || i.src,
                alt: i.alt,
                y: i.getBoundingClientRect().top + window.scrollY,
                w: i.naturalWidth,
                h: i.naturalHeight,
                dw: i.getBoundingClientRect().width,
                dh: i.getBoundingClientRect().height
            }));

            // Exact Pricing numbers (look at all visible text in Pricing section)
            const prH2 = Array.from(document.querySelectorAll('h2')).find(h => (h.innerText||'').includes('Simple packages'));
            const prSec = prH2 ? prH2.closest('div[style], section, [data-framer-name]')?.parentElement?.parentElement : null;

            return { logos, srvDiagrams, benImgs, allImgs, pricingHTML: prSec ? prSec.innerText : '' };
        }""")
        (OUT_DIR / "pages/home/visuals_extracted.json").write_text(json.dumps(home_visuals, indent=2, ensure_ascii=False), encoding="utf-8")

        # Capture clean Footer Wordmark crop screenshot at 2x DPR
        page2 = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=2)
        page2.goto(BASE_URL + "/contact", wait_until="domcontentloaded", timeout=30000)
        page2.wait_for_timeout(1500)
        page2.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
        page2.wait_for_timeout(800)
        wm = page2.locator("footer [data-framer-component-type='Shader']").first
        if wm.count() > 0:
            wm.screenshot(path=str(ORIG_DIR / "footer/sevora-wordmark-shader.png"))
        page2.close()

        # 2. Extract ALL 27 Projects with their full-res original URLs
        proj_data = json.loads((OUT_DIR / "pages/projects/categories_exact.json").read_text(encoding="utf-8"))
        # Build category membership map
        cat_map = {}
        for cat, info in proj_data.items():
            if cat == "All projects":
                continue
            for item in info["final"]:
                cat_map.setdefault(item["name"], []).append(cat)

        all_projects = []
        for idx, item in enumerate(proj_data["All projects"]["final"], start=1):
            src = item["imgSrc"] or ""
            # Strip scale-down-to query param to get original master if framerusercontent
            master_url = re.sub(r"scale-down-to=\d+&?", "", src).rstrip("?&")
            all_projects.append({
                "order": idx,
                "name": item["name"],
                "slug": re.sub(r"[^a-z0-9]+", "-", item["name"].lower()).strip("-"),
                "categories": cat_map.get(item["name"], []),
                "externalUrl": item["href"],
                "thumbnailUrl": src,
                "masterUrl": master_url,
                "imageAlt": item["imgAlt"] or f"{item['name']} project preview"
            })
        (OUT_DIR / "content/projects_all_27.json").parent.mkdir(parents=True, exist_ok=True)
        (OUT_DIR / "content/projects_all_27.json").write_text(json.dumps(all_projects, indent=2, ensure_ascii=False), encoding="utf-8")

        # 3. Extract ALL 12 Articles with structured metadata and content
        art_summary = json.loads((OUT_DIR / "pages/articles/summary.json").read_text(encoding="utf-8"))
        all_articles = []
        cat_articles = {}
        for cat, items in art_summary["categories"].items():
            if cat == "All articles":
                continue
            for it in items:
                slug = it["href"].replace("./articles/", "").replace("/articles/", "")
                cat_articles[slug] = cat

        for idx, it in enumerate(art_summary["loadMoreSteps"][-1]["articles"], start=1):
            slug = it["href"].replace("./articles/", "").replace("/articles/", "")
            route = f"/articles/{slug}"
            det = art_summary["details"].get(route) or art_summary["details"].get(it["href"]) or {}
            blocks = det.get("richBlocks", [])
            imgs = det.get("imgs", [])
            # Find cover img (largest non-avatar image)
            cover = max([i for i in imgs if i.get("w", 0) > 200], key=lambda i: i.get("w", 0), default=None)
            cover_url = cover["src"] if cover else (it["imgSrc"] or "")
            master_cover = re.sub(r"scale-down-to=\d+&?", "", cover_url).rstrip("?&")
            all_articles.append({
                "order": idx,
                "slug": slug,
                "route": route,
                "category": cat_articles.get(slug, "Design"),
                "cardText": it["text"],
                "thumbUrl": it["imgSrc"],
                "coverUrl": cover_url,
                "masterCoverUrl": master_cover,
                "innerText": det.get("innerText", ""),
                "richBlocks": blocks
            })
        (OUT_DIR / "content/articles_all_12.json").write_text(json.dumps(all_articles, indent=2, ensure_ascii=False), encoding="utf-8")

        # 4. Extract About & Contact images
        about_assets = json.loads((OUT_DIR / "pages/about/assets.json").read_text(encoding="utf-8"))
        contact_assets = json.loads((OUT_DIR / "pages/contact/assets.json").read_text(encoding="utf-8"))

        # Collect all unique framerusercontent image URLs to download to assets-source/original
        urls_to_get = {}
        def register(url, folder, alias):
            if not url or "framerusercontent.com" not in url:
                return
            clean = re.sub(r"scale-down-to=\d+&?", "", url).rstrip("?&")
            if clean not in urls_to_get:
                urls_to_get[clean] = (folder, alias)

        # Seed 8 verified assets + all home, about, contact, projects, articles
        for im in home_visuals["allImgs"]:
            register(im["src"], "home", safe_filename(im["src"]))
        for im in about_assets.get("imgs", []):
            register(im["src"], "about", safe_filename(im["src"]))
        for im in contact_assets.get("imgs", []):
            register(im["src"], "contact", safe_filename(im["src"]))
        for pr in all_projects:
            register(pr["masterUrl"] or pr["thumbnailUrl"], "projects", f"{pr['slug']}-{safe_filename(pr['thumbnailUrl'])}")
        for ar in all_articles:
            register(ar["masterCoverUrl"] or ar["thumbUrl"], "articles", f"{ar['slug']}-{safe_filename(ar['thumbUrl'])}")

        for url, (folder, fname) in urls_to_get.items():
            dest = ORIG_DIR / folder / fname
            try:
                res = download_file(url, dest)
                assets_manifest.append({
                    "sourceUrl": url,
                    "folder": folder,
                    "localPath": str(dest).replace("\\\\", "/"),
                    **res
                })
            except Exception as e:
                assets_manifest.append({"sourceUrl": url, "folder": folder, "error": str(e)})

        Path("research/manifests").mkdir(parents=True, exist_ok=True)
        Path("research/manifests/assets_download_log.json").write_text(json.dumps(assets_manifest, indent=2), encoding="utf-8")
        browser.close()
    print(f"DONE! Downloaded/verified {len(assets_manifest)} assets.")

if __name__ == "__main__":
    main()
