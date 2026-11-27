import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import sharp from "sharp";

const PORT = 3100;
const BASE_URL = process.env.TEST_BASE_URL || `http://127.0.0.1:${PORT}`;
const OUT_DIR = path.resolve("research/comparisons");

function findChromiumExe() {
  const localApp = process.env.LOCALAPPDATA || "";
  const msPw = path.join(localApp, "ms-playwright");
  if (!fs.existsSync(msPw)) return undefined;
  const dirs = fs.readdirSync(msPw).filter((d) => d.startsWith("chromium_headless_shell-") || d.startsWith("chromium-")).sort().reverse();
  for (const d of dirs) {
    const candidate1 = path.join(msPw, d, "chrome-headless-shell-win64", "chrome-headless-shell.exe");
    const candidate2 = path.join(msPw, d, "chrome-win", "chrome.exe");
    const candidate3 = path.join(msPw, d, "chrome-win64", "chrome.exe");
    for (const c of [candidate1, candidate2, candidate3]) {
      if (fs.existsSync(c)) return c;
    }
  }
  return undefined;
}

async function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

const ROUTES = [
  "/",
  "/about",
  "/projects",
  "/articles",
  "/contact",
  "/hero-sections",
  "/articles/crafting-exceptional-user-experiences",
  "/articles/10-web-design-trends-to-watch-in-2023",
  "/articles/boosting-website-performance-with-smart-design-practices",
  "/non-existent-route-check",
];

const VIEWPORTS = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-320", width: 320, height: 700 },
];

async function waitReady(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.evaluate(async () => {
    await document.fonts.ready;
    const imgs = Array.from(document.querySelectorAll("img"));
    await Promise.all(
      imgs.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((res) => {
              img.onload = res;
              img.onerror = res;
              setTimeout(res, 3000);
            })
      )
    );
  });
  await page.waitForTimeout(350);
}

async function compareImages(refPath, implPath, outDir) {
  if (!fs.existsSync(refPath) || !fs.existsSync(implPath)) return null;
  const refBuf = fs.readFileSync(refPath);
  const implBuf = fs.readFileSync(implPath);
  const refMeta = await sharp(refBuf).metadata();
  const implMeta = await sharp(implBuf).metadata();
  const w = Math.min(refMeta.width || 1440, implMeta.width || 1440);
  const h = Math.min(refMeta.height || 900, implMeta.height || 900);

  const refRaw = await sharp(refBuf)
    .extract({ left: 0, top: 0, width: w, height: h })
    .ensureAlpha()
    .raw()
    .toBuffer();
  const implRaw = await sharp(implBuf)
    .extract({ left: 0, top: 0, width: w, height: h })
    .ensureAlpha()
    .raw()
    .toBuffer();

  const diffPng = new PNG({ width: w, height: h });
  const diffPixels = pixelmatch(refRaw, implRaw, diffPng.data, w, h, { threshold: 0.15 });
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "difference.png"), PNG.sync.write(diffPng));

  // Create side-by-side comparison
  const sideBySide = await sharp({
    create: {
      width: w * 2,
      height: h,
      channels: 4,
      background: { r: 247, g: 247, b: 248, alpha: 1 },
    },
  })
    .composite([
      { input: await sharp(refBuf).extract({ left: 0, top: 0, width: w, height: h }).png().toBuffer(), left: 0, top: 0 },
      { input: await sharp(implBuf).extract({ left: 0, top: 0, width: w, height: h }).png().toBuffer(), left: w, top: 0 },
    ])
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(outDir, "side-by-side.png"), sideBySide);

  const totalPixels = w * h;
  const diffPercent = Number(((diffPixels / totalPixels) * 100).toFixed(2));
  const metrics = {
    width: w,
    height: h,
    refHeight: refMeta.height,
    implHeight: implMeta.height,
    diffPixels,
    totalPixels,
    diffPercent,
  };
  fs.writeFileSync(path.join(outDir, "metrics.json"), JSON.stringify(metrics, null, 2));
  return metrics;
}

