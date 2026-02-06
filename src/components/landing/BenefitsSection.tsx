"use client";

import { motion } from "framer-motion";
import { Sprout, HandHeart, Trophy } from "lucide-react";

export default function BenefitsSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
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
            Tiga prinsip utama yang mengubah sampah menjadi sumber daya berharga
          </p>
        </motion.div>

        {/* Bento Grid - Following reference layout exactly */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* ROW 1 - LEFT: Image */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="rounded-2xl sm:rounded-3xl overflow-hidden h-64 md:h-80">
            <img
              src="https://placehold.co/600x800/f7fcfa/00a363?text=Komposter"
              alt="Komposter organik"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* ROW 1 - CENTER: Icon + Text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
            className="bg-foreground/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-center items-center text-center h-64 md:h-80">
            <Sprout
              className="w-14 h-14 sm:w-16 sm:h-16 mb-4 text-primary"
              strokeWidth={1.5}
            />
            <h3 className="text-xl sm:text-2xl font-bold mb-3">
              Reduce at Source
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Pengurangan sampah dari rumah tangga untuk mengurangi beban TPA
            </p>
          </motion.div>

          {/* ROW 1 - RIGHT: Image */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
            className="rounded-2xl sm:rounded-3xl overflow-hidden h-64 md:h-80">
            <img
              src="https://placehold.co/600x800/f7fcfa/00a363?text=Eco+Enzyme"
              alt="Eco-enzyme processing"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* ROW 2 - LEFT: Icon + Text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.3 }}
            className="bg-foreground/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-center items-center text-center h-64 md:h-80">
            <HandHeart
              className="w-14 h-14 sm:w-16 sm:h-16 mb-4 text-primary"
              strokeWidth={1.5}
            />
            <h3 className="text-xl sm:text-2xl font-bold mb-3">
              Empower Not Burden
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Memberdayakan warga dengan panduan dan insentif nyata
            </p>
          </motion.div>

          {/* ROW 2 - CENTER: Image */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.4 }}
            className="rounded-2xl sm:rounded-3xl overflow-hidden h-64 md:h-80 relative">
            <img
              src="https://placehold.co/1200x800/00a363/ffffff?text=Circular+Economy"
              alt="Circular economy system"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6 sm:p-8">
              <div className="text-white">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">
                  Circular over Linear
                </h3>
                <p className="text-white/90 text-sm">
                  Masuk kembali ke siklus ekonomi lokal
                </p>
              </div>
            </div>
          </motion.div>

          {/* ROW 2 - RIGHT: Icon + Text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.5 }}
            className="bg-foreground/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-center items-center text-center h-64 md:h-80">
            <Trophy
              className="w-14 h-14 sm:w-16 sm:h-16 mb-4 text-primary"
              strokeWidth={1.5}
            />
            <h3 className="text-xl sm:text-2xl font-bold mb-3">
              Insentif Poin
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Dapatkan reward menarik dari setiap kontribusi Anda
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
