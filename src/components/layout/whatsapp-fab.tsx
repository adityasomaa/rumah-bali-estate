"use client";

import { WhatsappLogoIcon } from "@phosphor-icons/react/ssr";
import { useUi } from "@/components/providers/ui-provider";
import { waLink } from "@/lib/whatsapp";

/**
 * Tombol WhatsApp melayang. Pembungkus pointer-events-none agar tidak menelan
 * klik di sekitarnya; naik setinggi cookie banner di layar kecil (--cookie-h).
 * Footer memberi ruang bawah setinggi tombol ini supaya tombol terakhir tidak tertutup.
 */
export function WhatsAppFab() {
  const { menuOpen } = useUi();
  if (menuOpen) return null;
  return (
    <div className="pointer-events-none fixed right-4 bottom-[calc(1rem+var(--cookie-h)+env(safe-area-inset-bottom))] z-(--z-fab) md:right-6 md:bottom-6">
      <a
        href={waLink("Halo Rumah Bali Estate, saya ingin bertanya tentang rumah inden di Sesetan.")}
        target="_blank"
        rel="noopener noreferrer"
        data-fab=""
        className="pointer-events-auto grid size-(--fab-size) place-items-center rounded-full bg-accent text-on-accent shadow-[0_12px_28px_-10px_rgb(15_91_44/0.6)] transition-[background-color,transform] duration-200 hover:bg-accent-strong active:scale-95"
      >
        <WhatsappLogoIcon aria-hidden size={28} weight="fill" />
        <span className="sr-only">Chat WhatsApp Rumah Bali Estate (membuka tab baru)</span>
      </a>
    </div>
  );
}
