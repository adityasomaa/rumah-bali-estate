"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type UiState = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  cookieSettingsOpen: boolean;
  setCookieSettingsOpen: (open: boolean) => void;
};

const UiContext = createContext<UiState | null>(null);

export function UiProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cookieSettingsOpen, setCookieSettingsOpen] = useState(false);
  const value = useMemo(
    () => ({ menuOpen, setMenuOpen, cookieSettingsOpen, setCookieSettingsOpen }),
    [menuOpen, cookieSettingsOpen],
  );
  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi harus dipakai di dalam UiProvider");
  return ctx;
}
