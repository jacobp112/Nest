import React from 'react';
import { motion } from 'framer-motion';
import { Zap, FileText, Check, ArrowRight, ShieldCheck, RefreshCw, PenTool } from 'lucide-react';

// Smooth easing for the entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

const OnboardingChoiceScreen = ({
  onChoiceManual = () => {},
  onChoiceBankLink = () => {},
}) => {
  return (
    <div className="flex min-h-[68vh] items-center justify-center bg-[#020617] px-4 py-10 text-slate-200 sm:px-6 lg:px-8 relative overflow-hidden">

      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-900/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative w-full max-w-3xl z-10"
      >
        <motion.header className="mx-auto max-w-2xl text-center mb-16" variants={cardVariants}>
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 mb-8 shadow-2xl backdrop-blur-sm">
            <ShieldCheck className="text-emerald-400 h-10 w-10 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white tracking-tight mb-4">
            Connect your life
          </h1>
          <p className="text-lg text-slate-400 max-w-md mx-auto leading-relaxed">
            Choose how you want to power Nest. Most families start with automation for the full picture.
          </p>
        </motion.header>

        <div className="grid gap-8 items-start justify-center lg:grid-cols-2">

          {/* OPTION 1: BANK LINK (Primary - FIXED VISUALS) */}
          <motion.button
            type="button"
            onClick={onChoiceBankLink}
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex flex-col max-w-[460px] w-full mx-auto min-h-[360px] md:min-h-[380px] rounded-[2.5rem] bg-[#0B0F19] px-5 py-6 text-left transition-all duration-300 border-2 border-emerald-500/30 hover:border-emerald-500 shadow-2xl hover:shadow-[0_0_50px_rgba(16,185,129,0.2)] overflow-hidden"
          >
            {/* Inner Glow Effect (Subtle) */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-emerald-500/20 transition-colors duration-500" />

            {/* Recommended Badge */}
            <div className="absolute top-8 right-8 z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Recommended
              </span>
            </div>

            {/* Icon */}
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/20 text-emerald-400 shadow-[inset_0_0_30px_rgba(16,185,129,0.1)] group-hover:scale-110 transition-transform duration-500 group-hover:border-emerald-500/40 relative z-10">
              <Zap className="h-10 w-10 drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]" strokeWidth={1.5} />
            </div>

            <div className="space-y-2 mb-10 relative z-10">
              <h2 className="text-3xl font-bold text-white group-hover:text-emerald-50 transition-colors">
                Link Accounts
              </h2>
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-500/80">
                Automated & Secure
              </p>
            </div>

            <div className="flex-1 space-y-5 border-t border-white/5 pt-8 relative z-10 w-full">
              {[
                { icon: RefreshCw, text: 'Real-time sync' },
                { icon: ShieldCheck, text: 'Bank-grade security' },
                { icon: Check, text: 'Zero manual entry' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <p className="text-base text-slate-300 group-hover:text-white transition-colors">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/60 group-hover:text-emerald-400 transition-colors group-hover:gap-4 relative z-10">
              Select Automation <ArrowRight className="h-4 w-4" />
            </div>
          </motion.button>

          {/* OPTION 2: MANUAL (Secondary) */}
          <motion.button
            type="button"
            onClick={onChoiceManual}
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex flex-col max-w-[460px] w-full mx-auto min-h-[360px] md:min-h-[380px] rounded-[2.5rem] border-2 border-white/5 bg-[#0B0F19] px-5 py-6 text-left transition-all duration-500 hover:bg-white/[0.02] hover:border-white/10 overflow-hidden"
          >
            {/* Icon */}
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 border border-white/10 text-slate-400 group-hover:scale-110 transition-transform duration-500 group-hover:text-white group-hover:bg-white/10">
              <FileText className="h-10 w-10" strokeWidth={1.5} />
            </div>

            <div className="space-y-2 mb-10">
              <h2 className="text-3xl font-bold text-slate-400 group-hover:text-white transition-colors">
                Manual Entry
              </h2>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-600 group-hover:text-slate-400 transition-colors">
                Full Control
              </p>
            </div>

            <div className="flex-1 space-y-5 border-t border-white/5 pt-8 w-full">
              {[
                { icon: PenTool, text: 'Log every transaction' },
                { icon: ShieldCheck, text: 'Offline privacy' },
                { icon: Check, text: 'Start instantly' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-slate-500 border border-white/10 group-hover:text-white group-hover:bg-white/10">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <p className="text-base text-slate-500 group-hover:text-slate-300 transition-colors">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-600 group-hover:text-white transition-colors group-hover:gap-4">
              Select Manual <ArrowRight className="h-4 w-4" />
            </div>
          </motion.button>

        </div>

        <motion.div
          variants={cardVariants}
          className="mt-16 text-center"
        >
          <button
            type="button"
            className="text-[10px] uppercase tracking-[0.2em] text-slate-500 hover:text-emerald-400 transition-colors duration-300 flex items-center justify-center gap-2 mx-auto"
          >
            <ShieldCheck size={14} /> How we keep your data safe
          </button>
        </motion.div>

      </motion.main>
    </div>
  );
};

export default OnboardingChoiceScreen;
