import React, { useState } from 'react';
import { MOCK_NOTIFICATIONS } from '../../data/mockAnnouncements';
import { Bell, Check, ShoppingBag, Wallet, MessageSquare, AlertCircle, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'order': return <ShoppingBag className="w-4 h-4 text-emerald-500" />;
      case 'wallet': return <Wallet className="w-4 h-4 text-blue-500" />;
      case 'ticket': return <MessageSquare className="w-4 h-4 text-violet-500" />;
      default: return <AlertCircle className="w-4 h-4 text-indigo-500" />;
    }
  };

  const getAccentColor = (type) => {
    switch (type) {
      case 'order': return 'border-l-emerald-500';
      case 'wallet': return 'border-l-blue-500';
      case 'ticket': return 'border-l-violet-500';
      default: return 'border-l-indigo-500';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 shadow-lg shadow-indigo-500/30">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-slate-950/30 border border-slate-200/60 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl overflow-hidden z-50 card-accent-top"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-slate-800/60">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h4>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 rounded-full shadow-sm">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Mark read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100/80 dark:divide-slate-800/50">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 flex gap-3 transition-all duration-150 border-l-2 ${getAccentColor(item.type)} ${
                    item.unread
                      ? 'bg-indigo-50/30 dark:bg-indigo-950/15'
                      : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/30 border-l-transparent'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-100/80 dark:bg-slate-800 shrink-0 self-start shadow-sm">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.title}</p>
                      <span className="text-[10px] text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
