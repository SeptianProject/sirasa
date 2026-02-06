"use client";

import { motion } from "framer-motion";

export default function BankSampahSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const benefits = [
    {
      icon: "💰",
      title: "Pendapatan Tambahan",
      description:
        "Jual hasil eco-enzyme dan kompos Anda ke bank sampah terdekat dan dapatkan uang tunai",
    },
    {
      icon: "📍",
      title: "Lokasi Terdekat",
      description:
        "Temukan bank sampah terdekat dari lokasi Anda melalui peta interaktif di aplikasi",
    },
    {
      icon: "⚖️",
      title: "Harga Transparan",
      description:
        "Sistem harga yang jelas dan transparan, dipantau langsung oleh SIRASA",
    },
    {
      icon: "🤝",
      title: "Dukungan Komunitas",
      description:
        "Bergabung dengan komunitas pengelola sampah dan dapatkan tips dari ahli",
    },
  ];

  const priceList = [
    {
      item: "Eco-Enzyme (per liter)",
      price: "Rp 15.000 - Rp 25.000",
      quality: "Tergantung kualitas fermentasi",
    },
    {
      item: "Kompos Matang (per kg)",
      price: "Rp 3.000 - Rp 5.000",
      quality: "Kualitas premium lebih tinggi",
    },
    {
      item: "Kompos Cair (per liter)",
      price: "Rp 10.000 - Rp 15.000",
      quality: "Siap pakai untuk pupuk",
    },
  ];

  const howToSell = [
    {
      step: 1,
      title: "Daftar sebagai Pengelola",
      description:
        "Lengkapi profil dan verifikasi akun Anda untuk mulai menjual",
    },
    {
      step: 2,
      title: "Siapkan Produk",
      description:
        "Pastikan eco-enzyme atau kompos sudah matang dan berkualitas",
    },
    {
      step: 3,
      title: "Hubungi Bank Sampah",
      description:
        "Pilih bank sampah terdekat dan jadwalkan pengiriman produk Anda",
    },
    {
      step: 4,
      title: "Verifikasi & Pembayaran",
      description:
        "Produk akan diverifikasi kualitasnya, pembayaran langsung diterima",
    },
  ];

  return (
    <section id="bank-sampah" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-primary">Bank Sampah</span> SIRASA
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Ubah hasil olahan Anda menjadi pendapatan tambahan melalui jaringan
            bank sampah mitra SIRASA
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-foreground/70 text-sm">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Price List & How to Sell */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Price List */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span>💵</span> Harga Referensi
            </h3>
            <div className="space-y-4">
              {priceList.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur rounded-2xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{item.item}</h4>
                    <span className="text-xl font-bold">{item.price}</span>
                  </div>
                  <p className="text-sm text-white/70">{item.quality}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-white/10 backdrop-blur rounded-2xl">
              <p className="text-sm text-white/90">
                💡 Harga dapat bervariasi tergantung lokasi dan kualitas produk
              </p>
            </div>
          </motion.div>

          {/* How to Sell */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-white rounded-3xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span>🔄</span> Cara Menjual
            </h3>
            <div className="space-y-6">
              {howToSell.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm text-foreground/70">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="bg-primary/5 rounded-3xl p-8 mb-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">150+</div>
              <p className="text-foreground/70">Bank Sampah Mitra</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">
                5.2 Ton
              </div>
              <p className="text-foreground/70">Sampah Terolah/Bulan</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">
                Rp 45 Jt
              </div>
              <p className="text-foreground/70">Total Pendapatan Warga</p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center">
          <p className="text-foreground/70 mb-4">
            Siap mengubah sampah menjadi rupiah?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/auth/register"
              className="inline-block bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition shadow-lg hover:shadow-xl">
              Daftar Sekarang
            </a>
            <a
              href="#cara-kerja"
              className="inline-block border-2 border-primary text-primary px-8 py-4 rounded-full font-semibold hover:bg-primary hover:text-white transition">
              Pelajari Lebih Lanjut
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
