"use client";

import { useEffect, useRef, useState } from "react";
import { useConsent } from "@/components/providers/consent-provider";
import { usePageTransition } from "@/components/providers/transition-provider";
import { useUi } from "@/components/providers/ui-provider";
import { TLink } from "@/components/t-link";
import { buttonClass } from "@/components/ui/cta";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

export function CookieBanner() {
  const { ready, decided, acceptAll, rejectOptional } = useConsent();
  const { menuOpen, cookieSettingsOpen, setCookieSettingsOpen } = useUi();
  const { loaderDone } = usePageTransition();
  const ref = useRef<HTMLDivElement>(null);
  // Tidak tampil di atas menu mobile, dialog pengaturan, maupun loader.
  const show = ready && !decided && loaderDone && !menuOpen && !cookieSettingsOpen;

  useEffect(() => {
    const root = document.documentElement;
    const el = ref.current;
    if (!show || !el) {
      root.style.setProperty("--cookie-h", "0px");
      return;
    }
    const small = window.matchMedia("(max-width: 47.99rem)");
    const update = () => root.style.setProperty("--cookie-h", small.matches ? `${el.offsetHeight + 12}px` : "0px");
    const ro = new ResizeObserver(update);
    ro.observe(el);
    small.addEventListener("change", update);
    update();
    return () => {
      ro.disconnect();
      small.removeEventListener("change", update);
      root.style.setProperty("--cookie-h", "0px");
    };
  }, [show]);

  return (
    <>
      {show ? (
        <div
          ref={ref}
          role="region"
          aria-labelledby="cookie-banner-title"
          className="fixed inset-x-3 bottom-3 z-(--z-cookie) rounded-panel border border-line bg-surface p-4 shadow-[0_18px_48px_-20px_rgb(18_26_21/0.45)] sm:p-5 md:inset-x-auto md:bottom-6 md:left-6 md:max-w-md"
        >
          <p id="cookie-banner-title" className="font-semibold text-ink">
            Cookie di situs ini
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
            Cookie esensial menyimpan pilihan Anda. Dengan izin, situs juga memuat peta Google Maps dan mengingat isian
            simulasi KPR di perangkat ini.{" "}
            <TLink href="/kebijakan-privasi" className="font-medium text-accent underline">
              Kebijakan Privasi
            </TLink>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={acceptAll} className={cn(buttonClass("primary"), "min-h-11 px-4")}>
              Terima semua
            </button>
            <button type="button" onClick={rejectOptional} className={cn(buttonClass("secondary"), "min-h-11 px-4")}>
              Hanya esensial
            </button>
            <button type="button" onClick={() => setCookieSettingsOpen(true)} className={cn(buttonClass("text"), "px-2")}>
              Atur
            </button>
          </div>
        </div>
      ) : null}
      <CookieSettings open={cookieSettingsOpen} onClose={() => setCookieSettingsOpen(false)} />
    </>
  );
}

function Switch({ id, label, description, checked, disabled, onChange }: { id: string; label: string; description: string; checked: boolean; disabled?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 border-t border-line py-4">
      <div className="grid gap-1">
        <span id={`${id}-label`} className="font-semibold text-ink">
          {label}
        </span>
        <span id={`${id}-desc`} className="text-sm leading-relaxed text-ink-soft">
          {description}
        </span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        aria-describedby={`${id}-desc`}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          "relative mt-0.5 h-7 w-12 shrink-0 rounded-full border transition-colors duration-200 disabled:cursor-not-allowed",
          checked ? "border-accent bg-accent" : "border-line-strong bg-paper",
          disabled && "opacity-70",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "absolute top-1/2 left-0.5 size-5.5 -translate-y-1/2 rounded-full bg-surface shadow transition-transform duration-200 ease-out-expo",
            checked ? "translate-x-5 bg-on-accent" : "translate-x-0 border border-line-strong",
          )}
        />
      </button>
    </div>
  );
}

export function CookieSettings({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { consent, save } = useConsent();
  const [media, setMedia] = useState(consent.media);
  const [preferences, setPreferences] = useState(consent.preferences);

  useEffect(() => {
    if (open) {
      setMedia(consent.media);
      setPreferences(consent.preferences);
    }
  }, [open, consent]);

  return (
    <Modal open={open} onClose={onClose} labelledBy="cookie-settings-title">
      <h2 id="cookie-settings-title" className="type-title text-ink">
        Pengaturan cookie
      </h2>
      <p className="mt-2 mb-4 text-sm leading-relaxed text-ink-soft">Pilihan disimpan di cookie selama 180 hari dan bisa diubah kapan saja dari footer.</p>
      <Switch id="ck-essential" label="Esensial" description="Menyimpan pilihan cookie ini. Selalu aktif." checked disabled />
      <Switch
        id="ck-media"
        label="Peta interaktif"
        description="Memuat Google Maps di halaman listing. Google dapat menyetel cookie sendiri."
        checked={media}
        onChange={setMedia}
      />
      <Switch
        id="ck-pref"
        label="Ingat isian simulasi KPR"
        description="Menyimpan tipe, DP, tenor, dan bunga yang Anda isi di perangkat ini saja."
        checked={preferences}
        onChange={setPreferences}
      />
      <div className="mt-2 flex flex-wrap gap-2 border-t border-line pt-5">
        <button
          type="button"
          className={buttonClass("primary")}
          onClick={() => {
            save({ media, preferences });
            onClose();
          }}
        >
          Simpan pilihan
        </button>
        <button type="button" className={buttonClass("secondary")} onClick={onClose}>
          Batal
        </button>
      </div>
    </Modal>
  );
}
