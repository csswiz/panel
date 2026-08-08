import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-950 text-slate-100">
      {/* Left Column - Enterprise Graphic & Testimonials */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-linear-to-br from-indigo-950 via-slate-900 to-slate-950 relative overflow-hidden border-r border-slate-800/50">
        {/* Animated ambient glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-violet-600/10 rounded-full blur-[80px] pointer-events-none animate-float-slow" style={{ animationDelay: '4s' }} />

        {/* Dot grid pattern */}
        <div className="absolute inset-0 dot-pattern opacity-50" />

        {/* Top Logo */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-indigo-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">WIZARD SMM</span>
          </Link>
        </div>

        {/* Center Feature Highlights */}
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4" /> Enterprise Grade SMM Infrastructure
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Scale Your Agency Growth With{' '}
            <span className="text-gradient">Sub-Second Order Execution.</span>
          </h2>
          <ul className="space-y-3.5 text-slate-300 text-sm font-medium">
            <li className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-emerald-500/10">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              </div>
              <span>17,000+ High Retention Services Across 18+ Social Platforms</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-emerald-500/10">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              </div>
              <span>Automated 24/7 Drip Feed & 30-Day Auto Refill Engine</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-emerald-500/10">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              </div>
              <span>Restful API with 2,500 Requests/Min Rate Limit Capability</span>
            </li>
          </ul>
        </div>

        {/* Bottom Testimonial Banner */}
        <div className="relative z-10 p-5 rounded-2xl bg-white/4 border border-white/8 backdrop-blur-xl shadow-xl">
          <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-indigo-500/5 to-transparent pointer-events-none" />
          <p className="text-xs text-slate-300 italic relative z-10">
            "Wizard SMM enabled our agency to process over 150,000 monthly orders without a single delay. The API uptime is literally flawless."
          </p>
          <div className="mt-3 flex items-center gap-3 relative z-10">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Alex Vance"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40 shadow-lg"
            />
            <div>
              <p className="text-xs font-bold text-white">Alex Vance</p>
              <p className="text-[10px] text-slate-400">CEO @ GrowthCloud Agency</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Form Container */}
      <div className="flex flex-col justify-between p-6 sm:p-12 bg-slate-900/50 relative">
        {/* Subtle ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <Link to="/" className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <span className="font-bold text-white">WIZARD</span>
          </Link>
        </div>

        <div className="my-auto py-8 max-w-md w-full mx-auto relative z-10">
          <Outlet />
        </div>

        <div className="text-center text-xs text-slate-500 relative z-10">
          Wizard SMM OS v3.8 • Made By CyberWiz
        </div>
      </div>
    </div>
  );
};
