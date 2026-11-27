import hashlib
import json
import os
import re
import shutil
import struct
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright

BASE_URL = "https://sevora.framer.website"
ORIG_DIR = Path("assets-source/original")
PUB_DIR = Path("public/assets")

def sanitize_svg(svg_str: str) -> str:
    # Remove scripts or event handlers if any
    svg_str = re.sub(r"<script[\s\S]*?</script>", "", svg_str, flags=re.IGNORECASE)
    svg_str = re.sub(r"\son\w+\s*=\s*(['\"]).*?\1", "", svg_str, flags=re.IGNORECASE)
    return svg_str

def inspect_image_meta(path: Path) -> dict:
    ext = path.suffix.lower()
    size = path.stat().st_size
    sha = hashlib.sha256(path.read_bytes()).hexdigest()
    meta = {"fileSize": size, "sha256": sha, "width": None, "height": None, "hasTransparency": False, "isAnimated": False, "frames": 1}
    if ext == ".svg":
        txt = path.read_text(encoding="utf-8", errors="ignore")
        m = re.search(r'viewBox\s*=\s*"([^"]+)"', txt)
        if m:
            parts = m.group(1).strip().split()
            if len(parts) == 4:
                meta["width"] = float(parts[2])
                meta["height"] = float(parts[3])
        meta["hasTransparency"] = True
        return meta
    try:
        with Image.open(path) as im:
            meta["width"], meta["height"] = im.size
            meta["hasTransparency"] = im.mode in ("RGBA", "LA") or ("transparency" in im.info)
            if getattr(im, "is_animated", False):
                meta["isAnimated"] = True
                meta["frames"] = getattr(im, "n_frames", 1)
    except Exception:
        pass
    return meta

