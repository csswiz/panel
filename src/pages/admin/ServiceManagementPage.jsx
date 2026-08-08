import React, { useState, useMemo } from "react";
import { useServices } from "../../contexts/ServicesContext";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { formatCurrency } from "../../utils/formatters";
import { useToast } from "../../contexts/ToastContext";
import { Layers, Search, Edit3, Percent, ChevronLeft, ChevronRight, Save, Download, RefreshCw, Code2, Link2 } from "lucide-react";

const ITEMS_PER_PAGE = 15;

export const ServiceManagementPage = () => {
  const { services, updateService, applyGlobalMultiplier, bulkImportServices, resetServicesToDefault } = useServices();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modals
  const [multiplierModalOpen, setMultiplierModalOpen] = useState(false);
  const [percentageIncrease, setPercentageIncrease] = useState(10);
  const [editingService, setEditingService] = useState(null);
  
  // Import Modal State
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importTab, setImportTab] = useState("api"); // "api" | "json"
  const [apiUrl, setApiUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [markupPercent, setMarkupPercent] = useState(20);
  const [jsonInput, setJsonInput] = useState("");
  const [isFetching, setIsFetching] = useState(false);

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
    applyGlobalMultiplier(percentageIncrease);
    setMultiplierModalOpen(false);
    addToast(`Global bulk pricing updated! Increased rates by ${percentageIncrease}%`, "success");
  };

  const handleSaveServiceEdit = (e) => {
    e.preventDefault();
    if (!editingService) return;
    updateService(editingService.id, editingService);
    addToast(`Service #${editingService.id} specifications updated!`, "success");
    setEditingService(null);
  };

  const processImportedServices = (rawList, markup) => {
    const mult = 1 + (parseFloat(markup) || 0) / 100;
    return rawList.map((item, index) => {
      const rawRate = parseFloat(item.rate || item.price || 1);
      const finalRate = parseFloat((rawRate * mult).toFixed(3));
      const name = item.name || `Service #${item.service || index + 1}`;
      const category = item.category || "General Services";
      
      const combined = (name + " " + category).toLowerCase();
      let platform = "instagram";
      if (combined.includes("tiktok")) platform = "tiktok";
      else if (combined.includes("youtube")) platform = "youtube";
      else if (combined.includes("telegram")) platform = "telegram";
      else if (combined.includes("spotify")) platform = "spotify";
      else if (combined.includes("twitter") || combined.includes(" x ")) platform = "twitter";
      else if (combined.includes("facebook")) platform = "facebook";
      else if (combined.includes("discord")) platform = "discord";
      else if (combined.includes("linkedin")) platform = "linkedin";
      else if (combined.includes("seo") || combined.includes("backlink")) platform = "seo";
      else if (combined.includes("traffic")) platform = "traffic";

      return {
        id: parseInt(item.service || item.id) || (3000 + index),
        name,
        category,
        platform,
        rate: finalRate,
        min: parseInt(item.min) || 100,
        max: parseInt(item.max) || 10000,
        eta: item.eta || "0-15 Minutes",
        badge: item.refill ? "AUTO REFILL" : (item.dripfeed ? "DRIP FEED" : "FAST START"),
        description: item.description || `Provider service imported with ${markup}% profit margin.`,
        status: "Active"
      };
    });
  };

  const handleApiFetchImport = async (e) => {
    if (e) e.preventDefault();
    if (!apiUrl.trim()) {
      addToast("Please specify Provider API Endpoint URL!", "warning");
      return;
    }

    setIsFetching(true);
    const rawUrl = apiUrl.trim();
    const cleanKey = apiKey.trim();

    // 1. Direct POST
    try {
      const urlObj = new URL(rawUrl);
      urlObj.searchParams.set("action", "services");
      if (cleanKey) urlObj.searchParams.set("key", cleanKey);

      const res = await fetch(urlObj.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ action: "services", key: cleanKey })
      });
      if (res.ok) {
        const data = await res.json();
        const serviceList = Array.isArray(data) ? data : (data.services || data.data || []);
        if (Array.isArray(serviceList) && serviceList.length > 0) {
          const formatted = processImportedServices(serviceList, markupPercent);
          bulkImportServices(formatted, false);
          addToast(`Successfully imported ${formatted.length} services from provider API!`, "success");
          setImportModalOpen(false);
          setIsFetching(false);
          return;
        }
      }
    } catch (err) {}

    // 2. Direct GET
    try {
      const fetchUrl = `${rawUrl}?action=services${cleanKey ? `&key=${cleanKey}` : ""}`;
      const res = await fetch(fetchUrl);
      if (res.ok) {
        const data = await res.json();
        const serviceList = Array.isArray(data) ? data : (data.services || data.data || []);
        if (Array.isArray(serviceList) && serviceList.length > 0) {
          const formatted = processImportedServices(serviceList, markupPercent);
          bulkImportServices(formatted, false);
          addToast(`Successfully imported ${formatted.length} services from provider API!`, "success");
          setImportModalOpen(false);
          setIsFetching(false);
          return;
        }
      }
    } catch (err) {}

    // 3. Automatic CORS Proxy Bypass (corsproxy.io)
    try {
      const targetUrl = `${rawUrl}?action=services${cleanKey ? `&key=${cleanKey}` : ""}`;
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
      const res = await fetch(proxyUrl);
      if (res.ok) {
        const data = await res.json();
        const serviceList = Array.isArray(data) ? data : (data.services || data.data || []);
        if (Array.isArray(serviceList) && serviceList.length > 0) {
          const formatted = processImportedServices(serviceList, markupPercent);
          bulkImportServices(formatted, false);
          addToast(`Successfully imported ${formatted.length} services via CORS bypass proxy!`, "success");
          setImportModalOpen(false);
          setIsFetching(false);
          return;
        }
      }
    } catch (err) {}

    // 4. Secondary CORS Proxy Bypass (allorigins)
    try {
      const targetUrl = `${rawUrl}?action=services${cleanKey ? `&key=${cleanKey}` : ""}`;
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
      const res = await fetch(proxyUrl);
      if (res.ok) {
        const data = await res.json();
        const serviceList = Array.isArray(data) ? data : (data.services || data.data || []);
        if (Array.isArray(serviceList) && serviceList.length > 0) {
          const formatted = processImportedServices(serviceList, markupPercent);
          bulkImportServices(formatted, false);
          addToast(`Successfully imported ${formatted.length} services via secondary CORS proxy!`, "success");
          setImportModalOpen(false);
          setIsFetching(false);
          return;
        }
      }
    } catch (err) {}

    setIsFetching(false);
    addToast(
      "Provider API request failed or returned invalid data. Please share your Provider API URL & Key in chat, and I will fetch it directly for you!",
      "error"
    );
  };

  const handleJsonPasteImport = (e) => {
    e.preventDefault();
    if (!jsonInput.trim()) {
      addToast("Please paste service JSON data!", "warning");
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput.trim());
      const serviceArray = Array.isArray(parsed) ? parsed : (parsed.services || parsed.data || []);
      
      if (!Array.isArray(serviceArray) || serviceArray.length === 0) {
        addToast("No valid array of services found in JSON data!", "error");
        return;
      }

      const formatted = processImportedServices(serviceArray, markupPercent);
      bulkImportServices(formatted, false);
      addToast(`Successfully imported ${formatted.length} services with ${markupPercent}% margin!`, "success");
      setJsonInput("");
      setImportModalOpen(false);
    } catch (err) {
      addToast("Invalid JSON string syntax. Please verify JSON format.", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Layers className="w-7 h-7 text-indigo-500" /> Service Catalog & API Sync Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage rates, min/max limits, quality badges, and import services via SMM Provider API keys.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={() => setImportModalOpen(true)} className="gap-2 font-bold">
            <Download className="w-4 h-4 text-emerald-500" /> Import Provider API Services
          </Button>
          <Button variant="gradient" onClick={() => setMultiplierModalOpen(true)} className="gap-2 font-bold shadow-indigo-500/30">
            <Percent className="w-4 h-4" /> Bulk Price Multiplier
          </Button>
        </div>
      </div>

      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:max-w-md">
          <Input
            icon={Search}
            placeholder="Search service ID, name, or category..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="text-xs text-slate-400 font-semibold flex items-center gap-2">
          <span>Active Services: <strong className="text-slate-900 dark:text-white">{services.length.toLocaleString()}</strong></span>
          <Button size="sm" variant="ghost" onClick={resetServicesToDefault} title="Reset to default mock set" className="text-slate-400 hover:text-rose-500">
            <RefreshCw className="w-3.5 h-3.5" /> Reset Default
          </Button>
        </div>
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
                  <td className="p-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">{s.min?.toLocaleString()} / {s.max?.toLocaleString()}</td>
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

      {/* Import Provider API Services Modal */}
      <Modal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        title="Import Services from External SMM Provider"
      >
        <div className="space-y-4 text-xs">
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4">
            <button
              className={`pb-2 font-bold border-b-2 transition-colors flex items-center gap-1.5 ${importTab === "api" ? "border-indigo-500 text-indigo-600 dark:text-indigo-400" : "border-transparent text-slate-400"}`}
              onClick={() => setImportTab("api")}
            >
              <Link2 className="w-4 h-4" /> Direct API Key Fetch
            </button>
            <button
              className={`pb-2 font-bold border-b-2 transition-colors flex items-center gap-1.5 ${importTab === "json" ? "border-indigo-500 text-indigo-600 dark:text-indigo-400" : "border-transparent text-slate-400"}`}
              onClick={() => setImportTab("json")}
            >
              <Code2 className="w-4 h-4" /> Paste Raw JSON Response
            </button>
          </div>

          <Input
            label="Profit Margin Markup (%)"
            type="number"
            value={markupPercent}
            onChange={(e) => setMarkupPercent(e.target.value)}
            helperText="Automatically adds percentage markup on provider cost rates."
          />

          {importTab === "api" ? (
            <form onSubmit={handleApiFetchImport} className="space-y-4">
              <Input
                label="Provider API Endpoint URL"
                type="url"
                placeholder="https://provider-domain.com/api/v2"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                required
              />
              <Input
                label="Provider API Key"
                type="password"
                placeholder="e.g. 883fa992bc1209e99a88..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <Button
                type="submit"
                variant="gradient"
                isLoading={isFetching}
                className="w-full justify-center py-2.5 font-bold gap-2"
              >
                <Download className="w-4 h-4" /> Fetch & Import Services
              </Button>
            </form>
          ) : (
            <form onSubmit={handleJsonPasteImport} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Services JSON Response
                </label>
                <textarea
                  rows={8}
                  placeholder={`[\n  {\n    "service": 101,\n    "name": "Instagram Followers",\n    "category": "Instagram",\n    "rate": "0.80",\n    "min": "100",\n    "max": "10000"\n  }\n]`}
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="w-full p-3 font-mono text-xs rounded-xl bg-slate-900 text-emerald-400 border border-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <Button type="submit" variant="gradient" className="w-full justify-center py-2.5 font-bold gap-2">
                <Download className="w-4 h-4" /> Import JSON Services
              </Button>
            </form>
          )}
        </div>
      </Modal>

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
