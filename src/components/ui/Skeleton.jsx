import React from 'react';

export const Skeleton = ({ className = '', variant = 'text', width, height }) => {
  const base = 'rounded-lg animate-shimmer';
  const variants = {
    text: 'h-4 w-full',
    circular: 'rounded-full',
    rectangular: 'w-full h-32 rounded-xl'
  };

  return (
    <div
      className={`${base} ${variants[variant]} ${className}`}
      style={{ width: width, height: height }}
    />
  );
};

export const Switch = ({ checked, onChange, label, disabled = false }) => {
  return (
    <label className={`inline-flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-2 shadow-inner ${
          checked ? 'bg-indigo-600 dark:bg-indigo-500 shadow-indigo-700/30' : 'bg-slate-300 dark:bg-slate-700 shadow-slate-400/20'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-all duration-200 ease-in-out ${
            checked ? 'translate-x-5 shadow-indigo-500/20' : 'translate-x-0'
          }`}
        />
      </button>
      {label && <span className="text-sm font-medium text-slate-700 dark:text-slate-300 select-none">{label}</span>}
    </label>
  );
};
