import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export const Drawer = ({ isOpen, onClose, title, children, position = 'right' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const slideVariants = {
    right: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } },
    left: { initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          {/* Drawer Body */}
          <motion.div
            variants={slideVariants[position]}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`relative ml-auto w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200/60 dark:border-slate-800 shadow-2xl shadow-slate-900/20 dark:shadow-slate-950/40 z-10 flex flex-col h-full card-accent-top`}
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-200/50 dark:border-slate-800/60">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150 hover:rotate-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
