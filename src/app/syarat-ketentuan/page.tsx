import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Syarat dan Ketentuan",
  description: "Syarat penggunaan situs Rumah Bali Estate, termasuk informasi listing, gambar ilustrasi, dan simulasi KPR.",
  alternates: { canonical: "/syarat-ketentuan" },
};

export default function TermsPage() {
  return (
    <LegalPage
      id="syarat-title"
      title="Syarat dan Ketentuan"
      description="Terakhir diperbarui 14 September 2026. Mohon baca syarat berikut sebelum memakai informasi di situs ini."
      cta={{ href: "/kontak", label: "Hubungi kami", variant: "secondary" }}
      sections={[
        {
          title: "Penerimaan syarat",
          body: <p>Dengan mengakses situs {site.name}, Anda menyetujui syarat dan ketentuan ini.</p>,
        },
        {
          title: "Informasi listing dapat berubah",
          body: (
            <p>
              Harga, spesifikasi, luas, ketersediaan, serta jadwal dan perkiraan selesai pembangunan dapat berubah sewaktu-waktu. Harga
              ditampilkan sesuai tanggal sumber yang tercantum. Semua informasi <strong>wajib dikonfirmasi langsung</strong> kepada{" "}
              {site.name} sebelum Anda mengambil keputusan atau melakukan pembayaran apa pun.
            </p>
          ),
        },
        {
          title: "Gambar adalah ilustrasi",
          body: (
            <p>
              Seluruh gambar di situs ini adalah ilustrasi untuk membantu memahami perbedaan tipe, bukan foto, render final, maupun
              gambar teknis unit. Tampilan, material, dan tata letak bangunan yang sebenarnya dapat berbeda.
            </p>
          ),
        },
        {
          title: "Simulasi KPR hanya ilustrasi",
          body: (
            <p>
              Hasil simulasi KPR adalah perkiraan berdasarkan angka yang Anda isi sendiri, bukan penawaran, persetujuan, atau komitmen
              kredit dari bank mana pun. Suku bunga, biaya, dan syarat pembiayaan ditentukan oleh bank atau lembaga pembiayaan.
            </p>
          ),
        },
        {
          title: "Rumah inden",
          body: (
            <p>
              Rumah inden adalah rumah yang dibangun setelah dipesan. Pastikan Anda membaca perjanjian jual beli, jadwal pembangunan,
              ketentuan pembayaran, dan perkiraan serah terima sebelum membayar.
            </p>
          ),
        },
        {
          title: "Form dan WhatsApp",
          body: (
            <p>
              Mengirim form jadwal survei atau tanya KPR tidak berarti pemesanan atau reservasi unit. Jadwal survei berlaku setelah
              dikonfirmasi oleh {site.name} lewat WhatsApp.
            </p>
          ),
        },
        {
          title: "Tautan pihak ketiga",
          body: (
            <p>
              Situs ini memuat tautan ke layanan pihak ketiga seperti WhatsApp, Google Maps, Instagram, TikTok, dan Facebook. Layanan
              tersebut tunduk pada syarat masing-masing.
            </p>
          ),
        },
        {
          title: "Batasan tanggung jawab",
          body: (
            <p>
              Informasi di situs ini disediakan apa adanya untuk tujuan informasi umum. {site.name} tidak bertanggung jawab atas
              kerugian yang timbul dari penggunaan informasi tanpa konfirmasi langsung.
            </p>
          ),
        },
        {
          title: "Hak atas konten",
          body: <p>Teks, ilustrasi, dan tampilan situs ini tidak boleh disalin untuk kepentingan komersial tanpa izin.</p>,
        },
        {
          title: "Perubahan dan hukum yang berlaku",
          body: (
            <p>
              Syarat ini dapat diperbarui sewaktu-waktu. Syarat ini diatur oleh hukum Republik Indonesia.
            </p>
          ),
        },
      ]}
    />
  );
}
