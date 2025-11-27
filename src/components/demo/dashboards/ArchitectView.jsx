import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Brain,
  ShieldCheck,
  RefreshCw,
  X,
  ChevronRight,
  Sparkles,
  Zap,
  Lock,
  Search
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { DashboardCard } from '../../DashboardCard.jsx'; // Ensure this path is correct

// --- 1. Utility & Formatters ---

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat('en-GB', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

const formatCurrency = (val) => currencyFormatter.format(val);
const formatPercent = (val) => percentFormatter.format(val);

// --- 2. Micro-Components ---

// A tactile, custom slider component instead of the default HTML input
const SmartSlider = ({ value, min, max, onChange, label }) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3 select-none">
      <div className="flex justify-between items-end">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</label>
        <span className="text-white font-mono font-bold text-lg">{value} Years</span>
      </div>
      <div className="relative h-6 flex items-center group cursor-pointer">
        {/* Track Background */}
        <div className="absolute w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
           <div
             className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-100 ease-out"
             style={{ width: `${percentage}%` }}
           />
        </div>
        {/* Thumb */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
        />
        <motion.div
          className="absolute h-5 w-5 bg-white rounded-full shadow-lg border-2 border-indigo-500 pointer-events-none"
          style={{ left: `calc(${percentage}% - 10px)` }}
          layoutId="sliderThumb"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      </div>
    </div>
  );
};

