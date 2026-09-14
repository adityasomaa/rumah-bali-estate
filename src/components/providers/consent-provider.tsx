"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

// Cookie persetujuan first-party. Dua kategori opsional yang benar-benar
// menggerakkan fitur:
// - media: memuat peta Google Maps (pihak ketiga) di halaman listing.
// - preferences: mengingat isian simulasi KPR di localStorage perangkat ini.

export type Consent = { media: boolean; preferences: boolean };

const COOKIE_NAME = "rbe_consent";
const MAX_AGE = 60 * 60 * 24 * 180;
export const PREFERENCE_KEYS = ["rbe-kpr-v1"];

type ConsentState = {
  ready: boolean;
  decided: boolean;
  consent: Consent;
  save: (next: Consent) => void;
  acceptAll: () => void;
  rejectOptional: () => void;
};

const ConsentContext = createContext<ConsentState | null>(null);

function readCookie(): Consent | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=v1\\.m([01])\\.p([01])`));
  if (!match) return null;
  return { media: match[1] === "1", preferences: match[2] === "1" };
}

function writeCookie(consent: Consent) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=v1.m${consent.media ? 1 : 0}.p${consent.preferences ? 1 : 0}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [decided, setDecided] = useState(false);
  const [consent, setConsent] = useState<Consent>({ media: false, preferences: false });

  useEffect(() => {
    const stored = readCookie();
    if (stored) {
      setConsent(stored);
      setDecided(true);
    }
    setReady(true);
  }, []);

  const save = useCallback((next: Consent) => {
    writeCookie(next);
    if (!next.preferences) {
      try {
        PREFERENCE_KEYS.forEach((key) => window.localStorage.removeItem(key));
      } catch {
        /* storage tidak tersedia */
      }
    }
    setConsent(next);
    setDecided(true);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      decided,
      consent,
      save,
      acceptAll: () => save({ media: true, preferences: true }),
      rejectOptional: () => save({ media: false, preferences: false }),
    }),
    [ready, decided, consent, save],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent harus dipakai di dalam ConsentProvider");
  return ctx;
}
