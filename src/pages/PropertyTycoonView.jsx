import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Wallet,
  Home,
  Hammer,
  MapPin,
  PoundSterling,
  ShieldCheck,
  Search
} from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard.jsx';

// --- 1. Utility Components ---

const formatCurrency = (val) => new Intl.NumberFormat('en-GB', {
  style: 'currency', currency: 'GBP', maximumFractionDigits: 0
}).format(val);

// The Premium Slider (Reused for consistency)
const SmartSlider = ({ value, min, max, step = 1, onChange, label, unit = '' }) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3 select-none group">
      <div className="flex justify-between items-end">
        <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider transition-colors group-hover:text-slate-300">{label}</label>
        <span className="text-white font-mono font-bold text-xs sm:text-sm bg-slate-800 px-2 py-0.5 rounded border border-white/5">{unit}{value.toLocaleString()}</span>
      </div>
      <div className="relative h-6 flex items-center cursor-pointer">
        <div className="absolute w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-100 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
        />
        <motion.div
          className="absolute h-4 w-4 bg-white rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] border-2 border-emerald-500 pointer-events-none"
          style={{ left: `calc(${percentage}% - 8px)` }}
          layoutId={`thumb-${label}`}
        />
      </div>
    </div>
  );
};

// --- 2. Sub-Components ---

const BuildingStack = ({ label, value, debt, delay }) => {
  const height = 160;
  const debtPct = (debt / value) * 100;
  const equityPct = 100 - debtPct;

  return (
    <div className="flex flex-col items-center gap-3 group cursor-pointer relative z-10">
      {/* The Stack */}
      <div className="relative w-14 rounded-lg overflow-hidden shadow-2xl bg-slate-800/50 backdrop-blur-sm border border-white/5" style={{ height: `${height}px` }}>

        {/* Equity (Top) - Glass Effect */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${equityPct}%` }}
          transition={{ duration: 1.2, delay, ease: [0.34, 1.56, 0.64, 1] }} // Spring-like ease
          className="w-full bg-emerald-500/80 border-b border-white/20 relative group-hover:bg-emerald-400/90 transition-colors"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-emerald-950 opacity-0 group-hover:opacity-100 transition-opacity">
            {Math.round(equityPct)}%
          </span>
        </motion.div>

        {/* Debt (Bottom) */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${debtPct}%` }}
          transition={{ duration: 1, delay: delay + 0.2, ease: "circOut" }}
          className="w-full bg-slate-700/80 group-hover:bg-slate-600 transition-colors relative"
        >
          <div className="absolute top-0 w-full h-[1px] bg-black/30" />
          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">Debt</span>
        </motion.div>
      </div>

      {/* Label */}
      <div className="text-center space-y-0.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors">{label}</p>
        <p className="text-[9px] text-slate-500 font-mono">£{(value / 1000).toFixed(0)}k</p>
      </div>
    </div>
  );
};

const LTVGauge = ({ ltv }) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  const getColor = (val) => {
    if (val < 60) return "#10b981"; // Emerald
    if (val < 75) return "#f59e0b"; // Amber
    return "#f43f5e"; // Rose
  };

  return (
    <div className="relative flex flex-col items-center justify-center -mt-4">
      {/* Glow Backdrop */}
      <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full" />

      <svg className="w-64 h-32 overflow-visible relative z-10">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {/* Track */}
        <path d="M 32 128 A 80 80 0 0 1 224 128" fill="none" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
        {/* Fill */}
        <motion.path
          d="M 32 128 A 80 80 0 0 1 224 128"
          fill="none"
          stroke={getColor(ltv)}
          strokeWidth="12"
          strokeLinecap="round"
          filter="url(#glow)"
          strokeDasharray={circumference} // Half circle logic handled by path length in framer
          initial={{ pathLength: 0 }}
          animate={{ pathLength: (ltv / 100) / 2 }} // Divide by 2 because visual is semi-circle
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute top-12 text-center z-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tighter"
        >
          {ltv}<span className="text-lg sm:text-xl text-slate-500">%</span>
        </motion.div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">Portfolio LTV</p>
      </div>
    </div>
  );
};

