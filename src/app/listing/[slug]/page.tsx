import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SurveyForm } from "@/components/forms/survey-form";
import { JsonLd } from "@/components/json-ld";
import { AreaMap } from "@/components/listing/area-map";
import { Gallery } from "@/components/listing/gallery";
import { ListingFacts } from "@/components/listing/listing-facts";
import { ProgressTimeline } from "@/components/listing/progress-timeline";
import { TypeComparison } from "@/components/listing/type-comparison";
import { TypeFigures } from "@/components/listing/type-figures";
import { Reveal } from "@/components/reveal";
import { Container, Section, SectionHeader } from "@/components/section";
import { getListing, listings } from "@/data/listings";
import { formatRupiahShort } from "@/lib/format";
import { listingJsonLd } from "@/lib/structured-data";
import { waLink } from "@/lib/whatsapp";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return listings.map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = getListing(slug);
  if (!listing) return {};
  const typeNames = listing.types.map((t) => t.name.replace("Tipe ", "")).join(" dan ");
  return {
    title: `${listing.title}, Tipe ${typeNames}`,
    description: `${listing.summary} Harga ${listing.types.map((t) => `${t.name} ${formatRupiahShort(t.price)}`).join(", ")}. Info detail dan KPR lewat WhatsApp.`,
    alternates: { canonical: `/listing/${listing.slug}` },
    openGraph: { title: listing.title, url: `/listing/${listing.slug}` },
  };
}

export default async function ListingDetailPage({ params }: Props) {
  const { slug } = await params;
  const listing = getListing(slug);
  if (!listing) notFound();

  const firstType = listing.types[0];
  const context = listing.shortTitle;

  return (
    <>
      <JsonLd data={listingJsonLd(listing)} />

      <Section labelledBy="detail-title" className="pt-10 md:pt-16">
        <Container className="grid gap-10">
          <SectionHeader
            as="h1"
            id="detail-title"
            label={`Listing ${listing.area.district}`}
            title={listing.title}
            description={listing.summary}
            cta={{ href: "#survei", label: "Jadwalkan survei", icon: "whatsapp" }}
          />
          <ListingFacts listing={listing} />
          <Gallery items={listing.art.gallery} />
        </Container>
      </Section>

      <Section id="perbandingan" labelledBy="compare-title" className="border-y border-line bg-surface">
        <Container className="grid gap-10 md:gap-14">
          <SectionHeader
            id="compare-title"
            label="Perbandingan tipe"
            title={`Bandingkan ${listing.types.map((t) => t.name).join(" dan ")}`}
            description="Tabel berikut menyandingkan kedua tipe. Spesifikasi yang belum dicantumkan bisa ditanyakan langsung per tipe."
            cta={{ href: `/simulasi-kpr?tipe=${encodeURIComponent(`${listing.slug}:${firstType.id}`)}`, label: "Hitung simulasi KPR" }}
          />
          <Reveal>
            <TypeFigures listing={listing} />
          </Reveal>
          <Reveal>
            <TypeComparison listing={listing} variant="full" />
          </Reveal>
        </Container>
      </Section>

      <Section labelledBy="progress-title">
        <Container className="grid gap-10">
          <SectionHeader
            id="progress-title"
            label="Progres pembangunan"
            title="Linimasa pembangunan"
            description="Pembaruan progres pembangunan dicatat di sini beserta tanggalnya."
            cta={{
              href: waLink(`Halo Rumah Bali Estate, saya ingin menanyakan progres pembangunan ${context}.`),
              label: "Tanyakan progres",
              kind: "whatsapp",
              variant: "secondary",
            }}
          />
          <Reveal>
            <ProgressTimeline entries={listing.progress} />
          </Reveal>
        </Container>
      </Section>

      <Section labelledBy="lokasi-title" className="border-y border-line bg-surface">
        <Container className="grid gap-10">
          <SectionHeader
            id="lokasi-title"
            label="Lokasi"
            title={`Area ${listing.area.district}, ${listing.area.subdistrict}`}
            description="Peta menunjuk area Sesetan, bukan titik rumah. Alamat lengkap diinformasikan saat menjadwalkan survei."
            cta={{
              href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.mapQuery)}`,
              label: "Buka di Google Maps",
              kind: "external",
              variant: "secondary",
            }}
          />
          <Reveal>
            <AreaMap listing={listing} />
          </Reveal>
        </Container>
      </Section>

      <Section id="survei" labelledBy="survei-title">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionHeader
              id="survei-title"
              label="Survei lokasi"
              title="Jadwalkan survei lokasi"
              description="Pilih tipe dan tanggal. Form ini membuka WhatsApp dengan pesan yang sudah terisi, tanpa menyimpan data di server."
              cta={{
                href: waLink(`Halo Rumah Bali Estate, saya ingin bertanya tentang ${context}.`),
                label: "Chat WhatsApp",
                kind: "whatsapp",
                variant: "secondary",
              }}
            />
          </div>
          <div className="lg:col-span-7">
            <SurveyForm idPrefix="detail-survei" />
          </div>
        </Container>
      </Section>
    </>
  );
}
