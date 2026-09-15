// Verifikasi fungsional di production.
// Pakai: node scripts/verify-production.mjs https://rumah-bali-estate.vercel.app
import { chromium } from "playwright";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const results = [];
const check = (name, ok, detail = "") => results.push({ name, ok: !!ok, detail });

// 1. File publik & SEO
for (const path of ["/robots.txt", "/sitemap.xml", "/og.png", "/icon.svg", "/brand/logo-512.png", "/art/sesetan-hero.svg"]) {
  const res = await fetch(base + path);
  const body = path.endsWith(".txt") || path.endsWith(".xml") ? await res.text() : "";
  check(`GET ${path} = 200`, res.status === 200, `${res.status} ${res.headers.get("content-type")}`);
  if (path === "/sitemap.xml") {
    for (const r of ["/", "/listing", "/listing/sesetan", "/simulasi-kpr", "/kontak", "/kebijakan-privasi", "/syarat-ketentuan"]) {
      check(`sitemap memuat ${r}`, body.includes(`<loc>${base}${r}</loc>`));
    }
  }
  if (path === "/robots.txt") check("robots menunjuk sitemap domain final", body.includes(`Sitemap: ${base}/sitemap.xml`), body.replace(/\n/g, " | "));
}
const notFound = await fetch(base + "/halaman-tidak-ada");
check("route tak dikenal = 404", notFound.status === 404, String(notFound.status));

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
await context.addCookies([{ name: "rbe_consent", value: "v1.m0.p0", domain: new URL(base).hostname, path: "/" }]);
const page = await context.newPage();

// 2. Structured data & canonical
await page.goto(base + "/listing/sesetan", { waitUntil: "networkidle" });
const ld = await page.$$eval('script[type="application/ld+json"]', (els) => els.map((e) => JSON.parse(e.textContent)));
const listing = ld.find((d) => d["@type"] === "RealEstateListing");
const org = ld.find((d) => d["@type"] === "Organization");
check("JSON-LD Organization ada", org && org.telephone === "+6283808999944");
check("JSON-LD RealEstateListing datePosted 2026-09-08", listing?.datePosted === "2026-09-08");
check(
  "JSON-LD harga 1299000000 & 1479000000 IDR",
  JSON.stringify(listing?.offers?.map((o) => [o.price, o.priceCurrency])) === JSON.stringify([[1299000000, "IDR"], [1479000000, "IDR"]]),
);
const canonical = await page.getAttribute('link[rel="canonical"]', "href");
check("canonical detail = domain final", canonical === `${base}/listing/sesetan`, canonical);
const ogImage = await page.getAttribute('meta[property="og:image"]', "content");
check("og:image memakai domain final", ogImage?.startsWith(`${base}/og.png`), ogImage);

// 3. Field spesifikasi kosong tampil sebagai ajakan bertanya (bukan hilang, bukan nol)
await page.waitForTimeout(2500);
const empty = await page.$$eval("table [data-empty-field]", (els) => els.map((e) => e.textContent.trim()));
check("tabel: 12 field spesifikasi kosong (6 x 2 tipe) tampil 'Tanyakan via WhatsApp'", empty.length === 12 && empty.every((t) => t.includes("Tanyakan via WhatsApp")), `${empty.length} field`);
check("teks screen reader field kosong menyebut 'belum dicantumkan'", empty.every((t) => t.includes("belum dicantumkan")), empty[0]);
const zeroSpecs = await page.$$eval("table tbody tr", (rows) =>
  rows.filter((r) => /Jumlah lantai|Kamar|Daya|Sertifikat|Perkiraan/.test(r.textContent) && /(^|\s)0(\s|$)|-\s*$/.test(r.querySelector("td")?.textContent ?? "")).length,
);
check("tidak ada spesifikasi yang tampil 0 atau strip", zeroSpecs === 0);
const diff = await page.$eval('table [data-diff="price"]', (e) => e.textContent);
check("selisih harga dari data: +Rp 180 juta", diff === "+Rp 180 juta", diff);
const live = await page.$eval('[data-testid="comparison-summary"]', (e) => e.getAttribute("aria-live"));
check("ringkasan selisih memakai aria-live", live === "polite");
await page.getByRole("button", { name: "Tukar urutan perbandingan" }).click();
const swapped = await page.$eval('[data-testid="comparison-summary"]', (e) => e.textContent);
check("tukar urutan membalik selisih", swapped.startsWith("Tipe 60/60 lebih murah Rp 180 juta"), swapped);