const RenovationCalculator = ({ onInteract }) => {
  const [budget, setBudget] = useState(15000);
  const roi = budget * 1.5;
  const rentIncrease = Math.floor(budget / 100);

  return (
    <DashboardCard title="Renovation ROI" className="h-full border-0 ring-1 ring-white/5 bg-slate-900/50">
      <div className="space-y-6">
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 border border-amber-500/20">
            <Hammer size={18} />
          </div>
          <div>
            <h4 className="font-bold text-white text-xs sm:text-sm">Active Project</h4>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">Kitchen Refurb • 88 High Road</p>
          </div>
        </div>

        <div className="space-y-6">
          <SmartSlider
            label="Renovation Budget"
            value={budget} min={5000} max={50000} step={1000}
            onChange={setBudget} unit="£"
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/50 border border-white/5 text-center group hover:border-emerald-500/30 transition-colors">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Capital Gain</p>
              <p className="text-base sm:text-lg font-bold text-emerald-400">+£{roi.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/50 border border-white/5 text-center group hover:border-white/20 transition-colors">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Rent Increase</p>
              <p className="text-base sm:text-lg font-bold text-white">+£{rentIncrease}<span className="text-[10px] sm:text-xs text-slate-500 font-normal">/mo</span></p>
            </div>
          </div>

          <button
            onClick={() => onInteract(`Start Renovation Project (£${budget})`)}
            className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-900/20 hover:shadow-amber-500/20"
          >
            Simulate Project
          </button>
        </div>
      </div>
    </DashboardCard>
  );
};

const PortfolioMap = () => {
  return (
    <DashboardCard title="Asset Map" className="h-full relative overflow-hidden p-0 border-0 ring-1 ring-white/5">
      <div className="absolute inset-0 bg-slate-900">
        {/* Styled Map Background */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Markers */}
        {[
          { x: '30%', y: '40%', label: '12 Oak', yield: '5.2%', status: 'good' },
          { x: '60%', y: '25%', label: '88 High', yield: '4.8%', status: 'good' },
          { x: '45%', y: '70%', label: 'Marina', yield: '3.1%', status: 'alert' },
        ].map((m, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + (i * 0.1), type: 'spring' }}
            className="absolute flex flex-col items-center group cursor-pointer"
            style={{ left: m.x, top: m.y }}
          >
            {/* Pulsing Beacon */}
            <div className="relative">
              {m.status === 'alert' && (
                <div className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-75" />
              )}
              <div className={`relative z-10 p-2 rounded-full border-2 shadow-xl transition-transform group-hover:scale-110 ${m.status === 'alert' ? 'bg-rose-500 border-rose-300' : 'bg-emerald-500 border-emerald-300'
                }`}>
                <Home size={14} className="text-white" />
              </div>
            </div>

            {/* Tooltip Label */}
            <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-white/10 text-[10px] font-bold text-white whitespace-nowrap backdrop-blur-md shadow-xl flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-200">
              {m.label} <span className={m.status === 'alert' ? 'text-rose-400' : 'text-emerald-400'}>{m.yield}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardCard>
  );
};

// --- Main View ---

export default function PropertyTycoonView({ onInteract = () => { } }) {
  const [rentAdjustment, setRentAdjustment] = useState(0);

  const initialProperties = [
    { id: 1, name: '12 Oak Street', value: 450000, debt: 200000, baseRent: 2200, exp: 850 },
    { id: 2, name: '88 High Road', value: 280000, debt: 210000, baseRent: 1400, exp: 400 },
    { id: 3, name: 'The Marina Apt', value: 320000, debt: 120000, baseRent: 1100, exp: 600, alert: true },
  ];

  const properties = useMemo(() => {
    return initialProperties.map(p => {
      const currentRent = p.alert ? p.baseRent + rentAdjustment : p.baseRent;
      const netIncome = (currentRent - p.exp) * 12;
      const yieldPct = (netIncome / p.value) * 100;
      return { ...p, currentRent, yieldPct };
    });
  }, [rentAdjustment]);

  const stats = useMemo(() => {
    const totalValue = properties.reduce((acc, p) => acc + p.value, 0);
    const totalDebt = properties.reduce((acc, p) => acc + p.debt, 0);
    return {
      totalValue,
      totalDebt,
      totalEquity: totalValue - totalDebt,
      ltv: Math.round((totalDebt / totalValue) * 100)
    };
  }, [properties]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 pb-20">

      {/* --- 1. Capital Stack Overview --- */}
      <div className="col-span-12 md:col-span-8">
        <DashboardCard className="relative overflow-hidden min-h-[400px] p-0 border-0 ring-1 ring-white/5 bg-slate-900/50 group">
          {/* Ambient Background */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-12 h-full p-4 sm:p-6 md:p-8">
            <div className="flex-1 space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                  <Building2 size={12} /> Tycoon Level 4
                </div>
                <h2 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight">
                  £{stats.totalValue.toLocaleString()}
                </h2>
                <div className="flex items-center gap-3 mt-4">
                  <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-[10px] sm:text-xs font-bold flex items-center gap-1">
                    <TrendingUp size={12} /> +1.2%
                  </span>
                  <span className="text-slate-400 text-[10px] sm:text-xs">Portfolio Growth (MoM)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-sm">
                <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 backdrop-blur-md">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <Wallet size={16} className="text-emerald-500" />
                    <p className="text-[10px] uppercase tracking-wider font-bold">Net Equity</p>
                  </div>
                  <p className="text-lg sm:text-xl font-bold text-white">£{stats.totalEquity.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 backdrop-blur-md">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <PoundSterling size={16} className="text-slate-500" />
                    <p className="text-[10px] uppercase tracking-wider font-bold">Bank Debt</p>
                  </div>
                  <p className="text-lg sm:text-xl font-bold text-slate-300">£{stats.totalDebt.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Visual Stacks */}
            <div className="flex items-end gap-6 h-[220px] flex-1 justify-end px-4 border-l border-white/5">
              {properties.map((p, i) => (
                <BuildingStack
                  key={p.id}
                  label={p.name.split(' ')[0]}
                  value={p.value}
                  debt={p.debt}
                  delay={i * 0.1}
                />
              ))}
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* --- 2. LTV Gauge --- */}
      <div className="col-span-12 md:col-span-4">
        <DashboardCard className="h-full flex flex-col border-0 ring-1 ring-white/5 bg-slate-900/50">
          <div className="flex-1 flex flex-col items-center justify-center py-6">
            <div className="mb-2">
            </div>
            <LTVGauge ltv={stats.ltv} />

            <div className="mt-6 text-center px-6">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full mb-3 border border-emerald-500/20">
                <ShieldCheck size={12} /> Safe Zone (&lt;60%)
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed">
                You have significant equity leverage. <br />
                Unlock <strong className="text-white">£85,000</strong> while keeping LTV safe.
              </p>
            </div>

            <button
              onClick={() => onInteract('Remortgage Options')}
              className="mt-6 w-full max-w-[200px] py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider border border-white/10 transition-all flex items-center justify-center gap-2 group"
            >
              <Search size={14} className="text-slate-400 group-hover:text-white" /> View Deals
            </button>
          </div>
        </DashboardCard>
      </div>

      {/* --- 3. Renovation & Map --- */}
      <div className="col-span-12 md:col-span-4">
        <RenovationCalculator onInteract={onInteract} />
      </div>
      <div className="col-span-12 md:col-span-8">
        <PortfolioMap />
      </div>

      {/* --- 4. Yield Analyzer --- */}
      <div className="col-span-12">
        <DashboardCard className="border-0 ring-1 ring-white/5 bg-slate-900/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/20">
                <ArrowUpRight size={24} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Yield Performance</h3>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-1">Net ROI across portfolio</p>
              </div>
            </div>

            {/* Interactive Rent Simulator */}
            <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 flex items-center gap-6 backdrop-blur-sm">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase text-amber-500 flex items-center gap-1">
                  <AlertTriangle size={12} /> Optimization
                </p>
                <p className="text-[10px] sm:text-xs text-slate-400">Simulate Rent on <span className="text-white">Marina Apt</span></p>
              </div>
              <div className="w-48">
                <SmartSlider
                  label=""
                  value={rentAdjustment} min={0} max={500} step={25}
                  onChange={setRentAdjustment} unit="+£"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="text-slate-500 border-b border-white/10 text-[10px] font-bold uppercase tracking-widest">
                  <th className="pb-4 pl-4">Asset</th>
                  <th className="pb-4">Valuation</th>
                  <th className="pb-4">Rent (Mo)</th>
                  <th className="pb-4">Expenses</th>
                  <th className="pb-4">Annual Net</th>
                  <th className="pb-4 text-right pr-4">Net Yield</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {properties.map((prop, i) => (
                  <tr key={i} className="group hover:bg-white/5 transition-colors cursor-pointer" onClick={() => onInteract(`Analyze ${prop.name}`)}>
                    <td className="py-4 pl-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-1 h-8 rounded-full ${prop.alert ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        <div>
                          <p className="font-bold text-white group-hover:text-emerald-400 transition-colors">{prop.name}</p>
                          {prop.alert && (
                            <span className="text-[9px] text-amber-500 flex items-center gap-1 mt-0.5 font-bold uppercase tracking-wider">
                              Action Needed
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-slate-400 font-mono">£{prop.value.toLocaleString()}</td>
                    <td className="py-4 text-slate-300 relative font-mono">
                      £{prop.currentRent.toLocaleString()}
                      {prop.currentRent > prop.baseRent && (
                        <motion.span
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="absolute -top-1 ml-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1 rounded"
                        >
                          +{prop.currentRent - prop.baseRent}
                        </motion.span>
                      )}
                    </td>
                    <td className="py-4 text-slate-500 font-mono">£{prop.exp}</td>
                    <td className="py-4 text-white font-mono font-bold">£{((prop.currentRent - prop.exp) * 12).toLocaleString()}</td>
                    <td className="py-4 pr-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {/* Visual Bar for Yield */}
                        <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                          <motion.div
                            className={`h-full ${prop.yieldPct < 4 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(prop.yieldPct / 8) * 100}%` }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                        <span className={`px-2 py-1 rounded-md font-bold text-xs w-16 text-center border ${prop.yieldPct < 4
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}>
                          {prop.yieldPct.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}