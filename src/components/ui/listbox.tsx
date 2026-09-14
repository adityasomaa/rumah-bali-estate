"use client";

// Dropdown kustom dengan pola ARIA listbox (WAI-ARIA APG, collapsible listbox):
// tombol pemicu + <ul role="listbox"> yang menerima fokus saat terbuka.
// Keyboard: ↑/↓, Home/End, type-ahead, Enter/Space memilih, Escape/Tab menutup,
// fokus selalu kembali ke tombol pemicu.

import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react/ssr";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

export type ListboxOption = { value: string; label: string; hint?: string };

type ListboxProps = {
  label: string;
  options: ListboxOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  name?: string;
  required?: boolean;
  error?: string | null;
  hint?: string;
  className?: string;
  onBlur?: () => void;
};

export function Listbox({
  label,
  options,
  value,
  onChange,
  placeholder = "Pilih salah satu",
  name,
  required,
  error,
  hint,
  className,
  onBlur,
}: ListboxProps) {
  const uid = useId();
  const labelId = `${uid}-label`;
  const triggerId = `${uid}-trigger`;
  const listId = `${uid}-list`;
  const hintId = `${uid}-hint`;
  const errorId = `${uid}-error`;
  const optionId = (i: number) => `${uid}-opt-${i}`;

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ buffer: "", timer: 0 });

  const selectedIndex = options.findIndex((o) => o.value === value);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(Math.max(0, selectedIndex));

  const openList = useCallback(
    (focusIndex?: number) => {
      setActive(focusIndex ?? Math.max(0, selectedIndex));
      setOpen(true);
    },
    [selectedIndex],
  );

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  const select = (index: number) => {
    const option = options[index];
    if (option) onChange(option.value);
    close(true);
  };

  useEffect(() => {
    if (!open) return;
    listRef.current?.focus({ preventScroll: true });
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    document.getElementById(optionId(active))?.scrollIntoView({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, open]);

  const findByTypeahead = (char: string, from: number) => {
    const t = typeahead.current;
    window.clearTimeout(t.timer);
    t.buffer = (t.buffer + char).toLowerCase();
    t.timer = window.setTimeout(() => (t.buffer = ""), 500);
    const isRepeat = t.buffer.split("").every((c) => c === t.buffer[0]);
    const query = isRepeat ? t.buffer[0] : t.buffer;
    const start = isRepeat ? from + 1 : from;
    for (let i = 0; i < options.length; i++) {
      const idx = (start + i) % options.length;
      if (options[idx].label.toLowerCase().startsWith(query)) return idx;
    }
    return -1;
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case "ArrowDown":
      case "Enter":
      case " ":
        event.preventDefault();
        openList();
        break;
      case "ArrowUp":
        event.preventDefault();
        openList(selectedIndex >= 0 ? selectedIndex : options.length - 1);
        break;
      case "Home":
        event.preventDefault();
        openList(0);
        break;
      case "End":
        event.preventDefault();
        openList(options.length - 1);
        break;
      default:
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          const idx = findByTypeahead(event.key, Math.max(0, selectedIndex));
          if (idx >= 0) openList(idx);
        }
    }
  };

  const onListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActive((i) => Math.min(options.length - 1, i + 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActive((i) => Math.max(0, i - 1));
        break;
      case "Home":
        event.preventDefault();
        setActive(0);
        break;
      case "End":
        event.preventDefault();
        setActive(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        select(active);
        break;
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        close(true);
        break;
      case "Tab":
        event.preventDefault();
        close(true);
        break;
      default:
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          const idx = findByTypeahead(event.key, active);
          if (idx >= 0) setActive(idx);
        }
    }
  };

  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

  return (
    <div ref={rootRef} className={cn("relative grid gap-2", className)}>
      <span id={labelId} className="text-sm font-semibold text-ink">
        {label}
        {required ? <span className="font-normal text-ink-soft"> (wajib)</span> : null}
      </span>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${labelId} ${triggerId}`}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        onClick={() => (open ? close(true) : openList())}
        onKeyDown={onTriggerKeyDown}
        onBlur={() => !open && onBlur?.()}
        className={cn(
          "flex min-h-12 w-full items-center justify-between gap-3 rounded-control border bg-surface px-4 text-left text-base transition-colors",
          "hover:border-ink focus-visible:border-accent",
          error ? "border-danger" : "border-line-strong",
        )}
      >
        <span className={cn("truncate", selected ? "text-ink" : "text-ink-soft")}>
          {selected ? selected.label : placeholder}
        </span>
        <CaretDownIcon
          aria-hidden
          size={18}
          weight="bold"
          className={cn("shrink-0 text-ink-soft transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
      <ul
        ref={listRef}
        id={listId}
        role="listbox"
        tabIndex={-1}
        hidden={!open}
        aria-labelledby={labelId}
        aria-activedescendant={open ? optionId(active) : undefined}
        onKeyDown={onListKeyDown}
        data-lenis-prevent
        className="absolute inset-x-0 top-full z-(--z-dropdown) mt-1 max-h-72 overflow-y-auto rounded-control border border-line-strong bg-surface p-1 shadow-[0_12px_32px_-12px_rgb(18_26_21/0.28)] outline-none"
      >
        {options.map((option, index) => {
          const isSelected = option.value === value;
          return (
            <li
              key={option.value}
              id={optionId(index)}
              role="option"
              aria-selected={isSelected}
              onPointerMove={() => setActive(index)}
              onClick={() => select(index)}
              className={cn(
                "flex cursor-pointer items-center justify-between gap-3 rounded-[calc(var(--radius-control)-2px)] px-3 py-2.5 text-base",
                index === active ? "bg-accent-tint text-ink" : "text-ink",
              )}
            >
              <span className="grid">
                <span className={cn(isSelected && "font-semibold")}>{option.label}</span>
                {option.hint ? <span className="text-sm text-ink-soft">{option.hint}</span> : null}
              </span>
              {isSelected ? <CheckIcon aria-hidden size={18} weight="bold" className="shrink-0 text-accent" /> : null}
            </li>
          );
        })}
      </ul>
      {hint ? (
        <p id={hintId} className="text-sm text-ink-soft">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
