import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { useWallet } from "../../contexts/WalletContext";
import { PAYMENT_METHODS, MOCK_COUPONS } from "../../data/mockTransactions";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { Wallet, PlusCircle, Tag, Gift } from "lucide-react";

export const WalletPage = () => {
  const { user, updateBalance } = useAuth();
  const { addToast } = useToast();
  const { transactions, addTransaction } = useWallet();

  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0]);
  const [depositAmount, setDepositAmount] = useState(100);
  const [couponCode, setCouponCode] = useState("");

  const handleDeposit = () => {
    const amountNum = parseFloat(depositAmount);
    if (isNaN(amountNum) || amountNum < selectedMethod.min) {
      addToast(`Minimum deposit amount for ${selectedMethod.name} is $${selectedMethod.min}`, "warning");
      return;
    }

    let bonusAmount = 0;
    if (selectedMethod.id === "crypto" && amountNum >= 100) {
      bonusAmount = amountNum * 0.05;
    }
    const totalCredit = amountNum + bonusAmount;

    updateBalance(totalCredit);
    addTransaction(
      "Deposit",
      selectedMethod.name,
      `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
      totalCredit,
      "Completed"
    );

    setDepositModalOpen(false);
    addToast(`Successfully deposited ${formatCurrency(amountNum)}! Total Credited: ${formatCurrency(totalCredit)} (${selectedMethod.name})`, "success");
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const coupon = MOCK_COUPONS.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    if (coupon) {
      updateBalance(25.00);
      addTransaction(
        "Coupon Bonus",
        "Promotional Voucher",
        `CODE-${coupon.code}`,
        25.00,
        "Completed"
      );
      addToast(`Coupon "${coupon.code}" redeemed! $25.00 added to your wallet balance.`, "success");
      setCouponCode("");
    } else {
      addToast('Invalid or expired coupon code. Try "VIPSUMMER25"', "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Wallet className="w-7 h-7 text-indigo-500" /> Wallet & Automated Deposits
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your funds, add balance via automated gateways, and redeem promotional bonuses.
          </p>
        </div>

        <Button variant="gradient" onClick={() => setDepositModalOpen(true)} className="gap-2 font-bold shadow-indigo-500/30">
          <PlusCircle className="w-4 h-4" /> Deposit Funds
        </Button>
      </div>

      {/* Balance Summary Card */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 bg-linear-to-br from-indigo-900 via-slate-900 to-slate-900 border-indigo-500/50 shadow-2xl relative overflow-hidden text-white md:col-span-2">
          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Available Wallet Balance</span>
              <h2 className="text-4xl font-black mt-2 tracking-tight">{formatCurrency(user.balance)}</h2>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Wallet className="w-8 h-8" />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-indigo-500/20 flex flex-wrap items-center justify-between gap-4 text-xs relative z-10">
            <div className="flex items-center gap-2">
              <Badge variant="emerald">Enterprise Tier</Badge>
              <span className="text-slate-300">15% Automatic Discount Applied</span>
            </div>
            <Button size="sm" variant="gradient" onClick={() => setDepositModalOpen(true)}>
              + Quick Top-Up
            </Button>
          </div>
        </Card>

        {/* Redeem Coupon Card */}
        <Card className="p-6 space-y-4 flex flex-col justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Gift className="w-5 h-5 text-indigo-500" /> Redeem Coupon
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Have a promotional voucher or bonus code? Enter it below.
            </p>
          </div>

          <form onSubmit={handleApplyCoupon} className="space-y-3">
            <Input
              icon={Tag}
              placeholder="e.g. VIPSUMMER25"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              required
            />
            <Button type="submit" variant="primary" className="w-full justify-center text-xs">
              Redeem Code
            </Button>
          </form>

          <p className="text-[11px] text-slate-400 text-center">
            Try code <strong className="text-indigo-500">VIPSUMMER25</strong> for instant $25 bonus.
          </p>
        </Card>
      </div>

      {/* Payment Gateway Grid Preview */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Automated Payment Methods</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PAYMENT_METHODS.map(method => (
            <Card
              key={method.id}
              hover
              onClick={() => {
                setSelectedMethod(method);
                setDepositModalOpen(true);
              }}
              className="p-4 cursor-pointer space-y-3"
            >
              <div className="flex items-center justify-between">
                <Badge variant="indigo">{method.badge}</Badge>
                <span className="text-xs font-bold text-emerald-500">{method.bonus}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{method.name}</h4>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Fee: {method.fee}</span>
                <span>Min: ${method.min}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Transaction History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold">
              <tr>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Type</th>
                <th className="p-4">Payment Method / Reference</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
              {transactions.map(txn => (
                <tr key={txn.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{txn.id}</td>
                  <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">{txn.type}</td>
                  <td className="p-4 font-medium text-slate-600 dark:text-slate-400">
                    {txn.method} <span className="text-[11px] text-slate-400 block font-mono">Ref: {txn.reference}</span>
                  </td>
                  <td className={`p-4 font-black text-sm ${txn.amount > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"}`}>
                    {txn.amount > 0 ? `+${formatCurrency(txn.amount)}` : formatCurrency(txn.amount)}
                  </td>
                  <td className="p-4">
                    <Badge variant="emerald">{txn.status}</Badge>
                  </td>
                  <td className="p-4 text-slate-400">{formatDate(txn.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Deposit Modal */}
      <Modal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        title="Add Funds to Wallet"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-400 uppercase text-[10px] mb-1">Select Gateway</label>
            <select
              value={selectedMethod.id}
              onChange={(e) => setSelectedMethod(PAYMENT_METHODS.find(m => m.id === e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
            >
              {PAYMENT_METHODS.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.bonus})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-400 uppercase text-[10px] mb-1">
              Deposit Amount (USD)
            </label>
            <Input
              type="number"
              min={selectedMethod.min}
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
          </div>

          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-medium">
            💡 {selectedMethod.bonus} bonus will be added automatically upon payment completion.
          </div>

          <Button variant="gradient" onClick={handleDeposit} className="w-full justify-center py-3 font-bold text-sm">
            Complete Automated Top-Up
          </Button>
        </div>
      </Modal>
    </div>
  );
};
