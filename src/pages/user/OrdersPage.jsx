import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useOrders } from "../../contexts/OrdersContext";
import { ORDER_STATUS_COLORS } from "../../data/mockOrders";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Tabs } from "../../components/ui/Tabs";
import { formatCurrency, formatDate, exportToCSV } from "../../utils/formatters";
import { useToast } from "../../contexts/ToastContext";
import {
  ListOrdered, Search, Download, RotateCcw,
  ExternalLink, ChevronLeft, ChevronRight, XCircle,
  PackageOpen
} from "lucide-react";

const ITEMS_PER_PAGE = 15;

export const OrdersPage = () => {
  const { orders, refillOrder, cancelOrder } = useOrders();
  const { addToast } = useToast();

  const [activeTab, setActiveTab]   = useState("all");
  const [search, setSearch]         = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField]   = useState("createdAt");
  const [sortDir, setSortDir]       = useState("desc");

  const statusGroups = useMemo(() => {
    const map = {};
    orders.forEach(o => { map[o.status] = (map[o.status] || 0) + 1; });
    return map;
  }, [orders]);

  const tabs = [
    { id: "all",         label: "All Orders",  count: orders.length },
    { id: "Pending",     label: "Pending",     count: statusGroups["Pending"]     || 0 },
    { id: "Processing",  label: "Processing",  count: statusGroups["Processing"]  || 0 },
    { id: "In Progress", label: "In Progress", count: statusGroups["In Progress"] || 0 },
    { id: "Completed",   label: "Completed",   count: statusGroups["Completed"]   || 0 },
    { id: "Partial",     label: "Partial",     count: statusGroups["Partial"]     || 0 },
    { id: "Canceled",    label: "Canceled",    count: statusGroups["Canceled"]    || 0 },
  ];

  const filtered = useMemo(() => {
    let list = orders.filter(o => {
      const matchTab    = activeTab === "all" || o.status === activeTab;
      const q           = search.toLowerCase();
      const matchSearch = !q || [o.id, o.serviceName, o.link].some(v => v?.toLowerCase().includes(q));
      return matchTab && matchSearch;
    });

    list = [...list].sort((a, b) => {
      let av = a[sortField], bv = b[sortField];
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ?  1 : -1;
      return 0;
    });
    return list;
  }, [orders, activeTab, search, sortField, sortDir]);

  const totalPages    = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage      = Math.min(currentPage, totalPages);
  const paginated     = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const handleTabChange = (id) => { setActiveTab(id); setCurrentPage(1); };
  const handleSearch    = (e)  => { setSearch(e.target.value); setCurrentPage(1); };

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const handleExportCSV = () => {
    if (!filtered.length) { addToast("No orders to export.", "warning"); return; }
    exportToCSV("Orders_Export", filtered, [
      { header: "Order ID",    accessor: "id" },
      { header: "Service",     accessor: "serviceName" },
      { header: "Link",        accessor: "link" },
      { header: "Quantity",    accessor: "quantity" },
      { header: "Start Count", accessor: "startCount" },
      { header: "Remains",     accessor: "remains" },
      { header: "Charge ($)",  accessor: "charge" },
      { header: "Status",      accessor: "status" },
      { header: "Created At",  accessor: "createdAt" },
    ]);
    addToast(`${filtered.length} orders exported to CSV!`, "success");
  };

  const handleRefill = (id) => {
    refillOrder(id);
    addToast(`Refill requested for order ${id}! Processing.`, "success");
  };

  const handleCancel = (id) => {
    cancelOrder(id);
    addToast(`Order ${id} has been canceled. Charge refunded.`, "info");
  };

  const progressPct = (o) => {
    if (o.status === "Completed") return 100;
    if (o.status === "Canceled")  return 0;
    if (!o.quantity) return 0;
    const delivered = o.quantity - (o.remains || 0);
    return Math.min(100, Math.max(0, Math.round((delivered / o.quantity) * 100)));
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span className="opacity-30 ml-1">↕</span>;
    return <span className="ml-1 text-indigo-500 font-bold">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ListOrdered className="w-7 h-7 text-indigo-500" /> Orders History & Live Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor real-time progress, request automated refills, or cancel pending campaigns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExportCSV} className="gap-2 text-xs font-bold">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Link to="/dashboard/new-order">
            <Button variant="gradient" className="gap-2 font-bold shadow-indigo-500/30">
              + New Order
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto pb-1">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />
      </div>

      {/* Search Input */}
      <Card className="p-4">
        <Input
          icon={Search}
          placeholder="Search by Order ID, service name, or link..."
          value={search}
          onChange={handleSearch}
        />
      </Card>

      {/* Orders Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold">
              <tr>
                <th className="p-3 cursor-pointer hover:text-indigo-500 select-none" onClick={() => toggleSort("id")}>
                  ID <SortIcon field="id" />
                </th>
                <th className="p-3 cursor-pointer hover:text-indigo-500 select-none" onClick={() => toggleSort("createdAt")}>
                  Date <SortIcon field="createdAt" />
                </th>
                <th className="p-3">Service & Target</th>
                <th className="p-3 cursor-pointer hover:text-indigo-500 select-none" onClick={() => toggleSort("charge")}>
                  Charge <SortIcon field="charge" />
                </th>
                <th className="p-3">Start Count</th>
                <th className="p-3">Qty / Remains</th>
                <th className="p-3 cursor-pointer hover:text-indigo-500 select-none" onClick={() => toggleSort("status")}>
                  Status <SortIcon field="status" />
                </th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <PackageOpen className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No orders found.</p>
                    <Link to="/dashboard/new-order" className="inline-block mt-2 text-indigo-500 hover:underline text-xs font-bold">
                      + Submit your first campaign
                    </Link>
                  </td>
                </tr>
              ) : (
                paginated.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                      {order.id}
                    </td>
                    <td className="p-3 text-slate-400 font-medium whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="p-3 max-w-xs">
                      <p className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{order.serviceName}</p>
                      <a
                        href={order.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-500 hover:underline flex items-center gap-1 text-[11px] truncate max-w-55 mt-0.5"
                      >
                        {order.link} <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </td>
                    <td className="p-3 font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      {formatCurrency(order.charge)}
                    </td>
                    <td className="p-3 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {(order.startCount ?? 0).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <div className="space-y-1 min-w-25">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-900 dark:text-white">{(order.quantity ?? 0).toLocaleString()}</span>
                          <span className="text-slate-400">±{(order.remains ?? 0).toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${progressPct(order)}%`,
                              background: progressPct(order) === 100
                                ? "linear-gradient(to right,#10b981,#34d399)"
                                : "linear-gradient(to right,#6366f1,#818cf8)"
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant={ORDER_STATUS_COLORS[order.status] || "default"}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {order.refillEligible && order.status !== "Canceled" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRefill(order.id)}
                            className="text-[11px] py-1 px-2 gap-1 text-indigo-600 dark:text-indigo-400"
                            title="Request refill"
                          >
                            <RotateCcw className="w-3 h-3" /> Refill
                          </Button>
                        )}
                        {["Pending", "Processing"].includes(order.status) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancel(order.id)}
                            className="text-[11px] py-1 px-2 gap-1 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800"
                            title="Cancel order"
                          >
                            <XCircle className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{paginated.length}</strong> of{" "}
            <strong>{filtered.length}</strong> orders
            {search && ` matching "${search}"`}
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
            <span className="px-2 font-bold text-slate-700 dark:text-slate-300">
              {safePage} / {totalPages}
            </span>
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
    </div>
  );
};
