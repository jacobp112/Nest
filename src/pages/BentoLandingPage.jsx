import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, MessageCircle, Instagram, Linkedin, Shield, Zap, Layout, Globe } from 'lucide-react';
import Starfield from '../components/experience/Starfield';

// --- REUSABLE BENTO CARD ---
const BentoCard = ({ children, className = "", onClick, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-[32px] border border-white/5 bg-slate-900/60 backdrop-blur-xl shadow-2xl cursor-pointer ${className}`}
    >
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 h-full p-6 md:p-8 flex flex-col justify-between">
        {children}
      </div>
    </motion.div>
  );
};

export default function BentoLandingPage({ onNavigate }) {

  const handleEnterApp = () => onNavigate('experience');
  const handleVision = () => onNavigate('vision');
  const handleFounder = () => onNavigate('founder');
  const openSocial = (url) => window.open(url, '_blank');

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-white overflow-y-auto selection:bg-emerald-500/30 font-sans">

      {/* BACKGROUND LAYER */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Starfield density={1500} speed={0.2} reducedMotion={false} />
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-emerald-900/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 flex flex-col items-center">

        {/* HEADER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24 flex flex-col items-center w-full"
        >
          {/* Tag */}
          <div className="mb-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-white/10 backdrop-blur-md shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Open Alpha</span>
          </div>

          {/* HERO ICON (Standalone SVG) */}
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-indigo-500/40 blur-[60px] rounded-full opacity-60 group-hover:opacity-80 transition-opacity duration-700" />

            {/* The Logo Geometry */}
            <div className="relative w-24 h-24 md:w-32 md:h-32 drop-shadow-2xl">
              <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="heroIconGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" className="stop-hero-a" stopColor="#34d399" />
                    <stop offset="50%" className="stop-hero-b" stopColor="#6366f1" />
                    <stop offset="100%" className="stop-hero-c" stopColor="#8b5cf6" />
                  </linearGradient>
                  <style>
                    {`
                                    @keyframes heroFlow {
                                        0% { stop-color: #34d399; }
                                        25% { stop-color: #3b82f6; }
                                        50% { stop-color: #8b5cf6; }
                                        75% { stop-color: #3b82f6; }
                                        100% { stop-color: #34d399; }
                                    }
                                    .stop-hero-a { animation: heroFlow 6s infinite linear; }
                                    .stop-hero-b { animation: heroFlow 6s infinite linear; animation-delay: -1.5s; }
                                    .stop-hero-c { animation: heroFlow 6s infinite linear; animation-delay: -3s; }
                                `}
                  </style>
                  <mask id="hero-icon-mask">
                    <rect x="0" y="0" width="100" height="100" rx="24" fill="white" />
                    <path d="M28 28V72H38L62 38V72H72V28H62L38 62V28H28Z" fill="black" />
                  </mask>
                </defs>
                <rect x="0" y="0" width="100" height="100" rx="24" fill="url(#heroIconGradient)" mask="url(#hero-icon-mask)" />

                {/* Subtle Inner Bevel/Border for pop */}
                <rect x="1" y="1" width="98" height="98" rx="23" stroke="white" strokeOpacity="0.1" strokeWidth="2" fill="none" />
              </svg>
            </div>
          </div>

          <p className="mt-12 text-slate-400 text-lg md:text-xl font-light max-w-lg mx-auto leading-relaxed">
            The operating system for your family's wealth.
            <span className="block mt-4 text-xs md:text-sm text-slate-500 font-normal opacity-80">
              Please Note: This Open Alpha is optimised for desktop. We are currently working on optimising mobile viewing.
            </span>
          </p>
        </motion.div>

        {/* BENTO GRID */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 auto-rows-[180px]">

          {/* 1. HERO TILE: ENTER APP */}
          <BentoCard
            className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-slate-900 via-slate-900 to-black border-emerald-500/30 hover:border-emerald-500/50 group"
            onClick={handleEnterApp}
            delay={0.1}
          >
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
              <Zap size={200} className="text-emerald-400" />
            </div>
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="mt-auto space-y-6 relative z-10">
              <div className="h-20 w-20 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <ArrowRight size={36} strokeWidth={3} />
              </div>
              <div>
                <h2 className="text-4xl font-display font-bold text-white mb-2">Launch Alpha</h2>
                <p className="text-emerald-200/60 font-medium">Enter the secure environment.</p>
              </div>
            </div>
          </BentoCard>

          {/* 2. VISION TILE */}
          <BentoCard
            className="md:row-span-2 bg-slate-900/60 hover:bg-indigo-900/20 hover:border-indigo-500/30"
            onClick={handleVision}
            delay={0.2}
          >
            <div className="flex flex-col h-full justify-between">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Sparkles size={20} />
              </div>
              <div className="space-y-2 mt-4">
                <h3 className="text-2xl font-display font-bold text-white">The Vision</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Why we are rebuilding family finance from first principles.
                </p>
              </div>
              <div className="w-full flex-1 mt-6 relative opacity-50 group-hover:opacity-80 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-indigo-500/10 to-transparent border-t border-indigo-500/20 rounded-t-xl" />
                <div className="absolute bottom-4 left-4 right-4 h-1 w-1/3 bg-indigo-500/40 rounded-full" />
                <div className="absolute bottom-8 left-4 right-8 h-1 w-1/2 bg-indigo-500/30 rounded-full" />
              </div>
            </div>
          </BentoCard>

          {/* 3. FOUNDER TILE */}
          <BentoCard
            className="md:col-span-1"
            onClick={handleFounder}
            delay={0.3}
          >
            <div className="flex justify-between items-start">
              <div className="h-12 w-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-lg font-display font-bold text-white shadow-lg">J</div>
              <MessageCircle size={20} className="text-slate-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Founder's Letter</h3>
              <p className="text-xs text-slate-400 mt-1">A message from Jacob.</p>
            </div>
          </BentoCard>

          {/* 4. INSTAGRAM */}
          <BentoCard
            className="hover:border-purple-500/40"
            onClick={() => openSocial('https://instagram.com/nest.financial.app')}
            delay={0.4}
          >
            <div className="flex justify-between items-start">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                <Instagram size={24} />
              </div>
              <ArrowRight size={16} className="text-slate-600 -rotate-45 group-hover:text-white transition-colors" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Instagram</h3>
              <p className="text-xs text-slate-400 mt-1">@nest.financial.app</p>
            </div>
          </BentoCard>

          {/* 5. LINKEDIN */}
          <BentoCard
            className="hover:border-blue-500/40"
            onClick={() => openSocial('https://linkedin.com/company/nest-financial-platform')}
            delay={0.5}
          >
            <div className="flex justify-between items-start">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <Linkedin size={24} />
              </div>
              <ArrowRight size={16} className="text-slate-600 -rotate-45 group-hover:text-white transition-colors" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">LinkedIn</h3>
              <p className="text-xs text-slate-400 mt-1">Company Updates</p>
            </div>
          </BentoCard>

          {/* 6. ARCHETYPES */}
          <BentoCard
            className="md:col-span-2 group"
            delay={0.6}
            onClick={handleEnterApp}
          >
            <div className="flex items-center gap-3 mb-6">
              <Layout size={20} className="text-slate-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">The Wealth OS</span>
            </div>
            <div className="flex gap-2 w-full">
              {['Architect', 'Steward', 'Ascender', 'Collaborator'].map((role, i) => (
                <div key={i} className="flex-1 py-3 px-2 rounded-xl bg-white/5 border border-white/5 text-center transition-colors hover:bg-white/10">
                  <span className="text-[10px] md:text-xs uppercase font-bold text-slate-300 block truncate">{role}</span>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* 7. SECURITY BADGE */}
          <BentoCard
            className="md:col-span-1 flex flex-col justify-center items-center text-center gap-2"
            onClick={() => onNavigate && onNavigate('security')}
            delay={0.7}
          >
            <Shield size={32} className="text-emerald-500/50 mb-2 group-hover:text-emerald-400 transition-colors" />
            <h3 className="text-sm font-bold text-slate-300">Bank-Grade Security</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Read-Only Access</p>
          </BentoCard>

        </div>

        {/* FOOTER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Globe size={14} className="text-slate-600" />
            <span className="text-slate-600 text-xs font-bold uppercase tracking-widest">London, UK</span>
          </div>
          <p className="text-slate-700 text-[10px] uppercase tracking-widest">
            © 2025 Phillips Holdings Ltd. All rights reserved.
          </p>
        </motion.div>

      </div>
    </div>
  );
}