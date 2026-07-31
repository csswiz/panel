import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';

export const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Tooltip content={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}>
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95 ${className}`}
        aria-label="Toggle Theme"
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    </Tooltip>
  );
};
