import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp,
    AlertCircle,
    ArrowUpRight,
    Brain,
    ShieldCheck,
    RefreshCw,
    X,
    Calculator,
    Sparkles,
    Zap,
    Lock
} from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardCard } from '../components/DashboardCard.jsx';

// --- 1. Utilities ---

const formatCurrency = (val) => new Intl.NumberFormat('en-GB', {
    style: 'currency', currency: 'GBP', maximumFractionDigits: 0
}).format(val);

const formatPercent = (val) => new Intl.NumberFormat('en-GB', {
    style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 2
}).format(val);

// --- 2. Premium Micro-Components ---

// The "Tactile" Slider - Replaces <input type="range">
const SmartSlider = ({ value, min, max, step = 1, onChange, label, unit = '' }) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className="space-y-3 select-none group">
            <div className="flex justify-between items-end">
                <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider transition-colors group-hover:text-slate-300">{label}</label>
                <span className="text-white font-mono font-bold text-xs sm:text-sm bg-slate-800 px-2 py-0.5 rounded border border-white/5">{value}{unit}</span>
            </div>
            <div className="relative h-6 flex items-center cursor-pointer">
                {/* Track */}
                <div className="absolute w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-100 ease-out"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                {/* Invisible Native Input for interaction */}
                <input
                    type="range" min={min} max={max} step={step} value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
                />
                {/* Custom Thumb */}
                <motion.div
                    className="absolute h-4 w-4 bg-white rounded-full shadow-lg border-2 border-indigo-500 pointer-events-none"
                    style={{ left: `calc(${percentage}% - 8px)` }}
                    layoutId={`thumb-${label}`}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
            </div>
        </div>
    );
};

