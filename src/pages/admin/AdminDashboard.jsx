import React from "react";
import { StatCard } from "../../components/common/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { REVENUE_MONTHLY, PLATFORM_DISTRIBUTION } from "../../data/mockAnalytics";
import { ORDER_STATUS_COLORS } from "../../data/mockOrders";
import { useOrders } from "../../contexts/OrdersContext";
import { formatCurrency } from "../../utils/formatters";
import {
  DollarSign, TrendingUp, Users, Cpu, ArrowRight, BarChart3
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import { useNavigate } from "react-router-dom";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Executive Header Banner */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-rose-900 via-slate-900 to-indigo-950 border border-rose-500/40 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="rose">SUPER ADMIN MODE</Badge>
            <span className="text-xs font-semibold text-rose-300">• Live Production Metrics</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Executive Operations Control</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Real-time control center for revenue analytics, user directory, catalog pricing, and node health.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="danger" onClick={() => navigate("/admin/analytics")} className="gap-2 font-bold text-xs">
            <BarChart3 className="w-4 h-4" /> Full Analytics Engine
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Gross Revenue (YTD)"
          value="$568,200.00"
          change="+32.4%"
          isPositive={true}
          icon={DollarSign}
          color="rose"
        />
        <StatCard
          title="Net Profit (30D)"
          value="$61,500.00"
          change="+18.8%"
          isPositive={true}
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Total Registered Users"
          value="5,420"
          change="+450"
          isPositive={true}
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Server Cluster Node Load"
          value="14.2%"
          change="Optimal"
          isPositive={true}
          icon={Cpu}
          color="purple"
        />
      </div>

      {/* Recharts Revenue Area Chart + Platform Donut Chart */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Global Revenue vs Net Profit</CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400">Monthly financial performance breakdown</p>
            </div>
            <Badge variant="emerald">+24% YoY Growth</Badge>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_MONTHLY}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#1E293B", borderRadius: "12px", color: "#FFF" }} />
                <Area type="monotone" dataKey="revenue" name="Gross Revenue" stroke="#F43F5E" strokeWidth={3} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="profit" name="Net Profit" stroke="#10B981" strokeWidth={3} fill="url(#colorProf)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Platform Share Donut Chart */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <CardTitle className="text-base mb-1">Platform Market Share</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Order revenue volume by social network</p>

            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PLATFORM_DISTRIBUTION}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {PLATFORM_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#1E293B", borderRadius: "12px", color: "#FFF" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-800">
            {PLATFORM_DISTRIBUTION.slice(0, 4).map((p, i) => (
              <div key={i} className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  {p.name}
                </span>
                <span className="text-slate-900 dark:text-white font-bold">{p.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Global Orders Control Table */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Live System Orders Queue</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">Admin override & status monitoring</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/admin/orders")} className="gap-1 text-xs">
            View All Global Orders <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">User</th>
                <th className="p-4">Service</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Charge</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
              {recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{order.id}</td>
                  <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">{order.userName || "Alex Vance"}</td>
                  <td className="p-4 max-w-xs truncate font-medium text-slate-700 dark:text-slate-300">{order.serviceName}</td>
                  <td className="p-4 font-semibold">{order.quantity.toLocaleString()}</td>
                  <td className="p-4 font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(order.charge)}</td>
                  <td className="p-4"><Badge variant={ORDER_STATUS_COLORS[order.status] || "default"}>{order.status}</Badge></td>
                  <td className="p-4 text-right">
                    <Button size="sm" variant="secondary" onClick={() => navigate("/admin/orders")} className="text-[11px] py-1 px-2.5">
                      Manage
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
