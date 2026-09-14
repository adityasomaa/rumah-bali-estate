"use client";

import Image from "next/image";
import { ImageBrokenIcon } from "@phosphor-icons/react/ssr";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type MediaRatio = "16/9" | "1/1";

type MediaProps = {
  /** nama file di public/art tanpa ekstensi, atau path absolut */
  src: string;
  alt: string;
  ratio: MediaRatio;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/**
 * Semua gambar lewat komponen ini. Rasio dikunci 16:9 atau 1:1 lewat
 * aspect-ratio pada pembungkus, jadi ruang tertahan sebelum gambar termuat.
 */
export function Media({ src, alt, ratio, sizes, priority, className }: MediaProps) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const path = src.startsWith("/") ? src : `/art/${src}.svg`;

  useEffect(() => {
    const img = imgRef.current;
    // Gambar yang gagal sebelum hidrasi tidak memicu onError, jadi cek manual.
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <div
      className={cn(
        "media-frame relative isolate w-full max-w-full overflow-hidden rounded-panel",
        ratio === "16/9" ? "aspect-video" : "aspect-square",
        className,
      )}
    >
      {failed ? (
        <div role="img" aria-label={alt} className="absolute inset-0 grid place-content-center justify-items-center gap-2 p-4 text-center">
          <ImageBrokenIcon aria-hidden size={32} className="text-accent" />
          <span className="text-sm text-ink-soft">Ilustrasi belum dapat dimuat</span>
        </div>
      ) : (
        <Image
          ref={imgRef}
          src={path}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          draggable={false}
          onError={() => setFailed(true)}
          className="object-cover"
        />
      )}
    </div>
  );
}
