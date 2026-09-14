// ============================================================================
// Generator ilustrasi SVG deterministik untuk Rumah Bali Estate.
// Jalankan: npm run art  ->  menulis ulang public/art/*.svg dan src/app/icon.svg
// Seed tetap per gambar, jadi hasil identik setiap kali dijalankan.
// Hanya dua rasio: 16:9 (1600x900) dan 1:1 (1200x1200). Tanpa noise/grain.
// ============================================================================
import { mkdirSync, writeFileSync } from "node:fs";

const OUT = new URL("../public/art/", import.meta.url);
const BRAND = new URL("../public/brand/", import.meta.url);
mkdirSync(OUT, { recursive: true });
mkdirSync(BRAND, { recursive: true });

const WIDE = { w: 1600, h: 900 };
const SQUARE = { w: 1200, h: 1200 };

const C = {
  skyTop: "#dbe8de",
  skyBottom: "#f6f9f5",
  hill: "#cfdfd3",
  hillFar: "#e1ebe3",
  sun: "#eaf2ec",
  street: "#cdd6cf",
  sidewalk: "#e6ece7",
  curb: "#b3bfb7",
  lawn: "#bcd6c3",
  lawnEdge: "#a5c8ae",
  leaf: "#3a8a55",
  leafLight: "#5aa373",
  leafDark: "#17753a",
  trunk: "#7a5a3f",
  facade: "#fbfcfa",
  facadeShade: "#e8eee9",
  facadeDeep: "#d5ded7",
  wood: "#a97b52",
  woodLight: "#c29a70",
  woodDark: "#86603f",
  iron: "#26302a",
  ink: "#121a15",
  glass: "#b9d0c3",
  glassLight: "#e3eee7",
  accent: "#17753a",
  paver: "#dfe6e0",
};

// ---------- PRNG deterministik ----------
function seeded(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const between = (r, min, max) => min + r() * (max - min);

// ---------- primitives ----------
const n = (v) => Math.round(v * 10) / 10;
const rect = (x, y, w, h, fill, extra = "") =>
  `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" fill="${fill}"${extra}/>`;
const line = (x1, y1, x2, y2, stroke, sw, extra = "") =>
  `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" stroke="${stroke}" stroke-width="${n(sw)}"${extra}/>`;
const circle = (cx, cy, r, fill, extra = "") =>
  `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="${fill}"${extra}/>`;

function svg({ w, h }, title, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice">
<title>${title}</title>
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.skyTop}"/><stop offset="1" stop-color="${C.skyBottom}"/></linearGradient>
  <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.glassLight}"/><stop offset="0.55" stop-color="${C.glass}"/><stop offset="1" stop-color="#a6c2b3"/></linearGradient>
  <linearGradient id="eave" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#121a15" stop-opacity="0.16"/><stop offset="1" stop-color="#121a15" stop-opacity="0"/></linearGradient>
  <linearGradient id="wall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.facade}"/><stop offset="1" stop-color="${C.facadeShade}"/></linearGradient>
