const steps = [
  {
    title: "Pilih tipe dan cek harga",
    body: "Bandingkan tipe, luas tanah, dan harga yang tercantum. Catat spesifikasi yang ingin ditanyakan.",
  },
  {
    title: "Survei lokasi",
    body: "Lihat kawasan dan lingkungan sekitar secara langsung sebelum memutuskan.",
  },
  {
    title: "Hitung dan tanyakan pembiayaan",
    body: "Hitung perkiraan cicilan, lalu tanyakan skema pembayaran atau KPR yang tersedia.",
  },
  {
    title: "Periksa perjanjian dan jadwal",
    body: "Baca perjanjian jual beli, jadwal pembangunan, dan perkiraan serah terima sebelum membayar.",
  },
];

/** Nomor dipakai karena urutan langkah memang informasi yang dibutuhkan. */
export function BuyingSteps() {
  return (
    <ol className="relative grid gap-9 md:grid-cols-4 md:gap-6">
      <span aria-hidden className="absolute top-2 bottom-2 left-5 w-0.5 bg-line md:top-5 md:right-6 md:bottom-auto md:left-5 md:h-0.5 md:w-auto" />
      {steps.map((step, index) => (
        <li key={step.title} className="relative grid content-start gap-2 pl-16 md:pt-16 md:pl-0">
          <span
            aria-hidden
            className="num absolute top-0 left-0 grid size-10 place-items-center rounded-full border-2 border-accent bg-paper font-bold text-accent"
          >
            {index + 1}
          </span>
          <h3 className="type-title text-ink">
            <span className="sr-only">Langkah {index + 1}: </span>
            {step.title}
          </h3>
          <p className="leading-relaxed text-ink-soft">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
