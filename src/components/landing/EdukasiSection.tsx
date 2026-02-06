"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  FlaskConical,
  Sprout,
  Package,
  Sparkles,
  ClipboardList,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";

export default function EdukasiSection() {
  const [activeTab, setActiveTab] = useState<"eco-enzyme" | "kompos">(
    "eco-enzyme",
  );

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const ecoEnzymeData = {
    title: "Eco-Enzyme",
    description:
      "Cairan fermentasi dari sisa kulit buah dan sayuran yang berfungsi sebagai pembersih alami, pupuk organik, dan pengurai limbah.",
    materials: [
      "3 bagian kulit buah/sayuran (jeruk, nanas, apel, dll)",
      "1 bagian gula merah/gula aren",
      "10 bagian air bersih",
      "Wadah plastik bertutup",
    ],
    steps: [
      "Campurkan gula merah dengan air hingga larut",
      "Masukkan kulit buah/sayuran yang sudah dipotong kecil",
      "Tutup wadah, biarkan gas keluar 2 minggu pertama",
      "Fermentasi selama 3 bulan, aduk sesekali",
      "Saring dan eco-enzyme siap digunakan",
    ],
    benefits: [
      "Pembersih lantai, piring, kamar mandi",
      "Pupuk organik untuk tanaman",
      "Pengurai saluran air tersumbat",
      "Mengurangi penggunaan deterjen kimia",
    ],
  };

  const komposData = {
    title: "Kompos",
    description:
      "Pupuk organik hasil penguraian sisa makanan dan bahan organik yang kaya nutrisi untuk tanaman.",
    materials: [
      "Sisa sayuran dan buah",
      "Sampah organik dapur",
      "Dedaunan kering/serbuk gergaji",
      "EM4 atau bioaktivator",
      "Komposter atau ember berlubang",
    ],
    steps: [
      "Cacah sisa makanan menjadi potongan kecil",
      "Susun berlapis: sampah organik + dedaunan kering",
      "Siram dengan larutan EM4/bioaktivator",
      "Tutup rapat, buka untuk aerasi setiap 2-3 hari",
      "Kompos matang dalam 3-4 minggu",
    ],
    benefits: [
      "Meningkatkan kesuburan tanah",
      "Memperbaiki struktur tanah",
      "Mengurangi sampah organik rumah tangga",
      "Menghemat biaya pembelian pupuk",
    ],
  };

  const activeData = activeTab === "eco-enzyme" ? ecoEnzymeData : komposData;

  return (
    <section id="edukasi" className="py-16 md:py-24 bg-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Panduan <span className="text-primary">Edukasi</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Pelajari cara mengolah sisa makanan menjadi produk bernilai dengan
            panduan lengkap dan mudah diikuti
          </p>
        </motion.div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-full p-1 shadow-md">
            <button
              onClick={() => setActiveTab("eco-enzyme")}
              className={`px-8 py-3 rounded-full font-semibold transition ${
                activeTab === "eco-enzyme"
                  ? "bg-primary text-white"
                  : "text-foreground hover:text-primary"
              }`}>
              Eco-Enzyme
            </button>
            <button
              onClick={() => setActiveTab("kompos")}
              className={`px-8 py-3 rounded-full font-semibold transition ${
                activeTab === "kompos"
                  ? "bg-primary text-white"
                  : "text-foreground hover:text-primary"
              }`}>
              Kompos
            </button>
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid lg:grid-cols-2 gap-8">
          {/* Left - Info Card */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                {activeTab === "eco-enzyme" ? (
                  <FlaskConical
                    className="w-8 h-8 text-primary"
                    strokeWidth={1.5}
                  />
                ) : (
                  <Sprout className="w-8 h-8 text-primary" strokeWidth={1.5} />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold">{activeData.title}</h3>
                <p className="text-sm text-foreground/60">
                  Ramah lingkungan & hemat biaya
                </p>
              </div>
            </div>
            <p className="text-foreground/70 mb-6">{activeData.description}</p>

            {/* Materials */}
            <div className="mb-6">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" strokeWidth={1.5} />{" "}
                Bahan yang Diperlukan
              </h4>
              <ul className="space-y-2">
                {activeData.materials.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-foreground/70">
                    <span className="text-primary mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div>
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" strokeWidth={1.5} />{" "}
                Manfaat
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeData.benefits.map((benefit, index) => (
                  <span
                    key={index}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Steps */}
          <div className="bg-linear-to-br from-primary to-primary/80 rounded-3xl p-8 text-white shadow-lg">
            <h4 className="font-semibold text-2xl mb-6 flex items-center gap-2">
              <ClipboardList className="w-6 h-6" strokeWidth={1.5} /> Langkah
              Pembuatan
            </h4>
            <div className="space-y-4">
              {activeData.steps.map((step, index) => (
                <div
                  key={index}
                  className="flex gap-4 bg-white/10 backdrop-blur rounded-2xl p-4 hover:bg-white/20 transition">
                  <div className="shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="flex-1 text-white/90">{step}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-white/10 backdrop-blur rounded-2xl">
              <p className="text-sm text-white/90 flex items-start gap-2">
                <Lightbulb
                  className="w-5 h-5 shrink-0 mt-0.5"
                  strokeWidth={1.5}
                />
                <span>
                  <strong>Tips:</strong> Untuk panduan lengkap dengan video
                  tutorial dan konsultasi gratis, daftar dan akses dashboard
                  Anda!
                </span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mt-12">
          <p className="text-foreground/70 mb-4">
            Ingin panduan lebih detail dengan video tutorial?
          </p>
          <Link
            href={"/dashboard/user/edukasi"}
            className="inline-block bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition shadow-lg hover:shadow-xl">
            Akses Panduan Lengkap
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
