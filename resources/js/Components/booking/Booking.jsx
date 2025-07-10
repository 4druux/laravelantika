import React, { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    CheckCircle,
    Calendar,
    Clock,
    Package,
    AlertTriangle,
} from "lucide-react";

import { getBooking } from "../../utils/api";
import { schedulePackages } from "../../Data/packages";
import ButtonTextFlip from "../button/ButtonTextFlip";
import DotLoader from "../loading/DotLoader";
import BookingNotFound from "./BookingNotFound";
import { containerVariants, itemVariants } from "../../utils/animations";

export default function Booking() {
    const bookingId = new URLSearchParams(window.location.search).get("id");

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            if (!bookingId) {
                setError("ID Booking tidak valid.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await getBooking(bookingId);
                setBooking(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetails();
    }, [bookingId]);

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });

    const formatTime = (dateString) =>
        new Date(dateString).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
        });

    const handleCopy = (textToCopy, message) => {
        const tempInput = document.createElement("textarea");
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        toast.success(message);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
                <DotLoader />
            </div>
        );
    }

    if (error || !booking) {
        return <BookingNotFound />;
    }

    const selectedPackageDetails = schedulePackages.find(
        (pkg) => pkg.title === booking.paket
    );

    const whatsappMessage = encodeURIComponent(
        `Halo Admin Antika Studio,\n\nSaya ingin mengonfirmasi pembayaran untuk booking dengan detail berikut:\n\nID Tiket: ${booking.public_id}\nNama: ${booking.nama}\nPaket: ${booking.paket}\n\nTerima kasih.`
    );
    const whatsappLink = `https://api.whatsapp.com/send/?phone=%2B62895332188227&text=${whatsappMessage}`;

    return (
        <div className="min-h-screen p-0 md:p-12">
            <motion.div
                className="max-w-2xl mx-auto bg-white p-4 md:p-6 md:rounded-2xl shadow-md pb-12 md:mb-0"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div
                    className="text-center mb-6"
                    variants={itemVariants}
                >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-lg lg:text-xl font-semibold text-gray-700">
                        Booking Diterima!
                    </h2>
                </motion.div>

                <motion.div
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6"
                    variants={itemVariants}
                >
                    <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-gray-500">Nama Pemesan</span>
                        <span className="font-semibold text-gray-700">
                            {booking.nama}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-gray-500">ID Tiket</span>
                        <span className="font-mono text-gray-700">
                            {booking.public_id}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-gray-500">Status</span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-semibold text-xs">
                            {booking.status}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Tanggal Pesan</span>
                        <span className="text-gray-700">
                            {formatDate(booking.created_at)}
                        </span>
                    </div>
                </motion.div>

                <motion.div className="space-y-4" variants={itemVariants}>
                    <h2 className="text-lg font-medium text-gray-700 border-b pb-2">
                        Detail Sesi Foto
                    </h2>
                    <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-teal-500 mr-3 shrink-0" />
                        <div>
                            <p className="text-xs text-gray-500">
                                Tanggal Booking
                            </p>
                            <p className="font-medium text-gray-700">
                                {formatDate(booking.tanggal_booking)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Clock className="w-5 h-5 text-teal-500 mr-3 shrink-0" />
                        <div>
                            <p className="text-xs text-gray-500">Sesi Waktu</p>
                            <p className="font-medium text-gray-700">
                                {formatTime(booking.tanggal_booking)} WIB
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <Package className="w-5 h-5 text-teal-500 mr-3 shrink-0 mt-1" />
                        <div>
                            <div className="flex items-baseline">
                                <p className="font-medium text-gray-700">
                                    {booking.paket} -{" "}
                                </p>
                                {selectedPackageDetails && (
                                    <p className="ml-1 text-lg font-semibold text-teal-500">
                                        {selectedPackageDetails.price}
                                    </p>
                                )}
                            </div>
                            {selectedPackageDetails && (
                                <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                                    {selectedPackageDetails.features.map(
                                        (feature, i) => (
                                            <li key={i}>{feature}</li>
                                        )
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="border-t border-gray-200 my-6"
                    variants={itemVariants}
                />

                <motion.div
                    className="bg-teal-50 border-l-4 border-teal-400 p-4 rounded-lg"
                    variants={itemVariants}
                >
                    <div className="flex">
                        <div className="py-1">
                            <AlertTriangle className="h-5 w-5 text-teal-500 mr-3" />
                        </div>
                        <div>
                            <p className="font-semibold text-teal-600">
                                Lakukan Pembayaran DP
                            </p>
                            <p className="text-sm text-teal-600 mt-1">
                                Silakan transfer DP <strong>50%</strong> ke{" "}
                                <span className="font-medium">
                                    Bank BCA{" "}
                                    <span
                                        className="font-semibold cursor-pointer underline"
                                        onClick={() =>
                                            handleCopy(
                                                "70055778689",
                                                "Nomor rekening berhasil disalin!"
                                            )
                                        }
                                        title="Klik untuk salin nomor rekening"
                                    >
                                        70055778689
                                    </span>{" "}
                                    a/n <strong>RIZALDI ADI DHARMA</strong>
                                </span>
                                <br />
                                Atau, jika Anda lebih memilih, DP juga dapat
                                dibayarkan langsung di tempat kepada petugas
                                kami. <br />
                                <br />
                                <em className="block mt-1">
                                    Jadwal Anda akan kami amankan setelah
                                    pembayaran dikonfirmasi.
                                </em>
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="mt-8 flex justify-end space-x-4 items-center"
                    variants={itemVariants}
                >
                    <Link
                        href="/"
                        className="border border-teal-500 text-teal-500 text-sm font-semibold rounded-full px-6 py-3 hover:bg-teal-50 transition-colors"
                    >
                        Kembali
                    </Link>
                    <ButtonTextFlip
                        label="Konfirm Admin"
                        hoverLabel="Konfirm Admin"
                        onClick={() => window.open(whatsappLink, "_blank")}
                    />
                </motion.div>
            </motion.div>
        </div>
    );
}
