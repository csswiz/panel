import React, { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Navbar } from "../components/common/Navbar";
import { Sidebar } from "../components/common/Sidebar";
import { Footer } from "../components/common/Footer";
import { CommandPalette } from "../components/common/CommandPalette";
import { Breadcrumbs } from "../components/common/Breadcrumbs";

export const UserDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors duration-300 mesh-bg">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex max-w-[1920px] w-full mx-auto relative z-10">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full flex flex-col justify-between">
          <div>
            <Breadcrumbs />
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>

      <CommandPalette />
    </div>
  );
};
