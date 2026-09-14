"use client";

import { ArrowsLeftRightIcon } from "@phosphor-icons/react/ssr";
import { useState, type ReactNode } from "react";
import { AskWhatsApp } from "@/components/listing/ask-whatsapp";
import { Listbox } from "@/components/ui/listbox";
import { specLabels, type HouseType, type Listing, type SpecKey } from "@/data/listings";
import { compareTypes, describeComparison, signedArea, signedRupiah } from "@/lib/compare";
import { formatArea, formatDate, formatRupiah, formatRupiahShort } from "@/lib/format";
import { cn } from "@/lib/utils";

type Row = { key: string; label: string; value: (t: HouseType) => ReactNode; diff: ReactNode };

export function TypeComparison({ listing, variant }: { listing: Listing; variant: "summary" | "full" }) {
  const { types } = listing;
  const [pair, setPair] = useState<[string, string]>([types[0].id, (types[1] ?? types[0]).id]);
  const a = types.find((t) => t.id === pair[0]) ?? types[0];
  const b = types.find((t) => t.id === pair[1]) ?? types[1] ?? types[0];

  if (types.length < 2) return null;

  const diff = compareTypes(a, b);
  const context = (t: HouseType) => `${t.name}, ${listing.shortTitle}`;

  const rows: Row[] = [
    {
      key: "price",
      label: "Harga",
      value: (t) => (
        <span className="grid">
          <span className="num text-lg font-bold tracking-[-0.01em] text-ink">{formatRupiahShort(t.price)}</span>
          <span className="num text-sm text-ink-soft">{formatRupiah(t.price)}</span>
        </span>
      ),
      diff: <span className="num font-bold text-accent-strong" data-diff="price">{signedRupiah(diff.price)}</span>,
    },
    {
      key: "building",
      label: "Luas bangunan",
      value: (t) => <span className="num">{formatArea(t.buildingArea)}</span>,
      diff: <span className="num font-semibold text-accent-strong" data-diff="building">{signedArea(diff.buildingArea)}</span>,
    },
    {
      key: "land",
      label: "Luas tanah",
      value: (t) => <span className="num">{formatArea(t.landArea)}</span>,
      diff: <span className="num font-bold text-accent-strong" data-diff="land">{signedArea(diff.landArea)}</span>,
    },
    ...(variant === "full"
      ? (Object.keys(specLabels) as SpecKey[]).map<Row>((key) => ({
          key,
          label: specLabels[key],
          value: (t) => t.specs[key] ?? <AskWhatsApp subject={specLabels[key]} context={context(t)} />,
          diff: <span className="text-sm text-ink-soft">Belum bisa dihitung</span>,
        }))
      : []),
  ];

  const summary = describeComparison(a, b);

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        {types.length > 2 ? (
          <div className="grid w-full gap-4 sm:grid-cols-2">
            <Listbox
              label="Tipe pertama"
              options={types.map((t) => ({ value: t.id, label: t.name }))}
              value={a.id}
              onChange={(v) => setPair(([, second]) => (v === second ? [v, pair[0]] : [v, second]))}
            />
            <Listbox
              label="Tipe kedua"
              options={types.map((t) => ({ value: t.id, label: t.name }))}
              value={b.id}
              onChange={(v) => setPair(([first]) => (v === first ? [pair[1], v] : [first, v]))}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setPair(([first, second]) => [second, first])}
            className="inline-flex min-h-11 items-center gap-2 rounded-control border border-line-strong bg-surface px-4 text-sm font-semibold text-ink transition-colors hover:border-ink"
          >
            <ArrowsLeftRightIcon aria-hidden size={18} />
            Tukar urutan perbandingan
          </button>
        )}
      </div>

      <p aria-live="polite" aria-atomic="true" data-testid="comparison-summary" className="rounded-panel bg-accent-tint px-4 py-3 text-base leading-relaxed text-ink md:px-5">
        {summary}
      </p>

      {/* Tablet & desktop: tabel berdampingan */}
      <div className="hidden md:block">
        <table className="w-full table-fixed border-separate border-spacing-0 rounded-panel border border-line bg-surface text-left">
          <caption className="sr-only">
            Perbandingan {a.name} dan {b.name}, dengan kolom selisih yang dihitung otomatis
          </caption>
          <colgroup>
            <col className="w-[22%]" />
            <col />
            <col />
            <col className="w-[22%]" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className="border-b border-line p-4 text-sm font-semibold text-ink-soft lg:px-6">
                Keterangan
              </th>
              <th scope="col" className="border-b border-line p-4 type-title text-ink lg:px-6">
                {a.name}
              </th>
              <th scope="col" className="border-b border-line p-4 type-title text-ink lg:px-6">
                {b.name}
              </th>
              <th scope="col" className="rounded-tr-panel border-b border-line bg-accent-tint p-4 text-base font-semibold text-accent-strong lg:px-6">
                Selisih
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.key}>
                <th scope="row" className={cn("p-4 align-top text-sm font-semibold text-ink-soft lg:px-6", i < rows.length - 1 && "border-b border-line")}>
                  {row.label}
                </th>
                <td className={cn("p-4 align-top text-ink lg:px-6", i < rows.length - 1 && "border-b border-line")}>{row.value(a)}</td>
                <td className={cn("p-4 align-top text-ink lg:px-6", i < rows.length - 1 && "border-b border-line")}>{row.value(b)}</td>
                <td className={cn("bg-accent-tint p-4 align-top lg:px-6", i < rows.length - 1 && "border-b border-line", i === rows.length - 1 && "rounded-br-panel")}>{row.diff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: dua kartu bertumpuk dengan baris sejajar, lalu kartu selisih */}
      <div className="grid gap-4 md:hidden">
        {[a, b].map((type) => (
          <article key={type.id} aria-labelledby={`cmp-${variant}-${type.id}`} className="rounded-panel border border-line bg-surface">
            <h3 id={`cmp-${variant}-${type.id}`} className="type-title border-b border-line px-4 py-3.5 text-ink">
              {type.name}
            </h3>
            <dl>
              {rows.map((row) => (
                <div key={row.key} className="grid min-h-14 grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-3 border-b border-line px-4 py-2.5 last:border-b-0">
                  <dt className="text-sm text-ink-soft">{row.label}</dt>
                  <dd className="min-w-0 text-ink">{row.value(type)}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
        <article aria-labelledby={`cmp-${variant}-diff`} className="rounded-panel bg-accent-tint">
          <h3 id={`cmp-${variant}-diff`} className="type-title px-4 pt-3.5 pb-1 text-accent-strong">
            Selisih {b.name} dibanding {a.name}
          </h3>
          <dl>
            {rows.slice(0, 3).map((row) => (
              <div key={row.key} className="grid min-h-12 grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-3 px-4 py-2">
                <dt className="text-sm text-ink-soft">{row.label}</dt>
                <dd className="min-w-0">{row.diff}</dd>
              </div>
            ))}
          </dl>
        </article>
      </div>

      <p className="text-sm leading-relaxed text-ink-soft">
        Selisih dihitung otomatis dari harga dan luas yang tercantum di listing. Sumber harga: {listing.source.label},{" "}
        {formatDate(listing.source.datePosted)}.
      </p>
    </div>
  );
}
