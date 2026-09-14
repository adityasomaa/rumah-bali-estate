"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { BrandMark } from "@/components/brand-mark";
import { scrollStore } from "@/lib/scroll";
import { legalNav, nav } from "@/lib/site";

// Dua loader:
// 1. Loader situs: saat pertama kali membuka situs dan setiap kali menuju Home.
// 2. Kurtain transisi: saat pindah ke halaman lain.
// Urutan: page closes -> content change -> scroll to top -> page opens.
// Setiap langkah menunggu event CSS yang di-race dengan setTimeout, jadi
// sequence tidak pernah nyangkut walau tab di-background (rAF berhenti).

type LoaderState = "initial" | "entering" | "visible" | "leaving" | "done";
type CurtainPhase = "idle" | "closing" | "opening";

type TransitionState = { navigate: (href: string) => void; loaderDone: boolean };

const TransitionContext = createContext<TransitionState>({ navigate: () => {}, loaderDone: true });
export const usePageTransition = () => useContext(TransitionContext);

const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/** Satu frame, tetapi tidak bergantung pada rAF saja. */
function nextFrame() {
  return new Promise<void>((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve();
    };
    requestAnimationFrame(finish);
    window.setTimeout(finish, 80);
  });
}

function waitForTransition(el: HTMLElement | null, timeout: number) {
  return new Promise<void>((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el?.removeEventListener("transitionend", onEnd);
      window.clearTimeout(timer);
      resolve();
    };
    const onEnd = (event: TransitionEvent) => {
      if (event.target === el) finish();
    };
    el?.addEventListener("transitionend", onEnd);
    const timer = window.setTimeout(finish, timeout);
  });
}

