import React, { useState, useEffect } from 'react';
import {
  PieChart,
  ArrowUpRight,
  ShoppingBag,
  Coffee,
  Bus,
  Zap,
  FileText,
  Loader2,
  Sparkles,
  Tag,
  AlertTriangle,
  Check,
  X,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardCard } from '../components/DashboardCard.jsx';

// --- 1. Premium Micro-Components ---

const formatCurrency = (value) => new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
}).format(Number(value) || 0);

// iOS-Style Sliding Segment Control
const TagFilter = ({ selectedTag, onSelectTag }) => {
  const tags = ['All', '#holiday', '#kids', '#pets', '#house', '#date-night'];

  return (
    <div className="flex gap-1 mb-8 overflow-x-auto pb-1 scrollbar-hide p-1 bg-slate-900/50 border border-white/5 rounded-full w-full max-w-full">
      {tags.map(tag => {
        const isActive = (tag === 'All' && selectedTag === null) || tag === selectedTag;
        return (
          <button
            key={tag}
            onClick={() => onSelectTag(tag === 'All' ? null : tag)}
            className={`relative px-4 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap z-10 ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTag"
                className="absolute inset-0 bg-indigo-600 rounded-full -z-10 shadow-lg shadow-indigo-900/50"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              {tag !== 'All' && <Tag size={10} className={isActive ? 'text-indigo-200' : 'text-slate-500'} />}
              {tag}
            </span>
          </button>
        );
      })}
    </div>
  );
};

// Glowing Neon Gauge
const NeonGauge = ({ percentage, color = 'emerald', size = 60 }) => {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const colors = {
    emerald: '#10b981',
    amber: '#f59e0b',
    rose: '#f43f5e'
  };
  const strokeColor = colors[color];

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Glow Filter */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id={`glow-${color}`}>
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <svg className="w-full h-full -rotate-90 overflow-visible" viewBox="0 0 40 40">
        {/* Track */}
        <circle cx="20" cy="20" r={radius} fill="none" stroke="#1e293b" strokeWidth="3" />
        {/* Progress */}
        <motion.circle
          cx="20" cy="20" r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeLinecap="round"
          filter={`url(#glow-${color})`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-[10px] font-bold text-white`}>{percentage}%</span>
      </div>
    </div>
  );
};

const SmoothAreaChart = () => (
  <div className="relative h-24 w-full overflow-hidden">
    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d="M0,50 L0,30 Q10,20 20,35 T40,25 T60,10 T80,20 T100,5 V50 Z"
        fill="url(#chartGradient)"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      />
      <motion.path
        d="M0,30 Q10,20 20,35 T40,25 T60,10 T80,20 T100,5"
        fill="none"
        stroke="#818cf8"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    </svg>
  </div>
);

// --- 2. Feature Components ---

const AIAnalyst = () => {
  const [text, setText] = useState('');
  const fullText = "Spending is up 12% vs last month, driven by a spike in 'Dining Out'. However, you are still £450 under your overall budget cap.";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative p-4 sm:p-5 rounded-3xl bg-slate-900 border border-indigo-500/30 overflow-hidden mb-8 group">
      {/* Alive Background Mesh */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" />

      <div className="relative z-10 flex gap-4">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white h-fit shadow-lg shadow-indigo-500/20">
          <Sparkles size={18} />
        </div>
        <div>
          <h4 className="font-bold text-white text-xs sm:text-sm mb-1 flex items-center gap-2">
            AI Executive Summary
            <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-[9px] text-indigo-300 font-mono border border-indigo-500/20">LIVE</span>
          </h4>
          <p className="text-xs sm:text-sm text-indigo-100/80 leading-relaxed font-mono">
            {text}<span className="animate-pulse text-indigo-400">_</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const BudgetRow = ({ budget, onInteract, selectedTag }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const percent = Math.min(100, (budget.spent / budget.limit) * 100);
  const isDanger = percent > 90;

  const getIcon = (cat) => {
    if (cat.includes('Grocer')) return <ShoppingBag size={18} />;
    if (cat.includes('Dining')) return <Coffee size={18} />;
    if (cat.includes('Transport')) return <Bus size={18} />;
    return <PieChart size={18} />;
  };

  return (
    <motion.div
      layout
      onClick={() => setIsExpanded(!isExpanded)}
      className={`group cursor-pointer overflow-hidden rounded-2xl border bg-slate-900/40 transition-all duration-300 ${isExpanded ? 'border-indigo-500/30 bg-slate-900 shadow-2xl' : 'border-white/5 hover:border-white/10 hover:bg-slate-800/50'
        }`}
    >
      <div className="p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-slate-800 text-slate-400 group-hover:text-white transition-colors`}>
            {getIcon(budget.category)}
          </div>
          <div>
            <p className="font-bold text-slate-200 group-hover:text-white transition-colors text-xs sm:text-sm">{budget.category}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${percent}%` }}
                  className={`h-full rounded-full ${isDanger ? 'bg-rose-500' : 'bg-emerald-500'}`}
                />
              </div>
              <span className="text-[10px] text-slate-500">{percent.toFixed(0)}%</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="font-mono font-bold text-white text-xs sm:text-sm">{formatCurrency(budget.spent)}</span>
          <div className="text-[10px] text-slate-500">of {formatCurrency(budget.limit)}</div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/5 bg-black/20 px-3 py-3 sm:px-4 sm:py-4"
          >
            {/* Mini Transactions List */}
            <div className="space-y-3 mb-4">
              {[1, 2].map((_, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span>{i === 0 ? 'Waitrose & Partners' : 'Tesco Express'}</span>
                  </div>
                  <span className="font-mono text-slate-400">-£{i === 0 ? '45.20' : '12.50'}</span>
                </div>
              ))}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onInteract(`Edit ${budget.category}`); }}
              className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-wider text-white transition-colors"
            >
              Manage Budget
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const InsightHeader = ({ scanStatus }) => (
  <div className="flex items-center justify-between px-1 mb-4">
    <h3 className="text-base sm:text-lg font-bold text-white">Insights</h3>
    <div className="flex items-center gap-2 bg-slate-900/80 px-2.5 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
      {scanStatus !== 'Analysis Complete' && <Loader2 size={10} className="animate-spin text-emerald-400" />}
      <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
        {scanStatus}
      </span>
    </div>
  </div>
);

const SubscriptionCard = ({ name, cost, onInteract }) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 hover:border-rose-500/20 transition-colors group">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 group-hover:scale-110 transition-transform">
        <Zap size={16} />
      </div>
      <div>
        <p className="text-xs font-bold text-rose-100">{name}</p>
        <p className="text-[10px] text-rose-300/70">Monthly Recurring</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-xs font-mono font-bold text-white mb-1">{cost}</p>
      <button
        onClick={(e) => { e.stopPropagation(); onInteract(`Cancel ${name}`) }}
        className="text-[9px] font-bold text-rose-400 hover:text-white uppercase tracking-wider"
      >
        Cancel?
      </button>
    </div>
  </div>
);

// --- Main View ---

const ReportingHubView = ({
  budgets = [],
  onInteract = () => { },
}) => {
  const [scanStatus, setScanStatus] = useState('Scanning...');
  const [selectedTag, setSelectedTag] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setScanStatus('Analysis Complete'), 2500);
    return () => clearTimeout(timer);
  }, []);

  const demoBudgets = budgets.length > 0 ? budgets : [
    { category: 'Groceries', spent: 450, limit: 600, color: 'emerald' },
    { category: 'Dining Out', spent: 180, limit: 200, color: 'amber' },
    { category: 'Transport', spent: 85, limit: 150, color: 'blue' },
    { category: 'Shopping', spent: 320, limit: 300, color: 'rose' },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 sm:space-y-8 pb-20 px-4 sm:px-6">

      {/* 1. Hero Stats */}
      <div className="grid gap-4 sm:gap-5 md:grid-cols-3 items-stretch">
        {/* Monthly Burn Card */}
        <DashboardCard className="col-span-2 relative overflow-hidden min-h-[200px] sm:min-h-[220px] flex flex-col justify-between border-0 ring-1 ring-white/5 bg-slate-900/50 group">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-indigo-600/20 blur-[100px] opacity-50 group-hover:opacity-70 transition-opacity" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-indigo-300">
                <FileText size={16} />
                <p className="text-xs font-bold uppercase tracking-widest">Monthly Burn Rate</p>
              </div>
              <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded-lg text-xs border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <ArrowUpRight size={12} /> 4.2% vs last month
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight mb-1">
              {formatCurrency(3420)}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">Projected to hit £3,800 by month end.</p>
          </div>

          {/* Animated Area Chart */}
          <div className="relative w-full opacity-70 mt-auto">
            <SmoothAreaChart />
          </div>
        </DashboardCard>

        {/* Quick Export Card */}
        <DashboardCard className="flex flex-col justify-center items-center text-center border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group cursor-pointer h-full" onClick={() => onInteract("Exporting PDF")}>
          <div className="mb-4 h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:scale-110 transition-all shadow-2xl border border-white/5">
            <FileText size={28} />
          </div>
          <h3 className="font-bold text-white mb-1">Export Report</h3>
          <p className="text-xs text-slate-500 mb-4 max-w-[140px] leading-relaxed">Download a compliant PDF summary for your accountant.</p>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Download PDF</span>
        </DashboardCard>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">

        {/* --- Left Column: Analysis --- */}
        <div className="lg:col-span-2">
          <AIAnalyst />

          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-base sm:text-lg font-bold text-white">Budget Breakdown</h3>
            <button onClick={() => onInteract('Add Budget')} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors">
              <Plus size={16} />
            </button>
          </div>

          <TagFilter selectedTag={selectedTag} onSelectTag={setSelectedTag} />

          <div className="space-y-3">
            {demoBudgets.map((budget, idx) => (
              <BudgetRow key={idx} budget={budget} onInteract={onInteract} selectedTag={selectedTag} />
            ))}
          </div>
        </div>

        {/* --- Right Column: Insights & Safety --- */}
        <div className="space-y-6">
          {/* Safe to Spend Widget */}
          <DashboardCard className="relative overflow-hidden border-0 ring-1 ring-white/5 bg-slate-900/50 p-4 sm:p-6">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide mb-1">Safe to Spend</h4>
                <p className="text-[10px] sm:text-xs text-slate-400">Daily allowance remaining</p>
                <div className="mt-3 text-xl sm:text-2xl font-mono font-bold text-emerald-400">£42.50</div>
              </div>
              <NeonGauge percentage={75} color="emerald" size={70} />
            </div>
          </DashboardCard>

          {/* Insights List */}
          <div>
            <InsightHeader scanStatus={scanStatus} />
            <div className="space-y-3">
              <div
                onClick={() => onInteract('Insight: Spike')}
                className="p-3 sm:p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 hover:border-amber-500/30 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:text-amber-300"><AlertTriangle size={18} /></div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-amber-100 mb-1">Spending Spike</h4>
                    <p className="text-[10px] sm:text-xs text-amber-200/60 leading-relaxed">Grocery spend is <strong>18% higher</strong> than usual this week.</p>
                  </div>
                </div>
              </div>

              {/* Subscription Killer */}
              <div className="p-3 sm:p-4 rounded-2xl bg-slate-950 border border-white/5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Recurring Detected</h4>
                <div className="space-y-2">
                  <SubscriptionCard name="Netflix" cost="£15.99" onInteract={onInteract} />
                  <SubscriptionCard name="Adobe Creative" cost="£19.99" onInteract={onInteract} />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReportingHubView;
