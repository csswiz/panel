import React, { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Navbar } from "../components/common/Navbar";
import { Sidebar } from "../components/common/Sidebar";
import { Footer } from "../components/common/Footer";
import { CommandPalette } from "../components/common/CommandPalette";
import { Breadcrumbs } from "../components/common/Breadcrumbs";
import { Shield } from "lucide-react";

export const AdminDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-rose-500 selection:text-white transition-colors duration-300 mesh-bg">
      {/* Top Admin Indicator Banner */}
      <div className="bg-linear-to-r from-rose-600 via-purple-600 to-indigo-600 text-white text-[11px] font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2 tracking-wider uppercase animate-gradient-x relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent animate-gradient-x" style={{ backgroundSize: "200% 100%", animationDuration: "3s" }} />
        <Shield className="w-3.5 h-3.5 relative z-10" />
        <span className="relative z-10">Enterprise Admin Control Mode Active • Super Administrator Access</span>
      </div>

      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex max-w-[1920px] w-full mx-auto relative z-10">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full flex flex-col justify-between min-w-0">
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
