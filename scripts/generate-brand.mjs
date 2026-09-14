// OG image (16:9, 1200x675) dan logo PNG transparan (1:1, 512) dari wordmark
// Rumah Bali Estate. Dirender dengan Playwright memakai font self-host proyek.
// Jalankan: node scripts/generate-brand.mjs (setelah npm run art)
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const font = readFileSync(new URL("src/fonts/PlusJakartaSans-Variable-latin.woff2", root)).toString("base64");
const mark = readFileSync(new URL("public/brand/mark.svg", root), "utf8").replace(/<title>.*?<\/title>/, "");

const base = `
@font-face{font-family:Jakarta;src:url(data:font/woff2;base64,${font}) format("woff2");font-weight:200 800}
*{margin:0;box-sizing:border-box}
body{font-family:Jakarta,sans-serif;-webkit-font-smoothing:antialiased}
`;

const og = `<!doctype html><html><head><style>${base}
body{width:1200px;height:675px;background:#f2f5f1;color:#121a15;position:relative;overflow:hidden}
.wrap{position:absolute;left:96px;top:0;bottom:0;display:grid;align-content:center;gap:28px}
.brand{display:flex;align-items:center;gap:28px}
.brand svg{width:132px;height:132px}
h1{font-size:92px;font-weight:800;letter-spacing:-0.035em;line-height:1}
p{font-size:36px;font-weight:500;color:#435048;letter-spacing:-0.01em}
.roof{position:absolute;right:-40px;bottom:-40px;width:520px;height:300px}
.bar{position:absolute;left:96px;bottom:72px;width:120px;height:6px;background:#17753a}
</style></head><body>
<svg class="roof" viewBox="0 0 520 300"><path d="M40 300V150L300 20l260 130v150" fill="none" stroke="#e2efe5" stroke-width="34"/><path d="M190 300V210l110-60 110 60v90" fill="none" stroke="#e2efe5" stroke-width="26"/></svg>
<div class="wrap"><div class="brand">${mark}<h1>Rumah<br>Bali Estate</h1></div><p>Solusi Rumah Idaman Anda</p></div>
<div class="bar"></div>
</body></html>`;

const logo = `<!doctype html><html><head><style>${base}
html,body{width:512px;height:512px;background:transparent}
body{display:grid;place-items:center}
svg{width:440px;height:440px}
</style></head><body>${mark}</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 675 } });
await page.setContent(og, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: fileURLToPath(new URL("public/og.png", root)) });

await page.setViewportSize({ width: 512, height: 512 });
await page.setContent(logo, { waitUntil: "load" });
await page.screenshot({ path: fileURLToPath(new URL("public/brand/logo-512.png", root)), omitBackground: true });
await browser.close();
console.log("OG image dan logo PNG ditulis.");
