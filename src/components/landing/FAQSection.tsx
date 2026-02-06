"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function FAQSection() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
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
    {
      question: "Bagaimana cara menjual hasil olahan saya?",
      answer:
        "Setelah produk Anda matang, hubungi bank sampah terdekat melalui aplikasi SIRASA. Bank sampah akan memverifikasi kualitas dan memberikan pembayaran langsung sesuai harga pasar.",
    },
  ];

  return (
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

        {/* CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mt-12">
          <p className="text-foreground/70 mb-4">
            Masih ada pertanyaan? Hubungi tim kami
          </p>
          <a
            href="#"
            className="inline-block border-2 border-primary text-primary px-8 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition">
            Hubungi Kami
          </a>
        </motion.div>
      </div>
    </section>
  );
}
