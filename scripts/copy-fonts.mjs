// Salin WOFF2 Plus Jakarta Sans (variable, subset latin) dari paket Fontsource
// ke src/fonts agar di-self-host oleh next/font/local. Lisensi: SIL OFL 1.1.
import { copyFileSync, mkdirSync } from "node:fs";

const pkg = new URL("../node_modules/@fontsource-variable/plus-jakarta-sans/", import.meta.url);
const out = new URL("../src/fonts/", import.meta.url);
mkdirSync(out, { recursive: true });

copyFileSync(new URL("files/plus-jakarta-sans-latin-wght-normal.woff2", pkg), new URL("PlusJakartaSans-Variable-latin.woff2", out));
copyFileSync(new URL("LICENSE", pkg), new URL("OFL-LICENSE.txt", out));
console.log("Font disalin ke src/fonts");
