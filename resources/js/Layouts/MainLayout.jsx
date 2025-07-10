// resources/js/Layouts/MainLayout.jsx

import React from "react";
import { usePage } from "@inertiajs/react";
import AppFooter from "@/Components/layout/AppFooter";
import AppHeader from "@/Components/layout/AppHeader";
import { Toaster } from "react-hot-toast";

export default function MainLayout({ children }) {
    const { url } = usePage();

    const noLayoutPages = [
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/formulir",
        "/booking",
    ];

    const showHeaderFooter = !noLayoutPages.some((path) =>
        url.startsWith(path)
    );

    return (
        <>
            <Toaster
                position="top-right"
                reverseOrder={true}
                duration={5000}
                toastOptions={{ className: "custom-toast" }}
            />
            <div className="min-h-screen bg-gray-50 mb-18 md:mb-0">
                {showHeaderFooter && <AppHeader />}
                <main>{children}</main>
                {showHeaderFooter && <AppFooter />}
            </div>
       </>
    );
}
