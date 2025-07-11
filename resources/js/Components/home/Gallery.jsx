import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import Tittle from "../text/Tittle";
import Description from "../text/Description";
import DotLoader from "../loading/DotLoader";
import GalleryModal from "../modal/GalleryModal";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { containerVariants, itemVariants } from "../../utils/animations";
import { fetcher } from "../../utils/api";
import toast from "react-hot-toast";

export default function Gallery() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [visibleCount, setVisibleCount] = useState(10);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const scrollContainerRef = useRef(null);
    const btnRefs = useRef([]);

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    const { data, error, isLoading } = useSWR(["/gallery"], fetcher, {
        revalidateOnFocus: true,
        revalidateIfStale: false,
        shouldRetryOnError: false,
        onError: (err) => {
            toast.error("Gagal memuat data galeri.");
            console.error("Failed to fetch gallery data:", err);
        },
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const mq = window.matchMedia("(pointer: coarse)");
            setIsTouchDevice(mq.matches);
            const handler = (e) => setIsTouchDevice(e.matches);
            mq.addEventListener("change", handler);
            return () => mq.removeEventListener("change", handler);
        }
    }, []);

    const checkScroll = () => {
        const c = scrollContainerRef.current;
        if (c) {
            const { scrollLeft, scrollWidth, clientWidth } = c;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
        }
    };

    useEffect(() => {
        const c = scrollContainerRef.current;
        if (c) {
            checkScroll();
            c.addEventListener("scroll", checkScroll);
            window.addEventListener("resize", checkScroll);
            return () => {
                if (c) {
                    c.removeEventListener("scroll", checkScroll);
                }
                window.removeEventListener("resize", checkScroll);
            };
        }
    }, [data]);

    const handleScroll = (offset) => {
        const c = scrollContainerRef.current;
        if (c) {
            c.scrollBy({ left: offset, behavior: "smooth" });
        }
    };

    const handleCategoryClick = (category, idx) => {
        setSelectedCategory(category);
        setVisibleCount(10);
        const c = scrollContainerRef.current;
        const b = btnRefs.current[idx];
        if (c && b) {
            const scrollTo =
                b.offsetLeft - c.clientWidth / 2 + b.offsetWidth / 2;
            c.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    const openModal = (index) => {
        setSelectedImageIndex(index);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    if (error)
        return (
            <div className="text-center py-12 text-red-500">
                Gagal memuat galeri.
            </div>
        );
    if (isLoading || !data)
        return (
            <div className="flex justify-center py-20">
                <DotLoader />
            </div>
        );

    const { images, categories } = data;
    const allCategories = ["All", ...new Set(categories)];
    const filteredImages =
        selectedCategory === "All"
            ? images
            : images.filter(
                  (img) =>
                      img.categories &&
                      img.categories.includes(selectedCategory)
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
        <section className="pt-12 md:pt-24">
            <style>
                {`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
            touch-action: pan-x;
          }
        `}
            </style>
            <div className="container mx-auto px-4">
                <motion.div
                    className="text-center mb-4"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <motion.div variants={itemVariants}>
                        <Tittle text="Galeri Momen" />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Description
                            text="Setiap gambar memiliki cerita. Inilah beberapa di antaranya, disajikan dalam komposisi yang indah."
                            className="mt-2 max-w-2xl mx-auto"
                        />
                    </motion.div>
                </motion.div>

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
                        className="flex items-center gap-3 overflow-x-auto whitespace-nowrap py-1 no-scrollbar"
                        {...dragProps}
                    >
                        {allCategories.map((category, idx) => (
                            <button
                                key={category}
                                ref={(el) => (btnRefs.current[idx] = el)}
                                onClick={() =>
                                    handleCategoryClick(category, idx)
                                }
                                className={`px-5 py-2 text-sm font-semibold rounded-full shrink-0 transition-all duration-300 ${
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
                    key={selectedCategory + visibleCount}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-min"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {filteredImages
                        .slice(0, visibleCount)
                        .map((image, index) => {
                            const aspectRatio = image.aspect_ratio || 1;
                            let rowSpan = Math.round((1 / aspectRatio) * 20);

                            if (window.innerWidth < 768 && aspectRatio < 1) {
                                rowSpan = Math.min(
                                    rowSpan,
                                    Math.round((1 / aspectRatio) * 10)
                                );
                                rowSpan = Math.min(rowSpan, 20);
                            }

                            return (
                                <motion.div
                                    key={`${image.id}-${index}`}
                                    className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer"
                                    style={{ gridRowEnd: `span ${rowSpan}` }}
                                    variants={itemVariants}
                                    onClick={() => openModal(index)}
                                >
                                    <img
                                        src={image.url}
                                        alt={image.filename}
                                        className="object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105"
                                    />

                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 p-2">
                                        {image.categories &&
                                            image.categories.length > 0 && (
                                                <div className="flex items-center justify-center gap-2 text-white/90 bg-white/30 w-fit mx-auto py-1 px-3 rounded-full">
                                                    <Camera
                                                        size={24}
                                                        className="mb-1"
                                                    />
                                                    <p className="text-xs font-medium">
                                                        {image.categories.join(
                                                            ", "
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                    </div>
                                </motion.div>
                            );
                        })}
                </motion.div>

                {visibleCount < filteredImages.length && (
                    <div className="text-center mt-8">
                        <button
                            onClick={() => setVisibleCount((prev) => prev + 10)}
                            className="px-6 py-3  bg-gradient-to-br from-teal-200 via-teal-700 to-teal-400 rounded-full hover:opacity-85 transiton duration-300 text-white text-sm font-semibold"
                        >
                            Muat Lebih Banyak
                        </button>
                    </div>
                )}

                {filteredImages.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16 text-gray-500"
                    >
                        Tidak ada gambar untuk kategori "{selectedCategory}".
                    </motion.div>
                )}
            </div>

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
        </section>
    );
}
