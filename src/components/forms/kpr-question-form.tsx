"use client";

import { WhatsappLogoIcon } from "@phosphor-icons/react/ssr";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Honeypot, openWhatsApp, SubmitStatus, TextField, validateName } from "@/components/forms/fields";
import { buttonClass } from "@/components/ui/cta";
import { Listbox } from "@/components/ui/listbox";
import { RupiahField } from "@/components/ui/number-field";
import { findTypeOption, typeOptions } from "@/data/options";
import { formatRupiah } from "@/lib/format";
import { buildMessage, cleanText, waLink } from "@/lib/whatsapp";

type Field = "name" | "type" | "downPayment" | "income";
type Errors = Partial<Record<Field, string | null>>;

const percent = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 });

export function KprQuestionForm() {
  const [name, setName] = useState("");
  const [type, setType] = useState<string | null>(null);
  const [downPayment, setDownPayment] = useState<number | null>(null);
  const [income, setIncome] = useState<number | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sentHref, setSentHref] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const focusError = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const preset = findTypeOption(params.get("tipe"));
    if (preset) setType(preset.value);
    const dp = Number(params.get("dp"));
    if (Number.isFinite(dp) && dp > 0 && dp < 1e15) setDownPayment(Math.round(dp));
  }, []);

  useEffect(() => {
    if (!focusError.current) return;
    focusError.current = false;
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [errors]);

  const option = findTypeOption(type);

  const validators: Record<Field, () => string | null> = {
    name: () => validateName(name),
    type: () => (option ? null : "Pilih tipe rumah."),
    downPayment: () => {
      if (downPayment == null) return "Isi rencana DP.";
      if (downPayment <= 0) return "DP harus lebih dari 0.";
      if (option && downPayment >= option.type.price) return `Rencana DP harus lebih kecil dari harga tipe (${formatRupiah(option.type.price)}).`;
      return null;
    },
    income: () => (income != null && income <= 0 ? "Kosongkan, atau isi angka lebih dari 0." : null),
  };

  const check = (field: Field) => setErrors((e) => ({ ...e, [field]: validators[field]() }));

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const next: Errors = {
      name: validators.name(),
      type: validators.type(),
      downPayment: validators.downPayment(),
      income: validators.income(),
    };
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
    const selected = option!;
    const message = buildMessage("Halo Rumah Bali Estate, saya ingin bertanya tentang KPR.", [
      ["Nama", cleanText(name, 60)],
      ["Listing", selected.listing.title],
      ["Tipe", `${selected.type.name} (${formatRupiah(selected.type.price)})`],
      ["Rencana DP", `${formatRupiah(downPayment!)} (${percent.format((downPayment! / selected.type.price) * 100)}% dari harga)`],
      ["Penghasilan per bulan", income != null ? formatRupiah(income) : null],
    ]);
    const href = waLink(message);
    openWhatsApp(href);
    setSentHref(href);
  };

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="relative grid gap-5 rounded-panel border border-line bg-surface p-5 sm:p-8" aria-label="Form tanya KPR">
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <div className="grid gap-5 md:grid-cols-2">
        <TextField id="kpr-name" label="Nama" required autoComplete="name" maxLength={60} value={name} onChange={setName} onBlur={() => check("name")} error={errors.name} />
        <Listbox
          label="Tipe yang diminati"
          required
          options={typeOptions.map((o) => ({ value: o.value, label: o.label, hint: o.hint }))}
          value={type}
          onChange={(v) => {
            setType(v);
            setErrors((e) => ({ ...e, type: null, downPayment: downPayment != null ? null : e.downPayment }));
          }}
          placeholder="Pilih tipe"
          error={errors.type}
        />
        <RupiahField
          label="Rencana DP"
          required
          value={downPayment}
          onChange={(v) => {
            setDownPayment(v);
            if (errors.downPayment) setErrors((e) => ({ ...e, downPayment: null }));
          }}
          onBlur={() => check("downPayment")}
          hint={option && downPayment ? `${percent.format((downPayment / option.type.price) * 100)}% dari harga ${option.type.name}` : "Nominal uang muka yang direncanakan."}
          error={errors.downPayment}
        />
        <RupiahField
          label="Penghasilan per bulan"
          value={income}
          onChange={setIncome}
          onBlur={() => check("income")}
          hint="Opsional. Membantu menjawab pertanyaan KPR Anda."
          error={errors.income}
        />
      </div>
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
