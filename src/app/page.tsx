import type { Metadata } from "next";
import { BuyingSteps } from "@/components/listing/buying-steps";
import { Hero } from "@/components/listing/hero";
import { TypeComparison } from "@/components/listing/type-comparison";
import { TypeFigures } from "@/components/listing/type-figures";
import { Reveal } from "@/components/reveal";
import { Container, Section, SectionHeader } from "@/components/section";
import { Media } from "@/components/ui/media";
import { featuredListing } from "@/data/listings";
import { comparisonCopy } from "@/data/options";
import { formatRupiahShort } from "@/lib/format";
import { waLink } from "@/lib/whatsapp";

const listing = featuredListing;
const priceLine = listing.types.map((t) => `${t.name} ${formatRupiahShort(t.price)}`).join(" dan ");

export const metadata: Metadata = {
  title: { absolute: `Rumah Inden di ${listing.area.district}, ${listing.area.subdistrict} | Rumah Bali Estate` },
  description: `Rumah inden dijual di ${listing.area.district}, ${listing.area.subdistrict}. ${priceLine}. Bandingkan tipe, hitung simulasi KPR, dan jadwalkan survei lewat WhatsApp.`,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const compare = comparisonCopy(listing);
  return (
    <>
      <Hero listing={listing} />

      <Section id="perbandingan" labelledBy="perbandingan-title" className="border-t border-line bg-surface">
        <Container className="grid gap-10 md:gap-14">
          <SectionHeader
            id="perbandingan-title"
            label="Perbandingan tipe"
            title={compare.title}
            description={compare.description}
            cta={{ href: `/listing/${listing.slug}`, label: "Lihat detail listing" }}
          />
          <Reveal>
            <TypeFigures listing={listing} />
          </Reveal>
          <Reveal>
            <TypeComparison listing={listing} variant="summary" />
          </Reveal>
        </Container>
      </Section>

      <Section labelledBy="cara-membeli-title">
        <Container className="grid gap-12 md:gap-16">
          <SectionHeader
            id="cara-membeli-title"
            label="Cara membeli"
            title="Empat langkah membeli rumah inden"
            description="Gambaran umum membeli rumah yang dibangun setelah dipesan. Syarat untuk listing ini dikonfirmasi langsung lewat WhatsApp."
            cta={{ href: "/simulasi-kpr", label: "Coba simulasi KPR" }}
          />
          <Reveal>
            <BuyingSteps />
          </Reveal>
        </Container>
      </Section>

      <Section labelledBy="tanya-title" className="pt-0 md:pt-0">
        <Container>
          <div className="grid items-center gap-8 rounded-panel border border-line bg-surface p-5 sm:p-8 md:grid-cols-12 md:gap-10 lg:p-12">
            <div className="md:col-span-8">
              <SectionHeader
                id="tanya-title"
                label="Tanya langsung"
                title="Tanya detail rumah Sesetan"
                description="Spesifikasi, jadwal pembangunan, dan KPR bisa ditanyakan langsung lewat WhatsApp Rumah Bali Estate."
                cta={{
                  href: waLink("Halo Rumah Bali Estate, saya ingin info detail dan KPR rumah inden di Sesetan."),
                  label: "Chat WhatsApp",
                  kind: "whatsapp",
                }}
              />
            </div>
            <div className="md:col-span-4">
              <Media src="detail-facade" ratio="1/1" sizes="(min-width: 48rem) 33vw, 100vw" alt="Ilustrasi detail fasad putih dengan bidang kayu dan jendela tinggi" />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
