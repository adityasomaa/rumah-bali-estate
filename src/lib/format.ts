const thousands = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 3 });
const oneDecimal = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 });

export const BALI_TZ = "Asia/Makassar";

/** 1299000000 -> "1.299.000.000" */
export function formatThousands(value: number) {
  return thousands.format(Math.round(value));
}

/** 1299000000 -> "Rp 1.299.000.000" */
export function formatRupiah(value: number) {
  return `Rp ${formatThousands(value)}`;
}

/** 1299000000 -> "Rp 1,299 miliar", 180000000 -> "Rp 180 juta" */
export function formatRupiahShort(value: number) {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `Rp ${decimal.format(abs / 1_000_000_000)} miliar`;
  if (abs >= 1_000_000) return `Rp ${oneDecimal.format(abs / 1_000_000)} juta`;
  return `Rp ${formatThousands(abs)}`;
}

export function formatArea(m2: number) {
  return `${formatThousands(m2)} m²`;
}

/** "2026-09-08" -> "8 September 2026" */
export function formatDate(iso: string, withWeekday = false) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: withWeekday ? "long" : undefined,
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

/** Tanggal hari ini di Bali (WITA) dalam format YYYY-MM-DD. */
export function todayInBali(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: BALI_TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

export function addDays(iso: string, days: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return date.toISOString().slice(0, 10);
}

export function isValidIsoDate(iso: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}
