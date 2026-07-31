import React, { useState } from "react";
import { Card, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Switch } from "../../components/ui/Skeleton";
import { useSettings } from "../../contexts/SettingsContext";
import { useToast } from "../../contexts/ToastContext";
import { Settings, Shield, Lock, Save } from "lucide-react";

export const SettingsAdminPage = () => {
  const {
    panelName, setPanelName,
    maintenanceMode, setMaintenanceMode,
    rateLimit, setRateLimit,
    auditLogs, addAuditLog
  } = useSettings();
  const { addToast } = useToast();

  const [nameInput, setNameInput] = useState(panelName);
  const [rateInput, setRateInput] = useState(rateLimit);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setPanelName(nameInput);
    setRateLimit(rateInput);
    addAuditLog(`Updated panel settings (Name: "${nameInput}", Rate Limit: ${rateInput})`);
    addToast("System settings updated successfully!", "success");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Settings className="w-7 h-7 text-rose-500" /> System Settings & Audit Logs
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure branding, maintenance mode toggles, API rate limits, and inspect audit security logs.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 space-y-6">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-500" /> General Panel Configurations
          </CardTitle>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <Input
              label="SMM Panel Name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div>
                <p className="font-bold text-amber-600 dark:text-amber-400">Maintenance Mode Switch</p>
                <p className="text-[11px] text-slate-400">Toggling this will block public dashboard ordering.</p>
              </div>
              <Switch
                checked={maintenanceMode}
                onChange={(val) => {
                  setMaintenanceMode(val);
                  addAuditLog(`Toggled maintenance mode to ${val ? "ENABLED" : "DISABLED"}`);
                  addToast(`Maintenance mode ${val ? "ENABLED" : "DISABLED"}`, val ? "warning" : "info");
                }}
              />
            </div>

            <Input
              label="API Request Rate Limit (req/min per key)"
              type="number"
              value={rateInput}
              onChange={(e) => setRateInput(e.target.value)}
            />

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="gradient" className="gap-2 font-bold">
                <Save className="w-4 h-4" /> Save System Settings
              </Button>
            </div>
          </form>
        </Card>

        {/* Security Audit Log */}
        <Card className="p-6 space-y-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="w-5 h-5 text-rose-500" /> Admin Audit Security Log
          </CardTitle>

          <div className="space-y-3">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 space-y-1 text-xs">
                <p className="font-bold text-slate-900 dark:text-white">{log.action}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{log.admin} ({log.ip})</span>
                  <span>{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
