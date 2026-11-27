import json
import re
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE_URL = "https://sevora.framer.website"

def main():
    # 1. Re-capture spotless service isometric states & footer wordmark (hiding Framer badge)
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        pg = b.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=2)
        pg.goto(BASE_URL + "/", wait_until="domcontentloaded", timeout=30000)
        pg.wait_for_timeout(1500)
        pg.evaluate("""() => {
            document.querySelectorAll('a, div').forEach(el => {
                const txt = (el.innerText || '').trim();
                if (txt === 'Get the template' || txt === 'Made in Framer') {
                    const cs = getComputedStyle(el);
                    if (cs.position === 'fixed' || el.closest('[style*="position: fixed"], [style*="position:fixed"]')) {
                        const root = el.closest('[style*="position: fixed"], [style*="position:fixed"]') || el;
                        root.style.display = 'none';
                    }
                }
            });
            const badge = document.getElementById('__framer-badge-container');
            if (badge) badge.style.display = 'none';
        }""")
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

    # 2. Generate src/content/projects.ts from projects_all_27.json & assets_download_log.json
    projs = json.loads(Path("research/reference/content/projects_all_27.json").read_text(encoding="utf-8"))
    assets_log = json.loads(Path("research/manifests/assets.json").read_text(encoding="utf-8"))
    url_to_pub = {}
    for a in assets_log:
        url_to_pub[a["sourceUrl"]] = a["deliveryPath"]
        # also map without query params
        clean = a["sourceUrl"].split("?")[0]
        url_to_pub[clean] = a["deliveryPath"]

    featured_names = {"Brandora", "Nivora", "Codify", "Neutra", "Snapkit", "Todofusion"}
    ts_projs = []
    for p in projs:
        murl = (p.get("masterUrl") or p.get("thumbnailUrl") or "")
        pub_path = url_to_pub.get(murl) or url_to_pub.get(murl.split("?")[0]) or ""
        ts_projs.append({
            "id": p["slug"],
            "slug": p["slug"],
            "name": p["name"],
            "categories": p["categories"],
            "thumbnailPath": pub_path,
            "externalUrl": p["externalUrl"],
            "internalRoute": None,
            "featured": p["name"] in featured_names,
            "order": p["order"],
            "imageAlt": p["imageAlt"],
            "referenceVersion": "live-2026-11",
            "licenseStatus": "template-demo",
            "verificationStatus": "VERIFIED"
        })

    Path("src/content").mkdir(parents=True, exist_ok=True)
    Path("src/content/projects.ts").write_text(
        'import type { ProjectCategory, ProjectRecord } from "@/types/content";\n\n'
        'export const PROJECT_CATEGORIES: ProjectCategory[] = [\n'
        '  "All projects",\n  "AI",\n  "Business",\n  "One page",\n  "Portfolio",\n  "Online course",\n];\n\n'
        f'export const projects: ProjectRecord[] = {json.dumps(ts_projs, indent=2, ensure_ascii=False)};\n',
        encoding="utf-8"
    )

    # 3. Generate src/content/articles.ts from articles_all_12_enriched.json
    enriched = json.loads(Path("research/reference/content/articles_all_12_enriched.json").read_text(encoding="utf-8"))
    ts_articles = []
    all_slugs = [a["slug"] for a in enriched]

    for a in enriched:
        slug = a["slug"]
        murl = a.get("masterCoverUrl") or a.get("coverUrl") or a.get("thumbUrl") or ""
        pub_path = url_to_pub.get(murl) or url_to_pub.get(murl.split("?")[0]) or ""
        # Parse bodyText cleanly:
        # Format in bodyText:
        # Header... \nAll Articles\n<Title>\n<Excerpt>\n<Author>\n<Category>\n<X min read>\n<PublishedDate>\n<Body...>\nRelated articles...
        bt = a.get("bodyText", "")
        lines = [ln.strip() for ln in bt.split("\n")]
        # Find "All Articles"
        try:
            start_idx = lines.index("All Articles") + 1
        except ValueError:
            start_idx = 0
        # Find "Related articles"
        try:
            end_idx = lines.index("Related articles")
        except ValueError:
            end_idx = len(lines)

        section_lines = [ln for ln in lines[start_idx:end_idx] if ln]
        title = a.get("extractedTitle") or (section_lines[0] if section_lines else slug)
        # Find author Sevora Vale
        author_idx = next((i for i, l in enumerate(section_lines) if l == "Sevora Vale"), -1)
        excerpt = section_lines[1] if len(section_lines) > 1 and author_idx != 1 else ""
        published_at = ""
        reading_mins = 3
        body_start = 2
        if author_idx != -1:
            if author_idx > 1:
                excerpt = section_lines[1]
            # Look after Sevora Vale: category, X min read, Date
            for k in range(author_idx + 1, min(author_idx + 5, len(section_lines))):
                val = section_lines[k]
                m = re.match(r"(\d+)\s*min\s*read", val, re.I)
                if m:
                    reading_mins = int(m.group(1))
                elif re.search(r"(202\d|January|February|March|April|May|June|July|August|September|October|November|December)", val):
                    published_at = val
                    body_start = k + 1

        # Build structured blocks from elements array matching y after cover image and before Related articles
        els = a.get("elements", [])
        # Filter elements that are inside the article body (after published_at, before "Related articles")
        rel_y = next((e["y"] for e in els if e["text"] == "Related articles"), 999999)
        h1_y = next((e["y"] for e in els if e["tag"] == "H1"), 0)
        blocks = []
        seen_texts = set()
        for e in els:
            if e["y"] <= h1_y + 160 or e["y"] >= rel_y:
                continue
            txt = e["text"].strip()
            if not txt or txt in {title, excerpt, "Sevora Vale", a["category"], published_at, "All Articles", "Related articles"}:
                continue
            if re.match(r"^\d+\s*min\s*read$", txt, re.I):
                continue
            if txt in seen_texts:
                continue
            seen_texts.add(txt)
            tag = e["tag"]
            if tag == "H2":
                blocks.append({"type": "h2", "text": txt})
            elif tag in ("H3", "H4"):
                blocks.append({"type": "h3", "text": txt})
            elif tag == "LI":
                if blocks and blocks[-1]["type"] == "ul":
                    blocks[-1]["items"].append(txt)
                else:
                    blocks.append({"type": "ul", "items": [txt]})
            elif tag == "BLOCKQUOTE":
                blocks.append({"type": "quote", "text": txt})
            else:
                blocks.append({"type": "p", "text": txt})

        # Fallback if elements missed paragraphs
        if not blocks and body_start < len(section_lines):
            for ln in section_lines[body_start:]:
                blocks.append({"type": "p", "text": ln})

        # Related article IDs from relatedLinks
        rel_ids = []
        for rl in a.get("relatedLinks", []):
            rslug = rl["href"].replace("./articles/", "").replace("/articles/", "").strip("/")
            if rslug != slug and rslug in all_slugs and rslug not in rel_ids:
                rel_ids.append(rslug)
        if len(rel_ids) < 3:
            for s in all_slugs:
                if s != slug and s not in rel_ids:
                    rel_ids.append(s)
                if len(rel_ids) == 3:
                    break

        ts_articles.append({
            "id": slug,
            "slug": slug,
            "title": title,
            "excerpt": excerpt,
            "authorId": "sevora-vale",
            "category": a["category"],
            "readingMinutes": reading_mins,
            "publishedAt": published_at or "August 3, 2026",
            "updatedAt": None,
            "coverPath": pub_path,
            "thumbnailPath": pub_path,
            "coverAlt": title,
            "body": blocks,
            "relatedArticleIds": rel_ids[:3],
            "order": a["order"],
            "contentRights": "reference-demo",
            "verificationStatus": "VERIFIED"
        })

    Path("src/content/articles.ts").write_text(
        'import type { ArticleCategory, ArticleRecord, AuthorProfile } from "@/types/content";\n\n'
        'export const ARTICLE_CATEGORIES: ArticleCategory[] = [\n'
        '  "All articles",\n  "Web design",\n  "Product design",\n  "UI Design",\n];\n\n'
        'export const AUTHORS: Record<string, AuthorProfile> = {\n'
        '  "sevora-vale": {\n'
        '    id: "sevora-vale",\n'
        '    name: "Sevora Vale",\n'
        '    role: "Founder & Designer",\n'
        '    avatarPath: "/assets/images/testimonials/avatar-1.jpg",\n'
        '  },\n'
        '};\n\n'
        f'export const articles: ArticleRecord[] = {json.dumps(ts_articles, indent=2, ensure_ascii=False)};\n',
        encoding="utf-8"
    )
    print(f"Generated projects.ts ({len(ts_projs)}) and articles.ts ({len(ts_articles)})!")

if __name__ == "__main__":
    main()
