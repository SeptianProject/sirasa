"use client";

import { motion } from "framer-motion";

export default function HowItWorksSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const steps = [
    {
      number: "01",
      title: "Daftar & Akses Dashboard",
      description:
        "Buat akun gratis dan akses dashboard pribadi Anda. Dapatkan panduan lengkap dan mulai perjalanan mengurangi sampah makanan.",
      icon: "📱",
    },
    {
      number: "02",
      title: "Pelajari Panduan",
      description:
        "Ikuti panduan interaktif pembuatan eco-enzyme dan kompos. Langkah demi langkah dijelaskan dengan video dan ilustrasi mudah dipahami.",
      icon: "📚",
    },
    {
      number: "03",
      title: "Olah Sisa Makanan",
      description:
        "Mulai mengolah sisa makanan di rumah Anda. Ubah kulit buah, sayuran sisa menjadi eco-enzyme atau kompos berkualitas.",
      icon: "♻️",
    },
    {
      number: "04",
      title: "Laporkan & Dapatkan Poin",
      description:
        "Laporkan hasil olahan Anda melalui aplikasi. Setiap laporan yang terverifikasi akan mendapat poin reward yang dapat ditukar hadiah.",
      icon: "⭐",
    },
    {
      number: "05",
      title: "Tukar Poin atau Jual Hasil",
      description:
        "Tukar poin dengan hadiah menarik dari merchant partner, atau jual hasil olahan Anda ke bank sampah terdekat untuk pendapatan tambahan.",
      icon: "🎁",
    },
  ];

  return (
    <section id="cara-kerja" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Bagaimana <span className="text-primary">Cara Kerjanya?</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Mulai perjalanan mengurangi sampah makanan Anda dalam 5 langkah
            sederhana
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-16 left-1/2 transform -translate-x-1/2 w-1 h-[calc(100%-8rem)] bg-primary/20"></div>

          <div className="space-y-8 md:space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
                className={`flex flex-col md:flex-row items-center gap-8 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}>
                {/* Content */}
                <div
                  className={`flex-1 ${
                    index % 2 === 0 ? "md:text-right" : "md:text-left"
                  }`}>
                  <div
                    className={`bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition ${
                      index % 2 === 0
                        ? "md:ml-auto md:mr-8"
                        : "md:mr-auto md:ml-8"
                    } max-w-md`}>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-4xl">{step.icon}</span>
                      <span className="text-5xl font-bold text-primary/20">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-left">
                      {step.title}
                    </h3>
                    <p className="text-foreground/70 text-left">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Center Circle */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg z-10 relative">
                    {index + 1}
                  </div>
                </div>

                {/* Empty space for alignment */}
                <div className="flex-1 hidden md:block"></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mt-12">
          <a
            href="/auth/register"
            className="inline-block bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition shadow-lg hover:shadow-xl">
            Mulai Sekarang - Gratis!
          </a>
        </motion.div>
      </div>
    </section>
  );
}
