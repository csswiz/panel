import React from 'react';
import { Card } from '../ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

export const StatCard = ({ title, value, change, isPositive = true, icon: Icon, sparklineData, color = 'indigo' }) => {
  const colorStyles = {
    indigo: { text: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/50', fill: '#6366F1', glow: 'group-hover:shadow-indigo-500/10 dark:group-hover:shadow-indigo-500/15' },
    emerald: { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/50', fill: '#10B981', glow: 'group-hover:shadow-emerald-500/10 dark:group-hover:shadow-emerald-500/15' },
    blue: { text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/50', fill: '#3B82F6', glow: 'group-hover:shadow-blue-500/10 dark:group-hover:shadow-blue-500/15' },
    amber: { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/50', fill: '#F59E0B', glow: 'group-hover:shadow-amber-500/10 dark:group-hover:shadow-amber-500/15' },
    purple: { text: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/50', fill: '#8B5CF6', glow: 'group-hover:shadow-purple-500/10 dark:group-hover:shadow-purple-500/15' },
    rose: { text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/50', fill: '#F43F5E', glow: 'group-hover:shadow-rose-500/10 dark:group-hover:shadow-rose-500/15' }
  };

  const currentStyle = colorStyles[color] || colorStyles.indigo;

  return (
    <Card hover className={`group p-5 flex flex-col justify-between relative overflow-hidden transition-shadow duration-300 hover:shadow-xl ${currentStyle.glow}`}>
      {/* Ambient icon glow */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${currentStyle.fill}15 0%, transparent 70%)` }}
      />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h4 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            {value}
          </h4>
        </div>
        {Icon && (
          <div className={`p-3 rounded-2xl ${currentStyle.bg} ${currentStyle.text} shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between relative z-10">
        {change && (
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full shadow-sm ${
                isPositive
                  ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
              }`}
            >
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {change}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">vs last month</span>
          </div>
        )}

        {sparklineData && (
          <div className="w-24 h-8 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <Area
                  type="monotone"
                  dataKey="val"
                  stroke={currentStyle.fill}
                  fill={currentStyle.fill}
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  );
};
