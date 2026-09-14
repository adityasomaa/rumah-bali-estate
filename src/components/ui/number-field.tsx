"use client";

import { useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { formatThousands } from "@/lib/format";
import { cn } from "@/lib/utils";

type FieldShellProps = {
  id: string;
  label: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string | null;
  children: ReactNode;
  className?: string;
};

export function FieldShell({ id, label, required, hint, error, children, className }: FieldShellProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
        {required ? <span className="font-normal text-ink-soft"> (wajib)</span> : <span className="font-normal text-ink-soft"> (opsional)</span>}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="text-sm text-ink-soft">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const inputClass = (invalid?: boolean) =>
  cn(
    "min-h-12 w-full rounded-control border bg-surface px-4 text-base text-ink transition-colors",
    "hover:border-ink focus-visible:border-accent",
    invalid ? "border-danger" : "border-line-strong",
  );

const describedBy = (id: string, hint?: ReactNode, error?: string | null) =>
  [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;

type RupiahFieldProps = {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  required?: boolean;
  hint?: ReactNode;
  error?: string | null;
  name?: string;
  onBlur?: () => void;
  className?: string;
};

/**
 * Input rupiah: tampil "1.299.000.000", mengirim angka mentah (1299000000).
 * Posisi kursor dijaga berdasarkan jumlah digit di sebelah kanannya.
 */
export function RupiahField({ label, value, onChange, required, hint, error, name, onBlur, className }: RupiahFieldProps) {
  const id = useId();
  const ref = useRef<HTMLInputElement>(null);
  const digitsRight = useRef<number | null>(null);
  const display = value == null ? "" : formatThousands(value);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || digitsRight.current == null || document.activeElement !== el) return;
    let remaining = digitsRight.current;
    let pos = display.length;
    while (pos > 0 && remaining > 0) {
      pos -= 1;
      if (/\d/.test(display[pos])) remaining -= 1;
    }
    el.setSelectionRange(pos, pos);
    digitsRight.current = null;
  }, [display]);

  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error} className={className}>
      <div className="relative">
        <span aria-hidden className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-base text-ink-soft">
          Rp
        </span>
        <input
          ref={ref}
          id={id}
          name={name}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={display}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          aria-required={required || undefined}
          onBlur={onBlur}
          onChange={(event) => {
            const raw = event.target.value;
            const caret = event.target.selectionStart ?? raw.length;
            digitsRight.current = raw.slice(caret).replace(/\D/g, "").length;
            const digits = raw.replace(/\D/g, "").replace(/^0+(?=\d)/, "").slice(0, 15);
            onChange(digits ? Number(digits) : null);
          }}
          className={cn(inputClass(!!error), "num pl-11")}
        />
      </div>
    </FieldShell>
  );
}

type DecimalFieldProps = {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  min: number;
  max: number;
  decimals?: number;
  suffix: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string | null;
  onBlur?: () => void;
  className?: string;
};

/**
 * Angka dengan batas keras: ketikan yang melewati `max` ditolak.
 * Desimal memakai koma (7,5) atau titik (7.5).
 */
export function DecimalField({
  label,
  value,
  onChange,
  min,
  max,
  decimals = 0,
  suffix,
  required,
  hint,
  error,
  onBlur,
  className,
}: DecimalFieldProps) {
  const id = useId();
  const [text, setText] = useState(value == null ? "" : String(value).replace(".", ","));
  const [rejected, setRejected] = useState(false);

  // Sinkron bila nilai berubah dari luar (mis. dipulihkan dari preferensi).
  const lastValue = useRef(value);
  if (value !== lastValue.current) {
    lastValue.current = value;
    const parsed = text === "" ? null : Number(text.replace(",", "."));
    if (parsed !== value) setText(value == null ? "" : String(value).replace(".", ","));
  }

  const pattern = decimals > 0 ? new RegExp(`^\\d{0,3}([.,]\\d{0,${decimals}})?$`) : /^\d{0,3}$/;
  const limitMessage = `Batas ${String(min).replace(".", ",")} sampai ${String(max).replace(".", ",")} ${suffix}.`;

  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      hint={rejected ? limitMessage : hint}
      error={error}
      className={className}
    >
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode={decimals > 0 ? "decimal" : "numeric"}
          autoComplete="off"
          value={text}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, rejected ? limitMessage : hint, error)}
          aria-required={required || undefined}
          onBlur={onBlur}
          onChange={(event) => {
            const next = event.target.value.replace(/\s/g, "");
            if (!pattern.test(next)) return;
            const parsed = next === "" || next === "," || next === "." ? null : Number(next.replace(",", "."));
            if (parsed != null && parsed > max) {
              setRejected(true);
              return;
            }
            setRejected(false);
            setText(next);
            lastValue.current = parsed;
            onChange(parsed);
          }}
          className={cn(inputClass(!!error), "num pr-20")}
        />
        <span aria-hidden className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-base text-ink-soft">
          {suffix}
        </span>
      </div>
    </FieldShell>
  );
}
