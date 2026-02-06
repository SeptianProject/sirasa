"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
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

  return (
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
              kumpul–angkut–buang menjadi olah–nilai–manfaat. Dapur Anda adalah
              awal perubahan.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <a
                href="#cara-kerja"
                className="bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition shadow-lg hover:shadow-xl">
                Mulai Sekarang
              </a>
              <a
                href="/auth/register"
                className="border-2 border-primary text-primary px-8 py-4 rounded-full font-semibold hover:bg-primary hover:text-white transition">
                Daftar Gratis
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
                alt="SIRASA Platform"
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
  );
}
