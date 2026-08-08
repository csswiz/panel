import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Mail, Lock, User, Globe, ArrowRight } from "lucide-react";

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    country: "United States"
  });
  const { login, updateProfile } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) return;

    login(formData.email, formData.password, "User");
    updateProfile({
      name: formData.name,
      email: formData.email,
      country: formData.country
    });

    addToast("Account created successfully! Welcome to Wizard SMM.", "success");
    navigate("/dashboard");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Create Free Account</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Get instant access to 17,000+ social growth services with zero monthly commitment.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name / Agency Name"
          type="text"
          icon={User}
          placeholder="e.g. Alex Vance"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          placeholder="alex@agency.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <Input
          label="Country / Region"
          type="text"
          icon={Globe}
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          required
        />

        <Input
          label="Create Password"
          type="password"
          icon={Lock}
          placeholder="At least 6 characters"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />

        <div className="text-xs text-slate-400 flex items-start gap-2">
          <input type="checkbox" defaultChecked className="mt-0.5 rounded bg-slate-800 border-slate-700" required />
          <span>I agree to the Terms of Service, Privacy Policy, and Service SLA.</span>
        </div>

        <Button type="submit" variant="gradient" className="w-full justify-center py-3 text-sm font-bold gap-2">
          Create Account Now <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      <p className="text-center text-xs text-slate-400">
        Already have an account?{" "}
        <Link to="/auth/login" className="font-bold text-indigo-400 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
};
