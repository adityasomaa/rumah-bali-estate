import type { Metadata } from "next";
import { ListingCard } from "@/components/listing/listing-card";
import { Container, Section, SectionHeader } from "@/components/section";
import { listings } from "@/data/listings";
import { waLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Listing Rumah Dijual di Denpasar",
  description:
    "Daftar rumah dijual dari Rumah Bali Estate di Denpasar, termasuk rumah inden di Sesetan, Denpasar Selatan, lengkap dengan tipe dan harga.",
  alternates: { canonical: "/listing" },
};

export default function ListingPage() {
  return (
    <Section labelledBy="listing-title" className="pt-10 md:pt-16">
      <Container className="grid gap-10 md:gap-14">
        <SectionHeader
          as="h1"
          id="listing-title"
          label="Listing"
          title="Rumah dijual di Denpasar"
          description="Listing yang sedang dipasarkan Rumah Bali Estate, lengkap dengan tipe, harga, dan tanggal informasinya dipublikasikan."
          cta={{
            href: waLink("Halo Rumah Bali Estate, saya ingin bertanya tentang listing rumah yang tersedia."),
            label: "Tanya listing via WhatsApp",
            kind: "whatsapp",
            variant: "secondary",
          }}
        />
        <ul className="grid gap-6">
          {listings.map((listing) => (
            <li key={listing.slug}>
              <ListingCard listing={listing} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
