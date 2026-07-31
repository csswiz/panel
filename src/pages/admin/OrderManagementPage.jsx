import React, { useState, useMemo } from "react";
import { useOrders } from "../../contexts/OrdersContext";
import { ORDER_STATUS_COLORS } from "../../data/mockOrders";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { formatCurrency } from "../../utils/formatters";
import { useToast } from "../../contexts/ToastContext";
import { ListOrdered, Search, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 15;

export const OrderManagementPage = () => {
  const { orders, updateOrderStatus } = useOrders();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { addToast } = useToast();

  const filteredOrders = useMemo(() => {
    const q = search.toLowerCase();
    return orders.filter(o =>
      !q ||
      o.id.toLowerCase().includes(q) ||
      (o.userName && o.userName.toLowerCase().includes(q)) ||
      o.serviceName.toLowerCase().includes(q)
    );
  }, [orders, search]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filteredOrders.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const handleUpdateStatus = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    addToast(`Order ${orderId} status set to ${newStatus}`, "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ListOrdered className="w-7 h-7 text-rose-500" /> Global Orders Operations Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor system-wide order queues, trigger manual refunds, and override start counts.
          </p>
        </div>

        <Badge variant="indigo" size="lg">
          {orders.length} Live Orders
        </Badge>
      </div>

      <Card className="p-4">
        <Input
          icon={Search}
          placeholder="Search order ID, client name, service..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
        />
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Client User</th>
                <th className="p-4">Service</th>
                <th className="p-4">Quantity / Remains</th>
                <th className="p-4">Charge</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Admin Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
              {paginated.map(o => (
                <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{o.id}</td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{o.userName || "Alex Vance"}</td>
                  <td className="p-4 max-w-xs truncate font-medium text-slate-700 dark:text-slate-300">{o.serviceName}</td>
                  <td className="p-4 font-semibold">{o.quantity.toLocaleString()} / {o.remains.toLocaleString()}</td>
                  <td className="p-4 font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(o.charge)}</td>
                  <td className="p-4"><Badge variant={ORDER_STATUS_COLORS[o.status] || "default"}>{o.status}</Badge></td>
                  <td className="p-4 text-right space-x-1">
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleUpdateStatus(o.id, "Completed")}
                      className="py-0.5 px-2 text-[10px]"
                    >
                      Complete
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleUpdateStatus(o.id, "Canceled")}
                      className="py-0.5 px-2 text-[10px]"
                    >
                      Cancel
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
            Page <strong className="text-slate-900 dark:text-white">{safePage}</strong> of <strong>{totalPages}</strong> ({filteredOrders.length} total)
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
    </div>
  );
};
