"use client";

import { useConsent } from "@/components/providers/consent-provider";
import { useUi } from "@/components/providers/ui-provider";
import { buttonClass } from "@/components/ui/cta";
import { Media } from "@/components/ui/media";
import type { Listing } from "@/data/listings";

/**
 * Peta area. Google Maps (pihak ketiga) hanya dimuat bila kategori cookie
 * "Peta interaktif" diizinkan; tanpa izin tampil peta ilustratif lokal.
 * Kueri hanya nama kelurahan, jadi peta menunjuk area, bukan titik rumah.
 */
export function AreaMap({ listing }: { listing: Listing }) {
  const { consent, save } = useConsent();
  const { setCookieSettingsOpen } = useUi();
  const embed = `https://maps.google.com/maps?q=${encodeURIComponent(listing.mapQuery)}&z=14&output=embed`;

  if (consent.media) {
    return (
      <div className="grid gap-3">
        <div className="media-frame relative aspect-video w-full overflow-hidden rounded-panel">
          <iframe
            src={embed}
            title={`Peta area ${listing.area.district}, ${listing.area.subdistrict}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
        <p className="text-sm text-ink-soft">
          Peta dari Google Maps.{" "}
          <button type="button" onClick={() => setCookieSettingsOpen(true)} className="font-medium text-accent underline">
            Ubah izin peta
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-12 lg:items-center lg:gap-8">
      <div className="lg:col-span-8">
        <Media src="area-map" ratio="16/9" sizes="(min-width: 48rem) 66vw, 100vw" alt={`Peta ilustratif area ${listing.area.district}, ${listing.area.subdistrict}`} />
      </div>
      <div className="grid content-start justify-items-start gap-3 md:col-span-4">
        <p className="leading-relaxed text-ink-soft">
          Peta interaktif dari Google Maps hanya dimuat jika Anda mengizinkannya, karena Google dapat menyetel cookie sendiri.
        </p>
        <button type="button" onClick={() => save({ ...consent, media: true })} className={buttonClass("secondary")}>
          Izinkan dan tampilkan peta
        </button>
      </div>
    </div>
  );
}
