"use client";

import { PhoneIcon, WhatsappLogoIcon } from "@phosphor-icons/react/ssr";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { isActivePath } from "@/components/layout/site-header";
import { useUi } from "@/components/providers/ui-provider";
import { TLink } from "@/components/t-link";
import { buttonClass } from "@/components/ui/cta";
import { scrollStore } from "@/lib/scroll";
import { nav, site } from "@/lib/site";
import { waLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function MobileMenu() {
  const { menuOpen, setMenuOpen } = useUi();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => setMenuOpen(false), [pathname, setMenuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const shell = document.getElementById("page-shell");
    shell?.setAttribute("inert", "");
    scrollStore.lock();
    panelRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        document.querySelector<HTMLElement>('[aria-controls="mobile-menu"]')?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 48rem)");
    const onResize = () => desktop.matches && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
      shell?.removeAttribute("inert");
      scrollStore.unlock();
    };
  }, [menuOpen, setMenuOpen]);

  return (
    <AnimatePresence>
      {menuOpen ? (
        <motion.nav
          ref={panelRef}
          id="mobile-menu"
          aria-label="Menu utama"
          data-lenis-prevent
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 top-(--header-h) z-(--z-menu) overflow-y-auto bg-paper md:hidden"
        >
          <div className="flex min-h-full flex-col justify-between gap-10 px-4 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-6 sm:px-6">
            <ul className="grid">
              {nav.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href} className="border-b border-line">
                    <TLink
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setMenuOpen(false)}
                      className={cn("flex min-h-16 items-center text-2xl font-bold tracking-[-0.02em]", active ? "text-accent" : "text-ink")}
                    >
                      {item.label}
                    </TLink>
                  </li>
                );
              })}
            </ul>
            <div className="grid gap-3">
              <a
                href={waLink("Halo Rumah Bali Estate, saya ingin bertanya tentang rumah inden di Sesetan.")}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass("primary")}
              >
                <WhatsappLogoIcon aria-hidden size={20} weight="fill" />
                Chat WhatsApp
                <span className="sr-only"> (membuka tab baru)</span>
              </a>
              <a href={`tel:${site.phoneE164}`} className={buttonClass("secondary")}>
                <PhoneIcon aria-hidden size={20} />
                Telepon {site.phoneDisplay}
              </a>
            </div>
          </div>
        </motion.nav>
      ) : null}
    </AnimatePresence>
  );
}
