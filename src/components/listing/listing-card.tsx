import { TLink } from "@/components/t-link";
import { buttonClass } from "@/components/ui/cta";
import { Media } from "@/components/ui/media";
import type { Listing } from "@/data/listings";
import { formatDate, formatRupiahShort } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ListingCard({ listing }: { listing: Listing }) {
  const prices = listing.types.map((t) => t.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const href = `/listing/${listing.slug}`;

  return (
    <article className="relative grid overflow-hidden rounded-panel border border-line bg-surface transition-colors hover:border-line-strong md:grid-cols-2">
      <Media src={listing.art.wide} ratio="16/9" sizes="(min-width: 48rem) 50vw, 100vw" alt={`Ilustrasi ${listing.shortTitle}`} className="rounded-none" />
      <div className="grid content-center justify-items-start gap-4 p-5 sm:p-7 lg:p-10">
        <span className="rounded-control bg-accent-tint px-2.5 py-1 text-sm font-semibold text-accent-strong">Rumah inden</span>
        <h2 className="type-title text-ink">
          <TLink href={href} className="after:absolute after:inset-0 after:content-['']">
            {listing.title}
          </TLink>
        </h2>
        <dl className="grid w-full gap-2 text-sm">
          <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3">
            <dt className="text-ink-soft">Lokasi</dt>
            <dd className="text-ink">
              {listing.area.district}, {listing.area.subdistrict}, {listing.area.city}
            </dd>
          </div>
          <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3">
            <dt className="text-ink-soft">Tipe</dt>
            <dd className="text-ink">{listing.types.map((t) => t.name).join(" dan ")}</dd>
          </div>
          <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3">
            <dt className="text-ink-soft">Harga</dt>
            <dd className="num font-semibold text-ink">
              {min === max ? formatRupiahShort(min) : `${formatRupiahShort(min)} sampai ${formatRupiahShort(max)}`}
            </dd>
          </div>
          <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3">
            <dt className="text-ink-soft">Diunggah</dt>
            <dd className="text-ink">{formatDate(listing.source.datePosted)}</dd>
          </div>
        </dl>
        <span aria-hidden className={cn(buttonClass("secondary"), "mt-1")}>
          Lihat detail
        </span>
      </div>
    </article>
  );
}
