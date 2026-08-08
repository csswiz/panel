import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { useCommandPalette } from "../../contexts/CommandPaletteContext";
import { NotificationCenter } from "./NotificationCenter";
import { ThemeToggle } from "./ThemeToggle";
import { formatCurrency } from "../../utils/formatters";
import { Button } from "../ui/Button";
import { Dropdown } from "../ui/Dropdown";
import {
  Zap, Search, Command, PlusCircle, Shield, User, Wallet, Settings, LogOut, ChevronDown
} from "lucide-react";

export const Navbar = ({ onToggleSidebar }) => {
  const { user, isAdmin, logout } = useAuth();
  const { addToast } = useToast();
  const { openPalette } = useCommandPalette();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    addToast("Signed out of your account successfully.", "info");
    navigate("/auth/login");
  };

  const userMenuItems = [
    { label: `${user.name} (${user.tier})`, icon: User, onClick: () => navigate("/dashboard/profile") },
    { label: "Wallet & Deposits", icon: Wallet, onClick: () => navigate("/dashboard/wallet") },
    { label: "API Keys & Docs", icon: Settings, onClick: () => navigate("/dashboard/api") },
    ...(isAdmin ? [
      { divider: true },
      { label: "Admin Control Center", icon: Shield, onClick: () => navigate("/admin") }
    ] : []),
    { divider: true },
    { label: "Sign Out", icon: LogOut, danger: true, onClick: handleSignOut }
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl gradient-border-bottom">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Left Side: Sidebar Toggle & Brand Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-indigo-600 via-blue-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:shadow-xl group-hover:shadow-indigo-500/40 group-hover:scale-105 transition-all duration-300">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-linear-to-tr from-indigo-600 to-violet-600 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black text-slate-900 dark:text-white tracking-tight">WIZARD</span>
                <span className="text-xs font-bold text-gradient">SMM</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase -mt-1">ENTERPRISE</span>
            </div>
          </Link>
        </div>

        {/* Center: Command Palette Trigger */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <button
            onClick={openPalette}
            className="w-full flex items-center justify-between px-4 py-2 text-xs text-slate-400 bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 shadow-inner shadow-slate-200/40 dark:shadow-slate-950/30"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-500" />
              <span>Search services, orders, pages (Ctrl+K)...</span>
            </div>
            <kbd className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
              <Command className="w-3 h-3" /> K
            </kbd>
          </button>
        </div>

        {/* Right Side: Balance Widget, Mobile Search & User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={openPalette}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition-colors"
            title="Global Search"
          >
            <Search className="w-4 h-4 text-indigo-500" />
          </button>

          {!isAdmin && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 shadow-sm">
              <div className="flex flex-col text-right">
                <span className="text-[10px] font-semibold uppercase text-slate-400">Balance</span>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(user.balance)}
                </span>
              </div>
              <Button
                size="sm"
                variant="primary"
                onClick={() => navigate("/dashboard/wallet")}
                className="px-2.5 py-1 text-xs font-semibold gap-1 rounded-lg"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Add
              </Button>
            </div>
          )}

          <ThemeToggle />
          <NotificationCenter />

          {/* User Profile Dropdown */}
          <Dropdown
            trigger={
              <button className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-indigo-500/30 shadow-sm"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>
            }
            items={userMenuItems}
          />
        </div>
      </div>
    </header>
  );
};
