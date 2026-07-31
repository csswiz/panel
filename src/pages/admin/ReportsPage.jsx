import React from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { exportToCSV } from "../../utils/formatters";
import { useOrders } from "../../contexts/OrdersContext";
import { useToast } from "../../contexts/ToastContext";
import { FileText, Download } from "lucide-react";

export const ReportsPage = () => {
  const { orders } = useOrders();
  const { addToast } = useToast();

  const handleExport = (reportType) => {
    if (!orders.length) {
      addToast("No orders available to export.", "warning");
      return;
    }

    exportToCSV(`${reportType}_Report`, orders, [
      { header: "Order ID", accessor: "id" },
      { header: "User", accessor: (row) => row.userName || "Alex Vance" },
      { header: "Service", accessor: "serviceName" },
      { header: "Charge ($)", accessor: "charge" },
      { header: "Quantity", accessor: "quantity" },
      { header: "Remains", accessor: "remains" },
      { header: "Status", accessor: "status" },
      { header: "Date", accessor: "createdAt" }
    ]);
    addToast(`${reportType} Report downloaded as CSV!`, "success");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <FileText className="w-7 h-7 text-indigo-500" /> Executive Report Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Export full financial audits, profit margins, user growth data, and order history logs.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Monthly Revenue Audit Report", desc: "Gross earnings, gateway processing fees, and profit totals.", type: "Revenue" },
          { title: "Global Orders Log Export", desc: "Detailed log of all completed orders and start counts.", type: "Orders" },
          { title: "User Acquisition & Growth", desc: "New user signups by country, tier rank, and deposit volume.", type: "Users" },
          { title: "Service Profit Margin Report", desc: "Top performing platforms sorted by net profit margin %.", type: "Profit" },
          { title: "Refund & Partial Orders Audit", desc: "Complete breakdown of canceled orders and refunded credits.", type: "Refunds" },
          { title: "Affiliate Payout Summary", desc: "Total commissions paid out to reseller partners.", type: "Affiliates" }
        ].map((item, i) => (
          <Card key={i} className="p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <Badge variant="indigo" size="sm">PDF / CSV Export</Badge>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
            </div>
            <Button variant="gradient" onClick={() => handleExport(item.type)} className="gap-2 text-xs font-bold w-full justify-center">
              <Download className="w-4 h-4" /> Export CSV Report
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
