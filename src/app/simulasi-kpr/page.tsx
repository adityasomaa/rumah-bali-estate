import type { Metadata } from "next";
import { KprSimulator } from "@/components/kpr/kpr-simulator";
import { Container, Section, SectionHeader } from "@/components/section";
import { featuredListing } from "@/data/listings";

export const metadata: Metadata = {
  title: "Simulasi KPR Rumah Inden",
  description:
    "Hitung perkiraan cicilan KPR rumah inden di Sesetan, Denpasar Selatan. Harga terisi dari tipe yang dipilih; DP, tenor, dan suku bunga diisi sendiri.",
  alternates: { canonical: "/simulasi-kpr" },
};

export default function SimulasiKprPage() {
  return (
    <>
      <Section labelledBy="kpr-title" className="pt-10 md:pt-16">
        <Container className="grid gap-10">
          <SectionHeader
            as="h1"
            id="kpr-title"
            label="Simulasi KPR"
            title="Hitung perkiraan cicilan KPR"
            description="Pilih tipe rumah, lalu isi DP, tenor, dan suku bunga sesuai penawaran yang Anda terima. Hasilnya simulasi, bukan penawaran bank."
            cta={{ href: "/kontak#tanya-kpr", label: "Tanya KPR via WhatsApp", icon: "whatsapp", variant: "secondary" }}
          />
          <KprSimulator />
        </Container>
      </Section>

      <Section labelledBy="rumus-title" className="border-t border-line bg-surface">
        <Container className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-6">
            <SectionHeader
              id="rumus-title"
              label="Rumus"
              title="Cara simulasi ini menghitung"
              description="Angsuran dihitung dengan metode anuitas: jumlah cicilan sama setiap bulan dan suku bunga tetap sepanjang tenor."
              cta={{ href: `/listing/${featuredListing.slug}`, label: "Lihat listing Sesetan", variant: "secondary" }}
            />
          </div>
          <div className="grid gap-4 rounded-panel border border-line bg-paper p-5 sm:p-8 lg:col-span-6">
            <p className="num text-lg font-semibold text-ink md:text-xl">
              Angsuran = P × r ÷ (1 − (1 + r)<sup>−n</sup>)
            </p>
            <dl className="grid gap-2 text-ink-soft">
              <div className="grid grid-cols-[2rem_minmax(0,1fr)] gap-2">
                <dt className="font-semibold text-ink">P</dt>
                <dd>harga rumah dikurangi DP</dd>
              </div>
              <div className="grid grid-cols-[2rem_minmax(0,1fr)] gap-2">
                <dt className="font-semibold text-ink">r</dt>
                <dd>suku bunga per tahun ÷ 12 ÷ 100</dd>
              </div>
              <div className="grid grid-cols-[2rem_minmax(0,1fr)] gap-2">
                <dt className="font-semibold text-ink">n</dt>
                <dd>tenor dalam tahun × 12</dd>
              </div>
            </dl>
            <p className="text-sm leading-relaxed text-ink-soft">
              Jika suku bunga 0%, angsuran sama dengan P ÷ n. Bunga berjenjang, biaya provisi, asuransi, notaris, dan pajak tidak dihitung.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
