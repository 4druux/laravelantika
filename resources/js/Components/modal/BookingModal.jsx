import { X, Package, FileText, CalendarClock, User, Phone } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { schedulePackages } from "@/Data/packages";

const formatSessionDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatCreationDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
};

const StatusBadge = ({ status }) => {
    const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
    const statusClasses = {
        PENDING: "bg-yellow-100 text-yellow-700",
        CONFIRMED: "bg-green-100 text-green-700",
        CANCELLED: "bg-red-100 text-red-700",
    };
    return (
        <span className={`${baseClasses} ${statusClasses[status]}`}>
            {status}
        </span>
    );
};

export default function BookingModal({ booking, isOpen, onClose }) {
    if (!booking) return null;

    const pkg = schedulePackages.find((p) => p.title === booking.paket);

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-end md:items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="w-full h-full md:h-auto md:max-w-xl bg-white md:rounded-2xl shadow-2xl flex flex-col"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b">
                            <h2 className="text-base md:text-xl font-medium text-gray-600">
                                Detail Booking
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors group"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5 group-hover:-rotate-45 transition duration-300 ease-in-out" />
                            </button>
                        </div>

                        <div className="flex-grow px-6 py-5 space-y-6 overflow-y-auto">
                            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full font-mono text-sm">
                                        {booking.public_id}
                                    </span>
                                    <StatusBadge status={booking.status} />
                                </div>
                            </div>

                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                <div>
                                    <dt className="flex items-center text-gray-500 text-sm font-medium">
                                        <User className="w-4 h-4 mr-1" /> Nama
                                    </dt>
                                    <dd className="text-sm md:text-base font-medium mt-1 text-gray-700">
                                        {booking.nama}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="flex items-center text-gray-500 text-sm font-medium">
                                        <Phone className="w-4 h-4 mr-1" />{" "}
                                        Kontak
                                    </dt>
                                    <dd className="text-sm md:text-base font-medium mt-1 text-gray-700">
                                        {booking.telepon}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="flex items-center text-gray-500 text-sm font-medium">
                                        <CalendarClock className="w-4 h-4 mr-1" />{" "}
                                        Jadwal Sesi
                                    </dt>
                                    <dd className="text-sm md:text-base font-medium mt-1 text-gray-700">
                                        {formatSessionDate(
                                            booking.tanggal_booking
                                        )}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500 text-sm font-medium">
                                        Paket
                                    </dt>
                                    <dd className="text-sm md:text-base font-medium mt-1 text-gray-700">
                                        {booking.paket}
                                    </dd>
                                </div>
                            </dl>

                            {pkg && (
                                <div className="border border-teal-200 p-4 rounded-lg bg-teal-50">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-2">
                                            <Package className="w-5 h-5 text-teal-600" />
                                            <h3 className="text-base md:text-lg font-medium text-teal-700">
                                                {pkg.title}
                                            </h3>
                                        </div>
                                        <span className="text-base md:text-lg font-semibold text-teal-600">
                                            {pkg.price}
                                        </span>
                                    </div>
                                    <ul className="list-disc list-inside text-teal-700 space-y-1 pl-4 text-sm md:text-base">
                                        {pkg.features.map((f, idx) => (
                                            <li key={idx}>{f}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {booking.catatan && (
                                <div className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                                    <div className="flex items-center mb-2 text-gray-700">
                                        <FileText className="w-5 h-5 mr-2" />
                                        <h4 className="font-semibold">
                                            Catatan Pemesan
                                        </h4>
                                    </div>
                                    <p className="text-gray-800 text-sm whitespace-pre-wrap">
                                        {booking.catatan}
                                    </p>
                                </div>
                            )}

                            <div className="text-xs text-gray-500">
                                <p>
                                    Dibuat:{" "}
                                    {formatCreationDate(booking.created_at)}
                                </p>
                                <p>
                                    Diperbarui:{" "}
                                    {formatCreationDate(booking.updated_at)}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
