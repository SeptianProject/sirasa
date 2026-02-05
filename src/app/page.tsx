"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  };

  const faqItems = [
    {
      question: "Apa itu SIRASA?",
      answer:
        "SIRASA (Sistem Reduksi Sampah Sisa Makanan) adalah platform digital yang membantu rumah tangga mengelola sisa makanan menjadi sumber daya bernilai. Melalui edukasi, insentif poin, dan koneksi ke bank sampah lokal.",
    },
    {
      question: "Bagaimana cara kerja sistem poin?",
      answer:
        "Setiap kali Anda mengolah sisa makanan (eco-enzyme atau kompos) dan melaporkannya melalui aplikasi, Anda akan mendapat poin. Poin dapat ditukar dengan hadiah di merchant partner atau disumbangkan untuk kegiatan sosial.",
    },
    {
      question: "Apakah SIRASA gratis?",
      answer:
        "Ya, SIRASA sepenuhnya gratis untuk semua pengguna. Kami percaya bahwa perubahan lingkungan harus accessible untuk semua orang tanpa biaya.",
    },
    {
      question: "Bagaimana saya bisa mulai mengolah sisa makanan?",
      answer:
        "Setelah mendaftar, Anda akan mendapat panduan lengkap pembuatan eco-enzyme dan kompos. Panduan disusun dengan langkah sederhana yang bisa diikuti siapa saja, bahkan pemula.",
    },
    {
      question: "Apa manfaat bergabung dengan SIRASA?",
      answer:
        "Anda berkontribusi mengurangi beban TPA, mendapat reward berupa poin, mempelajari keterampilan baru, dan menjadi bagian dari komunitas peduli lingkungan. Plus, Anda membantu mengurangi biaya pengelolaan sampah kota.",
    },
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-primary">
              SIRASA
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="#features"
                className="text-foreground hover:text-primary transition">
                Fitur
              </Link>
              <Link
                href="#benefits"
                className="text-foreground hover:text-primary transition">
                Manfaat
              </Link>
              <Link
                href="#faq"
                className="text-foreground hover:text-primary transition">
                FAQ
              </Link>
              {session ? (
                <Link
                  href={
                    session.user.role === "SUPER_ADMIN"
                      ? "/dashboard/super-admin"
                      : session.user.role === "BANK_SAMPAH_ADMIN"
                        ? "/dashboard/bank-sampah"
                        : "/dashboard/user"
                  }
                  className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-foreground hover:text-primary transition">
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-foreground">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden py-4 space-y-4">
                <Link
                  href="#features"
                  className="block text-foreground hover:text-primary transition"
                  onClick={() => setMobileMenuOpen(false)}>
                  Fitur
                </Link>
                <Link
                  href="#benefits"
                  className="block text-foreground hover:text-primary transition"
                  onClick={() => setMobileMenuOpen(false)}>
                  Benefits
                </Link>
                <Link
                  href="#faq"
                  className="block text-foreground hover:text-primary transition"
                  onClick={() => setMobileMenuOpen(false)}>
                  FAQ
                </Link>
                {session ? (
                  <Link
                    href={
                      session.user.role === "SUPER_ADMIN"
                        ? "/dashboard/super-admin"
                        : session.user.role === "BANK_SAMPAH_ADMIN"
                          ? "/dashboard/bank-sampah"
                          : "/dashboard/user"
                    }
                    className="block bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition text-center">
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="block text-foreground hover:text-primary transition">
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      className="block bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition text-center">
                      Sign Up
                    </Link>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Typography */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-6">
              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Ubah Sisa Makanan,{" "}
                <span className="text-primary">Jadi Berkah</span>
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-foreground/80 max-w-lg">
                SIRASA mengubah paradigma pengelolaan sampah dari
                kumpul–angkut–buang menjadi olah–nilai–manfaat. Dapur Anda
                adalah awal perubahan.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                <a
                  href="#features"
                  className="bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition shadow-lg hover:shadow-xl">
                  Mulai Sekarang
                </a>
                <a
                  href="#benefits"
                  className="border-2 border-primary text-primary px-8 py-4 rounded-full font-semibold hover:bg-primary hover:text-white transition">
                  Pelajari Lebih Lanjut
                </a>
              </motion.div>
            </motion.div>

            {/* Right - Hero Image with Floating Badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative">
              <div className="relative max-w-xl mx-auto">
                <img
                  src="/assets/image-hero.png"
                  alt="Eco-Enzyme Bottle"
                  className="w-full h-auto max-h-[600px] object-contain"
                />

                {/* Floating Badge 1 */}
                <motion.div
                  animate={floatingAnimation}
                  className="absolute top-10 -left-4 bg-white rounded-2xl shadow-xl p-4 max-w-[140px]">
                  <p className="text-sm font-semibold text-primary">
                    Reduce at Source
                  </p>
                  <p className="text-xs text-foreground/60">
                    Kurangi di sumbernya
                  </p>
                </motion.div>

                {/* Floating Badge 2 */}
                <motion.div
                  animate={{
                    ...floatingAnimation,
                    transition: { ...floatingAnimation.transition, delay: 0.5 },
                  }}
                  className="absolute top-1/3 -right-4 bg-white rounded-2xl shadow-xl p-4 max-w-[140px]">
                  <p className="text-sm font-semibold text-primary">Empower</p>
                  <p className="text-xs text-foreground/60">Berdayakan warga</p>
                </motion.div>

                {/* Floating Badge 3 */}
                <motion.div
                  animate={{
                    ...floatingAnimation,
                    transition: { ...floatingAnimation.transition, delay: 1 },
                  }}
                  className="absolute bottom-20 left-8 bg-white rounded-2xl shadow-xl p-4 max-w-[140px]">
                  <p className="text-sm font-semibold text-primary">Circular</p>
                  <p className="text-xs text-foreground/60">Ekonomi sirkular</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section - Bento Grid */}
      <section id="benefits" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Mengapa <span className="text-primary">SIRASA?</span>
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Tiga prinsip utama yang mengubah sampah menjadi sumber daya
              berharga
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 - Large */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="md:col-span-2 bg-primary/5 rounded-3xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    Reduce at Source
                  </h3>
                  <p className="text-foreground/70 text-lg">
                    Pengurangan sampah paling efektif dan murah dilakukan di
                    sumbernya, yaitu rumah tangga. Dengan mengolah sisa makanan
                    sejak dari dapur, kita mengurangi beban TPA dan biaya
                    pengelolaan sampah.
                  </p>
                </div>
                <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden flex-shrink-0">
                  <img
                    src="https://placehold.co/400x400/f7fcfa/00a363?text=Reduce+at+Source"
                    alt="Reduce at source"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: 0.1 }}
              className="bg-primary text-white rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold mb-3">Empower, Not Burden</h3>
                <p className="text-white/90">
                  Warga tidak dibebani kewajiban teknis yang rumit, tetapi
                  diberdayakan melalui panduan sederhana dan insentif nyata.
                </p>
              </div>
            </motion.div>

            {/* Card 3 - Image */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
              className="rounded-3xl overflow-hidden h-64 md:h-auto">
              <img
                src="https://placehold.co/400x600/f7fcfa/00a363?text=Circular+Economy"
                alt="Circular economy"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Card 4 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: 0.3 }}
              className="bg-primary/5 rounded-3xl p-8">
              <div className="text-5xl mb-4">♻️</div>
              <h3 className="text-2xl font-bold mb-3">Circular over Linear</h3>
              <p className="text-foreground/70">
                Sisa makanan tidak berakhir sebagai beban TPA, tetapi masuk
                kembali ke siklus ekonomi lokal melalui pengolahan menjadi
                eco-enzyme dan kompos.
              </p>
            </motion.div>

            {/* Card 5 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: 0.4 }}
              className="md:col-span-2 bg-gradient-to-br from-primary to-primary/80 text-white rounded-3xl p-8 md:p-12">
              <div className="max-w-2xl">
                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                  Dari Rumah Tangga, Untuk Lingkungan
                </h3>
                <p className="text-white/90 text-lg mb-6">
                  SIRASA memandang rumah tangga bukan sebagai objek kebijakan,
                  tetapi sebagai aktor utama pengelolaan lingkungan. Melalui
                  edukasi cerdas, insentif ekonomi, dan ekosistem sirkular yang
                  terintegrasi.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
                    Edukasi
                  </span>
                  <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
                    Insentif Poin
                  </span>
                  <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
                    Bank Sampah
                  </span>
                  <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
                    Eco-Enzyme
                  </span>
                  <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
                    Kompos
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Feature Section */}
      <section id="features" className="py-16 md:py-24 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://placehold.co/600x800/f7fcfa/00a363?text=SIRASA+App"
                  alt="SIRASA showcase"
                  className="w-full h-auto"
                />
              </div>
            </motion.div>

            {/* Right - Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6">
              <div>
                <span className="text-primary font-semibold text-sm uppercase tracking-wide">
                  Sistem Digital Terintegrasi
                </span>
                <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
                  Platform SIRASA
                </h2>
                <p className="text-foreground/70 text-lg">
                  Kelola sisa makanan Anda dengan mudah. Dapatkan panduan
                  pengolahan, tukar poin dengan hadiah, dan berkontribusi
                  langsung pada pengurangan sampah di TPA.
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 fill-current"
                      viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-foreground/70">
                  (4.8/5 dari 1,250+ pengguna)
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-5xl font-bold text-primary">Gratis</span>
                <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Open for All
                </span>
              </div>

              {/* Features */}
              <div>
                <p className="text-sm font-semibold mb-2">Fitur Utama</p>
                <div className="flex flex-wrap gap-3">
                  <button className="border-2 border-primary bg-primary text-white px-6 py-2 rounded-full font-semibold">
                    Panduan Praktis
                  </button>
                  <button className="border-2 border-primary text-primary px-6 py-2 rounded-full font-semibold hover:bg-primary hover:text-white transition">
                    Sistem Poin
                  </button>
                  <button className="border-2 border-primary text-primary px-6 py-2 rounded-full font-semibold hover:bg-primary hover:text-white transition">
                    Bank Sampah
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="flex-1 bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition shadow-lg hover:shadow-xl">
                  Mulai Bergabung
                </button>
                <button className="flex-1 border-2 border-primary text-primary px-8 py-4 rounded-full font-semibold hover:bg-primary hover:text-white transition">
                  Lihat Demo
                </button>
              </div>

              {/* Features List */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">Edukasi Interaktif</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">Reward System</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">Tracking Dampak</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">Komunitas Lokal</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Pertanyaan <span className="text-primary">Umum</span>
            </h2>
            <p className="text-lg text-foreground/70">
              Segala yang perlu Anda ketahui tentang SIRASA
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === index ? null : index)
                  }
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-primary/5 transition">
                  <span className="font-semibold text-lg pr-4">
                    {item.question}
                  </span>
                  <svg
                    className={`w-6 h-6 text-primary transition-transform flex-shrink-0 ${
                      expandedFaq === index ? "rotate-45" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden">
                      <div className="px-6 pb-5 text-foreground/70">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f0f0f] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-bold text-primary mb-4">SIRASA</h3>
              <p className="text-white/70 text-sm">
                Sistem Reduksi Sampah Sisa Makanan untuk masa depan
                berkelanjutan.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>
                  <a href="#features" className="hover:text-primary transition">
                    Fitur
                  </a>
                </li>
                <li>
                  <a href="#benefits" className="hover:text-primary transition">
                    Manfaat
                  </a>
                </li>
                <li>
                  <a
                    href="/dashboard"
                    className="hover:text-primary transition">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Bank Sampah
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4">Bantuan</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>
                  <a href="#faq" className="hover:text-primary transition">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Panduan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Kontak
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Tentang Kami
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-semibold mb-4">Tetap Terhubung</h4>
              <p className="text-white/70 text-sm mb-4">
                Dapatkan tips dan update terbaru
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email Anda"
                  className="flex-1 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="bg-primary px-6 py-2 rounded-full hover:bg-primary/90 transition">
                  →
                </button>
              </form>
            </div>
          </div>

          {/* Social & Copyright */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm">
              © 2026 SIRASA. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition"
                aria-label="Facebook">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition"
                aria-label="Twitter">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition"
                aria-label="Instagram">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
