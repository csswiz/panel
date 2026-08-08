import React, { useState, useEffect, useMemo } from "react";
import { useOrders } from "../../contexts/OrdersContext";
import { useGaming } from "../../contexts/GamingContext";
import { formatCurrency } from "../../utils/formatters";
import {
  CheckCircle2, ShoppingCart, Gamepad2, Clock, Zap, Sparkles, X, ChevronUp, ChevronDown, Activity
} from "lucide-react";

const SEED_FEED_ITEMS = [
  {
    id: "F-101",
    user: "alex_99***",
    service: "Instagram Followers [100% Real - Non-Drop]",
    qty: "5,000",
    charge: 2.45,
    status: "Completed",
    type: "smm",
    time: "Just now"
  },
  {
    id: "F-102",
    user: "digital_pro***",
    service: "PUBG Mobile Unknown Cash (UC)",
    qty: "660 UC",
    charge: 9.99,
    status: "Completed",
    type: "gaming",
    time: "2m ago"
  },
  {
    id: "F-103",
    user: "sarah_growth***",
    service: "TikTok High Retention Views",
    qty: "25,000",
    charge: 1.15,
    status: "Processing",
    type: "smm",
    time: "3m ago"
  },
  {
    id: "F-104",
    user: "vikram_m***",
    service: "Valorant Points (VP) Code",
    qty: "2,050 VP",
    charge: 19.99,
    status: "Completed",
    type: "gaming",
    time: "4m ago"
  },
  {
    id: "F-105",
    user: "agency_cloud***",
    service: "YouTube Subscribers [Instant Start]",
    qty: "1,000",
    charge: 4.50,
    status: "Processing",
    type: "smm",
    time: "5m ago"
  },
  {
    id: "F-106",
    user: "hassan_v***",
    service: "Free Fire 1060 Diamonds Reload",
    qty: "1,166",
    charge: 9.99,
    status: "Completed",
    type: "gaming",
    time: "6m ago"
  },
  {
    id: "F-107",
    user: "media_boost***",
    service: "Telegram Channel Real Members",
    qty: "10,000",
    charge: 3.80,
    status: "Completed",
    type: "smm",
    time: "8m ago"
  }
];

export const GlobalOrderFeed = () => {
  const { orders = [] } = useOrders();
  const { gameOrders = [] } = useGaming();
  const [collapsed, setCollapsed] = useState(false);
  const [feedItems, setFeedItems] = useState(SEED_FEED_ITEMS);

  // Combine real user orders with seed feed items
  const combinedFeed = useMemo(() => {
    const realSmm = (orders || []).slice(0, 5).map(o => ({
      id: `REAL-${o.id}`,
      user: o.user || "You",
      service: o.serviceName || "SMM Service",
      qty: o.quantity ? o.quantity.toLocaleString() : "1,000",
      charge: o.charge || 0.99,
      status: o.status || "Completed",
      type: "smm",
      time: "Recent"
    }));

    const realGaming = (gameOrders || []).slice(0, 5).map(g => ({
      id: `GAME-${g.id}`,
      user: g.userName || "You",
      service: `${g.gameTitle} (${g.packageTitle})`,
      qty: g.quantity ? g.quantity.toLocaleString() : "1",
      charge: g.charge || 4.99,
      status: g.status || "Completed",
      type: "gaming",
      time: "Recent"
    }));

    return [...realSmm, ...realGaming, ...feedItems];
  }, [orders, gameOrders, feedItems]);

  // Simulate periodic live activity updates
  useEffect(() => {
    const interval = setInterval(() => {
      const randomNames = ["zeno***", "hyper***", "nova***", "vortex***", "cyber***", "apex***"];
      const randomServices = [
        { name: "Instagram Story Views", qty: "10,000", charge: 0.45, type: "smm" },
        { name: "Mobile Legends 706 Diamonds", qty: "706", charge: 11.99, type: "gaming" },
        { name: "Spotify Monthly Listeners", qty: "5,000", charge: 2.10, type: "smm" },
        { name: "Roblox 1,700 Robux", qty: "1,700", charge: 19.99, type: "gaming" }
      ];

      const chosenName = randomNames[Math.floor(Math.random() * randomNames.length)];
      const chosenService = randomServices[Math.floor(Math.random() * randomServices.length)];

      const newItem = {
        id: `DYN-${Date.now()}`,
        user: chosenName,
        service: chosenService.name,
        qty: chosenService.qty,
        charge: chosenService.charge,
        status: Math.random() > 0.3 ? "Completed" : "Processing",
        type: chosenService.type,
        time: "Just now"
      };

      setFeedItems(prev => [newItem, ...prev.slice(0, 12)]);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  if (collapsed) {
    return (
      <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-1 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-bold text-slate-300">Live Global Order Feed Bar</span>
        </div>
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-1 hover:text-white transition-colors text-[10px] font-semibold uppercase tracking-wider"
        >
          <ChevronDown className="w-3.5 h-3.5" /> Expand Feed
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-slate-900/95 border-b border-indigo-500/20 backdrop-blur-md overflow-hidden z-20 shadow-md">
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 gap-4">
        {/* Left Live Indicator Badge */}
        <div className="flex items-center gap-2 shrink-0 bg-indigo-950/80 border border-indigo-500/30 px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase text-indigo-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <Activity className="w-3 h-3 text-indigo-400 animate-pulse" />
          <span className="hidden sm:inline">LIVE ORDER FEED</span>
        </div>

        {/* Marquee Ticker Container */}
        <div className="flex-1 overflow-hidden relative group">
          <div className="flex items-center gap-6 animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap">
            {combinedFeed.concat(combinedFeed).map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs transition-colors hover:bg-slate-800 hover:border-indigo-500/40"
              >
                {item.type === "gaming" ? (
                  <Gamepad2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                ) : item.status === "Completed" ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}

                <span className="font-mono text-[11px] text-slate-400 font-semibold">{item.user}</span>
                <span className="text-slate-300 font-bold truncate max-w-xs">{item.service}</span>
                <span className="font-mono font-bold text-slate-400 text-[11px]">({item.qty})</span>

                <span className="font-black text-emerald-400 text-[11px]">
                  {formatCurrency(item.charge)}
                </span>

                <span
                  className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                    item.status === "Completed"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Collapse Button */}
        <button
          onClick={() => setCollapsed(true)}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
          title="Minimize feed strip"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>

      {/* Marquee Animation Custom CSS */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 35s linear infinite;
        }
      `}</style>
    </div>
  );
};
