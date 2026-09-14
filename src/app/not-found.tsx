import type { Metadata } from "next";
import { Container, Section, SectionHeader } from "@/components/section";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Section labelledBy="notfound-title" className="pt-10 md:pt-16">
      <Container>
        <SectionHeader
          as="h1"
          id="notfound-title"
          label="404"
          title="Halaman tidak ditemukan"
          description="Alamat yang Anda buka tidak tersedia atau sudah dipindahkan. Listing yang sedang dijual bisa dilihat dari halaman Home."
          cta={{ href: "/", label: "Kembali ke Home" }}
        />
      </Container>
    </Section>
  );
}
