import React, { useState, useMemo } from 'react';
import { useCommandPalette as useCmd } from '../../contexts/CommandPaletteContext';
import { useServices } from '../../contexts/ServicesContext';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search, Command, ArrowRight, LayoutDashboard, ShoppingCart, Sparkles, Wallet, Code2, Headphones, User, Shield, BarChart3, Settings, HelpCircle, Layers, Zap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../utils/formatters';

export const CommandPalette = () => {
  const { isOpen, closePalette } = useCmd();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { services = [] } = useServices();

  const commandItems = [
    { label: 'User Dashboard', path: '/dashboard', icon: LayoutDashboard, category: 'Navigation' },
    { label: 'New Order Campaign', path: '/dashboard/new-order', icon: ShoppingCart, category: 'Navigation' },
    { label: `Services Marketplace (${services.length ? services.length.toLocaleString() : '17,000+'}+)`, path: '/dashboard/services', icon: Sparkles, category: 'Navigation' },
    { label: 'Order History & Status Tracking', path: '/dashboard/orders', icon: ShoppingCart, category: 'Navigation' },
    { label: 'Add Funds & Wallet History', path: '/dashboard/wallet', icon: Wallet, category: 'Navigation' },
    { label: 'API Developer Documentation', path: '/dashboard/api', icon: Code2, category: 'Navigation' },
    { label: 'Support Ticket Center', path: '/dashboard/support', icon: Headphones, category: 'Navigation' },
    { label: 'Profile & Security Settings', path: '/dashboard/profile', icon: User, category: 'Navigation' },

    ...(isAdmin ? [
      { label: 'Admin Overview Dashboard', path: '/admin', icon: Shield, category: 'Admin Tools' },
      { label: 'Revenue & System Analytics', path: '/admin/analytics', icon: BarChart3, category: 'Admin Tools' },
      { label: 'User Directory Management', path: '/admin/users', icon: User, category: 'Admin Tools' },
      { label: 'Service Catalog & Provider Sync', path: '/admin/services', icon: Sparkles, category: 'Admin Tools' },
      { label: 'Global Orders Management', path: '/admin/orders', icon: ShoppingCart, category: 'Admin Tools' },
      { label: 'System Configuration', path: '/admin/settings', icon: Settings, category: 'Admin Tools' },
    ] : []),

    { label: 'Public Landing Page', path: '/', icon: HelpCircle, category: 'General' },
  ];

  // Filter app pages
  const filteredPages = useMemo(() => {
    if (!query.trim()) return commandItems;
    const q = query.toLowerCase().trim();
    return commandItems.filter(item =>
      item.label.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  }, [query, commandItems]);

  // Filter 17,000+ services globally
  const filteredServices = useMemo(() => {
    if (!query.trim() || query.trim().length < 2) return [];
    const q = query.toLowerCase().trim();
    const cleanId = q.replace(/^#/, '');

    return services.filter(s =>
      s.id.toString() === cleanId ||
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.platform.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query, services]);

  const handleSelectPath = (path) => {
    navigate(path);
    closePalette();
    setQuery('');
  };

  const handleSelectService = (serviceId) => {
    navigate(`/dashboard/new-order?serviceId=${serviceId}`);
    closePalette();
    setQuery('');
  };

  const hasResults = filteredPages.length > 0 || filteredServices.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePalette}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Ambient glow behind palette */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 w-100 h-50 bg-indigo-500/20 rounded-full blur-[90px] pointer-events-none"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl shadow-2xl shadow-indigo-500/15 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl overflow-hidden z-10 card-accent-top"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200/60 dark:border-slate-800">
              <Search className="w-5 h-5 text-indigo-500 shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Global Search: Type service ID (#30556), category, platform, or page name..."
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-sm">
                <Command className="w-3 h-3" /> ESC
              </kbd>
            </div>

            {/* Results Container */}
            <div className="max-h-96 overflow-y-auto p-2 space-y-4">
              {!hasResults ? (
                <div className="py-10 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 space-y-1">
                  <p>No matching services or pages found for "<span className="text-indigo-500 font-semibold">{query}</span>"</p>
                  <p className="text-[11px] text-slate-400">Try searching by service name, category, platform, or ID like #30556</p>
                </div>
              ) : (
                <>
                  {/* Matching Services Section */}
                  {filteredServices.length > 0 && (
                    <div className="space-y-1">
                      <div className="px-3 py-1 flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-indigo-500">
                        <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Matching Services ({services.length.toLocaleString()}+ Catalog)</span>
                        <span>Click to Order</span>
                      </div>
                      {filteredServices.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => handleSelectService(service.id)}
                          className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/80 dark:hover:bg-slate-800/60 text-left transition-all duration-150 group border border-transparent hover:border-indigo-200 dark:hover:border-indigo-900/50"
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-2">
                            <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800/60">
                              #{service.id}
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {service.name}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate">
                                {service.category} • <span className="uppercase text-indigo-400 font-semibold">{service.platform}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                              {formatCurrency(service.rate)}/1k
                            </span>
                            <div className="p-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              <Zap className="w-3.5 h-3.5 fill-current" />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* App Pages & Navigation */}
                  {filteredPages.length > 0 && (
                    <div className="space-y-1">
                      <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        App System Pages
                      </div>
                      {filteredPages.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={index}
                            onClick={() => handleSelectPath(item.path)}
                            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/60 text-left transition-all duration-150 group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:text-indigo-500 transition-colors shadow-xs">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                  {item.label}
                                </p>
                                <p className="text-[10px] text-slate-400">{item.category}</p>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="p-3 bg-slate-50/60 dark:bg-slate-900/60 border-t border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
              <span className="hidden sm:inline">Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono shadow-xs">Ctrl+K</kbd> anywhere to trigger global search</span>
              <span className="font-semibold text-indigo-400">Global Search active across {services.length.toLocaleString()}+ endpoints</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
