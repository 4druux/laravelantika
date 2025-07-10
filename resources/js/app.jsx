// resources/js/app.jsx

import "./bootstrap";
import "../css/app.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";

import MainLayout from "./Layouts/MainLayout";
import AdminLayout from "./Layouts/AdminLayout";
import { AuthProvider } from "./Context/AuthContext";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
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
            </AuthProvider>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
