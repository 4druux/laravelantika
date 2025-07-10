import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "@/Components/admin/Sidebar";

export default function AdminLayout() {
  const [desktopExpanded, setDesktopExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        expanded={desktopExpanded}
        setExpanded={setDesktopExpanded}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 flex items-center justify-between px-4 py-3 bg-white border-b z-10">
          <img
            src="/images/logo.png"
            alt="logo antika studio"
            className="w-[100px] h-[20px]"
          />
          <button onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </header>

        <main className="flex-1 xl:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
