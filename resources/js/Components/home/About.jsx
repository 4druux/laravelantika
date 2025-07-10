import React from "react";
import { motion } from "framer-motion";
import { FaPalette, FaTags, FaLock, FaBoxOpen } from "react-icons/fa";
import { containerVariants, itemVariants } from "../../utils/animations";

const features = [
  {
    icon: FaPalette,
    title: "Kontrol Kreatif Penuh",
    description:
      "Mau pencahayaan dramatis atau latar cerah? Semuanya bebas kamu atur sesuai selera. Kami siap bantu wujudkan idemu.",
  },
  {
    icon: FaTags,
    title: "Harga Ramah di Kantong",
    description:
      "Kualitas foto tetap profesional, tapi harganya bersahabat. Cocok buat personal, keluarga, atau bisnis kecil.",
  },
  {
    icon: FaLock,
    title: "Privasi Terjamin",
    description:
      "Sesi foto serasa punya studio sendiri. Tenang, nyaman, dan bebas gangguan. Fokus sepenuhnya ke momenmu.",
  },
  {
    icon: FaBoxOpen,
    title: "Properti Lengkap, Hasil Lebih Variatif",
    description:
      "Dari yang minimalis sampai yang playful—kami punya beragam properti dan latar buat hasil foto yang beda dan unik.",
  },
];

export default function About() {
  return (
    <section className="relative w-full py-24 md:py-32 lg:py-40 xl:py-48 mt-16 overflow-hidden">
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="hidden md:block">
          <img
            src="/images/wavedekstop.png"
            alt="Abstract wave background for desktop"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="block md:hidden">
          <img
            src="/images/wavemobile.png"
            alt="Abstract wave background for mobile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <motion.div
        className="relative z-10 text-center text-white max-w-4xl mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h1
          className="text-4xl md:text-5xl font-medium mb-12 tracking-tight"
          variants={itemVariants}
        >
          Kenapa Memilih Studio Kami?
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-left hover:bg-white/20 transition-colors duration-300"
                variants={itemVariants}
              >
                <div className="flex items-center mb-3">
                  <div className="bg-white/20 p-2 rounded-lg mr-4">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                </div>
                <p className="text-gray-200 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
