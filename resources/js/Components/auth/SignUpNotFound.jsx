import React from "react";
import { motion } from "framer-motion";
import ButtonTextFlip from "../button/ButtonTextFlip"; 

export default function SignUpNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-6xl font-extrabold text-teal-500"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-2 text-xl font-medium text-gray-500"
        >
          Register tidak tersedia.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-4 max-w-sm mx-auto text-gray-500"
        >
          Maaf, Pendaftaran tidak tersedia pada saat ini.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.9,
            type: "spring",
            stiffness: 120,
          }}
          className="mt-8 flex justify-center"
        >
          <ButtonTextFlip
            label="Kembali ke Beranda"
            hoverLabel="Kembali"
            onClick={() => window.history.back()}
            className="flex"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
