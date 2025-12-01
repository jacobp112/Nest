import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Check, ArrowRight, Building2, Fingerprint } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

const reassurancePoints = [
  {
    title: 'FCA Regulated',
    copy: 'Authorized by the Financial Conduct Authority.',
    icon: Building2
  },
  {
    title: 'Bank-Grade Encryption',
    copy: 'TLS 1.2+ encryption. We never see your logins.',
    icon: Fingerprint
  },
  {
    title: 'Read-Only Access',
    copy: 'We view balances but can never move money.',
    icon: Lock
  },
];

const OpenBankingConsentScreen = ({ onConsent = () => {} }) => {
  return (
    // UPDATED: Added 'min-h-screen' to force full viewport height
    <div className="flex min-h-screen w-full items-center justify-center bg-[#020617] px-4 py-6 text-slate-200 relative">

      {/* Subtle Ambient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-900/10 blur-[100px] rounded-full" />
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
      </div>

      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative mx-auto w-full max-w-2xl z-10"
      >
        <div className="relative rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl overflow-hidden">

            {/* Top Shine */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="p-6 md:p-8">

                {/* HEADER */}
                <div className="flex items-center gap-5 mb-8 border-b border-white/5 pb-6">
                    <div className="relative shrink-0">
                        <div className="absolute inset-0 bg-emerald-500/20 blur-md rounded-full" />
                        <div className="relative h-14 w-14 bg-[#0B0F19] border border-emerald-500/30 rounded-2xl flex items-center justify-center shadow-lg">
                            <ShieldCheck className="h-7 w-7 text-emerald-400" strokeWidth={1.5} />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-slate-900 border border-emerald-500/50 p-1 rounded-full text-emerald-400">
                            <Lock size={10} />
                        </div>
                    </div>

                    <div>
                        <h1 className="text-2xl font-display font-bold text-white tracking-tight">
                            Secure Connection
                        </h1>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Nest partners with your bank to securely sync your data. You remain in control.
                        </p>
                    </div>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
                    {reassurancePoints.map((item) => (
                        <motion.div
                            key={item.title}
                            variants={itemVariants}
                            className="flex flex-row md:flex-col items-center md:items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5"
                        >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <item.icon size={14} />
                            </div>
                            <div className="text-left">
                                <h4 className="text-xs font-bold text-white mb-0.5 flex items-center gap-1.5">
                                    {item.title}
                                </h4>
                                <p className="text-[10px] text-slate-500 leading-tight">{item.copy}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ACTION */}
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <motion.button
                        type="button"
                        onClick={onConsent}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-bold uppercase tracking-widest text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:bg-emerald-400 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <span className="relative flex items-center gap-2">
                            Connect Securely <ArrowRight size={16} />
                        </span>
                    </motion.button>
                </div>

                <p className="text-center md:text-left mt-4 text-[10px] text-slate-600">
                    By connecting, you agree to Nest's <span className="text-emerald-500/70 hover:text-emerald-400 cursor-pointer">Terms</span> & <span className="text-emerald-500/70 hover:text-emerald-400 cursor-pointer">Privacy</span>.
                </p>

            </div>
        </div>
      </motion.main>
    </div>
  );
};

export default OpenBankingConsentScreen;