import type Lenis from "lenis";

// Satu tempat untuk Lenis + kunci scroll (menu, drawer, modal).
let lenis: Lenis | null = null;
let locks = 0;

export const scrollStore = {
  set(instance: Lenis | null) {
    lenis = instance;
    if (instance && locks > 0) instance.stop();
  },
  get: () => lenis,
  isLocked: () => locks > 0,
  lock() {
    locks += 1;
    if (locks === 1) {
      lenis?.stop();
      document.documentElement.dataset.scrollLock = "true";
    }
  },
  unlock() {
    locks = Math.max(0, locks - 1);
    if (locks === 0) {
      delete document.documentElement.dataset.scrollLock;
      lenis?.start();
    }
  },
  toTop() {
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  },
  toElement(el: HTMLElement, immediate = false) {
    if (lenis) {
      lenis.scrollTo(el, { offset: -88, immediate, force: true });
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: immediate || reduce ? "instant" : "smooth", block: "start" });
  },
};