</defs>
${body}
</svg>
`;
}

// ---------- latar ----------
function backdrop({ w, h }, gy, r) {
  const parts = [rect(0, 0, w, h, "url(#sky)")];
  parts.push(circle(w * between(r, 0.72, 0.84), h * between(r, 0.16, 0.24), Math.min(w, h) * 0.12, C.sun));
  // bukit jauh berbentuk geometris
  const peak = w * between(r, 0.18, 0.32);
  parts.push(`<path d="M0 ${n(gy - h * 0.12)} L${n(peak)} ${n(gy - h * 0.34)} L${n(peak + w * 0.24)} ${n(gy - h * 0.16)} L${n(w * 0.7)} ${n(gy - h * 0.24)} L${w} ${n(gy - h * 0.1)} V${n(gy)} H0 Z" fill="${C.hillFar}"/>`);
  parts.push(`<path d="M0 ${n(gy - h * 0.05)} L${n(w * 0.38)} ${n(gy - h * 0.15)} L${n(w * 0.62)} ${n(gy - h * 0.07)} L${w} ${n(gy - h * 0.13)} V${n(gy)} H0 Z" fill="${C.hill}"/>`);
  // garis arsitektural halus
  for (let i = 1; i < 6; i++) {
    parts.push(line(0, (gy * i) / 7, w, (gy * i) / 7, "#ffffff", 1, ' stroke-opacity="0.35"'));
  }
  return parts.join("\n");
}

function street({ w, h }, gy, s) {
  return [
    rect(0, gy, w, 26 * s, C.sidewalk),
    rect(0, gy + 26 * s, w, 5 * s, C.curb),
    rect(0, gy + 31 * s, w, h - gy, C.street),
    line(0, gy + 31 * s + (h - gy - 31 * s) * 0.55, w, gy + 31 * s + (h - gy - 31 * s) * 0.55, C.facade, 4 * s, ` stroke-dasharray="${n(48 * s)} ${n(36 * s)}" stroke-opacity="0.8"`),
  ].join("\n");
}

function tree(x, gy, s, r) {
  const trunkH = between(r, 70, 110) * s;
  const cr = between(r, 46, 64) * s;
  const cy = gy - trunkH - cr * 0.6;
  return [
    rect(x - 5 * s, gy - trunkH, 10 * s, trunkH, C.trunk),
    circle(x, cy, cr, C.leaf),
    circle(x - cr * 0.55, cy + cr * 0.35, cr * 0.62, C.leafDark),
    circle(x + cr * 0.5, cy + cr * 0.25, cr * 0.7, C.leaf),
    `<path d="M${n(x - cr * 0.7)} ${n(cy - cr * 0.1)} A${n(cr * 0.7)} ${n(cr * 0.7)} 0 0 1 ${n(x + cr * 0.2)} ${n(cy - cr * 0.78)}" stroke="${C.leafLight}" stroke-width="${n(6 * s)}" fill="none" stroke-linecap="round"/>`,
  ].join("\n");
}

function shrub(x, gy, s, r) {
  const count = 3 + Math.floor(r() * 2);
  const out = [];
  for (let i = 0; i < count; i++) {
    out.push(circle(x + (i - count / 2) * 16 * s, gy - between(r, 10, 20) * s, between(r, 14, 22) * s, i % 2 ? C.leafDark : C.leaf));
  }
  return out.join("\n");
}

// ---------- rumah kontemporer ----------
// Rumah digambar sebagai volume tinggi + sayap rendah, tanpa pembagian lantai
// yang jelas, karena jumlah lantai belum dikonfirmasi.
const HOUSE_W = 330;
function house(x, gy, s, r, mirror = false) {
  const mainW = 200 * s;
  const mainH = 236 * s;
  const wingW = 130 * s;
  const wingH = 142 * s;
  const mainX = mirror ? x + wingW : x;
  const wingX = mirror ? x : x + mainW;
  const out = [];

  // sayap rendah
  out.push(rect(wingX, gy - wingH, wingW, wingH, "url(#wall)"));
  const doorW = 50 * s;
  const doorX = wingX + (wingW - doorW) / 2;
  out.push(rect(doorX, gy - 104 * s, doorW, 104 * s, C.wood));
  for (let i = 1; i < 5; i++) out.push(line(doorX + (doorW * i) / 5, gy - 104 * s, doorX + (doorW * i) / 5, gy, C.woodDark, 1.4 * s));
  out.push(rect(wingX + 16 * s, gy - wingH + 20 * s, wingW - 32 * s, 16 * s, "url(#glass)", ` stroke="${C.ink}" stroke-width="${n(2.5 * s)}"`));
  const wingSlabX = mirror ? wingX - 16 * s : wingX;
  out.push(rect(wingSlabX, gy - wingH - 11 * s, wingW + 16 * s, 11 * s, C.ink));
  out.push(rect(wingX, gy - wingH, wingW, 18 * s, "url(#eave)"));

  // volume utama
  out.push(rect(mainX, gy - mainH, mainW, mainH, C.facade));
  const panelW = mainW * between(r, 0.36, 0.42);
  const panelX = mirror ? mainX + mainW - panelW : mainX;
  out.push(rect(panelX, gy - mainH + 24 * s, panelW, mainH - 24 * s, C.wood));
  const slat = between(r, 7, 9) * s;
  for (let px = panelX + slat; px < panelX + panelW - 2; px += slat) {
    out.push(line(px, gy - mainH + 24 * s, px, gy, C.woodDark, 1.6 * s, ' stroke-opacity="0.7"'));
  }
  out.push(line(panelX, gy - mainH + 24 * s, panelX + panelW, gy - mainH + 24 * s, C.woodLight, 3 * s));

  const winW = mainW * 0.34;
  const winH = mainH * 0.6;
  const winX = mirror ? panelX - winW - 22 * s : panelX + panelW + 22 * s;
  const winY = gy - mainH + 44 * s;
  out.push(rect(winX, winY, winW, winH, "url(#glass)", ` stroke="${C.ink}" stroke-width="${n(3 * s)}"`));
  out.push(line(winX + winW / 2, winY, winX + winW / 2, winY + winH, C.ink, 2 * s));
  out.push(line(winX + winW * 0.15, winY + winH * 0.2, winX + winW * 0.42, winY + winH * 0.05, "#ffffff", 3 * s, ' stroke-opacity="0.8"'));

  // atap datar tegas dengan overhang
  out.push(rect(mainX - 14 * s, gy - mainH - 14 * s, mainW + 28 * s, 14 * s, C.ink));
  out.push(rect(mainX, gy - mainH, mainW, 22 * s, "url(#eave)"));
  out.push(rect(mirror ? mainX : mainX + mainW - 10 * s, gy - mainH, 10 * s, mainH, C.facadeShade));

  // planter
  out.push(rect(winX - 8 * s, gy - 24 * s, winW + 16 * s, 24 * s, C.facadeDeep));
  out.push(shrub(winX + winW / 2 + 8 * s, gy - 22 * s, s * 0.8, r));
  return out.join("\n");
}

// ---------- kavling: halaman, pagar besi, garis ukur ----------
function lot(lx, lw, gy, s, r, { mirror = false, dimension = true } = {}) {
  const houseW = HOUSE_W * s;
  const setback = 14 * s;
  const hx = mirror ? lx + setback : lx + lw - houseW - setback;
  const yardX = mirror ? hx + houseW : lx;
  const yardW = lw - houseW - setback;
  const out = [];

  out.push(rect(lx, gy - 6 * s, lw, 6 * s, C.paver));
  out.push(rect(yardX, gy - 12 * s, yardW, 12 * s, C.lawn));
  out.push(line(yardX, gy - 12 * s, yardX + yardW, gy - 12 * s, C.lawnEdge, 2 * s));

  const trees = Math.max(0, Math.floor((yardW - 40 * s) / (150 * s)));
  for (let i = 0; i < trees; i++) {
    out.push(tree(yardX + (yardW * (i + 0.5)) / trees + between(r, -12, 12) * s, gy - 10 * s, s, r));
  }
  if (yardW > 90 * s) out.push(shrub(yardX + (mirror ? yardW - 34 * s : 34 * s), gy - 8 * s, s, r));

  out.push(house(hx, gy, s, r, mirror));

  // pagar besi di depan
  const fenceH = 66 * s;
  const gateW = 76 * s;
  const gateX = mirror ? hx + 130 * s * 0.5 - gateW / 2 + 0 : hx + 200 * s + (130 * s - gateW) / 2;
  out.push(line(lx, gy - fenceH, lx + lw, gy - fenceH, C.iron, 4 * s));
  out.push(line(lx, gy - 8 * s, lx + lw, gy - 8 * s, C.iron, 3 * s));
  for (let bx = lx + 12 * s; bx < lx + lw - 6 * s; bx += 12 * s) {
    if (bx > gateX - 4 * s && bx < gateX + gateW + 4 * s) continue;
    out.push(line(bx, gy - fenceH, bx, gy - 8 * s, C.iron, 2.4 * s));
  }
  out.push(rect(gateX, gy - fenceH + 4 * s, gateW, fenceH - 10 * s, C.woodLight));
  for (let i = 1; i < 6; i++) out.push(line(gateX, gy - fenceH + 4 * s + ((fenceH - 10 * s) * i) / 6, gateX + gateW, gy - fenceH + 4 * s + ((fenceH - 10 * s) * i) / 6, C.woodDark, 1.5 * s));
  out.push(rect(lx - 9 * s, gy - fenceH - 16 * s, 18 * s, fenceH + 16 * s, C.facade, ` stroke="${C.facadeDeep}" stroke-width="${n(1.5 * s)}"`));
  out.push(rect(lx + lw - 9 * s, gy - fenceH - 16 * s, 18 * s, fenceH + 16 * s, C.facade, ` stroke="${C.facadeDeep}" stroke-width="${n(1.5 * s)}"`));

  // garis ukur lebar kavling (aksen)
  if (dimension) {
    const dy = gy + 14 * s;
    out.push(line(lx, dy, lx + lw, dy, C.accent, 2.5 * s));
    out.push(line(lx, dy - 9 * s, lx, dy + 9 * s, C.accent, 2.5 * s));
    out.push(line(lx + lw, dy - 9 * s, lx + lw, dy + 9 * s, C.accent, 2.5 * s));
  }
  return out.join("\n");
}

// Lebar kavling sebanding luas tanah: 60 m² -> 525, 80 m² -> 700 (skala 1).
const LOT = { "60": 525, "80": 700 };

function sceneTwoTypes(size, name, scale, groundRatio) {
  const r = seeded(name);
  const s = scale;
  const gy = size.h * groundRatio;
  const gap = 36 * s;
  const total = (LOT["60"] + LOT["80"]) * s + gap;
  const x0 = (size.w - total) / 2;
  return svg(size, "Ilustrasi dua tipe rumah inden Sesetan",
    [backdrop(size, gy, r), street(size, gy, s), lot(x0, LOT["60"] * s, gy, s, r), lot(x0 + LOT["60"] * s + gap, LOT["80"] * s, gy, s, r)].join("\n"));
}

function sceneType(size, name, landKey, scale, title, groundRatio) {
  const r = seeded(name);
  const s = scale;
  const gy = size.h * groundRatio;
  const lw = LOT[landKey] * s;
  const x0 = (size.w - lw) / 2;
  return svg(size, title, [backdrop(size, gy, r), street(size, gy, s), lot(x0, lw, gy, s, r)].join("\n"));
}

// ---------- detail ----------
function detailFacade() {
  const size = SQUARE;
  const r = seeded("detail-facade");
  const out = [rect(0, 0, size.w, size.h, "url(#sky)")];
  out.push(rect(120, 150, 960, 1050, C.facade));
  out.push(rect(120, 110, 1010, 40, C.ink));
  out.push(rect(120, 150, 960, 60, "url(#eave)"));
  const panelX = 120;
  const panelW = 420;
  out.push(rect(panelX, 210, panelW, 990, C.wood));
  for (let x = panelX + 22; x < panelX + panelW; x += between(r, 20, 24)) out.push(line(x, 210, x, 1200, C.woodDark, 4, ' stroke-opacity="0.65"'));
  out.push(line(panelX, 210, panelX + panelW, 210, C.woodLight, 8));
  out.push(rect(620, 290, 360, 700, "url(#glass)", ` stroke="${C.ink}" stroke-width="10"`));
  out.push(line(800, 290, 800, 990, C.ink, 6));
  out.push(line(660, 420, 760, 330, "#ffffff", 10, ' stroke-opacity="0.8"'));
  out.push(rect(590, 1040, 420, 90, C.facadeDeep));
  out.push(shrub(800, 1050, 2.4, r));
  out.push(rect(1080, 150, 30, 1050, C.facadeShade));
  return svg(size, "Ilustrasi detail fasad putih dengan bidang kayu", out.join("\n"));
}

function detailFence() {
  const size = WIDE;
  const r = seeded("detail-fence");
  const gy = 740;
  const out = [rect(0, 0, size.w, size.h, "url(#sky)")];
  out.push(rect(0, 180, size.w, gy - 180, C.facade));
  out.push(rect(0, 150, size.w, 30, C.ink));
  out.push(rect(0, 180, size.w, 50, "url(#eave)"));
  out.push(rect(980, 300, 420, gy - 300, C.wood));
  for (let x = 1000; x < 1400; x += between(r, 18, 22)) out.push(line(x, 300, x, gy, C.woodDark, 3, ' stroke-opacity="0.6"'));
  out.push(rect(200, 290, 520, 300, "url(#glass)", ` stroke="${C.ink}" stroke-width="8"`));
  out.push(line(460, 290, 460, 590, C.ink, 5));
  out.push(rect(0, gy, size.w, size.h - gy, C.paver));
  for (let x = 0; x < size.w; x += 120) out.push(line(x, gy, x - 60, size.h, C.sidewalk, 3));
  const fenceTop = 470;
  out.push(line(0, fenceTop, size.w, fenceTop, C.iron, 10));
  out.push(line(0, gy - 20, size.w, gy - 20, C.iron, 8));
  for (let x = 20; x < size.w; x += 34) {
    if (x > 880 && x < 1140) continue;
    out.push(line(x, fenceTop, x, gy - 20, C.iron, 6));
  }
  out.push(rect(880, fenceTop + 10, 260, gy - fenceTop - 40, C.woodLight));
  for (let i = 1; i < 8; i++) out.push(line(880, fenceTop + 10 + ((gy - fenceTop - 40) * i) / 8, 1140, fenceTop + 10 + ((gy - fenceTop - 40) * i) / 8, C.woodDark, 3));
  out.push(rect(840, fenceTop - 50, 40, gy - fenceTop + 50, C.facade, ` stroke="${C.facadeDeep}" stroke-width="4"`));
  out.push(rect(1140, fenceTop - 50, 40, gy - fenceTop + 50, C.facade, ` stroke="${C.facadeDeep}" stroke-width="4"`));
  out.push(tree(1500, gy, 2.2, r));
  return svg(size, "Ilustrasi pagar besi dan pintu masuk", out.join("\n"));
}

function detailRoof() {
  const size = SQUARE;
  const r = seeded("detail-roof");
  const out = [rect(0, 0, size.w, size.h, "url(#sky)")];
  out.push(circle(880, 260, 150, C.sun));
  out.push(`<path d="M0 520 L1200 380 V1200 H0 Z" fill="${C.facade}"/>`);
  out.push(`<path d="M-20 500 L1220 356 L1220 392 L-20 536 Z" fill="${C.ink}"/>`);
  out.push(`<path d="M0 536 L1200 392 L1200 450 L0 594 Z" fill="url(#eave)"/>`);
  out.push(rect(160, 640, 880, 110, "url(#glass)", ` stroke="${C.ink}" stroke-width="8"`));
  for (let i = 1; i < 4; i++) out.push(line(160 + 220 * i, 640, 160 + 220 * i, 750, C.ink, 5));
  out.push(rect(0, 820, 1200, 380, C.facadeShade));
  out.push(rect(700, 820, 500, 380, C.wood));
  for (let x = 720; x < 1200; x += between(r, 22, 26)) out.push(line(x, 820, x, 1200, C.woodDark, 4, ' stroke-opacity="0.6"'));
  return svg(size, "Ilustrasi garis atap dan jendela", out.join("\n"));
}

// Peta area: abstrak, hanya menandai zona, tanpa titik rumah.
function areaMap() {
  const size = WIDE;
  const r = seeded("area-map-sesetan");
  const out = [rect(0, 0, size.w, size.h, "#e9efe9")];
  const cols = 14;
  const rows = 8;
  const cw = size.w / cols;
  const rh = size.h / rows;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const pad = between(r, 8, 16);
      out.push(rect(i * cw + pad, j * rh + pad, cw - pad * 2, rh - pad * 2, r() > 0.82 ? "#d6e4d9" : "#f4f7f3", ' rx="6"'));
    }
  }
  for (let i = 1; i < cols; i += 3) out.push(line(i * cw, 0, i * cw + between(r, -40, 40), size.h, C.facade, 14));
  for (let j = 2; j < rows; j += 3) out.push(line(0, j * rh, size.w, j * rh + between(r, -30, 30), C.facade, 14));
  out.push(`<path d="M-20 ${n(size.h * 0.2)} C ${n(size.w * 0.3)} ${n(size.h * 0.35)}, ${n(size.w * 0.45)} ${n(size.h * 0.1)}, ${n(size.w * 0.7)} ${n(size.h * 0.5)} S ${n(size.w * 0.9)} ${n(size.h * 0.95)}, ${size.w + 20} ${n(size.h * 0.85)}" stroke="#c3d8cc" stroke-width="26" fill="none"/>`);
  out.push(`<ellipse cx="${n(size.w * 0.5)}" cy="${n(size.h * 0.52)}" rx="${n(size.w * 0.2)}" ry="${n(size.h * 0.26)}" fill="${C.accent}" fill-opacity="0.12" stroke="${C.accent}" stroke-width="5" stroke-dasharray="18 12"/>`);
  out.push(`<path d="M${size.w - 90} 70 L${size.w - 70} 125 L${size.w - 90} 112 L${size.w - 110} 125 Z" fill="${C.ink}"/>`);
  return svg(size, "Peta ilustratif area Sesetan, Denpasar Selatan", out.join("\n"));
}

// ---------- logo mark (digambar ulang dari logo klien) ----------
function mark() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
<title>Rumah Bali Estate</title>
<defs><linearGradient id="m" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2aa64f"/><stop offset="1" stop-color="#17753a"/></linearGradient></defs>
<path d="M6.5 43.5V20.5L24 6.5l17.5 14v23" fill="none" stroke="url(#m)" stroke-width="5" stroke-linejoin="miter" stroke-miterlimit="10"/>
<path d="M16.5 43.5v-12L24 25.5l7.5 6v12" fill="none" stroke="url(#m)" stroke-width="4" stroke-linejoin="miter" stroke-miterlimit="10"/>
<path d="M4 43.5h40" stroke="url(#m)" stroke-width="5"/>
</svg>
`;
}

