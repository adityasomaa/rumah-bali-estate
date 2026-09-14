import type { Metadata } from "next";
import { CookieSettingsButton } from "@/components/layout/cookie-settings-button";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Cara situs Rumah Bali Estate memproses data dari form, cookie, dan layanan pihak ketiga.",
  alternates: { canonical: "/kebijakan-privasi" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      id="privasi-title"
      title="Kebijakan Privasi"
      description="Terakhir diperbarui 14 September 2026. Halaman ini menjelaskan data apa yang diproses saat Anda memakai situs ini dan pilihan yang Anda miliki."
      cta={<CookieSettingsButton />}
      sections={[
        {
          title: "Ruang lingkup",
          body: (
            <p>
              Kebijakan ini berlaku untuk situs {site.name}. Dengan memakai situs ini, Anda memahami pemrosesan data yang dijelaskan di
              bawah.
            </p>
          ),
        },
        {
          title: "Data yang Anda berikan lewat form",
          body: (
            <>
              <p>Form jadwal survei dan tanya KPR dapat berisi:</p>
              <ul>
                <li>nama;</li>
                <li>tipe rumah yang diminati, tanggal dan waktu survei, serta catatan;</li>
                <li>rencana DP dan, bila Anda mengisinya, penghasilan per bulan.</li>
              </ul>
              <p>
                <strong>Data form tidak dikirim ke atau disimpan di server situs ini.</strong> Form hanya menyusun pesan dan membuka
                WhatsApp di perangkat Anda. Pesan baru terkirim bila Anda menekan tombol kirim di WhatsApp. Setelah itu pesan diproses
                oleh WhatsApp dan diterima oleh {site.name}.
              </p>
            </>
          ),
        },
        {
          title: "Cookie dan penyimpanan di perangkat",
          body: (
            <ul>
              <li>
                <strong>Esensial.</strong> Cookie <code>rbe_consent</code> menyimpan pilihan cookie Anda selama 180 hari.
              </li>
              <li>
                <strong>Peta interaktif (opsional).</strong> Bila diizinkan, halaman listing memuat Google Maps. Google dapat menyetel
                cookie sendiri sesuai kebijakan Google.
              </li>
              <li>
                <strong>Ingat isian simulasi KPR (opsional).</strong> Bila diizinkan, tipe, DP, tenor, dan suku bunga yang Anda isi
                disimpan di localStorage perangkat Anda dan tidak dikirim ke mana pun. Isian dihapus saat izin dicabut.
              </li>
            </ul>
          ),
        },
        {
          title: "Log teknis dan layanan pihak ketiga",
          body: (
            <p>
              Situs di-hosting oleh Vercel, yang mencatat log akses teknis seperti alamat IP, jenis peramban, dan waktu akses untuk
              keperluan keamanan dan operasional. Tautan ke WhatsApp, Instagram, TikTok, Facebook, dan Google Maps membawa Anda ke
              layanan pihak ketiga yang memiliki kebijakan privasinya sendiri. Situs ini tidak memakai cookie analitik atau iklan.
            </p>
          ),
        },
        {
          title: "Penggunaan data",
          body: (
            <p>
              Pesan yang Anda kirim dipakai untuk menanggapi pertanyaan, menjadwalkan survei, dan memberi informasi terkait listing
              atau pembiayaan. Data tidak dijual kepada pihak lain.
            </p>
          ),
        },
        {
          title: "Hak Anda",
          body: (
            <p>
              Sesuai peraturan yang berlaku, termasuk Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi, Anda dapat
              meminta akses, perbaikan, atau penghapusan data yang pernah Anda kirim dengan menghubungi kami. Pilihan cookie dapat
              diubah kapan saja lewat tombol Pengaturan cookie.
            </p>
          ),
        },
        {
          title: "Perubahan kebijakan",
          body: <p>Kebijakan ini dapat diperbarui. Tanggal pembaruan terakhir selalu tercantum di bagian atas halaman.</p>,
        },
        {
          title: "Kontak",
          body: (
            <p>
              Pertanyaan tentang privasi dapat dikirim lewat WhatsApp atau telepon {site.phoneDisplay}.
            </p>
          ),
        },
      ]}
    />
  );
}
