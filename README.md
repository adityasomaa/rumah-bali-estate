# Rumah Bali Estate

Situs untuk Rumah Bali Estate, Denpasar. Listing aktif: rumah inden di Sesetan, Denpasar Selatan, Tipe 60/60 dan Tipe 60/80.

- Production: https://rumah-bali-estate.vercel.app
- Subdomain: https://rumah-bali-estate.onyxcreative.asia

Dibangun dari nol untuk klien ini. Tidak ada kode yang disalin dari proyek klien lain.

---

## 1. Fakta klien dan batasannya

Sumber: halaman Facebook [Rumah Bali Estate](https://www.facebook.com/Rumahbaliestate) (kategori Developer Real Estate, tagline "Solusi Rumah Idaman Anda"), Instagram @rumahbali.estate, TikTok @rumahbaliestate, WhatsApp dan telepon 0838-0899-9944.

Listing dari postingan Facebook mereka, diunggah 8 September 2026 (tampil "6 hari" saat dicek 14 September 2026). Teks aslinya:

> Di Jual Rumah Indent di Sesetan, Denpasar Selatan. type 60/60 m2 Harga 1,299 Milyar. Type 60/80 m2 Harga 1,479 Milyar. info detail dan Kpr Wa 083808 999944

| Data | Status di situs |
| --- | --- |
| Tipe 60/60, Rp 1.299.000.000 | Tampil, dengan tanggal sumber |
| Tipe 60/80, Rp 1.479.000.000 | Tampil, dengan tanggal sumber |
| Lantai, kamar tidur, kamar mandi, daya listrik, sertifikat, perkiraan selesai | `null`, tampil "Tanyakan via WhatsApp" |
| Nama perumahan, alamat persis, jumlah unit | `null`, tampil "Tanyakan via WhatsApp" |
| Bank rekanan, suku bunga | Tidak ada. Simulasi KPR diisi pengunjung sendiri |
| Nama pemilik | Tidak tercantum, tidak ditulis |

**Asumsi yang perlu dikonfirmasi:** "60/60" dan "60/80" dibaca sesuai konvensi pasar Indonesia, yaitu luas bangunan / luas tanah. Jadi kedua tipe punya luas bangunan 60 m², dan luas tanahnya 60 m² vs 80 m².

### Pengembang atau pemasar?

Kategori halaman Facebook mereka "Developer Real Estate", tapi kontennya juga memuat rumah kontrakan, kavling, dan satu postingan tentang "pembangunan hunian klien". Jadi belum jelas apakah Rumah Bali Estate pengembang, pemasar, kontraktor, atau gabungan. **Situs sengaja tidak menyebut salah satunya.** Deskripsi yang dipakai netral: "Informasi rumah dijual di Denpasar". Setelah dikonfirmasi, ubah di `src/components/layout/site-footer.tsx` dan metadata di `src/app/layout.tsx`.

### Verifikasi website (14 September 2026)

Sebelum membangun, dicek ulang:

- Google "Rumah Bali Estate" Denpasar: hanya Instagram, Threads, Lamudi, TikTok, Facebook. Tidak ada domain sendiri.
- Google Maps: tidak ada listing bisnis "Rumah Bali Estate", jadi tidak ada tombol Website.
- Facebook: blok Info kontak hanya berisi Instagram, TikTok, telepon, WhatsApp, Messenger. Tidak ada tautan website.
- Bio Instagram (dari hasil Google/Threads): "Solusi Rumah Impian Anda", nomor WA, dan link bit.ly ke WhatsApp.
- DNS `rumahbaliestate.com`, `.id`, `.co.id`, `.net`, `.my.id`, `.web.id`, `rumahbali.estate`: semuanya tidak resolve.

Kesimpulan: belum ada website yang hidup. Situs ini tidak memuat kalimat apa pun tentang hal itu.

Catatan: TikTok/Instagram mereka juga menampilkan listing lain (Jl. Buluh Indah, Gunung Andakasa, tipe 40/66, dan lain-lain). **Sengaja tidak dimasukkan** sampai dikonfirmasi.

---

## 2. Stack

| | |
| --- | --- |
| Framework | Next.js 16.3 (App Router, Turbopack), React 19.3, semua route prerender statis |
| Bahasa | TypeScript 6.0 (TS 7 native belum menyediakan JS API yang dipakai type-check Next) |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`), token di `@theme`, CSS kustom di `@layer` |
| Animasi | Motion 13 (`motion/react`), CSS transitions |
| Smooth scroll | Lenis 1.3 (desktop saja) |
| Ikon | Phosphor Icons (`@phosphor-icons/react/ssr`) |
| Font | Plus Jakarta Sans variable, WOFF2 self-host lewat `next/font/local` |
| Gambar | SVG generatif dari script sendiri, `images.unoptimized = true` |
| Hosting | Vercel (team Onyx Creative Asia) |

`next.config.ts` menyetel `images.unoptimized = true` sejak awal karena kuota Vercel Image Optimization akun ini habis.

---

## 3. Referensi yang dipelajari

Sebelum mendesain, delapan situs nyata dibuka dan dicatat polanya (empat lokal, empat luar negeri).

| Situs | Yang diambil |
| --- | --- |
| [Summarecon Serpong, Cluster Leonora](https://www.summareconserpong.com/projects/rumah/leonora) | Harga "mulai dari" dan nama cluster muncul di layar pertama, tipe disajikan sebagai kartu dengan LT/LB di urutan teratas. |
| [Devata Property, Bali Dewata Residence](https://devataproperty.com/properties/bali-dewata-residence/) | Developer kecil di Bali menaruh CTA WhatsApp tepat setelah spesifikasi ringkas, bukan hanya di bawah halaman. |
| [Kizuna Jepang, rumah indent Denpasar Selatan](https://kizunajepang.com/rumah-indent-elegan-di-denpasar-selatan/) | Situs rumah inden lokal yang mengakhiri halaman dengan CTA "Survey" ke WhatsApp, menegaskan survei lokasi sebagai aksi utama. |
| [rumah123, Ciputra Beach Resort (new launch)](https://www.rumah123.com/en/new-launch/property/tabanan/ciputra-beach-resort/nps1834/) | Tanggal pembaruan di hero, tabel perbandingan tipe, dan widget simulasi KPR dengan harga terisi dari listing plus disclaimer. |
| [Barratt Homes, Somer Meadows](https://www.barratthomes.co.uk/new-homes/dev002665-somer-meadows/) | Panel "Get in touch" dengan booking appointment di samping hero, dan disclaimer lengkap bahwa gambar adalah ilustrasi. |
| [Mirvac Olivine](https://olivine.mirvac.com/) | Form register interest diletakkan setelah informasi kunjungan, jadi CTA penutup langsung berujung pada janji temu. |
| [Persimmon Homes, house types](https://www.persimmonhomes.com/our-house-types) | Nav sederhana satu baris dan pita judul yang jelas sebelum daftar tipe rumah. |
| [Lennar, New homes in Florida](https://www.lennar.com/new-homes/florida) | Kartu listing berurutan status, harga, lalu kamar/luas/alamat, dan cookie banner dengan pilihan eksplisit. |

### Pola berulang yang diikuti

1. **Informasi pertama:** nama/lokasi listing dan harga. Di sini: hero berisi H1 lokasi, dua tipe dengan harga, dan tanggal sumber.
2. **Aksi utama lokal selalu WhatsApp**, sering berbentuk "Survey". Di sini: "Jadwalkan survei via WhatsApp" di hero, dan CTA diulang di setiap section dan footer.
3. **Tipe sebagai kartu atau tabel perbandingan**, dengan urutan LT/LB lalu harga. Di sini: tabel di tablet/desktop, kartu bertumpuk di mobile, ditambah kolom selisih otomatis.
4. **Simulasi KPR dekat listing**, dengan harga terisi. Di sini: harga dari tipe, sisanya diisi pengunjung.
5. **Disclaimer ilustrasi dan perubahan harga**, yang di situs lokal kecil hampir tidak ada. Di sini ditulis jelas di caption, simulasi, dan Syarat.
6. **Urutan section**: hero, perbandingan tipe, proses/detail, lokasi, CTA/form penutup.

Pembedanya ada di eksekusi: ketelitian data (tidak ada angka karangan), aksesibilitas, performa statis, dan detail interaksi.

---

## 4. Keputusan desain

**Design read:** situs listing untuk keluarga dan pekerja Denpasar yang membeli rumah inden, dengan bahasa visual arsitektur kontemporer yang tenang dan fokus pada kejelasan angka.

**Knob:** DESIGN_VARIANCE 2/5 (struktur mengikuti pola terbukti), MOTION_INTENSITY 3/5 (loader, kurtain, satu reveal heading, reveal ringan), VISUAL_DENSITY 3/5.

### Warna aksen: hijau `#17753a`

Diturunkan dari ikon rumah hijau di logo Rumah Bali Estate, jadi situs terasa satu keluarga dengan profil Facebook/Instagram yang sudah dikenal pengunjung. Hijau juga membaca taman dan halaman, dan itulah pembeda kedua tipe (luas tanah). Nilainya digelapkan dari hijau logo supaya lolos WCAG AA sebagai teks dan tombol. Netralnya abu kehijauan dingin (bukan krem/beige) agar fasad putih dan bidang kayu di ilustrasi tetap menonjol.

Semua pasangan dicek otomatis oleh `npm run contrast`, yang membaca token langsung dari `globals.css`:

| Pasangan | Rasio |
| --- | --- |
| ink `#121a15` di paper `#f2f5f1` | 16,13:1 |
| ink-soft `#435048` di paper | 7,71:1 |
| ink-soft di accent-tint `#e2efe5` | 7,14:1 |
| accent `#17753a` di paper | 5,25:1 |
| on-accent `#fbfcfa` di accent | 5,60:1 |
| on-accent di accent-strong `#0f5b2c` | 7,99:1 |
| accent-strong di accent-tint | 6,94:1 |
| danger `#b3261e` di surface | 6,35:1 |
| line-strong (border input) di surface | 3,89:1 (non-teks, min 3:1) |

Kalau aksen diubah, jalankan ulang `npm run contrast`. Script keluar dengan kode 1 bila ada pasangan yang gagal.

### Font: Plus Jakarta Sans

- Dirancang Tokotype, foundry Indonesia, untuk identitas kota Jakarta. Karakternya geometris, bersih, dan lokal.
- Bentuk hurufnya dekat dengan wordmark tebal pada logo klien, jadi header dan OG image tetap senada.
- Angka tabular yang rapi (`font-variant-numeric: tabular-nums`) untuk harga dan simulasi KPR.
- Variable 200 sampai 800 dalam satu file WOFF2 (subset latin, sudah memuat "²").
- **Lisensi SIL Open Font License 1.1**, boleh untuk web komersial. File lisensi ada di `src/fonts/OFL-LICENSE.txt`.

Neue Montreal tidak dipakai. Lisensi file lokal di folder Downloads tidak bisa diverifikasi (versi gratis Pangram Pangram hanya untuk penggunaan pribadi), dan karakter grotesk Eropanya kurang dekat dengan logo klien.

### Bentuk dan layer

- Radius: kontrol 6px (`rounded-control`), panel/gambar 10px (`rounded-panel`). Pengecualian terdokumentasi: tombol WhatsApp melayang, penanda langkah, dan switch berbentuk bulat.
- Skala z-index hanya di `src/app/globals.css`, dipakai lewat `z-(--z-*)`. Tidak ada angka z-index mentah di komponen.

| Token | Nilai | Lapisan |
| --- | --- | --- |
| `--z-content` | 1 | konten |
| `--z-dropdown` | 10 | dropdown form (masih lapisan konten) |
| `--z-header` | 100 | sticky header |
| `--z-fab` | 200 | tombol WhatsApp melayang |
| `--z-menu` | 300 | menu mobile |
| `--z-modal` | 400 | lightbox galeri dan modal |
| `--z-cookie` | 500 | cookie banner |
| `--z-curtain` | 600 | loader dan kurtain transisi |
| `--z-skip` | 700 | skip link |

Cookie banner disembunyikan saat menu mobile atau loader aktif, jadi tidak pernah muncul di atas menu. Di layar kecil, tinggi banner disimpan ke `--cookie-h` dan tombol WhatsApp naik setinggi itu.

### Ilustrasi

`scripts/generate-art.mjs` menulis SVG deterministik (PRNG dengan seed per gambar): fasad putih, bidang kayu, pagar besi, dan atap datar yang tegas, dengan satu aksen hijau. Tanpa grain atau noise. Hanya dua rasio: 16:9 (1600x900) dan 1:1 (1200x1200). Rasio dikunci di komponen `Media` lewat `aspect-ratio`, jadi ruang tertahan sebelum gambar dimuat. Kalau gambar gagal dimuat, tampil fallback berupa ikon dan teks, bukan ikon rusak.

Kedua tipe digambar dengan skala sama. Lebar kavling sebanding luas tanah (60 m² menjadi 525 unit, 80 m² menjadi 700 unit), jadi Tipe 60/80 punya halaman depan jauh lebih lebar dan muat lebih banyak pohon. Garis ukur hijau di bawah kavling menandai lebarnya. Jumlah lantai sengaja dibuat ambigu (volume tinggi tanpa pembagian lantai) karena belum dikonfirmasi.

Logo: ikon rumah digambar ulang sebagai vektor dari foto profil Facebook/Instagram (`public/brand/mark.svg`, `src/app/icon.svg`, transparan). **Ganti dengan file vektor asli dari klien bila tersedia.**

---

## 5. Komponen Componentry

Diperiksa di [componentry.dev/docs](https://componentry.dev/docs). Kode diambil dari registry resmi (`componentry.dev/r/<nama>.json`).

| Komponen | Keputusan | Alasan |
| --- | --- | --- |
| Kinetic Text Reveal | **Dipakai** untuk H1 hero | Satu momen gerak yang disengaja setelah loader. Disesuaikan: import dari `motion/react`, prop `as` untuk heading, `aria-label` hanya sekali di induk (sumber asli juga menambah `sr-only` sehingga terbaca dua kali), segmen `aria-hidden`, fallback `<noscript>`. |
| Sticky Scroll Cards | Dibuang | Memakai `h-screen`, membuat root Lenis sendiri (bentrok aturan Lenis mati di tab/mobile), rotasi miring, dan hint "scroll to explore". |
| Hover Transition | Dibuang | Informasi yang hanya muncul saat hover tidak cocok untuk pembeli yang kebanyakan memakai HP. |
| Text Morph | Dibuang | Loop berulang pada angka membingungkan untuk harga dan akan mengganggu `aria-live`. |
| Hero Geometric, WebGL Liquid, Aurora, Dither, Matrix Rain, ASCII, dll. | Dibuang | Latar dekoratif/tekstur bentrok dengan arahan tanpa grain dan dengan fokus kejelasan. Dither sama dengan noise. |

---

## 6. Struktur

```
src/
  app/                    route: /, /listing, /listing/[slug], /simulasi-kpr, /kontak,
                          /kebijakan-privasi, /syarat-ketentuan, sitemap.ts, robots.ts
  data/listings.ts        SATU-SATUNYA file data listing
  data/options.ts         opsi dropdown + copy perbandingan dari data
  components/section.tsx  Container, Section, SectionHeader (judul, headline, deskripsi, CTA)
  components/providers/   UI, cookie consent, transisi halaman
  components/listing/     hero, perbandingan, galeri, linimasa, peta
  components/forms/       form survei dan tanya KPR
  components/kpr/         simulator KPR
  lib/                    format, kpr, compare, whatsapp, scroll, structured-data
scripts/                  generate-art, generate-brand, check-contrast, audit-overflow, preview-art
```

Nav: Home, Listing, Simulasi KPR, Kontak. Setiap section memakai `SectionHeader` dengan urutan judul section, headline, deskripsi singkat, CTA. Footer selalu berakhir dengan CTA "Jadwalkan survei lokasi". Di `/kontak` (halaman tujuannya), CTA itu otomatis berganti menjadi "Lihat listing Sesetan".

---

## 7. Menambah listing baru

Semua dari `src/data/listings.ts`:

1. Salin satu objek di array `listings` dan beri `slug` unik, misalnya `"buluh-indah"`. Slug menjadi URL `/listing/buluh-indah`.
2. Isi `title`, `shortTitle`, `summary`, `area`, `mapQuery` (nama kelurahan/kecamatan saja, bukan alamat rumah).
3. Isi `source` dengan label, URL, dan `datePosted` (`YYYY-MM-DD`) postingan asal harga.
4. Isi `types`: `id`, `name`, `buildingArea`, `landArea`, `price` (angka penuh rupiah). Spesifikasi yang belum pasti biarkan `null`.
5. Opsional: tambah ilustrasi di `scripts/generate-art.mjs`, jalankan `npm run art`, lalu isi nama file di `art`.
6. `npm run build`. Halaman detail, sitemap, dropdown form, simulasi KPR, dan structured data otomatis ikut.

Listing pertama di array tampil di hero Home (`featuredListing`).

**Mengisi progres pembangunan:** tambahkan entri ke `progress` pada listing:

```ts
progress: [
  { date: "2026-10-01", title: "Pekerjaan pondasi", note: "Catatan singkat opsional." },
],
```

Linimasa otomatis berganti dari tampilan kosong menjadi daftar bertanggal, terbaru di atas.

**Mengisi spesifikasi:** ganti `null` dengan teks, misalnya `bedrooms: "3"`, `electricity: "2.200 VA"`. Tampilan "Tanyakan via WhatsApp" untuk field itu hilang dengan sendirinya.

---

## 8. Simulasi KPR

Rumus anuitas dengan bunga tetap (`src/lib/kpr.ts`):

```
Angsuran = P × r ÷ (1 − (1 + r)^−n)
P = harga − DP
r = bunga per tahun ÷ 12 ÷ 100
n = tenor tahun × 12
Jika r = 0: Angsuran = P ÷ n
```

Harga terisi dari tipe yang dipilih. DP (persen atau rupiah), tenor, dan bunga dibiarkan kosong tanpa angka default. Kalau salah satu kosong (termasuk bunga), tidak ada angka hasil yang keluar. Persen dibatasi 0 sampai 100, tenor 1 sampai 30 tahun, dan input rupiah diformat ribuan tapi mengirim angka mentah. Hasil diumumkan lewat `aria-live` (ditunda 700 ms).

### Contoh hitungan (diverifikasi di production)

Tipe 60/60, DP 20%, tenor 15 tahun, bunga 7,5% per tahun:

| Langkah | Nilai |
| --- | --- |
| Harga | Rp 1.299.000.000 |
| DP 20% | 1.299.000.000 × 0,20 = Rp 259.800.000 |
| P | 1.299.000.000 − 259.800.000 = Rp 1.039.200.000 |
| r | 7,5 ÷ 12 ÷ 100 = 0,00625 |
| n | 15 × 12 = 180 |
| (1 + r)^−n | 1,00625^−180 = 0,325791 |
| 1 − (1 + r)^−n | 0,674209 |
| P × r | 1.039.200.000 × 0,00625 = 6.495.000 |
| **Angsuran** | 6.495.000 ÷ 0,674209 = **Rp 9.633.512** per bulan |
| Total pembayaran | 9.633.512,45 × 180 = Rp 1.734.032.240 |
| Total bunga | 1.734.032.240 − 1.039.200.000 = Rp 694.832.240 |

---

## 9. Selisih antar tipe

`src/lib/compare.ts` menghitung `price`, `landArea`, dan `buildingArea` sebagai `tipeB − tipeA` langsung dari data. Headline dan deskripsi perbandingan (`src/data/options.ts`) juga dibentuk dari data. Tidak ada selisih yang ditulis manual. Tombol "Tukar urutan perbandingan" membalik arah, dan kalimat ringkasnya diumumkan lewat `aria-live`. Label di bawah tabel: "Selisih dihitung otomatis dari harga dan luas yang tercantum di listing."

Saat ini: Tipe 60/80 lebih mahal Rp 180 juta, tanahnya 20 m² lebih luas, luas bangunan sama.

---

## 10. Cookie

Cookie first-party `rbe_consent` (180 hari). Kategori opsional benar-benar menggerakkan fitur:

- **Peta interaktif:** tanpa izin, halaman listing menampilkan peta ilustratif lokal. Dengan izin, iframe Google Maps dimuat.
- **Ingat isian simulasi KPR:** dengan izin, isian disimpan di `localStorage` (`rbe-kpr-v1`) dan dipulihkan. Mencabut izin menghapusnya.

Pengaturan bisa dibuka lagi dari footer atau halaman Kebijakan Privasi.

---

## 11. Loader, transisi, scroll

- **Loader situs** (`transition-provider.tsx`): saat pertama kali membuka situs dan setiap menuju Home. Garis ikon rumah tergambar, lalu layar naik. Ada failsafe CSS 4 detik bila JavaScript gagal.
- **Kurtain transisi** ke halaman lain. Urutannya: page closes (kurtain hijau naik dengan puncak atap), content change (`router.push` saat tertutup), scroll to top, lalu page opens. Setiap langkah menunggu `transitionend` yang di-race dengan `setTimeout`, dan `nextFrame()` me-race `requestAnimationFrame` dengan `setTimeout(80)`, jadi tidak nyangkut di tab background.
- **Lenis** hanya aktif di `min-width: 64rem` dengan `hover: hover` dan `pointer: fine`, mati untuk reduced motion, dan berhenti saat menu/modal terbuka (`scrollStore.lock()`).
- **Hero** setinggi `calc(100svh − header)`. Grafiknya statis, tidak zoom saat scroll.
- **Reveal** memakai IntersectionObserver, tidak pernah di dalam induk `overflow-hidden`, dan konten tetap terlihat tanpa JavaScript.

---

## 12. Script

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js |
| `npm run art` | Regenerasi semua SVG di `public/art`, `public/brand/mark.svg`, `src/app/icon.svg` |
| `node scripts/generate-brand.mjs` | OG image 1200x675 (16:9) dan `public/brand/logo-512.png` transparan |
| `npm run contrast` | Cek WCAG semua pasangan token |
| `npm run audit:overflow -- <url>` | Audit 375/768/1440: overflow, baris heading, gambar rusak, error konsol, request gagal, reveal, FAB, hamburger |
| `npm run fonts` | Salin WOFF2 dari paket Fontsource ke `src/fonts` |

---

## 13. Deploy

- GitHub: `adityasomaa/rumah-bali-estate`
- Vercel project `rumah-bali-estate` di team Onyx Creative Asia. Deployment Protection (Vercel Authentication) dimatikan.
- Alias production `rumah-bali-estate.vercel.app` terdaftar sebagai project domain, bukan hanya alias otomatis `-onyx-creative-asia`. Permintaan klaim eksplisit mengembalikan 409 karena Vercel sudah memasangnya ke project ini saat deploy produksi pertama. Hal ini dikonfirmasi lewat daftar domain project dan respons HTTP 200 dari situs ini. Alias `rumahbaliestate.vercel.app` yang sempat ditambahkan sebagai cadangan sudah dihapus.
- Subdomain: CNAME `rumah-bali-estate` di DNS onyxcreative.asia (hPanel Hostinger) menuju Vercel.
- Canonical, sitemap, dan robots memakai `SITE_URL` di `src/lib/site.ts`.
