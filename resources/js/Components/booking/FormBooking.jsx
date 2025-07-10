import React, { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import useSWR from "swr";
import { ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { createBooking, fetcher } from "../../utils/api";
import { schedulePackages } from "../../Data/packages";
import PackageNotFound from "./PackageNotFound";
import { containerVariants, itemVariants } from "../../utils/animations";
import TermsModal from "../modal/TermsModal";
import BookingCalendar from "./BookingCalendar";
import DotLoader from "../loading/DotLoader";

const PHONE_PREFIX = "+62";

const formatPhoneNumber = (value) => {
    if (!value) return "";
    const numbers = value.replace(/\D/g, "");
    const match = numbers.match(/^(\d{1,3})(\d{0,4})(\d{0,5})$/);
    if (match) {
        const [, part1, part2, part3] = match;
        let formatted = part1;
        if (part2) formatted += `-${part2}`;
        if (part3) formatted += `-${part3}`;
        return formatted;
    }
    return numbers;
};

export default function FormBooking() {
    const paketQuery = new URLSearchParams(window.location.search).get("paket");

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        description: "",
    });
    const [formattedPhone, setFormattedPhone] = useState("");
    const [bookingDetails, setBookingDetails] = useState({
        date: null,
        time: null,
    });
    const [errors, setErrors] = useState({});

    const selectedPackage = schedulePackages.find(
        (pkg) => pkg.query === paketQuery
    );

    const swrKey = selectedPackage ? ["/bookings/public/dates"] : null;
    const {
        data: bookedDates = [],
        error: fetchError,
        isLoading: isFetchingBookings,
    } = useSWR(swrKey, fetcher, {
        revalidateOnFocus: true,
    });

    useEffect(() => {
        if (fetchError) {
            toast.error("Gagal memuat jadwal yang sudah ada.");
            console.error("Gagal mengambil data booking:", fetchError);
        }
    }, [fetchError]);

    const validatePhoneNumber = (rawNumber) => {
        if (!rawNumber) return false;
        if (!rawNumber.startsWith("8")) {
            setErrors((prev) => ({
                ...prev,
                phoneFormat: "Harus diawali angka 8.",
            }));
            return false;
        }
        if (rawNumber.length < 9 || rawNumber.length > 12) {
            setErrors((prev) => ({
                ...prev,
                phoneFormat: "Harus terdiri dari 9-12 digit.",
            }));
            return false;
        }
        setErrors((prev) => ({ ...prev, phoneFormat: "" }));
        return true;
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (id === "phone") {
            const numericValue = value.replace(/[^0-9]/g, "");
            if (numericValue.length <= 12) {
                setFormData((prev) => ({ ...prev, phone: numericValue }));
                setFormattedPhone(formatPhoneNumber(numericValue));
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                validatePhoneNumber(numericValue);
            }
        } else {
            setFormData((prev) => ({ ...prev, [id]: value }));
            if (errors[id]) {
                setErrors((prev) => ({ ...prev, [id]: "" }));
            }
        }
    };

    const handleDateTimeChange = (details) => {
        setBookingDetails(details);
        if (details.date && details.time) {
            setErrors((prev) => ({ ...prev, date: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return;

        const newErrors = {};
        let formIsValid = true;

        if (!formData.name.trim()) {
            newErrors.name = "Nama lengkap wajib diisi.";
            formIsValid = false;
        }
        if (!formData.phone.trim() || !validatePhoneNumber(formData.phone)) {
            newErrors.phone = "Nomor telepon wajib diisi dan valid.";
            formIsValid = false;
        }
        if (!bookingDetails.date || !bookingDetails.time) {
            newErrors.date = "Tanggal & waktu wajib dipilih.";
            formIsValid = false;
        }

        setErrors(newErrors);
        if (!formIsValid) return;

        setIsLoading(true);

        const [hour, minute] = bookingDetails.time.split(":");
        const bookingDate = new Date(bookingDetails.date);
        bookingDate.setHours(hour, minute, 0, 0);

        const year = bookingDate.getFullYear();
        const month = (bookingDate.getMonth() + 1).toString().padStart(2, "0");
        const day = bookingDate.getDate().toString().padStart(2, "0");
        const hours = bookingDate.getHours().toString().padStart(2, "0");
        const minutes = bookingDate.getMinutes().toString().padStart(2, "0");
        const seconds = "00";

        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        const payload = {
            nama: formData.name,
            telepon: `${PHONE_PREFIX}${formData.phone}`,
            paket: selectedPackage.title,
            tanggal: formattedDateTime,
            catatan: formData.description,
        };

        try {
            const result = await createBooking(payload);
            toast.success(result.message);
            router.visit(`/booking?id=${result.booking.public_id}`, {
                state: { booking: result.booking },
            });
        } catch (error) {
            toast.error(error.message || "Gagal membuat booking.");
            setErrors({ submit: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    if (!selectedPackage) {
        return <PackageNotFound />;
    }

    if (isFetchingBookings) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <DotLoader />
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center text-red-500 p-4">
                Terjadi kesalahan saat memuat jadwal yang tersedia. <br />{" "}
                Silakan coba muat ulang halaman.
            </div>
        );
    }

    const { title, features, price } = selectedPackage;
    const isPhoneInvalid = errors.phone || errors.phoneFormat;
    return (
        <div className="min-h-screen p-0 md:p-12">
            <motion.div
                className="max-w-2xl mx-auto bg-white p-4 md:p-6 md:rounded-2xl shadow-md pb-12 md:mb-0"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants}>
                    <div className="flex items-center text-gray-700 mb-2">
                        <Link href="/#schedule">
                            <ArrowLeft className="inline-block mr-1 cursor-pointer hover:scale-105 transition-transform duration-300" />
                        </Link>
                        <h2 className="text-lg lg:text-xl font-semibold">
                            Formulir Booking
                        </h2>
                    </div>
                    <p className="text-sm lg:text-base text-gray-500 mb-4">
                        Lengkapi data diri, deskripsi opsional, dan pilih jadwal
                        Anda.
                    </p>
                </motion.div>

                <motion.div
                    className="bg-teal-50 border border-teal-200 p-4 rounded-xl mb-4 space-y-3"
                    variants={itemVariants}
                >
                    <h3 className="text-xl font-semibold text-teal-800">
                        {title}
                    </h3>
                    <p className="text-2xl font-bold text-teal-600">{price}</p>
                    <ul className="text-teal-700 text-sm space-y-2 pt-2">
                        {features.map((feature, i) => (
                            <li key={i} className="flex items-center">
                                <span className="text-green-500 mr-2">
                                    &#10003;
                                </span>
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                <div
                    className="space-y-6"
                    onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                >
                    <motion.div variants={itemVariants}>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Nama Lengkap
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`block w-full border shadow-sm py-2 px-3 rounded-lg focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
                                errors.name
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.name}
                            </p>
                        )}
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Nomor Telepon
                        </label>
                        <div className="flex items-center">
                            <span
                                className={`inline-flex items-center px-3 py-2 border border-r-0 bg-gray-50 text-gray-500 rounded-l-lg ${
                                    isPhoneInvalid
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                            >
                                +62
                            </span>
                            <input
                                type="tel"
                                id="phone"
                                value={formattedPhone}
                                onChange={handleInputChange}
                                placeholder="812-3456-7890"
                                className={`block w-full border shadow-sm py-2 px-3 rounded-r-lg focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
                                    isPhoneInvalid
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                            />
                        </div>
                        {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.phone}
                            </p>
                        )}
                        {errors.phoneFormat && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.phoneFormat}
                            </p>
                        )}
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tanggal & Waktu Pilihan
                        </label>
                        <BookingCalendar
                            onDateTimeChange={handleDateTimeChange}
                            bookedDates={bookedDates.map((date) =>
                                new Date(date).toISOString()
                            )}
                        />
                        {errors.date && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.date}
                            </p>
                        )}
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Deskripsi (Opsional)
                        </label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={3}
                            className="block w-full border border-gray-300 shadow-sm py-2 px-3 rounded-lg min-h-[100px] focus:outline-none focus:ring-teal-500 focus:border-teal-500 placeholder:text-gray-400 placeholder:text-sm"
                            placeholder="Detail tambahan tentang sesi foto Anda..."
                        />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <TermsModal />
                    </motion.div>

                    <motion.button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={`w-full py-3 rounded-full font-semibold text-white flex items-center justify-center ${
                            isLoading
                                ? "bg-teal-600/50 cursor-not-allowed"
                                : "bg-gradient-to-br from-teal-200 via-teal-700 to-teal-400 hover:bg-none hover:bg-teal-600 hover:shadow-md"
                        }`}
                        variants={itemVariants}
                    >
                        {isLoading && (
                            <Loader2 className="animate-spin h-5 w-5 mr-3" />
                        )}
                        {isLoading ? "Mengirim..." : "Booking Sekarang"}
                    </motion.button>

                    {errors.submit && (
                        <p className="text-red-500 text-xs mt-1 text-center">
                            {errors.submit}
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
