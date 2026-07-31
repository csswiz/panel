import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("alex.vance@agencycloud.com");
  const { addToast } = useToast();
  const { setResetCode, setResetEmail } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    const generatedPin = String(Math.floor(100000 + Math.random() * 900000));
    setResetCode(generatedPin);
    setResetEmail(email.trim());

    addToast(`Security OTP Code: ${generatedPin} (Sent to ${email})`, "info");
    navigate("/auth/otp");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Reset Password</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Enter your registered account email to receive a 6-digit verification security code.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button type="submit" variant="gradient" className="w-full justify-center py-3 text-sm font-bold gap-2">
          Send Verification Code <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      <p className="text-center text-xs text-slate-400">
        <Link to="/auth/login" className="inline-flex items-center gap-1 font-bold text-indigo-400 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </Link>
      </p>
    </div>
  );
};
