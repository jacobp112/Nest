import React, { useMemo, useState, useEffect, createContext, useContext, useCallback, useRef } from 'react';
import {
  Landmark, PiggyBank, TrendingUp, Wallet, CreditCard, Plus,
  Shield, RefreshCw, Eye, EyeOff, MapPin, Tag, Split, X,
  CheckCircle2, Loader2, ChevronRight, Building2, Coins, Home, Calculator,
  ArrowUpRight, ArrowDownLeft
} from 'lucide-react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { DashboardHeroNumber, DashboardCard } from '../components/DashboardCard.jsx';

// --- 0. Context & Utilities ---

// Create a context to avoid prop-drilling privacy settings
const DashboardContext = createContext();

const useDashboard = () => useContext(DashboardContext);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});

const formatCurrency = (value) => currencyFormatter.format(Number(value) || 0);

// Robust array helper
const asArray = (value) => (Array.isArray(value) ? value : []);

// --- 1. UI Components ---



const RollingNumber = ({ value }) => {
  const spring = useSpring(0, { bounce: 0, duration: 2000 });
  const display = useTransform(spring, (current) => currencyFormatter.format(Math.floor(current)));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span className="tabular-nums tracking-tight">{display}</motion.span>;
};

const PrivacyBlur = ({ children, className = "" }) => {
  const { privacyMode } = useDashboard();

  return (
    <span
      className={`relative inline-block transition-all duration-500 ${privacyMode ? 'blur-md select-none opacity-50' : 'blur-0'} ${className}`}
      aria-hidden={privacyMode}
      title={privacyMode ? "Value hidden" : ""}
    >
      {children}
    </span>
  );
};

// --- 2. Functional Modals ---

