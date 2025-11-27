import React, { useMemo, useState, useEffect } from 'react';
import { ArrowRight, Plus, Rocket, Target, TrendingUp, Shield, Calendar, Sparkles, Check, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardCard } from '../components/DashboardCard.jsx';

// --- 1. Utilities & Formatters ---

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});
const formatCurrency = (value) => currencyFormatter.format(Number(value) || 0);

// --- 2. Premium Components ---

// Reusing the "Tactile" Slider
const SmartSlider = ({ value, min, max, step = 1, onChange, label, theme = 'emerald' }) => {
  const percentage = ((value - min) / (max - min)) * 100;

  const themeStyles = {
    emerald: { from: 'from-emerald-500', to: 'to-teal-400', border: 'border-emerald-500', shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]' },
    amber: { from: 'from-amber-500', to: 'to-orange-400', border: 'border-amber-500', shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]' },
    rose: { from: 'from-rose-500', to: 'to-pink-400', border: 'border-rose-500', shadow: 'shadow-[0_0_15px_rgba(244,63,94,0.5)]' },
    blue: { from: 'from-blue-500', to: 'to-indigo-400', border: 'border-blue-500', shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]' },
  };

  const s = themeStyles[theme] || themeStyles.emerald;

  return (
    <div className="space-y-3 select-none group">
      <div className="flex justify-between items-end">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider transition-colors group-hover:text-slate-300">{label}</label>
        <span className="text-white font-mono font-bold text-sm bg-slate-800 px-2 py-0.5 rounded border border-white/5">
          +£{value}
        </span>
      </div>
      <div className="relative h-6 flex items-center cursor-pointer">
        {/* Track */}
        <div className="absolute w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
          <div
            className={`h-full bg-gradient-to-r ${s.from} ${s.to} transition-all duration-100 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
        />
        <motion.div
          className={`absolute h-4 w-4 bg-white rounded-full ${s.shadow} border-2 ${s.border} pointer-events-none`}
          style={{ left: `calc(${percentage}% - 8px)` }}
          layoutId={`thumb-${label}`}
        />
      </div>
    </div>
  );
};

const GoalProgressCard = ({ goal, onInteract }) => {
  const [boostAmount, setBoostAmount] = useState(0);
  const progress = Math.min(100, (goal.current / goal.target) * 100);

  // Determine color theme
  // Determine color theme
  const theme = goal.color || 'emerald';
  const themeConfig = {
    emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-500/20' },
    amber: { text: 'text-amber-400', bg: 'bg-amber-500', border: 'border-amber-500/20' },
    blue: { text: 'text-blue-400', bg: 'bg-blue-500', border: 'border-blue-500/20' },
    rose: { text: 'text-rose-400', bg: 'bg-rose-500', border: 'border-rose-500/20' },
    indigo: { text: 'text-indigo-400', bg: 'bg-indigo-500', border: 'border-indigo-500/20' },
  };
  const t = themeConfig[theme] || themeConfig.emerald;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-md transition-all hover:border-white/20 shadow-xl"
    >
      {/* Ambient Background Glow */}
      <div className={`absolute -right-10 -top-10 h-40 w-40 rounded-full ${t.bg}/10 blur-[60px] transition-opacity opacity-40 group-hover:opacity-60`} />

      <div className="relative z-10 flex flex-col h-full justify-between space-y-6">

        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 ${t.bg}/10 ${t.text} shadow-inner`}>
              <Target size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-white transition-colors">{goal.name}</h3>
              <div className="mt-1 flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-400">
                <span>Target: <span className="text-slate-300 font-bold">{formatCurrency(goal.target)}</span></span>
              </div>
            </div>
          </div>
          {goal.isAhead && (
            <span className={`inline-flex items-center rounded-full border ${t.border} ${t.bg}/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${t.text} shadow-lg`}>
              On Track
            </span>
          )}
        </div>

        {/* Progress Visualization */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-3xl font-display font-bold text-white tracking-tight">
              {formatCurrency(goal.current)}
            </span>
            <span className={`text-sm font-bold ${t.text}`}>{Math.round(progress)}%</span>
          </div>

          {/* Liquid Bar */}
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-800 border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className={`h-full rounded-full bg-gradient-to-r from-${theme}-600 to-${theme}-400 shadow-[0_0_15px_rgba(255,255,255,0.2)]`}
            />
            {/* Stripes Texture Overlay */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]" />
          </div>

          <div className="flex justify-between text-[10px] text-slate-500 font-medium uppercase tracking-wider">
            <span>Start</span>
            <span>{new Date(goal.deadline).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Interactive Boost Section */}
        <div className="pt-4 border-t border-white/5">
          {boostAmount === 0 ? (
            <div
              onClick={() => setBoostAmount(50)}
              className="flex items-center justify-between cursor-pointer group/boost p-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <span className="text-xs text-slate-400 group-hover/boost:text-white transition-colors">Add one-off boost</span>
              <div className={`h-6 w-6 rounded-full ${t.bg}/20 flex items-center justify-center ${t.text}`}>
                <Plus size={14} />
              </div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <SmartSlider
                label="Boost Amount"
                value={boostAmount}
                min={0} max={500} step={10}
                onChange={setBoostAmount}
                theme={theme}
              />
              <button
                onClick={() => { onInteract(`Boosted ${goal.name} by £${boostAmount}`); setBoostAmount(0); }}
                className={`mt-3 w-full py-2 rounded-lg ${t.bg} hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all`}
              >
                Confirm Boost
              </button>
            </motion.div>
          )}
        </div>

      </div>
    </motion.div>
  );
};

// --- Main Component ---

const GoalsCenterView = ({
  goals = [],
  onInteract = () => { },
}) => {

  // Mock Data if none provided
  const activeGoals = goals.length > 0 ? goals : [
    { id: 1, name: 'House Deposit', target: 40000, current: 12500, deadline: '2026-08-01', color: 'emerald', isAhead: true },
    { id: 2, name: 'Wedding Fund', target: 15000, current: 4200, deadline: '2025-06-01', color: 'rose', isAhead: false },
    { id: 3, name: 'Emergency Fund', target: 10000, current: 8500, deadline: '2024-12-01', color: 'blue', isAhead: true },
  ];

  const totalSaved = useMemo(() => activeGoals.reduce((acc, curr) => acc + curr.current, 0), [activeGoals]);
  const totalTarget = useMemo(() => activeGoals.reduce((acc, curr) => acc + curr.target, 0), [activeGoals]);
  const totalProgress = (totalSaved / totalTarget) * 100;

  return (
    <div className="space-y-8 pb-20">

      {/* 1. Hero: Wealth Velocity */}
      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <DashboardCard className="relative overflow-hidden flex flex-col justify-center min-h-[240px] border-0 ring-1 ring-white/5 bg-slate-900/50 group">
          {/* Dynamic Background */}
          <div className="absolute right-0 top-0 -mt-10 -mr-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px] group-hover:bg-emerald-500/20 transition-colors duration-1000" />
          <div className="absolute left-0 bottom-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px]" />

          <div className="relative z-10 p-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                <Rocket size={24} />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">Total Momentum</p>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <h2 className="text-6xl font-display font-bold text-white tracking-tight">
                {formatCurrency(totalSaved)}
              </h2>
              <span className="text-xl text-slate-500 font-medium">/ {formatCurrency(totalTarget)}</span>
            </div>

            {/* Global Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                <span>Overall Completion</span>
                <span className="text-white">{totalProgress.toFixed(1)}%</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${totalProgress}%` }}
                  transition={{ duration: 2, ease: "circOut" }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                />
              </div>
              <p className="mt-3 text-sm text-slate-400">
                You are saving <span className="text-white font-bold">£1,250/mo</span>. At this rate, you will hit your targets <strong>2 months early</strong>.
              </p>
            </div>
          </div>
        </DashboardCard>

        {/* Life Events Teaser */}
        <DashboardCard
          className="relative overflow-hidden flex flex-col items-center justify-center text-center border-dashed border-white/10 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all cursor-pointer group"
          onClick={() => onInteract("Life Event Wizard")}
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />

          <div className="relative z-10">
            <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/10">
              <Calendar size={28} />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Life Events</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-6 max-w-[180px] mx-auto">
              Planning a wedding, sabbatical, or baby? Create a complex timeline.
            </p>
            <span className="inline-flex items-center gap-2 text-[10px] font-bold text-amber-400 uppercase tracking-widest group-hover:gap-3 transition-all">
              Open Planner <ArrowRight size={12} />
            </span>
          </div>
        </DashboardCard>
      </div>

      {/* 2. Goals Grid */}
      <div>
        <div className="flex items-center justify-between px-2 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-emerald-500 rounded-full" />
            <h3 className="text-2xl font-bold text-white font-display">Active Goals</h3>
          </div>
          <button onClick={() => onInteract("Create New Goal")} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider transition-colors">
            <Plus size={14} /> New Goal
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeGoals.map((goal) => (
            <GoalProgressCard key={goal.id} goal={goal} onInteract={onInteract} />
          ))}

          {/* Add New Placeholder */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => onInteract("Create New Goal")}
            className="group relative flex min-h-[320px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-800 bg-slate-900/30 p-6 text-center transition-all hover:border-emerald-500/30 hover:bg-emerald-500/5 cursor-pointer"
          >
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-800 shadow-xl transition-all group-hover:scale-110 group-hover:bg-emerald-500/20 border border-white/5 group-hover:border-emerald-500/30">
              <Plus size={32} className="text-slate-500 transition-colors group-hover:text-emerald-400" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-300 group-hover:text-white transition-colors">Create New Goal</h3>
            <p className="max-w-[200px] text-xs text-slate-500 uppercase tracking-wider">
              Set a target and start saving
            </p>
          </motion.div>
        </div>
      </div>

    </div>
  );
};

export default GoalsCenterView;