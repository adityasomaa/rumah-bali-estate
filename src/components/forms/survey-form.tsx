"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { DateField, Honeypot, openWhatsApp, SubmitStatus, TextArea, TextField, validateName } from "@/components/forms/fields";
import { buttonClass } from "@/components/ui/cta";
import { Listbox } from "@/components/ui/listbox";
import { findTypeOption, typeOptions } from "@/data/options";
import { addDays, formatDate, formatRupiah, isValidIsoDate, todayInBali } from "@/lib/format";
import { buildMessage, cleanText, waLink } from "@/lib/whatsapp";
import { WhatsappLogoIcon } from "@phosphor-icons/react/ssr";

type Field = "name" | "type" | "date" | "note";
type Errors = Partial<Record<Field, string | null>>;

const timeOptions = [
  { value: "pagi", label: "Pagi" },
  { value: "siang", label: "Siang" },
  { value: "sore", label: "Sore" },
];

export function SurveyForm({ idPrefix = "survei" }: { idPrefix?: string }) {
  const [name, setName] = useState("");
  const [type, setType] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [today, setToday] = useState<string | null>(null);
  const [sentHref, setSentHref] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const focusError = useRef(false);

  // Tanggal dihitung di browser (zona WITA), bukan saat build.
  useEffect(() => {
    setToday(todayInBali());
    const preset = findTypeOption(new URLSearchParams(window.location.search).get("tipe"));
    if (preset) setType(preset.value);
  }, []);

  useEffect(() => {
    if (!focusError.current) return;
    focusError.current = false;
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [errors]);

  const maxDate = today ? addDays(today, 365) : undefined;

  const validators: Record<Field, () => string | null> = {
    name: () => validateName(name),
    type: () => (findTypeOption(type) ? null : "Pilih tipe rumah yang ingin disurvei."),
    date: () => {
      if (!date) return "Pilih tanggal survei.";
      if (!isValidIsoDate(date)) return "Format tanggal tidak valid.";
      const now = today ?? todayInBali();
      if (date < now) return "Tanggal sudah lewat. Pilih hari ini atau tanggal setelahnya.";
      if (date > addDays(now, 365)) return "Pilih tanggal dalam 12 bulan ke depan.";
      return null;
    },
    note: () => (note.length > 300 ? "Catatan maksimal 300 karakter." : null),
  };

  const check = (field: Field) => setErrors((e) => ({ ...e, [field]: validators[field]() }));

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const next: Errors = { name: validators.name(), type: validators.type(), date: validators.date(), note: validators.note() };
    setErrors(next);
    if (Object.values(next).some(Boolean)) {
      focusError.current = true;
      setSentHref(null);
      return;
    }
    if (honeypot) {
      setSentHref(waLink());
      return;
    }
    const option = findTypeOption(type)!;
    const message = buildMessage("Halo Rumah Bali Estate, saya ingin menjadwalkan survei lokasi.", [
      ["Nama", cleanText(name, 60)],
      ["Listing", option.listing.title],
      ["Tipe", `${option.type.name} (${formatRupiah(option.type.price)})`],
      ["Tanggal survei", formatDate(date, true)],
      ["Waktu", timeOptions.find((t) => t.value === time)?.label],
      ["Catatan", cleanText(note, 300)],
    ]);
    const href = waLink(message);
    openWhatsApp(href);
    setSentHref(href);
  };

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="relative grid gap-5 rounded-panel border border-line bg-surface p-5 sm:p-8" aria-label="Form jadwalkan survei lokasi">
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <div className="grid gap-5 md:grid-cols-2">
        <TextField id={`${idPrefix}-name`} label="Nama" required autoComplete="name" maxLength={60} value={name} onChange={setName} onBlur={() => check("name")} error={errors.name} />
        <Listbox
          label="Tipe yang diminati"
          required
          options={typeOptions.map((o) => ({ value: o.value, label: o.label, hint: o.hint }))}
          value={type}
          onChange={(v) => {
            setType(v);
            setErrors((e) => ({ ...e, type: null }));
          }}
          placeholder="Pilih tipe"
          error={errors.type}
        />
        <DateField
          id={`${idPrefix}-date`}
          label="Tanggal survei"
          required
          min={today ?? undefined}
          max={maxDate}
          value={date}
          onChange={(v) => {
            setDate(v);
            if (errors.date) setErrors((e) => ({ ...e, date: null }));
          }}
          onBlur={() => date && check("date")}
          hint={date && isValidIsoDate(date) && !errors.date ? formatDate(date, true) : "Hari ini atau tanggal setelahnya."}
          error={errors.date}
        />
        <Listbox label="Waktu yang diinginkan" options={timeOptions} value={time} onChange={setTime} placeholder="Bebas" hint="Opsional. Jadwal final dikonfirmasi lewat WhatsApp." />
      </div>
      <TextArea
        id={`${idPrefix}-note`}
        label="Catatan"
        maxLength={300}
        value={note}
        onChange={(v) => setNote(v.slice(0, 320))}
        onBlur={() => check("note")}
        hint={`${note.length}/300 karakter`}
        error={errors.note}
      />
      <div className="grid gap-4">
        <button type="submit" className={`${buttonClass("primary")} w-full sm:w-auto sm:justify-self-start`}>
          <WhatsappLogoIcon aria-hidden size={20} weight="fill" />
          Kirim lewat WhatsApp
        </button>
        <SubmitStatus href={sentHref} />
      </div>
    </form>
  );
}
