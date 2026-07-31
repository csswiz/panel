import React, { useState } from 'react';
import { MOCK_TRANSACTIONS, MOCK_COUPONS } from '../../data/mockTransactions';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useToast } from '../../contexts/ToastContext';
import { DollarSign, Tag, PlusCircle, CreditCard, ShieldCheck } from 'lucide-react';

export const FinancialsPage = () => {
  const [coupons, setCoupons] = useState(MOCK_COUPONS);
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('$15 Bonus');
  const { addToast } = useToast();

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const created = {
      code: newCode.toUpperCase(),
      discount: newDiscount,
      minDeposit: 50,
      maxUses: 500,
      usedCount: 0,
      status: 'Active',
      expires: '2026-12-31'
    };

    setCoupons([created, ...coupons]);
    setCouponModalOpen(false);
    setNewCode('');
    addToast(`Coupon "${created.code}" created successfully!`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-emerald-500" /> Revenue & Coupon Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track gross deposits, payment gateway fee margins, and manage promotional voucher codes.
          </p>
        </div>

        <Button variant="gradient" onClick={() => setCouponModalOpen(true)} className="gap-2 font-bold shadow-indigo-500/30">
          <PlusCircle className="w-4 h-4" /> Create Voucher Coupon
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>System Deposits Queue</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold">
                <tr>
                  <th className="p-4">TXN ID</th>
                  <th className="p-4">Gateway</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
                {MOCK_TRANSACTIONS.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{t.id}</td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">{t.method}</td>
                    <td className="p-4 font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(t.amount)}</td>
                    <td className="p-4"><Badge variant="emerald">{t.status}</Badge></td>
                    <td className="p-4 text-slate-400">{formatDate(t.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Coupons List */}
        <Card className="p-6 space-y-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-500" /> Active Promotional Coupons
          </CardTitle>

          <div className="space-y-3">
            {coupons.map(c => (
              <div key={c.code} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-indigo-600 dark:text-indigo-400">{c.code}</span>
                  <Badge variant="emerald">{c.status}</Badge>
                </div>
                <p className="font-bold text-slate-800 dark:text-slate-200">{c.discount}</p>
                <p className="text-[10px] text-slate-400">Used {c.usedCount} / {c.maxUses} times • Expires {c.expires}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Modal
        isOpen={couponModalOpen}
        onClose={() => setCouponModalOpen(false)}
        title="Create Promotional Coupon Code"
      >
        <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
          <Input
            label="Coupon Code"
            placeholder="e.g. FLASHPROMO50"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            required
          />
          <Input
            label="Discount Offer Description"
            placeholder="e.g. $15 Bonus on $50+ deposit"
            value={newDiscount}
            onChange={(e) => setNewDiscount(e.target.value)}
            required
          />
          <Button type="submit" variant="gradient" className="w-full justify-center py-2.5 font-bold">
            Publish Promotional Coupon
          </Button>
        </form>
      </Modal>
    </div>
  );
};
