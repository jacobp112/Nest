'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, User, Zap, HeartHandshake, Crown, ArrowRight, Loader2, ShieldCheck
} from 'lucide-react';

import TopNav from '../components/TopNav.jsx';
import Starfield from '../components/experience/Starfield.jsx';
import { db, auth } from '../firebase/firebase-config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
// ADDED: GoogleAuthProvider and signInWithPopup
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

// --- CONSTANTS & DATA ---

const PLANS = [
  {
    key: 'solo-free',
    name: 'Solo Basic',
    price: '£0',
    period: '/ forever',
    description: 'Manual tracking for the mindful individual.',
    icon: User,
    features: [
      'Manual transaction entry',
      'Basic monthly budgeting',
      '1 Custom Category Group',
      '7-day data retention',
    ],
    cta: 'Join Free Waitlist',
    highlight: false,
  },
  {
    key: 'solo-paid',
    name: 'Solo Plus',
    price: '£4.99',
    period: '/ month',
    description: 'Automated clarity for your personal wealth.',
    icon: Zap,
    features: [
      'Unlimited Bank Sync (Open Banking)',
      'Automated categorization',
      'Net Worth tracking',
      'Unlimited history',
    ],
    cta: 'Reserve Plus Access',
    highlight: false,
  },
  {
    key: 'partners',
    name: 'Partners',
    price: '£8.99',
    period: '/ month',
    description: 'Shared visibility without losing autonomy.',
    icon: HeartHandshake,
    features: [
      'Everything in Solo Plus',
      '2 User Accounts',
      'Shared "Joint" Spaces',
      'Private "Personal" Spaces',
      'Couple’s Goal Tracking',
    ],
    cta: 'Reserve Partner Access',
    highlight: true,
    badge: 'High Demand',
  },
  {
    key: 'family',
    name: 'Family',
    price: '£12.99',
    period: '/ month',
    description: 'Financial literacy for the whole home.',
    icon: Crown,
    features: [
      'Everything in Partners',
      'Up to 6 User Accounts',
      'Kids & Teen Views (Read-only)',
      'Allowance & Chore Tracking',
      'Legacy & Estate Planning Vault',
    ],
    cta: 'Reserve Family Access',
    highlight: false,
  },
];

// --- COMPONENTS ---

