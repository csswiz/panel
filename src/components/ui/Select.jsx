import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronDown } from 'lucide-react';

export const Select = forwardRef(({
  label,
  options = [],
  error,
  helperText,
  icon: Icon,
  className,
  children,
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
        <select
          ref={ref}
          className={twMerge(
            clsx(
              'w-full px-4 py-2.5 text-sm rounded-xl appearance-none transition-all duration-200 cursor-pointer pr-10',
              'bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800',
              'text-slate-900 dark:text-slate-100',
              'shadow-inner shadow-slate-100/50 dark:shadow-slate-950/30',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60 focus:bg-white dark:focus:bg-slate-900',
              'focus:shadow-[0_0_0_4px_rgba(99,102,241,0.08)]',
              'hover:border-slate-300 dark:hover:border-slate-700',
              Icon && 'pl-10',
              error && 'border-rose-500 focus:ring-rose-500/40 focus:border-rose-500',
              className
            )
          )}
          {...props}
        >
          {children ? (
            children
          ) : (
            options.map((opt, idx) => (
              <option
                key={idx}
                value={typeof opt === 'object' ? opt.value : opt}
                className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                {typeof opt === 'object' ? opt.label : opt}
              </option>
            ))
          )}
        </select>
        <div className="absolute right-3.5 pointer-events-none text-slate-400 dark:text-slate-500 transition-transform group-focus-within:rotate-180">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error ? (
        <p className="text-xs font-medium text-rose-500 mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';
