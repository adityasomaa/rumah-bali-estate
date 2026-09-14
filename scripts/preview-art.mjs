// Render semua ilustrasi di public/art menjadi satu contact sheet PNG untuk dicek visual.
// Pakai: node scripts/preview-art.mjs <output.png>
import { chromium } from "playwright";
import { readdirSync, readFileSync } from "node:fs";

const dir = new URL("../public/art/", import.meta.url);
const out = process.argv[2] ?? "art-preview.png";
const figures = readdirSync(dir)
  .filter((f) => f.endsWith(".svg"))
  .map((f) => {
    const data = Buffer.from(readFileSync(new URL(f, dir))).toString("base64");
    return `<figure style="margin:0"><img style="width:100%;display:block" src="data:image/svg+xml;base64,${data}"><figcaption style="font:13px sans-serif;color:#fff">${f}</figcaption></figure>`;
  })
  .join("");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await page.setContent(
  `<body style="margin:0;padding:8px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px;align-items:start;background:#3a3f3c">${figures}</body>`,
);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log("Preview:", out);
