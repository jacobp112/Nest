import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowRight, Brain, Shield, Users, TrendingUp, Check,
  HeartHandshake, Phone, Globe, MessageCircle, X
} from 'lucide-react';

import { useIsMobile } from '../../hooks/useIsMobile';

// --- EXPANDED QUESTION SET ---
const QUESTIONS = [
  {
    id: 'windfall',
    question: "You unexpectedly receive £10,000. What is your honest immediate reaction?",
    options: [
      { label: "Plan: I open a spreadsheet to calculate the best allocation.", weight: { architect: 5, steward: 1 } },
      { label: "Relief: I put it straight into savings/mortgage for safety.", weight: { steward: 5, architect: 1 } },
      { label: "Share: I call my partner. We decide together.", weight: { collaborator: 5, steward: 1 } },
      { label: "Action: I use it to pay off a debt or upgrade my lifestyle immediately.", weight: { ascender: 5 } },
    ]
  },
  {
    id: 'current_state',
    question: "How do you currently track your money?",
    options: [
      { label: "I have a detailed system (Excel/Notion) that I update manually.", weight: { architect: 5 } },
      { label: "We have a joint account, but it gets messy sometimes.", weight: { collaborator: 5 } },
      { label: "I keep mental notes and check my banking app when I'm worried.", weight: { steward: 3, ascender: 3 } },
      { label: "I try not to look until I have to.", weight: { ascender: 5 } },
    ]
  },
  {
    id: 'nightmare',
    question: "What keeps you up at night regarding finance?",
    options: [
      { label: "Chaos: Not knowing exactly where every penny is going.", weight: { architect: 5 } },
      { label: "Security: The fear of losing my job or home.", weight: { steward: 5 } },
      { label: "Tension: Arguments or awkward silence with my partner.", weight: { collaborator: 5 } },
      { label: "Speed: Feeling like I'm working hard but not moving forward.", weight: { ascender: 5 } },
    ]
  },
  {
    id: 'purchase',
    question: "You need to buy something expensive (like a car or holiday). You...",
    options: [
      { label: "Research specs and resale value for weeks before buying.", weight: { architect: 5 } },
      { label: "Worry about if we can really afford it right now.", weight: { steward: 5 } },
      { label: "Discuss it with family to make sure everyone is happy.", weight: { collaborator: 5 } },
      { label: "If I can afford the monthly payment, I get it.", weight: { ascender: 5 } },
    ]
  },
  {
    id: 'dream',
    question: "What does 'Financial Freedom' feel like to you?",
    options: [
      { label: "Total Control: A dashboard where all the lights are green.", weight: { architect: 5 } },
      { label: "Safety: A paid-off home and money for the kids.", weight: { steward: 5 } },
      { label: "Harmony: Never fighting about bills again.", weight: { collaborator: 5 } },
      { label: "Momentum: Being debt-free and seeing the numbers go up.", weight: { ascender: 5 } },
    ]
  },
  {
    id: 'motivation',
    question: "Why did you click on Nest today?",
    options: [
      { label: "My current system is broken/ugly and I want better data.", weight: { architect: 5 } },
      { label: "I want to make sure my family is protected.", weight: { steward: 5 } },
      { label: "I want to get on the same page as my partner.", weight: { collaborator: 5 } },
      { label: "I want to finally sort my sh*t out.", weight: { ascender: 5 } },
    ]
  }
];

const ARCHETYPES = {
  architect: {
    title: "The Architect",
    subtitle: "Optimisation • Efficiency • Control",
    desc: "You treat wealth as an engineering problem. Your dashboard prioritises raw data, tax efficiency, and performance metrics.",
    icon: Brain, color: "text-indigo-400", bg: "bg-indigo-500", border: "border-indigo-500"
  },
  steward: {
    title: "The Steward",
    subtitle: "Legacy • Security • Longevity",
    desc: "You are building a dynasty. Your dashboard focuses on estate planning, insurance coverage, and multi-generational horizons.",
    icon: Shield, color: "text-emerald-400", bg: "bg-emerald-500", border: "border-emerald-500"
  },
  collaborator: {
    title: "The Collaborator",
    subtitle: "Harmony • Fairness • Transparency",
    desc: "For you, money is a team sport. Your dashboard highlights shared goals, contribution balance, and communication tools.",
    icon: Users, color: "text-rose-400", bg: "bg-rose-500", border: "border-rose-500"
  },
  ascender: {
    title: "The Ascender",
    subtitle: "Growth • Momentum • Lifestyle",
    desc: "High income, high speed. Your dashboard tracks burn rate, savings velocity, and liquidity runway.",
    icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500", border: "border-amber-500"
  },
};

