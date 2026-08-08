import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Card = ({ children, className, glass = true, hover = false, premium = false, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-2xl border transition-all duration-300 overflow-hidden card-accent-top',
          glass
            ? 'glass-panel'
            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-sm',
          hover && 'hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/[0.07] dark:hover:shadow-indigo-500/12 hover:border-indigo-500/30 dark:hover:border-indigo-500/30',
          premium && 'glow-border',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className, ...props }) => (
  <div className={twMerge(clsx('p-5 sm:p-6 border-b border-slate-200/50 dark:border-slate-800/60', className))} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...props }) => (
  <h3 className={twMerge(clsx('text-lg font-bold text-slate-900 dark:text-white tracking-tight', className))} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className, ...props }) => (
  <p className={twMerge(clsx('text-sm text-slate-500 dark:text-slate-400 mt-1', className))} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className, ...props }) => (
  <div className={twMerge(clsx('p-5 sm:p-6', className))} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className, ...props }) => (
  <div className={twMerge(clsx('p-5 sm:p-6 bg-slate-50/30 dark:bg-slate-900/30 border-t border-slate-200/50 dark:border-slate-800/60', className))} {...props}>
    {children}
  </div>
);
