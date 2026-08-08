import React, { useState, useMemo } from "react";
import { useGaming } from "../../contexts/GamingContext";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { ALL_ELDORADO_GAMES } from "../../data/eldoradoGamesList";
import {
  Gamepad2, Search, Zap, ShieldCheck, Star, CheckCircle2,
  Sparkles, Key, ShoppingCart, UserCheck, Flame, Layers, Lock, Copy
} from "lucide-react";

export const GameServicesPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { gameServices, eldoradoListings, gameOrders, placeGameOrder, placeAccountOrder } = useGaming();

  const [activeTab, setActiveTab] = useState("Accounts"); // 'Accounts' | 'Currency' | 'Items' | 'Boosting'
  const [searchGame, setSearchGame] = useState("");
  const [selectedGameFilter, setSelectedGameFilter] = useState("All Games");

  // Account Buy Modal state
  const [selectedListing, setSelectedListing] = useState(null);
  const [purchasedCredentials, setPurchasedCredentials] = useState(null);

  // Top-Up Order Modal state
  const [selectedTopUpService, setSelectedTopUpService] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [playerDetails, setPlayerDetails] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter 173 games for dropdown search
  const filteredGamesList = useMemo(() => {
    if (!searchGame.trim()) return ALL_ELDORADO_GAMES;
    const q = searchGame.toLowerCase();
    return ALL_ELDORADO_GAMES.filter(g => g.toLowerCase().includes(q));
  }, [searchGame]);

  // Filtered Eldorado Account Listings
  const filteredAccountListings = useMemo(() => {
    return eldoradoListings.filter(item => {
      const matchGame = selectedGameFilter === "All Games" || item.game === selectedGameFilter;
      const q = searchGame.toLowerCase();
      const matchSearch = !q || item.game.toLowerCase().includes(q) || item.title.toLowerCase().includes(q);
      return matchGame && matchSearch;
    });
  }, [eldoradoListings, selectedGameFilter, searchGame]);

  // Filtered Currency Top-Up Services
  const filteredTopUpServices = useMemo(() => {
    return gameServices.filter(item => {
      const matchGame = selectedGameFilter === "All Games" || item.title.toLowerCase().includes(selectedGameFilter.toLowerCase());
      const q = searchGame.toLowerCase();
      const matchSearch = !q || item.title.toLowerCase().includes(q) || item.publisher.toLowerCase().includes(q);
      return matchGame && matchSearch;
    });
  }, [gameServices, selectedGameFilter, searchGame]);

  // Handle Account Purchase
  const handleBuyAccount = (e) => {
    e.preventDefault();
    if (!selectedListing) return;

    if ((user?.balance || 0) < selectedListing.price) {
      addToast(`Insufficient wallet balance! Required: ${formatCurrency(selectedListing.price)}`, "error");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      try {
        const order = placeAccountOrder({ listing: selectedListing });
        setPurchasedCredentials({
          orderId: order.id,
          game: selectedListing.game,
          credentials: selectedListing.credentials
        });
        addToast(`Account Purchased! Credentials released for ${selectedListing.game}.`, "success");
      } catch (err) {
        addToast(err.message, "error");
      } finally {
        setIsSubmitting(false);
      }
    }, 600);
  };

  // Handle Top-Up Purchase
  const handleTopUpOrder = (e) => {
    e.preventDefault();
    if (!selectedTopUpService || !selectedPackage) return;
    if (!playerDetails.trim()) {
      addToast("Please provide your Player ID or Tag!", "warning");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      try {
        const order = placeGameOrder({
          gameService: selectedTopUpService,
          packageItem: selectedPackage,
          playerDetails
        });
        addToast(`Top-up order #${order.id} placed successfully!`, "success");
        setSelectedTopUpService(null);
        setSelectedPackage(null);
        setPlayerDetails("");
      } catch (err) {
        addToast(err.message, "error");
      } finally {
        setIsSubmitting(false);
      }
    }, 600);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    addToast("Account credentials copied to clipboard!", "info");
  };

  return (
    <div className="space-y-6">
      {/* Eldorado Hero Header */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 text-white overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="indigo" className="bg-indigo-600/30 border-indigo-500/40 text-indigo-300 font-bold">
              ELDORADO GAMING MARKETPLACE
            </Badge>
            <span className="text-xs text-slate-400 font-semibold">• 173+ Popular Games Supported</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
            <Gamepad2 className="w-8 h-8 text-indigo-400" /> Buy Stacked Game Accounts, Gold & In-Game Currency
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Verified accounts with full email access, instant delivery, 100% buyer recovery protection, and instant player top-ups across all 173 major titles.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-300 pt-2">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Instant Credentials Release</span>
            <span className="flex items-center gap-1.5"><UserCheck className="w-4 h-4 text-indigo-400" /> 100% Verified Sellers</span>
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-400" /> 24/7 Automated Delivery</span>
          </div>
        </div>
      </div>

      {/* Game Selector & Search Bar */}
      <Card className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Marketplace Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-dropdown-scroll">
            {["Accounts", "Currency & Top-Up", "Items & Skins", "Rank Boosting"].map((tab) => {
              const tabKey = tab.startsWith("Accounts") ? "Accounts" : tab.startsWith("Currency") ? "Currency" : tab;
              const isActive = activeTab === tabKey;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tabKey)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20"
                      : "bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Game Search Bar */}
          <div className="flex items-center gap-2 w-full md:w-80">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchGame}
                onChange={(e) => setSearchGame(e.target.value)}
                placeholder="Search from 173+ games (Fortnite, Valorant, CoD)..."
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* 173 Games Filter Pills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>Filter by Game Title ({filteredGamesList.length} games):</span>
            {selectedGameFilter !== "All Games" && (
              <button
                onClick={() => setSelectedGameFilter("All Games")}
                className="text-indigo-400 hover:underline text-[11px]"
              >
                Clear Filter ({selectedGameFilter})
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1 custom-dropdown-scroll max-h-24">
            <button
              onClick={() => setSelectedGameFilter("All Games")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                selectedGameFilter === "All Games"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800/80 text-slate-400 hover:text-white"
              }`}
            >
              All Games
            </button>
            {filteredGamesList.slice(0, 40).map((game) => (
              <button
                key={game}
                onClick={() => setSelectedGameFilter(game)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                  selectedGameFilter === game
                    ? "bg-indigo-600 text-white font-bold"
                    : "bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {game}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* TAB 1: ACCOUNTS MARKETPLACE */}
      {activeTab === "Accounts" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-400" /> Stacked Accounts ({filteredAccountListings.length} listings)
            </h2>
            <span className="text-xs text-slate-400 font-semibold">100% Full Access • Auto Credentials Delivery</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAccountListings.length === 0 ? (
              <Card className="col-span-full py-12 text-center text-slate-400">
                <Gamepad2 className="w-12 h-12 mx-auto text-slate-700 mb-3" />
                <p className="font-bold text-white">No accounts listed for "{selectedGameFilter}" yet.</p>
                <p className="text-xs mt-1">Try clearing your search query or selecting "All Games".</p>
              </Card>
            ) : (
              filteredAccountListings.map((item) => (
                <Card
                  key={item.id}
                  className="p-5 flex flex-col justify-between space-y-4 hover:border-indigo-500/50 transition-all duration-300 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="indigo" className="font-extrabold uppercase">
                        {item.game}
                      </Badge>
                      <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-current" /> {item.deliveryType}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-100 text-sm line-clamp-2 group-hover:text-indigo-400 transition-colors leading-snug">
                      {item.title}
                    </h3>

                    {/* Seller Rating Card */}
                    <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-indigo-400" />
                        <span className="font-bold text-slate-200">{item.seller}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{item.rating}</span>
                        <span className="text-slate-500 text-[10px]">({item.reviews})</span>
                      </div>
                    </div>

                    {/* Spec Tags */}
                    <div className="space-y-1 text-xs text-slate-400">
                      {Object.entries(item.specs).slice(0, 3).map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between">
                          <span className="capitalize text-slate-500 text-[11px]">{k}:</span>
                          <span className="font-semibold text-slate-300 text-[11px] truncate max-w-40">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 line-through block font-medium">
                        ${item.originalPrice}
                      </span>
                      <span className="text-xl font-black text-emerald-400">
                        {formatCurrency(item.price)}
                      </span>
                    </div>

                    <Button
                      variant="gradient"
                      size="sm"
                      onClick={() => { setSelectedListing(item); setPurchasedCredentials(null); }}
                      className="gap-1.5 font-bold shadow-indigo-500/30"
                    >
                      <ShoppingCart className="w-4 h-4" /> Buy Account
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: IN-GAME CURRENCY & TOP-UPS */}
      {activeTab !== "Accounts" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" /> Currency & Top-Up Reloads ({filteredTopUpServices.length} items)
            </h2>
            <span className="text-xs text-slate-400 font-semibold">Direct Player UID Reload • 24/7 Automated</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopUpServices.map((service) => (
              <Card
                key={service.id}
                className="p-5 flex flex-col justify-between space-y-4 hover:border-indigo-500/50 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="purple" className="font-bold">
                      {service.publisher}
                    </Badge>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">
                      {service.deliveryType}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base">{service.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{service.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Select Package Option:
                  </label>
                  <div className="space-y-1.5">
                    {service.packages.map((pkg) => (
                      <button
                        key={pkg.name}
                        onClick={() => {
                          setSelectedTopUpService(service);
                          setSelectedPackage(pkg);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/50 text-xs font-semibold transition-all"
                      >
                        <span className="text-slate-200">{pkg.name}</span>
                        <span className="font-black text-emerald-400">{formatCurrency(pkg.price)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Account Buy Modal */}
      <Modal
        isOpen={Boolean(selectedListing)}
        onClose={() => { setSelectedListing(null); setPurchasedCredentials(null); }}
        title={purchasedCredentials ? "🎉 Purchase Successful - Account Credentials Released" : `Checkout: ${selectedListing?.game}`}
        maxWidth="max-w-xl"
      >
        {selectedListing && (
          <div className="space-y-5 text-xs">
            {purchasedCredentials ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 space-y-2">
                  <p className="font-bold flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Account Order {purchasedCredentials.orderId} Confirmed!
                  </p>
                  <p className="text-xs text-slate-300">
                    Wallet funds deducted ({formatCurrency(selectedListing.price)}). Your login credentials are released below:
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/40 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-400 uppercase text-[10px]">Credentials String</span>
                    <button
                      onClick={() => copyToClipboard(purchasedCredentials.credentials)}
                      className="text-indigo-400 hover:text-white font-bold flex items-center gap-1 text-[11px]"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy Code
                    </button>
                  </div>
                  <pre className="font-mono text-xs text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-800 whitespace-pre-wrap break-all">
                    {purchasedCredentials.credentials}
                  </pre>
                </div>

                <Button
                  variant="gradient"
                  onClick={() => { setSelectedListing(null); setPurchasedCredentials(null); }}
                  className="w-full justify-center py-2.5 font-bold"
                >
                  Done • View in Orders History
                </Button>
              </div>
            ) : (
              <form onSubmit={handleBuyAccount} className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="indigo" className="font-bold">{selectedListing.game}</Badge>
                    <span className="text-emerald-400 font-bold">{selectedListing.deliveryType}</span>
                  </div>
                  <h4 className="font-bold text-slate-100 text-sm leading-snug">{selectedListing.title}</h4>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <p className="font-bold text-slate-300 uppercase text-[10px]">Account Specifications:</p>
                  {Object.entries(selectedListing.specs).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between text-xs">
                      <span className="capitalize text-slate-400">{k}:</span>
                      <span className="font-semibold text-slate-200">{v}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Available Balance:</span>
                    <span className="font-bold text-white">{formatCurrency(user?.balance || 0)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Account Cost:</span>
                    <span className="font-bold text-emerald-400">{formatCurrency(selectedListing.price)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-sm font-bold text-white">
                    <span>Final Checkout:</span>
                    <span className="text-xl font-black text-indigo-400">{formatCurrency(selectedListing.price)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  isLoading={isSubmitting}
                  className="w-full justify-center py-3 font-bold text-sm shadow-indigo-500/30 gap-2"
                >
                  <Lock className="w-4 h-4" /> Confirm & Unlock Credentials ({formatCurrency(selectedListing.price)})
                </Button>
              </form>
            )}
          </div>
        )}
      </Modal>

      {/* Top-Up Order Checkout Modal */}
      <Modal
        isOpen={Boolean(selectedTopUpService && selectedPackage)}
        onClose={() => { setSelectedTopUpService(null); setSelectedPackage(null); }}
        title={`Top-Up: ${selectedTopUpService?.title}`}
        maxWidth="max-w-md"
      >
        {selectedTopUpService && selectedPackage && (
          <form onSubmit={handleTopUpOrder} className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{selectedPackage.name}</span>
                <span className="font-black text-emerald-400 text-base">{formatCurrency(selectedPackage.price)}</span>
              </div>
              <p className="text-slate-400 text-[11px]">{selectedTopUpService.description}</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Enter {selectedTopUpService.requiredFields ? selectedTopUpService.requiredFields.join(" / ") : "Player ID / Tag"}
              </label>
              <input
                type="text"
                value={playerDetails}
                onChange={(e) => setPlayerDetails(e.target.value)}
                placeholder="e.g. 518492019 / PlayerName#1234"
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-slate-400">
                <span>Wallet Balance:</span>
                <span className="font-bold text-white">{formatCurrency(user?.balance || 0)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Total Charge:</span>
                <span className="font-bold text-emerald-400">{formatCurrency(selectedPackage.price)}</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="gradient"
              isLoading={isSubmitting}
              className="w-full justify-center py-3 font-bold text-sm shadow-indigo-500/30 gap-2"
            >
              <ShoppingCart className="w-4 h-4" /> Confirm Top-Up Checkout ({formatCurrency(selectedPackage.price)})
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};
