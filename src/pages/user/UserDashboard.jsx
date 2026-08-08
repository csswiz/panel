import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { StatCard } from "../../components/common/StatCard";
import { Card, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { ORDER_STATUS_COLORS } from "../../data/mockOrders";
import { useOrders } from "../../contexts/OrdersContext";
import { REVENUE_MONTHLY } from "../../data/mockAnalytics";
import { MOCK_ANNOUNCEMENTS } from "../../data/mockAnnouncements";
import { formatCurrency, formatDate } from "../../utils/formatters";
import {
  Wallet, ShoppingCart, Clock, TrendingUp, Sparkles, ArrowRight, PlusCircle, Megaphone, Activity
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { orders } = useOrders();

  const recentOrders = orders.slice(0, 5);

  const sparklineData = [
    { val: 1200 }, { val: 1800 }, { val: 1400 }, { val: 2400 }, { val: 3200 }, { val: 2900 }, { val: 4850 }
  ];

  const totalOrdersCount = user?.ordersCount ?? orders.length;

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-linear-to-r from-indigo-600 via-blue-600 to-purple-600 text-white overflow-hidden shadow-xl shadow-indigo-500/15">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-indigo-400/15 rounded-full blur-[60px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-violet-400/10 rounded-full blur-2xl pointer-events-none animate-float-slow" />
        <div className="absolute inset-0 dot-pattern opacity-10" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="indigo" className="bg-white/20 text-white border-white/30 shadow-sm">
                {user?.tier || "Standard"}
              </Badge>
              <span className="text-xs font-semibold text-indigo-100">• 15% VIP Discount Active</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Welcome back, {user?.name || "Member"}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-xl">
              Your panel is operating cleanly. 5,000+ services are live with sub-second order processing speed.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate("/dashboard/new-order")}
              className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold border-none shadow-lg gap-2"
            >
              <ShoppingCart className="w-4 h-4" /> Place New Order
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard/wallet")}
              className="border-white/40 text-white hover:bg-white/10 font-bold gap-2"
            >
              <PlusCircle className="w-4 h-4" /> Add Balance
            </Button>
          </div>
        </div>
      </div>

      {/* Announcements Marquee */}
      {MOCK_ANNOUNCEMENTS.length > 0 && (
        <div className="glass-panel p-4 rounded-2xl border-amber-500/20 bg-amber-500/3 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-500 shrink-0 shadow-sm">
            <Megaphone className="w-4 h-4 animate-bounce" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {MOCK_ANNOUNCEMENTS[0].title}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
              {MOCK_ANNOUNCEMENTS[0].content}
            </p>
          </div>
          <Badge variant="amber" className="hidden sm:inline-flex shrink-0">
            {MOCK_ANNOUNCEMENTS[0].badge}
          </Badge>
        </div>
      )}

      {/* Overview Stat Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Wallet Balance"
          value={formatCurrency(user?.balance || 0)}
          change="+12.4%"
          isPositive={true}
          icon={Wallet}
          sparklineData={sparklineData}
          color="emerald"
        />
        <StatCard
          title="Total Lifetime Spent"
          value={formatCurrency(user?.totalSpent || 0)}
          change="+8.2%"
          isPositive={true}
          icon={TrendingUp}
          color="indigo"
        />
        <StatCard
          title="Total Orders Completed"
          value={totalOrdersCount.toLocaleString()}
          change="+18.5%"
          isPositive={true}
          icon={ShoppingCart}
          color="blue"
        />
        <StatCard
          title="API Response Speed"
          value="12 ms"
          change="-4 ms"
          isPositive={true}
          icon={Activity}
          color="purple"
        />
      </div>

      {/* Recharts Revenue & Orders Graph + Quick Order Preview */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Spending & Order Activity</CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400">Monthly breakdown of agency order volume</p>
            </div>
            <Badge variant="indigo">Monthly SLA</Badge>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_MONTHLY}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#1E293B", borderRadius: "12px", color: "#FFF" }} />
                <Area type="monotone" dataKey="revenue" name="Volume ($)" stroke="#6366F1" strokeWidth={3} fill="url(#colorSpend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Quick Order Widget */}
        <Card className="p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <CardTitle className="text-base">Quick Campaign Launch</CardTitle>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Instantly boost your social presence across Instagram, TikTok, YouTube, and X.
            </p>
          </div>

          <div className="space-y-3 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
              <span>Active Platform API</span>
              <span className="text-emerald-500 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Sub-second Start
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              99.9% uptime SLA guaranteed. Non-drop 30D refill active.
            </p>
          </div>

          <Button
            variant="gradient"
            onClick={() => navigate("/dashboard/new-order")}
            className="w-full justify-center gap-2 font-bold py-3 text-xs"
          >
            Create New Campaign <ArrowRight className="w-4 h-4" />
          </Button>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <div className="p-4 sm:p-6 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <CardTitle>Recent Orders History</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Live tracking for your last 5 campaigns</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/orders")}
            className="text-xs font-bold gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Service</th>
                <th className="p-4">Charge</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-xs text-slate-400">
                    No orders placed yet. <button onClick={() => navigate("/dashboard/new-order")} className="text-indigo-500 font-bold hover:underline">Submit your first campaign</button>
                  </td>
                </tr>
              ) : (
                recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{order.id}</td>
                    <td className="p-4 text-slate-400 font-medium whitespace-nowrap">{formatDate(order.createdAt)}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-slate-100 max-w-xs truncate">{order.serviceName}</td>
                    <td className="p-4 font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(order.charge)}</td>
                    <td className="p-4">
                      <Badge variant={ORDER_STATUS_COLORS[order.status] || "default"}>
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
