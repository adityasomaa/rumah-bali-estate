"use client";

import { CalendarBlankIcon } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";
import { FieldShell, inputClass } from "@/components/ui/number-field";
import { cn } from "@/lib/utils";

const describedBy = (id: string, hint?: ReactNode, error?: string | null) =>
  [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;

type Base = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  hint?: ReactNode;
  error?: string | null;
  className?: string;
};

export function TextField({ autoComplete, maxLength, ...p }: Base & { autoComplete?: string; maxLength?: number }) {
  return (
    <FieldShell id={p.id} label={p.label} required={p.required} hint={p.hint} error={p.error} className={p.className}>
      <input
        id={p.id}
        type="text"
        value={p.value}
        autoComplete={autoComplete}
        maxLength={maxLength}
        aria-invalid={p.error ? true : undefined}
        aria-describedby={describedBy(p.id, p.hint, p.error)}
        aria-required={p.required || undefined}
        onChange={(e) => p.onChange(e.target.value)}
        onBlur={p.onBlur}
        className={inputClass(!!p.error)}
      />
    </FieldShell>
  );
}

export function TextArea({ maxLength, ...p }: Base & { maxLength: number }) {
  return (
    <FieldShell id={p.id} label={p.label} required={p.required} hint={p.hint} error={p.error} className={p.className}>
      <textarea
        id={p.id}
        rows={3}
        value={p.value}
        aria-invalid={p.error ? true : undefined}
        aria-describedby={describedBy(p.id, p.hint, p.error)}
        onChange={(e) => p.onChange(e.target.value)}
        onBlur={p.onBlur}
        className={cn(inputClass(!!p.error), "min-h-28 resize-y py-3 leading-relaxed")}
      />
    </FieldShell>
  );
}

/**
 * Tanggal memakai kalender bawaan platform. Klik di mana saja pada field
 * membuka kalender (showPicker + indikator yang menutupi seluruh field).
 */
export function DateField({ min, max, ...p }: Base & { min?: string; max?: string }) {
  return (
    <FieldShell id={p.id} label={p.label} required={p.required} hint={p.hint} error={p.error} className={p.className}>
      <div className="relative">
        <input
          id={p.id}
          type="date"
          min={min}
          max={max}
          value={p.value}
          aria-invalid={p.error ? true : undefined}
          aria-describedby={describedBy(p.id, p.hint, p.error)}
          aria-required={p.required || undefined}
          onChange={(e) => p.onChange(e.target.value)}
          onBlur={p.onBlur}
          onClick={(e) => {
            try {
              e.currentTarget.showPicker();
            } catch {
              /* browser tanpa showPicker: indikator penuh tetap membuka kalender */
            }
          }}
          className={cn(
            inputClass(!!p.error),
            "num relative block cursor-pointer appearance-none pr-12 text-left",
            "[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0",
            "[&::-webkit-date-and-time-value]:text-left",
          )}
        />
        <CalendarBlankIcon aria-hidden size={20} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink-soft" />
      </div>
    </FieldShell>
  );
}

/** Honeypot: tersembunyi lewat clip, relatif ke form yang `relative`. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="hp-field" aria-hidden="true">
      <label>
        Jangan isi field ini
        <input type="text" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}

export function SubmitStatus({ href }: { href: string | null }) {
  return (
    <div role="status" aria-live="polite" className="min-h-6 text-sm leading-relaxed text-ink">
      {href ? (
        <p className="rounded-control bg-accent-tint px-4 py-3">
          WhatsApp dibuka di tab baru dengan pesan yang sudah terisi. Tekan kirim di WhatsApp untuk mengirim. Kalau tab tidak
          terbuka,{" "}
          <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent-strong underline">
            buka WhatsApp di sini
          </a>
          .
        </p>
      ) : null}
    </div>
  );
}

export function openWhatsApp(url: string) {
  const win = window.open(url, "_blank");
  if (win) win.opener = null;
}

const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u;

export function validateName(raw: string) {
  const name = raw.trim().replace(/\s+/g, " ");
  if (!name) return "Isi nama Anda.";
  if (name.length < 2) return "Nama minimal 2 huruf.";
  if (name.length > 60) return "Nama maksimal 60 karakter.";
  if (!NAME_PATTERN.test(name)) return "Nama hanya boleh berisi huruf, spasi, titik, apostrof, atau tanda hubung.";
  return null;
}
