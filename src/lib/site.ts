// Satu sumber untuk identitas situs dan kontak. Semua angka/teks di sini
// berasal dari halaman Facebook, Instagram, dan TikTok Rumah Bali Estate.

export const SITE_URL = "https://rumah-bali-estate.vercel.app";

export const site = {
  name: "Rumah Bali Estate",
  tagline: "Solusi Rumah Idaman Anda",
  city: "Denpasar",
  phoneDisplay: "0838-0899-9944",
  phoneE164: "+6283808999944",
  whatsappNumber: "6283808999944",
  social: {
    facebook: "https://www.facebook.com/Rumahbaliestate",
    instagram: "https://www.instagram.com/rumahbali.estate/",
    tiktok: "https://www.tiktok.com/@rumahbaliestate",
  },
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/listing", label: "Listing" },
  { href: "/simulasi-kpr", label: "Simulasi KPR" },
  { href: "/kontak", label: "Kontak" },
] as const;

export const legalNav = [
  { href: "/kebijakan-privasi", label: "Kebijakan Privasi" },
  { href: "/syarat-ketentuan", label: "Syarat dan Ketentuan" },
] as const;
