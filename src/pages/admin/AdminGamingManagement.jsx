import React, { useState } from "react";
import { useGaming } from "../../contexts/GamingContext";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { formatCurrency } from "../../utils/formatters";
import { useToast } from "../../contexts/ToastContext";
import {
  Gamepad2, Search, Edit3, Plus, RefreshCw, CheckCircle2, Clock, ShieldAlert, Layers, ListOrdered, Save, Trash2, RotateCcw
} from "lucide-react";

export const AdminGamingManagement = () => {
  const {
    gameServices,
    gameOrders,
    categories,
    adminUpdateOrderStatus,
    adminAddGameService,
    adminUpdateGameService,
    adminToggleGameService,
    adminDeleteGameService
  } = useGaming();

  const [activeTab, setActiveTab] = useState("catalog"); // "catalog" | "orders"
  const [search, setSearch] = useState("");
  const { addToast } = useToast();

  // Modal States
  const [editingGame, setEditingGame] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newGameForm, setNewGameForm] = useState({
    title: "",
    category: "Mobile Game Top-Up",
    publisher: "",
    platform: "mobile",
    deliveryType: "Player ID Direct",
    badge: "INSTANT TOP-UP",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80",
    description: "",
    packages: [{ name: "Standard Pack", amount: 100, price: 4.99 }]
  });

  // Filter Catalog
  const filteredCatalog = gameServices.filter(g => {
    const q = search.toLowerCase().trim();
    return !q ||
      g.title.toLowerCase().includes(q) ||
      g.publisher.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q) ||
      g.id.toLowerCase().includes(q);
  });

  // Filter Orders
  const filteredOrders = gameOrders.filter(ord => {
    const q = search.toLowerCase().trim();
    return !q ||
      ord.id.toLowerCase().includes(q) ||
      ord.userName.toLowerCase().includes(q) ||
      ord.userEmail.toLowerCase().includes(q) ||
      ord.gameTitle.toLowerCase().includes(q) ||
      ord.playerDetails.toLowerCase().includes(q);
  });

  const handleCreateGameService = (e) => {
    e.preventDefault();
    if (!newGameForm.title.trim() || !newGameForm.publisher.trim()) {
      addToast("Please fill in Game Title and Publisher!", "warning");
      return;
    }

    adminAddGameService(newGameForm);
    addToast(`New Gaming Service '${newGameForm.title}' added to catalog!`, "success");
    setIsAddModalOpen(false);
    setNewGameForm({
      title: "",
      category: "Mobile Game Top-Up",
      publisher: "",
      platform: "mobile",
      deliveryType: "Player ID Direct",
      badge: "INSTANT TOP-UP",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80",
      description: "",
      packages: [{ name: "Standard Pack", amount: 100, price: 4.99 }]
    });
  };

  const handleSaveEditGame = (e) => {
    e.preventDefault();
    if (!editingGame) return;
    adminUpdateGameService(editingGame.id, editingGame);
    addToast(`Game Specification for #${editingGame.id} updated!`, "success");
    setEditingGame(null);
  };

  const handleStatusChange = (orderId, newStatus) => {
    adminUpdateOrderStatus(orderId, newStatus);
    addToast(`Gaming Order #${orderId} status changed to ${newStatus}`, newStatus === "Refunded" ? "warning" : "success");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Gamepad2 className="w-7 h-7 text-indigo-500" /> Gaming Services Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage in-game currency packages, top-up rates, player ID orders, and fulfillment pipelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="gradient"
            onClick={() => setIsAddModalOpen(true)}
            className="gap-2 font-bold shadow-indigo-500/30"
          >
            <Plus className="w-4 h-4" /> Add New Game Item
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => { setActiveTab("catalog"); setSearch(""); }}
          className={`pb-3 font-bold text-xs sm:text-sm border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "catalog"
              ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <Layers className="w-4 h-4" /> Game Service Catalog ({gameServices.length})
        </button>

        <button
          onClick={() => { setActiveTab("orders"); setSearch(""); }}
          className={`pb-3 font-bold text-xs sm:text-sm border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "orders"
              ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <ListOrdered className="w-4 h-4" /> Gaming Orders Fulfillment ({gameOrders.length})
        </button>
      </div>

      {/* Search Input */}
      <Card className="p-4">
        <Input
          icon={Search}
          placeholder={activeTab === "catalog" ? "Search game title, publisher, category, or ID..." : "Search order ID, user email, player ID, or game..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      {/* Tab 1: Game Catalog Editor */}
      {activeTab === "catalog" && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Game Title & Publisher</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Delivery Mode</th>
                  <th className="p-4">Packages</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
                {filteredCatalog.map(game => (
                  <tr key={game.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{game.id}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      <div>
                        <p>{game.title}</p>
                        <p className="text-[10px] text-slate-400 font-normal">{game.publisher} • <span className="uppercase text-indigo-400">{game.platform}</span></p>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 font-semibold">{game.category}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">{game.deliveryType}</td>
                    <td className="p-4">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {game.packages?.length || 0} packs (From ${game.packages?.[0]?.price || "0.99"})
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant={game.status === "Active" ? "emerald" : "rose"}>
                        {game.status || "Active"}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingGame({ ...game })}
                          className="text-[11px] py-1 px-2.5 gap-1"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => adminToggleGameService(game.id)}
                          className={`text-[11px] py-1 px-2.5 ${game.status === "Disabled" ? "text-emerald-500" : "text-amber-500"}`}
                        >
                          {game.status === "Disabled" ? "Enable" : "Disable"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 2: Gaming Orders Fulfillment */}
      {activeTab === "orders" && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Game & Package</th>
                  <th className="p-4">Player Details</th>
                  <th className="p-4">Charge</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
                {filteredOrders.map(ord => (
                  <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{ord.id}</td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900 dark:text-white">{ord.userName}</p>
                      <p className="text-[10px] text-slate-400">{ord.userEmail}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900 dark:text-white">{ord.gameTitle}</p>
                      <p className="text-[10px] text-indigo-500 font-semibold">{ord.packageTitle}</p>
                    </td>
                    <td className="p-4 font-mono text-slate-600 dark:text-slate-300 max-w-xs truncate">{ord.playerDetails}</td>
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
                    <td className="p-4 text-right">
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-[11px] outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Refunded">Refund & Cancel</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Game Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Gaming Service Package"
        >
          <form onSubmit={handleCreateGameService} className="space-y-4 text-xs">
            <Input
              label="Game Title"
              placeholder="e.g. PUBG Mobile Unknown Cash"
              value={newGameForm.title}
              onChange={(e) => setNewGameForm({ ...newGameForm, title: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Publisher / Developer"
                placeholder="e.g. Tencent Games"
                value={newGameForm.publisher}
                onChange={(e) => setNewGameForm({ ...newGameForm, publisher: e.target.value })}
                required
              />
              <div>
                <label className="block font-bold text-slate-400 uppercase text-[10px] mb-1">Category</label>
                <select
                  value={newGameForm.category}
                  onChange={(e) => setNewGameForm({ ...newGameForm, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                >
                  {categories.filter(c => c !== "All Gaming Services").map((cat, i) => (
                    <option key={i} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Delivery Mode"
                placeholder="e.g. Player ID Direct"
                value={newGameForm.deliveryType}
                onChange={(e) => setNewGameForm({ ...newGameForm, deliveryType: e.target.value })}
                required
              />
              <Input
                label="Badge Label"
                placeholder="e.g. INSTANT TOP-UP"
                value={newGameForm.badge}
                onChange={(e) => setNewGameForm({ ...newGameForm, badge: e.target.value })}
              />
            </div>

            <Input
              label="Game Cover Image URL"
              value={newGameForm.image}
              onChange={(e) => setNewGameForm({ ...newGameForm, image: e.target.value })}
            />

            <div>
              <label className="block font-bold text-slate-400 uppercase text-[10px] mb-1">Description</label>
              <textarea
                rows={3}
                placeholder="Details about top-up delivery time & instructions..."
                value={newGameForm.description}
                onChange={(e) => setNewGameForm({ ...newGameForm, description: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium outline-none"
              />
            </div>

            <Button type="submit" variant="gradient" className="w-full justify-center py-2.5 font-bold gap-2">
              <Save className="w-4 h-4" /> Save Game Item to Catalog
            </Button>
          </form>
        </Modal>
      )}

      {/* Edit Game Modal */}
      {editingGame && (
        <Modal
          isOpen={!!editingGame}
          onClose={() => setEditingGame(null)}
          title={`Edit Game Specification #${editingGame.id}`}
        >
          <form onSubmit={handleSaveEditGame} className="space-y-4 text-xs">
            <Input
              label="Game Title"
              value={editingGame.title}
              onChange={(e) => setEditingGame({ ...editingGame, title: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Publisher"
                value={editingGame.publisher}
                onChange={(e) => setEditingGame({ ...editingGame, publisher: e.target.value })}
                required
              />
              <Input
                label="Delivery Mode"
                value={editingGame.deliveryType}
                onChange={(e) => setEditingGame({ ...editingGame, deliveryType: e.target.value })}
                required
              />
            </div>

            <Input
              label="Image URL"
              value={editingGame.image}
              onChange={(e) => setEditingGame({ ...editingGame, image: e.target.value })}
            />

            <Button type="submit" variant="gradient" className="w-full justify-center py-2.5 font-bold gap-2">
              <Save className="w-4 h-4" /> Update Game Specification
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
};
