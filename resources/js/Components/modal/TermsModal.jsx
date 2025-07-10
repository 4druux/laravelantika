import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import ButtonTextFlip from "../button/ButtonTextFlip";

export default function TermsModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <>
      <div className="text-center text-xs text-gray-500 mb-4">
        <p>
          Dengan menekan tombol booking, Anda menyetujui{" "}
          <span
            onClick={() => setIsModalOpen(true)}
            className="text-teal-600 font-semibold cursor-pointer hover:underline"
          >
            Syarat & Ketentuan
          </span>{" "}
          yang berlaku.
        </p>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center px-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b">
                <h2 className="text-base md:text-xl font-medium text-gray-600">
                  Syarat & Ketentuan
                </h2>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors group"
                  aria-label="Tutup modal"
                >
                  <X className="w-5 h-5 group-hover:-rotate-45 transition duration-300 ease-in-out" />
                </button>
              </div>

              <div className="text-gray-600 space-y-3 text-base">
                <p>
                  Dengan melanjutkan pemesanan, Anda menyetujui ketentuan
                  berikut:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-2 text-sm md:text-base">
                  <li>5 menit untuk persiapan & cetak foto.</li>
                  <li>Gratis cetak foto sesuai paket yang dipilih.</li>
                  <li>Semua soft file akan dikirim melalui Google Drive.</li>
                  <li>Harap datang 15 menit sebelum sesi foto dimulai.</li>
                  <li>Tambahan waktu dikenakan biaya Rp.10.000</li>
                  <li>Tambahan orang dikenakan biaya Rp10.000/orang.</li>
                </ul>
              </div>
              <div className="mt-6 text-center">
                <ButtonTextFlip
                  onClick={() => setIsModalOpen(false)}
                  label="Saya Mengerti"
                  hoverLabel="Saya Mengerti"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
