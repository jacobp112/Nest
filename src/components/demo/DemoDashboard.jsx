import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid, Target, PieChart, LogOut, CheckCircle2, X,
  Coffee, Shield, Users, Menu, Sparkles
} from 'lucide-react';

// Imports
import AccountsNetWorthView from '../../pages/AccountsNetWorthView.jsx';
import GoalsCenterView from '../../pages/GoalsCenterView.jsx';
import ReportingHubView from '../../pages/ReportingHubView.jsx';
import RitualsView from '../../pages/RitualsView.jsx';
import VaultView from '../../pages/VaultView.jsx';
import VisionPage from '../../pages/VisionPage.jsx';
import FamilyView from '../../pages/views/FamilyView.jsx';
import ArchetypeQuiz from './ArchetypeQuiz';
import PersonaSwitcher from './PersonaSwitcher';

// Persona Dashboards
import DebtDestroyerView from '../../pages/DebtDestroyerView.jsx';
import PropertyTycoonView from '../../pages/PropertyTycoonView.jsx';
import ArchitectView from '../../pages/ArchitectView.jsx';
import CollaboratorView from '../../pages/CollaboratorView.jsx';

// --- TABS ---
const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'insights', label: 'Insights', icon: PieChart },
  { id: 'rituals', label: 'Rituals', icon: Coffee },
  { id: 'vault', label: 'The Vault', icon: Shield },
  { id: 'family', label: 'Family', icon: Users },
  { id: 'vision', label: 'Vision', icon: Sparkles },
];

// --- DATA ---
const DATA_PROFILES = {
  architect: {
    netWorth: 245000,
    accounts: [
      { id: '1', name: 'Trading 212', balance: 145000, type: 'investment', provider: 'Trading 212' },
      { id: '2', name: 'Coinbase', balance: 42000, type: 'investment', provider: 'Coinbase' },
      { id: '3', name: 'Amex Platinum', balance: -1200, type: 'liability', provider: 'Amex' },
    ],
    goals: [
      { id: '1', name: 'Financial Independence', target: 1000000, current: 245000, deadline: '2035-01-01', color: 'indigo', isAhead: true },
    ],
    toast: "Tax-Loss Harvesting Opportunity detected"
  },
  steward: {
    netWorth: 1250000,
    accounts: [
      { id: '1', name: 'Main Residence', balance: 850000, type: 'asset', provider: 'Zoopla' },
      { id: '2', name: 'Family Trust', balance: 400000, type: 'asset', provider: 'Coutts' },
      { id: '3', name: 'Mortgage', balance: -350000, type: 'liability', provider: 'Barclays' },
    ],
    goals: [
      { id: '1', name: 'Uni Fund (Leo)', target: 60000, current: 45000, deadline: '2028-09-01', color: 'emerald', isAhead: true },
    ],
    toast: "Estate Plan backup verified"
  },
  collaborator: {
    netWorth: 42000,
    accounts: [
      { id: '1', name: 'Joint Monzo', balance: 2450, type: 'asset', provider: 'Monzo' },
      { id: '2', name: 'Joint Savings', balance: 12000, type: 'asset', provider: 'Starling' },
    ],
    goals: [
      { id: '1', name: 'Wedding', target: 25000, current: 12000, deadline: '2025-06-01', color: 'rose', isAhead: false },
      { id: '2', name: 'Honeymoon', target: 5000, current: 1500, deadline: '2025-07-01', color: 'amber', isAhead: true },
    ],
    toast: "Partner commented on 'Waitrose' transaction"
  },
  ascender: {
    netWorth: -15000,
    accounts: [
      { id: '1', name: 'Current Account', balance: 8500, type: 'asset', provider: 'HSBC' },
      { id: '2', name: 'Student Loan', balance: -24000, type: 'liability', provider: 'SLC' },
    ],
    goals: [
      { id: '1', name: 'Debt Free', target: 24000, current: 4000, deadline: '2026-01-01', color: 'rose', isAhead: true },
    ],
    toast: "Spending Alert: 15% above burn rate"
  }
};