const ActionModal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-4 bg-white/5">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10 transition-colors">
              <X size={20} className="text-slate-400" />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const AddAssetWizard = ({ onClose }) => {
  const [step, setStep] = useState(1);

  const handleConnect = () => {
    setStep(3);
    // Simulate API delay
    setTimeout(() => setStep(4), 2000);
    setTimeout(onClose, 3500);
  };

  const assets = [
    { icon: Building2, label: 'Bank Connection', desc: 'Current, Savings, Credit' },
    { icon: Home, label: 'Property', desc: 'Track equity & value' },
    { icon: Coins, label: 'Investment', desc: 'Crypto, Stocks, ISA' },
    { icon: Wallet, label: 'Manual Cash', desc: 'Physical cash or offline assets' },
  ];

  return (
    <div className="min-h-[320px]">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
            <p className="text-sm text-slate-400 mb-4">Select asset type to track:</p>
            {assets.map((opt, i) => (
              <button key={i} onClick={() => setStep(2)} className="w-full flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-emerald-500/30 transition-all group text-left">
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                  <opt.icon size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-200 group-hover:text-white text-sm">{opt.label}</p>
                  <p className="text-[11px] text-slate-500">{opt.desc}</p>
                </div>
                <ChevronRight className="ml-auto text-slate-600 group-hover:text-emerald-500" size={16} />
              </button>
            ))}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <button onClick={() => setStep(1)} className="text-xs text-slate-500 hover:text-white mb-2 flex items-center gap-1">← Back</button>
            <p className="text-sm text-slate-400 mb-4">Select provider (Secure Open Banking)</p>
            <div className="grid grid-cols-3 gap-3">
              {['Monzo', 'Revolut', 'Starling', 'Barclays', 'HSBC', 'Amex'].map((bank) => (
                <button key={bank} onClick={handleConnect} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-emerald-500/30 transition-all active:scale-95">
                  <div className="h-10 w-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                    {bank[0]}
                  </div>
                  <span className="text-xs font-medium text-slate-300">{bank}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-64 text-center space-y-6">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-slate-800 border-t-emerald-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield size={20} className="text-emerald-500" />
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Establishing Secure Link</h4>
              <p className="text-xs text-slate-500 mt-1">Encrypting credentials...</p>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-64 text-center space-y-6">
            <div className="h-20 w-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 ring-4 ring-emerald-500/10">
              <CheckCircle2 size={40} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">Asset Connected</h4>
              <p className="text-sm text-slate-400 mt-1">Your balances are syncing now.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ScenarioPlannerModal = () => {
  const [monthly, setMonthly] = useState(500);
  const [years, setYears] = useState(10);
  const rate = 0.06;

  const futureValue = useMemo(() => {
    return monthly * 12 * ((Math.pow(1 + rate, years) - 1) / rate);
  }, [monthly, years]);

  return (
    <div className="space-y-8 py-4">
      <div className="text-center space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Projected Wealth</p>
        <h3 className="text-4xl font-bold text-white tracking-tight">
          {formatCurrency(futureValue)}
        </h3>
        <p className="text-sm text-emerald-400 font-medium">in {years} years @ 6% growth</p>
      </div>

      <div className="space-y-6">
        {[
          { label: 'Monthly Contribution', val: monthly, set: setMonthly, min: 100, max: 5000, step: 50, fmt: formatCurrency },
          { label: 'Time Horizon', val: years, set: setYears, min: 1, max: 40, step: 1, fmt: (v) => `${v} Years` }
        ].map((control, i) => (
          <div key={i} className="space-y-3">
            <div className="flex justify-between text-sm text-slate-300">
              <span>{control.label}</span>
              <span className="font-mono text-white bg-slate-800 px-2 py-1 rounded">{control.fmt(control.val)}</span>
            </div>
            <input
              type="range" min={control.min} max={control.max} step={control.step} value={control.val}
              onChange={(e) => control.set(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 leading-relaxed">
        <strong className="text-indigo-100">Note:</strong> This tool models compound interest for estimation purposes only.
      </div>
    </div>
  );
};

// --- 3. Complex Components (Chart & Lists) ---

const LiveWealthChart = ({ range }) => {
  const [hoverX, setHoverX] = useState(null);
  const tapTimeout = useRef(null);

  // Mock data points based on range
  const points = range === '1M'
    ? [35, 34, 32, 36, 30, 28, 25, 20, 15, 12, 10]
    : [35, 32, 30, 20, 18, 15, 12, 8, 5, 4, 2];

  // Convert points to SVG path
  const generatePath = (pts) => {
    const stepX = 100 / (pts.length - 1);
    let d = `M0,${pts[0]}`;
    for (let i = 1; i < pts.length; i++) {
      const x = i * stepX;
      const prevX = (i - 1) * stepX;
      const cp1x = prevX + (stepX / 2);
      const cp2x = x - (stepX / 2);
      d += ` C${cp1x},${pts[i - 1]} ${cp2x},${pts[i]} ${x},${pts[i]}`;
    }
    return d;
  };

  const pathD = generatePath(points);
  const areaD = `${pathD} V40 H0 Z`;

  const updateHoverPosition = (target, clientX) => {
    if (!target || typeof clientX !== 'number') return;
    const rect = target.getBoundingClientRect();
    const percent = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setHoverX(percent);
  };

  const handleTap = (target, clientX) => {
    updateHoverPosition(target, clientX);
    if (tapTimeout.current) {
      clearTimeout(tapTimeout.current);
    }
    tapTimeout.current = setTimeout(() => {
      setHoverX(null);
    }, 1200);
  };

  useEffect(() => () => {
    if (tapTimeout.current) {
      clearTimeout(tapTimeout.current);
    }
  }, []);

  return (
    <div
      className="relative h-48 w-full overflow-hidden pt-6 cursor-crosshair group"
      onMouseMove={(e) => updateHoverPosition(e.currentTarget, e.clientX)}
      onMouseLeave={() => setHoverX(null)}
      onTouchStart={(e) => {
        if (e.touches?.[0]) {
          handleTap(e.currentTarget, e.touches[0].clientX);
        }
      }}
      onTouchMove={(e) => {
        if (e.touches?.[0]) {
          updateHoverPosition(e.currentTarget, e.touches[0].clientX);
        }
      }}
      onClick={(e) => handleTap(e.currentTarget, e.clientX)}
    >
      <svg viewBox="0 0 100 40" className="h-full w-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Fill Area */}
        <motion.path
          d={areaD}
          fill="url(#chartGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, d: areaD }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* Stroke Line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="#34d399"
          strokeWidth="0.8"
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1, d: pathD }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        {/* Interactive Indicator */}
        {hoverX !== null && (
          <g>
            <line x1={hoverX} y1="0" x2={hoverX} y2="40" stroke="white" strokeOpacity="0.2" strokeDasharray="2 2" />
            <circle cx={hoverX} cy={points[Math.floor((hoverX / 100) * (points.length - 1))]} r="1.5" fill="white" />
          </g>
        )}
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {hoverX !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ left: `${hoverX}%` }}
            className="absolute top-0 -translate-x-1/2 bg-slate-800 text-xs text-white px-2 py-1 rounded border border-white/10 pointer-events-none whitespace-nowrap z-20"
          >
            On Track
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TransactionRow = ({ tx, onInteract }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDebit = tx.type === 'expense';
  const Icon = isDebit ? ArrowDownLeft : ArrowUpRight;

  return (
    <div className="relative group">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center gap-4 py-3 px-3 rounded-xl transition-all cursor-pointer ${isOpen ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'}`}
      >
        <div className={`flex h-8 w-8 items-center justify-center rounded-full border border-white/5 ${isDebit ? 'bg-slate-800 text-slate-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
          <Icon size={14} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">{tx.description}</p>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">Today • {tx.category || 'General'}</p>
        </div>

        <div className={`font-mono text-sm font-medium ${isDebit ? 'text-white' : 'text-emerald-400'}`}>
          <PrivacyBlur>
            {isDebit ? '-' : '+'}{formatCurrency(Math.abs(tx.amount))}
          </PrivacyBlur>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-4 pt-0 ml-12 space-y-3 mt-1">
              <div className="flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); onInteract("Edit Category"); }}
                  className="flex-1 py-1.5 rounded-lg bg-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center gap-2 border border-white/5"
                >
                  <Tag size={12} /> Edit Category
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onInteract("Split Request Sent"); }}
                  className="flex-1 py-1.5 rounded-lg bg-emerald-500/5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 hover:bg-emerald-500/10 transition-colors flex items-center justify-center gap-2 border border-emerald-500/10"
                >
                  <Split size={12} /> Split Bill
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const QuickAction = ({ icon: Icon, label, color, onClick }) => (
  <button
    onClick={onClick}
    className="group flex flex-col items-center gap-3 p-4 rounded-2xl transition-all hover:bg-white/5 active:scale-[0.98] w-24 shrink-0 snap-start"
  >
    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color} text-white shadow-lg ring-1 ring-white/10 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
      <Icon size={20} />
    </div>
    <span className="text-xs font-medium text-slate-400 group-hover:text-white transition-colors">{label}</span>
  </button>
);

// --- 4. Logic & Hooks ---

export const useAccountsNetWorthData = ({ accounts = [], transactions = [] } = {}) => {
  const normalisedAccounts = useMemo(() => {
    const input = asArray(accounts);
    return input.map((account) => {
      const balance = Number(account?.balance) || 0;
      const isLiability = String(account?.type || '').toLowerCase().includes('liability') || balance < 0;
      return {
        ...account,
        balance,
        type: isLiability ? 'liability' : 'asset',
        isLinked: Boolean(account?.provider)
      };
    });
  }, [accounts]);

  const netWorthMetrics = useMemo(() => {
    const assets = normalisedAccounts.filter((a) => a.type === 'asset').reduce((s, a) => s + a.balance, 0);
    const liabilities = normalisedAccounts.filter((a) => a.type === 'liability').reduce((s, a) => s + a.balance, 0);
    return { assets, liabilities, netWorth: assets + liabilities };
  }, [normalisedAccounts]);

  const topTransactions = useMemo(() => {
    return asArray(transactions)
      .slice()
      .sort((a, b) => Math.abs(Number(b?.amount) || 0) - Math.abs(Number(a?.amount) || 0))
      .slice(0, 5)
      .map((tx, i) => ({
        id: tx?.id || i,
        description: tx?.description || 'Transaction',
        amount: Number(tx?.amount) || 0,
        type: tx?.type || 'expense',
        category: tx?.category || 'General',
        date: tx?.date || null,
      }));
  }, [transactions]);

  return { normalisedAccounts, netWorthMetrics, topTransactions };
};

// --- 5. Main View Controller ---

const DashboardContent = ({ accounts, transactions, onInteract, onChangeTab }) => {
  const { normalisedAccounts, netWorthMetrics, topTransactions } = useAccountsNetWorthData({ accounts, transactions });
  const { privacyMode, togglePrivacy } = useDashboard();

  const [chartRange, setChartRange] = useState(() => localStorage.getItem('nest_chart_range') || 'YTD');
  const [activeModal, setActiveModal] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Persist chart range
  useEffect(() => { localStorage.setItem('nest_chart_range', chartRange); }, [chartRange]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      onInteract("Accounts Synced");
    }, 1500);
  }, [onInteract]);

  const triggerHaptic = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(5);
    }
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 pb-20">

      {/* Modals */}
      <ActionModal isOpen={activeModal === 'asset'} onClose={() => setActiveModal(null)} title="Add New Asset">
        <AddAssetWizard onClose={() => setActiveModal(null)} />
      </ActionModal>
      <ActionModal isOpen={activeModal === 'scenario'} onClose={() => setActiveModal(null)} title="Scenario Planner">
        <ScenarioPlannerModal />
      </ActionModal>

      {/* Quick Actions Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 overflow-x-auto pb-4 pt-2 pr-4 snap-x snap-mandatory no-scrollbar md:justify-start md:pr-0"
      >
        <QuickAction icon={Plus} label="Add Asset" color="bg-gradient-to-br from-emerald-500 to-emerald-600" onClick={() => setActiveModal('asset')} />
        <QuickAction icon={RefreshCw} label={isRefreshing ? "Syncing..." : "Refresh"} color={isRefreshing ? "bg-slate-700 animate-pulse" : "bg-gradient-to-br from-blue-500 to-blue-600"} onClick={handleRefresh} />
        <QuickAction icon={Shield} label="Vault" color="bg-gradient-to-br from-indigo-500 to-indigo-600" onClick={() => onChangeTab('vault')} />
        <QuickAction icon={Calculator} label="Forecast" color="bg-gradient-to-br from-amber-500 to-orange-600" onClick={() => setActiveModal('scenario')} />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">

        {/* Main Column */}
        <div className="space-y-6">
          <DashboardCard delay={0.1} className="h-full">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400/80">Net Worth</p>
                  </div>
                  <h2 className="mb-4">
                    <DashboardHeroNumber className="block leading-tight drop-shadow-2xl">
                      <PrivacyBlur>
                        <RollingNumber value={netWorthMetrics.netWorth} />
                      </PrivacyBlur>
                    </DashboardHeroNumber>
                  </h2>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <button
                    onClick={() => {
                      triggerHaptic();
                      togglePrivacy();
                    }}
                    className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white"
                  >
                    {privacyMode ? <Eye size={14} /> : <EyeOff size={14} />}
                    <span className="hidden sm:inline">{privacyMode ? "Show Balances" : "Hide Balances"}</span>
                  </button>

                  <div className="flex bg-slate-950/50 rounded-lg p-1 border border-white/5">
                    {['1M', 'YTD', 'ALL'].map(r => (
                      <button
                        key={r}
                        onClick={() => setChartRange(r)}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${chartRange === r ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <LiveWealthChart range={chartRange} />

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/10 p-5 relative overflow-hidden group">
                  <div className="absolute right-0 top-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
                    <PiggyBank size={64} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1">Assets</p>
                  <p className="text-2xl font-semibold text-emerald-100">
                    <PrivacyBlur>{formatCurrency(netWorthMetrics.assets)}</PrivacyBlur>
                  </p>
                </div>
                <div className="rounded-2xl bg-rose-500/5 border border-rose-500/10 p-5 relative overflow-hidden group">
                  <div className="absolute right-0 top-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
                    <CreditCard size={64} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400 mb-1">Liabilities</p>
                  <p className="text-2xl font-semibold text-rose-100">
                    <PrivacyBlur>{formatCurrency(netWorthMetrics.liabilities)}</PrivacyBlur>
                  </p>
                </div>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard delay={0.2} className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Accounts</h3>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
                {normalisedAccounts.length} Total
              </span>
            </div>
            <div className="space-y-3">
              {normalisedAccounts.slice(0, 4).map((account, idx) => {
                const isLiability = account.type === 'liability';
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.03)' }}
                    onClick={() => onInteract(`${account.name} details`)}
                    className="group flex items-center justify-between p-4 rounded-2xl border border-transparent hover:border-white/5 transition-all cursor-pointer bg-white/[0.01]"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center border border-white/5 ${isLiability ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        {account.provider ? <Building2 size={16} /> : <Wallet size={16} />}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-200 group-hover:text-white transition-colors">{account?.name}</p>
                        <p className="text-[11px] text-slate-500">{account?.provider || 'Manual Entry'}</p>
                      </div>
                    </div>
                    <p className={`font-mono text-sm font-medium ${isLiability ? 'text-rose-300' : 'text-emerald-300'}`}>
                      <PrivacyBlur>{formatCurrency(account.balance)}</PrivacyBlur>
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </DashboardCard>
        </div>

        {/* Side Column */}
        <div className="space-y-6">
          <DashboardCard delay={0.3} className="h-full flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Recent Activity</h3>
              <button onClick={() => onInteract('Transaction history')} className="text-xs font-bold text-slate-500 hover:text-white transition-colors">
                View All
              </button>
            </div>
            <div className="relative flex-1 space-y-1">
              <div className="absolute left-[1.1rem] top-3 bottom-3 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent" />
              {topTransactions.map((tx, idx) => (
                <TransactionRow key={idx} tx={tx} onInteract={onInteract} />
              ))}
            </div>
          </DashboardCard>

          <DashboardCard delay={0.4} className="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border-indigo-500/20">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/30">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-indigo-100 text-sm">Wealth Forecast</h4>
                  <p className="text-[10px] text-indigo-300/70">Compound Growth Model</p>
                </div>
              </div>
              <div className="h-24 w-full flex items-end justify-between gap-1 px-1 mt-2">
                {[30, 45, 35, 60, 50, 75, 65, 90].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                    className="w-full bg-indigo-500/30 rounded-t-sm hover:bg-indigo-400/50 transition-colors cursor-pointer"
                    onClick={() => setActiveModal('scenario')}
                  />
                ))}
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

// --- Root Wrapper ---

const AccountsNetWorthView = (props) => {
  // Use state with function initializer for lazy localStorage access
  const [privacyMode, setPrivacyMode] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('nest_privacy_mode')) || false;
    } catch { return false; }
  });

  const togglePrivacy = () => {
    setPrivacyMode(prev => {
      const next = !prev;
      localStorage.setItem('nest_privacy_mode', JSON.stringify(next));
      return next;
    });
  };

  return (
    <DashboardContext.Provider value={{ privacyMode, togglePrivacy }}>
      <DashboardContent {...props} />
    </DashboardContext.Provider>
  );
};

export { currencyFormatter, formatCurrency };
export default AccountsNetWorthView;