// 4. Simulasi KPR
await page.goto(base + "/simulasi-kpr", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
const fieldsEmpty = await page.$$eval("input[inputmode]", (els) => els.every((e) => e.value === ""));
check("KPR: DP, tenor, bunga kosong tanpa default", fieldsEmpty);
await page.getByRole("combobox").first().click().catch(() => {});
await page.locator('button[aria-haspopup="listbox"]').first().click();
await page.keyboard.press("ArrowDown");
await page.keyboard.press("Home");
await page.keyboard.press("Enter");
const focusBack = await page.evaluate(() => document.activeElement?.getAttribute("aria-haspopup"));
check("listbox: Enter memilih dan fokus kembali ke trigger", focusBack === "listbox");
const price = await page.locator("output").textContent();
check("KPR: harga terisi dari tipe", price.includes("Rp 1.299.000.000"), price);
const inputs = page.locator('input[inputmode]');
await inputs.nth(0).fill("20");
await inputs.nth(1).fill("15");
const noRate = await page.locator('[data-testid="kpr-monthly"]').count();
check("KPR: bunga kosong -> tidak ada angka hasil", noRate === 0);
await inputs.nth(2).fill("7,5");
await page.waitForTimeout(300);
const monthly = await page.locator('[data-testid="kpr-monthly"]').textContent();
check("KPR: contoh README Rp 9.633.512", monthly === "Rp 9.633.512", monthly);
await inputs.nth(1).fill("");
await page.keyboard.type("35");
const tenor = await inputs.nth(1).inputValue();
check("KPR: tenor ditolak di atas 30", tenor === "3", tenor);
await inputs.nth(2).fill("");
await inputs.nth(2).type("101");
const rate = await inputs.nth(2).inputValue();
check("KPR: persen ditolak di atas 100", rate === "10", rate);
await page.waitForTimeout(900);
const announce = await page.locator('[aria-live="polite"].sr-only').textContent();
check("KPR: hasil diumumkan lewat aria-live", announce.length > 10, announce);
const label = await page.getByText("Simulasi, bukan penawaran bank.").count();
check("KPR: label simulasi bukan penawaran bank", label > 0);

// 5. Form survei: tanggal lampau ditolak, pesan WhatsApp ter-encode
await page.goto(base + "/kontak", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
let opened = null;
context.on("page", async (p) => {
  opened = p.url();
  await p.close().catch(() => {});
});
await page.evaluate(() => {
  window.open = (url) => {
    window.__opened = url;
    return null;
  };
});
const form = page.locator('form[aria-label="Form jadwalkan survei lokasi"]');
await form.locator("button[type=submit]").click();
const errorsCount = await form.locator('[aria-invalid="true"]').count();
check("survei: submit kosong memunculkan error", errorsCount >= 3, `${errorsCount}`);
await form.locator('input[autocomplete="name"]').fill("Dewa Ayu & Putu #2");
await form.locator('button[aria-haspopup="listbox"]').first().click();
await page.keyboard.press("Enter");
await form.locator('input[type="date"]').fill("2026-01-01");
await form.locator("button[type=submit]").click();
const pastErr = await form.getByText("Tanggal sudah lewat").count();
check("survei: tanggal lampau ditolak", pastErr > 0);
const future = new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10);
await form.locator('input[type="date"]').fill(future);
await form.locator("textarea").fill("Baris satu\nBaris dua & tiga #rumah 🏡");
await form.locator("button[type=submit]").click();
await page.waitForTimeout(300);
const waUrl = await page.evaluate(() => window.__opened);
const text = waUrl ? decodeURIComponent(new URL(waUrl).searchParams.get("text") ?? "") : "";
check("survei: membuka wa.me/6283808999944", waUrl?.startsWith("https://wa.me/6283808999944?text="), waUrl?.slice(0, 60));
check("survei: pesan utuh (& # baris baru emoji)", text.includes("Nama: Dewa Ayu & Putu #2") && text.includes("Baris satu\nBaris dua & tiga #rumah 🏡"), text);
check("survei: raw URL tidak memuat & atau # mentah di teks", waUrl && !/[#]/.test(waUrl) && waUrl.split("?text=")[1].indexOf("&") === -1);

// 6. Tanya KPR: rupiah terformat, angka mentah terkirim
const kpr = page.locator('form[aria-label="Form tanya KPR"]');
await kpr.locator('input[autocomplete="name"]').fill("Made");
await kpr.locator('button[aria-haspopup="listbox"]').first().click();
await page.keyboard.press("Enter");
const rupiah = kpr.locator('input[inputmode="numeric"]').first();
await rupiah.pressSequentially("300000000");
const shown = await rupiah.inputValue();
check("rupiah terformat ribuan", shown === "300.000.000", shown);
await kpr.locator("button[type=submit]").click();
await page.waitForTimeout(300);
const kprText = decodeURIComponent(new URL(await page.evaluate(() => window.__opened)).searchParams.get("text") ?? "");
check("tanya KPR: DP terkirim Rp 300.000.000 (23,1%)", kprText.includes("Rencana DP: Rp 300.000.000 (23,1% dari harga)"), kprText);
check("tanya KPR: penghasilan opsional tidak ikut bila kosong", !kprText.includes("Penghasilan"));

// 7. Footer CTA bertukar di halaman tujuan
const footerCtaKontak = await page.locator("footer #footer-cta ~ div a").first().textContent();
await page.goto(base + "/listing", { waitUntil: "networkidle" });
const footerCtaListing = await page.locator("footer #footer-cta ~ div a").first().textContent();
check("footer CTA di /kontak bertukar ke listing", footerCtaKontak.includes("Lihat listing Sesetan"), footerCtaKontak);
check("footer CTA di halaman lain = Jadwalkan survei", footerCtaListing.includes("Jadwalkan survei lokasi"), footerCtaListing);

// 8. Transisi halaman tidak nyangkut & scroll ke atas
await page.waitForTimeout(2500);
await page.evaluate(() => window.scrollTo(0, 800));
await page.locator('header nav a[href="/simulasi-kpr"]').click();
await page.waitForURL("**/simulasi-kpr", { timeout: 8000 });
await page.waitForTimeout(2200);
const curtain = await page.$eval("[data-phase]", (e) => e.dataset.phase);
const scrollY = await page.evaluate(() => window.scrollY);
check("kurtain kembali idle setelah transisi", curtain === "idle", curtain);
check("setelah transisi scroll di atas", scrollY === 0, String(scrollY));

await browser.close();
const failed = results.filter((r) => !r.ok);
for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `  [${String(r.detail).slice(0, 140)}]` : ""}`);
console.log(`\n${results.length - failed.length}/${results.length} lolos.`);
process.exit(failed.length ? 1 : 0);