// --- FIX: Component Moved Outside ---
// This ensures React doesn't re-mount it on every render,
// allowing Framer Motion to track the position correctly.
const TabButton = ({ tab, isActive, onClick, isDrawer = false }) => {
  return (
    <button
      onClick={onClick}
      className={`relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all z-10 ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
        } ${isDrawer ? 'text-base' : ''}`}
    >
      {isActive && (
        <motion.div
          layoutId="activeTab" // This ID links the animation between buttons
          className="absolute inset-0 bg-indigo-600 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] -z-10"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      <tab.icon size={18} className={isActive ? 'text-white' : 'text-slate-500'} />
      <span className="truncate relative z-10">{tab.label}</span>
    </button>
  );
};

export default function DemoDashboard({ onExit, initialTab = 'overview', initialPersona = 'architect', showIntro = true }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(showIntro);
  const [toast, setToast] = useState(null);

  // Persona State
  const [quizComplete, setQuizComplete] = useState(false);
  const [persona, setPersona] = useState(initialPersona);

  const data = DATA_PROFILES[persona] || DATA_PROFILES.architect;

  useEffect(() => {
    if (quizComplete) {
      const timer = setTimeout(() => setShowWelcome(false), 2200);
      setTimeout(() => showToast(data.toast), 4000);
      return () => clearTimeout(timer);
    }
  }, [quizComplete, persona, data.toast]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    if (initialPersona && !showIntro) {
      setQuizComplete(true);
      setPersona(initialPersona);
    }
  }, [initialPersona, showIntro]);

  // --- 1. RENDER QUIZ IF NOT COMPLETE ---
  if (!quizComplete && showIntro) {
    return (
      <ArchetypeQuiz onComplete={(result) => {
        setPersona(result);
        setQuizComplete(true);
        setShowWelcome(true);
      }} />
    );
  }

  // --- 2. MAIN DASHBOARD CONTENT ---
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        if (persona === 'ascender') return <DebtDestroyerView onInteract={showToast} />;
        if (persona === 'steward') return <PropertyTycoonView onInteract={showToast} />;
        if (persona === 'architect') return <ArchitectView onInteract={showToast} />;
        if (persona === 'collaborator') return <CollaboratorView onInteract={showToast} />;
        return <AccountsNetWorthView accounts={data.accounts} transactions={[]} onInteract={showToast} onChangeTab={setActiveTab} />;
      case 'goals':
        return <GoalsCenterView goals={data.goals} monthlySavings={500} isPremium onInteract={showToast} />;
      case 'insights':
        return <ReportingHubView budgets={[]} transactions={[]} onInteract={showToast} />;
      case 'rituals':
        return <RitualsView onInteract={showToast} />;
      case 'vault':
        return <VaultView onInteract={showToast} />;
      case 'family':
        return <FamilyView onInteract={showToast} />;
      case 'vision':
        return <VisionPage />;
      default: return null;
    }
  };

  return (
    <div className="flex h-full bg-[#020617] text-slate-200 overflow-hidden relative selection:bg-indigo-500/30">

      {/* CINEMATIC BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        {/* Ambient Spotlights */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Welcome Overlay */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-[100] flex items-center justify-center bg-[#020617]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <div className="h-20 w-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto border border-indigo-500/20 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
                <div className="h-10 w-10 bg-indigo-500 rounded-full animate-pulse" />
              </div>
              <h2 className="text-3xl font-display font-bold text-white">
                Initializing {persona.charAt(0).toUpperCase() + persona.slice(1)}...
              </h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 ring-1 ring-black/50"
          >
            <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 size={16} />
            </div>
            <span className="text-sm text-white font-medium">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (Glassmorphic) */}
      <aside className="hidden w-72 flex-col border-r border-white/5 bg-slate-950/30 backdrop-blur-xl z-20 md:flex relative">
        <div className="p-8">
          <div className="flex items-center gap-3 font-display text-2xl font-bold text-white tracking-tight">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
            Nest
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-4">
          {TABS.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </nav>

        {/* Footer: Persona Switcher (Direction UP) */}
        {/* Z-20 ensures the popup menu renders ON TOP of the nav list above it */}
        <div className="p-6 border-t border-white/5 space-y-4 bg-slate-900/20 relative z-20">
          <PersonaSwitcher currentPersona={persona} onChange={setPersona} direction="up" />

          <button onClick={onExit} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-rose-400 transition-colors hover:bg-white/5">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-white/5 bg-slate-950/80 px-4 py-3 backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-2 font-display text-lg font-bold text-white">
          <div className="h-6 w-6 rounded-lg bg-indigo-500 shadow-lg" />
          Nest
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 rounded-lg bg-white/5 text-white hover:bg-white/10"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[85%] max-w-xs flex-col bg-slate-900 p-6 shadow-2xl border-r border-white/10"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="font-display text-xl font-bold text-white">Nest</div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Switcher: Direction DOWN */}
              <div className="mb-6 relative z-20">
                <PersonaSwitcher currentPersona={persona} onChange={setPersona} direction="down" />
              </div>

              <nav className="space-y-2 relative z-10">
                {TABS.map((tab) => (
                  <TabButton
                    key={tab.id}
                    tab={tab}
                    isActive={activeTab === tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    isDrawer
                  />
                ))}
              </nav>

              <div className="mt-auto pt-6 border-t border-white/5">
                <button onClick={onExit} className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/10 transition-colors">
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="relative flex-1 overflow-y-auto overflow-x-hidden z-10 pt-20 pb-10 md:pt-0 scrollbar-hide">
        <div className="px-4 py-8 md:p-10 mx-auto max-w-7xl min-h-full">

          {/* Header */}
          <header className="mb-8 flex items-end justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white font-display tracking-tight">
                {TABS.find(t => t.id === activeTab)?.label}
              </h1>
              <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Viewing as <span className="text-white font-bold capitalize">{persona}</span>
              </p>
            </div>
            <div className="hidden md:block">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                Live Preview
              </span>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${persona}`}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}