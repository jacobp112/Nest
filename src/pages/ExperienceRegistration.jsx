'use client';

import React, { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useMotionValue, useTransform, useReducedMotion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Keyboard, A11y } from 'swiper/modules';
import {
  ArrowRight, Check, ChevronRight, Lock, Users, Layers, Radar,
  ArrowUpRight, History, DraftingCompass, TrendingUp, ShieldCheck, Zap
} from 'lucide-react';

import BrowserChrome from '../components/BrowserChrome.jsx';
import 'swiper/css';
import 'swiper/css/pagination';

import Starfield from '../components/experience/Starfield.jsx';
import AdminLoginModal from '../components/AdminLoginModal.jsx';
import TopNav from '../components/TopNav.jsx';
import WaitlistWizard from './WaitlistWizard.jsx';

const GoalsCenterView = lazy(() => import('./GoalsCenterView'));
const ReportingHubView = lazy(() => import('./ReportingHubView'));
const ArchitectView = lazy(() => import('./ArchitectView'));
const CollaboratorView = lazy(() => import('./CollaboratorView'));

const productSlides = [
  {
    id: 'architect',
    slug: 'architect',
    title: 'The Architect View',
    description: 'See your entire financial life in one high-fidelity dashboard. Assets, liabilities, and net worth - visualised.',
    url: 'https://nest.finance/architect',
    items: [],
  },
  {
    id: 'rituals',
    slug: 'rituals',
    title: 'Shared Rituals',
    description: 'Build healthy financial habits together with guided monthly reviews and automated check-ins.',
    url: 'https://nest.finance/rituals',
    items: [],
  },
  {
    id: 'vision',
    slug: 'vision',
    title: 'Long-term Vision',
    description: 'Align on your 5, 10, and 20-year goals. Visualise your future and track progress towards your dreams.',
    url: 'https://nest.finance/vision',
    items: [],
  },
  {
    id: 'collaborator',
    slug: 'collaborator',
    title: 'Collaborator Mode',
    description: 'Seamlessly manage joint finances while maintaining individual privacy. The perfect balance for modern couples.',
    url: 'https://nest.finance/collaborator',
    items: [],
  },
];

const SLIDE_CONFIG = {
  architect: { tab: 'overview', persona: 'architect' },
  rituals: { tab: 'rituals', persona: 'collaborator' },
  vision: { tab: 'goals', persona: 'steward' },
  collaborator: { tab: 'overview', persona: 'collaborator' },
};

// --- ANIMATED TEXT COMPONENT ---
const AuroraText = ({ text = "reimagined.", className = "" }) => (
  <span className={`relative inline-flex flex-col ${className}`}>
    <span className="invisible opacity-0" aria-hidden="true">
      {text}
    </span>
    <svg
      className="absolute inset-0 w-full h-full overflow-visible select-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <style>
          {`
            @keyframes auroraFlowText {
              0% { stop-color: #34d399; }
              25% { stop-color: #3b82f6; }
              50% { stop-color: #8b5cf6; }
              75% { stop-color: #3b82f6; }
              100% { stop-color: #34d399; }
            }
            .stop-text-a { animation: auroraFlowText 6s infinite linear; }
            .stop-text-b { animation: auroraFlowText 6s infinite linear; animation-delay: -1.5s; }
            .stop-text-c { animation: auroraFlowText 6s infinite linear; animation-delay: -3s; }
          `}
        </style>
        <linearGradient id="textAuroraGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" className="stop-text-a" />
          <stop offset="50%" className="stop-text-b" />
          <stop offset="100%" className="stop-text-c" />
        </linearGradient>
      </defs>
      <text
        x="50%"
        y="55%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="url(#textAuroraGradient)"
        className="font-display font-bold"
        style={{ fontSize: 'inherit', fontFamily: 'inherit', fontWeight: 'inherit' }}
      >
        {text}
      </text>
    </svg>
  </span>
);

const HeroTitle = ({ onNavigate, onRequestAccess }) => (
  <div className="relative z-10 text-center space-y-8 max-w-5xl mx-auto pt-32 pb-24 px-6">
    <motion.h1
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
      className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-white tracking-tighter leading-[0.9]"
    >
      <span className="text-white">Family finance</span> <br />
      <AuroraText text="reimagined." className="pb-2 md:pb-4" />
    </motion.h1>

    <motion.p
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
      className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light"
    >
      Whether you are crushing debt, merging finances, or building a legacy – Nest aligns your money, goals, and relationships in one secure vault.
    </motion.p>

    <motion.div
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.5 }}
      className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
    >
      <button
        onClick={onRequestAccess}
        className="group relative px-8 py-4 rounded-full bg-white text-slate-950 font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)] overflow-hidden w-full sm:w-auto"
      >
        <span className="relative z-10">Request Access</span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-300 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      </button>
      <button
        onClick={() => onNavigate && onNavigate('demo', { showIntro: true })}
        className="group px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
      >
        <span>Live Demo</span>
        <ChevronRight size={14} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  </div>
);

