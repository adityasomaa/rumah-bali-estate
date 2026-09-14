import type { ReactNode } from "react";
import { CtaLink, type Cta } from "@/components/ui/cta";
import { cn } from "@/lib/utils";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[80rem] px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

type SectionHeaderProps = {
  /** Judul section (label pendek) */
  label: string;
  /** Headline */
  title: string;
  /** Deskripsi singkat */
  description: ReactNode;
  /** CTA: objek Cta atau elemen kustom (mis. tombol yang membuka dialog) */
  cta: Cta | ReactNode;
  id: string;
  as?: "h1" | "h2";
  className?: string;
};

function isCta(value: unknown): value is Cta {
  return typeof value === "object" && value !== null && "href" in value && "label" in value;
}

/**
 * Dipakai oleh semua section. Urutan selalu sama:
 * judul section, headline, deskripsi singkat, CTA.
 */
export function SectionHeader({ label, title, description, cta, id, as = "h2", className }: SectionHeaderProps) {
  const Heading = as;
  return (
    <header className={cn("grid justify-items-start gap-4", className)}>
      <p className="flex items-center gap-3 text-sm font-semibold text-accent">
        <span aria-hidden className="h-0.5 w-6 bg-accent" />
        {label}
      </p>
      <Heading id={id} className={cn(as === "h1" ? "type-display" : "type-headline", "text-ink")}>
        {title}
      </Heading>
      <p className="max-w-[62ch] text-base leading-relaxed text-ink-soft md:text-lg">{description}</p>
      <div className="pt-1">{isCta(cta) ? <CtaLink cta={cta} /> : cta}</div>
    </header>
  );
}

export function Section({ children, labelledBy, className, id }: { children: ReactNode; labelledBy: string; className?: string; id?: string }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("py-16 md:py-24", className)}>
      {children}
    </section>
  );
}
