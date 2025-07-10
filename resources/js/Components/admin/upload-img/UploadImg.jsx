import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import { useDropzone } from "react-dropzone";
import { canvasPreview } from "./canvasPreview";
import "react-image-crop/dist/ReactCrop.css";
import {
    UploadCloud,
    Scissors,
    Check,
    Tags,
    FileImage,
    Trash2,
    ListCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "../../../utils/animations";
import DotLoader from "../../loading/DotLoader";
import { uploadImage } from "../../../utils/api";
import { useAuth } from "../../../Context/useAuth";

const resizeImage = (file) => {
    const MAX_DIMENSION = 1920;
    const QUALITY = 0.8;
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                let { width, height } = img;
                if (width > height) {
                    if (width > MAX_DIMENSION) {
                        height *= MAX_DIMENSION / width;
                        width = MAX_DIMENSION;
                    }
                } else {
                    if (height > MAX_DIMENSION) {
                        width *= MAX_DIMENSION / height;
                        height = MAX_DIMENSION;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(
                    (blob) => {
                        resolve(
                            new File([blob], file.name, {
                                type: "image/jpeg",
                                lastModified: Date.now(),
                            })
                        );
                    },
                    "image/jpeg",
                    QUALITY
                );
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
};

const photoCategories = [
    "Couple",
    "Family",
    "Group",
    "Graduation",
    "Maternity",
    "Pass Foto",
    "Pre-Wedding",
    "Produk",
    "Ulang Tahun",
    "Session",
    "Post Wedding",
    "Foto OOTD",
    "Foto Lain",
];

const imageRatios = [
    { label: "Landscape", value: 16 / 9 },
    { label: "Square", value: 1 / 1 },
    { label: "Portrait", value: 4 / 5 },
    { label: "Tall", value: 9 / 16 },
];

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
        makeAspectCrop(
            { unit: "%", width: 90 },
            aspect,
            mediaWidth,
            mediaHeight
        ),
        mediaWidth,
        mediaHeight
    );
}

const CroppedGallery = ({
    croppedImages,
    onEdit,
    onUpload,
    isUploading,
    uploadProgress,
}) => (
    <motion.div
        className="w-full max-w-4xl mx-auto p-4 lg:p-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
    >
        {isUploading && (
            <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
                <DotLoader
                    text={`Mengunggah ${uploadProgress.current} dari ${uploadProgress.total} gambar...`}
                />
            </div>
        )}
        <motion.div
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
            variants={itemVariants}
        >
            <h1 className="text-base lg:text-lg font-semibold text-gray-600 mb-4">
                Selesai di-crop ({croppedImages.length} gambar)
            </h1>
            <motion.div
                className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-4 mb-6"
                variants={containerVariants}
            >
                {croppedImages.map((img) => (
                    <motion.div
                        key={img.id}
                        className="relative group aspect-square"
                        variants={itemVariants}
                    >
                        <img
                            src={img.src}
                            alt="Cropped"
                            className="w-full h-full object-cover rounded-lg shadow-sm"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                            <p className="text-white text-xs text-center p-1">
                                {img.categories.join(", ") || "No Category"}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
            <div className="flex justify-end items-center mt-8 lg:mt-12 gap-4">
                <button
                    onClick={onEdit}
                    disabled={isUploading}
                    className="px-6 py-3 border border-teal-500 text-teal-500 text-sm font-semibold rounded-full hover:bg-teal-600 hover:text-white transition-colors disabled:opacity-50"
                >
                    Edit lagi
                </button>
                <button
                    onClick={onUpload}
                    disabled={isUploading}
                    className="px-6 py-3 bg-gradient-to-br from-teal-200 via-teal-700 to-teal-400 text-white text-sm font-semibold rounded-full hover:bg-none hover:bg-teal-600 disabled:opacity-50"
                >
                    {isUploading ? "Mengunggah..." : "Upload"}
                </button>
            </div>
        </motion.div>
    </motion.div>
);

export default function UploadImg() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState();
    const [aspect, setAspect] = useState(16 / 9);
    const [imageQueue, setImageQueue] = useState([]);
    const [croppedImages, setCroppedImages] = useState([]);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({
        current: 0,
        total: 0,
    });

    const previewCanvasRef = useRef(null);
    const imgRef = useRef(null);
    const activeImage = activeIndex >= 0 ? imageQueue[activeIndex] : null;

    const onDrop = useCallback(
        async (acceptedFiles) => {
            const MAX_FILE_SIZE = 5 * 1024 * 1024;
            let errorShown = false;
            const validFiles = acceptedFiles.filter((file) => {
                if (file.size > MAX_FILE_SIZE) {
                    if (!errorShown) {
                        toast.error(
                            `Ukuran file "${file.name}" terlalu besar. Maksimal 5 MB.`
                        );
                        errorShown = true;
                    }
                    return false;
                }
                return true;
            });

            if (validFiles.length > 0) {
                setIsProcessing(true);
                const resizedFiles = await Promise.all(
                    validFiles.map(resizeImage)
                );
                setIsProcessing(false);
                const newImages = resizedFiles.map((file) => ({
                    original: URL.createObjectURL(file),
                    name: file.name,
                    id: `${file.name}-${Date.now()}`,
                    categories: [],
                }));
                setImageQueue((prev) => [...prev, ...newImages]);
                if (activeIndex === -1) {
                    setActiveIndex(0);
                }
            }
        },
        [activeIndex]
    );

    const onImageLoad = useCallback(
        (e) => {
            if (e.currentTarget.src !== activeImage?.original) return;
            const { width, height } = e.currentTarget;
            const newCrop = centerAspectCrop(width, height, aspect);
            setCrop(newCrop);
        },
        [aspect, activeImage]
    );

    function handleAspectChange(newAspect) {
        setAspect(newAspect);
        if (imgRef.current) {
            const { width, height } = imgRef.current;
            const newCrop = centerAspectCrop(width, height, newAspect);
            setCrop(newCrop);
        }
    }

    const handleCategoryToggle = (category) => {
        setImageQueue((prev) =>
            prev.map((img, index) => {
                if (index === activeIndex) {
                    const newCategories = img.categories.includes(category)
                        ? img.categories.filter((c) => c !== category)
                        : [...img.categories, category];
                    return { ...img, categories: newCategories };
                }
                return img;
            })
        );
    };

    const handleRemoveFromQueue = (indexToRemove) => {
        const newQueue = imageQueue.filter(
            (_, index) => index !== indexToRemove
        );
        setImageQueue(newQueue);
        setCroppedImages((prev) =>
            prev.filter((img) => img.id !== imageQueue[indexToRemove].id)
        );
        if (newQueue.length === 0) {
            setActiveIndex(-1);
        } else if (indexToRemove < activeIndex) {
            setActiveIndex((prev) => prev - 1);
        } else if (
            indexToRemove === activeIndex &&
            indexToRemove >= newQueue.length
        ) {
            setActiveIndex(newQueue.length - 1);
        }
    };

    const handleCropAndNext = async () => {
        if (
            completedCrop &&
            previewCanvasRef.current &&
            imgRef.current &&
            activeImage &&
            activeImage.categories.length > 0
        ) {
            await canvasPreview(
                imgRef.current,
                previewCanvasRef.current,
                completedCrop
            );
            const dataUrl = previewCanvasRef.current.toDataURL("image/png");
            const width = previewCanvasRef.current.width;
            const height = previewCanvasRef.current.height;
            setCroppedImages((prev) => [
                ...prev.filter((img) => img.id !== activeImage.id),
                {
                    src: dataUrl,
                    name: activeImage.name,
                    categories: activeImage.categories,
                    id: activeImage.id,
                    width: width,
                    height: height,
                },
            ]);
            if (activeIndex < imageQueue.length - 1) {
                setActiveIndex((prev) => prev + 1);
            } else {
                setActiveIndex(-1);
            }
        } else {
            toast.error("Harap pilih setidaknya satu kategori.");
        }
    };

    function dataURLtoFile(dataurl, filename) {
        let arr = dataurl.split(","),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    async function handleUploadAll() {
        if (croppedImages.length === 0) {
            toast.error("Tidak ada gambar untuk di-upload.");
            return;
        }
        setIsUploading(true);
        setUploadProgress({ current: 0, total: croppedImages.length });

        let successfulUploads = 0;
        const failedUploads = [];

        for (let i = 0; i < croppedImages.length; i++) {
            const image = croppedImages[i];
            setUploadProgress({ current: i + 1, total: croppedImages.length });
            const formData = new FormData();
            const file = dataURLtoFile(image.src, image.name);
            formData.append("images[]", file);
            formData.append(
                "metadata",
                JSON.stringify({
                    categories: image.categories,
                    width: image.width,
                    height: image.height,
                })
            );

            try {
                await uploadImage(formData, token);
                successfulUploads++;
            } catch (error) {
                failedUploads.push({ name: image.name, reason: error.message });
                console.error(`Error saat upload ${image.name}:`, error);
            }
        }

        setIsUploading(false);

        if (failedUploads.length > 0) {
            toast.error(`Gagal mengunggah ${failedUploads.length} gambar.`);
        }

        if (successfulUploads > 0) {
            toast.success(`${successfulUploads} gambar berhasil di-upload.`);

            if (failedUploads.length === 0) {
                navigate("/admin/kelola-galeri");
            }
        }
    }

    useEffect(() => {
        setCrop(undefined);
        setCompletedCrop(undefined);
    }, [activeIndex]);

    useEffect(() => {
        if (
            completedCrop?.width &&
            completedCrop?.height &&
            imgRef.current &&
            previewCanvasRef.current
        ) {
            canvasPreview(
                imgRef.current,
                previewCanvasRef.current,
                completedCrop
            );
        }
    }, [completedCrop]);

    const {
        getRootProps: mainGetRootProps,
        getInputProps: mainGetInputProps,
        isDragActive: isMainDragActive,
    } = useDropzone({
        accept: { "image/*": [] },
        onDrop,
        noClick: false,
    });

    const {
        getRootProps: queueGetRootProps,
        getInputProps: queueGetInputProps,
        isDragActive: isQueueDragActive,
    } = useDropzone({
        accept: { "image/*": [] },
        onDrop,
        noClick: false,
    });

    if (isProcessing) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <DotLoader />
            </div>
        );
    }

    if (
        activeIndex === -1 &&
        croppedImages.length > 0 &&
        imageQueue.length > 0
    ) {
        return (
            <CroppedGallery
                croppedImages={croppedImages}
                onEdit={() => setActiveIndex(0)}
                onUpload={handleUploadAll}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
            />
        );
    }

    const isPanelDisabled = imageQueue.length === 0;

    return (
        <motion.div
            className="w-full bg-gray-50 min-h-screen lg:p-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-3rem)]">
                <motion.div
                    className="flex-grow lg:w-2/3"
                    variants={itemVariants}
                >
                    <div className="p-6 bg-white lg:rounded-2xl shadow-sm border border-gray-200 h-full">
                        {activeImage ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                                <div className="space-y-4">
                                    <h1 className="text-base lg:text-lg font-semibold text-gray-600 mb-4">
                                        Potong Gambar ({activeIndex + 1}/
                                        {imageQueue.length})
                                    </h1>
                                    <div className="w-full aspect-[16/9] bg-gray-100 rounded-xl flex items-center justify-center p-2">
                                        <ReactCrop
                                            crop={crop}
                                            onChange={(_, percentCrop) =>
                                                setCrop(percentCrop)
                                            }
                                            onComplete={(c) =>
                                                setCompletedCrop(c)
                                            }
                                            aspect={aspect}
                                        >
                                            <img
                                                ref={imgRef}
                                                alt="Crop area"
                                                src={activeImage.original}
                                                onLoad={onImageLoad}
                                                style={{
                                                    display: "block",
                                                    maxHeight: "100%",
                                                    maxWidth: "100%",
                                                }}
                                            />
                                        </ReactCrop>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h1 className="text-base lg:text-lg font-semibold text-gray-600 mb-4">
                                        Preview
                                    </h1>
                                    <div className="w-full aspect-[16/9] bg-gray-100 rounded-xl flex items-center justify-center p-2">
                                        {completedCrop?.width ? (
                                            <canvas
                                                ref={previewCanvasRef}
                                                className="rounded-lg shadow-inner"
                                                style={{
                                                    aspectRatio: aspect,
                                                    maxWidth: "100%",
                                                    maxHeight: "100%",
                                                    objectFit: "contain",
                                                }}
                                            />
                                        ) : (
                                            <div className="text-center text-sm text-gray-400">
                                                <p>Arahkan area potong</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div
                                {...mainGetRootProps()}
                                className={`flex flex-col items-center justify-center h-full p-4 text-center text-gray-500 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                                    isMainDragActive
                                        ? "border-teal-500 bg-teal-50 text-teal-600"
                                        : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                                }`}
                            >
                                <input {...mainGetInputProps()} />
                                <UploadCloud className="h-12 w-12 mb-4" />
                                <h2 className="text-sm lg:text-lg font-medium">
                                    Pilih atau Seret Gambar ke Sini
                                </h2>
                                <p className="max-w-xs text-xs lg:text-sm">
                                    Anda bisa memilih banyak gambar sekaligus
                                    untuk memulai.
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
                <motion.div
                    className="lg:w-1/3 flex-shrink-0"
                    variants={itemVariants}
                >
                    <div className="p-6 bg-white lg:rounded-2xl shadow-sm border border-gray-200 h-full flex flex-col">
                        <div
                            className={`flex flex-col flex-grow min-h-0 space-y-6 transition-opacity duration-300 ${
                                isPanelDisabled
                                    ? "opacity-40 pointer-events-none"
                                    : ""
                            }`}
                        >
                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm md:text-base font-semibold text-gray-700 flex items-center mb-3">
                                        <Scissors
                                            size={18}
                                            className="mr-2 text-gray-500"
                                        />{" "}
                                        Pilih Rasio
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {imageRatios.map((r) => (
                                            <button
                                                key={r.label}
                                                onClick={() =>
                                                    handleAspectChange(r.value)
                                                }
                                                className={`px-3 py-2 text-xs md:text-sm font-medium rounded-lg transition-all ${
                                                    aspect === r.value
                                                        ? "bg-teal-500 text-white shadow"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                }`}
                                            >
                                                {r.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm md:text-base font-semibold text-gray-700 flex items-center mb-3">
                                        <Tags
                                            size={18}
                                            className="mr-2 text-gray-500"
                                        />{" "}
                                        Pilih Kategori
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {photoCategories.map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() =>
                                                    handleCategoryToggle(cat)
                                                }
                                                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                                                    activeImage?.categories.includes(
                                                        cat
                                                    )
                                                        ? "bg-teal-600 text-white"
                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col flex-grow min-h-0">
                                <label className="text-sm md:text-base font-semibold text-gray-700 flex items-center mb-3">
                                    <ListCheck
                                        size={18}
                                        className="mr-2 text-gray-500"
                                    />{" "}
                                    Antrean
                                </label>
                                <div className="space-y-2 overflow-y-auto p-2 flex-grow border rounded-lg">
                                    {imageQueue.length > 0 ? (
                                        <>
                                            {imageQueue.map((img, index) => (
                                                <div
                                                    key={img.id}
                                                    onClick={() =>
                                                        setActiveIndex(index)
                                                    }
                                                    className={`flex items-center p-1 rounded-lg cursor-pointer transition-colors group ${
                                                        index === activeIndex
                                                            ? "bg-teal-100 ring-2 ring-teal-500"
                                                            : "hover:bg-gray-100"
                                                    }`}
                                                >
                                                    <div className="flex-shrink-0 w-10 h-10 mr-3">
                                                        {croppedImages.find(
                                                            (ci) =>
                                                                ci.id === img.id
                                                        ) ? (
                                                            <img
                                                                src={
                                                                    croppedImages.find(
                                                                        (ci) =>
                                                                            ci.id ===
                                                                            img.id
                                                                    ).src
                                                                }
                                                                alt="Cropped thumbnail"
                                                                className="w-full h-full object-cover rounded-md"
                                                            />
                                                        ) : (
                                                            <FileImage className="w-full h-full text-teal-600 p-1" />
                                                        )}
                                                    </div>
                                                    <span className="text-sm text-gray-800 truncate flex-grow">
                                                        {img.name}
                                                    </span>
                                                    {croppedImages.find(
                                                        (ci) => ci.id === img.id
                                                    ) && (
                                                        <Check
                                                            size={20}
                                                            className="text-green-500 mx-2 flex-shrink-0"
                                                        />
                                                    )}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemoveFromQueue(
                                                                index
                                                            );
                                                        }}
                                                        className="p-1 rounded-full hover:bg-red-100 hover:text-red-600 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                            <div
                                                {...queueGetRootProps()}
                                                className={`flex flex-col items-center justify-center w-full p-6 mt-2 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                                                    isQueueDragActive
                                                        ? "border-teal-500 bg-teal-50"
                                                        : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                                                }`}
                                            >
                                                <input
                                                    {...queueGetInputProps()}
                                                />
                                                <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                                                <p className="text-sm text-center text-gray-600">
                                                    Tambah gambar
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center text-center text-gray-900 text-xs md:text-sm min-h-28">
                                            <p>Tidak ada gambar di antrean.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="pt-4">
                            <button
                                onClick={handleCropAndNext}
                                disabled={
                                    !activeImage ||
                                    !completedCrop ||
                                    activeImage.categories.length === 0
                                }
                                className={`w-full py-3 rounded-full font-semibold text-white flex items-center justify-center ${
                                    !activeImage ||
                                    !completedCrop ||
                                    activeImage.categories.length === 0
                                        ? "bg-teal-600/50 cursor-not-allowed"
                                        : "bg-gradient-to-br from-teal-400 via-teal-700 to-teal-400 hover:bg-none hover:bg-teal-600"
                                }`}
                            >
                                {activeIndex === imageQueue.length - 1
                                    ? "Selesai & Lihat Galeri"
                                    : "Simpan & Lanjutkan"}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
