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
      const finalize = setTimeout(onComplete, 800);
      return () => clearTimeout(finalize);
    }

    // Faster, more technical timing
    const duration = currentStep === 1 ? 1500 : 800;
    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  const ActiveIcon = STEPS[currentStep]?.icon || ShieldCheck;
  const isComplete = currentStep >= STEPS.length - 1;
  const progressPercent = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020617] px-4 relative overflow-hidden">

      {/* Static Background - No blurring animation to keep it professional */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute bottom-0 left-0 right-0 h-[50vh] bg-gradient-to-t from-emerald-900/10 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-[360px] bg-[#0B0F19] border border-white/10 rounded-2xl p-8 shadow-2xl z-10"
      >

        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
            <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
                 <AnimatePresence mode="wait">
                    <motion.div
                        key={isComplete ? 'done' : currentStep}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {isComplete ? <Check size={18} /> : <ActiveIcon size={18} />}
                    </motion.div>
                </AnimatePresence>
            </div>
            <div className="text-right">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    Encrypted Protocol
                </span>
            </div>
        </div>

        {/* Current Step Typography */}
        <div className="mb-8 min-h-[60px]">
            <h2 className="text-xl font-medium text-white mb-2">
                {isComplete ? 'Connection Established' : 'Connecting...'}
            </h2>
            <p className="text-sm text-slate-400">
                {STEPS[currentStep].label}
            </p>
        </div>

        {/* Linear Progress Bar */}
        <div className="relative h-1 w-full bg-slate-800 rounded-full overflow-hidden mb-8">
            <motion.div
                className="absolute top-0 left-0 h-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            />
        </div>

        {/* Minimal List */}
        <div className="space-y-3 border-t border-white/5 pt-6">
            {STEPS.map((step, index) => {
                const status = index < currentStep ? 'complete' : index === currentStep ? 'active' : 'pending';
                return (
                    <div key={step.id} className="flex items-center justify-between text-xs">
                        <span className={`transition-colors duration-300 ${status === 'pending' ? 'text-slate-600' : 'text-slate-300'}`}>
                            {step.label}
                        </span>
                        {status === 'complete' && <Check size={12} className="text-emerald-500" />}
                        {status === 'active' && <div className="h-1.5 w-1.5 bg-white rounded-full" />}
                    </div>
                );
            })}
        </div>

      </motion.div>
    </div>
  );
}