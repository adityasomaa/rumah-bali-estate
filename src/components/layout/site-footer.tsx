"use client";

import { FacebookLogoIcon, InstagramLogoIcon, PhoneIcon, TiktokLogoIcon, WhatsappLogoIcon } from "@phosphor-icons/react/ssr";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { useUi } from "@/components/providers/ui-provider";
import { Container, SectionHeader } from "@/components/section";
import { TLink } from "@/components/t-link";
import { featuredListing } from "@/data/listings";
import { legalNav, nav, site } from "@/lib/site";
import { waLink } from "@/lib/whatsapp";

export function SiteFooter() {
  const pathname = usePathname();
  const { setCookieSettingsOpen } = useUi();
  const listingHref = `/listing/${featuredListing.slug}`;

  // CTA footer bertukar target bila pengunjung sudah berada di halaman tujuannya.
  const onContactPage = pathname === "/kontak";
  const cta = onContactPage
    ? {
        label: "Listing",
        title: "Bandingkan dua tipe rumah Sesetan",
        description: "Lihat harga, luas tanah, dan selisih kedua tipe sebelum menjadwalkan survei.",
        cta: { href: listingHref, label: "Lihat listing Sesetan" },
      }
    : {
        label: "Survei lokasi",
        title: "Lihat langsung kawasan Sesetan",
        description: "Pilih tipe dan tanggal, lalu kirim permintaan survei lewat WhatsApp.",
        cta: { href: "/kontak#survei", label: "Jadwalkan survei lokasi" },
      };

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface">
      <Container className="py-14 md:py-20">
        <div className="rounded-panel bg-accent-tint px-5 py-8 sm:px-8 md:px-12 md:py-12">
          <SectionHeader id="footer-cta" label={cta.label} title={cta.title} description={cta.description} cta={cta.cta} />
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1fr]">
          <div className="grid content-start gap-3">
            <div className="flex items-center gap-2.5">
              <BrandMark className="size-8" />
              <p className="text-lg font-extrabold tracking-[-0.025em] text-ink">{site.name}</p>
            </div>
            <p className="max-w-[34ch] text-sm leading-relaxed text-ink-soft">
              {site.tagline}. Informasi rumah dijual di Denpasar, termasuk rumah inden di Sesetan, Denpasar Selatan.
            </p>
          </div>

          <nav aria-label="Menu footer" className="grid content-start gap-3">
            <p className="text-sm font-semibold text-ink">Halaman</p>
            <ul className="grid gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <TLink href={item.href} className="inline-flex min-h-10 items-center text-ink-soft hover:text-ink">
                    {item.label}
                  </TLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="grid content-start gap-3">
            <p className="text-sm font-semibold text-ink">Kontak</p>
            <ul className="grid gap-1">
              <li>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 text-ink-soft hover:text-ink">
                  <WhatsappLogoIcon aria-hidden size={18} /> WhatsApp {site.phoneDisplay}
                  <span className="sr-only"> (membuka tab baru)</span>
                </a>
              </li>
              <li>
                <a href={`tel:${site.phoneE164}`} className="inline-flex min-h-10 items-center gap-2 text-ink-soft hover:text-ink">
                  <PhoneIcon aria-hidden size={18} /> Telepon {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 text-ink-soft hover:text-ink">
                  <InstagramLogoIcon aria-hidden size={18} /> Instagram @rumahbali.estate
                  <span className="sr-only"> (membuka tab baru)</span>
                </a>
              </li>
              <li>
                <a href={site.social.tiktok} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 text-ink-soft hover:text-ink">
                  <TiktokLogoIcon aria-hidden size={18} /> TikTok @rumahbaliestate
                  <span className="sr-only"> (membuka tab baru)</span>
                </a>
              </li>
              <li>
                <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 text-ink-soft hover:text-ink">
                  <FacebookLogoIcon aria-hidden size={18} /> Facebook Rumah Bali Estate
                  <span className="sr-only"> (membuka tab baru)</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="grid content-start gap-3">
            <p className="text-sm font-semibold text-ink">Legal</p>
            <ul className="grid gap-1">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <TLink href={item.href} className="inline-flex min-h-10 items-center text-ink-soft hover:text-ink">
                    {item.label}
                  </TLink>
                </li>
              ))}
              <li>
                <button type="button" onClick={() => setCookieSettingsOpen(true)} className="inline-flex min-h-10 items-center text-left text-ink-soft hover:text-ink">
                  Pengaturan cookie
                </button>
              </li>
            </ul>
          </div>
        </div>
      </Container>
      <div className="border-t border-line">
        <Container className="flex flex-wrap items-center justify-between gap-2 pt-5 pb-[calc(var(--fab-size)+2.5rem)] text-sm text-ink-soft md:pb-6">
          <p>
            © {year} {site.name}
          </p>
          <p>Gambar di situs ini adalah ilustrasi.</p>
        </Container>
      </div>
    </footer>
  );
}
