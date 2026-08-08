import React, { useState, useRef, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Search, Check, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const CustomSelect = ({
  label,
  value,
  options = [],
  onChange,
  placeholder = "Select an option...",
  icon: Icon,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Normalize options array into { label, value } objects
  const normalizedOptions = useMemo(() => {
    return options.map(opt => {
      if (typeof opt === 'object' && opt !== null) {
        return { label: opt.label || opt.name || String(opt.value), value: opt.value ?? opt.id };
      }
      return { label: String(opt), value: opt };
    });
  }, [options]);

  // Selected option label
  const selectedOption = useMemo(() => {
    return normalizedOptions.find(o => String(o.value) === String(value)) || null;
  }, [normalizedOptions, value]);

  // Filter options by search query
  const filteredOptions = useMemo(() => {
    if (!search.trim()) return normalizedOptions;
    const q = search.toLowerCase().trim();
    return normalizedOptions.filter(o => o.label.toLowerCase().includes(q));
  }, [normalizedOptions, search]);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div ref={containerRef} className="w-full space-y-1.5 relative">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          {label}
        </label>
      )}

      {/* Main Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={twMerge(
          clsx(
            'w-full px-4 py-3 text-xs sm:text-sm rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-between text-left',
            'bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800',
            'text-slate-900 dark:text-slate-100 font-semibold',
            'shadow-inner shadow-slate-100/50 dark:shadow-slate-950/30',
            'hover:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/40',
            isOpen && 'border-indigo-500 ring-2 ring-indigo-500/30 bg-white dark:bg-slate-900',
            className
          )
        )}
      >
        <div className="flex items-center gap-2.5 truncate pr-2">
          {Icon && <Icon className="w-4 h-4 text-indigo-500 shrink-0" />}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
      </button>

      {/* Dropdown Menu - GUARANTEED DOWNWARDS POSITIONING */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl shadow-2xl shadow-indigo-500/10 dark:shadow-indigo-500/15 overflow-hidden card-accent-top"
          >
            {/* Search Input inside dropdown */}
            {normalizedOptions.length > 5 && (
              <div className="p-2.5 border-b border-slate-200/60 dark:border-slate-800 flex items-center gap-2 bg-slate-50/50 dark:bg-slate-950/50">
                <Search className="w-4 h-4 text-indigo-500 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Type to filter list..."
                  className="w-full bg-transparent text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                />
              </div>
            )}

            {/* Options List with custom scrollbar */}
            <div className="max-h-64 overflow-y-auto p-1.5 custom-dropdown-scroll space-y-0.5">
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  No matching options found for "<span className="text-indigo-400 font-semibold">{search}</span>"
                </div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = String(opt.value) === String(value);
                  return (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm text-left transition-all duration-150 ${
                        isSelected
                          ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20'
                          : 'text-slate-800 dark:text-slate-200 hover:bg-indigo-50/80 dark:hover:bg-slate-800/70 font-semibold'
                      }`}
                    >
                      <span className="truncate pr-2">{opt.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
