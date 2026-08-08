import React, { useState, useMemo } from "react";
import { useGaming } from "../../contexts/GamingContext";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { formatCurrency } from "../../utils/formatters";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { ALL_ELDORADO_GAMES, CATEGORY_ITEMS } from "../../data/eldoradoGamesList";
import {
  Gamepad2, Search, Zap, ShieldCheck, Star, CheckCircle2,
  Sparkles, Key, ShoppingCart, UserCheck, ChevronDown, ChevronUp,
  Coins, Package, TrendingUp, Gift, Lock, Copy, ArrowLeft,
  Info, Send, Hash, User
} from "lucide-react";

// ─── Category Config ──────────────────────────────────────────────────────────
const ELDORADO_CATEGORIES = [
  { id: "Currency",    label: "Currency",    icon: Coins,     hint: "Gold, Coins & In-game Money" },
  { id: "Accounts",   label: "Accounts",    icon: Key,       hint: "Stacked & OG Accounts" },
  { id: "Top Ups",    label: "Top Ups",     icon: Zap,       hint: "Player UID & Direct Reload" },
  { id: "Items",      label: "Items",       icon: Package,   hint: "Skins, Pets & Rare Items" },
  { id: "Boosting",   label: "Boosting",    icon: TrendingUp,hint: "Rank Carry & Powerleveling" },
  { id: "Gift Cards", label: "Gift Cards",  icon: Gift,      hint: "Digital Keys & Subscriptions" },
];

// ─── Helper: Derive the game name from a category item label ─────────────────
const deriveGame = (itemLabel) => {
  // Strip trailing currency/unit nouns to get the base game name for the badge
  return itemLabel
    .replace(/ (Coins|Gold|Silver|Cash|Tokens|Gems|Diamonds|Points|Credits|UC|GP|S\$|Bars|Mesos|Mesos|Runes|Roubles|ISK|Caps|Won|Lucent|Shards|Platinum|Flux|Stubs|Kamas|Sheckles|Locks|Pansun|aUEC|Kinah|Alloy|Solaris|Gyldenblod|Elementium|Gil|Stardust|Robux|Bonds|Subscription|Top Ups|Gift Cards|Gift Card|Nitro|Pass|ZEMs|Frost Stars|Star Memory|Echo Beads|Monochromes|Riftcrystal|Origeometry|Chronal Nexus|Minecoins|Wild Cores|Lattice|Dragon Coins|Riot Points|Ancient Coins|Goldstars|TAM Gold|Auric Cells|Delta Coins|Scraps|V-Bucks)$/i, "")
    .trim();
};

