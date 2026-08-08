import React, { useState, useMemo } from "react";
import { useGaming } from "../../contexts/GamingContext";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { Card, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { formatCurrency } from "../../utils/formatters";
import {
  Gamepad2, Search, Zap, CheckCircle2, ShieldCheck, Trophy, Sparkles, User, RefreshCw, Clock, ArrowRight, ShieldAlert
} from "lucide-react";

export const GameServicesPage = () => {
  const { gameServices, gameOrders, categories, placeGameOrder } = useGaming();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState("All Gaming Services");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [activeGame, setActiveGame] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [playerDetails, setPlayerDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter game services
  const filteredServices = useMemo(() => {
    return gameServices.filter(game => {
      const matchesCategory = selectedCategory === "All Gaming Services" || game.category === selectedCategory;
      const matchesPlatform = selectedPlatform === "all" || game.platform === selectedPlatform;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        game.title.toLowerCase().includes(q) ||
        game.publisher.toLowerCase().includes(q) ||
        game.id.toLowerCase().includes(q);

      return matchesCategory && matchesPlatform && matchesSearch && game.status !== "Disabled";
    });
  }, [gameServices, selectedCategory, selectedPlatform, searchQuery]);

  // User's own gaming orders
  const myOrders = useMemo(() => {
    if (!user) return [];
    return gameOrders.filter(ord => ord.userEmail === user.email);
  }, [gameOrders, user]);

  const handleOpenOrderModal = (game) => {
    setActiveGame(game);
    setSelectedPackage(game.packages[0] || null);
    setPlayerDetails("");
  };

  const handleCheckoutGameOrder = (e) => {
    e.preventDefault();
    if (!activeGame || !selectedPackage) return;
    if (!playerDetails.trim()) {
      addToast("Please enter valid Player ID or User Tag!", "warning");
      return;
    }

    if ((user?.balance || 0) < selectedPackage.price) {
      addToast("Insufficient wallet balance! Please deposit funds to your wallet.", "error");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      try {
        const order = placeGameOrder({
          gameService: activeGame,
          packageItem: selectedPackage,
          playerDetails: playerDetails.trim()
        });

        addToast(`Game Top-Up Order #${order.id} placed! ${formatCurrency(order.charge)} deducted.`, "success");
        setActiveGame(null);
      } catch (err) {
        addToast(err.message || "Failed to place gaming order.", "error");
      } finally {
        setIsSubmitting(false);
      }
    }, 700);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-linear-to-r from-indigo-900 via-purple-900 to-slate-900 text-white overflow-hidden shadow-2xl border border-indigo-500/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Badge variant="indigo" className="gap-1.5 font-bold">
              <Gamepad2 className="w-4 h-4 text-emerald-400" /> INSTANT GAME TOP-UP STORE
            </Badge>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              In-Game Currency & Esports Boosts
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Instant reload for PUBG UC, Free Fire Diamonds, Valorant VP, Roblox Robux, Mobile Legends, and Esports Rank Boosting.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Available Wallet Balance</p>
              <p className="text-xl font-black text-emerald-400">{formatCurrency(user?.balance || 0)}</p>
            </div>
            <Button size="sm" variant="gradient" onClick={() => window.location.href = "/dashboard/wallet"} className="text-xs font-bold gap-1">
              + Deposit
            </Button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/30"
                : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search & Platform Filter Bar */}
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:max-w-md">
          <Input
            icon={Search}
            placeholder="Search game title, publisher, or package..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {[
            { id: "all", label: "All Devices" },
            { id: "mobile", label: "📱 Mobile" },
            { id: "pc", label: "💻 PC Gaming" },
            { id: "console", label: "🎮 Consoles" }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPlatform(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedPlatform === p.id
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Game Cards Grid */}
      {filteredServices.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <Gamepad2 className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Gaming Services Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No game titles match your filter criteria. Try searching for PUBG, Valorant, Free Fire, or Roblox.
          </p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map(game => {
            const lowestPrice = game.packages?.length > 0 ? Math.min(...game.packages.map(p => p.price)) : 0.99;
            return (
              <Card key={game.id} className="overflow-hidden group hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    
                    <div className="absolute top-3 left-3">
                      <Badge variant="indigo" size="sm">{game.badge}</Badge>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block">{game.publisher}</span>
                      <h3 className="text-base font-bold text-white leading-tight line-clamp-1">{game.title}</h3>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>Delivery Mode:</span>
                      <strong className="text-slate-900 dark:text-slate-200 font-bold">{game.deliveryType}</strong>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 font-medium">
                      {game.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Starting From</span>
                    <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">{formatCurrency(lowestPrice)}</span>
                  </div>

                  <Button
                    variant="gradient"
                    size="sm"
                    onClick={() => handleOpenOrderModal(game)}
                    className="gap-1.5 font-bold px-4"
                  >
                    Top-Up Now <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* User's Recent Gaming Orders */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" /> My Recent Gaming Orders
          </h2>
          <span className="text-xs text-slate-400 font-semibold">{myOrders.length} total game orders</span>
        </div>

        <Card className="overflow-hidden">
          {myOrders.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              You haven't placed any game top-up orders yet. Select a game above to get started!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Game Title</th>
                    <th className="p-4">Package</th>
                    <th className="p-4">Player Details</th>
                    <th className="p-4">Charge</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
                  {myOrders.map(ord => (
                    <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{ord.id}</td>
                      <td className="p-4 font-bold text-slate-900 dark:text-white">{ord.gameTitle}</td>
                      <td className="p-4 font-semibold text-slate-600 dark:text-slate-300">{ord.packageTitle}</td>
                      <td className="p-4 font-mono text-slate-500 max-w-xs truncate">{ord.playerDetails}</td>
                      <td className="p-4 font-black text-indigo-600 dark:text-indigo-400">{formatCurrency(ord.charge)}</td>
                      <td className="p-4">
                        <Badge
                          variant={
                            ord.status === "Completed"
                              ? "emerald"
                              : ord.status === "In Progress"
                              ? "indigo"
                              : ord.status === "Refunded"
                              ? "rose"
                              : "amber"
                          }
                        >
                          {ord.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Game Checkout Modal */}
      {activeGame && (
        <Modal
          isOpen={!!activeGame}
          onClose={() => setActiveGame(null)}
          title={`Game Top-Up: ${activeGame.title}`}
        >
          <form onSubmit={handleCheckoutGameOrder} className="space-y-5 text-xs">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60">
              <Gamepad2 className="w-8 h-8 text-indigo-500 shrink-0" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{activeGame.title}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Publisher: {activeGame.publisher} • Delivery: {activeGame.deliveryType}
                </p>
              </div>
            </div>

            {/* Select Package Grid */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Select Package Amount
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {activeGame.packages.map((pkg, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPackage(pkg)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedPackage?.name === pkg.name
                        ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20 font-bold"
                        : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-300"
                    }`}
                  >
                    <p className="text-xs font-bold">{pkg.name}</p>
                    <p className={`text-sm font-black mt-1 ${selectedPackage?.name === pkg.name ? "text-emerald-300" : "text-indigo-600 dark:text-indigo-400"}`}>
                      {formatCurrency(pkg.price)}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Player Details Input */}
            <div className="space-y-2">
              <Input
                label="Player ID / User Tag / Game Server Details"
                type="text"
                placeholder={
                  activeGame.requiredFields
                    ? `Enter ${activeGame.requiredFields.join(" & ")}`
                    : "e.g. Player UID: 559821094 (Server: Global)"
                }
                value={playerDetails}
                onChange={(e) => setPlayerDetails(e.target.value)}
                helperText="Double check your Player ID before submitting. Incorrect Player IDs cannot be refunded after reload."
                required
              />
            </div>

            {/* Price & Balance Box */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span>Selected Package:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedPackage?.name}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Your Wallet Balance:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(user?.balance || 0)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Total Checkout Amount:</span>
                <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(selectedPackage?.price || 0)}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              isLoading={isSubmitting}
              className="w-full justify-center gap-2 py-3.5 font-bold text-sm shadow-indigo-500/30"
            >
              <Zap className="w-4 h-4 fill-current" /> Confirm Game Top-Up Order
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
};
