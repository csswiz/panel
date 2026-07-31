import React, { useState, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { Card, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Switch } from "../../components/ui/Skeleton";
import { Badge } from "../../components/ui/Badge";
import { User, Lock, Bell, Laptop, Save, Trash2, Camera, ShieldCheck } from "lucide-react";

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    country: user.country || "United States",
    timezone: "UTC -05:00 (EST)",
  });

  const [passwordState, setPasswordState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [notifications, setNotifications] = useState({
    emailOrders: true,
    emailDeposits: true,
    telegramBot: true,
    promoAlerts: false
  });

  const [sessions, setSessions] = useState([
    { id: 1, device: "Chrome on MacOS (Current)", ip: "192.168.1.45", location: "New York, USA", time: "Active now" },
    { id: 2, device: "Safari on iPhone 15 Pro", ip: "172.56.21.90", location: "New York, USA", time: "2 hours ago" },
    { id: 3, device: "Firefox on Windows 11", ip: "184.22.91.12", location: "London, UK", time: "Yesterday" }
  ]);

  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ avatar: reader.result });
        addToast("Profile avatar updated successfully!", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      name: profile.name,
      email: profile.email,
      country: profile.country
    });
    addToast("Account profile details saved!", "success");
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!passwordState.currentPassword) {
      addToast("Please enter your current password", "warning");
      return;
    }
    if (passwordState.newPassword.length < 6) {
      addToast("New password must be at least 6 characters", "warning");
      return;
    }
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      addToast("Passwords do not match!", "error");
      return;
    }
    setPasswordState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    addToast("Security password updated successfully!", "success");
  };

  const handleRevokeSession = (id) => {
    setSessions(sessions.filter(s => s.id !== id));
    addToast("Remote session revoked!", "warning");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <User className="w-7 h-7 text-indigo-500" /> Account & Security Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your account profile details, security preferences, active sessions, and notifications.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card Sidebar */}
        <Card className="p-6 flex flex-col items-center text-center space-y-4 h-fit">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-500/30"
            />
            <button
              onClick={handleAvatarClick}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-600 text-white shadow-lg hover:scale-105 transition-transform"
              title="Change Profile Picture"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{user.name}</h3>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="indigo">{user.tier}</Badge>
            <Badge variant="emerald">15% VIP Discount</Badge>
          </div>
          <div className="w-full pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 space-y-2 text-left">
            <div className="flex justify-between">
              <span>Member Since:</span>
              <strong className="text-slate-900 dark:text-white">Jan 2024</strong>
            </div>
            <div className="flex justify-between">
              <span>Country:</span>
              <strong className="text-slate-900 dark:text-white">{user.country}</strong>
            </div>
            <div className="flex justify-between">
              <span>Account Status:</span>
              <strong className="text-emerald-500">Verified Active</strong>
            </div>
          </div>
        </Card>

        {/* Account Edit Form & Security (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Info */}
          <Card className="p-6 space-y-6">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-500" /> General Profile Information
            </CardTitle>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Country / Region"
                  value={profile.country}
                  onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                />
                <Input
                  label="Timezone"
                  value={profile.timezone}
                  onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="gradient" className="gap-2 text-xs font-bold">
                  <Save className="w-4 h-4" /> Save Profile Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* Change Password */}
          <Card className="p-6 space-y-6">
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-500" /> Change Security Password
            </CardTitle>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={passwordState.currentPassword}
                onChange={(e) => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
                required
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="New Password"
                  type="password"
                  value={passwordState.newPassword}
                  onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                  required
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={passwordState.confirmPassword}
                  onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" variant="outline" className="gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <ShieldCheck className="w-4 h-4" /> Update Password
                </Button>
              </div>
            </form>
          </Card>

          {/* Notification Preferences */}
          <Card className="p-6 space-y-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-500" /> Notification Preferences
            </CardTitle>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Order Status Email Notifications</p>
                  <p className="text-[11px] text-slate-400">Receive alerts when your order changes to completed or canceled.</p>
                </div>
                <Switch
                  checked={notifications.emailOrders}
                  onChange={(val) => {
                    setNotifications({ ...notifications, emailOrders: val });
                    addToast(`Order email notifications ${val ? "enabled" : "disabled"}`, "info");
                  }}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Deposit & Invoice Alerts</p>
                  <p className="text-[11px] text-slate-400">Instant notification when funds are added to your wallet balance.</p>
                </div>
                <Switch
                  checked={notifications.emailDeposits}
                  onChange={(val) => {
                    setNotifications({ ...notifications, emailDeposits: val });
                    addToast(`Deposit notifications ${val ? "enabled" : "disabled"}`, "info");
                  }}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Telegram Notification Bot Sync</p>
                  <p className="text-[11px] text-slate-400">Sync live order status directly to your Telegram chat.</p>
                </div>
                <Switch
                  checked={notifications.telegramBot}
                  onChange={(val) => {
                    setNotifications({ ...notifications, telegramBot: val });
                    addToast(`Telegram bot sync ${val ? "enabled" : "disabled"}`, "info");
                  }}
                />
              </div>
            </div>
          </Card>

          {/* Active Security Sessions */}
          <Card className="p-6 space-y-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Laptop className="w-5 h-5 text-indigo-500" /> Active Security Sessions
            </CardTitle>

            <div className="space-y-3">
              {sessions.map(s => (
                <div key={s.id} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <Laptop className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{s.device}</p>
                      <p className="text-[10px] text-slate-400">{s.ip} • {s.location} • {s.time}</p>
                    </div>
                  </div>
                  {s.id !== 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRevokeSession(s.id)}
                      className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Revoke
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
