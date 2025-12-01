import React from 'react';
import { motion } from 'framer-motion';
import { Zap, FileText, Check, ArrowRight, ShieldCheck, RefreshCw, PenTool, Lock } from 'lucide-react';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.15 },
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
    <div className="relative min-h-screen w-full bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">

      {/* 1. Global Background (Matches your ExperienceRegistration style) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-full max-w-5xl mx-auto"
      >
        {/* Header */}
        <motion.header className="text-center mb-12 md:mb-16" variants={cardVariants}>
          <div className="inline-flex items-center justify-center p-3 md:p-4 rounded-2xl bg-slate-900/50 border border-white/10 mb-6 md:mb-8 shadow-2xl backdrop-blur-md">
            <ShieldCheck className="text-emerald-400 h-8 w-8 md:h-10 md:w-10" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight mb-4 md:mb-6 leading-[1.1]">
            Connect your life
          </h1>
          <p className="text-base md:text-xl text-slate-400 max-w-lg mx-auto leading-relaxed">
            Choose how you want to power Nest. <br className="hidden md:block" />
            Most families start with automation for the full picture.
          </p>
        </motion.header>

        {/* The Choice Grid */}
        <div className="grid gap-6 md:gap-8 lg:grid-cols-2 max-w-[1000px] mx-auto">

          {/* OPTION 1: BANK LINK (Emerald / Primary) */}
          <motion.button
            type="button"
            onClick={onChoiceBankLink}
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex flex-col w-full rounded-[2rem] md:rounded-[2.5rem] bg-slate-900/40 p-6 md:p-10 text-left transition-all duration-300 border border-emerald-500/30 hover:border-emerald-500 hover:bg-slate-900/80 shadow-2xl overflow-hidden"
          >
            {/* Hover Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Recommended Badge */}
            <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Recommended
              </span>
            </div>

            {/* Icon */}
            <div className="mb-6 md:mb-8 flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl md:rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform duration-500 relative z-10">
              <Zap className="h-8 w-8 md:h-10 md:w-10 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" strokeWidth={1.5} />
            </div>

            <div className="space-y-1 mb-8 relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white group-hover:text-emerald-50 transition-colors">
                Link Accounts
              </h2>
              <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-emerald-500/80">
                Automated & Secure
              </p>
            </div>

            <div className="flex-1 space-y-4 md:space-y-5 border-t border-white/5 pt-6 md:pt-8 relative z-10 w-full">
              {[
                { icon: RefreshCw, text: 'Real-time sync' },
                { icon: ShieldCheck, text: 'Bank-grade security' },
                { icon: Check, text: 'Zero manual entry' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 md:gap-4">
                  <div className="flex h-6 w-6 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <item.icon className="h-3 w-3 md:h-4 md:w-4" />
                  </div>
                  <p className="text-sm md:text-base text-slate-300 group-hover:text-white transition-colors">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 md:mt-10 flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-emerald-400/80 group-hover:text-emerald-400 transition-colors group-hover:gap-3 relative z-10">
              Select Automation <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
            </div>
          </motion.button>

          {/* OPTION 2: MANUAL (Indigo / Architect) */}
          <motion.button
            type="button"
            onClick={onChoiceManual}
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex flex-col w-full rounded-[2rem] md:rounded-[2.5rem] bg-slate-900/20 p-6 md:p-10 text-left transition-all duration-300 border border-white/5 hover:border-indigo-500/50 hover:bg-slate-900/60 overflow-hidden"
          >
             {/* Hover Gradient */}
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Icon */}
            <div className="mb-6 md:mb-8 flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl md:rounded-3xl bg-slate-800/50 border border-white/5 text-slate-400 group-hover:scale-110 transition-transform duration-500 group-hover:text-indigo-300 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/10 relative z-10">
              <FileText className="h-8 w-8 md:h-10 md:w-10" strokeWidth={1.5} />
            </div>

            <div className="space-y-1 mb-8 relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-300 group-hover:text-white transition-colors">
                Manual Entry
              </h2>
              <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-slate-500 group-hover:text-indigo-400 transition-colors">
                Precision Control
              </p>
            </div>

            <div className="flex-1 space-y-4 md:space-y-5 border-t border-white/5 pt-6 md:pt-8 w-full relative z-10">
              {[
                { icon: PenTool, text: 'Log every transaction' },
                { icon: Lock, text: 'Offline privacy' },
                { icon: Check, text: 'Start instantly' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 md:gap-4">
                  <div className="flex h-6 w-6 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full bg-slate-800/50 text-slate-500 border border-white/5 group-hover:text-indigo-300 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/10">
                    <item.icon className="h-3 w-3 md:h-4 md:w-4" />
                  </div>
                  <p className="text-sm md:text-base text-slate-500 group-hover:text-slate-300 transition-colors">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 md:mt-10 flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-600 group-hover:text-indigo-300 transition-colors group-hover:gap-3 relative z-10">
              Select Manual <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
            </div>
          </motion.button>

        </div>

        {/* Footer Link */}
        <motion.div
          variants={cardVariants}
          className="mt-12 md:mt-16 text-center"
        >
          <button
            type="button"
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/5 transition-colors"
          >
            <ShieldCheck size={14} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-300 transition-colors">
              How we keep your data safe
            </span>
          </button>
        </motion.div>

      </motion.main>
    </div>
  );
};

export default OnboardingChoiceScreen;