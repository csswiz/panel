import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Lock, ArrowRight } from "lucide-react";
import { useToast } from "../../contexts/ToastContext";

export const ResetPasswordPage = () => {
  const [passwords, setPasswords] = useState({ newPass: "", confirmPass: "" });
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    if (passwords.newPass.length < 6) {
      addToast("Password must be at least 6 characters long", "warning");
      return;
    }
    if (passwords.newPass !== passwords.confirmPass) {
      addToast("Passwords do not match!", "error");
      return;
    }

    addToast("Password updated successfully! Please sign in with your new credentials.", "success");
    navigate("/auth/login");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Create New Password</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Set a strong password containing at least 6 characters with numbers and symbols.
        </p>
      </div>

      <form onSubmit={handleReset} className="space-y-4">
        <Input
          label="New Password"
          type="password"
          icon={Lock}
          value={passwords.newPass}
          onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
          required
        />

        <Input
          label="Confirm New Password"
          type="password"
          icon={Lock}
          value={passwords.confirmPass}
          onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })}
          required
        />

        <Button type="submit" variant="gradient" className="w-full justify-center py-3 text-sm font-bold gap-2">
          Update Password & Sign In <ArrowRight className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};
