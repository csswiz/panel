import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { formatCurrency } from "../../utils/formatters";
import { useToast } from "../../contexts/ToastContext";
import { Users, Search, DollarSign } from "lucide-react";

export const UserManagementPage = () => {
  const { allUsersList, adminAdjustUserBalance, adminToggleUserStatus } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [balanceAdjust, setBalanceAdjust] = useState(100);
  const { addToast } = useToast();

  const filteredUsers = allUsersList.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.country && u.country.toLowerCase().includes(search.toLowerCase()))
  );

  const handleToggleStatus = (userObj) => {
    adminToggleUserStatus(userObj.email);
    const nextStatus = userObj.status === "Active" ? "Suspended" : "Active";
    addToast(`User ${userObj.name} status updated to ${nextStatus}`, "warning");
  };

  const handleAdjustBalance = () => {
    if (!selectedUser) return;
    const amount = parseFloat(balanceAdjust);
    if (isNaN(amount)) return;

    adminAdjustUserBalance(selectedUser.email, amount);
    addToast(`Balance updated for ${selectedUser.name}! (${amount >= 0 ? "+" : ""}${formatCurrency(amount)})`, "success");
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-500" /> User Directory Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage registered agency clients, modify wallet balances, and set VIP tiers.
          </p>
        </div>

        <Badge variant="indigo" size="lg">
          {allUsersList.length} Active Accounts
        </Badge>
      </div>

      <Card className="p-4">
        <Input
          icon={Search}
          placeholder="Search user name, email, or country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Tier & Role</th>
                <th className="p-4">Wallet Balance</th>
                <th className="p-4">Total Spent</th>
                <th className="p-4">Country</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
              {filteredUsers.map(u => (
                <tr key={u.email} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                        <p className="text-[10px] text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <Badge variant="indigo" size="sm">{u.tier}</Badge>
                      <span className="text-[10px] text-slate-400 font-semibold">({u.role})</span>
                    </div>
                  </td>
                  <td className="p-4 font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(u.balance)}</td>
                  <td className="p-4 font-bold">{formatCurrency(u.totalSpent || 0)}</td>
                  <td className="p-4 font-medium text-slate-600 dark:text-slate-300">{u.country || "United States"}</td>
                  <td className="p-4">
                    <Badge variant={u.status === "Active" ? "emerald" : "rose"}>{u.status || "Active"}</Badge>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedUser(u)}
                      className="py-1 px-2.5 text-[11px] gap-1"
                    >
                      <DollarSign className="w-3 h-3 text-emerald-500" /> Funds
                    </Button>
                    <Button
                      size="sm"
                      variant={u.status === "Active" ? "danger" : "success"}
                      onClick={() => handleToggleStatus(u)}
                      className="py-1 px-2 text-[11px]"
                    >
                      {u.status === "Active" ? "Suspend" : "Activate"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Adjust Balance Modal */}
      {selectedUser && (
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title={`Modify Wallet Balance: ${selectedUser.name}`}
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-500">Current Balance: <strong className="text-emerald-500">{formatCurrency(selectedUser.balance)}</strong></p>
            <Input
              label="Amount to Add (Use negative value to subtract)"
              type="number"
              value={balanceAdjust}
              onChange={(e) => setBalanceAdjust(e.target.value)}
            />
            <Button variant="gradient" onClick={handleAdjustBalance} className="w-full justify-center py-2.5 font-bold">
              Update Balance Now
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
