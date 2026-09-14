"use client";

import { useEffect, useRef } from "react";
import { usePageTransition } from "@/components/providers/transition-provider";
import { Container } from "@/components/section";
import { TLink } from "@/components/t-link";
import { CtaLink } from "@/components/ui/cta";
import { KineticTextReveal, type KineticTextRevealRef } from "@/components/ui/kinetic-text-reveal";
import { Media } from "@/components/ui/media";
import type { Listing } from "@/data/listings";
import { formatArea, formatDate, formatRupiahShort } from "@/lib/format";

/** Hero tepat satu layar (100svh dikurangi header), berisi listing yang sedang dijual. */
export function Hero({ listing }: { listing: Listing }) {
  const { loaderDone } = usePageTransition();
  const titleRef = useRef<KineticTextRevealRef>(null);
  const played = useRef(false);

  useEffect(() => {
    if (loaderDone && !played.current) {
      played.current = true;
      titleRef.current?.play();
    }
  }, [loaderDone]);

  return (
    <section
      aria-labelledby="hero-title"
      className="flex h-[calc(100svh-var(--header-h))] min-h-[34rem] flex-col justify-center py-3 md:py-8"
    >
      <Container className="grid gap-4 md:gap-8">
        <div className="grid gap-2 md:gap-3">
          <p className="flex items-center gap-3 text-sm font-semibold text-accent">
            <span aria-hidden className="h-0.5 w-6 bg-accent" />
            Dijual, rumah inden
          </p>
          <KineticTextReveal
            ref={titleRef}
            as="h1"
            id="hero-title"
            text={listing.title}
            autoPlay={false}
            blur={false}
            distance={28}
            stagger={0.055}
            className="type-display flex text-ink"
          />
        </div>

        <div className="grid items-center gap-4 md:grid-cols-12 md:gap-8">
          <div className="grid gap-3 md:col-span-5 md:gap-5">
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-1" aria-label="Tipe dan harga">
              {listing.types.map((type) => (
                <li key={type.id} className="rounded-panel border border-line bg-surface px-3.5 py-3 md:px-5 md:py-4">
                  <p className="font-semibold text-ink">{type.name}</p>
                  <p className="num text-sm text-ink-soft">
                    <span className="md:hidden">
                      <abbr title="Luas tanah" className="no-underline">LT</abbr> {formatArea(type.landArea)}
                    </span>
                    <span className="hidden md:inline">
                      Luas tanah {formatArea(type.landArea)}, bangunan {formatArea(type.buildingArea)}
                    </span>
                  </p>
                  <p className="num mt-1 text-xl font-bold tracking-[-0.02em] text-ink md:mt-2 md:text-2xl">{formatRupiahShort(type.price)}</p>
                </li>
              ))}
            </ul>
            <p className="text-sm text-ink-soft">
              Harga sesuai postingan {formatDate(listing.source.datePosted)}. Gambar ilustrasi.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <CtaLink cta={{ href: "/kontak#survei", label: "Jadwalkan survei via WhatsApp", icon: "whatsapp" }} className="w-full sm:w-auto" />
              <TLink href="#perbandingan" className="hidden min-h-11 items-center font-semibold text-accent underline decoration-accent/40 hover:decoration-accent sm:inline-flex">
                Bandingkan tipe
              </TLink>
            </div>
          </div>
          <div className="md:col-span-7">
            <Media
              src={listing.art.wide}
              ratio="16/9"
              priority
              sizes="(min-width: 80rem) 700px, (min-width: 48rem) 58vw, 100vw"
              alt="Ilustrasi dua tipe rumah berdampingan: kavling Tipe 60/60 lebih sempit, kavling Tipe 60/80 dengan halaman lebih lebar"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
