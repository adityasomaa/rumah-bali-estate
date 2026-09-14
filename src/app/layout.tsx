import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/json-ld";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { ConsentProvider } from "@/components/providers/consent-provider";
import { TransitionProvider } from "@/components/providers/transition-provider";
import { UiProvider } from "@/components/providers/ui-provider";
import { SmoothScroll } from "@/components/smooth-scroll";
import { SITE_URL, site } from "@/lib/site";
import { organizationJsonLd } from "@/lib/structured-data";
import "./globals.css";

// Plus Jakarta Sans (Tokotype, SIL OFL 1.1), di-self-host sebagai WOFF2 variable.
const jakarta = localFont({
  src: "../fonts/PlusJakartaSans-Variable-latin.woff2",
  variable: "--font-jakarta",
  weight: "200 800",
  style: "normal",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f2f5f1",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Rumah Bali Estate | Rumah Dijual di Denpasar", template: "%s | Rumah Bali Estate" },
  description:
    "Rumah Bali Estate, Denpasar. Informasi rumah dijual dan rumah inden, simulasi KPR, serta jadwal survei lokasi lewat WhatsApp.",
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: site.name,
    url: SITE_URL,
    images: [{ url: "/og.png", width: 1200, height: 675, alt: "Rumah Bali Estate, Solusi Rumah Idaman Anda" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={jakarta.variable}>
      <body>
        <a
          href="#main"
          className="sr-only rounded-control bg-ink px-4 py-3 font-semibold text-on-accent focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-(--z-skip)"
        >
          Langsung ke konten
        </a>
        <UiProvider>
          <ConsentProvider>
            <TransitionProvider>
              <SmoothScroll />
              <div id="app-shell">
                <SiteHeader />
                <MobileMenu />
                <div id="page-shell">
                  <main id="main" tabIndex={-1} className="outline-none">
                    {children}
                  </main>
                  <SiteFooter />
                </div>
                <WhatsAppFab />
              </div>
              <CookieBanner />
            </TransitionProvider>
          </ConsentProvider>
        </UiProvider>
        <JsonLd data={organizationJsonLd()} />
        <noscript>
          <style>{`.site-loader{display:none!important}.kt-seg{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
      </body>
    </html>
  );
}
