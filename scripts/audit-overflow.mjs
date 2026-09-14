// Audit otomatis di 375, 768, 1440 untuk semua route publik.
// Pakai: node scripts/audit-overflow.mjs https://rumah-bali-estate.vercel.app
// Mengecek: overflow horizontal, batas baris heading per viewport, gambar rusak,
// error konsol, request gagal, reveal di dalam induk overflow-hidden,
// dan tombol WhatsApp melayang yang menutupi elemen interaktif.
import { chromium } from "playwright";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const routes = ["/", "/listing", "/listing/sesetan", "/simulasi-kpr", "/kontak", "/kebijakan-privasi", "/syarat-ketentuan"];
const viewports = [
  { name: "mobile", width: 375, height: 812, maxLines: 3 },
  { name: "tablet", width: 768, height: 1024, maxLines: 2 },
  { name: "desktop", width: 1440, height: 900, maxLines: 1 },
];

const report = { base, failures: [], warnings: [], checked: 0 };
const fail = (msg) => report.failures.push(msg);
const warn = (msg) => report.warnings.push(msg);

const browser = await chromium.launch();

for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.width < 768,
    hasTouch: vp.width < 1024,
  });
  for (const route of routes) {
    const page = await context.newPage();
    const errors = [];
    const failed = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("requestfailed", (r) => {
      const url = r.url();
      // Prefetch RSC yang dibatalkan karena navigasi bukan kegagalan server.
      if (r.failure()?.errorText === "net::ERR_ABORTED" && url.includes("_rsc=")) return;
      failed.push(`${url} (${r.failure()?.errorText})`);
    });
    page.on("response", (r) => r.status() >= 400 && failed.push(`${r.url()} (HTTP ${r.status()})`));

    const res = await page.goto(base + route, { waitUntil: "networkidle" });
    const tag = `[${vp.name} ${vp.width}] ${route}`;
    if (!res || res.status() !== 200) fail(`${tag} status ${res?.status()}`);
    await page.waitForTimeout(2600); // loader selesai

    // scroll ke bawah agar lazy image & reveal terpicu
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 400));
    });

    const result = await page.evaluate(({ maxLines, width }) => {
      const out = { overflow: [], headings: [], broken: [], revealInHidden: [], fabOverlap: [], docWidth: 0 };
      const vw = document.documentElement.clientWidth;
      out.docWidth = document.documentElement.scrollWidth;
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const style = getComputedStyle(el);
        if (style.position === "fixed" && style.visibility === "hidden") continue;
        if (r.right > vw + 1 || r.left < -1) {
          // abaikan elemen yang terpotong oleh induk overflow hidden/clip
          let clipped = false;
          for (let p = el.parentElement; p; p = p.parentElement) {
            const ps = getComputedStyle(p);
            if (/(hidden|clip)/.test(ps.overflowX) && p !== document.body && p !== document.documentElement) {
              const pr = p.getBoundingClientRect();
              if (pr.right <= vw + 1 && pr.left >= -1) clipped = true;
              break;
            }
          }
          if (!clipped && !el.closest("[aria-hidden='true'].site-loader, [data-phase]")) {
            out.overflow.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} (${Math.round(r.left)}..${Math.round(r.right)})`);
          }
        }
      }
      for (const h of document.querySelectorAll("main h1, main h2, footer h2")) {
        const cs = getComputedStyle(h);
        if (cs.display === "none") continue;
        const lh = parseFloat(cs.lineHeight);
        const lines = Math.round((h.getBoundingClientRect().height - parseFloat(cs.paddingBottom || "0")) / lh);
        out.headings.push({ text: (h.getAttribute("aria-label") || h.textContent || "").trim().slice(0, 60), lines, tag: h.tagName });
      }
      for (const img of document.querySelectorAll("img")) {
        if (img.complete && img.naturalWidth === 0) out.broken.push(img.currentSrc || img.src);
      }
      if (document.querySelector('[role="img"][aria-label] svg')) {
        for (const f of document.querySelectorAll('[role="img"][aria-label]')) if (f.textContent.includes("belum dapat dimuat")) out.broken.push("fallback:" + f.getAttribute("aria-label"));
      }
      for (const el of document.querySelectorAll("[data-reveal-root]")) {
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
          if (/(hidden|clip)/.test(getComputedStyle(p).overflow)) {
            out.revealInHidden.push(String(p.className).slice(0, 60));
            break;
          }
        }
        if (el.dataset.reveal === "pending") out.revealInHidden.push("masih pending setelah scroll: " + String(el.className).slice(0, 40));
      }
      const fab = document.querySelector("[data-fab]");
      if (fab && width < 768) {
        const fr = fab.getBoundingClientRect();
        for (const el of document.querySelectorAll("main a, main button, footer a, footer button")) {
          if (el === fab) continue;
          const r = el.getBoundingClientRect();
          if (r.width === 0) continue;
          const overlap = !(r.right < fr.left || r.left > fr.right || r.bottom < fr.top || r.top > fr.bottom);
          if (overlap) out.fabOverlap.push((el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 40));
        }
      }
      return out;
    }, { maxLines: vp.maxLines, width: vp.width });

    if (result.docWidth > vp.width) fail(`${tag} document scrollWidth ${result.docWidth} > ${vp.width}`);
    result.overflow.forEach((o) => fail(`${tag} overflow: ${o}`));
    for (const h of result.headings) {
      if (h.lines > 3) fail(`${tag} heading ${h.lines} baris (maks 3): ${h.text}`);
      else if (h.lines > vp.maxLines) (vp.name === "desktop" ? warn : fail)(`${tag} heading ${h.lines} baris (target ${vp.maxLines}): ${h.text}`);
    }
    result.broken.forEach((b) => fail(`${tag} gambar rusak: ${b}`));
    result.revealInHidden.forEach((b) => fail(`${tag} reveal bermasalah: ${b}`));
    result.fabOverlap.forEach((b) => fail(`${tag} FAB menutupi saat scroll paling bawah: ${b}`));
    errors.forEach((e) => fail(`${tag} console error: ${e.slice(0, 200)}`));
    [...new Set(failed)].forEach((f) => fail(`${tag} request gagal: ${f}`));
    report.checked++;
    await page.close();
  }

  // Hamburger (mobile & tablet)
  if (vp.width < 768) {
    const page = await context.newPage();
    await page.goto(base + "/", { waitUntil: "networkidle" });
    await page.waitForTimeout(2600);
    const toggle = page.locator('button[aria-controls="mobile-menu"]');
    await toggle.click();
    const menuVisible = await page.locator("#mobile-menu").isVisible();
    const expanded = await toggle.getAttribute("aria-expanded");
    if (!menuVisible || expanded !== "true") fail(`[${vp.name}] hamburger tidak membuka menu`);
    await page.locator("#mobile-menu a", { hasText: "Simulasi KPR" }).click();
    await page.waitForURL("**/simulasi-kpr", { timeout: 8000 }).catch(() => fail(`[${vp.name}] link menu tidak menavigasi`));
    await page.waitForTimeout(1800);
    const closed = !(await page.locator("#mobile-menu").isVisible().catch(() => false));
    if (!closed) fail(`[${vp.name}] menu tidak tertutup setelah navigasi`);
    await page.close();
  }
  await context.close();
}

await browser.close();
console.log(JSON.stringify(report, null, 2));
console.log(report.failures.length ? `\n${report.failures.length} masalah ditemukan.` : `\nNol masalah di ${report.checked} halaman x viewport.`);
process.exit(report.failures.length ? 1 : 0);
