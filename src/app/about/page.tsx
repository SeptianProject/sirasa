import Navigation from "@/components/Navigation";
import Footer from "@/components/landing/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-primary mb-8">Tentang SIRASA</h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Apa itu SIRASA?
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              SIRASA (Sistem Reduksi Sampah Sisa Makanan) adalah platform
              digital yang bertujuan untuk mengurangi sampah makanan dengan
              menghubungkan masyarakat dengan bank sampah terdekat. Kami percaya
              bahwa setiap tindakan kecil dalam mengelola sampah makanan dapat
              memberikan dampak besar bagi lingkungan.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Misi Kami
            </h2>
            <ul className="space-y-3 text-foreground/80">
              <li>✓ Mengurangi jumlah sampah makanan yang berakhir di TPA</li>
              <li>
                ✓ Memberdayakan masyarakat untuk mengelola sampah organik
                menjadi kompos
              </li>
              <li>
                ✓ Memberikan edukasi tentang pentingnya pengelolaan sampah
                makanan
              </li>
              <li>
                ✓ Menciptakan ekosistem berkelanjutan dalam pengelolaan sampah
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Visi Kami
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              Menjadi platform terdepan dalam pengelolaan sampah makanan di
              Indonesia, menciptakan masa depan yang lebih hijau dan
              berkelanjutan untuk generasi mendatang.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Mengapa SIRASA?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-primary/5 p-6 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">
                  Mudah Digunakan
                </h3>
                <p className="text-sm text-foreground/80">
                  Interface yang intuitif memudahkan siapa saja untuk mulai
                  berkontribusi
                </p>
              </div>
              <div className="bg-primary/5 p-6 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">
                  Berdampak Nyata
                </h3>
                <p className="text-sm text-foreground/80">
                  Setiap kontribusi Anda memiliki dampak langsung terhadap
                  lingkungan
                </p>
              </div>
              <div className="bg-primary/5 p-6 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">
                  Reward System
                </h3>
                <p className="text-sm text-foreground/80">
                  Dapatkan poin dan reward untuk setiap kontribusi yang Anda
                  lakukan
                </p>
              </div>
              <div className="bg-primary/5 p-6 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">
                  Komunitas Peduli
                </h3>
                <p className="text-sm text-foreground/80">
                  Bergabung dengan komunitas yang peduli lingkungan di seluruh
                  Indonesia
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