const PainPointsSection = () => {
  return (
    <section className="relative py-24 md:py-32 px-4 md:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[50%] bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-screen-xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-md mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">The Governance Gap</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight leading-[1.1]"
          >
            You are running a Family Office. <br className="hidden md:block" />
            <span className="text-slate-500">Start acting like one.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto"
          >
            Wealth isn't built by tracking £4 coffees. It is built by aligning on a vision, identifying blind spots, and compounding good decisions over decades.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 relative group rounded-[2.5rem] border border-white/10 bg-slate-900/60 p-8 md:p-12 overflow-hidden hover:border-indigo-500/30 transition-colors duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
              <div className="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-slate-800 flex items-center justify-center border border-white/5 group-hover:scale-105 transition-transform duration-500">
                <Users className="w-8 h-8 md:w-10 md:h-10 text-indigo-400" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold text-white font-display">The "Solo CFO" Burden</h3>
                <p className="text-base md:text-lg text-slate-400 max-w-2xl leading-relaxed">
                  In most households, one partner carries the entire mental load of the finances while the other is left in the dark. This creates anxiety, bottlenecks, and misalignment.
                  <span className="block mt-2 text-indigo-300">Nest replaces the bottleneck with a transparent system of record.</span>
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative group rounded-[2.5rem] border border-white/10 bg-slate-900/60 p-8 md:p-10 overflow-hidden hover:border-emerald-500/30 transition-colors duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center border border-white/5">
                  <Radar className="w-7 h-7 text-emerald-400" />
                </div>
                <div className="flex items-center gap-2 opacity-60">
                  <History size={14} className="text-slate-500" />
                  <ArrowUpRight size={14} className="text-emerald-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white font-display mb-3">Rear-view Mirror Management</h3>
                <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                  Budgets tell you where you went. Wealth requires knowing where you are going. We replaced historical reporting with <span className="text-emerald-200">Monte-Carlo simulations</span> and forward-looking scenario planning.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative group rounded-[2.5rem] border border-white/10 bg-slate-900/60 p-8 md:p-10 overflow-hidden hover:border-blue-500/30 transition-colors duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center border border-white/5">
                  <Layers className="w-7 h-7 text-blue-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white font-display mb-3">The Fragmentation Tax</h3>
                <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                  Checking, savings, private equity, and liabilities are scattered across a dozen logins. You cannot optimise a picture you cannot see. Nest brings your <span className="text-blue-200">entire balance sheet</span> into one high-fidelity vault.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const BehaviouralModelling = () => {
  const [activeTab, setActiveTab] = useState('architect');

  const tabs = [
    {
      id: 'architect',
      label: 'The Architect',
      icon: DraftingCompass,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500',
      description: "Treats wealth as an engineering problem. The interface shifts to high-density data, focusing on tax efficiency and raw performance metrics.",
      features: ["XIRR & Alpha Benchmarking", "Tax-Wrap Efficiency", "Asset Allocation Sunbursts"]
    },
    {
      id: 'steward',
      label: 'The Steward',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500',
      description: "Focused on security and legacy. The dashboard highlights risk mitigation, insurance gaps, and multi-generational wealth horizons.",
      features: ["Estate & Inheritance Projection", "Risk 'Safe-Zone' Gauges", "Circle of Trust View"]
    },
    {
      id: 'collaborator',
      label: 'The Collaborator',
      icon: Users,
      color: 'text-amber-400',
      bg: 'bg-amber-500',
      description: "Money is a team sport. The UI transforms to prioritise fairness, contribution balancing, and conflict-free communication tools.",
      features: ["'Fair Share' Calculators", "Dream Board Visualisation", "Transaction Threads"]
    },
    {
      id: 'ascender',
      label: 'The Ascender',
      icon: TrendingUp,
      color: 'text-rose-400',
      bg: 'bg-rose-500',
      description: "High growth, high velocity. The experience gamifies debt destruction and focuses on cash flow runway and lifestyle momentum.",
      features: ["Avalanche vs Snowball Toggles", "Liquidity Runway Timers", "Aggressive Progress Bars"]
    },
  ];

  const activeContent = tabs.find(t => t.id === activeTab);

  return (
    <div className="w-full max-w-7xl mx-auto mb-40 px-4">
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
          The Behavioural Engine
        </h2>
        <p className="text-slate-400 text-lg leading-relaxed">
          Nest isn't a static database. It is a fluid operating system that reconfigures itself based on your psychological profile.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-4 flex flex-col gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 text-left ${activeTab === tab.id
                ? 'bg-slate-800 border-slate-700 shadow-xl'
                : 'bg-transparent border-transparent hover:bg-slate-900/50'
                }`}
            >
              <div className={`p-2 rounded-lg ${activeTab === tab.id ? `${tab.bg}/20 ${tab.color}` : 'bg-slate-800 text-slate-500'}`}>
                <tab.icon size={20} />
              </div>
              <div>
                <span className={`block font-bold text-sm ${activeTab === tab.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                  {tab.label}
                </span>
              </div>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeIndicator"
                  className={`absolute left-0 w-1 h-8 rounded-r-full ${tab.bg}`}
                />
              )}
            </button>
          ))}
        </div>

        <div className="lg:col-span-8 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="relative h-full rounded-[32px] border border-white/10 bg-slate-900/60 backdrop-blur-md overflow-hidden p-8 flex flex-col"
            >
              <div className={`absolute top-0 right-0 w-96 h-96 ${activeContent.bg} opacity-10 blur-[100px] pointer-events-none`} />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <activeContent.icon className={activeContent.color} size={32} />
                  <h3 className="text-2xl font-display font-bold text-white">{activeContent.label} Mode</h3>
                </div>
                <p className="text-lg text-slate-300 mb-8 max-w-2xl">
                  {activeContent.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Activated Modules</p>
                    {activeContent.features.map((feat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/50 border border-white/5"
                      >
                        <Zap size={14} className={activeContent.color} />
                        <span className="text-sm text-slate-200">{feat}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const MobileSafariFrame = ({ children, url }) => (
  <div
    className="relative w-full h-full bg-black rounded-[3rem] border-[8px] border-slate-900 overflow-hidden shadow-2xl ring-1 ring-white/10"
    style={{ willChange: 'transform', transform: 'translateZ(0)' }}
  >
    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-black rounded-b-xl z-50 flex items-center justify-center">
      <div className="w-16 h-1 bg-slate-900 rounded-full" />
    </div>
    <div className="absolute top-3 left-6 text-[10px] font-bold text-white z-40">9:41</div>
    <div className="absolute top-3 right-6 flex gap-1 z-40">
      <div className="w-4 h-2.5 border border-white/30 rounded-sm" />
    </div>
    <div className="absolute inset-0 pt-10 pb-20 bg-[#0B0F19] overflow-hidden">
      <div className="w-full h-full overflow-y-auto no-scrollbar" style={{ contain: 'strict' }}>
        {children}
      </div>
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#1c1c1e]/90 backdrop-blur-xl border-t border-white/5 flex flex-col items-center justify-start pt-3 px-6 z-50">
      <div className="w-full h-10 bg-[#2c2c2e] rounded-xl flex items-center justify-center gap-2 text-slate-400">
        <Lock size={10} />
        <span className="text-[10px] font-medium">{url.replace('https://', '')}</span>
      </div>
      <div className="w-32 h-1 bg-white/20 rounded-full mt-4" />
    </div>
  </div>
);

function ProductPreviewCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const DashboardSkeleton = () => (
    <div className="w-full h-full bg-[#0B0F19] flex items-center justify-center flex-col gap-4 animate-pulse">
      <div className="w-12 h-12 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      <div className="space-y-2 text-center">
        <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">Initializing Secure Environment...</p>
      </div>
    </div>
  );

  return (
    <div className="relative w-full max-w-[1400px] mx-auto px-4 md:px-6 py-16 md:py-32">
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_1.5fr] gap-12 items-center">
        <div className="w-full space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl md:text-6xl font-display font-bold text-white tracking-tight">Inside the OS</h2>
            <div className="h-1 md:h-1.5 w-16 md:w-24 bg-emerald-500 rounded-full mx-auto lg:mx-0" />
          </div>
          <div className="flex lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 no-scrollbar snap-x">
            {productSlides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setActiveIndex(idx)}
                className={`shrink-0 snap-center p-6 md:p-8 rounded-3xl border transition-all duration-500 text-left w-[280px] lg:w-full ${activeIndex === idx
                  ? 'bg-slate-900/80 border-emerald-500/30 shadow-2xl scale-105'
                  : 'bg-transparent border-transparent hover:bg-white/5 text-slate-500 opacity-60 hover:opacity-100'
                  }`}
              >
                <h3 className={`text-lg md:text-2xl font-bold mb-2 transition-colors ${activeIndex === idx ? 'text-white' : 'text-slate-400'}`}>
                  {slide.title}
                </h3>
                <p className={`text-sm md:text-base leading-relaxed transition-colors ${activeIndex === idx ? 'text-emerald-100/80' : 'text-slate-600'}`}>
                  {slide.description}
                </p>
              </button>
            ))}
          </div>
        </div>
        <div className="relative h-[500px] md:h-[700px] w-full perspective-[2000px]">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, rotateY: 5, x: 20 }}
            animate={{ opacity: 1, rotateY: 0, x: 0 }}
            transition={{ duration: 0.6, ease: "circOut" }}
            className="w-full h-full"
          >
            <MobileSafariFrame url={productSlides[activeIndex]?.url}>
              <Suspense fallback={<DashboardSkeleton />}>
                {activeIndex === 0 && <ArchitectView />}
                {activeIndex === 1 && <ReportingHubView />}
                {activeIndex === 2 && <GoalsCenterView />}
                {activeIndex === 3 && <CollaboratorView />}
              </Suspense>
            </MobileSafariFrame>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function ExperienceRegistration({ onNavigate, planContext }) {
  const [showWizard, setShowWizard] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const contactFormRef = useRef(null);
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { margin: "0px 0px 200px 0px" });
  const canSendContact = Boolean(contactSubject.trim() && contactMessage.trim());

  useEffect(() => {
    // Check context first
    if (planContext?.showWizard === false) {
      setShowWizard(false);
      return;
    }
    if (planContext?.plan) {
      setShowWizard(true);
      return;
    }
    if (planContext?.showWizard) {
      setShowWizard(true);
      return;
    }
    // Check URL params
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('plan')) {
        setShowWizard(true);
      } else {
        // Explicitly reset if no plan in context or URL
        setShowWizard(false);
      }
    }
  }, [planContext]);

  const handleContactSubmit = (event) => {
    event.preventDefault();
    if (!canSendContact) return;
    setContactSubject('');
    setContactMessage('');
  };

  const scrollToContact = () => {
    contactFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  if (showWizard) {
    return <WaitlistWizard onNavigate={onNavigate} planContext={planContext} />;
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-text-primary overflow-x-hidden selection:bg-emerald-500/30">
      <TopNav onNavigate={onNavigate} />

      <div className="fixed inset-0 z-0 pointer-events-none transform-gpu translate-z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/10 rounded-full blur-[80px] will-change-transform" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/10 rounded-full blur-[80px] will-change-transform" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <section ref={heroRef} className="relative min-h-screen overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-slate-950" />
        <div className="absolute inset-0 opacity-100">
          {isHeroInView && (
            <Starfield density={900} speed={0.35} reducedMotion={false} />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-transparent to-slate-950" />
        <div className="relative z-10">
          <HeroTitle onNavigate={onNavigate} onRequestAccess={() => setShowWizard(true)} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none z-20" />
      </section>

      <div className="relative z-10">
        <PainPointsSection />
        <div className="mt-12 md:mt-20">
          <BehaviouralModelling />
        </div>
      </div>

      <motion.section
        id="product-preview"
        className="relative z-10 min-h-[50vh] py-16 md:py-24"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <ProductPreviewCarousel />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex justify-center mt-4"
          >
            <button
              onClick={() => onNavigate && onNavigate('demo', { showIntro: true })}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-slate-900/80 border border-white/10 hover:border-emerald-500/50 hover:bg-slate-900 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300 backdrop-blur-md"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-slate-200 group-hover:text-white transition-colors">
                See Our Live Preview
              </span>
              <ArrowRight size={14} className="text-emerald-400 transition-transform duration-300 group-hover:translate-x-1" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
            </button>
          </motion.div>
        </div>
      </motion.section>

      <footer className="relative z-10 mt-12 border-t border-white/5 bg-slate-950 py-12">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start">
            <div className="space-y-2 text-xs leading-relaxed text-slate-400">
              <p>© 2025 Nest Finance</p>
              <p>A platform wholly owned and operated by Phillips Holdings Ltd (registered in england and wales).</p>
              <p>Nest cannot move or withdraw your funds. Open banking access is consent-based and read-only by default.</p>
            </div>
            <div ref={contactFormRef} className="space-y-3">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.6em] text-slate-400">Contact</p>
              <form onSubmit={handleContactSubmit} className="space-y-3">
                <label htmlFor="footer-subject" className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Subject
                </label>
                <input
                  id="footer-subject"
                  type="text"
                  value={contactSubject}
                  onChange={(event) => setContactSubject(event.target.value)}
                  placeholder="Subject"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
                <label htmlFor="footer-message" className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Message
                </label>
                <textarea
                  id="footer-message"
                  rows={3}
                  value={contactMessage}
                  onChange={(event) => setContactMessage(event.target.value)}
                  placeholder="Share a question or request"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 resize-none"
                />
                <button
                  type="submit"
                  disabled={!canSendContact}
                  className="w-full rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-slate-950 transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-slate-400">
            <button type="button" onClick={() => onNavigate && onNavigate('security')} className="transition hover:text-white">security</button>
            <span className="text-white/30">|</span>
            <button type="button" onClick={() => onNavigate && onNavigate('privacy')} className="transition hover:text-white">privacy policy</button>
            <span className="text-white/30">|</span>
            <button type="button" onClick={() => onNavigate && onNavigate('terms')} className="transition hover:text-white">terms &amp; conditions</button>
            <span className="text-white/30">|</span>
            <button type="button" onClick={scrollToContact} className="transition hover:text-white">contact</button>
          </div>
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setShowAdminLogin(true)}
              className="text-[10px] font-bold uppercase tracking-widest text-slate-800 hover:text-slate-500 transition-colors mt-2"
            >
              ADMIN PORTAL
            </button>
          </div>
        </div>
      </footer>
      <AnimatePresence>
        {showAdminLogin && (
          <AdminLoginModal
            onClose={() => setShowAdminLogin(false)}
            onLoginSuccess={() => onNavigate && onNavigate('admin_email')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
