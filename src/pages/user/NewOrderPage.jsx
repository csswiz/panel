import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { useOrders } from "../../contexts/OrdersContext";
import { useWallet } from "../../contexts/WalletContext";
import { useServices } from "../../contexts/ServicesContext";
import { useSettings } from "../../contexts/SettingsContext";
import { Card, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { CustomSelect } from "../../components/ui/CustomSelect";
import { Badge } from "../../components/ui/Badge";
import { formatCurrency } from "../../utils/formatters";
import {
  ShoppingCart, Link as LinkIcon, Sparkles, Zap, CheckCircle2, Clock, ShieldCheck, TrendingUp, AlertTriangle, Layers
} from "lucide-react";

export const NewOrderPage = () => {
  const { user, updateBalance } = useAuth();
  const { addToast } = useToast();
  const { addOrder } = useOrders();
  const { addTransaction } = useWallet();
  const { services = [] } = useServices();
  const { maintenanceMode } = useSettings();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const categories = Array.from(new Set(services.map(s => s.category).filter(Boolean)));

  const [selectedCategory, setSelectedCategory] = useState(categories[0] || "Instagram Followers - High Quality");
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || 1001);
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState(1000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (categories.length > 0 && !categories.includes(selectedCategory)) {
      setSelectedCategory(categories[0]);
    }
  }, [services]);

  useEffect(() => {
    const serviceParam = searchParams.get("serviceId");
    if (serviceParam) {
      const found = services.find(s => s.id === parseInt(serviceParam));
      if (found) {
        setSelectedCategory(found.category);
        setSelectedServiceId(found.id);
        setQuantity(found.min);
      }
    }
  }, [searchParams, services]);

  const activeServices = services.filter(s => s.status !== "Disabled");
  const categoryServices = activeServices.filter(s => s.category === selectedCategory);
  const currentService = services.find(s => s.id === parseInt(selectedServiceId)) || categoryServices[0] || activeServices[0] || services[0];

  const calculatedCharge = currentService ? parseFloat(((quantity / 1000) * currentService.rate).toFixed(3)) : 0;
  const vipDiscount = (calculatedCharge * 0.15).toFixed(3);
  const finalPrice = Math.max(0.01, parseFloat((calculatedCharge - vipDiscount).toFixed(2)));

  const handleCategoryChange = (val) => {
    const cat = typeof val === "object" ? val.target.value : val;
    setSelectedCategory(cat);
    const newServices = activeServices.filter(s => s.category === cat);
    if (newServices.length > 0) {
      setSelectedServiceId(newServices[0].id);
      setQuantity(newServices[0].min || 1000);
    }
  };

  const handleServiceChange = (val) => {
    const servId = parseInt(typeof val === "object" ? val.target.value : val);
    setSelectedServiceId(servId);
    const serv = services.find(s => s.id === servId);
    if (serv) {
      setQuantity(serv.min || 1000);
    }
  };

  const handleQuantityChange = (e) => {
    const val = e.target.value;
    if (val === "") {
      setQuantity("");
      return;
    }
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed)) {
      setQuantity(parsed);
    }
  };

  const handleQuantityBlur = () => {
    if (!currentService) return;
    const minVal = currentService.min || 10;
    const maxVal = currentService.max || 1000000;
    let num = parseInt(quantity, 10);

    if (isNaN(num) || num < minVal) {
      num = minVal;
      addToast(`Quantity set to minimum required cap (${minVal.toLocaleString()})`, "info");
    } else if (num > maxVal) {
      num = maxVal;
      addToast(`Quantity capped to maximum allowed cap (${maxVal.toLocaleString()})`, "warning");
    }
    setQuantity(num);
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!link.trim()) {
      addToast("Please provide a valid target profile or post URL!", "warning");
      return;
    }

    const numQty = parseInt(quantity, 10);
    const minVal = currentService?.min || 10;
    const maxVal = currentService?.max || 1000000;

    if (isNaN(numQty) || numQty < minVal) {
      addToast(`Minimum quantity allowed for this service is ${minVal.toLocaleString()}`, "warning");
      return;
    }
    if (numQty > maxVal) {
      addToast(`Maximum quantity allowed for this service is ${maxVal.toLocaleString()}`, "warning");
      return;
    }

    if ((user?.balance || 0) < finalPrice) {
      addToast("Insufficient wallet balance! Please add funds to your wallet.", "error");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      updateBalance(-finalPrice);

      const createdOrder = addOrder({
        userName:    user?.name || "User",
        serviceName: currentService?.name || "SMM Campaign",
        serviceId:   currentService?.id || selectedServiceId,
        link:        link.trim(),
        quantity:    numQty,
        charge:      finalPrice,
      });

      addTransaction(
        "Order Campaign",
        "SMM Panel Checkout",
        `REF-${createdOrder.id}`,
        -finalPrice,
        "Completed"
      );

      setIsSubmitting(false);
      addToast(`Order ${createdOrder.id} placed! $${finalPrice} deducted. View in Order History.`, "success");
      setLink("");
      navigate("/dashboard/orders");
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-indigo-500" /> New Order Campaign
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Choose from 17,000+ instant delivery services with real-time rate calculation.
          </p>
        </div>

        <div className="flex items-center gap-3 glass-panel p-3 rounded-2xl border-slate-200 dark:border-slate-800">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Available Balance</p>
            <p className="text-base font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(user?.balance || 0)}</p>
          </div>
          <Badge variant="indigo">VIP 15% OFF</Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Order Form */}
        <Card className="lg:col-span-2 p-6">
          <form onSubmit={handleSubmitOrder} className="space-y-6">
            {maintenanceMode && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>System maintenance mode is currently enabled by Admin. Orders are paused temporarily.</span>
              </div>
            )}

            <CustomSelect
              label="Select Category"
              value={selectedCategory}
              options={categories}
              onChange={handleCategoryChange}
              icon={Sparkles}
              placeholder="Search or Select Category..."
            />

            <CustomSelect
              label="Select Service"
              value={selectedServiceId}
              options={categoryServices.map(s => ({
                value: s.id,
                label: `ID #${s.id} - ${s.name} - $${s.rate} per 1,000`
              }))}
              onChange={handleServiceChange}
              icon={Layers}
              placeholder="Search or Select Service..."
            />

            {/* Highlights Card */}
            {currentService && (
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="indigo" size="sm">{currentService.badge}</Badge>
                  <div className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                    <Clock className="w-3.5 h-3.5" /> ETA: {currentService.eta}
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {currentService.description}
                </p>
                <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 pt-1">
                  <span>Min: <strong className="text-slate-900 dark:text-white">{currentService.min?.toLocaleString()}</strong></span>
                  <span>Max: <strong className="text-slate-900 dark:text-white">{currentService.max?.toLocaleString()}</strong></span>
                  <span>Rate/1k: <strong className="text-indigo-600 dark:text-indigo-400">${currentService.rate}</strong></span>
                </div>
              </div>
            )}

            <Input
              label="Target Page / Post Link"
              type="url"
              icon={LinkIcon}
              placeholder="https://instagram.com/p/..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
              helperText="Ensure account profile is public before submitting order."
              required
            />

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Quantity (Manual Entry)
                </label>
                <span className="text-xs font-bold text-indigo-400">
                  Limits: {currentService ? `${currentService.min?.toLocaleString()} min — ${currentService.max?.toLocaleString()} max` : "100 - 100,000"}
                </span>
              </div>
              <input
                type="number"
                min={currentService?.min || 1}
                max={currentService?.max || 1000000}
                value={quantity}
                onChange={handleQuantityChange}
                onBlur={handleQuantityBlur}
                placeholder={`Enter custom amount (${currentService?.min || 10} - ${currentService?.max || 100000})`}
                className="w-full px-4 py-3 text-sm rounded-xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
              {quantity !== "" && currentService && (parseInt(quantity, 10) < currentService.min || parseInt(quantity, 10) > currentService.max) && (
                <p className="text-xs text-amber-500 font-semibold">
                  ⚠️ Amount is outside allowed service cap ({currentService.min?.toLocaleString()} to {currentService.max?.toLocaleString()}). Will automatically cap on blur/submit.
                </p>
              )}
            </div>

            <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Standard Charge:</span>
                <span className="font-semibold">{formatCurrency(calculatedCharge)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>VIP Discount (15% Off):</span>
                <span>-{formatCurrency(vipDiscount)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Total Charge:</span>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{formatCurrency(finalPrice)}</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              isLoading={isSubmitting}
              className="w-full justify-center gap-2 font-bold py-3.5 text-base shadow-indigo-500/30"
            >
              <Zap className="w-5 h-5 fill-current" /> Submit Campaign Order
            </Button>
          </form>
        </Card>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="p-5 space-y-4">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" /> Order Guarantees
            </CardTitle>
            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300 font-medium">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Instant Delivery:</strong> 94% of orders start within 15 seconds.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>30-Day Auto Refill:</strong> Automated refill bot monitors drop rates.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Safe Rate Limits:</strong> Monetization and organic algorithm safe.</span>
              </li>
            </ul>
          </Card>

          <Card className="p-5 space-y-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" /> Recommended Services
            </CardTitle>
            <div className="space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800">
              {services.slice(0, 3).map((rec, i) => (
                <div key={i} className="pt-2.5 first:pt-0 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{rec.name}</p>
                    <p className="text-[10px] text-slate-400">{rec.eta}</p>
                  </div>
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400 shrink-0">${rec.rate}/1k</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
