import { Media } from "@/components/ui/media";
import type { Listing } from "@/data/listings";
import { formatArea } from "@/lib/format";

/** Ilustrasi per tipe. Komposisi kavling berbeda menonjolkan selisih luas tanah. */
export function TypeFigures({ listing }: { listing: Listing }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 md:gap-8">
      {listing.types.map((type) => (
        <li key={type.id}>
          <figure className="grid gap-3">
            <Media
              src={type.art.wide}
              ratio="16/9"
              sizes="(min-width: 80rem) 600px, (min-width: 40rem) 50vw, 100vw"
              alt={`Ilustrasi ${type.name}: kavling dengan luas tanah ${formatArea(type.landArea)}`}
            />
            <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="type-title text-ink">{type.name}</span>
              <span className="num text-sm text-ink-soft">
                Tanah {formatArea(type.landArea)}, bangunan {formatArea(type.buildingArea)}
              </span>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
