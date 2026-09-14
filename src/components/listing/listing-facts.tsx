import type { ReactNode } from "react";
import { AskWhatsApp } from "@/components/listing/ask-whatsapp";
import type { Listing } from "@/data/listings";
import { formatDate, formatRupiahShort } from "@/lib/format";

export function ListingFacts({ listing }: { listing: Listing }) {
  const context = listing.shortTitle;
  const min = Math.min(...listing.types.map((t) => t.price));
  const facts: { label: string; value: ReactNode }[] = [
    { label: "Status", value: "Rumah inden, dibangun setelah dipesan" },
    { label: "Lokasi", value: `${listing.area.district}, ${listing.area.subdistrict}, ${listing.area.city}` },
    { label: "Harga mulai", value: <span className="num font-semibold">{formatRupiahShort(min)}</span> },
    {
      label: "Sumber informasi",
      value: (
        <>
          {listing.source.label}, {formatDate(listing.source.datePosted)}
        </>
      ),
    },
    { label: "Nama perumahan", value: listing.projectName ?? <AskWhatsApp subject="Nama perumahan" context={context} /> },
    { label: "Alamat lengkap", value: listing.address ?? <AskWhatsApp subject="Alamat lengkap" context={context} /> },
    {
      label: "Jumlah unit",
      value: listing.unitCount != null ? `${listing.unitCount} unit` : <AskWhatsApp subject="Jumlah unit" context={context} />,
    },
  ];

  return (
    <dl className="grid gap-x-8 rounded-panel border border-line bg-surface px-4 py-2 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
      {facts.map((fact) => (
        <div key={fact.label} className="grid min-h-16 content-center gap-0.5 border-b border-line py-3 last:border-b-0 sm:[&:nth-last-child(-n+1)]:border-b-0">
          <dt className="text-sm text-ink-soft">{fact.label}</dt>
          <dd className="text-ink">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
