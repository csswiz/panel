import React, { useState } from 'react';
import { useCommandPalette as useCmd } from '../../contexts/CommandPaletteContext';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Command, ArrowRight, LayoutDashboard, ShoppingCart, Sparkles, Wallet, Code2, Headphones, User, Shield, BarChart3, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const CommandPalette = () => {
  const { isOpen, closePalette } = useCmd();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const commandItems = [
    { label: 'User Dashboard', path: '/dashboard', icon: LayoutDashboard, category: 'User Pages' },
    { label: 'New Order Calculator', path: '/dashboard/new-order', icon: ShoppingCart, category: 'User Pages' },
    { label: 'Services Marketplace (250+)', path: '/dashboard/services', icon: Sparkles, category: 'User Pages' },
    { label: 'Order History & Tracking', path: '/dashboard/orders', icon: ShoppingCart, category: 'User Pages' },
    { label: 'Wallet & Fund Deposits', path: '/dashboard/wallet', icon: Wallet, category: 'User Pages' },
    { label: 'API Developer Documentation', path: '/dashboard/api', icon: Code2, category: 'User Pages' },
    { label: 'Support Ticket Center', path: '/dashboard/support', icon: Headphones, category: 'User Pages' },
    { label: 'Profile & Security Settings', path: '/dashboard/profile', icon: User, category: 'User Pages' },

    { label: 'Admin Overview Dashboard', path: '/admin', icon: Shield, category: 'Admin Pages' },
    { label: 'Revenue & System Analytics', path: '/admin/analytics', icon: BarChart3, category: 'Admin Pages' },
    { label: 'User Directory Management', path: '/admin/users', icon: User, category: 'Admin Pages' },
    { label: 'Service Catalog Editor', path: '/admin/services', icon: Sparkles, category: 'Admin Pages' },
    { label: 'Global Orders Management', path: '/admin/orders', icon: ShoppingCart, category: 'Admin Pages' },
    { label: 'System Configuration', path: '/admin/settings', icon: Settings, category: 'Admin Pages' },

    { label: 'Public Landing Page', path: '/', icon: HelpCircle, category: 'General' },
  ];

  const filteredItems = commandItems.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path) => {
    navigate(path);
    closePalette();
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePalette}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-lg"
          />

          {/* Ambient glow behind palette */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-indigo-500/15 rounded-full blur-[80px] pointer-events-none"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl shadow-2xl shadow-indigo-500/10 dark:shadow-indigo-500/15 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl overflow-hidden z-10 card-accent-top"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200/50 dark:border-slate-800/60">
              <Search className="w-5 h-5 text-indigo-500 shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command, page name, or search service..."
                className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-sm">
                <Command className="w-3 h-3" /> ESC
              </kbd>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2">
              {filteredItems.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  No commands found matching "<span className="text-indigo-500 font-semibold">{query}</span>"
                </div>
              ) : (
                filteredItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleSelect(item.path)}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50/80 dark:hover:bg-slate-800/60 text-left transition-all duration-150 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform shadow-sm">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {item.label}
                          </p>
                          <p className="text-[11px] text-slate-400">{item.category}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                    </button>
                  );
                })
              )}
            </div>

            <div className="p-3 bg-slate-50/60 dark:bg-slate-900/60 border-t border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono shadow-sm">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono shadow-sm">↓</kbd> to navigate</span>
              <span>Quick Navigation Command Palette</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
