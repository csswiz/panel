import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { PLATFORMS, MOCK_SERVICES } from '../../data/mockServices';
import { formatCurrency, formatCompactNumber } from '../../utils/formatters';
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Globe,
  Clock,
  CheckCircle2,
  Lock,
  Headphones,
  Users,
  ChevronDown,
  Star,
  Layers,
  Cpu,
  Building2,
  Mail,
  Check
} from 'lucide-react';

export const LandingPage = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [activeFaq, setActiveFaq] = useState(null);
  const [isAnnual, setIsAnnual] = useState(true);

  const { user, isAuthenticated, updateTier } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeModal, setActiveModal] = useState(null); // 'vip' | 'enterprise' | null
  const [enterpriseForm, setEnterpriseForm] = useState({
    agencyName: '',
    email: '',
    volume: '$2,500 - $5,000 / month',
    notes: ''
  });

  const handlePlanAction = (tierId) => {
    if (tierId === 'standard') {
      if (isAuthenticated) {
        updateTier('Standard');
        addToast('Switched to Standard Plan (Base Rates).', 'info');
        navigate('/dashboard');
      } else {
        navigate('/auth/register');
      }
    } else if (tierId === 'vip') {
      setActiveModal('vip');
    } else if (tierId === 'enterprise') {
      setActiveModal('enterprise');
    }
  };

  const handleConfirmVip = () => {
    if (isAuthenticated) {
      updateTier('Reseller VIP');
      addToast('🎉 Congratulations! You have been upgraded to Reseller VIP tier with 10% extra volume discount!', 'success');
      setActiveModal(null);
      navigate('/dashboard');
    } else {
      setActiveModal(null);
      navigate('/auth/register');
    }
  };

  const handleEnterpriseSubmit = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      updateTier('Enterprise Agency');
      addToast('🚀 Enterprise inquiry received! Custom 20% API rates tier activated for your account.', 'success');
    } else {
      addToast('🚀 Enterprise inquiry received! Our sales team will reach out to you shortly.', 'success');
    }
    setActiveModal(null);
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  };

  const filteredServices = MOCK_SERVICES.filter(s =>
    selectedPlatform === 'all' ? true : s.platform === selectedPlatform
  ).slice(0, 8);

  const faqs = [
    { q: 'What is an SMM Panel and how does Wizard SMM work?', a: 'Wizard SMM is an enterprise-grade automated social media marketing platform that allows agencies, resellers, and influencers to purchase high-retention engagement services via automated API clusters.' },
    { q: 'Are the services safe for my social media accounts?', a: 'Yes! All services strictly comply with algorithmic rate limits and natural drip-feed speeds to ensure complete account safety and non-drop retention.' },
    { q: 'How fast are orders executed once submitted?', a: 'Over 94% of our services start within 0-15 seconds automatically. Live progress tracking is visible directly in your user dashboard.' },
    { q: 'Can I connect Wizard SMM API to my own panel or agency website?', a: 'Absolutely! We provide full REST API endpoints, client libraries, and documentation compatible with any custom code or popular panel scripts.' }
  ];

  return (
    <div className="space-y-28 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 px-4 sm:px-6 overflow-hidden">
        {/* Background Video - Vivid & Visible */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-85 pointer-events-none filter brightness-105 contrast-105"
        >
          <source src="/marketing.mp4" type="video/mp4" />
        </video>

        {/* Ambient Gradient Vignette Overlays for smooth blending */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/20 to-slate-950 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/30 to-slate-950/80 pointer-events-none" />

        {/* Animated glow ambient background graphics */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-indigo-600/30 via-blue-600/20 to-purple-600/30 rounded-full blur-[160px] pointer-events-none animate-float-slow" />

        {/* Hero Glass Content Container */}
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8 p-6 sm:p-12 rounded-3xl bg-slate-950/40 backdrop-blur-md border border-white/15 shadow-2xl shadow-slate-950/80">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-500/20 backdrop-blur-md shine-effect"
          >
            <Sparkles className="w-4 h-4 text-indigo-300 animate-pulse" />
            <span>Next-Gen Enterprise SMM Infrastructure OS v3.8</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.1] drop-shadow-md"
          >
            Scale Social Growth With{' '}
            <span className="text-gradient">Sub-Second Speed</span> & Ultra High Retention.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-xl text-slate-200 font-medium max-w-3xl mx-auto leading-relaxed drop-shadow-sm"
          >
            The world's most reliable automated SMM panel powering over 15,000+ agencies, resellers, and digital brands with 250+ services across 18+ platforms.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link to="/auth/register">
              <Button size="lg" variant="gradient" className="gap-2 text-base px-8 py-4 shadow-indigo-500/50">
                Launch Dashboard <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/dashboard/services">
              <Button size="lg" variant="outline" className="gap-2 text-base border-white/30 text-white bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-md">
                <Sparkles className="w-5 h-5 text-indigo-400" /> Browse 250+ Services
              </Button>
            </Link>
          </motion.div>

          {/* Quick Stats Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {[
              { label: 'Orders Processed', val: '12.8M+', icon: Clock },
              { label: 'Active Services', val: '250+', icon: Layers },
              { label: 'API Response Speed', val: '< 15ms', icon: Cpu },
              { label: 'Uptime SLA', val: '99.99%', icon: ShieldCheck }
            ].map((stat, i) => (
              <div key={i} className="group p-4 rounded-2xl border border-white/10 text-center bg-slate-900/60 backdrop-blur-md hover:border-indigo-500/40 hover:bg-slate-900/80 transition-all duration-300 shadow-lg">
                <stat.icon className="w-5 h-5 text-indigo-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xl sm:text-2xl font-black text-white">{stat.val}</p>
                <p className="text-xs text-slate-300 font-medium">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Showcase Marketplace Section */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-3">
          <Badge variant="indigo">250+ LIVE SERVICES</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Explore Enterprise Service Marketplace</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Instant delivery, automatic refill guarantees, and 24/7 API integration across all major networks.
          </p>
        </div>

        {/* Platform Selector Filter */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {PLATFORMS.slice(0, 10).map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPlatform(p.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap border ${
                selectedPlatform === p.id
                  ? 'bg-indigo-600 border-indigo-500/50 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredServices.map(service => (
            <Card key={service.id} hover className="group p-5 flex flex-col justify-between bg-slate-900/50 border-slate-800/60">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="indigo" size="sm">{service.platform.toUpperCase()}</Badge>
                  <span className="text-xs font-semibold text-emerald-400">{service.badge}</span>
                </div>
                <h3 className="text-sm font-bold text-white line-clamp-2 group-hover:text-indigo-300 transition-colors">{service.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{service.description}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Rate / 1000</span>
                  <span className="font-extrabold text-indigo-400 text-sm">{formatCurrency(service.rate)}</span>
                </div>
                <Link to="/auth/register">
                  <Button size="sm" variant="secondary" className="text-xs py-1 px-3">
                    Order Now
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="emerald">FLEXIBLE PRICING</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Tiered Reseller & Agency Discounts</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Automatic tier upgrades based on your monthly spending volume.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { id: 'standard', title: 'Standard Plan', spend: '$0 / Month', discount: 'Base Rates', icon: Star, btn: 'Start Free', popular: false },
            { id: 'vip', title: 'Reseller VIP', spend: '$500+ Volume', discount: '10% Extra Discount', icon: Sparkles, btn: 'Upgrade to VIP', popular: true },
            { id: 'enterprise', title: 'Enterprise Agency', spend: '$2,500+ Volume', discount: '20% Custom API Rates', icon: ShieldCheck, btn: 'Contact Enterprise', popular: false }
          ].map((tier, i) => {
            const isCurrent = isAuthenticated && (
              (tier.id === 'standard' && (user.tier === 'Standard' || !user.tier)) ||
              (tier.id === 'vip' && (user.tier === 'Reseller VIP' || user.tier === 'VIP')) ||
              (tier.id === 'enterprise' && (user.tier === 'Enterprise Agency' || user.tier === 'Enterprise VIP'))
            );

            return (
              <Card
                key={i}
                premium={tier.popular}
                className={`p-6 flex flex-col justify-between relative ${
                  tier.popular
                    ? 'bg-gradient-to-b from-indigo-900/40 via-slate-900 to-slate-900 border-indigo-500/40 shadow-2xl shadow-indigo-500/10'
                    : 'bg-slate-900/50 border-slate-800/60'
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-[10px] uppercase tracking-wider rounded-full shadow-lg shadow-indigo-500/30">
                    MOST POPULAR
                  </span>
                )}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tier.popular ? 'bg-indigo-500/15' : 'bg-slate-800/80'}`}>
                      <tier.icon className={`w-6 h-6 ${tier.popular ? 'text-indigo-400' : 'text-slate-400'}`} />
                    </div>
                    {isCurrent && (
                      <Badge variant="emerald" className="gap-1">
                        <Check className="w-3 h-3" /> Active Plan
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white">{tier.title}</h3>
                  <div className="py-3 border-y border-slate-800/60">
                    <span className="text-2xl font-black text-white">{tier.spend}</span>
                    <p className="text-xs text-indigo-400 font-semibold mt-1">{tier.discount}</p>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Full 250+ Service Access</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> REST API Key Access</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> 24/7 Priority Support Chat</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Automated Refill Monitoring</li>
                  </ul>
                </div>

                <div className="mt-8">
                  <Button
                    variant={isCurrent ? 'secondary' : (tier.popular ? 'gradient' : 'outline')}
                    onClick={() => handlePlanAction(tier.id)}
                    className="w-full justify-center"
                  >
                    {isCurrent ? 'Current Active Plan' : tier.btn}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-3">
          <Badge variant="indigo">HELP & QUESTIONS</Badge>
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-800/60 rounded-2xl overflow-hidden bg-slate-900/40 backdrop-blur-sm hover:border-slate-700/60 transition-colors card-accent-top">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-white hover:text-indigo-400 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180 text-indigo-400' : ''}`} />
              </button>
              <AnimatePresence>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-xs text-slate-400 border-t border-slate-800/60 pt-3 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-indigo-900 via-blue-900 to-purple-900 border border-indigo-500/30 text-center space-y-6 overflow-hidden shadow-2xl shadow-indigo-500/10">
          {/* Animated ambient effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-purple-500/5 animate-gradient-x" />
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none animate-float-slow" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none animate-float" style={{ animationDelay: '2s' }} />

          {/* Dot pattern */}
          <div className="absolute inset-0 dot-pattern opacity-30" />

          <h2 className="relative z-10 text-3xl sm:text-5xl font-black text-white">Ready To Supercharge Your SMM Agency?</h2>
          <p className="relative z-10 text-slate-200 text-sm sm:text-base max-w-xl mx-auto">
            Join over 15,000 agencies worldwide and experience sub-second order processing today.
          </p>
          <div className="relative z-10 flex justify-center gap-4">
            <Link to="/auth/register">
              <Button size="lg" variant="gradient" className="gap-2 shadow-indigo-500/50">
                Create Free Account <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Reseller VIP Upgrade Modal */}
      <Modal
        isOpen={activeModal === 'vip'}
        onClose={() => setActiveModal(null)}
        title="Upgrade to Reseller VIP"
      >
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center space-y-2">
            <Badge variant="indigo" size="lg">10% Extra Volume Discount</Badge>
            <h4 className="text-xl font-bold text-white mt-1">Reseller VIP Status</h4>
            <p className="text-xs text-slate-300">
              Spend $500+ monthly volume to unlock 10% instant extra discount on all 250+ services across all platforms.
            </p>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Instant 10% price reduction across Instagram, YouTube, TikTok & Telegram</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Priority Support Queue with sub-15 minute ticket response time</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Automated 30-Day Refill & Drip-Feed Monitoring Engine</span>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <Button variant="outline" onClick={() => setActiveModal(null)} className="flex-1">
              Cancel
            </Button>
            <Button variant="gradient" onClick={handleConfirmVip} className="flex-1">
              {isAuthenticated ? 'Activate Reseller VIP' : 'Sign Up for VIP'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Enterprise Agency Contact Modal */}
      <Modal
        isOpen={activeModal === 'enterprise'}
        onClose={() => setActiveModal(null)}
        title="Contact Enterprise Agency Sales"
      >
        <form onSubmit={handleEnterpriseSubmit} className="space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
            <Badge variant="emerald" size="lg">20% Custom API Rates</Badge>
            <p className="text-xs text-slate-300 mt-1">
              For high-volume agencies processing $2,500+ monthly orders. Custom API nodes & dedicated servers.
            </p>
          </div>

          <Input
            label="Agency / Company Name"
            icon={Building2}
            placeholder="e.g. GrowthScale Digital Agency"
            value={enterpriseForm.agencyName}
            onChange={(e) => setEnterpriseForm({ ...enterpriseForm, agencyName: e.target.value })}
            required
          />

          <Input
            label="Work Email Address"
            type="email"
            icon={Mail}
            placeholder="name@agency.com"
            value={enterpriseForm.email}
            onChange={(e) => setEnterpriseForm({ ...enterpriseForm, email: e.target.value })}
            required
          />

          <Select
            label="Estimated Monthly Order Volume"
            value={enterpriseForm.volume}
            onChange={(e) => setEnterpriseForm({ ...enterpriseForm, volume: e.target.value })}
            options={[
              '$2,500 - $5,000 / month',
              '$5,000 - $10,000 / month',
              '$10,000+ / month'
            ]}
          />

          <Input
            label="Custom Requirements / Notes"
            placeholder="e.g. Need dedicated API cluster for 10k orders/day"
            value={enterpriseForm.notes}
            onChange={(e) => setEnterpriseForm({ ...enterpriseForm, notes: e.target.value })}
          />

          <div className="pt-2 flex gap-3">
            <Button type="button" variant="outline" onClick={() => setActiveModal(null)} className="flex-1">
              Close
            </Button>
            <Button type="submit" variant="gradient" className="flex-1">
              Submit Inquiry
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
