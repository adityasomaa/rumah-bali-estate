"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useConsent } from "@/components/providers/consent-provider";
import { CtaLink } from "@/components/ui/cta";
import { Listbox } from "@/components/ui/listbox";
import { DecimalField, RupiahField } from "@/components/ui/number-field";
import { findTypeOption, typeOptions } from "@/data/options";
import { formatRupiah } from "@/lib/format";
import { calculateKpr } from "@/lib/kpr";
import { cn } from "@/lib/utils";

type DpMode = "percent" | "rupiah";
const STORAGE_KEY = "rbe-kpr-v1";
const pct = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 });

export function KprSimulator() {
  const { consent, ready } = useConsent();
  const [typeValue, setTypeValue] = useState<string | null>(null);
  const [mode, setMode] = useState<DpMode>("percent");
  const [dpPercent, setDpPercent] = useState<number | null>(null);
  const [dpRupiah, setDpRupiah] = useState<number | null>(null);
  const [years, setYears] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [interacted, setInteracted] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const restored = useRef(false);

  // Pulihkan isian hanya bila pengunjung mengizinkan cookie preferensi.
  useEffect(() => {
    if (!ready || restored.current) return;
    restored.current = true;
    const queryType = findTypeOption(new URLSearchParams(window.location.search).get("tipe"));
    if (consent.preferences) {
      try {
        const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
        if (saved && typeof saved === "object") {
          if (findTypeOption(saved.typeValue)) setTypeValue(saved.typeValue);
          if (saved.mode === "percent" || saved.mode === "rupiah") setMode(saved.mode);
          if (typeof saved.dpPercent === "number") setDpPercent(saved.dpPercent);
          if (typeof saved.dpRupiah === "number") setDpRupiah(saved.dpRupiah);
          if (typeof saved.years === "number") setYears(saved.years);
          if (typeof saved.rate === "number") setRate(saved.rate);
        }
      } catch {
        /* storage tidak tersedia atau rusak */
      }
    }
    if (queryType) setTypeValue(queryType.value);
  }, [ready, consent.preferences]);

  useEffect(() => {
    if (!restored.current || !consent.preferences) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ typeValue, mode, dpPercent, dpRupiah, years, rate }));
    } catch {
      /* abaikan */
    }
  }, [consent.preferences, typeValue, mode, dpPercent, dpRupiah, years, rate]);

  const option = findTypeOption(typeValue);
  const price = option?.type.price ?? null;
  const downPayment =
    mode === "percent" ? (price != null && dpPercent != null ? Math.round((price * dpPercent) / 100) : null) : dpRupiah;

  const dpError =
    mode === "rupiah" && price != null && dpRupiah != null && dpRupiah > price ? "DP tidak boleh melebihi harga rumah." : null;
  const yearsError = years != null && years < 1 ? "Tenor minimal 1 tahun." : null;

  const missing = [
    !option && "tipe rumah",
    downPayment == null && "DP",
    years == null && "tenor",
    rate == null && "bunga",
  ].filter(Boolean) as string[];

  const result = useMemo(() => {
    if (missing.length || dpError || yearsError || price == null || downPayment == null || years == null || rate == null) return null;
    return calculateKpr({ price, downPayment, years, annualRatePercent: rate });
  }, [missing.length, dpError, yearsError, price, downPayment, years, rate]);

  const noLoan = !missing.length && !dpError && price != null && downPayment != null && downPayment >= price;

  const summary = result
    ? `Perkiraan angsuran ${formatRupiah(result.monthlyPayment)} per bulan selama ${result.months} bulan, untuk pinjaman ${formatRupiah(result.principal)}.`
    : noLoan
      ? "DP sama dengan harga rumah, tidak ada pinjaman yang perlu dihitung."
      : dpError || yearsError
        ? "Perbaiki isian yang ditandai untuk melihat hasil."
        : `Hasil muncul setelah semua terisi. Belum diisi: ${missing.join(", ")}.`;

  // Umumkan hasil lewat aria-live, ditunda agar tidak berbunyi di setiap ketikan.
  useEffect(() => {
    if (!interacted) return;
    const t = window.setTimeout(() => setAnnouncement(summary), 700);
    return () => window.clearTimeout(t);
  }, [summary, interacted]);

  const touch = () => setInteracted(true);

  const kprHref = option
    ? `/kontak?tipe=${encodeURIComponent(option.value)}${downPayment ? `&dp=${downPayment}` : ""}#tanya-kpr`
    : "/kontak#tanya-kpr";

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-10">
      <div className="grid gap-6 rounded-panel border border-line bg-surface p-5 sm:p-8 lg:col-span-7" onInput={touch}>
        <Listbox
          label="Tipe rumah"
          required
          options={typeOptions.map((o) => ({ value: o.value, label: o.label, hint: o.hint }))}
          value={typeValue}
          onChange={(v) => {
            setTypeValue(v);
            touch();
          }}
          placeholder="Pilih tipe"
        />

        <div className="grid gap-2">
          <p id="kpr-price-label" className="text-sm font-semibold text-ink">
            Harga rumah
          </p>
          <output aria-labelledby="kpr-price-label" className="num flex min-h-12 items-center rounded-control bg-paper px-4 text-base text-ink">
            {price != null ? (
              <span className="font-semibold">{formatRupiah(price)}</span>
            ) : (
              <span className="text-ink-soft">Terisi otomatis setelah tipe dipilih</span>
            )}
          </output>
        </div>

        <fieldset className="grid gap-3">
          <legend className="mb-2 text-sm font-semibold text-ink">Cara mengisi DP</legend>
          <div className="inline-grid w-full grid-cols-2 rounded-control border border-line-strong bg-paper p-1 sm:w-auto sm:justify-self-start">
            {(["percent", "rupiah"] as const).map((m) => (
              <label key={m} className="relative">
                <input
                  type="radio"
                  name="dp-mode"
                  value={m}
                  checked={mode === m}
                  onChange={() => {
                    setMode(m);
                    touch();
                  }}
                  className="peer sr-only"
                />
                <span className="flex min-h-10 cursor-pointer items-center justify-center rounded-[calc(var(--radius-control)-2px)] px-5 text-sm font-semibold text-ink-soft transition-colors peer-checked:bg-accent peer-checked:text-on-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                  {m === "percent" ? "Persen" : "Rupiah"}
                </span>
              </label>
            ))}
          </div>
          {mode === "percent" ? (
            <DecimalField
              label="DP"
              required
              value={dpPercent}
              onChange={setDpPercent}
              min={0}
              max={100}
              decimals={2}
              suffix="%"
              hint={price != null && dpPercent != null ? `Setara ${formatRupiah((price * dpPercent) / 100)}` : "0 sampai 100 persen dari harga."}
            />
          ) : (
            <RupiahField
              label="DP"
              required
              value={dpRupiah}
              onChange={(v) => {
                setDpRupiah(v);
                touch();
              }}
              hint={price != null && dpRupiah != null && !dpError ? `Setara ${pct.format((dpRupiah / price) * 100)}% dari harga` : "Nominal uang muka."}
              error={dpError}
            />
          )}
        </fieldset>

        <div className="grid gap-6 sm:grid-cols-2">
          <DecimalField label="Tenor" required value={years} onChange={setYears} min={1} max={30} suffix="tahun" hint="1 sampai 30 tahun." error={yearsError} />
          <DecimalField
            label="Suku bunga"
            required
            value={rate}
            onChange={setRate}
            min={0}
            max={100}
            decimals={2}
            suffix="% / tahun"
            hint="Isi sesuai penawaran bank yang Anda terima."
          />
        </div>
      </div>

      <section aria-labelledby="kpr-result-title" className="grid gap-5 rounded-panel bg-accent-tint p-5 sm:p-8 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:col-span-5">
        <h2 id="kpr-result-title" className="type-title text-ink">
          Hasil simulasi
        </h2>
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement}
        </p>

        {result ? (
          <div className="grid gap-5" data-testid="kpr-result">
            <div className="grid gap-1">
              <p className="text-sm text-ink-soft">Perkiraan angsuran per bulan</p>
              <p className="num text-[2rem] leading-tight font-bold tracking-[-0.03em] text-ink md:text-[2.5rem]" data-testid="kpr-monthly">
                {formatRupiah(result.monthlyPayment)}
              </p>
            </div>
            <dl className="grid gap-0 text-sm">
              {[
                ["Harga rumah", formatRupiah(price!)],
                ["DP", `${formatRupiah(downPayment!)} (${pct.format((downPayment! / price!) * 100)}%)`],
                ["Pokok pinjaman", formatRupiah(result.principal)],
                ["Tenor", `${result.months} bulan`],
                ["Suku bunga", `${pct.format(rate!)}% per tahun, tetap`],
                ["Total bunga", formatRupiah(result.totalInterest)],
                ["Total pembayaran", formatRupiah(result.totalPayment)],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-accent/20 py-2.5 last:border-b-0">
                  <dt className="text-ink-soft">{label}</dt>
                  <dd className="num text-right font-semibold text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : (
          <p className={cn("rounded-control bg-surface px-4 py-4 leading-relaxed", dpError || yearsError ? "text-danger" : "text-ink-soft")} data-testid="kpr-empty">
            {summary}
          </p>
        )}

        <p className="rounded-control border border-accent/30 bg-surface px-4 py-3 text-sm leading-relaxed text-ink">
          <strong className="font-semibold">Simulasi, bukan penawaran bank.</strong> Dihitung dengan bunga tetap sepanjang tenor, belum
          termasuk biaya provisi, asuransi, notaris, dan pajak. Angka final ditentukan oleh bank.
        </p>
        <CtaLink cta={{ href: kprHref, label: "Tanya KPR via WhatsApp", icon: "whatsapp" }} className="w-full sm:w-auto sm:justify-self-start" />
      </section>
    </div>
  );
}
