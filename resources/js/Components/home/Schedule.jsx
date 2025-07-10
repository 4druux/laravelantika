import React from "react";
import { motion } from "framer-motion";
import { router } from "@inertiajs/react";
import ButtonTextFlip from "../button/ButtonTextFlip";
import Tittle from "../text/Tittle";
import Description from "../text/Description";
import { schedulePackages } from "../../Data/packages";
import { containerVariants, itemVariants } from "../../utils/animations";

export default function Schedule() {
  

    return (
        <section id="schedule" className="pt-12 md:pt-24">
            <div className="container mx-auto px-4">
                <motion.div
                    className="text-center mb-4 lg:mb-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <motion.div variants={itemVariants}>
                        <Tittle text="Pilih Paket Booking" />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Description
                            text="Pilih paket yang paling sesuai dengan kebutuhan Anda dan booking sesi foto Anda hari ini."
                            className="mt-2 max-w-2xl mx-auto"
                        />
                    </motion.div>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {schedulePackages.map((pkg) => {
                        const Icon = pkg.icon;
                        return (
                            <motion.div
                                key={pkg.query}
                                className="bg-white shadow-md rounded-2xl p-4 text-center flex flex-col cursor-pointer transition-shadow duration-300 hover:shadow-lg"
                                variants={itemVariants}
                                whileHover={{ y: -2, scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="mx-auto bg-teal-100 text-teal-500 p-4 rounded-full mb-4">
                                    <Icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    {pkg.title}
                                </h3>
                                <p className="text-3xl font-semibold text-teal-500 mb-4">
                                    {pkg.price}
                                </p>

                                <ul className="text-gray-500 text-sm space-y-2 text-left px-4 flex-grow mb-6">
                                    {pkg.features.map((feature, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start"
                                        >
                                            <span className="text-green-500 mr-2 mt-1">
                                                &#10003;
                                            </span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <ButtonTextFlip
                                    onClick={() =>
                                        router.visit(`/formulir?paket=${pkg.query}`)
                                    }
                                    label="Booking Sekarang"
                                    hoverLabel="Booking Sekarang"
                                />
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}