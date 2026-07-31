import React, { useState, useMemo } from "react";
import { MOCK_SERVICES } from "../../data/mockServices";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { formatCurrency } from "../../utils/formatters";
import { useToast } from "../../contexts/ToastContext";
import { Layers, Search, Edit3, Percent, ChevronLeft, ChevronRight, Save } from "lucide-react";

const ITEMS_PER_PAGE = 15;

export const ServiceManagementPage = () => {
  const [services, setServices] = useState(MOCK_SERVICES);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [multiplierModalOpen, setMultiplierModalOpen] = useState(false);
  const [percentageIncrease, setPercentageIncrease] = useState(10);
  const [editingService, setEditingService] = useState(null);

  const { addToast } = useToast();

  const filteredServices = useMemo(() => {
    const q = search.toLowerCase();
    return services.filter(s =>
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.id.toString().includes(q)
    );
  }, [services, search]);

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filteredServices.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const handleApplyGlobalMultiplier = () => {
    const pct = parseFloat(percentageIncrease) / 100;
    setServices(prev => prev.map(s => ({
      ...s,
      rate: parseFloat((s.rate * (1 + pct)).toFixed(3))
    })));
    setMultiplierModalOpen(false);
    addToast(`Global bulk pricing updated! Increased rates by ${percentageIncrease}%`, "success");
  };

  const handleSaveServiceEdit = (e) => {
    e.preventDefault();
    if (!editingService) return;
    setServices(prev => prev.map(s => s.id === editingService.id ? editingService : s));
    addToast(`Service #${editingService.id} specifications updated!`, "success");
    setEditingService(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Layers className="w-7 h-7 text-indigo-500" /> Service Catalog & Bulk Pricing Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage rates, min/max limits, quality badges, and global profit margins across {services.length.toLocaleString()} services.
          </p>
        </div>

        <Button variant="gradient" onClick={() => setMultiplierModalOpen(true)} className="gap-2 font-bold shadow-indigo-500/30">
          <Percent className="w-4 h-4" /> Bulk Price Multiplier
        </Button>
      </div>

      <Card className="p-4">
        <Input
          icon={Search}
          placeholder="Search service ID, name, or category..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
        />
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Service Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Rate / 1k</th>
                <th className="p-4">Min / Max</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
              {paginated.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">#{s.id}</td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white max-w-sm truncate">{s.name}</td>
                  <td className="p-4 text-slate-500 font-semibold max-w-xs truncate">{s.category}</td>
                  <td className="p-4 font-black text-indigo-600 dark:text-indigo-400">{formatCurrency(s.rate)}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">{s.min.toLocaleString()} / {s.max.toLocaleString()}</td>
                  <td className="p-4">
                    <Badge variant={s.status === "Active" ? "emerald" : "rose"}>{s.status || "Active"}</Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingService({ ...s })}
                      className="text-[11px] py-1 px-2.5 gap-1"
                    >
                      <Edit3 className="w-3 h-3" /> Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            Page <strong className="text-slate-900 dark:text-white">{safePage}</strong> of <strong>{totalPages}</strong> ({filteredServices.length.toLocaleString()} total)
          </span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" disabled={safePage <= 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>
            <Button size="sm" variant="outline" disabled={safePage >= totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Global Multiplier Modal */}
      <Modal
        isOpen={multiplierModalOpen}
        onClose={() => setMultiplierModalOpen(false)}
        title="Global Price Multiplier Tool"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-500">Apply percentage rate adjustment across all services catalog.</p>
          <Input
            label="Percentage Rate Increase (%)"
            type="number"
            value={percentageIncrease}
            onChange={(e) => setPercentageIncrease(e.target.value)}
          />
          <Button variant="gradient" onClick={handleApplyGlobalMultiplier} className="w-full justify-center py-2.5 font-bold">
            Apply Global Price Update
          </Button>
        </div>
      </Modal>

      {/* Edit Service Modal */}
      {editingService && (
        <Modal
          isOpen={!!editingService}
          onClose={() => setEditingService(null)}
          title={`Edit Service Specification #${editingService.id}`}
        >
          <form onSubmit={handleSaveServiceEdit} className="space-y-4 text-xs">
            <Input
              label="Service Name"
              value={editingService.name}
              onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Rate per 1,000 ($)"
                type="number"
                step="0.001"
                value={editingService.rate}
                onChange={(e) => setEditingService({ ...editingService, rate: parseFloat(e.target.value) || 0 })}
                required
              />
              <div>
                <label className="block font-bold text-slate-400 uppercase text-[10px] mb-1">Status</label>
                <select
                  value={editingService.status || "Active"}
                  onChange={(e) => setEditingService({ ...editingService, status: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                >
                  <option value="Active">Active</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Minimum Quantity"
                type="number"
                value={editingService.min}
                onChange={(e) => setEditingService({ ...editingService, min: parseInt(e.target.value) || 1 })}
                required
              />
              <Input
                label="Maximum Quantity"
                type="number"
                value={editingService.max}
                onChange={(e) => setEditingService({ ...editingService, max: parseInt(e.target.value) || 1000 })}
                required
              />
            </div>

            <Button type="submit" variant="gradient" className="w-full justify-center py-2.5 font-bold gap-2">
              <Save className="w-4 h-4" /> Save Service Changes
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
};
