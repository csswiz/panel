import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { ArrowRight } from "lucide-react";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";

export const OTPVerifyPage = () => {
  const { resetCode, resetEmail, setResetCode } = useAuth();
  const initialPin = resetCode ? resetCode.split("") : ["8", "4", "9", "2", "0", "1"];
  const [otp, setOtp] = useState(initialPin);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  useEffect(() => {
    if (resetCode) {
      setOtp(resetCode.split(""));
    }
  }, [resetCode]);

  const handleChange = (index, value) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const entered = otp.join("");
    if (resetCode && entered !== resetCode) {
      addToast(`Invalid OTP code entered. Hint: Code is ${resetCode}`, "error");
      return;
    }
    addToast("OTP Code Verified! Set your new account password.", "success");
    navigate("/auth/reset-password");
  };

  const handleResend = () => {
    const newPin = String(Math.floor(100000 + Math.random() * 900000));
    setResetCode(newPin);
    setOtp(newPin.split(""));
    addToast(`New OTP verification code sent: ${newPin}`, "info");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Enter Security Code</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          We sent a 6-digit verification code to{" "}
          <span className="text-indigo-400 font-bold">{resetEmail || "alex.vance@agencycloud.com"}</span>.
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-6">
        <div className="flex justify-between gap-2">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-12 h-14 text-center text-xl font-black bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 outline-none"
            />
          ))}
        </div>

        <Button type="submit" variant="gradient" className="w-full justify-center py-3 text-sm font-bold gap-2">
          Verify Security Code <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      <p className="text-center text-xs text-slate-400">
        Didn't receive code?{" "}
        <button onClick={handleResend} type="button" className="font-bold text-indigo-400 hover:underline">
          Resend Code
        </button>
      </p>
    </div>
  );
};
