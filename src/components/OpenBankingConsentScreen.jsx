import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Check, ArrowRight, Building2, Fingerprint } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

// Animated Shield Component
const SecurityShield = () => (
  <div className="relative h-28 w-28 mx-auto mb-6">
    <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent rounded-full blur-md" />

    <div className="relative h-full w-full bg-[#0B0F19] border border-emerald-500/30 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-900/50">
      <ShieldCheck className="h-14 w-14 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" strokeWidth={1.5} />
    </div>

    <div className="absolute -bottom-2 -right-2 bg-slate-900 border border-emerald-500/50 p-2 rounded-full text-emerald-400 shadow-lg">
      <Lock size={14} />
    </div>
  </div>
);

const reassurancePoints = [
  {
    title: 'FCA Regulated',
    copy: 'We use Open Banking technology authorized by the Financial Conduct Authority.',
    icon: Building2
  },
  {
    title: 'Bank-Grade Encryption',
    copy: 'Your data is encrypted with TLS 1.2+. We never see or store your login credentials.',
    icon: Fingerprint
  },
  {
    title: 'Read-Only Access',
    copy: 'We can view balances and transactions to build your dashboard, but never move money.',
    icon: Lock
  },
];

const OpenBankingConsentScreen = ({ onConsent = () => {} }) => {
  return (
    <div className="flex min-h-[52vh] items-center justify-center bg-[#020617] px-4 py-6 text-slate-200 relative overflow-hidden">

      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-emerald-900/10 blur-[120px] rounded-full" />
         <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-indigo-900/10 blur-[120px] rounded-full" />
         {/* Grid Pattern */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
      </div>

      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative mx-auto w-full max-w-lg z-10"
      >
        {/* Card Container */}
        <div className="relative max-w-lg rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-5 shadow-2xl backdrop-blur-xl overflow-hidden min-h-[260px] sm:min-h-[280px]">

            {/* Top Shine */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <SecurityShield />

            <div className="text-center mb-6">
                <h1 className="text-3xl font-display font-bold text-white tracking-tight mb-3">
                Secure Connection
                </h1>
                <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
                Nest partners with your bank to securely sync your financial data. You remain in control.
                </p>
            </div>

            {/* Checklist */}
            <div className="space-y-3 mb-6">
                {reassurancePoints.map((item, i) => (
                    <motion.div
                        key={item.title}
                        variants={itemVariants}
                        className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors group"
                    >
                        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                            <item.icon size={16} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                                {item.title}
                                <Check size={12} className="text-emerald-500" strokeWidth={3} />
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">{item.copy}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Action Area */}
            <motion.div
                variants={itemVariants}
                className="space-y-4"
            >
                <motion.button
                    type="button"
                    onClick={onConsent}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 text-sm font-bold uppercase tracking-widest text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:bg-emerald-400 hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] transition-all duration-300 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <span className="relative flex items-center gap-2">
                        Continue to Bank <ArrowRight size={16} />
                    </span>
                </motion.button>

                <p className="text-center text-[10px] text-slate-500 leading-relaxed px-4">
                    By continuing, you agree to Nest's <span className="text-emerald-400 cursor-pointer hover:underline">Terms of Service</span> and <span className="text-emerald-400 cursor-pointer hover:underline">Privacy Policy</span>.
                </p>
            </motion.div>

        </div>
      </motion.main>
    </div>
  );
};

export default OpenBankingConsentScreen;
