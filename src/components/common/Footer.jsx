import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, Heart, MessageSquare, Globe } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200/40 dark:border-slate-800/40 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl mt-auto py-8 px-4 sm:px-6 gradient-border-top">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center">
            <Zap className="w-3 h-3 text-white fill-current" />
          </div>
          <span className="font-semibold text-slate-700 dark:text-slate-300">Wizard SMM Enterprise</span>
          <span>© 2026. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/dashboard/services" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Services Marketplace
          </Link>
          <Link to="/dashboard/api" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            API Documentation
          </Link>
          <Link to="/dashboard/support" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Help Center
          </Link>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Privacy & Terms
          </a>
        </div>
      </div>
    </footer>
  );
};