const files = {
  "sesetan-hero.svg": sceneTwoTypes(WIDE, "sesetan-hero", 1.22, 0.8),
  "sesetan-square.svg": sceneTwoTypes(SQUARE, "sesetan-square", 0.9, 0.7),
  "type-60-60.svg": sceneType(WIDE, "type-60-60", "60", 2, "Ilustrasi Tipe 60/60 dengan halaman depan lebih sempit", 0.84),
  "type-60-80.svg": sceneType(WIDE, "type-60-80", "80", 2, "Ilustrasi Tipe 60/80 dengan halaman depan lebih lebar", 0.84),
  "type-60-60-square.svg": sceneType(SQUARE, "type-60-60-square", "60", 1.55, "Ilustrasi Tipe 60/60 dengan halaman depan lebih sempit", 0.78),
  "type-60-80-square.svg": sceneType(SQUARE, "type-60-80-square", "80", 1.55, "Ilustrasi Tipe 60/80 dengan halaman depan lebih lebar", 0.78),
  "detail-facade.svg": detailFacade(),
  "detail-fence.svg": detailFence(),
  "detail-roof.svg": detailRoof(),
  "area-map.svg": areaMap(),
};

for (const [file, content] of Object.entries(files)) {
  writeFileSync(new URL(file, OUT), content);
}
writeFileSync(new URL("mark.svg", BRAND), mark());
writeFileSync(new URL("../src/app/icon.svg", import.meta.url), mark());
console.log(`Menulis ${Object.keys(files).length} ilustrasi ke public/art, mark ke public/brand dan src/app/icon.svg`);
