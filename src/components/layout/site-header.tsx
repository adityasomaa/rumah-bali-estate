"use client";

import { ListIcon, XIcon } from "@phosphor-icons/react/ssr";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { useUi } from "@/components/providers/ui-provider";
import { TLink } from "@/components/t-link";
import { Container } from "@/components/section";
import { nav } from "@/lib/site";
import { cn } from "@/lib/utils";

export function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const { menuOpen, setMenuOpen } = useUi();

  return (
    <header className="sticky top-0 z-(--z-header) h-(--header-h) border-b border-line bg-paper">
      <Container className="flex h-full items-center justify-between gap-6">
        <TLink href="/" className="flex shrink-0 items-center gap-2.5 rounded-control text-ink" onClick={() => setMenuOpen(false)}>
          <BrandMark className="size-8" />
          <span className="text-[1.0625rem] font-extrabold tracking-[-0.025em]">Rumah Bali Estate</span>
        </TLink>

        <nav aria-label="Menu utama" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li key={item.href}>
                  <TLink
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex min-h-11 items-center rounded-control px-3.5 text-[0.9375rem] font-medium transition-colors",
                      active ? "text-ink" : "text-ink-soft hover:text-ink",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-x-3.5 bottom-1.5 h-0.5 origin-left bg-accent transition-transform duration-300 ease-out-expo",
                        active ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </TLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          className="-mr-2 grid size-11 place-items-center rounded-control text-ink md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <XIcon aria-hidden size={26} /> : <ListIcon aria-hidden size={26} />}
          <span className="sr-only">{menuOpen ? "Tutup menu" : "Buka menu"}</span>
        </button>
      </Container>
    </header>
  );
}