// --- Components ---

const OptionButton = ({ option, index, onClick, isSelected, lowMotion, isMobile }) => (
  <motion.button
    initial={isMobile ? false : (lowMotion ? { opacity: 0 } : { opacity: 0, x: -10 })}
    animate={isMobile ? false : (lowMotion ? { opacity: 1 } : { opacity: 1, x: 0 })}
    transition={isMobile ? { duration: 0 } : {
      delay: lowMotion ? 0 : index * 0.05,
      duration: 0.2,
      ease: 'easeOut',
    }}
    onClick={onClick}
    className={`group relative w-full flex items-center gap-4 p-5 rounded-2xl border text-left transition-all duration-200 ${isSelected
      ? 'bg-white/10 border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.1)]'
      : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/60 hover:border-white/10'
      }`}
  >
    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-bold transition-colors ${isSelected
      ? 'bg-white text-slate-900 border-white'
      : 'bg-white/5 text-slate-500 border-white/10 group-hover:border-white/30 group-hover:text-white'
      }`}>
      {index + 1}
    </div>

    <span className={`text-sm font-medium transition-colors ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'
      }`}>
      {option.label}
    </span>

    {isSelected && (
      <motion.div
        layoutId="check"
        className="absolute right-5 text-emerald-400"
      >
        <Check size={20} />
      </motion.div>
    )}
  </motion.button>
);

const AnalyzingScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center text-center space-y-8"
    >
      <div className="relative h-32 w-32">
        {/* Spinning Rings */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border-4 border-b-emerald-500 border-l-transparent border-t-transparent border-r-transparent"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />

        {/* Central Pulse */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 bg-white/10 rounded-full animate-pulse" />
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Processing Responses</h2>
        <p className="text-slate-400 text-sm typing-effect">Calibrating your financial identity...</p>
      </div>
    </motion.div>
  );
};

// --- Support Modal ---
const SupportModal = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-teal-500/20 bg-slate-900 shadow-2xl"
        >
          <div className="bg-gradient-to-br from-teal-900/20 to-slate-900 p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <HeartHandshake size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-display">You Are Not Alone</h3>
                  <p className="text-xs text-teal-200/70 uppercase tracking-wider font-bold">Support Resources</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed mb-8 border-l-2 border-teal-500/50 pl-4">
              "We at Nest understand that fighting debt or financial stress can be isolating.
              Please remember there are free, confidential resources available to you.
              There is always someone willing to help."
            </p>

            <div className="space-y-6">
              {/* Debt Help */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Debt Advice (Free & Confidential)</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <a href="https://www.stepchange.org/" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-teal-500/30 transition-all group">
                    <Globe size={18} className="text-teal-400" />
                    <span className="text-sm font-bold text-white group-hover:text-teal-200">StepChange</span>
                  </a>
                  <a href="https://nationaldebtline.org/" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-teal-500/30 transition-all group">
                    <Phone size={18} className="text-teal-400" />
                    <span className="text-sm font-bold text-white group-hover:text-teal-200">National Debtline</span>
                  </a>
                </div>
              </div>

              {/* Mental Health */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mental Health Support</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <a href="https://www.samaritans.org/" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-rose-500/30 transition-all group">
                    <Phone size={18} className="text-rose-400" />
                    <span className="text-sm font-bold text-white group-hover:text-rose-200">Samaritans</span>
                  </a>
                  <a href="https://giveusashout.org/" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-indigo-500/30 transition-all group">
                    <MessageCircle size={18} className="text-indigo-400" />
                    <span className="text-sm font-bold text-white group-hover:text-indigo-200">Shout (Text 85258)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default function ArchetypeQuiz({ onComplete }) {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({ architect: 0, steward: 0, collaborator: 0, ascender: 0 });
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selection, setSelection] = useState(null);
  const [showSupport, setShowSupport] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const lowMotion = prefersReducedMotion;
  const [hasMounted, setHasMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleAnswer = (weights, index) => {
    setSelection(index);

    // Delay to show selection state
    setTimeout(() => {
      const newScores = { ...scores };
      Object.entries(weights).forEach(([key, val]) => newScores[key] += val);
      setScores(newScores);
      setSelection(null);

      if (step < QUESTIONS.length - 1) {
        setStep(step + 1);
      } else {
        setIsAnalyzing(true);
      }
    }, 350);
  };

  const finalizeResult = () => {
    const winner = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    setResult(winner);
    setIsAnalyzing(false);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (result || isAnalyzing || showSupport) return;
      const key = parseInt(e.key);
      if (key > 0 && key <= QUESTIONS[step].options.length) {
        handleAnswer(QUESTIONS[step].options[key - 1].weight, key - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, result, isAnalyzing, showSupport]);

  const Archetype = result ? ARCHETYPES[result] : null;

  // Progress Calculation
  const progress = ((step) / QUESTIONS.length) * 100;

  if (!hasMounted) return null;

  return (
    <div className="flex min-h-[100dvh] items-start md:items-center justify-center bg-[#020617] text-slate-200 p-4 md:p-6 relative overflow-hidden selection:bg-indigo-500/30">

      {/* Support Modal */}
      <SupportModal isOpen={showSupport} onClose={() => setShowSupport(false)} />

      {/* Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 opacity-30" />
      <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-xl relative z-10 flex flex-col justify-center py-8 md:py-0 min-h-[550px] md:min-h-[600px]">
        <AnimatePresence mode="wait">

          {/* 1. QUESTION PHASE */}
          {!result && !isAnalyzing && (
            <div
              key={step}
              className="space-y-8"
            >
              {/* Progress Bar */}
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">
                  <span>Question {step + 1} of {QUESTIONS.length}</span>
                  <span>Diagnosis Mode</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight">
                  {QUESTIONS[step].question}
                </h2>
              </div>

              <div className="space-y-3">
                {QUESTIONS[step].options.map((opt, i) => (
                  <OptionButton
                    key={i}
                    index={i}
                    option={opt}
                    isSelected={selection === i}
                    lowMotion={lowMotion}
                    isMobile={isMobile}
                    onClick={() => handleAnswer(opt.weight, i)}
                  />
                ))}
              </div>

              <div className="hidden md:flex pt-4 items-center gap-4 text-[10px] text-slate-600 uppercase tracking-widest">
                <div className="flex gap-1">
                  <span className="w-5 h-5 border border-slate-800 rounded flex items-center justify-center">1</span>
                  <span className="w-5 h-5 border border-slate-800 rounded flex items-center justify-center">2</span>
                  <span className="w-5 h-5 border border-slate-800 rounded flex items-center justify-center">3</span>
                  <span className="w-5 h-5 border border-slate-800 rounded flex items-center justify-center">4</span>
                </div>
                <span>Key Press Select</span>
              </div>
            </div>
          )}

          {/* 2. ANALYZING PHASE */}
          {isAnalyzing && (
            <AnalyzingScreen onFinish={finalizeResult} />
          )}

          {/* 3. RESULT PHASE */}
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="relative inline-block mb-8">
                <div className={`absolute inset-0 ${Archetype.bg}/20 blur-3xl rounded-full`} />
                <div className={`relative h-32 w-32 rounded-full flex items-center justify-center ${Archetype.bg}/10 border-2 ${Archetype.border} shadow-2xl`}>
                  <Archetype.icon size={56} className={Archetype.color} />
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">Archetype Identified</p>
                <h2 className="text-5xl font-display font-bold text-white mb-2 tracking-tight">
                  {Archetype.title}
                </h2>
                <p className={`text-sm font-medium ${Archetype.color} mb-8 uppercase tracking-widest`}>
                  {Archetype.subtitle}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-900/50 rounded-2xl p-8 border border-white/10 mb-8 backdrop-blur-sm"
              >
                <p className="text-slate-300 leading-relaxed text-sm">
                  {Archetype.desc}
                </p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={() => onComplete(result)}
                className="group relative w-full py-4 rounded-2xl bg-white text-slate-950 font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative flex items-center justify-center gap-2">
                  Enter Dashboard <ArrowRight size={16} />
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hardship Support Button (Always Visible) */}
      <motion.button
        onClick={() => setShowSupport(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-20 p-3.5 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-teal-300 hover:border-teal-500/50 hover:bg-teal-500/10 transition-all shadow-2xl"
        title="Support Resources"
      >
        <HeartHandshake size={24} />
      </motion.button>

    </div>
  );
}
