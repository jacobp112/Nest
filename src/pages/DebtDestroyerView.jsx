import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingDown,
  Calendar,
  ArrowRight,
  CreditCard,
  Car,
  Sparkles,
  Target,
  Coffee,
  Utensils,
  Check,
  Shield,
  Flame,
  Zap
} from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard.jsx';

// --- 1. Premium Components ---

const SmartSlider = ({ value, min, max, step = 1, onChange, label, unit = '' }) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3 select-none group">
      <div className="flex justify-between items-end">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider transition-colors group-hover:text-slate-300">{label}</label>
        <span className="text-white font-mono font-bold text-sm bg-slate-800 px-2 py-0.5 rounded border border-white/5">{unit}{value}</span>
      </div>
      <div className="relative h-6 flex items-center cursor-pointer">
        <div className="absolute w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
           <div
             className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-100 ease-out"
             style={{ width: `${percentage}%` }}
           />
        </div>
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
        />
        <motion.div
          className="absolute h-4 w-4 bg-white rounded-full shadow-[0_0_15px_rgba(6,182,212,0.6)] border-2 border-cyan-500 pointer-events-none"
          style={{ left: `calc(${percentage}% - 8px)` }}
          layoutId={`thumb-${label}`}
        />
      </div>
    </div>
  );
};

const DebtRow = ({ debt, strategy, index }) => {
  const isTarget = (strategy === 'avalanche' && index === 0) || (strategy === 'snowball' && index === 1);
  const Icon = debt.icon;

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className={`relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 group ${
        isTarget
        ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/5 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.05)]'
        : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/60'
      }`}
    >
      {isTarget && (
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-500 rounded-full shadow-[0_0_15px_#06b6d4]" />
      )}

      <div className="flex items-center gap-4">
        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-colors ${
            isTarget ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/20' : 'bg-slate-800 text-slate-400 border-white/5'
        }`}>
          <Icon size={20} />
        </div>
        <div>
          <div className="flex items-center gap-2">
             <h4 className={`font-bold text-sm ${isTarget ? 'text-white' : 'text-slate-300'}`}>{debt.name}</h4>
             {isTarget && (
                <span className="flex items-center gap-1 text-[9px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 px-1.5 rounded">
                    <Target size={10} /> TARGET
                </span>
             )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-slate-400 border border-white/5">{debt.rate}% APR</span>
            <span className="text-[10px] text-slate-500">Min: £{debt.min}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="font-mono font-bold text-white text-lg">£{debt.balance.toLocaleString()}</p>
        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Balance</p>
      </div>
    </motion.div>
  );
};

const StrategyCard = ({ title, desc, savings, selected, onClick, icon: Icon }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
      selected
      ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-500/20'
      : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/60 hover:border-white/10'
    }`}
  >
    {selected && <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />}

    <div className="flex justify-between items-start mb-2 relative z-10">
      <div className="flex items-center gap-2">
         <div className={`p-1.5 rounded-lg ${selected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
            <Icon size={16} />
         </div>
         <h4 className={`font-bold text-sm ${selected ? 'text-white' : 'text-slate-200'}`}>{title}</h4>
      </div>
      {selected && <div className="bg-white text-indigo-600 p-1 rounded-full"><Check size={12} strokeWidth={3} /></div>}
    </div>

    <p className={`text-xs ${selected ? 'text-indigo-100' : 'text-slate-400'} mb-3 relative z-10 leading-relaxed`}>{desc}</p>

    <div className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider relative z-10 ${
        selected ? 'bg-black/20 text-white' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
    }`}>
      Save £{savings} Interest
    </div>
  </motion.button>
);

const SacrificeToggle = ({ icon: Icon, label, amount, active, onToggle }) => (
  <button
    onClick={onToggle}
    className={`flex items-center justify-between w-full p-3 rounded-xl border transition-all duration-200 ${
      active
      ? 'bg-emerald-500/10 border-emerald-500/50'
      : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/60'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg transition-colors ${active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
        <Icon size={16} />
      </div>
      <div className="text-left">
        <p className={`text-xs font-bold ${active ? 'text-white' : 'text-slate-300'}`}>{label}</p>
        <p className={`text-[10px] ${active ? 'text-emerald-400' : 'text-slate-500'}`}>+ £{amount}/mo</p>
      </div>
    </div>
    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
        active ? 'bg-emerald-500 border-emerald-500 scale-110' : 'border-slate-600 bg-slate-800'
    }`}>
      {active && <Check size={12} className="text-white" strokeWidth={3} />}
    </div>
  </button>
);

// --- Main View ---

