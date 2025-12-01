import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Plus,
  Shield,
  Crown,
  LogOut,
  TrendingUp,
  GraduationCap,
  ArrowRight,
  PieChart,
  ScrollText,
  Check,
  X,
  Gavel,
  Lock,
  Home
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, ReferenceDot, Label
} from 'recharts';
import { DashboardCard } from '../../components/DashboardCard.jsx';

// --- 1. Premium Micro-Components ---

const Avatar = ({ initial, color, size = 'md', isOnline, glowColor }) => {
  const sizeClasses = size === 'lg' ? 'h-14 w-14 text-lg' : 'h-10 w-10 text-xs';

  return (
    <div className="relative group">
      {/* Dynamic Glow */}
      <div className={`absolute -inset-2 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-500 ${glowColor}`} />

      <div className={`${sizeClasses} relative rounded-full bg-[#0B0F19] flex items-center justify-center font-display font-bold text-white border border-white/10 shadow-xl z-10 ring-1 ring-white/5`}>
        {initial}
      </div>

      {isOnline && (
        <div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 rounded-full border-2 border-[#0B0F19] z-20 shadow-[0_0_8px_#10b981]" />
      )}
    </div>
  );
};

// RE-DESIGNED: Tighter Solar System with perfect centering
const HouseholdSystem = ({ members }) => {
  return (
    <div className="relative w-full h-[260px] flex items-center justify-center mt-2">

      {/* Orbit Tracks (SVG) - Reduced Radius to prevent clipping */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        {/* Inner Ring */}
        <circle cx="50%" cy="50%" r="60" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
        {/* Outer Ring - Reduced from 130 to 100 to fit container */}
        <circle cx="50%" cy="50%" r="100" fill="none" stroke="white" strokeWidth="1" opacity="0.5" />
      </svg>

      {/* Central Core (Home Base) */}
      <div className="relative z-20">
        <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
        <div className="h-16 w-16 rounded-full bg-[#0B0F19] border border-indigo-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.3)] relative z-10">
          <Home size={20} className="text-indigo-400" />
        </div>
      </div>

      {/* Member Satellites */}
      {members.map((m, i) => {
        const isLeft = i === 0;
        // Distance from center in pixels (Matches the outer ring r=100)
        const distance = 100;
        const xOffset = isLeft ? -distance : distance;

        return (
          <motion.div
            key={m.id}
            initial={{ scale: 0, opacity: 0, x: 0 }}
            animate={{ scale: 1, opacity: 1, x: xOffset }}
            transition={{ delay: 0.3 + (i * 0.2), type: "spring", stiffness: 100, damping: 15 }}
            // Absolute center, then translate X to the ring position
            className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-30 flex flex-col items-center"
            style={{ width: 'auto' }} // Allow content to size naturally
          >
            <div className={`flex items-center gap-3 ${isLeft ? 'flex-row-reverse' : 'flex-row'}`}>

              {/* Tether Line - Animated to connect core to node */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 30, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className={`h-[1px] bg-gradient-to-r from-indigo-500/50 to-transparent ${isLeft ? 'order-last' : ''}`}
              />

              <div className="flex flex-col items-center gap-2 bg-[#0B0F19]/80 p-2 rounded-2xl backdrop-blur-sm border border-white/5">
                <Avatar initial={m.name[0]} color="" glowColor={m.glow} size="lg" isOnline={true} />
                <div className="flex flex-col text-center min-w-[60px]">
                  <span className="text-xs font-bold text-white whitespace-nowrap">{m.name}</span>
                  <span className={`text-[9px] uppercase tracking-wider font-bold ${m.role === 'Admin' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {m.role}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

const GenerationalGraph = () => {
  const data = useMemo(() => {
    const startYear = 2024;
    let amount = 150000;
    return Array.from({ length: 20 }, (_, i) => {
      amount = amount * 1.08 + 24000;
      return { year: startYear + i, amount: Math.round(amount) };
    });
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-amber-500/30 p-3 rounded-xl backdrop-blur-xl shadow-2xl">
          <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">Year {label}</p>
          <p className="text-amber-400 font-mono font-bold text-base sm:text-lg">
            £{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[220px] w-full -ml-4 relative z-10">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity={0} />
            </linearGradient>
            <filter id="glow" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <XAxis dataKey="year" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#fbbf24', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#fbbf24"
            strokeWidth={3}
            fill="url(#colorWealth)"
            filter="url(#glow)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- Main View ---

const FamilyView = ({ onInteract = () => { }, className = '' }) => {
  const members = [
    { id: 1, name: 'Alex', role: 'Admin', glow: 'bg-indigo-500', contribution: 55, barColor: 'bg-indigo-500' },
    { id: 2, name: 'Jamie', role: 'Member', glow: 'bg-emerald-500', contribution: 45, barColor: 'bg-emerald-500' },
  ];

  return (
    <div className={`mx-auto w-full max-w-6xl space-y-6 sm:space-y-8 pb-20 ${className}`}>

      {/* 1. Hero Section: Household & Legacy */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_1.5fr]">

        {/* Household System */}
        <DashboardCard className="relative overflow-hidden border-0 ring-1 ring-white/5 bg-[#0B0F19] p-0 group h-full">

          {/* Ambient Blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 p-4 sm:p-6 flex flex-col h-full">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Users size={18} className="text-indigo-400" /> Household
                </h3>
                <p className="text-xs text-slate-400">Circle of Trust</p>
              </div>
              <button onClick={() => onInteract("Invite")} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white transition-colors">
                + Add
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <HouseholdSystem members={members} />
            </div>
          </div>
        </DashboardCard>

        {/* Legacy Projection */}
        <DashboardCard className="relative overflow-hidden border-0 ring-1 ring-white/5 bg-[#0B0F19] flex flex-col h-full">

          {/* Ambient Blobs */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 p-4 sm:p-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp size={18} className="text-amber-400" /> Legacy Projection
                </h3>
                <p className="text-xs text-slate-400">30-Year Trajectory</p>
              </div>
              <div className="text-right">
                <div className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">£1.4M</div>
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">On Track</div>
              </div>
            </div>

            <div className="flex-1 min-h-[200px]">
              <GenerationalGraph />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <button
                onClick={() => onInteract('Plan Inheritance')}
                className="w-full py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2 text-xs font-bold text-amber-200 uppercase tracking-wider"
              >
                Plan Inheritance <ArrowRight size={14} />
              </button>
              <button
                onClick={() => onInteract('Trust Fund')}
                className="w-full py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider"
              >
                Open Trust Fund
              </button>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* 2. Governance Grid */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">

        {/* Constitution */}
        <DashboardCard className="border-0 ring-1 ring-white/5 bg-[#0B0F19] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <ScrollText size={120} className="text-slate-600" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">Constitution</h3>
                <p className="text-xs text-slate-400">Active Rules</p>
              </div>
            </div>

            <div className="space-y-3">
              {["Consult on purchases > £100", "20% Income to Savings"].map((rule, i) => (
                <div key={i} className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
                    <span className="text-xs sm:text-sm text-slate-200 font-medium group-hover:text-white transition-colors">{rule}</span>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-400 opacity-50 group-hover:opacity-100">ACTIVE</span>
                </div>
              ))}
              <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 border-dashed">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-xs sm:text-sm text-amber-200/80 font-medium">No Tech after 9pm</span>
                </div>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded">PROPOSED</span>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* Voting Terminal */}
        <DashboardCard className="border-0 ring-1 ring-white/5 bg-[#0B0F19] flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Gavel size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Voting Terminal</h3>
              <p className="text-xs text-slate-400">Pending Decisions</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              whileHover={{ y: -2 }}
              className="relative p-4 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 shadow-2xl"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-full bg-slate-950 border border-white/10 text-[9px] font-bold text-slate-400 uppercase tracking-widest shadow-lg">
                Vote Required
              </div>

              <div className="text-center mb-6 mt-2">
                <h4 className="text-lg sm:text-xl font-bold text-white">Switch Energy Provider</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Switching to Octopus Agile could save approx. <strong>£240/year</strong>. Requires smart meter installation.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => onInteract("Vote Yes")} className="py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider hover:bg-emerald-500 hover:text-white transition-all flex flex-col items-center gap-1">
                  <Check size={18} /> Approve
                </button>
                <button onClick={() => onInteract("Vote No")} className="py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider hover:bg-rose-500 hover:text-white transition-all flex flex-col items-center gap-1">
                  <X size={18} /> Veto
                </button>
              </div>
            </motion.div>
          </div>
        </DashboardCard>
      </div>

      {/* 3. Load Balancing */}
      <DashboardCard className="border-0 ring-1 ring-white/5 bg-[#0B0F19]">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-slate-400 border border-white/10">
              <PieChart size={20} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">Contribution Balance</h3>
          </div>
          <button onClick={() => onInteract("Rebalance")} className="text-xs text-indigo-400 hover:text-white transition-colors font-bold uppercase tracking-wider">
            Auto-Rebalance &rarr;
          </button>
        </div>

        {/* Custom Bar Chart */}
        <div className="space-y-2">
          <div className="flex h-12 w-full overflow-hidden rounded-xl bg-slate-900 border border-white/5 relative">
            {members.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ width: 0 }}
                animate={{ width: `${m.contribution}%` }}
                transition={{ duration: 1.5, ease: "circOut", delay: i * 0.2 }}
                className={`h-full ${m.barColor} relative group border-r border-slate-900/50`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-bold text-white drop-shadow-md">{m.contribution}%</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-between px-1">
            {members.map(m => (
              <div key={m.id} className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${m.barColor}`} />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{m.name}</span>
              </div>
            ))}
          </div>
        </div>
      </DashboardCard>

    </div>
  );
};

export default FamilyView;