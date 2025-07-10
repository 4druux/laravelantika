// resources/js/RootApp.jsx

import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./Context/AuthContext";
import { usePage } from "@inertiajs/react";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import SetPageTitle from "./components/SetPageTittle";

function ScrollToTop() {
    const { url } = usePage();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [url]);
    return null;
}

const determineLayout = (currentPageComponent) => {
    const { url } = usePage();

    if (url.startsWith("/admin")) {
        return (
            <AdminLayout>
                {currentPageComponent}
            </AdminLayout>
        );
    } else {
        return (
            <MainLayout>
                {currentPageComponent}
            </MainLayout>
        );
    }
};

function RootApp({ children }) {
    return (
        <AuthProvider>
            <ScrollToTop />
            <SetPageTitle />
            <div className="App">
                <Toaster
                    duration={5000}
                    position="top-right"
                    reverseOrder={true}
                    toastOptions={{ className: "custom-toast" }}
                />
                {determineLayout(children)}
            </div>
        </AuthProvider>
    );
}

export default RootApp;