// Glassmorphic Chart Tooltip
const CustomTooltip = ({ active, payload, label, prefix = '' }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-3 rounded-xl shadow-2xl ring-1 ring-black/50">
                <p className="text-slate-400 text-[10px] sm:text-xs font-bold mb-2 uppercase tracking-wider">{label}</p>
                <div className="space-y-1">
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs sm:text-sm">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-white font-mono font-bold">
                                {prefix}{entry.value.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

// --- 3. Feature Components ---

const RetirementPlanner = () => {
    const [monthlyContrib, setMonthlyContrib] = useState(1500);
    const [retirementAge, setRetirementAge] = useState(60);

    // Projection Logic
    const currentAge = 35;
    const years = retirementAge - currentAge;
    const rate = 0.07;
    const currentPot = 115000;

    const data = useMemo(() => {
        let pot = currentPot;
        const res = [];
        for (let i = 0; i <= years; i++) {
            res.push({ age: currentAge + i, value: Math.round(pot) });
            pot = pot * (1 + rate) + (monthlyContrib * 12);
        }
        return res;
    }, [monthlyContrib, retirementAge]);

    const finalPot = data[data.length - 1].value;

    return (
        <DashboardCard className="h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 sm:p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Calculator size={80} className="text-white" />
            </div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2 text-indigo-400 mb-1">
                            <Sparkles size={14} />
                            <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">Retirement AI</h3>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                            {formatCurrency(finalPot)}
                        </p>
                        <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1">Projected at Age {retirementAge}</p>
                    </div>
                </div>

                <div className="flex-1 w-full min-h-[140px] relative -ml-2 md:-ml-4 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorPot" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="age" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip prefix="£" />} />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#6366f1"
                                strokeWidth={2}
                                fill="url(#colorPot)"
                                activeDot={{ r: 4, fill: 'white' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="space-y-5 bg-slate-950/30 p-3 sm:p-4 rounded-xl border border-white/5">
                    <SmartSlider
                        label="Monthly Contribution"
                        min={500} max={5000} step={100}
                        value={monthlyContrib}
                        onChange={setMonthlyContrib}
                        unit=""
                    />
                    <SmartSlider
                        label="Retirement Age"
                        min={50} max={75} step={1}
                        value={retirementAge}
                        onChange={setRetirementAge}
                        unit=""
                    />
                </div>
            </div>
        </DashboardCard>
    );
};

const TaxSunburst = ({ data = [], onSegmentHover }) => {
    const [hovered, setHovered] = useState(null);
    let cumulativeAngle = -Math.PI / 2;
    const totalValue = data.reduce((acc, curr) => acc + curr.value, 0);

    const handleHover = (id) => {
        setHovered(id);
        if (onSegmentHover) onSegmentHover(id);
    };

    return (
        <div className="relative w-64 h-64 flex items-center justify-center group">
            <div className="absolute inset-0 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700" />
            <svg
                width="100%" height="100%" viewBox="0 0 200 200"
                className="overflow-visible relative z-10"
                onMouseLeave={() => handleHover(null)}
            >
                {data.map((seg) => {
                    const angle = (seg.value / totalValue) * 2 * Math.PI;
                    const start = cumulativeAngle;
                    const end = start + angle;
                    cumulativeAngle = end;

                    // SVG Arc Math
                    const x1 = 100 + 90 * Math.cos(start);
                    const y1 = 100 + 90 * Math.sin(start);
                    const x2 = 100 + 90 * Math.cos(end);
                    const y2 = 100 + 90 * Math.sin(end);
                    const largeArc = angle > Math.PI ? 1 : 0;
                    const d = `M 100 100 L ${x1} ${y1} A 90 90 0 ${largeArc} 1 ${x2} ${y2} Z`;

                    return (
                        <motion.path
                            key={seg.id}
                            d={d}
                            fill={seg.color}
                            stroke="rgba(15, 23, 42, 1)"
                            strokeWidth="2"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: hovered === seg.id ? 1.05 : 1,
                                opacity: hovered && hovered !== seg.id ? 0.3 : 1
                            }}
                            onMouseEnter={() => handleHover(seg.id)}
                            className="cursor-pointer transition-all hover:brightness-110"
                        />
                    );
                })}
                <circle cx="100" cy="100" r="65" fill="#0f172a" />
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
                <AnimatePresence mode="wait">
                    {hovered ? (
                        <motion.div
                            key="active" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest font-bold">Allocation</span>
                            <div className="text-xl sm:text-2xl font-bold text-white">
                                {formatPercent(data.find(d => d.id === hovered).value / totalValue)}
                            </div>
                            <div className="text-[9px] sm:text-[10px] text-indigo-300">{data.find(d => d.id === hovered).name}</div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="default" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total Assets</span>
                            <div className="text-xl sm:text-2xl font-bold text-white">{formatCurrency(totalValue)}</div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const RebalanceWizard = ({ onClose }) => {
    const [isSimulating, setIsSimulating] = useState(false);

    const handleExecute = () => {
        setIsSimulating(true);
        setTimeout(() => {
            setIsSimulating(false);
            onClose();
        }, 2000);
    };

    return (
        <div className="space-y-6 py-4">
            <div className="text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-indigo-500/20 text-indigo-400 mb-4">
                    <RefreshCw size={20} />
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-white">Optimise ISA Wrapper</h4>
                <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xs mx-auto">Move £4,000 from General Account to Tax-Free ISA.</p>
            </div>

            <div className="p-3 sm:p-4 rounded-xl bg-slate-800/50 border border-white/10 space-y-4">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-slate-700 flex items-center justify-center text-rose-400">
                            <ArrowUpRight className="rotate-45" size={16} />
                        </div>
                        <span className="text-slate-300">Sell GIA (Taxable)</span>
                    </div>
                    <span className="text-rose-400 font-mono font-medium">-£4,000</span>
                </div>
                <div className="w-full h-px bg-white/5" />
                <div className="flex justify-between items-center text-xs sm:text-sm">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-slate-700 flex items-center justify-center text-emerald-400">
                            <Lock size={16} />
                        </div>
                        <span className="text-slate-300">Buy ISA (Tax-Free)</span>
                    </div>
                    <span className="text-emerald-400 font-mono font-medium">+£4,000</span>
                </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 sm:p-3 rounded-lg text-[10px] sm:text-xs text-emerald-200 text-center">
                <Sparkles size={12} className="inline mr-1" />
                Saves estimated <strong>£800</strong> in future CGT.
            </div>

            <button
                onClick={handleExecute}
                disabled={isSimulating}
                className={`w-full py-2 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${isSimulating
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/40 hover:shadow-indigo-500/20'
                    }`}
            >
                {isSimulating ? 'Processing Trade...' : 'Execute Rebalance'}
            </button>
        </div>
    );
};

// --- 4. Main Component ---

export default function ArchitectView({ onInteract = () => { } }) {
    const [activeAsset, setActiveAsset] = useState(null);
    const [projectionYears, setProjectionYears] = useState(20);
    const [benchmark, setBenchmark] = useState('S&P 500');
    const [activeModal, setActiveModal] = useState(null);
    const [aiQuery, setAiQuery] = useState('');

    // Data
    const assetData = useMemo(() => [
        { id: 'vanguard', name: 'Vanguard S&P 500', value: 80000, type: 'Stock Index', color: '#6366f1' },
        { id: 'thematic', name: 'Tech ETF', value: 30000, type: 'Thematic', color: '#8b5cf6' },
        { id: 'cash', name: 'Liquidity', value: 5000, type: 'Cash', color: '#94a3b8' },
    ], []);

    const performanceData = [
        { month: 'Jan', portfolio: 40000, benchmark: 40000 },
        { month: 'Mar', portfolio: 42500, benchmark: 41200 },
        { month: 'Jun', portfolio: 48000, benchmark: 44000 },
        { month: 'Sep', portfolio: 47000, benchmark: 45000 },
        { month: 'Dec', portfolio: 52000, benchmark: 48500 },
    ];

    // Logic
    const feeResults = useMemo(() => {
        const rate = 0.07;
        const currentPot = 50000;
        const lowFee = 0.002;
        const highFee = 0.015;

        const fvHigh = currentPot * Math.pow(1 + (rate - highFee), projectionYears);
        const fvLow = currentPot * Math.pow(1 + (rate - lowFee), projectionYears);

        return {
            savings: Math.round(fvLow - fvHigh),
            highFeeFV: Math.round(fvHigh),
            lowFeeFV: Math.round(fvLow),
        };
    }, [projectionYears]);

    const normalizedWidth = Math.min(100, (feeResults.highFeeFV / feeResults.lowFeeFV) * 100);

    return (
        <div className="relative">
            {/* Modal Layer */}
            <AnimatePresence>
                {activeModal === 'rebalance' && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setActiveModal(null)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl"
                        >
                            <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 sm:px-6 sm:py-4 bg-white/5">
                                <h3 className="text-lg font-bold text-white font-display">Smart Rebalancing</h3>
                                <button onClick={() => setActiveModal(null)} className="rounded-full p-2 hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-4 sm:p-6"><RebalanceWizard onClose={() => setActiveModal(null)} /></div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-32">

                {/* --- 1. Hero Card --- */}
                <div className="col-span-12 md:col-span-8">
                    <DashboardCard className="relative overflow-hidden min-h-[380px] p-0 border-0 ring-1 ring-white/5 bg-slate-900/50 group">
                        {/* Ambient Backgrounds */}
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-indigo-600/30 transition-colors duration-1000" />
                        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-violet-600/10 rounded-full blur-[80px] pointer-events-none" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 h-full p-4 sm:p-6 md:p-8">
                            <div className="flex-1 space-y-6">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-4 backdrop-blur-sm">
                                        <Brain size={12} /> Architect AI
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
                                        94% <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600">Efficient</span>
                                    </h2>
                                    <div className="mt-4 p-3 sm:p-4 rounded-xl bg-slate-950/40 border border-white/5 backdrop-blur-sm">
                                        <div className="flex items-start gap-3">
                                            <Zap className="text-yellow-400 shrink-0 mt-0.5" size={16} />
                                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                                Your <strong className="text-white">ISA Allowance</strong> resets in 34 days.
                                                You have <span className="text-emerald-400 font-mono font-bold">£4,000</span> remaining.
                                                Using this now saves ~£800.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveModal('rebalance')}
                                    className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-white text-slate-950 font-bold text-xs sm:text-sm transition-all hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                                >
                                    Max Out Allowance <ArrowUpRight size={16} />
                                </button>
                            </div>
                            <div className="flex-shrink-0 relative">
                                <TaxSunburst data={assetData} onSegmentHover={setActiveAsset} />
                            </div>
                        </div>
                    </DashboardCard>
                </div>

                {/* --- 2. Performance Card --- */}
                <div className="col-span-12 md:col-span-4">
                    <DashboardCard className="h-full flex flex-col p-4 sm:p-6 bg-slate-900/50 border-0 ring-1 ring-white/5">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-indigo-400">
                                <TrendingUp size={18} />
                                <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">Performance</h3>
                            </div>
                            <span className="text-[9px] sm:text-[10px] text-slate-500 bg-slate-800 border border-white/5 px-2 py-1 rounded font-mono">XIRR</span>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">12.4%</h3>
                            <p className="text-[10px] sm:text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
                                <ArrowUpRight size={12} /> Outperforming {benchmark}
                            </p>
                        </div>

                        {/* Benchmark Toggle */}
                        <div className="flex bg-slate-950 p-1 rounded-lg border border-white/5 mb-4 w-fit">
                            {['S&P 500', 'CPI'].map(b => (
                                <button key={b} onClick={() => setBenchmark(b)}
                                    className={`px-3 py-1 rounded-md text-[9px] sm:text-[10px] font-bold transition-all ${benchmark === b ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                                        }`}
                                >{b}</button>
                            ))}
                        </div>

                        <div className="flex-1 min-h-[160px] w-full relative -ml-2 md:-ml-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceData}>
                                    <defs>
                                        <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="month" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip content={<CustomTooltip prefix="£" />} />
                                    <Area type="monotone" dataKey="portfolio" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorPortfolio)" />
                                    <Area type="monotone" dataKey="benchmark" stroke="#475569" strokeWidth={2} strokeDasharray="4 4" fill="none" opacity={0.5} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </DashboardCard>
                </div>

                {/* --- 3. Retirement Planner (New Feature, Styled) --- */}
                <div className="col-span-12 md:col-span-6">
                    <RetirementPlanner />
                </div>

                {/* --- 4. Fee Scanner (Refactored Layout) --- */}
                <div className="col-span-12 md:col-span-6">
                    <DashboardCard title="Fee Scanner" className="h-full p-0 overflow-hidden border-0 ring-1 ring-white/5">
                        <div className="flex flex-col h-full">
                            <div className="p-4 sm:p-6 bg-gradient-to-b from-rose-500/10 to-transparent relative">
                                <div className="flex gap-4">
                                    <div className="p-3 bg-rose-500/20 rounded-xl text-rose-400 h-fit">
                                        <AlertCircle size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm sm:text-base text-white">Fee Alert Detected</h4>
                                        <p className="text-xs sm:text-sm text-rose-200/70 mt-1">
                                            Aviva Legacy Pension is charging <span className="text-white font-bold bg-rose-500/20 px-1 rounded">1.5%</span>.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 sm:p-6 pt-2 flex-1 flex flex-col gap-6">
                                <SmartSlider
                                    label="Projection Timeframe" min={5} max={40} step={5}
                                    value={projectionYears} onChange={setProjectionYears} unit=" Years"
                                />

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-slate-950 p-3 rounded-lg border border-white/5">
                                        <div className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-bold">Cost Today</div>
                                        <div className="text-rose-400 font-mono font-bold text-base sm:text-lg">{formatCurrency(feeResults.highFeeFV)}</div>
                                    </div>
                                    <div className="bg-emerald-900/10 p-3 rounded-lg border border-emerald-500/10">
                                        <div className="text-[9px] sm:text-[10px] text-emerald-500/60 uppercase font-bold">Optimised</div>
                                        <div className="text-emerald-400 font-mono font-bold text-base sm:text-lg">{formatCurrency(feeResults.lowFeeFV)}</div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => onInteract('Review Switch')}
                                    className="mt-auto w-full py-2 sm:py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-white/10 transition-colors flex items-center justify-center gap-2"
                                >
                                    Review Switch <ShieldCheck size={14} />
                                </button>
                            </div>
                        </div>
                    </DashboardCard>
                </div>
            </div>

            {/* --- 5. Floating AI Bar --- */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="fixed bottom-8 left-0 right-0 z-40 px-4 pointer-events-none"
            >
                <div className="mx-auto max-w-2xl pointer-events-auto group">
                    {/* Suggestions */}
                    <div className="flex justify-center gap-2 mb-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        {['Retire at 55', 'Market Crash Sim', 'Add Cash'].map(tag => (
                            <button key={tag} onClick={() => setAiQuery(tag)}
                                className="px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-[9px] sm:text-[10px] font-bold text-slate-400 hover:text-white hover:border-indigo-500/50 transition-colors backdrop-blur-md">
                                {tag}
                            </button>
                        ))}
                    </div>

                    <div className="bg-slate-900/90 border border-indigo-500/30 rounded-full p-2 pl-4 flex items-center shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
                        <Brain size={20} className="text-indigo-400 shrink-0 animate-pulse" />
                        <input
                            value={aiQuery}
                            onChange={(e) => setAiQuery(e.target.value)}
                            placeholder="Ask Architect: What if I retire at 55?"
                            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 text-xs sm:text-sm py-2 px-4 outline-none"
                        />
                        <button
                            onClick={() => onInteract(aiQuery)}
                            className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-colors shadow-lg shadow-indigo-900/20"
                        >
                            Ask
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}