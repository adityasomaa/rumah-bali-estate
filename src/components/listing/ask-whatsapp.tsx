import { WhatsappLogoIcon } from "@phosphor-icons/react/ssr";
import { waLink } from "@/lib/whatsapp";

/**
 * Tampilan untuk field yang belum dikonfirmasi klien. Tidak disembunyikan,
 * tidak diisi nol: screen reader membaca "… belum dicantumkan, tanyakan via WhatsApp".
 */
export function AskWhatsApp({ subject, context }: { subject: string; context: string }) {
  const href = waLink(`Halo Rumah Bali Estate, saya ingin menanyakan ${subject.toLowerCase()} untuk ${context}.`);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-empty-field=""
      className="inline-flex min-h-11 items-center gap-1.5 font-medium text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
    >
      <WhatsappLogoIcon aria-hidden size={16} weight="fill" className="shrink-0" />
      <span className="sr-only">
        {subject} belum dicantumkan.{" "}
      </span>
      Tanyakan via WhatsApp
      <span className="sr-only"> (membuka tab baru)</span>
    </a>
  );
}
