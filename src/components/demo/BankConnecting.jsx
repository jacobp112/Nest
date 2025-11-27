import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, Server, Building2, Check } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Authenticating with Bank', icon: Building2 },
  { id: 2, label: 'Verifying Credentials', icon: Lock },
  { id: 3, label: 'Syncing Accounts', icon: Server },
  { id: 4, label: 'Connection Secure', icon: ShieldCheck },
];

export default function BankConnecting({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= STEPS.length - 1) {
      const finalize = setTimeout(onComplete, 1200);
      return () => clearTimeout(finalize);
    }

    // Varied timing to feel "real"
    const duration = currentStep === 1 ? 2000 : 1000;
    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020617] px-4 relative overflow-hidden">

      {/* Ambient Background Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-900/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-sm bg-slate-900/80 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-xl z-10"
      >

        {/* Central Hero Animation */}
        <div className="relative mx-auto mb-10 h-28 w-28 flex items-center justify-center">
          {/* Pulse Waves */}
          <div className="absolute inset-0 rounded-full bg-emerald-500/5 animate-ping [animation-duration:3s]" />
          <div className="absolute inset-4 rounded-full bg-emerald-500/10 animate-ping [animation-duration:2s] [animation-delay:0.5s]" />

          {/* Main Icon Circle */}
          <div className="relative z-10 h-20 w-20 bg-gradient-to-b from-slate-800 to-slate-950 rounded-full border border-white/10 flex items-center justify-center shadow-xl shadow-black/50">
            <AnimatePresence mode="wait">
              {currentStep >= STEPS.length - 1 ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-emerald-400"
                >
                  <Check size={40} strokeWidth={3} />
                </motion.div>
              ) : (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ShieldCheck size={36} className="text-slate-400" strokeWidth={1.5} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Spinning Ring */}
            {currentStep < STEPS.length - 1 && (
               <svg className="absolute inset-[-4px] w-[calc(100%+8px)] h-[calc(100%+8px)] animate-spin">
                  <circle cx="50%" cy="50%" r="48%" fill="none" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeDasharray="100 200" />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
               </svg>
            )}
          </div>
        </div>

        {/* Status Header */}
        <div className="text-center mb-10">
          <h2 className="text-lg font-display font-semibold text-white tracking-tight mb-1">
            {currentStep >= STEPS.length - 1 ? 'Connection Secure' : 'Secure Handshake'}
          </h2>
          <p className="text-xs text-slate-400 uppercase tracking-widest">
            AES-256 Encrypted Protocol
          </p>
        </div>

        {/* Vertical Timeline Stepper */}
        <div className="relative space-y-0 pl-4">
          {/* Connecting Line */}
          <div className="absolute left-[27px] top-4 bottom-8 w-px bg-slate-800" />

          {STEPS.map((step, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;
            const isPending = index > currentStep;

            return (
              <div key={step.id} className="relative flex items-center gap-5 py-3 z-10">
                {/* Status Dot */}
                <div className={`
                  flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-500
                  ${isCompleted ? 'bg-emerald-500 border-emerald-500' : isActive ? 'bg-slate-900 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-slate-900 border-slate-700'}
                `}>
                  {isCompleted && <Check size={12} className="text-white" strokeWidth={3} />}
                  {isActive && <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
                </div>

                {/* Label */}
                <div className={`flex items-center gap-3 transition-all duration-500 ${isActive || isCompleted ? 'opacity-100 translate-x-0' : 'opacity-40'}`}>
                   <step.icon size={16} className={isActive || isCompleted ? 'text-emerald-400' : 'text-slate-500'} />
                   <span className={`text-sm font-medium ${isActive || isCompleted ? 'text-white' : 'text-slate-500'}`}>
                     {step.label}
                   </span>
                </div>
              </div>
            );
          })}
        </div>

      </motion.div>
    </div>
  );
}
