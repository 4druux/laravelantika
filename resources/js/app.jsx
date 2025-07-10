// resources/js/app.jsx

import "./bootstrap";
import "../css/app.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { Toaster } from "react-hot-toast";

import MainLayout from "./Layouts/MainLayout";
import AdminLayout from "./Layouts/AdminLayout";
import { AuthProvider } from "./Context/AuthContext";

const pageTitles = {
    "/": "Antika Studio",
    "/formulir": "Formulir Booking - Antika Studio",
    "/booking": "Detail Booking - Antika Studio",
    "/login": "Admin Login - Antika Studio",
    "/register": "Admin Register - Antika Studio",
    "/forgot-password": "Lupa Password - Antika Studio",
    "/reset-password": "Reset Password - Antika Studio",
    "/admin/booking": "Kelola Booking - Antika Studio",
    "/admin/upload-gambar": "Upload Gambar - Antika Studio",
    "/admin/kelola-galeri": "Kelola Galeri - Antika Studio",
};

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => {
        const path = window.location.pathname;
        const pageTitle = pageTitles[path];
        return pageTitle || `${title} - ${appName}`;
    },
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
        let page = pages[`./Pages/${name}.jsx`];

        if (name.startsWith("admin/")) {
            page.default.layout ??= (page) => <AdminLayout children={page} />;
        } else {
            page.default.layout ??= (page) => <MainLayout children={page} />;
        }

        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <AuthProvider>
                <App {...props} />
                <Toaster
                    position="top-right"
                    reverseOrder={true}
                    duration={5000}
                    toastOptions={{ className: "custom-toast" }}
                />
            </AuthProvider>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
