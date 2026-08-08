import React, { useState } from "react";
import { MOCK_AFFILIATE_STATS, MOCK_LEADERBOARD, MOCK_COMMISSION_HISTORY } from "../../data/mockAffiliate";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { StatCard } from "../../components/common/StatCard";
import { formatCurrency } from "../../utils/formatters";
import { useToast } from "../../contexts/ToastContext";
import { Users, Copy, TrendingUp, Award, DollarSign, Check, Trophy, Share2 } from "lucide-react";

export const AffiliatePage = () => {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState("USDT (TRC20)");
  const [payoutAddress, setPayoutAddress] = useState("");

  const handleCopyLink = () => {
    navigator.clipboard.writeText(MOCK_AFFILIATE_STATS.referralLink);
    setCopied(true);
    addToast("Referral link copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayout = (e) => {
    e.preventDefault();
    if (!payoutAddress.trim()) return;

    addToast(`Payout request for ${formatCurrency(MOCK_AFFILIATE_STATS.commissionEarned)} submitted! Method: ${payoutMethod}`, "success");
    setPayoutModalOpen(false);
    setPayoutAddress("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-500" /> Affiliate Partner Program
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Earn 10% lifetime recurring commission on all deposits made by your referred agency clients.
          </p>
        </div>

        <Button variant="gradient" onClick={() => setPayoutModalOpen(true)} className="gap-2 font-bold shadow-indigo-500/30">
          <DollarSign className="w-4 h-4" /> Request Payout
        </Button>
      </div>

      {/* Referral Link Share Card */}
      <Card className="p-6 bg-linear-to-r from-indigo-900 via-slate-900 to-slate-900 border-indigo-500/40 text-white space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="indigo">10% RECURRING COMMISSION</Badge>
            <h3 className="text-xl font-bold mt-2">Your Unique Referral Link</h3>
          </div>
          <Share2 className="w-6 h-6 text-indigo-400" />
        </div>

        <div className="flex items-center gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800 font-mono text-xs">
          <span className="flex-1 truncate text-indigo-300 font-bold">{MOCK_AFFILIATE_STATS.referralLink}</span>
          <Button size="sm" variant="gradient" onClick={handleCopyLink} className="gap-1 text-xs">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Copy
          </Button>
        </div>
      </Card>

      {/* Affiliate Metrics Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Commission Earned"
          value={formatCurrency(MOCK_AFFILIATE_STATS.commissionEarned)}
          change="+24.5%"
          isPositive={true}
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="Referred Signups"
          value={MOCK_AFFILIATE_STATS.totalSignups.toLocaleString()}
          change="+45"
          isPositive={true}
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Link Click Traffic"
          value={MOCK_AFFILIATE_STATS.totalClicks.toLocaleString()}
          change="+1.2K"
          isPositive={true}
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="Conversion Rate"
          value={MOCK_AFFILIATE_STATS.conversionRate}
          change="+1.4%"
          isPositive={true}
          icon={Award}
          color="purple"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Commission Log Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Commission Earnings History</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Referred Client</th>
                  <th className="p-4">Deposit Amount</th>
                  <th className="p-4">Commission (10%)</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
                {MOCK_COMMISSION_HISTORY.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{row.id}</td>
                    <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">{row.referredUser}</td>
                    <td className="p-4 font-medium">{formatCurrency(row.depositAmount)}</td>
                    <td className="p-4 font-black text-emerald-600 dark:text-emerald-400">+{formatCurrency(row.commission)}</td>
                    <td className="p-4"><Badge variant="emerald">{row.status}</Badge></td>
                    <td className="p-4 text-slate-400">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Affiliate Leaderboard */}
        <Card className="p-6 space-y-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" /> Top Affiliate Leaderboard
          </CardTitle>
          <div className="space-y-3">
            {MOCK_LEADERBOARD.map(user => (
              <div key={user.rank} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-indigo-500">#{user.rank}</span>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-[10px] text-slate-400">{user.referrals.toLocaleString()} Referrals</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-black text-emerald-600 dark:text-emerald-400 block">{user.totalEarnings}</span>
                  <Badge variant="indigo" size="sm">{user.badge}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Payout Request Modal */}
      <Modal
        isOpen={payoutModalOpen}
        onClose={() => setPayoutModalOpen(false)}
        title="Request Affiliate Commission Payout"
      >
        <form onSubmit={handleConfirmPayout} className="space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex justify-between items-center">
            <span className="font-semibold text-slate-600 dark:text-slate-300">Available Earnings:</span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(MOCK_AFFILIATE_STATS.commissionEarned)}</span>
          </div>

          <div>
            <label className="block font-bold text-slate-400 uppercase text-[10px] mb-1">Payout Method</label>
            <select
              value={payoutMethod}
              onChange={(e) => setPayoutMethod(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
            >
              <option value="USDT (TRC20)">USDT (TRC20 / Crypto Wallet)</option>
              <option value="PayPal">PayPal Email Transfer</option>
              <option value="Wire Transfer">Direct Bank Wire Transfer</option>
              <option value="Wallet Credit">Add directly to SMM Panel Balance</option>
            </select>
          </div>

          <Input
            label="Payment Address / Email / Account Ref"
            placeholder="e.g. T9yD14Nj9j... or email@paypal.com"
            value={payoutAddress}
            onChange={(e) => setPayoutAddress(e.target.value)}
            required
          />

          <Button type="submit" variant="gradient" className="w-full justify-center py-3 font-bold text-sm">
            Submit Payout Request
          </Button>
        </form>
      </Modal>
    </div>
  );
};