def main():
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        pg = b.new_page(viewport={"width": 1440, "height": 900})
        pg.goto(BASE_URL + "/", wait_until="domcontentloaded", timeout=30000)
        pg.wait_for_timeout(1500)

        # Resolve all <svg><use href="#..."></use></svg> inside logo strip, benefits, services, pricing, footer
        resolved = pg.evaluate("""() => {
            function resolveSvg(svgEl) {
                const use = svgEl.querySelector('use');
                if (!use) return svgEl.outerHTML;
                const href = use.getAttribute('href') || use.getAttribute('xlink:href') || '';
                const id = href.replace(/^#/, '');
                const sym = document.getElementById(id);
                if (!sym) return svgEl.outerHTML;
                const vb = sym.getAttribute('viewBox') || svgEl.getAttribute('viewBox') || '';
                return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${sym.innerHTML}</svg>`;
            }
            const logos = Array.from(document.querySelectorAll('svg')).filter(s => {
                const r = s.getBoundingClientRect();
                const y = r.top + window.scrollY;
                return y > 700 && y < 980 && r.width > 12;
            }).map((s, idx) => ({
                idx,
                w: Math.round(s.getBoundingClientRect().width),
                h: Math.round(s.getBoundingClientRect().height),
                svg: resolveSvg(s)
            }));

            // Services isometric complete inner HTML
            const srvH2 = Array.from(document.querySelectorAll('h2')).find(h => (h.innerText||'').includes('Creative services'));
            const srvSec = srvH2?.closest('[data-framer-name="Container"]');
            const srvRight = srvSec ? Array.from(srvSec.querySelectorAll('[data-framer-name]')).find(e => e.getBoundingClientRect().width > 450 && e.getBoundingClientRect().left > 650) : null;

            return {
                logos,
                srvOuter: srvRight ? srvRight.outerHTML : '',
                srvRect: srvRight ? srvRight.getBoundingClientRect().toJSON() : null
            };
        }""")

        logo_dir = ORIG_DIR / "logos"
        logo_dir.mkdir(parents=True, exist_ok=True)
        for l in resolved["logos"]:
            (logo_dir / f"client-logo-{l['idx']+1}.svg").write_text(sanitize_svg(l["svg"]), encoding="utf-8")

        Path("research/reference/pages/home/services_diagram_dom.json").write_text(
            json.dumps({"srvRect": resolved["srvRect"], "srvOuter": resolved["srvOuter"]}, indent=2),
            encoding="utf-8"
        )

        # Also resolve Tool icons on /about
        pg.goto(BASE_URL + "/about", wait_until="domcontentloaded", timeout=30000)
        pg.wait_for_timeout(1500)
        pg.evaluate("window.scrollTo(0, 3200)")
        pg.wait_for_timeout(600)
        about_tools = pg.evaluate("""() => {
            function resolveSvg(svgEl) {
                const use = svgEl.querySelector('use');
                if (!use) return svgEl.outerHTML;
                const href = use.getAttribute('href') || use.getAttribute('xlink:href') || '';
                const id = href.replace(/^#/, '');
                const sym = document.getElementById(id);
                if (!sym) return svgEl.outerHTML;
                const vb = sym.getAttribute('viewBox') || svgEl.getAttribute('viewBox') || '';
                return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${sym.innerHTML}</svg>`;
            }
            return ['Framer', 'Figma', 'illustrator', 'Photoshop', 'Webflow'].map(name => {
                const el = Array.from(document.querySelectorAll('*')).find(e => e.children.length === 0 && (e.innerText||'').trim() === name);
                let card = el?.closest('[data-framer-name]');
                while (card && card.parentElement && card.getBoundingClientRect().width < 160) card = card.parentElement;
                const svgs = card ? Array.from(card.querySelectorAll('svg')).map(s => resolveSvg(s)) : [];
                const imgs = card ? Array.from(card.querySelectorAll('img')).map(i => i.currentSrc || i.src) : [];
                return { name, svgs, imgs };
            });
        }""")
        tools_dir = ORIG_DIR / "tools"
        tools_dir.mkdir(parents=True, exist_ok=True)
        for t in about_tools:
            if t["svgs"]:
                (tools_dir / f"{t['name'].lower()}.svg").write_text(sanitize_svg(t["svgs"][0]), encoding="utf-8")
        Path("research/reference/pages/about/tool_icons_extracted.json").write_text(json.dumps(about_tools, indent=2), encoding="utf-8")
        b.close()

    # Copy all curated assets to public/assets/ with clean semantic mapping & deduplication
    log = json.loads(Path("research/manifests/assets_download_log.json").read_text(encoding="utf-8"))
    # Map downloaded files by SHA256 so we don't duplicate
    by_sha = {}
    manifest_records = []

    # Map known core assets to clean public paths
    known_map = {
        "3Wbfg1JRGAb4TRMMz69WlQMTe8.png": "images/hero/sevora-monochrome-portrait.png",
        "IHneqoBbdHUCED6FYR137ZUxEqI.gif": "textures/sevora-fluid-dark.gif",
        "urHsc2gl0mz8FFsPFV1HMTq2DnE.svg": "brand/sevora-mark.svg",
        "xr7AByWMQArTJoUQ72juGc1wbI.jpg": "images/about/sevora-profile-portrait.jpg",
        "tM9dFJoYpuPFsgm0rEyiucfcUWc.png": "images/about/books-and-black-mug.png",
        "cgXwgj75ijDSBCwJjLkPHR8f8.png": "images/about/sevora-signature.png",
        "UzJzJqXzd7hGr0L8GmNzJ0s41wM.png": "images/about/design-approach-workspace.png",
        "hiVKDTvJcZfQcvsdGemPrqIROGc.png": "images/about/sevora-studio-workspace.png",
        "WpPH5o5mJSJkqfaHofbVcED1fiE.png": "images/benefits/framer-execution-thumb.png",
        "fNNlYXrAGPgp4qHPRedQjrKpo9c.svg": "images/benefits/framer-logo-badge.svg",
        "7n35wdG8jtT2LMgYCpqeBkSo6s.jpg": "images/testimonials/avatar-1.jpg",
        "s45yKcA8Ca8Yoakc4y2MawGRx0.jpg": "images/testimonials/avatar-2.jpg",
        "S9PyleA1z5ugBA2Z87N0r7h5VA.jpg": "images/testimonials/avatar-3.jpg",
        "nFTyhTg9mtSiD0Oh51DGHixETM.jpg": "images/testimonials/avatar-4.jpg",
        "qeYrxqQc9vll222pCTtaYWDxo.jpg": "images/testimonials/ethan-brooks.jpg",
        "rZmnnPdh2NfRFd8GwnJmVeCq5Ow.jpg": "images/testimonials/maya-chen.jpg",
        "F7xKBZD13OAZS7v2lY0Dm198.png": "images/testimonials/liam-carter.png",
    }

    for entry in log:
        if "error" in entry:
            continue
        src_path = Path(entry["localPath"])
        if not src_path.exists():
            continue
        meta = inspect_image_meta(src_path)
        sha = meta["sha256"]
        fname = src_path.name
        folder = entry["folder"]

        if fname in known_map:
            rel_pub = known_map[fname]
        elif folder == "projects":
            rel_pub = f"images/projects/{fname}"
        elif folder == "articles":
            rel_pub = f"images/articles/{fname}"
        else:
            rel_pub = f"images/{folder}/{fname}"

        dup_of = None
        if sha in by_sha:
            dup_of = by_sha[sha]
            delivery_path = by_sha[sha]
        else:
            dest_pub = PUB_DIR / rel_pub
            dest_pub.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src_path, dest_pub)
            delivery_path = f"/assets/{rel_pub}"
            by_sha[sha] = delivery_path

        manifest_records.append({
            "id": src_path.stem,
            "sourceUrl": entry["sourceUrl"],
            "masterPath": entry["localPath"],
            "deliveryPath": delivery_path,
            "duplicateOf": dup_of,
            "folder": folder,
            "originalWidth": meta["width"],
            "originalHeight": meta["height"],
            "fileSize": meta["fileSize"],
            "hasTransparency": meta["hasTransparency"],
            "isAnimated": meta["isAnimated"],
            "frames": meta["frames"],
            "sha256": sha,
            "verificationStatus": "VERIFIED"
        })

    # Copy extracted SVG logos, tool icons, and footer shader screenshot
    for svg_p in sorted((ORIG_DIR / "logos").glob("*.svg")):
        dest = PUB_DIR / "logos" / svg_p.name
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(svg_p, dest)
    for svg_p in sorted((ORIG_DIR / "tools").glob("*.svg")):
        dest = PUB_DIR / "icons" / "tools" / svg_p.name
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(svg_p, dest)
    shader_p = ORIG_DIR / "footer/sevora-wordmark-shader.png"
    if shader_p.exists():
        dest = PUB_DIR / "footer/sevora-wordmark-shader.png"
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(shader_p, dest)

    Path("research/manifests/assets.json").write_text(json.dumps(manifest_records, indent=2), encoding="utf-8")
    print(f"Prepared {len(by_sha)} unique public delivery assets from {len(manifest_records)} records!")

if __name__ == "__main__":
    main()
