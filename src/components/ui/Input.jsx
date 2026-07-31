import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  rightElement,
  className,
  type = 'text',
  ...props
}, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          {label}
        </label>
      )}
      <div className="relative flex items-center group">
        {Icon && (
          <div className="absolute left-3.5 pointer-events-none text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-indigo-500">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={twMerge(
            clsx(
              'w-full px-4 py-2.5 text-sm rounded-xl transition-all duration-200',
              'bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800',
              'text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500',
              'shadow-inner shadow-slate-100/50 dark:shadow-slate-950/30',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60 focus:bg-white dark:focus:bg-slate-900',
              'focus:shadow-[0_0_0_4px_rgba(99,102,241,0.08)]',
              'hover:border-slate-300 dark:hover:border-slate-700',
              Icon && 'pl-10',
              rightElement && 'pr-12',
              error && 'border-rose-500 focus:ring-rose-500/40 focus:border-rose-500 focus:shadow-[0_0_0_4px_rgba(244,63,94,0.08)]',
              className
            )
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3">
            {rightElement}
          </div>
        )}
      </div>
      {error ? (
        <p className="text-xs font-medium text-rose-500 mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