function labelFor(pathname: string) {
  const all = [...nav, ...legalNav];
  const exact = all.find((item) => item.href === pathname);
  if (exact) return exact.label;
  if (pathname.startsWith("/listing/")) return "Detail listing";
  return "Rumah Bali Estate";
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loader, setLoader] = useState<LoaderState>("initial");
  const [loaderCycle, setLoaderCycle] = useState(0);
  const [curtain, setCurtain] = useState<{ phase: CurtainPhase; label: string }>({ phase: "idle", label: "" });
  const loaderRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const waiter = useRef<{ path: string; resolve: () => void } | null>(null);

  // Loader pertama kali buka situs.
  useEffect(() => {
    if (performance.now() > 3800) {
      // Failsafe CSS sudah menyembunyikan loader, jangan munculkan lagi.
      setLoader("done");
      return;
    }
    let cancelled = false;
    setLoader("visible");
    scrollStore.lock();
    const fonts = document.fonts ? document.fonts.ready.then(() => undefined).catch(() => undefined) : Promise.resolve();
    Promise.all([Promise.race([fonts, sleep(2000)]), sleep(1300)]).then(async () => {
      if (cancelled) return;
      setLoader("leaving");
      await waitForTransition(loaderRef.current, 900);
      if (cancelled) return;
      setLoader("done");
    });
    return () => {
      cancelled = true;
      scrollStore.unlock();
    };
  }, []);

  useEffect(() => {
    if (loader === "done") document.documentElement.dataset.loaded = "true";
  }, [loader]);

  // Selesaikan langkah "content change" saat route baru sudah dirender.
  useEffect(() => {
    const pending = waiter.current;
    if (pending && pending.path === pathname) {
      waiter.current = null;
      pending.resolve();
    }
  }, [pathname]);

  const navigate = useCallback(
    async (href: string) => {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) {
        window.location.assign(url.href);
        return;
      }

      if (url.pathname === window.location.pathname) {
        if (url.search !== window.location.search) router.replace(`${url.pathname}${url.search}`, { scroll: false });
        const target = url.hash ? document.getElementById(decodeURIComponent(url.hash.slice(1))) : null;
        if (target) {
          window.history.replaceState(window.history.state, "", url.hash);
          scrollStore.toElement(target);
        } else {
          scrollStore.toElement(document.body);
        }
        return;
      }

      if (busy.current) return;
      busy.current = true;
      const toHome = url.pathname === "/";

      try {
        // 1. Page closes
        if (toHome) {
          setLoaderCycle((c) => c + 1);
          setLoader("entering");
          await nextFrame();
          setLoader("visible");
          await waitForTransition(loaderRef.current, 700);
          await sleep(650);
        } else {
          setCurtain({ phase: "closing", label: labelFor(url.pathname) });
          await nextFrame();
          await waitForTransition(curtainRef.current, 950);
        }
        scrollStore.lock();

        // 2. Content change (terjadi saat halaman tertutup)
        await new Promise<void>((resolve) => {
          waiter.current = { path: url.pathname, resolve };
          router.push(`${url.pathname}${url.search}${url.hash}`, { scroll: false });
          window.setTimeout(resolve, 6000);
        });
        waiter.current = null;

        // 3. Scroll to top (atau ke anchor tujuan)
        scrollStore.unlock();
        scrollStore.toTop();
        await nextFrame();
        const target = url.hash ? document.getElementById(decodeURIComponent(url.hash.slice(1))) : null;
        if (target) scrollStore.toElement(target, true);
        await nextFrame();

        // 4. Page opens
        if (toHome) {
          setLoader("leaving");
          await waitForTransition(loaderRef.current, 900);
          setLoader("done");
        } else {
          setCurtain((c) => ({ ...c, phase: "opening" }));
          await waitForTransition(curtainRef.current, 1050);
          setCurtain({ phase: "idle", label: "" });
        }
        document.getElementById("main")?.focus({ preventScroll: true });
      } finally {
        busy.current = false;
      }
    },
    [router],
  );

  return (
    <TransitionContext.Provider value={{ navigate, loaderDone: loader === "done" }}>
      {children}

      <div
        ref={curtainRef}
        aria-hidden="true"
        data-phase={curtain.phase}
        className={[
          "pointer-events-none invisible fixed inset-0 z-(--z-curtain) translate-y-[calc(100%+14vh)] bg-accent-strong",
          "data-[phase=closing]:pointer-events-auto data-[phase=closing]:visible data-[phase=closing]:translate-y-0 data-[phase=closing]:transition-transform data-[phase=closing]:duration-700 data-[phase=closing]:ease-in-out-quart",
          "data-[phase=opening]:visible data-[phase=opening]:-translate-y-full data-[phase=opening]:transition-transform data-[phase=opening]:duration-[850ms] data-[phase=opening]:ease-in-out-quart",
        ].join(" ")}
      >
        <div className="absolute inset-x-0 bottom-full h-[14vh] bg-accent-strong [clip-path:polygon(0_100%,50%_0,100%_100%)]" />
        <div className="grid h-full place-items-center px-6">
          <div className="grid justify-items-center gap-4 text-on-accent">
            <BrandMark tone="current" className="size-12" />
            <p className="text-center text-2xl font-bold tracking-[-0.02em] md:text-3xl">{curtain.label}</p>
          </div>
        </div>
      </div>

      <div
        ref={loaderRef}
        aria-hidden="true"
        data-state={loader}
        className={[
          "site-loader fixed inset-0 z-(--z-curtain) grid place-items-center bg-paper px-6",
          "transition-[opacity,transform] duration-500 ease-out-expo",
          "data-[state=entering]:opacity-0 data-[state=entering]:transition-none",
          "data-[state=leaving]:-translate-y-3 data-[state=leaving]:opacity-0",
          "data-[state=done]:pointer-events-none data-[state=done]:invisible data-[state=done]:opacity-0",
        ].join(" ")}
      >
        <div key={loaderCycle} className="grid justify-items-center gap-5">
          <BrandMark className="loader-mark size-16" />
          <p className="text-xl font-extrabold tracking-[-0.02em] text-ink">Rumah Bali Estate</p>
          <span className="block h-0.5 w-40 overflow-hidden rounded-full bg-line">
            <span className="loader-bar block h-full w-full bg-accent" />
          </span>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
