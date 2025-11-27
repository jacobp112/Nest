import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Crown,
  HeartHandshake,
  Loader2,
  Sparkles,
  User,
  Zap,
  Lock,
} from 'lucide-react';
import TopNav from '../components/TopNav';
import Starfield from '../components/experience/Starfield';

const WAITLIST_SUBTEXT = 'We only send one welcome email plus launch-day priority instructions.';

const PLAN_CONFIG = {
  'solo-free': {
    name: 'Solo Basic',
    icon: User,
    accent: 'text-slate-400',
    badge: 'Free',
    background: 'bg-slate-800/40',
    price: 'Free',
  },
  'solo-paid': {
    name: 'Solo Plus',
    icon: Zap,
    accent: 'text-emerald-400',
    badge: '£4.99',
    background: 'bg-emerald-500/10',
    price: '£4.99 / month',
  },
  partners: {
    name: 'Partners',
    icon: HeartHandshake,
    accent: 'text-rose-400',
    badge: '£8.99',
    background: 'bg-rose-500/10',
    price: '£8.99 / month',
  },
  family: {
    name: 'Family',
    icon: Crown,
    accent: 'text-amber-400',
    badge: '£12.99',
    background: 'bg-amber-500/10',
    price: '£12.99 / month',
  },
};

const stepVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export default function RegisterPage({ onNavigate, planContext = {} }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedVault, setAgreedVault] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    partnerName: '',
  });

  const planKey = planContext?.planKey ?? 'solo-paid';
  const plan = PLAN_CONFIG[planKey] ?? PLAN_CONFIG['solo-paid'];
  const PlanIcon = plan.icon;
  const heroText = planContext?.heroText ?? `Reserving ${plan.name} spot.`;
  const subtext = planContext?.subtext ?? WAITLIST_SUBTEXT;

  const handleChange = (field) => (event) => {
    setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const isFormValid =
    agreedTerms && agreedVault && Boolean(formValues.name.trim()) && Boolean(formValues.email.trim());

  const handleSubmit = (event) => {
    event.preventDefault();
    if (loading || !isFormValid) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1600);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <TopNav onNavigate={onNavigate} />

      <div className="absolute inset-0 z-0">
        <Starfield density={1200} speed={0.4} reducedMotion={false} />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/90 to-slate-950 pointer-events-none" />
      </div>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-24">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/70 p-8 shadow-[0_25px_60px_rgba(0,0,0,0.65)] backdrop-blur-lg">

            <div className="relative rounded-2xl border border-white/5 bg-white/[0.02] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.5em] text-emerald-300 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    Reserving Spot
                  </p>
                  <h1 className="mt-4 text-3xl font-display font-semibold text-white leading-tight">{heroText}</h1>
                  <p className="mt-2 text-sm text-slate-400">{subtext}</p>
                </div>
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 ${plan.background} ${plan.accent} shadow-[inset_0_0_20px_rgba(255,255,255,0.08)]`}
                >
                  <PlanIcon size={28} />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.form
                    key="step-form"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-5"
                    onSubmit={handleSubmit}
                  >
                    <InputGroup
                      label="Full name"
                      placeholder="Alex Smith"
                      value={formValues.name}
                      onChange={handleChange('name')}
                    />
                    <InputGroup
                      label="Email address"
                      type="email"
                      placeholder="alex@example.com"
                      value={formValues.email}
                      onChange={handleChange('email')}
                    />
                    {planKey === 'partners' && (
                      <InputGroup
                        label="Partner's name"
                        placeholder="Jamie"
                        value={formValues.partnerName}
                        onChange={handleChange('partnerName')}
                      />
                    )}

                    <div className="space-y-3 pt-2">
                      <div className="flex items-start gap-3">
                        <div className="relative flex items-center pt-0.5">
                          <input
                            type="checkbox"
                            id="terms"
                            checked={agreedTerms}
                            onChange={(e) => setAgreedTerms(e.target.checked)}
                            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-white/20 bg-slate-900/50 transition-all checked:border-emerald-500 checked:bg-emerald-500"
                          />
                          <CheckCircle2
                            size={12}
                            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-950 opacity-0 peer-checked:opacity-100"
                          />
                        </div>
                        <label htmlFor="terms" className="text-xs text-slate-400 leading-relaxed cursor-pointer select-none">
                          I agree to the <button type="button" onClick={() => onNavigate('terms')} className="text-emerald-400 hover:underline">Terms</button> &amp; <button type="button" onClick={() => onNavigate('privacy')} className="text-emerald-400 hover:underline">Privacy Policy</button>.
                        </label>
                      </div>

                      <div className="flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-3">
                        <div className="relative flex items-center pt-0.5">
                          <input
                            type="checkbox"
                            id="vault"
                            checked={agreedVault}
                            onChange={(e) => setAgreedVault(e.target.checked)}
                            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-rose-500/30 bg-slate-900/50 transition-all checked:border-rose-500 checked:bg-rose-500"
                          />
                          <Lock
                            size={10}
                            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100"
                          />
                        </div>
                        <label htmlFor="vault" className="text-[11px] text-rose-200 leading-relaxed cursor-pointer select-none">
                          I understand the Vault is Zero-Knowledge. <strong>If I lose my password, Nest cannot recover my data.</strong>
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !isFormValid}
                      className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-slate-950 transition hover:bg-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin" size={16} />
                          <span>Securing Rate...</span>
                        </>
                      ) : (
                        <>
                          <span>Complete Reservation</span>
                          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}

                {step === 2 && (
                  <motion.div
                    key="success"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-6 text-center py-2"
                  >
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-[0_20px_50px_rgba(16,185,129,0.4)]">
                      <CheckCircle2 size={40} />
                    </div>

                    <div>
                      <h2 className="text-2xl font-display font-semibold text-white">You're on the list.</h2>
                      <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                        Thanks for reserving <strong>{plan.name}</strong>. We recorded your interest at the Founding Member rate.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-slate-900/40 px-5 py-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400 mb-3">While you wait</p>
                      <button
                        type="button"
                        onClick={() => onNavigate('onboarding-demo')}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all shadow-lg hover:bg-slate-700"
                      >
                        <Sparkles size={14} className="text-yellow-400" />
                        Take a Product Tour
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

const InputGroup = ({ label, type = 'text', placeholder, value, onChange }) => (
  <div className="space-y-2 text-left">
    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">{label}</label>
    <input
      type={type}
      required
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
    />
  </div>
);
