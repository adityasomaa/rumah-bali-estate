import { site } from "./site";

// Karakter kontrol (kecuali baris baru), zero-width, dan pemisah baris Unicode.
const UNSAFE_CHARS = new RegExp("[\\u0000-\\u0009\\u000B-\\u001F\\u007F\\u200B-\\u200F\\u2028\\u2029\\uFEFF]", "g");

/** Bersihkan teks bebas dari pengunjung sebelum masuk ke pesan WhatsApp. */
export function cleanText(value: string, maxLength = 300) {
  return value
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .replace(UNSAFE_CHARS, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, maxLength);
}

/**
 * Link wa.me dengan pesan ter-encode penuh. encodeURIComponent mengubah
 * baris baru (%0A), & (%26), # (%23), dan emoji (UTF-8) sehingga pesan utuh.
 */
export function waLink(message?: string) {
  const base = `https://wa.me/${site.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(cleanText(message, 2000))}` : base;
}

export function buildMessage(intro: string, fields: [label: string, value: string | null | undefined][]) {
  const lines = fields
    .filter(([, value]) => value != null && value !== "")
    .map(([label, value]) => `${label}: ${value}`);
  return [intro, "", ...lines, "", "Dikirim dari situs Rumah Bali Estate."].join("\n");
}
