import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import Sidebar from "@/Components/admin/Sidebar";
import { useAuth } from "@/Context/useAuth";
import DotLoader from "@/Components/loading/DotLoader";

export default function AdminLayout({ children }) {
    const { user, loading } = useAuth();
    const [desktopExpanded, setDesktopExpanded] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.visit("/login", { replace: true });
        }
    }, [loading, user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <DotLoader />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <>
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar
                    expanded={desktopExpanded}
                    setExpanded={setDesktopExpanded}
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}
                />
                <div className="flex-1 flex flex-col min-w-0">
                    <main className="flex-1 xl:p-8">{children}</main>
                </div>
            </div>
        </>
    );
}
