"use client";

import { ArrowsOutSimpleIcon, CaretLeftIcon, CaretRightIcon, XIcon } from "@phosphor-icons/react/ssr";
import { useEffect, useState } from "react";
import { Media, type MediaRatio } from "@/components/ui/media";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

type Item = { src: string; ratio: MediaRatio; alt: string };

/**
 * Galeri ilustrasi. Baris 16:9 + 1:1 memakai kolom 16fr/9fr sehingga
 * tinggi keduanya sama tanpa mengubah rasio gambar.
 */
export function Gallery({ items }: { items: Item[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;
  const current = open ? items[index] : null;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") setIndex((i) => (i === null ? i : (i + 1) % items.length));
      if (event.key === "ArrowLeft") setIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length));
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, items.length]);

  const rows: Item[][] = [];
  for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));

  return (
    <div className="grid gap-3 md:gap-4">
      {rows.map((row, r) => (
        <ul
          key={r}
          className={cn(
            "grid grid-cols-2 gap-3 md:gap-4",
            row.length === 2 && row[0].ratio === "16/9" && row[1].ratio === "1/1" && "md:grid-cols-[16fr_9fr]",
            row.length === 2 && row[0].ratio === "1/1" && row[1].ratio === "16/9" && "md:grid-cols-[9fr_16fr]",
          )}
        >
          {row.map((item, i) => {
            const absolute = r * 2 + i;
            return (
              <li key={item.src} className={cn(item.ratio === "16/9" ? "col-span-2 md:col-span-1" : "col-span-1")}>
                <button
                  type="button"
                  onClick={() => setIndex(absolute)}
                  className="group relative block w-full rounded-panel text-left"
                >
                  <Media src={item.src} ratio={item.ratio} alt={item.alt} sizes="(min-width: 48rem) 60vw, 100vw" />
                  <span className="pointer-events-none absolute right-3 bottom-3 grid size-10 place-items-center rounded-control bg-surface text-ink opacity-90 transition-opacity group-hover:opacity-100">
                    <ArrowsOutSimpleIcon aria-hidden size={20} />
                  </span>
                  <span className="sr-only">Perbesar gambar {absolute + 1}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ))}
      <p className="text-sm text-ink-soft">Semua gambar adalah ilustrasi, bukan foto atau render final unit.</p>

      <Modal open={open} onClose={() => setIndex(null)} labelledBy="lightbox-title" className="max-w-5xl p-3 sm:p-4">
        {current ? (
          <div className="grid gap-3">
            <div className="flex items-center justify-between gap-3 px-1">
              <p id="lightbox-title" className="text-sm font-semibold text-ink">
                Gambar {index! + 1} dari {items.length}
              </p>
              <button type="button" onClick={() => setIndex(null)} className="grid size-11 place-items-center rounded-control text-ink hover:bg-paper">
                <XIcon aria-hidden size={22} />
                <span className="sr-only">Tutup galeri</span>
              </button>
            </div>
            <figure className="grid gap-3">
              <div
                className={cn(
                  "mx-auto w-full",
                  current.ratio === "1/1" ? "max-w-[min(100%,calc(100svh-11rem))]" : "max-w-[min(100%,calc((100svh-11rem)*16/9))]",
                )}
              >
                <Media key={current.src} src={current.src} ratio={current.ratio} alt={current.alt} sizes="90vw" />
              </div>
              <figcaption className="px-1 text-sm text-ink-soft">{current.alt}. Ilustrasi.</figcaption>
            </figure>
            <div className="flex justify-between gap-3">
              <button
                type="button"
                onClick={() => setIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length))}
                className="inline-flex min-h-11 items-center gap-2 rounded-control border border-line-strong px-4 font-semibold text-ink hover:border-ink"
              >
                <CaretLeftIcon aria-hidden size={18} /> Sebelumnya
              </button>
              <button
                type="button"
                onClick={() => setIndex((i) => (i === null ? i : (i + 1) % items.length))}
                className="inline-flex min-h-11 items-center gap-2 rounded-control border border-line-strong px-4 font-semibold text-ink hover:border-ink"
              >
                Berikutnya <CaretRightIcon aria-hidden size={18} />
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
