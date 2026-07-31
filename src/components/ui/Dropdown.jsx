import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export const Dropdown = ({ trigger, items = [], align = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignments = {
    left: 'left-0',
    right: 'right-0'
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute ${alignments[align]} mt-2 w-56 rounded-xl shadow-xl shadow-slate-900/10 dark:shadow-slate-950/30 border border-slate-200/60 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl py-1 z-50 overflow-hidden card-accent-top`}
          >
            {items.map((item, index) => {
              if (item.divider) {
                return <div key={index} className="my-1 border-t border-slate-200/50 dark:border-slate-800/60" />;
              }
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (item.onClick) item.onClick();
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold transition-all duration-150 relative group ${
                    item.danger
                      ? 'text-rose-600 dark:text-rose-400 hover:bg-rose-50/80 dark:hover:bg-rose-950/40 hover:text-rose-700'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-indigo-50/80 dark:hover:bg-slate-800/80 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  {/* Left accent indicator */}
                  <span className={`absolute left-0 top-1/4 bottom-1/4 w-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                    item.danger ? 'bg-rose-500' : 'bg-indigo-500'
                  }`} />
                  {Icon && <Icon className="w-4 h-4 shrink-0" />}
                  {item.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
