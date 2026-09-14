// Cek kontras WCAG untuk setiap pasangan token warna.
// Token dibaca langsung dari src/app/globals.css, jadi kalau aksen diubah,
// jalankan ulang `npm run contrast` dan script gagal (exit 1) bila ada yang < target.
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
const tokens = Object.fromEntries(
  [...css.matchAll(/--color-([a-z-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]),
);

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

// [foreground, background, minimum, catatan pemakaian]
const pairs = [
  ["ink", "paper", 4.5, "teks utama di latar halaman"],
  ["ink", "surface", 4.5, "teks utama di panel"],
  ["ink", "accent-tint", 4.5, "teks di blok tint"],
  ["ink-soft", "paper", 4.5, "teks sekunder, placeholder"],
  ["ink-soft", "surface", 4.5, "teks sekunder di panel"],
  ["ink-soft", "accent-tint", 4.5, "teks sekunder di blok tint"],
  ["accent", "paper", 4.5, "tautan/aksen teks"],
  ["accent", "surface", 4.5, "tautan di panel"],
  ["accent-strong", "accent-tint", 4.5, "teks aksen di blok tint"],
  ["on-accent", "accent", 4.5, "teks tombol utama"],
  ["on-accent", "accent-strong", 4.5, "teks tombol utama saat hover"],
  ["on-accent", "ink", 4.5, "teks di kurtain transisi"],
  ["danger", "surface", 4.5, "pesan error di form"],
  ["danger", "paper", 4.5, "pesan error di latar halaman"],
  ["line-strong", "surface", 3, "border input (non-teks, 3:1)"],
  ["line-strong", "paper", 3, "border input di latar halaman (non-teks, 3:1)"],
  ["accent", "paper", 3, "focus ring (non-teks, 3:1)"],
];

let failed = 0;
console.log("Token dari globals.css:", tokens, "\n");
for (const [fg, bg, min, note] of pairs) {
  if (!tokens[fg] || !tokens[bg]) {
    console.log(`MISSING  ${fg} on ${bg}`);
    failed++;
    continue;
  }
  const r = ratio(tokens[fg], tokens[bg]);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${r.toFixed(2).padStart(5)}:1  (min ${min})  ${fg} ${tokens[fg]} on ${bg} ${tokens[bg]}  - ${note}`,
  );
}
console.log(failed ? `\n${failed} pasangan gagal.` : "\nSemua pasangan lolos.");
process.exit(failed ? 1 : 0);
