import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { COUNTRY_DISTRIBUTION, DEVICE_ANALYTICS, HOURLY_HEATMAP, TOP_PERFORMING_SERVICES } from '../../data/mockAnalytics';
import { formatCurrency } from '../../utils/formatters';
import { BarChart3, Globe, Smartphone, Flame, TrendingUp } from 'lucide-react';

export const AdminAnalytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-rose-500" /> Deep Analytics & Heatmaps
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Geographic traffic breakdown, peak order heatmaps, device distribution, and top service rankings.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Country Geographic Distribution */}
        <Card className="lg:col-span-2 p-6 space-y-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-500" /> Top Client Countries by Revenue
          </CardTitle>

          <div className="space-y-3">
            {COUNTRY_DISTRIBUTION.map(c => (
              <div key={c.code} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900 dark:text-white">{c.country} ({c.code})</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{formatCurrency(c.revenue)} ({c.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full"
                    style={{ width: `${c.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Device & Browser Analytics */}
        <Card className="p-6 space-y-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-indigo-500" /> Device Distribution
          </CardTitle>

          <div className="space-y-4">
            {DEVICE_ANALYTICS.map((d, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                  <span>{d.device}</span>
                  <span className="text-indigo-500">{d.percentage}%</span>
                </div>
                <p className="text-[11px] text-slate-400">{d.count}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Performing Services Rankings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" /> Top Performing Services (Revenue Leaders)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold">
              <tr>
                <th className="p-4">Service Name</th>
                <th className="p-4">Orders Count</th>
                <th className="p-4">Revenue Generated</th>
                <th className="p-4">Average Delivery Speed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
              {TOP_PERFORMING_SERVICES.map((s, i) => (
                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{s.name}</td>
                  <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{s.orders.toLocaleString()}</td>
                  <td className="p-4 font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(s.revenue)}</td>
                  <td className="p-4"><Badge variant="indigo">{s.avgSpeed}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