export default function DebtDestroyerView({ onInteract = () => { } }) {
  const [strategy, setStrategy] = useState('avalanche');
  const [extraPayment, setExtraPayment] = useState(150);
  const [sacrifices, setSacrifices] = useState({ coffee: false, takeaway: false });

  // --- Data & Logic ---
  const debts = [
    { name: 'Credit Card', balance: 4500, rate: 18.9, min: 120, icon: CreditCard },
    { name: 'Car Loan', balance: 8000, rate: 6.5, min: 330, icon: Car },
  ];

  const sacrificeSavings = useMemo(() => {
    let total = 0;
    if (sacrifices.coffee) total += 60;
    if (sacrifices.takeaway) total += 120;
    return total;
  }, [sacrifices]);

  const totalDebt = 12500;
  const monthlyPayment = 450;
  const totalMonthly = monthlyPayment + extraPayment + sacrificeSavings;
  const monthsRemaining = Math.ceil(totalDebt / totalMonthly);

  // Mock Date Calculation
  const freedomDate = useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + monthsRemaining);
    return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  }, [monthsRemaining]);

  const interestSaved = Math.round((monthsRemaining * 25) + (extraPayment * 1.5));

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-20">

      {/* --- Left Column (Hero & Debts) --- */}
      <div className="col-span-12 md:col-span-8 space-y-6">

        {/* 1. Hero Card (Now with Freedom Blue/Cyan) */}
        <DashboardCard className="relative overflow-hidden min-h-[320px] flex flex-col justify-center p-8 border-0 ring-1 ring-white/5 bg-slate-900/50 group">
            {/* Dynamic Background - Cool Blue/Cyan instead of Red */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-cyan-500/20 transition-colors duration-1000" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-md shadow-lg shadow-cyan-500/10">
                <Zap size={12} /> Freedom Countdown
              </div>

              <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-4">
                <h2 className="text-6xl md:text-7xl font-display font-bold text-white tracking-tighter drop-shadow-xl">
                  {monthsRemaining} <span className="text-2xl md:text-3xl text-slate-500 font-sans tracking-normal font-medium">Months</span>
                </h2>
                <div className="h-px w-12 bg-white/20 hidden md:block mb-4" />
                <p className="text-xl md:text-2xl text-cyan-300 font-display font-bold mb-1">
                  {freedomDate}
                </p>
              </div>

              <p className="text-slate-400 max-w-lg text-sm leading-relaxed">
                By adding <span className="text-white font-bold">£{extraPayment + sacrificeSavings}</span> extra per month, you will be debt free by <span className="text-cyan-400 font-bold">{freedomDate}</span>.
              </p>

              {/* Interactive Slider in Hero */}
              <div className="mt-8 max-w-md bg-slate-950/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                 <SmartSlider
                    label="Extra Monthly Payment"
                    value={extraPayment} min={50} max={1000} step={50}
                    onChange={setExtraPayment} unit="£"
                 />
              </div>
            </div>
        </DashboardCard>

        {/* 2. Debt List */}
        <DashboardCard title="Active Debts" className="border-0 ring-1 ring-white/5 bg-slate-900/50">
            <div className="space-y-3 mt-2">
              {debts.map((debt, i) => (
                <DebtRow key={i} index={i} debt={debt} strategy={strategy} />
              ))}
            </div>
        </DashboardCard>
      </div>

      {/* --- Right Column (Strategy) --- */}
      <div className="col-span-12 md:col-span-4">
        <DashboardCard title="Attack Strategy" className="h-full border-0 ring-1 ring-white/5 bg-slate-900/50">
          <div className="space-y-4 mt-4">
            <StrategyCard
              title="Avalanche"
              desc="Highest interest first. Mathematically optimal for saving money."
              savings={850}
              selected={strategy === 'avalanche'}
              onClick={() => setStrategy('avalanche')}
              icon={Flame}
            />
            <StrategyCard
              title="Snowball"
              desc="Smallest balance first. Builds momentum quickly."
              savings={620}
              selected={strategy === 'snowball'}
              onClick={() => setStrategy('snowball')}
              icon={Shield}
            />
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Found Money</span>
                <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="space-y-3">
              <SacrificeToggle
                icon={Coffee}
                label="Cut Daily Coffee"
                amount={60}
                active={sacrifices.coffee}
                onToggle={() => setSacrifices(prev => ({ ...prev, coffee: !prev.coffee }))}
              />
              <SacrificeToggle
                icon={Utensils}
                label="No Takeaways"
                amount={120}
                active={sacrifices.takeaway}
                onToggle={() => setSacrifices(prev => ({ ...prev, takeaway: !prev.takeaway }))}
              />
            </div>

            <button
               onClick={() => onInteract('Commit to Plan')}
               className="w-full mt-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2 group"
            >
               <Sparkles size={14} className="text-cyan-200 group-hover:text-white transition-colors" /> Commit to Plan
            </button>
          </div>
        </DashboardCard>
      </div>

    </div>
  );
}