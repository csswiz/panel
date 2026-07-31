import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  isLoading = false,
  disabled = false,
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] select-none relative overflow-hidden';

  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 focus:ring-indigo-500 border border-indigo-500/50 dark:bg-indigo-500 dark:hover:bg-indigo-400 ring-1 ring-inset ring-white/10',
    secondary: 'bg-slate-100 hover:bg-slate-200/80 text-slate-900 focus:ring-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-md ring-1 ring-inset ring-white/60 dark:ring-white/5',
    outline: 'border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 focus:ring-indigo-500 bg-transparent hover:border-slate-400 dark:hover:border-slate-600',
    ghost: 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 focus:ring-slate-400 bg-transparent',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:shadow-xl hover:shadow-rose-500/30 focus:ring-rose-500 border border-rose-500/50 ring-1 ring-inset ring-white/10',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 focus:ring-emerald-500 border border-emerald-500/50 ring-1 ring-inset ring-white/10',
    gradient: 'bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 hover:from-indigo-500 hover:via-blue-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35 border border-white/10 font-bold shine-effect animate-gradient-x'
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5 rounded-lg',
    md: 'px-4.5 py-2.5 text-sm gap-2 rounded-xl',
    lg: 'px-7 py-3.5 text-base gap-2.5 rounded-2xl font-bold'
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span className="relative z-10">{children}</span>
    </button>
  );
};
