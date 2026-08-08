import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import {
  LayoutDashboard, ShoppingCart, Sparkles, ListOrdered, Wallet, Code2, Headphones,
  Users, UserCheck, Shield, BarChart3, FileText, Settings, Layers, LogOut, Gamepad2
} from "lucide-react";

export const Sidebar = ({ isOpen, onClose }) => {
  const { isAdmin, logout } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    addToast("Signed out of your account successfully.", "info");
    navigate("/auth/login");
  };

  const userNav = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, exact: true },
    { label: "New Order", path: "/dashboard/new-order", icon: ShoppingCart, badge: "FAST" },
    { label: "Services", path: "/dashboard/services", icon: Sparkles, badge: "17,000+" },
    { label: "Game Services", path: "/dashboard/game-services", icon: Gamepad2, badge: "HOT" },
    { label: "Orders History", path: "/dashboard/orders", icon: ListOrdered },
    { label: "Add Funds / Wallet", path: "/dashboard/wallet", icon: Wallet },
    { label: "API Docs", path: "/dashboard/api", icon: Code2 },
    { label: "Support Tickets", path: "/dashboard/support", icon: Headphones },
    { label: "Affiliate Program", path: "/dashboard/affiliate", icon: Users, badge: "10%" },
    { label: "Account Profile", path: "/dashboard/profile", icon: Settings },
  ];

  const adminNav = [
    { label: "Admin Overview", path: "/admin", icon: Shield, exact: true },
    { label: "Analytics & Revenue", path: "/admin/analytics", icon: BarChart3 },
    { label: "User Directory", path: "/admin/users", icon: UserCheck, badge: "5,420" },
    { label: "Services Catalog", path: "/admin/services", icon: Layers },
    { label: "Game Services Admin", path: "/admin/game-services", icon: Gamepad2, badge: "NEW" },
    { label: "Order Management", path: "/admin/orders", icon: ListOrdered },
    { label: "Support Queue", path: "/admin/tickets", icon: Headphones },
    { label: "Reports & Export", path: "/admin/reports", icon: FileText },
    { label: "System Settings", path: "/admin/settings", icon: Settings },
  ];

  const currentNav = isAdmin ? adminNav : userNav;

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 md:top-24 h-screen md:h-[calc(100vh-6rem)] left-0 z-30 w-64 shrink-0 border-r border-slate-200/50 dark:border-slate-800/50 bg-white/92 dark:bg-slate-900/92 backdrop-blur-2xl flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 space-y-6 flex-1 overflow-y-auto">
          {/* Section Header */}
          <div className="px-3 pt-2">
            <div className="flex items-center justify-between text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-linear-to-r from-indigo-500 to-blue-500" />
                {isAdmin ? "ADMINISTRATION" : "MAIN MENU"}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-[10px] shadow-sm">
                {isAdmin ? "VIP ADMIN" : "V3.8"}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-0.5">
            {currentNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose && onClose()}
                  className={({ isActive: linkActive }) => {
                    const active = item.exact ? location.pathname === item.path : linkActive;
                    return `group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 relative ${
                      active
                        ? "bg-linear-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25 dark:from-indigo-500 dark:to-indigo-400"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
                    }`;
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}

            {/* Dedicated Sign Out item in sidebar */}
            <button
              onClick={handleSignOut}
              className="w-full group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all duration-200 mt-2"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                <span>Sign Out</span>
              </div>
            </button>
          </nav>

          {/* Quick Stats Widget */}
          <div className="p-4 rounded-2xl bg-linear-to-br from-indigo-500/8 via-purple-500/4 to-blue-500/8 border border-indigo-500/15 shadow-sm relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-indigo-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">System Status</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                API Engine Cluster Node #04: <span className="text-emerald-500 font-semibold">99.99% Operational</span>
              </p>
              <div className="w-full bg-slate-200/80 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-linear-to-r from-emerald-500 to-emerald-400 h-full w-[99.99%] rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer info inside sidebar */}
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between text-xs text-slate-400 gradient-border-top">
          <span className="font-mono text-[11px]">WIZARD SMM OS v3.8</span>
          <span className="flex items-center gap-1.5 text-emerald-500 font-semibold text-[11px]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Online
          </span>
        </div>
      </aside>
    </>
  );
};
