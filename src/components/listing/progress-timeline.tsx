import type { ProgressEntry } from "@/data/listings";
import { formatDate } from "@/lib/format";

/** Linimasa progres. Kosong rapi sampai `progress` di data listing diisi. */
export function ProgressTimeline({ entries }: { entries: ProgressEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="grid items-center gap-6 rounded-panel border border-dashed border-line-strong bg-surface p-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:p-8">
        <div aria-hidden className="relative grid h-32 content-between justify-items-start pl-1">
          <span className="absolute top-2 bottom-2 left-[0.6875rem] border-l-2 border-dashed border-line-strong" />
          {[0, 1, 2].map((i) => (
            <span key={i} className="relative flex items-center gap-3">
              <span className="size-4 rounded-full border-2 border-line-strong bg-surface" />
              <span className="h-0.5 w-12 bg-line" />
            </span>
          ))}
        </div>
        <div className="grid gap-2">
          <p className="type-title text-ink">Belum ada pembaruan progres</p>
          <p className="max-w-[56ch] leading-relaxed text-ink-soft">
            Catatan progres pembangunan akan tampil di sini beserta tanggalnya, dari yang terbaru. Untuk kondisi terkini,
            tanyakan langsung lewat WhatsApp.
          </p>
        </div>
      </div>
    );
  }

  const sorted = [...entries].sort((x, y) => y.date.localeCompare(x.date));
  return (
    <ol className="relative grid gap-8 border-l-2 border-line pl-7">
      {sorted.map((entry) => (
        <li key={`${entry.date}-${entry.title}`} className="relative grid gap-1">
          <span aria-hidden className="absolute top-1.5 -left-[2.1rem] size-4 rounded-full border-2 border-accent bg-accent ring-4 ring-paper" />
          <time dateTime={entry.date} className="text-sm text-ink-soft">
            {formatDate(entry.date)}
          </time>
          <h3 className="type-title text-ink">{entry.title}</h3>
          {entry.note ? <p className="max-w-[60ch] leading-relaxed text-ink-soft">{entry.note}</p> : null}
        </li>
      ))}
    </ol>
  );
}
