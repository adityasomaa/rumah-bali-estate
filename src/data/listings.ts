// ============================================================================
// DATA LISTING. Satu-satunya file yang perlu diubah untuk menambah listing.
// Aturan: nilai yang belum dikonfirmasi klien diisi `null`, bukan dikarang.
// `null` otomatis tampil sebagai "Tanyakan via WhatsApp" di halaman.
// ============================================================================

export type SpecKey = "floors" | "bedrooms" | "bathrooms" | "electricity" | "certificate" | "completion";

export type Specs = Record<SpecKey, string | null>;

export type HouseType = {
  id: string;
  name: string;
  /** Luas bangunan dalam m² */
  buildingArea: number;
  /** Luas tanah dalam m² */
  landArea: number;
  /** Harga dalam rupiah, angka penuh */
  price: number;
  specs: Specs;
  /** Nama file ilustrasi di public/art tanpa ekstensi */
  art: { wide: string; square: string };
};

export type ProgressEntry = {
  /** Format YYYY-MM-DD */
  date: string;
  title: string;
  note?: string;
};

export type Listing = {
  slug: string;
  status: "inden";
  title: string;
  shortTitle: string;
  summary: string;
  area: { district: string; subdistrict: string; city: string; province: string };
  /** Peta hanya menunjuk area, bukan titik rumah */
  mapQuery: string;
  projectName: string | null;
  address: string | null;
  unitCount: number | null;
  source: { label: string; url: string; datePosted: string };
  types: HouseType[];
  progress: ProgressEntry[];
  art: { wide: string; square: string; gallery: { src: string; ratio: "16/9" | "1/1"; alt: string }[] };
};

const emptySpecs: Specs = {
  floors: null,
  bedrooms: null,
  bathrooms: null,
  electricity: null,
  certificate: null,
  completion: null,
};

export const listings: Listing[] = [
  {
    slug: "sesetan",
    status: "inden",
    title: "Rumah inden di Sesetan, Denpasar Selatan",
    shortTitle: "Rumah inden Sesetan",
    summary:
      "Dua tipe rumah inden dengan luas bangunan yang sama, 60 m², dan pilihan luas tanah 60 m² atau 80 m².",
    area: { district: "Sesetan", subdistrict: "Denpasar Selatan", city: "Denpasar", province: "Bali" },
    mapQuery: "Sesetan, Denpasar Selatan, Denpasar, Bali",
    projectName: null,
    address: null,
    unitCount: null,
    source: {
      label: "Postingan Facebook Rumah Bali Estate",
      url: "https://www.facebook.com/Rumahbaliestate",
      datePosted: "2026-09-08",
    },
    types: [
      {
        id: "60-60",
        name: "Tipe 60/60",
        buildingArea: 60,
        landArea: 60,
        price: 1_299_000_000,
        specs: { ...emptySpecs },
        art: { wide: "type-60-60", square: "type-60-60-square" },
      },
      {
        id: "60-80",
        name: "Tipe 60/80",
        buildingArea: 60,
        landArea: 80,
        price: 1_479_000_000,
        specs: { ...emptySpecs },
        art: { wide: "type-60-80", square: "type-60-80-square" },
      },
    ],
    progress: [],
    art: {
      wide: "sesetan-hero",
      square: "sesetan-square",
      gallery: [
        { src: "sesetan-hero", ratio: "16/9", alt: "Ilustrasi dua tipe rumah berdampingan dengan lebar halaman berbeda" },
        { src: "detail-facade", ratio: "1/1", alt: "Ilustrasi detail fasad putih dengan bidang kayu" },
        { src: "detail-fence", ratio: "16/9", alt: "Ilustrasi pagar besi dan pintu masuk" },
        { src: "detail-roof", ratio: "1/1", alt: "Ilustrasi garis atap dan jendela" },
      ],
    },
  },
];

export const specLabels: Record<SpecKey, string> = {
  floors: "Jumlah lantai",
  bedrooms: "Kamar tidur",
  bathrooms: "Kamar mandi",
  electricity: "Daya listrik",
  certificate: "Sertifikat",
  completion: "Perkiraan selesai inden",
};

export function getListing(slug: string) {
  return listings.find((l) => l.slug === slug);
}

export const featuredListing = listings[0];