async function run() {
  const server = spawn("npx", ["next", "start", "-p", String(PORT), "-H", "127.0.0.1"], {
    stdio: "pipe",
    shell: true,
  });

  let browser;
  try {
    await waitForServer(`${BASE_URL}/`);
    const executablePath = findChromiumExe();
    browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
  const report = {
    baseUrl: BASE_URL,
    routes: [],
    overflowChecks: [],
    interactions: {},
    accessibility: [],
    visualComparisons: {},
    consoleErrors: [],
    networkErrors: [],
  };

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error" && !msg.text().includes("404 (Not Found)")) {
      report.consoleErrors.push(msg.text());
    }
  });
  page.on("response", (res) => {
    if (res.status() >= 400 && !res.url().includes("non-existent-route-check")) {
      report.networkErrors.push({ url: res.url(), status: res.status() });
    }
  });

  // 1. Check all routes load cleanly
  for (const r of ROUTES) {
    const resp = await page.goto(`${BASE_URL}${r}`, { waitUntil: "domcontentloaded", timeout: 20000 });
    await waitReady(page);
    const title = await page.title();
    const brokenImgs = await page.evaluate(() =>
      Array.from(document.querySelectorAll("img"))
        .filter((i) => i.complete && i.naturalWidth === 0)
        .map((i) => i.getAttribute("src"))
    );
    report.routes.push({
      route: r,
      status: resp?.status() ?? null,
      title,
      brokenImages: brokenImgs,
    });
  }

  // 2. Responsive overflow checks + Desktop/Mobile captures
  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    for (const r of ["/", "/about", "/projects", "/articles", "/contact"]) {
      await page.goto(`${BASE_URL}${r}?deterministic=1`, { waitUntil: "domcontentloaded" });
      await waitReady(page);
      const ov = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        overflow: document.documentElement.scrollWidth > window.innerWidth,
      }));
      report.overflowChecks.push({ route: r, viewport: vp.name, ...ov });

      if (vp.name === "desktop-1440" || vp.name === "mobile-390") {
        const slug = r === "/" ? "home" : r.slice(1);
        const dir = path.join(OUT_DIR, slug, vp.name);
        fs.mkdirSync(dir, { recursive: true });
        await page.screenshot({ path: path.join(dir, "implementation-top.png") });
        await page.screenshot({ path: path.join(dir, "implementation-full.png"), fullPage: true });
      }
    }
  }

  // 3. Visual comparisons against live reference captures (1440x900 above-the-fold & full)
  const compPairs = [
    { key: "home-top", ref: "research/reference/screenshots/desktop/home-1440-top.png", impl: path.join(OUT_DIR, "home/desktop-1440/implementation-top.png"), out: path.join(OUT_DIR, "home/desktop-1440/top") },
    { key: "contact-full", ref: "research/reference/screenshots/desktop/contact-1440-full.png", impl: path.join(OUT_DIR, "contact/desktop-1440/implementation-full.png"), out: path.join(OUT_DIR, "contact/desktop-1440/full") },
    { key: "projects-full", ref: "research/reference/screenshots/desktop/projects-1440-all.png", impl: path.join(OUT_DIR, "projects/desktop-1440/implementation-full.png"), out: path.join(OUT_DIR, "projects/desktop-1440/full") },
    { key: "articles-full", ref: "research/reference/screenshots/desktop/articles-1440-all.png", impl: path.join(OUT_DIR, "articles/desktop-1440/implementation-full.png"), out: path.join(OUT_DIR, "articles/desktop-1440/full") },
    { key: "about-full", ref: "research/reference/screenshots/desktop/about-1440-full.png", impl: path.join(OUT_DIR, "about/desktop-1440/implementation-full.png"), out: path.join(OUT_DIR, "about/desktop-1440/full") },
  ];
  for (const cp of compPairs) {
    report.visualComparisons[cp.key] = await compareImages(cp.ref, cp.impl, cp.out);
  }

  // 4. Functional interaction tests on desktop
  await page.setViewportSize({ width: 1440, height: 900 });

  // Home interactions: Services tabs + FAQs
  await page.goto(`${BASE_URL}/?deterministic=1`, { waitUntil: "domcontentloaded" });
  await waitReady(page);
  await page.getByRole("tab", { name: "Visual system" }).click();
  const srvSelected = await page.getByRole("tab", { name: "Visual system" }).getAttribute("aria-selected");
  await page.getByRole("button", { name: "How do I submit a design request?" }).click();
  const faqExpanded = await page.getByRole("button", { name: "How do I submit a design request?" }).getAttribute("aria-expanded");
  const faqAnswerVisible = await page.getByText("shared board we will set up for you in Asana").isVisible();
  report.interactions.home = { srvSelected, faqExpanded, faqAnswerVisible };

  // Projects interactions: Load More 10 -> 20 -> 27 & category filter
  await page.goto(`${BASE_URL}/projects`, { waitUntil: "domcontentloaded" });
  await waitReady(page);
  const projInitial = await page.locator("main a[target='_blank']").count();
  await page.getByRole("button", { name: "Load More" }).click();
  const projAfterOne = await page.locator("main a[target='_blank']").count();
  await page.getByRole("button", { name: "Load More" }).click();
  const projAfterTwo = await page.locator("main a[target='_blank']").count();
  await page.getByRole("tab", { name: "AI" }).click();
  const projAI = await page.locator("main a[target='_blank']").count();
  report.interactions.projects = { projInitial, projAfterOne, projAfterTwo, projAI };

  // Articles interactions: Load More 9 -> 12 & category filter & detail nav
  await page.goto(`${BASE_URL}/articles`, { waitUntil: "domcontentloaded" });
  await waitReady(page);
  const artInitial = await page.locator("main a[href^='/articles/']").count();
  await page.getByRole("button", { name: "Load More" }).click();
  const artAfterLoad = await page.locator("main a[href^='/articles/']").count();
  await page.getByRole("tab", { name: "Web design" }).click();
  const artWeb = await page.locator("main a[href^='/articles/']").count();
  report.interactions.articles = { artInitial, artAfterLoad, artWeb };

  // Contact interactions: Validation, custom select keyboard/click, submission
  await page.goto(`${BASE_URL}/contact`, { waitUntil: "domcontentloaded" });
  await waitReady(page);
  await page.getByRole("button", { name: "Send message" }).click();
  const validationShown = await page.getByText("Please enter your name.").isVisible();
  await page.fill("#contact-name", "Jane Smith");
  await page.fill("#contact-email", "jane@example.com");
  await page.click("#contact-project-type");
  await page.getByRole("option", { name: "Website design" }).click();
  await page.click("#contact-budget-range");
  await page.getByRole("option", { name: "$3,000 - $5,000" }).click();
  await page.fill("#contact-message", "Looking to design and build a refined editorial portfolio site.");
  await page.getByRole("button", { name: "Send message" }).click();
  await page.waitForSelector("[role='status']", { timeout: 5000 });
  const submitSuccess = await page.locator("[role='status']").innerText();
  report.interactions.contact = { validationShown, submitSuccess };

  // 5. Accessibility (axe-core) across all 5 main routes
  for (const r of ["/", "/about", "/projects", "/articles", "/contact"]) {
    await page.goto(`${BASE_URL}${r}?deterministic=1`, { waitUntil: "domcontentloaded" });
    await waitReady(page);
    const axe = await new AxeBuilder({ page }).analyze();
    report.accessibility.push({
      route: r,
      violations: axe.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.length,
        targets: v.nodes.map((n) => n.target),
        description: v.description,
      })),
      passesCount: axe.passes.length,
    });
  }

  fs.mkdirSync(path.resolve("research/reports"), { recursive: true });
  fs.writeFileSync(path.resolve("research/reports/audit_report.json"), JSON.stringify(report, null, 2));
  console.log("AUDIT COMPLETE:", JSON.stringify({
    routesChecked: report.routes.length,
    brokenImgs: report.routes.flatMap((x) => x.brokenImages),
    overflows: report.overflowChecks.filter((x) => x.overflow),
    interactions: report.interactions,
    axeViolations: report.accessibility.map((a) => ({ route: a.route, count: a.violations.length, ids: a.violations.map((v) => ({ id: v.id, targets: v.targets })) })),
    visualComparisons: report.visualComparisons,
    consoleErrors: report.consoleErrors.length,
    networkErrors: report.networkErrors.length,
  }, null, 2));
  } finally {
    if (browser) await browser.close();
    if (process.platform === "win32" && server.pid) {
      spawn("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" });
    } else {
      server.kill("SIGTERM");
    }
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