// ─── Color accent per category ────────────────────────────────────────────────
const CAT_COLORS = {
  "Currency":    { bg: "bg-amber-500/10",   border: "border-amber-500/30",   text: "text-amber-400",   btn: "bg-amber-500 hover:bg-amber-400" },
  "Accounts":    { bg: "bg-indigo-500/10",  border: "border-indigo-500/30",  text: "text-indigo-400",  btn: "bg-indigo-600 hover:bg-indigo-500" },
  "Top Ups":     { bg: "bg-sky-500/10",     border: "border-sky-500/30",     text: "text-sky-400",     btn: "bg-sky-600 hover:bg-sky-500" },
  "Items":       { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", btn: "bg-emerald-600 hover:bg-emerald-500" },
  "Boosting":    { bg: "bg-rose-500/10",    border: "border-rose-500/30",    text: "text-rose-400",    btn: "bg-rose-600 hover:bg-rose-500" },
  "Gift Cards":  { bg: "bg-purple-500/10",  border: "border-purple-500/30",  text: "text-purple-400",  btn: "bg-purple-600 hover:bg-purple-500" },
};

// ─── Accounts Listing Card ────────────────────────────────────────────────────
const AccountListingCard = ({ item, onBuy }) => (
  <Card className="p-5 flex flex-col justify-between space-y-4 hover:border-indigo-500/50 transition-all duration-300 group">
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Badge variant="indigo" className="font-extrabold uppercase text-[10px]">{item.game}</Badge>
        <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
          <Zap className="w-3 h-3 fill-current" /> {item.deliveryType}
        </span>
      </div>
      <h3 className="font-bold text-slate-100 text-sm line-clamp-2 group-hover:text-indigo-400 transition-colors leading-snug">{item.title}</h3>
      <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-indigo-400" />
          <span className="font-bold text-slate-200">{item.seller}</span>
        </div>
        <div className="flex items-center gap-1 text-amber-400 font-bold">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{item.rating}</span>
          <span className="text-slate-500 text-[10px]">({item.reviews.toLocaleString()})</span>
        </div>
      </div>
      <div className="space-y-1">
        {Object.entries(item.specs).slice(0, 3).map(([k, v]) => (
          <div key={k} className="flex items-center justify-between text-[11px]">
            <span className="capitalize text-slate-500">{k}:</span>
            <span className="font-semibold text-slate-300 truncate max-w-44">{v}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
      <div>
        <span className="text-xs text-slate-600 line-through block font-medium">${item.originalPrice}</span>
        <span className="text-xl font-black text-emerald-400">{formatCurrency(item.price)}</span>
      </div>
      <Button variant="gradient" size="sm" onClick={() => onBuy(item)} className="gap-1.5 font-bold">
        <ShoppingCart className="w-4 h-4" /> Buy Now
      </Button>
    </div>
  </Card>
);

// ─── Generic Category Item Card ───────────────────────────────────────────────
const CategoryItemCard = ({ itemLabel, category, onOrder }) => {
  const colors = CAT_COLORS[category] || CAT_COLORS["Items"];
  const game = deriveGame(itemLabel);
  return (
    <button
      onClick={() => onOrder(itemLabel)}
      className={`group w-full text-left p-4 rounded-2xl border ${colors.border} ${colors.bg} hover:brightness-110 transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colors.bg} border ${colors.border}`}>
          <Gamepad2 className={`w-4.5 h-4.5 ${colors.text}`} />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-slate-100 text-sm leading-tight truncate group-hover:text-white">{itemLabel}</p>
          {game !== itemLabel && <p className="text-[10px] text-slate-500 font-semibold truncate">{game}</p>}
        </div>
      </div>
      <span className={`shrink-0 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${colors.border} ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap`}>
        Order →
      </span>
    </button>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
export const GameServicesPage = () => {
  const { user }           = useAuth();
  const { addToast }       = useToast();
  const { eldoradoListings, placeAccountOrder } = useGaming();

  const [activeCategory, setActiveCategory]   = useState("Accounts");
  const [searchItem, setSearchItem]           = useState("");

  // Account buy modal
  const [selectedListing, setSelectedListing]           = useState(null);
  const [purchasedCredentials, setPurchasedCredentials] = useState(null);
  const [isSubmitting, setIsSubmitting]                 = useState(false);

  // Generic order modal (Currency / Top Ups / Items / Boosting / Gift Cards)
  const [orderItem, setOrderItem]   = useState(null);   // label string
  const [orderForm, setOrderForm]   = useState({ quantity: "1", playerInfo: "", notes: "" });
  const [orderDone, setOrderDone]   = useState(false);
  const [orderId, setOrderId]       = useState(null);

  // ── Filtered items for current category ───────────────────────────────────
  const currentItems = useMemo(() => {
    const raw = CATEGORY_ITEMS[activeCategory] || [];
    if (!searchItem.trim()) return raw;
    const q = searchItem.toLowerCase();
    return raw.filter(i => i.toLowerCase().includes(q));
  }, [activeCategory, searchItem]);

  const accountListings = useMemo(() => {
    if (activeCategory !== "Accounts") return [];
    if (!searchItem.trim()) return eldoradoListings;
    const q = searchItem.toLowerCase();
    return eldoradoListings.filter(
      l => l.game.toLowerCase().includes(q) || l.title.toLowerCase().includes(q)
    );
  }, [activeCategory, eldoradoListings, searchItem]);

  // ── Account Buy Flow ──────────────────────────────────────────────────────
  const handleBuyAccount = (e) => {
    e.preventDefault();
    if (!selectedListing) return;
    if ((user?.balance || 0) < selectedListing.price) {
      addToast(`Insufficient wallet balance! Need ${formatCurrency(selectedListing.price)}`, "error");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      try {
        const order = placeAccountOrder({ listing: selectedListing });
        setPurchasedCredentials({ orderId: order.id, credentials: selectedListing.credentials });
        addToast(`Account purchased! Credentials released for ${selectedListing.game}.`, "success");
      } catch (err) { addToast(err.message, "error"); }
      finally { setIsSubmitting(false); }
    }, 700);
  };

  const copyText = (t) => { navigator.clipboard.writeText(t); addToast("Copied to clipboard!", "info"); };

  // ── Generic Order Flow ────────────────────────────────────────────────────
  const openOrderModal = (label) => {
    setOrderItem(label);
    setOrderForm({ quantity: "1", playerInfo: "", notes: "" });
    setOrderDone(false);
    setOrderId(null);
  };

  const handlePlaceGenericOrder = (e) => {
    e.preventDefault();
    const newId = `MKT-${Math.floor(10000 + Math.random() * 90000)}`;
    setOrderId(newId);
    setOrderDone(true);
    addToast(`Order #${newId} placed for ${orderItem}!`, "success");
  };

  const colors = CAT_COLORS[activeCategory] || CAT_COLORS["Items"];
  const activeCat = ELDORADO_CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div className="space-y-6">
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 text-white overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="indigo" className="bg-indigo-600/30 border-indigo-500/40 text-indigo-300 font-bold text-[10px]">
              ELDORADO GAMING MARKETPLACE
            </Badge>
            <span className="text-xs text-slate-400 font-semibold">• 173+ Games • Instant Delivery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Gamepad2 className="w-7 h-7 text-indigo-400 shrink-0" />
            Eldorado — Currency, Accounts, Top-Ups, Items, Boosting & Gift Cards
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Trade in-game currency, buy stacked accounts, refill your top-ups, grab rare items, get rank carries and digital gift cards — with 100% buyer protection & instant 24/7 delivery.
          </p>
        </div>
      </div>

      {/* ── Category Nav Bar ───────────────────────────────────────────── */}
      <Card className="p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800" style={{ scrollbarWidth: "none" }}>
          {ELDORADO_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const Icon = cat.icon;
            const c = CAT_COLORS[cat.id];
            return (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setSearchItem(""); }}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 whitespace-nowrap border shrink-0 ${
                  isActive
                    ? `${c.bg} ${c.border} ${c.text} shadow-md`
                    : "bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
                {isActive
                  ? <ChevronUp className="w-3.5 h-3.5 shrink-0" />
                  : <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${colors.text}`} />
          <input
            type="text"
            value={searchItem}
            onChange={e => setSearchItem(e.target.value)}
            placeholder={`Search ${activeCategory}… (${activeCategory === "Accounts" ? eldoradoListings.length + " listings" : (CATEGORY_ITEMS[activeCategory]?.length || 0) + " items"})`}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-semibold"
          />
        </div>

        {/* Category subtitle */}
        <div className={`flex items-center gap-2 text-xs font-semibold ${colors.text}`}>
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>{activeCat?.hint}</span>
          <span className="text-slate-600 ml-auto">
            {activeCategory === "Accounts"
              ? `${accountListings.length} listings`
              : `${currentItems.length} items`}
          </span>
        </div>
      </Card>

      {/* ── Accounts: Listing Grid ──────────────────────────────────────── */}
      {activeCategory === "Accounts" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Accounts Marketplace ({accountListings.length})
            </h2>
            <span className="text-xs text-slate-400 font-semibold">Instant Email Access • Buyer Protection</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {accountListings.length === 0 ? (
              <Card className="col-span-full py-10 text-center text-slate-500">
                <Key className="w-10 h-10 mx-auto text-slate-700 mb-3" />
                <p className="font-bold text-white">No accounts found for "{searchItem}"</p>
              </Card>
            ) : accountListings.map(item => (
              <AccountListingCard
                key={item.id}
                item={item}
                onBuy={(listing) => { setSelectedListing(listing); setPurchasedCredentials(null); }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Other Categories: Item Grid ─────────────────────────────────── */}
      {activeCategory !== "Accounts" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className={`w-5 h-5 ${colors.text}`} />
              {activeCategory} ({currentItems.length})
            </h2>
            <span className="text-xs text-slate-400 font-semibold">Click any item to place an order</span>
          </div>

          {currentItems.length === 0 ? (
            <Card className="py-10 text-center text-slate-500">
              <Package className="w-10 h-10 mx-auto text-slate-700 mb-3" />
              <p className="font-bold text-white">No results for "{searchItem}"</p>
              <p className="text-xs mt-1">Try a different search term.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {currentItems.map((label) => (
                <CategoryItemCard
                  key={label}
                  itemLabel={label}
                  category={activeCategory}
                  onOrder={openOrderModal}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Account Buy Modal ───────────────────────────────────────────── */}
      <Modal
        isOpen={Boolean(selectedListing)}
        onClose={() => { setSelectedListing(null); setPurchasedCredentials(null); }}
        title={purchasedCredentials
          ? `🎉 Purchase Successful — Credentials Released`
          : `Buy Account: ${selectedListing?.game}`}
        maxWidth="max-w-xl"
      >
        {selectedListing && (
          <div className="space-y-5 text-xs">
            {purchasedCredentials ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 space-y-1">
                  <p className="font-bold flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Order {purchasedCredentials.orderId} Confirmed!
                  </p>
                  <p className="text-slate-300 text-xs">Wallet debited {formatCurrency(selectedListing.price)}. Account details below:</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-400 text-[10px] uppercase">Login Credentials</span>
                    <button onClick={() => copyText(purchasedCredentials.credentials)} className="text-indigo-400 hover:text-white font-bold flex items-center gap-1 text-[11px]">
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </button>
                  </div>
                  <pre className="font-mono text-xs text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-800 whitespace-pre-wrap break-all">
                    {purchasedCredentials.credentials}
                  </pre>
                </div>
                <Button variant="gradient" onClick={() => { setSelectedListing(null); setPurchasedCredentials(null); }} className="w-full justify-center py-2.5 font-bold">
                  Done
                </Button>
              </div>
            ) : (
              <form onSubmit={handleBuyAccount} className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <Badge variant="indigo" className="font-bold">{selectedListing.game}</Badge>
                  <h4 className="font-bold text-slate-100 text-sm leading-snug">{selectedListing.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {selectedListing.rating} ({selectedListing.reviews.toLocaleString()} reviews) · {selectedListing.seller}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <p className="font-bold text-slate-300 text-[10px] uppercase mb-2">Specifications</p>
                  {Object.entries(selectedListing.specs).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between text-xs">
                      <span className="capitalize text-slate-500">{k}</span>
                      <span className="font-semibold text-slate-200 text-right max-w-52">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Wallet Balance</span>
                    <span className="font-bold text-white">{formatCurrency(user?.balance || 0)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="line-through text-slate-600">${selectedListing.originalPrice}</span>
                    <span className="font-bold text-emerald-400 text-lg">{formatCurrency(selectedListing.price)}</span>
                  </div>
                </div>
                <Button type="submit" variant="gradient" isLoading={isSubmitting} className="w-full justify-center py-3 font-bold text-sm gap-2">
                  <Lock className="w-4 h-4" /> Confirm & Unlock Account ({formatCurrency(selectedListing.price)})
                </Button>
              </form>
            )}
          </div>
        )}
      </Modal>

      {/* ── Generic Order Modal (Currency / Top Ups / Items / Boosting / Gift Cards) ── */}
      <Modal
        isOpen={Boolean(orderItem)}
        onClose={() => { setOrderItem(null); setOrderDone(false); }}
        title={orderDone ? `✅ Order Placed Successfully` : `Order: ${orderItem}`}
        maxWidth="max-w-md"
      >
        {orderItem && (
          <div className="space-y-5 text-xs">
            {orderDone ? (
              <div className="space-y-4 text-center">
                <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <p className="font-black text-sm text-white">Order #{orderId} Placed!</p>
                  <p className="text-xs text-slate-300">{orderItem}</p>
                  <p className="text-xs text-slate-400 mt-1">Our team will process your order shortly. Check your Orders page for live status updates.</p>
                </div>
                <Button variant="gradient" onClick={() => { setOrderItem(null); setOrderDone(false); }} className="w-full justify-center py-2.5 font-bold">
                  Done — View My Orders
                </Button>
              </div>
            ) : (
              <form onSubmit={handlePlaceGenericOrder} className="space-y-4">
                {/* Item badge */}
                <div className={`p-4 rounded-2xl border ${colors.border} ${colors.bg} space-y-1`}>
                  <p className={`text-[10px] font-black uppercase ${colors.text}`}>{activeCategory}</p>
                  <p className="font-bold text-white text-sm">{orderItem}</p>
                </div>

                {/* Quantity / Amount */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5" /> Quantity / Amount
                  </label>
                  <input
                    type="text"
                    value={orderForm.quantity}
                    onChange={e => setOrderForm(f => ({ ...f, quantity: e.target.value }))}
                    placeholder="e.g. 100M gold, 500 UC, 1 account…"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Player Info */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    {activeCategory === "Boosting" ? "Game Username / Account Email" :
                     activeCategory === "Gift Cards" ? "Delivery Email Address" :
                     activeCategory === "Top Ups" ? "Player ID / UID" :
                     "Player Username / Game ID"}
                  </label>
                  <input
                    type="text"
                    value={orderForm.playerInfo}
                    onChange={e => setOrderForm(f => ({ ...f, playerInfo: e.target.value }))}
                    placeholder={
                      activeCategory === "Boosting" ? "your_username#1234" :
                      activeCategory === "Gift Cards" ? "your@email.com" :
                      activeCategory === "Top Ups" ? "e.g. 5124389012 (PUBG UID)" :
                      "Player Tag / Username"
                    }
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" /> Additional Notes (optional)
                  </label>
                  <textarea
                    value={orderForm.notes}
                    onChange={e => setOrderForm(f => ({ ...f, notes: e.target.value }))}
                    rows={2}
                    placeholder="Any special requirements, server, region, etc."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 text-xs font-semibold focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-[11px] leading-relaxed">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline mr-1" />
                  Secure order • Staff will contact you to confirm price & delivery. Your order will appear in Orders tab.
                </div>

                <Button type="submit" variant="gradient" className={`w-full justify-center py-3 font-bold text-sm gap-2`}>
                  <Send className="w-4 h-4" /> Place Order for {orderItem}
                </Button>
              </form>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
