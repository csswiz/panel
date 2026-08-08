import React, { useState, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useServices } from "../../contexts/ServicesContext";
import { useOrders } from "../../contexts/OrdersContext";
import { useWallet } from "../../contexts/WalletContext";
import { useToast } from "../../contexts/ToastContext";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { formatCurrency } from "../../utils/formatters";
import { useNavigate } from "react-router-dom";
import { Layers, Zap, ShoppingCart, AlertCircle, CheckCircle2, FileText, Info } from "lucide-react";

export const MassOrderPage = () => {
  const { user, updateBalance } = useAuth();
  const { services } = useServices();
  const { addOrder } = useOrders();
  const { addTransaction } = useWallet();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [massInput, setMassInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parse lines: Service_ID | Link | Quantity
  const parsedOrders = useMemo(() => {
    if (!massInput.trim()) return [];
    const lines = massInput.split("\n").map(l => l.trim()).filter(Boolean);

    return lines.map((line, index) => {
      const parts = line.split("|").map(p => p.trim());
      if (parts.length < 3) {
        return { lineIndex: index + 1, raw: line, valid: false, error: "Invalid format. Expected: Service_ID | Link | Quantity" };
      }

      const [serviceIdStr, link, qtyStr] = parts;
      const serviceId = parseInt(serviceIdStr, 10);
      const qty = parseInt(qtyStr, 10);

      const service = services.find(s => s.id === serviceId);

      if (!service) {
        return { lineIndex: index + 1, raw: line, valid: false, error: `Service ID #${serviceIdStr} not found in catalog` };
      }

      if (!link || !link.startsWith("http")) {
        return { lineIndex: index + 1, raw: line, valid: false, error: "Invalid URL. Must start with http:// or https://" };
      }

      if (isNaN(qty) || qty < service.min || qty > service.max) {
        return {
          lineIndex: index + 1,
          raw: line,
          valid: false,
          error: `Quantity ${qty} out of bounds (${service.min.toLocaleString()} - ${service.max.toLocaleString()})`
        };
      }

      const charge = parseFloat(((qty / 1000) * service.rate).toFixed(3));
      const vipDiscount = parseFloat((charge * 0.15).toFixed(3));
      const finalCharge = Math.max(0.01, parseFloat((charge - vipDiscount).toFixed(2)));

      return {
        lineIndex: index + 1,
        raw: line,
        valid: true,
        serviceId,
        serviceName: service.name,
        link,
        qty,
        charge: finalCharge
      };
    });
  }, [massInput, services]);

  const validCount = parsedOrders.filter(o => o.valid).length;
  const invalidCount = parsedOrders.filter(o => !o.valid).length;
  const totalBatchCharge = parsedOrders.filter(o => o.valid).reduce((acc, curr) => acc + curr.charge, 0);

  const handleSubmitMassOrders = (e) => {
    e.preventDefault();
    const validBatch = parsedOrders.filter(o => o.valid);

    if (validBatch.length === 0) {
      addToast("No valid order lines found in mass order input!", "warning");
      return;
    }

    if ((user?.balance || 0) < totalBatchCharge) {
      addToast(`Insufficient wallet balance! Required: ${formatCurrency(totalBatchCharge)}, Available: ${formatCurrency(user?.balance || 0)}`, "error");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      updateBalance(-totalBatchCharge);

      validBatch.forEach(ord => {
        addOrder({
          userName: user?.name || "User",
          serviceName: ord.serviceName,
          serviceId: ord.serviceId,
          link: ord.link,
          quantity: ord.qty,
          charge: ord.charge
        });
      });

      addTransaction(
        "Mass Order Batch",
        `Batch processing ${validBatch.length} campaigns`,
        `REF-MASS-${Date.now()}`,
        -totalBatchCharge,
        "Completed"
      );

      setIsSubmitting(false);
      addToast(`Batch successful! ${validBatch.length} orders placed. ${formatCurrency(totalBatchCharge)} deducted.`, "success");
      setMassInput("");
      navigate("/dashboard/orders");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Layers className="w-7 h-7 text-indigo-500" /> Mass / Bulk Order Campaign Tool
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Place up to 100+ social media campaigns simultaneously using multi-line input.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="indigo" className="gap-1.5 py-1 px-3 font-bold text-xs">
            <Zap className="w-4 h-4 text-emerald-400 fill-current" /> BULK ENGINE ACTIVE
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Mass Form */}
        <Card className="lg:col-span-2 p-6 space-y-5">
          <form onSubmit={handleSubmitMassOrders} className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Mass Order Format: <span className="text-indigo-400 font-mono">Service_ID | Target_Link | Quantity</span>
                </label>
                <span className="text-xs font-semibold text-slate-400">One campaign per line</span>
              </div>

              <textarea
                rows={10}
                value={massInput}
                onChange={(e) => setMassInput(e.target.value)}
                placeholder={`1001 | https://instagram.com/p/Cxy9102... | 5000\n1005 | https://tiktok.com/@user/video/721... | 10000\n2003 | https://youtube.com/watch?v=dQw4w9... | 1000`}
                className="w-full p-4 font-mono text-xs rounded-2xl bg-slate-900 text-indigo-200 border border-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed custom-dropdown-scroll"
                required
              />
            </div>

            {/* Live Parsing Preview Bar */}
            {parsedOrders.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300">Batch Inspection Summary:</span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-emerald-400">✓ {validCount} Valid</span>
                    {invalidCount > 0 && <span className="text-rose-400">⚠️ {invalidCount} Invalid</span>}
                  </div>
                </div>

                <div className="max-h-40 overflow-y-auto custom-dropdown-scroll space-y-1.5 text-xs">
                  {parsedOrders.map((ord) => (
                    <div
                      key={ord.lineIndex}
                      className={`p-2 rounded-xl border flex items-center justify-between gap-3 text-[11px] ${
                        ord.valid
                          ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-300"
                          : "bg-rose-950/20 border-rose-800/40 text-rose-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span className="font-mono font-bold shrink-0">Line #{ord.lineIndex}:</span>
                        {ord.valid ? (
                          <span className="truncate">{ord.serviceName} • {ord.qty.toLocaleString()} units</span>
                        ) : (
                          <span className="truncate">{ord.error}</span>
                        )}
                      </div>
                      <span className="font-black shrink-0">
                        {ord.valid ? formatCurrency(ord.charge) : "Error"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total Batch Charge Box */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Total Valid Campaigns:</span>
                <span className="font-bold text-white">{validCount} orders</span>
              </div>
              <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
                <span>VIP 15% Discount Applied:</span>
                <span>Included</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-sm font-bold text-white">Total Batch Checkout:</span>
                <span className="text-2xl font-black text-indigo-400">{formatCurrency(totalBatchCharge)}</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              isLoading={isSubmitting}
              disabled={validCount === 0}
              className="w-full justify-center py-3.5 font-bold text-sm shadow-indigo-500/30 gap-2"
            >
              <ShoppingCart className="w-5 h-5" /> Execute Mass Batch Orders ({validCount})
            </Button>
          </form>
        </Card>

        {/* Sidebar Instructions */}
        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-400" /> Mass Order Format Guide
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter one campaign per line following the mandatory pipe-delimited format:
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-indigo-300">
              Service_ID | Target_Link | Quantity
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <p className="font-bold text-white">Example Batch Input:</p>
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-400 overflow-x-auto">
{`1001 | https://instagram.com/p/xyz123 | 5000
1005 | https://tiktok.com/@user/video | 10000
2003 | https://youtube.com/watch?v=abc | 1000`}
              </pre>
            </div>

            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-[11px] text-indigo-200 space-y-1">
              <p className="font-bold flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Reseller Friendly</p>
              <p>Need Service IDs? Use the Global Searchbar (Ctrl+K) or visit the Services Marketplace catalog.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
