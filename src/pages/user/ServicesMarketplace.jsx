import React, { useState, useMemo } from "react";
import { useServices } from "../../contexts/ServicesContext";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { formatCurrency } from "../../utils/formatters";
import { Sparkles, Search, Grid, List, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 25;

export const ServicesMarketplace = () => {
  const { services, platforms } = useServices();
  const [search, setSearch] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [sortBy, setSortBy] = useState("id-asc");
  const [viewMode, setViewMode] = useState("table");
  const [selectedService, setSelectedService] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    let list = services.filter(service => {
      const matchesPlatform = selectedPlatform === "all" || service.platform === selectedPlatform;
      const q = search.toLowerCase();
      const matchesSearch = !q ||
        service.name.toLowerCase().includes(q) ||
        service.category.toLowerCase().includes(q) ||
        service.id.toString().includes(q);
      return matchesPlatform && matchesSearch;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === "rate-asc") return a.rate - b.rate;
      if (sortBy === "rate-desc") return b.rate - a.rate;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return a.id - b.id;
    });

    return list;
  }, [services, selectedPlatform, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const handleOrderRedirect = (serviceId) => {
    setSelectedService(null);
    navigate(`/dashboard/new-order?serviceId=${serviceId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-indigo-500" /> Services Marketplace & API Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse 5,000+ high-quality social media optimization endpoints with live pricing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="indigo" size="lg">
            {filtered.length.toLocaleString()} Services
          </Badge>
          <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === "table" ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-400"}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-400"}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Platform Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {platforms.map(p => (
          <button
            key={p.id}
            onClick={() => { setSelectedPlatform(p.id); setCurrentPage(1); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedPlatform === p.id
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 scale-105"
                : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Search & Sort Controls */}
      <Card className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-96">
          <Input
            icon={Search}
            placeholder="Search service ID, name, platform..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-bold text-slate-500 whitespace-nowrap">Sort By:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200 outline-none"
          >
            <option value="id-asc">Service ID (Default)</option>
            <option value="rate-asc">Price: Low to High</option>
            <option value="rate-desc">Price: High to Low</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </Card>

      {/* Main Services Table / Grid */}
      {viewMode === "table" ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Service Name</th>
                  <th className="p-4">Rate / 1k</th>
                  <th className="p-4">Min / Max</th>
                  <th className="p-4">ETA</th>
                  <th className="p-4">Badge</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
                {paginated.map(service => (
                  <tr key={service.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">#{service.id}</td>
                    <td className="p-4 max-w-sm">
                      <p className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{service.name}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{service.category}</p>
                    </td>
                    <td className="p-4 font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      {formatCurrency(service.rate)}
                    </td>
                    <td className="p-4 font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {service.min.toLocaleString()} / {service.max.toLocaleString()}
                    </td>
                    <td className="p-4 text-slate-500 font-semibold whitespace-nowrap">{service.eta}</td>
                    <td className="p-4">
                      <Badge variant="indigo" size="sm">{service.badge}</Badge>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedService(service)}
                        className="py-1 px-2.5 text-xs"
                      >
                        Inspect
                      </Button>
                      <Button
                        size="sm"
                        variant="gradient"
                        onClick={() => handleOrderRedirect(service.id)}
                        className="py-1 px-3 text-xs font-bold"
                      >
                        Order Now
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
              Page <strong className="text-slate-900 dark:text-white">{safePage}</strong> of <strong>{totalPages}</strong> ({filtered.length.toLocaleString()} items)
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        /* Grid View */
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map(service => (
              <Card key={service.id} hover className="p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-500">#{service.id}</span>
                    <Badge variant="indigo" size="sm">{service.badge}</Badge>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">{service.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{service.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Rate / 1000</span>
                    <span className="font-black text-indigo-600 dark:text-indigo-400 text-base">{formatCurrency(service.rate)}</span>
                  </div>
                  <Button size="sm" variant="gradient" onClick={() => handleOrderRedirect(service.id)} className="text-xs font-bold">
                    Order Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page <strong className="text-slate-900 dark:text-white">{safePage}</strong> of <strong>{totalPages}</strong>
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
        </div>
      )}

      {/* Service Inspect Modal */}
      {selectedService && (
        <Modal
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          title={`Service Specifications #${selectedService.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <Badge variant="indigo">{selectedService.platform.toUpperCase()}</Badge>
              <Badge variant="emerald">{selectedService.badge}</Badge>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedService.name}</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{selectedService.description}</p>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-100 dark:bg-slate-800">
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-bold block">Rate Per 1,000</span>
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">${selectedService.rate}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-bold block">Average ETA</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedService.eta}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-bold block">Minimum Order</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedService.min.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-bold block">Maximum Order</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedService.max.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="gradient"
                className="w-full justify-center"
                onClick={() => handleOrderRedirect(selectedService.id)}
              >
                Proceed to Order Form <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
