import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import SweetAlert from "../../SweetAlert";
import DotLoader from "../../loading/DotLoader";
import GalleryModal from "../../modal/GalleryModal";
import { containerVariants, itemVariants } from "../../../utils/animations";
import { fetcher, deleteImage } from "../../../utils/api";
import toast from "react-hot-toast";
import { useAuth } from "../../../Context/useAuth";
import useSWR from "swr";
import { usePage } from "@inertiajs/react";

export default function KelolaGaleri() {
    const { token } = useAuth();
    const { url } = usePage();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    const scrollContainerRef = useRef(null);
    const btnRefs = useRef([]);

    const { data, error, isLoading, mutate } = useSWR(
        token ? ["/gallery", token] : null,
        fetcher,
        {
            revalidateOnFocus: true,
            revalidateIfStale: false,
            shouldRetryOnError: false,
            onError: (err) => {
                toast.error("Gagal memuat data galeri.");
                console.error("Failed to fetch gallery data:", err);
            },
        }
    );

    useEffect(() => {
        if (token) {
            mutate();
        }
    }, [token, mutate, url]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const mq = window.matchMedia("(pointer: coarse)");
            setIsTouchDevice(mq.matches);
            const onChange = (e) => setIsTouchDevice(e.matches);
            mq.addEventListener("change", onChange);
            return () => mq.removeEventListener("change", onChange);
        }
    }, []);

    const checkScroll = useCallback(() => {
        const c = scrollContainerRef.current;
        if (!c) return;
        const { scrollLeft, scrollWidth, clientWidth } = c;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }, []);

    useEffect(() => {
        const c = scrollContainerRef.current;
        if (c) {
            checkScroll();
            c.addEventListener("scroll", checkScroll);
            window.addEventListener("resize", checkScroll);
            return () => {
                if (c) c.removeEventListener("scroll", checkScroll);
                window.removeEventListener("resize", checkScroll);
            };
        }
    }, [data, checkScroll]);

    const handleScroll = (offset) => {
        scrollContainerRef.current?.scrollBy({
            left: offset,
            behavior: "smooth",
        });
    };

    const handleCategoryClick = (category, idx) => {
        setSelectedCategory(category);
        const c = scrollContainerRef.current;
        const b = btnRefs.current[idx];
        if (c && b) {
            const target = b.offsetLeft - c.clientWidth / 2 + b.offsetWidth / 2;
            c.scrollTo({ left: target, behavior: "smooth" });
        }
    };

    const openModal = (index) => {
        setSelectedImageIndex(index);
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    const handleDelete = async (imageId, filename) => {
        if (typeof imageId === "undefined") {
            toast.error("Gagal menghapus: ID gambar tidak valid.");
            return;
        }

        const confirmed = await SweetAlert({
            title: "Konfirmasi Hapus",
            message: `Yakin ingin menghapus <b>${filename}</b>?`,
            icon: "warning",
            showCancel: true,
        });
        if (!confirmed) return;

        setIsDeleting(true);
        try {
            await mutate(
                (currentData) => {
                    if (!currentData) return { images: [], categories: [] };
                    const updatedImages = currentData.images.filter(
                        (img) => img.id !== imageId
                    );
                    return { ...currentData, images: updatedImages };
                },
                { revalidate: false }
            );

            await deleteImage(imageId, token);

            await mutate();

            await SweetAlert({
                title: "Berhasil!",
                message: `Gambar <b>${filename}</b> berhasil dihapus.`,
                icon: "success",
                showCancel: false,
            });
        } catch (err) {
            await mutate();
            await SweetAlert({
                title: "Error",
                message: err.message || "Gagal menghapus gambar.",
                icon: "error",
                showCancel: false,
            });
        } finally {
            setIsDeleting(false);
        }
    };

    if (!token) {
        return (
            <div className="p-8 text-center text-red-500 flex justify-center items-center h-full">
                Tidak ada token autentikasi. Harap login.
            </div>
        );
    }

    if (error)
        return (
            <div className="p-8 text-center text-red-500">
                Gagal memuat data galeri.
            </div>
        );
    if (isLoading)
        return (
            <div className="flex justify-center items-center h-full">
                <DotLoader />
            </div>
        );

    if (data && (!data.images || data.images.length === 0))
        return (
            <div className="p-8 text-center text-gray-500 flex justify-center items-center h-full">
                Tidak ada data gambar.
            </div>
        );

    const { images, categories } = data;
    const allCategories = ["All", ...new Set(categories)];
    const filteredImages =
        selectedCategory === "All"
            ? images
            : images.filter((img) =>
                  img.categories?.includes(selectedCategory)
              );

    const dragProps = isTouchDevice
        ? {
              drag: "x",
              dragConstraints: { left: 0, right: 0 },
              dragElastic: 0.2,
              onDrag: (_, info) => {
                  if (scrollContainerRef.current) {
                      scrollContainerRef.current.scrollLeft -= info.delta.x;
                  }
              },
          }
        : {};

    return (
        <motion.div
            className="p-0 lg:p-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {isDeleting && (
                <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
                    <DotLoader />
                </div>
            )}
            <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; -webkit-overflow-scrolling: touch; touch-action: pan-x; }
      `}</style>
            <motion.div
                className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-md"
                variants={itemVariants}
            >
                <h1 className="text-base lg:text-lg font-semibold text-gray-600 mb-4">
                    Kelola Galeri{" "}
                    <span className="text-sm lg:text-base">
                        ({filteredImages.length} Gambar)
                    </span>
                </h1>
                <div className="relative w-full max-w-4xl mx-auto mb-8">
                    {canScrollLeft && (
                        <motion.button
                            onClick={() => handleScroll(-250)}
                            className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-300 hidden md:flex items-center justify-center"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </motion.button>
                    )}
                    <motion.div
                        ref={scrollContainerRef}
                        className="flex items-center gap-3 overflow-x-auto whitespace-nowrap px-2 py-2 no-scrollbar"
                        {...dragProps}
                    >
                        {allCategories.map((category, idx) => (
                            <button
                                key={category}
                                ref={(el) => (btnRefs.current[idx] = el)}
                                onClick={() =>
                                    handleCategoryClick(category, idx)
                                }
                                className={`px-4 py-1.5 text-sm font-semibold rounded-full shrink-0 transition-all duration-300 ${
                                    selectedCategory === category
                                        ? "bg-teal-500 text-white shadow-md"
                                        : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </motion.div>
                    {canScrollRight && (
                        <motion.button
                            onClick={() => handleScroll(250)}
                            className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-300 hidden md:flex items-center justify-center"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-700" />
                        </motion.button>
                    )}
                </div>
                <motion.div
                    key={selectedCategory + filteredImages.length}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-min grid-flow-dense"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {filteredImages.length === 0 ? (
                        <div className="col-span-full text-center py-16 text-gray-500">
                            Tidak ada gambar untuk kategori "{selectedCategory}
                            ".
                        </div>
                    ) : (
                        filteredImages.map((image, index) => {
                            const aspectRatio = image.aspect_ratio || 1;
                            let rowSpan = Math.round((1 / aspectRatio) * 20);

                            if (window.innerWidth < 768 && aspectRatio < 1) {
                                rowSpan = Math.min(rowSpan, 20);
                            }
                            return (
                                <motion.div
                                    key={image.id}
                                    className={`relative group overflow-hidden rounded-lg shadow-sm cursor-pointer`}
                                    style={{ gridRowEnd: `span ${rowSpan}` }}
                                    variants={itemVariants}
                                    onClick={() => openModal(index)}
                                >
                                    <img
                                        src={image.url}
                                        alt={image.filename}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(
                                                    image.id,
                                                    image.filename
                                                );
                                            }}
                                            className="p-3 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 hover:bg-red-600"
                                            title="Hapus Gambar"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                                        <p className="text-white text-xs font-medium truncate">
                                            {image.categories?.join(", ")}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </motion.div>
            </motion.div>
            <AnimatePresence>
                {modalOpen && (
                    <GalleryModal
                        images={filteredImages.map((img) => ({
                            src: img.url,
                            alt: img.filename,
                            categories: img.categories,
                            width: img.width,
                            height: img.height,
                            aspectRatio: img.aspect_ratio,
                        }))}
                        startIndex={selectedImageIndex}
                        onClose={closeModal}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}