// Custom Chart Tooltip for a "Glass" effect
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-3 rounded-xl shadow-2xl ring-1 ring-black/50">
        <p className="text-slate-400 text-xs font-bold mb-1">{label}</p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className={entry.name === 'Portfolio' ? 'text-white font-bold' : 'text-slate-400'}>
                {entry.name}: {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// --- 3. Complex Visualizations ---

const TaxSunburst = ({ data, activeId, onHover }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -Math.PI / 2;

  return (
    <div className="relative w-64 h-64 flex items-center justify-center group">
      {/* Ambient Glow behind the chart */}
      <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />

      <svg width="100%" height="100%" viewBox="0 0 200 200" className="overflow-visible z-10">
        {data.map((item) => {
          const angle = (item.value / total) * 2 * Math.PI;
          const startAngle = currentAngle;
          const endAngle = startAngle + angle;
          currentAngle = endAngle;

          // Arc Math
          const r = 90;
          const x1 = 100 + r * Math.cos(startAngle);
          const y1 = 100 + r * Math.sin(startAngle);
          const x2 = 100 + r * Math.cos(endAngle);
          const y2 = 100 + r * Math.sin(endAngle);
          const largeArc = angle > Math.PI ? 1 : 0;
          const pathData = `M 100 100 L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

          const isActive = activeId === item.id;
          const isDimmed = activeId && !isActive;

          return (
            <motion.path
              key={item.id}
              d={pathData}
              fill={item.color}
              stroke="rgba(15, 23, 42, 1)"
              strokeWidth="2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: isActive ? 1.1 : 1,
                opacity: isDimmed ? 0.3 : 1,
                pathLength: 1
              }}
              transition={{ duration: 0.3 }}
              onMouseEnter={() => onHover(item.id)}
              onMouseLeave={() => onHover(null)}
              className="cursor-pointer hover:filter hover:brightness-110"
            />
          );
        })}
        {/* Inner cutout to make it a Donut */}
        <circle cx="100" cy="100" r="60" fill="#0f172a" />
      </svg>

      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
        <AnimatePresence mode="wait">
          {activeId ? (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-center"
            >
              <div className="text-[10px] uppercase tracking-widest text-slate-400">Allocation</div>
              <div className="text-2xl font-bold text-white">{formatPercent(data.find(d => d.id === activeId).value / total)}</div>
              <div className="text-xs text-indigo-400 font-medium mt-1">{data.find(d => d.id === activeId).name}</div>
            </motion.div>
          ) : (
             <motion.div
              key="total"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-center"
            >
              <div className="text-[10px] uppercase tracking-widest text-slate-500">Total Assets</div>
              <div className="text-2xl font-bold text-white">{formatCurrency(total)}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- 4. Main Component ---

export default function ArchitectView({ onInteract = () => {} }) {
  // State
  const [activeAssetId, setActiveAssetId] = useState(null);
  const [projectionYears, setProjectionYears] = useState(20);
  const [benchmark, setBenchmark] = useState('S&P 500');
  const [showRebalanceModal, setShowRebalanceModal] = useState(false);
  const [aiQuery, setAiQuery] = useState('');

  // Data
  const assetData = useMemo(() => [
    { id: 'vanguard', name: 'S&P 500 Index', value: 80000, type: 'Equity', color: '#6366f1' }, // Indigo-500
    { id: 'tech', name: 'Nasdaq Tech', value: 30000, type: 'Thematic', color: '#8b5cf6' }, // Violet-500
    { id: 'crypto', name: 'Bitcoin', value: 5000, type: 'Crypto', color: '#ec4899' }, // Pink-500
    { id: 'cash', name: 'GBP Cash', value: 5000, type: 'Liquidity', color: '#94a3b8' }, // Slate-400
  ], []);

  const performanceData = [
    { month: 'Jan', portfolio: 40000, benchmark: 40000 },
    { month: 'Mar', portfolio: 42500, benchmark: 41200 },
    { month: 'Jun', portfolio: 48000, benchmark: 44000 },
    { month: 'Sep', portfolio: 47000, benchmark: 45000 },
    { month: 'Dec', portfolio: 52000, benchmark: 48500 },
  ];

  // Logic: Fee Calculator (Memoized)
  const feeAnalysis = useMemo(() => {
    const principal = 50000;
    const rate = 0.07;
    const legacyFee = 0.015; // 1.5%
    const newFee = 0.002; // 0.2%

    const fvLegacy = principal * Math.pow(1 + (rate - legacyFee), projectionYears);
    const fvNew = principal * Math.pow(1 + (rate - newFee), projectionYears);

    return {
      legacyVal: fvLegacy,
      newVal: fvNew,
      savings: fvNew - fvLegacy,
    };
  }, [projectionYears]);

  return (
    <div className="relative min-h-screen text-slate-200 selection:bg-indigo-500/30">

      {/* Rebalance Modal Overlay */}
      <AnimatePresence>
        {showRebalanceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowRebalanceModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900 border border-indigo-500/20 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">Optimize Tax Wrappers</h3>
                    <p className="text-indigo-100 text-sm mt-1">Move £4,000 from GIA to ISA</p>
                  </div>
                  <button onClick={() => setShowRebalanceModal(false)} className="bg-white/20 p-1 rounded-full hover:bg-white/30 transition">
                    <X size={18} />
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              </div>
              <div className="p-8 space-y-6">
                 <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-rose-400">
                             <ArrowUpRight className="rotate-45" size={20} />
                        </div>
                        <div>
                            <div className="text-slate-400">Sell (Taxable)</div>
                            <div className="text-white font-bold">Vanguard S&P 500</div>
                        </div>
                    </div>
                    <span className="text-rose-400 font-mono font-bold">-£4,000</span>
                 </div>
                 <div className="flex justify-center -my-2 relative z-10">
                    <div className="bg-slate-800 p-2 rounded-full border border-slate-700">
                        <RefreshCw size={16} className="text-slate-400" />
                    </div>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400">
                             <Lock size={18} />
                        </div>
                        <div>
                            <div className="text-slate-400">Buy (ISA Wrapper)</div>
                            <div className="text-white font-bold">Vanguard S&P 500</div>
                        </div>
                    </div>
                    <span className="text-emerald-400 font-mono font-bold">+£4,000</span>
                 </div>

                 <button
                   onClick={() => {
                     // Simulate action
                     setTimeout(() => setShowRebalanceModal(false), 1000);
                   }}
                   className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-900/40 transition-all flex items-center justify-center gap-2"
                 >
                   Confirm Transaction <ChevronRight size={16} />
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-32">

        {/* --- 1. Hero Card: Portfolio Architect --- */}
        <div className="col-span-12 md:col-span-8">
          <DashboardCard className="relative overflow-hidden group min-h-[400px] border-0 ring-1 ring-white/5 bg-slate-900/50">
            {/* Dynamic Backgrounds */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-indigo-600/20 to-transparent rounded-full blur-[100px] pointer-events-none opacity-50 group-hover:opacity-70 transition-opacity duration-1000" />

            <div className="relative z-10 flex flex-col md:flex-row items-center h-full p-8 gap-8">
              <div className="flex-1 space-y-8">
                <div>
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-4">
                      <Sparkles size={12} /> Architect AI
                   </div>
                   <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight leading-tight">
                      Portfolio Efficiency <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">94% Optimized</span>
                   </h2>
                </div>

                <div className="bg-slate-950/50 backdrop-blur-sm border border-white/5 p-4 rounded-2xl max-w-md">
                   <div className="flex items-start gap-3">
                      <div className="mt-1 bg-indigo-500/20 p-2 rounded-lg text-indigo-400">
                         <Zap size={18} />
                      </div>
                      <div>
                         <h4 className="text-sm font-bold text-white">Action Required</h4>
                         <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            You have <span className="text-white font-mono">£4,000</span> remaining in your ISA allowance.
                            Using this before April 5th saves ~£800 in Capital Gains Tax.
                         </p>
                      </div>
                   </div>
                   <button
                     onClick={() => setShowRebalanceModal(true)}
                     className="mt-4 w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
                   >
                     Auto-Fill ISA Allowance
                   </button>
                </div>
              </div>

              {/* Visualization */}
              <div className="shrink-0">
                 <TaxSunburst data={assetData} activeId={activeAssetId} onHover={setActiveAssetId} />
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* --- 2. Performance Card --- */}
        <div className="col-span-12 md:col-span-4">
          <DashboardCard className="h-full flex flex-col p-6 border-0 ring-1 ring-white/5 bg-slate-900/50">
             <div className="flex justify-between items-start mb-6">
                <div>
                   <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                     <TrendingUp size={14} /> Performance
                   </h3>
                   <div className="text-3xl font-bold text-white mt-2">12.4%</div>
                   <div className="text-emerald-400 text-xs font-bold flex items-center gap-1 mt-1">
                      <ArrowUpRight size={12} /> +2.1% vs Benchmark
                   </div>
                </div>

                {/* Benchmark Toggle */}
                <div className="flex bg-slate-950 p-1 rounded-lg border border-white/5">
                   {['S&P 500', 'CPI'].map(b => (
                      <button
                        key={b}
                        onClick={() => setBenchmark(b)}
                        className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                           benchmark === b ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                         {b}
                      </button>
                   ))}
                </div>
             </div>

             <div className="flex-1 w-full min-h-[200px] relative -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={performanceData}>
                      <defs>
                         <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 10 }}
                        dy={10}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="portfolio"
                        stroke="#6366f1"
                        strokeWidth={3}
                        fill="url(#colorGradient)"
                        activeDot={{ r: 6, fill: '#fff', stroke: '#6366f1', strokeWidth: 2 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="benchmark"
                        stroke="#475569"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        fill="none"
                        opacity={0.5}
                      />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </DashboardCard>
        </div>

        {/* --- 3. Fee Scanner Card --- */}
        <div className="col-span-12">
           <DashboardCard title="Fee Intelligence" className="p-0 border-0 ring-1 ring-white/5 bg-slate-900/50 overflow-hidden">
              <div className="flex flex-col md:flex-row">
                 {/* Left: The Alert */}
                 <div className="flex-1 p-8 bg-gradient-to-r from-rose-500/5 to-transparent relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500" />

                    <div className="flex gap-6 items-start">
                       <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500 shrink-0 border border-rose-500/20">
                          <AlertTriangle size={24} />
                       </div>
                       <div className="space-y-6 w-full max-w-2xl">
                          <div>
                             <h4 className="text-xl font-bold text-white">Legacy Pension Detected</h4>
                             <p className="text-slate-400 mt-2 text-sm">
                                Your <strong className="text-white">Aviva Pension</strong> has an expense ratio of <span className="text-rose-400 font-bold">1.5%</span>.
                                In high-growth years, this compound drag reduces your pot significantly.
                             </p>
                          </div>

                          <SmartSlider
                            label="Projection Timeframe"
                            min={5}
                            max={40}
                            value={projectionYears}
                            onChange={setProjectionYears}
                          />

                          <div className="grid grid-cols-2 gap-4">
                             <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5">
                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Current Fee Impact</div>
                                <div className="text-xl font-mono text-rose-400 font-bold">
                                   {formatCurrency(feeAnalysis.legacyVal)}
                                </div>
                                <div className="text-[10px] text-slate-500 mt-1">Final Pot Value</div>
                             </div>
                             <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10">
                                <div className="text-xs text-emerald-500/80 uppercase font-bold mb-1">With Low-Cost ETF</div>
                                <div className="text-xl font-mono text-emerald-400 font-bold">
                                   {formatCurrency(feeAnalysis.newVal)}
                                </div>
                                <div className="text-[10px] text-emerald-500/50 mt-1">Final Pot Value</div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Right: The Solution */}
                 <div className="md:w-80 bg-slate-950/50 p-8 border-t md:border-t-0 md:border-l border-white/5 flex flex-col justify-center">
                    <div className="text-center">
                       <div className="inline-block p-4 rounded-full bg-emerald-500/10 text-emerald-400 mb-4">
                          <ShieldCheck size={32} />
                       </div>
                       <h4 className="text-white font-bold mb-2">Recommended Action</h4>
                       <p className="text-xs text-slate-400 mb-6">Switch to Vanguard LifeStrategy 80% to reduce fees by 85%.</p>

                       <div className="text-3xl font-bold text-emerald-400 mb-6 tracking-tight">
                          {formatCurrency(feeAnalysis.savings)}
                          <div className="text-xs text-slate-500 font-normal uppercase tracking-wide mt-1">Projected Savings</div>
                       </div>

                       <button
                         onClick={() => onInteract('Review Switch')}
                         className="w-full py-3 bg-white hover:bg-slate-200 text-slate-900 font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                       >
                         Review Switch <ChevronRight size={16} />
                       </button>
                    </div>
                 </div>
              </div>
           </DashboardCard>
        </div>
      </div>

      {/* --- 4. Floating AI Command Bar --- */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4"
      >
        <div className="group relative">
           <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full opacity-30 group-hover:opacity-60 blur transition duration-500" />
           <div className="relative flex items-center bg-slate-900 border border-white/10 rounded-full p-2 pl-5 shadow-2xl">
              <Brain className="text-indigo-400 shrink-0 animate-pulse" size={20} />
              <input
                 type="text"
                 value={aiQuery}
                 onChange={(e) => setAiQuery(e.target.value)}
                 placeholder="Ask Architect: How does inflation affect my ISA?"
                 className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 px-4 h-10"
              />
              <button
                onClick={() => onInteract(aiQuery)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-full transition-transform hover:scale-105"
              >
                 <ArrowUpRight size={18} />
              </button>
           </div>

           {/* Contextual Suggestions (appear on hover/focus) */}
           <div className="absolute bottom-full left-0 w-full mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto flex justify-center gap-2">
              {['Simulate Market Crash', 'Retire at 55', 'Add Cash'].map(tag => (
                 <button
                   key={tag}
                   onClick={() => setAiQuery(tag)}
                   className="px-3 py-1.5 rounded-full bg-slate-800/90 backdrop-blur-md border border-white/10 text-xs text-slate-300 hover:text-white hover:bg-slate-700 transition"
                 >
                    {tag}
                 </button>
              ))}
           </div>
        </div>
      </motion.div>

    </div>
  );
}