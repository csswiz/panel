import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export const Tooltip = ({ content, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: '-top-9 left-1/2 -translate-x-1/2',
    bottom: '-bottom-9 left-1/2 -translate-x-1/2',
    left: 'top-1/2 -left-2 -translate-x-full -translate-y-1/2',
    right: 'top-1/2 -right-2 translate-x-full -translate-y-1/2'
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.12 }}
            className={`absolute z-40 px-2.5 py-1 text-xs font-medium text-white bg-slate-900 dark:bg-slate-800 rounded-lg shadow-xl shadow-slate-900/30 whitespace-nowrap pointer-events-none border border-slate-700/50 ring-1 ring-inset ring-white/5 ${positions[position]}`}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
