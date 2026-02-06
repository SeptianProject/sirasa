import Navigation from "@/components/Navigation";
import Footer from "@/components/landing/Footer";

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-primary mb-8">Panduan SIRASA</h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Cara Menggunakan SIRASA
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-6">
              Ikuti panduan langkah demi langkah ini untuk mulai berkontribusi
              dalam mengurangi sampah makanan dan mendapatkan reward dari setiap
              kontribusi Anda.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Untuk Pengguna Umum
            </h2>

            <div className="space-y-6">
              <div className="bg-primary/5 p-6 rounded-lg border-l-4 border-primary">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  1. Daftar Akun
                </h3>
                <ul className="space-y-2 text-foreground/80">
                  <li>• Klik tombol "Daftar" di halaman utama</li>
                  <li>• Isi form registrasi dengan data yang valid</li>
                  <li>• Verifikasi email Anda</li>
                  <li>• Login dengan akun yang telah dibuat</li>
                </ul>
              </div>

              <div className="bg-primary/5 p-6 rounded-lg border-l-4 border-primary">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  2. Cari Bank Sampah Terdekat
                </h3>
                <ul className="space-y-2 text-foreground/80">
                  <li>• Buka menu "Bank Sampah" di dashboard</li>
                  <li>• Lihat daftar bank sampah yang tersedia</li>
                  <li>• Periksa lokasi dan jam operasional</li>
                  <li>• Pilih bank sampah yang paling sesuai</li>
                </ul>
              </div>

              <div className="bg-primary/5 p-6 rounded-lg border-l-4 border-primary">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  3. Setor Sampah Organik
                </h3>
                <ul className="space-y-2 text-foreground/80">
                  <li>• Kumpulkan sampah makanan organik Anda</li>
                  <li>• Pisahkan dari sampah non-organik</li>
                  <li>• Bawa ke bank sampah pilihan Anda</li>
                  <li>• Timbang dan dapatkan konfirmasi</li>
                </ul>
              </div>

              <div className="bg-primary/5 p-6 rounded-lg border-l-4 border-primary">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  4. Kumpulkan Poin & Reward
                </h3>
                <ul className="space-y-2 text-foreground/80">
                  <li>• Dapatkan poin dari setiap setoran sampah</li>
                  <li>• Monitor poin di dashboard Anda</li>
                  <li>• Tukar poin dengan reward menarik</li>
                  <li>• Lihat riwayat transaksi Anda</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Untuk Admin Bank Sampah
            </h2>

            <div className="space-y-6">
              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  1. Registrasi Bank Sampah
                </h3>
                <ul className="space-y-2 text-foreground/80">
                  <li>• Daftar sebagai admin bank sampah</li>
                  <li>• Lengkapi profil bank sampah</li>
                  <li>• Tunggu verifikasi dari Super Admin</li>
                  <li>• Mulai operasional setelah disetujui</li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  2. Kelola Penerimaan Sampah
                </h3>
                <ul className="space-y-2 text-foreground/80">
                  <li>• Terima setoran dari pengguna</li>
                  <li>• Input data di sistem</li>
                  <li>• Alokasikan poin sesuai berat</li>
                  <li>• Berikan konfirmasi ke pengguna</li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  3. Monitor Operasional
                </h3>
                <ul className="space-y-2 text-foreground/80">
                  <li>• Pantau statistik harian/bulanan</li>
                  <li>• Kelola data pengguna</li>
                  <li>• Update status operasional</li>
                  <li>• Laporkan hasil ke Super Admin</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Tips & Best Practices
            </h2>
            <div className="bg-yellow-50 p-6 rounded-lg">
              <ul className="space-y-3 text-foreground/80">
                <li>✓ Pisahkan sampah organik dari non-organik</li>
                <li>
                  ✓ Bersihkan sampah dari kontaminan (plastik, logam, dll)
                </li>
                <li>✓ Setor sampah secara teratur untuk hasil maksimal</li>
                <li>✓ Ikuti edukasi yang tersedia di platform</li>
                <li>✓ Ajak teman dan keluarga untuk bergabung</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              FAQ Singkat
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold text-foreground mb-2">
                  Sampah apa saja yang bisa disetor?
                </h3>
                <p className="text-foreground/80">
                  Semua jenis sampah makanan organik seperti sisa sayuran, buah,
                  nasi, dan makanan lainnya yang mudah terurai.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold text-foreground mb-2">
                  Berapa poin yang didapat?
                </h3>
                <p className="text-foreground/80">
                  Poin dihitung berdasarkan berat sampah yang disetor. Biasanya
                  1 kg = 10 poin, namun dapat berbeda per bank sampah.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold text-foreground mb-2">
                  Bagaimana cara menukar poin?
                </h3>
                <p className="text-foreground/80">
                  Buka menu "Reward" di dashboard, pilih reward yang diinginkan,
                  dan klik tukar jika poin Anda mencukupi.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
