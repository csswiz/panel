import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Badge = ({ children, variant = 'default', size = 'md', className, icon: Icon, pulse = false, ...props }) => {
  const variants = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 shadow-sm',
    indigo: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800/50 shadow-sm shadow-indigo-500/5',
    blue: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/50 shadow-sm shadow-blue-500/5',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/50 shadow-sm shadow-emerald-500/5',
    rose: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/50 shadow-sm shadow-rose-500/5',
    amber: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/50 shadow-sm shadow-amber-500/5',
    purple: 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/50 shadow-sm shadow-purple-500/5',
    gradient: 'bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-violet-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/25 shadow-sm shadow-indigo-500/5',
    glow: 'bg-indigo-500/15 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border-indigo-400/40 dark:border-indigo-500/40 shadow-sm animate-pulse-glow'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px] gap-1 rounded-md font-medium',
    md: 'px-2.5 py-1 text-xs gap-1.5 rounded-lg font-semibold',
    lg: 'px-3 py-1.5 text-sm gap-2 rounded-xl font-semibold'
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center border font-medium transition-all duration-200',
          variants[variant],
          sizes[size],
          pulse && 'animate-pulse',
          className
        )
      )}
      {...props}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {children}
    </span>
  );
};
