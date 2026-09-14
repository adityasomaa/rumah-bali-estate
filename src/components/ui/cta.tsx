import { ArrowRightIcon, WhatsappLogoIcon } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";
import { TLink } from "@/components/t-link";
import { cn } from "@/lib/utils";

export type Cta = {
  href: string;
  label: string;
  /** internal: transisi halaman; whatsapp/external: tab baru */
  kind?: "internal" | "whatsapp" | "external";
  variant?: "primary" | "secondary" | "text";
  /** Ikon WhatsApp untuk link internal yang berujung ke WhatsApp (mis. form survei) */
  icon?: "whatsapp";
};

export function buttonClass(variant: Cta["variant"] = "primary") {
  return cn(
    "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-control text-base font-semibold whitespace-nowrap",
    "transition-[background-color,border-color,color,transform] duration-200 ease-out-expo active:translate-y-px",
    variant === "primary" && "bg-accent px-5 text-on-accent hover:bg-accent-strong",
    variant === "secondary" && "border border-line-strong bg-surface px-5 text-ink hover:border-ink",
    variant === "text" && "min-h-11 px-0 text-accent underline decoration-accent/40 hover:decoration-accent",
  );
}

export function CtaLink({ cta, className, children }: { cta: Cta; className?: string; children?: ReactNode }) {
  const kind = cta.kind ?? "internal";
  const content = children ?? cta.label;
  if (kind === "internal") {
    return (
      <TLink href={cta.href} className={cn(buttonClass(cta.variant), "group", className)}>
        {cta.icon === "whatsapp" ? <WhatsappLogoIcon aria-hidden size={20} weight="fill" /> : null}
        {content}
        {cta.icon ? null : (
          <ArrowRightIcon aria-hidden size={18} weight="bold" className="transition-transform duration-200 group-hover:translate-x-0.5" />
        )}
      </TLink>
    );
  }
  return (
    <a href={cta.href} target="_blank" rel="noopener noreferrer" className={cn(buttonClass(cta.variant), className)}>
      {kind === "whatsapp" ? <WhatsappLogoIcon aria-hidden size={20} weight="fill" /> : null}
      {content}
      <span className="sr-only"> (membuka tab baru)</span>
    </a>
  );
}
