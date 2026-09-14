// Screenshot full-page untuk review visual.
// Pakai: node scripts/screenshot-pages.mjs <baseUrl> <outDir>
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const out = process.argv[3] ?? "screenshots";
mkdirSync(out, { recursive: true });

const shots = [
  { route: "/", width: 375, height: 812 },
  { route: "/listing/sesetan", width: 375, height: 812 },
  { route: "/simulasi-kpr", width: 375, height: 812 },
  { route: "/", width: 1440, height: 900 },
  { route: "/listing/sesetan", width: 1440, height: 900 },
  { route: "/kontak", width: 1440, height: 900 },
];

const browser = await chromium.launch();
for (const shot of shots) {
  const context = await browser.newContext({ viewport: { width: shot.width, height: shot.height }, deviceScaleFactor: 1 });
  const host = new URL(base).hostname;
  await context.addCookies([{ name: "rbe_consent", value: "v1.m0.p0", domain: host, path: "/" }]);
  const page = await context.newPage();
  await page.goto(base + shot.route, { waitUntil: "networkidle" });
  await page.waitForTimeout(2600);
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 50));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);
  const name = `${shot.width}${shot.route.replace(/\//g, "_") || "_home"}.png`;
  await page.screenshot({ path: join(out, name), fullPage: true });
  console.log("shot", name);
  await context.close();
}
await browser.close();
