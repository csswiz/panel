import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200/40 dark:border-slate-800/40 bg-slate-900/80 backdrop-blur-xl mt-auto py-6 px-4 sm:px-6 md:px-8 gradient-border-top z-20 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        {/* Left Side: Brand & Copyright */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-center sm:text-left">
          <div className="w-5 h-5 rounded-md bg-linear-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shrink-0">
            <Zap className="w-3 h-3 text-white fill-current" />
          </div>
          <span className="font-bold text-slate-200">Wizard SMM Enterprise</span>
          <span className="text-slate-500">© 2026. All rights reserved.</span>
        </div>

        {/* Right Side: Links with Flex Wrap & Spacing to Prevent Clipping */}
        <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-4 sm:gap-6 text-center font-medium">
          <Link to="/dashboard/services" className="hover:text-indigo-400 transition-colors whitespace-nowrap">
            Services Marketplace
          </Link>
          <Link to="/dashboard/api" className="hover:text-indigo-400 transition-colors whitespace-nowrap">
            API Documentation
          </Link>
          <Link to="/dashboard/support" className="hover:text-indigo-400 transition-colors whitespace-nowrap">
            Help Center
          </Link>
          <a href="#" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5 whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Privacy & Terms
          </a>
        </div>
      </div>
    </footer>
  );
};
