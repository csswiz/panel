import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Zap, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { Footer } from '../components/common/Footer';

export const LandingLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Public Landing Navbar */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-slate-950/80 border-b border-slate-800/50 gradient-border-bottom">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-500 via-blue-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:shadow-xl group-hover:shadow-indigo-500/40 group-hover:scale-105 transition-all duration-300">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-linear-to-tr from-indigo-600 to-violet-600 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-white">WIZARD SMM</span>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest -mt-1">ENTERPRISE PLATFORM</span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#services" className="hover:text-indigo-400 transition-colors relative group">
              Services
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-indigo-500 to-blue-500 group-hover:w-full transition-all duration-300 rounded-full" />
            </a>
            <a href="#features" className="hover:text-indigo-400 transition-colors relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-indigo-500 to-blue-500 group-hover:w-full transition-all duration-300 rounded-full" />
            </a>
            <a href="#pricing" className="hover:text-indigo-400 transition-colors relative group">
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-indigo-500 to-blue-500 group-hover:w-full transition-all duration-300 rounded-full" />
            </a>
            <a href="#faq" className="hover:text-indigo-400 transition-colors relative group">
              FAQ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-indigo-500 to-blue-500 group-hover:w-full transition-all duration-300 rounded-full" />
            </a>
            <Link to="/dashboard/api" className="hover:text-indigo-400 transition-colors relative group">
              API Docs
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-indigo-500 to-blue-500 group-hover:w-full transition-all duration-300 rounded-full" />
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/auth/login">
              <Button variant="ghost" size="sm" className="text-slate-200 hover:text-white">
                Sign In
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button variant="gradient" size="sm" className="gap-1.5 shadow-indigo-500/40">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
