import React from "react";
import { motion } from "framer-motion";
import {
    carouselTextVariants,
    carouselImageVariants,
} from "../../utils/animations";
import { FaWhatsapp } from "react-icons/fa";
import ButtonAnimation from "../button/ButtonAnimation";

export default function Carousel() {
    return (
        <div className="relative w-full h-[100dvh] text-white overflow-hidden">
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
                style={{ backgroundImage: "url('/images/bg-carousel.jpg')" }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />

            <div className="relative z-10 container mx-auto h-full flex">
                <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-12 items-center justify-center md:justify-between">
                    <motion.div
                        variants={carouselTextVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-center md:text-left space-y-2 md:space-y-4"
                    >
                        <h1
                            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight"
                            style={{
                                textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
                            }}
                        >
                            Abadikan Momen{" "}
                            <span className="bg-clip-text text-transparent bg-gradient-to-br from-teal-200 via-teal-600 to-teal-400">
                                Berhargamu
                            </span>
                        </h1>
                        <p
                            className="text-lg md:text-xl text-gray-50"
                            style={{
                                textShadow: "2px 2px 4px rgba(0,0,0,0.4)",
                            }}
                        >
                            Dengan tim profesional dan suasana yang nyaman, kami
                            bantu abadikan momen terbaik kamu, tanpa ribet.
                        </p>

                        <div className="flex space-x-4 justify-center md:justify-start">
                            <ButtonAnimation
                                href="#schedule"
                                label="Booking Sekarang"
                                hoverLabel="Booking Sekarang?"
                                className="shadow-md"
                            />
                            <button
                                onClick={() =>
                                    window.open(
                                        "https://wa.me/62895332188227",
                                        "_blank"
                                    )
                                }
                                className="flex items-center justify-center px-6 py-3 shadow-md text-sm font-semibold bg-gradient-to-br from-teal-200 via-teal-700 to-teal-400 hover:bg-none hover:bg-teal-600 text-white rounded-full"
                            >
                                <FaWhatsapp className="mr-2 w-5 h-5" /> Hubungi
                                Kami
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={carouselImageVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex justify-center"
                    >
                        <div className="relative w-[350px] h-[350px] lg:w-[450px] lg:h-[450px]">
                            <img
                                src="/images/people-carousel.png"
                                alt="Contoh Hasil Foto Studio"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
