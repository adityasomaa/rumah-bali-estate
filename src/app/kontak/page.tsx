import { FacebookLogoIcon, InstagramLogoIcon, PhoneIcon, TiktokLogoIcon, WhatsappLogoIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import { KprQuestionForm } from "@/components/forms/kpr-question-form";
import { SurveyForm } from "@/components/forms/survey-form";
import { Container, Section, SectionHeader } from "@/components/section";
import { buttonClass } from "@/components/ui/cta";
import { site } from "@/lib/site";
import { waLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Kontak, Jadwal Survei, dan Tanya KPR",
  description:
    "Hubungi Rumah Bali Estate di Denpasar lewat WhatsApp 0838-0899-9944. Jadwalkan survei lokasi rumah inden Sesetan atau tanyakan KPR.",
  alternates: { canonical: "/kontak" },
};

const channels = [
  { icon: WhatsappLogoIcon, label: "WhatsApp", value: site.phoneDisplay, href: waLink("Halo Rumah Bali Estate, saya ingin bertanya."), external: true },
  { icon: PhoneIcon, label: "Telepon", value: site.phoneDisplay, href: `tel:${site.phoneE164}`, external: false },
  { icon: InstagramLogoIcon, label: "Instagram", value: "@rumahbali.estate", href: site.social.instagram, external: true },
  { icon: TiktokLogoIcon, label: "TikTok", value: "@rumahbaliestate", href: site.social.tiktok, external: true },
  { icon: FacebookLogoIcon, label: "Facebook", value: "Rumah Bali Estate", href: site.social.facebook, external: true },
];

export default function KontakPage() {
  return (
    <>
      <Section labelledBy="kontak-title" className="pt-10 md:pt-16">
        <Container className="grid gap-10">
          <SectionHeader
            as="h1"
            id="kontak-title"
            label="Kontak"
            title="Hubungi Rumah Bali Estate"
            description="Jadwalkan survei lokasi atau tanyakan KPR. Kedua form di halaman ini membuka WhatsApp dengan pesan yang sudah terisi."
            cta={{ href: waLink("Halo Rumah Bali Estate, saya ingin bertanya."), label: "Chat WhatsApp", kind: "whatsapp" }}
          />
          <dl className="grid content-start gap-x-10 rounded-panel border border-line bg-surface px-4 sm:px-6 lg:grid-cols-2">
            {channels.map(({ icon: Icon, label, value, href, external }) => (
              <div key={label} className="grid min-h-16 grid-cols-[7rem_minmax(0,1fr)] items-center gap-4 border-b border-line py-2 last:border-b-0">
                <dt className="flex items-center gap-2.5 text-sm font-semibold text-ink">
                  <Icon aria-hidden size={20} className="text-accent" />
                  {label}
                </dt>
                <dd className="min-w-0">
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="inline-flex min-h-11 items-center break-all text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
                  >
                    {value}
                    {external ? <span className="sr-only"> (membuka tab baru)</span> : null}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <Section id="survei" labelledBy="survei-title" className="border-t border-line bg-surface">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionHeader
              id="survei-title"
              label="Survei lokasi"
              title="Jadwalkan survei lokasi"
              description="Pilih tipe dan tanggal. Tanggal yang sudah lewat tidak bisa dipilih. Jadwal final dikonfirmasi lewat WhatsApp."
              cta={{ href: "/simulasi-kpr", label: "Hitung simulasi KPR", variant: "secondary" }}
            />
          </div>
          <div className="lg:col-span-7">
            <SurveyForm />
          </div>
        </Container>
      </Section>

      <Section id="tanya-kpr" labelledBy="tanya-kpr-title">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionHeader
              id="tanya-kpr-title"
              label="KPR"
              title="Tanya KPR"
              description="Isi tipe, rencana DP, dan bila perlu penghasilan per bulan. Data tidak disimpan di server situs ini."
              cta={
                <a href={`tel:${site.phoneE164}`} className={buttonClass("secondary")}>
                  <PhoneIcon aria-hidden size={20} />
                  Telepon {site.phoneDisplay}
                </a>
              }
            />
          </div>
          <div className="lg:col-span-7">
            <KprQuestionForm />
          </div>
        </Container>
      </Section>
    </>
  );
}
