import React from 'react';
import { motion } from 'framer-motion';

export const Tabs = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`flex items-center gap-1 p-1 bg-slate-100/80 dark:bg-slate-900/80 rounded-xl border border-slate-200/60 dark:border-slate-800 overflow-x-auto no-scrollbar shadow-inner shadow-slate-200/30 dark:shadow-slate-950/30 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 whitespace-nowrap select-none ${
              isActive
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-white dark:bg-slate-800 rounded-lg shadow-sm ring-1 ring-slate-200/60 dark:ring-slate-700/60"
                transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
              {tab.label}
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${isActive ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300' : 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};
