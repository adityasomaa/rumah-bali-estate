"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { scrollStore } from "@/lib/scroll";

/**
 * Lenis hanya di desktop dengan pointer presisi. Mati di tablet, mobile,
 * dan saat prefers-reduced-motion. Saat menu/modal terbuka, scrollStore.lock()
 * menghentikannya.
 */
export function SmoothScroll() {
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 64rem) and (hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;

    const sync = () => {
      const enable = desktop.matches && !reduce.matches;
      if (enable && !lenis) {
        lenis = new Lenis({ autoRaf: true, lerp: 0.12, smoothWheel: true });
        scrollStore.set(lenis);
      } else if (!enable && lenis) {
        lenis.destroy();
        lenis = null;
        scrollStore.set(null);
      }
    };

    sync();
    desktop.addEventListener("change", sync);
    reduce.addEventListener("change", sync);
    return () => {
      desktop.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
      lenis?.destroy();
      scrollStore.set(null);
    };
  }, []);

  return null;
}
