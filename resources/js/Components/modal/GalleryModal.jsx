import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ChevronLeft, ChevronRight, X } from "lucide-react";

const Pagination = ({ count, currentIndex, goTo }) => {
  const maxVisibleDots = 5;

  if (count <= maxVisibleDots) {
    return (
      <div className="flex justify-center items-center gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <Dot
            key={index}
            isActive={currentIndex === index}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    );
  }

  const half = Math.floor(maxVisibleDots / 2);
  let start = Math.max(currentIndex - half, 0);
  let end = start + maxVisibleDots;

  if (end > count) {
    start = count - maxVisibleDots;
    end = count;
  }

  const dots = Array.from({ length: end - start }).map((_, i) => start + i);

  return (
    <div className="flex justify-center items-center gap-2">
      {dots.map((index) => (
        <Dot
          key={index}
          isActive={currentIndex === index}
          onClick={() => goTo(index)}
        />
      ))}
    </div>
  );
};

const Dot = ({ isActive, onClick, label }) => {
  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      animate={{
        width: isActive ? "1.5rem" : "0.5rem",
        backgroundColor: isActive
          ? "rgba(255, 255, 255, 1)"
          : "rgba(255, 255, 255, 0.5)",
      }}
      layout
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="h-2 rounded-full flex items-center justify-center"
      aria-label={`Go to item ${label || ""}`}
    >
      {label && <span className="text-black text-xs font-bold">{label}</span>}
    </motion.button>
  );
};

const GalleryModal = ({ images, startIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const changeImage = useCallback(
    (newIndex) => {
      if (newIndex < 0) newIndex = images.length - 1;
      if (newIndex >= images.length) newIndex = 0;

      setDirection(newIndex > currentIndex ? 1 : -1);
      setCurrentIndex(newIndex);
    },
    [currentIndex, images.length]
  );

  const handleNext = useCallback(() => {
    changeImage(currentIndex + 1);
  }, [changeImage, currentIndex]);

  const handlePrev = useCallback(() => {
    changeImage(currentIndex - 1);
  }, [changeImage, currentIndex]);

  const handleDragEnd = useCallback(
    (event, info) => {
      const swipeThreshold = 50;
      if (info.offset.x > swipeThreshold) {
        handlePrev();
      } else if (info.offset.x < -swipeThreshold) {
        handleNext();
      }
    },
    [handlePrev, handleNext]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  const imageVariants = {
    enter: (direction) => ({
      x: direction > 0 ? "100vw" : "-100vw",
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      zIndex: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? "100vw" : "-100vw",
      opacity: 0,
      scale: 0.8,
      zIndex: 0,
    }),
  };

  const transitionConfig = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.4,
  };

  const currentImage = images[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white z-50 p-2 bg-black/50 rounded-full hover:bg-black/80 transition-colors"
        onClick={onClose}
        aria-label="Close modal"
      >
        <X size={24} />
      </button>

      <div className="hidden md:block">
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white z-50 p-2 bg-black/50 rounded-full hover:bg-black/80 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          aria-label="Previous image"
        >
          <ChevronLeft size={32} />
        </button>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white z-50 p-2 bg-black/50 rounded-full hover:bg-black/80 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          aria-label="Next image"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      <div
        className="relative w-full flex-grow flex items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            className="absolute w-full h-full flex items-center justify-center p-4 md:p-16"
            custom={direction}
            variants={imageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transitionConfig}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            <img
              src={currentImage.src}
              alt={currentImage.alt}
              className="object-contain max-w-full max-h-full shadow-2xl rounded-lg"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 p-4 z-50 flex flex-col items-center gap-4 bg-gradient-to-t from-black/80 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2">
          <Pagination
            count={images.length}
            currentIndex={currentIndex}
            goTo={changeImage}
          />
        </div>

        {currentImage.categories && currentImage.categories.length > 0 && (
          <div className="flex items-center justify-center gap-2 text-white/90 bg-white/30 w-fit mx-auto py-2 px-4 rounded-full">
            <Camera size={16} />
            <p className="text-sm">{currentImage.categories.join(", ")}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GalleryModal;