const Step1Pricing = ({ onSelectPlan }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
          Select your plan
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Choose the right level of governance for your household.
          <br />
          <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest">
            Founding Member Rates Available
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {PLANS.map((plan) => (
          <motion.div
            key={plan.key}
            whileHover={{ y: -5 }}
            className={`relative flex flex-col p-6 rounded-3xl border backdrop-blur-sm transition-all duration-300 ${plan.highlight
              ? 'bg-slate-900/80 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.1)]'
              : 'bg-slate-950/60 border-white/10 hover:border-white/20'
              }`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold uppercase tracking-widest">
                {plan.badge}
              </div>
            )}

            <div className="mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${plan.highlight ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                }`}>
                <plan.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">{plan.price}</span>
                <span className="text-sm text-slate-500">{plan.period}</span>
              </div>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                {plan.description}
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => onSelectPlan(plan.key)}
              className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${plan.highlight
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                : 'bg-white/10 text-white hover:bg-white/20'
                }`}
            >
              Reserve
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Step2Registration = ({ selectedPlanKey, onChangePlan, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');

  const plan = PLANS.find(p => p.key === selectedPlanKey) || PLANS[0];
  const showPartnerFields = ['partners', 'family'].includes(selectedPlanKey);

  // NEW: Handle Google Sign Up
  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Prepare Firestore Data
      const waitlistRef = doc(db, 'waitlist_users', user.uid);

      const docData = {
        uid: user.uid,
        name: user.displayName || name, // Prefer Google name, fallback to form input
        email: user.email,
        plan: selectedPlanKey,
        timestamp: serverTimestamp(),
        source: 'google',
        emailVerified: user.emailVerified // Usually true for Google
      };

      // MERGE PARTNER DETAILS: If user filled these out before clicking Google, save them!
      if (showPartnerFields) {
        if (partnerName) docData.partnerName = partnerName;
        if (partnerEmail) docData.partnerEmail = partnerEmail;
      }

      await setDoc(waitlistRef, docData);
      onComplete();

    } catch (err) {
      console.error("Google Sign In Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !name || !password) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Create User in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Send Verification Email
      await sendEmailVerification(user);

      // 3. Save Data to Firestore (Waitlist Collection)
      const waitlistRef = doc(db, 'waitlist_users', user.uid);

      const docData = {
        uid: user.uid,
        name,
        email,
        plan: selectedPlanKey,
        timestamp: serverTimestamp(),
        source: 'web',
        emailVerified: false
      };

      if (showPartnerFields) {
        if (partnerName) docData.partnerName = partnerName;
        if (partnerEmail) docData.partnerEmail = partnerEmail;
      }

      await setDoc(waitlistRef, docData);

      onComplete();
    } catch (err) {
      console.error("Error registering: ", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already on the waitlist. Please try logging in.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(`Failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-display font-bold text-white">Create Account</h2>
            <p className="text-slate-400 text-sm mt-1">
              Reserving: <span className="text-emerald-400 font-bold">{plan.name}</span>
            </p>
          </div>
          <button
            onClick={onChangePlan}
            className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
          >
            Change Plan
          </button>
        </div>

        {/* GOOGLE SIGN UP BUTTON */}
        <div className="space-y-4 mb-6">
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-white text-slate-950 font-bold text-sm hover:bg-slate-100 transition-colors flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {/* Google Icon SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0f1522] px-2 text-slate-500 font-bold tracking-widest">
                Or continue with email
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="Jane Doe"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="jane@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          {showPartnerFields && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4 pt-4 border-t border-white/5"
            >
              <div className="flex items-center gap-2 mb-2">
                <HeartHandshake size={14} className="text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  Partner Details (Optional)
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mb-2">
                If you sign up with Google, please enter these details <strong>before</strong> clicking the Google button.
              </p>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                  Partner Name
                </label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                  Partner Email
                </label>
                <input
                  type="email"
                  value={partnerEmail}
                  onChange={(e) => setPartnerEmail(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </motion.div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm uppercase tracking-widest hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Secure Your Spot'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const Step3Success = ({ onNavigate }) => {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-12 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900/80 backdrop-blur-xl border border-emerald-500/30 p-10 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.1)]"
      >
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="text-emerald-400 w-10 h-10" />
        </div>

        <h2 className="text-3xl font-display font-bold text-white mb-4">
          Almost there!
        </h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          We've reserved your spot. Please check your inbox to <strong>verify your email</strong> and complete your registration.
        </p>

        <button
          onClick={() => onNavigate && onNavigate('demo')}
          className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2 group"
        >
          <span>Take a Product Tour</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
};

// --- MAIN WIZARD COMPONENT ---

export default function WaitlistWizard({ onNavigate, planContext }) {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Smart Entry Logic
  useEffect(() => {
    // Check context first (internal nav)
    if (planContext?.plan) {
      const plan = PLANS.find(p => p.key === planContext.plan);
      if (plan) {
        setSelectedPlan(plan.key);
        setStep(2);
        return;
      }
    }

    // Check URL params (external nav)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const planKey = params.get('plan');
      const plan = PLANS.find(p => p.key === planKey);

      if (plan) {
        setSelectedPlan(plan.key);
        setStep(2);
      } else {
        setStep(1);
      }
    }
  }, [planContext]);

  const handleSelectPlan = (planKey) => {
    setSelectedPlan(planKey);
    setStep(2);
    const url = new URL(window.location);
    url.searchParams.set('plan', planKey);
    window.history.pushState({}, '', url);
  };

  const handleChangePlan = () => {
    setStep(1);
    setSelectedPlan(null);
    const url = new URL(window.location);
    url.searchParams.delete('plan');
    window.history.pushState({}, '', url);
  };

  const handleComplete = () => {
    setStep(3);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location);
      url.searchParams.delete('plan');
      window.history.replaceState({}, '', url);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden font-sans selection:bg-emerald-500/30">
      <TopNav onNavigate={onNavigate} />

      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Starfield density={1200} speed={0.4} reducedMotion={false} />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/80 to-slate-950" />
      </div>

      <main className="relative z-10 pt-24 pb-12 min-h-screen flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <Step1Pricing onSelectPlan={handleSelectPlan} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Step2Registration
                selectedPlanKey={selectedPlan}
                onChangePlan={handleChangePlan}
                onComplete={handleComplete}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Step3Success onNavigate={onNavigate} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}