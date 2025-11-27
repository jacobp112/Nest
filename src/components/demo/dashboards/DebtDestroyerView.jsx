import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, Calendar, ArrowRight, Wallet, AlertCircle } from 'lucide-react';
import { DashboardCard } from '../../DashboardCard.jsx';

export default function DebtDestroyerView({ onInteract }) {
    const [strategy, setStrategy] = useState('avalanche');
    const [extraPayment, setExtraPayment] = useState(100);

    // Mock calculations
    const freedomDate = strategy === 'avalanche' ? 'August 2026' : 'November 2026';
    const interestSaved = strategy === 'avalanche' ? 4250 : 3100;
    const monthsFaster = Math.floor(extraPayment / 20);

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-20">
            {/* HERO: Freedom Countdown */}
            <div className="col-span-12 md:col-span-8">
                <DashboardCard className="relative overflow-hidden min-h-[300px] flex flex-col justify-center items-center text-center p-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-slate-900 to-slate-900" />
                    <div className="relative z-10 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-widest">
                            <Calendar size={12} /> Freedom Date
                        </div>

                        <motion.div
                            key={freedomDate}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="space-y-2"
                        >
                            <h2 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight">
                                {freedomDate}
                            </h2>
                            <p className="text-slate-400 text-lg">
                                You will be debt-free in <span className="text-white font-bold">18 months</span>.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mt-8">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <p className="text-xs text-slate-500 uppercase tracking-wider">Interest Saved</p>
                                <p className="text-2xl font-bold text-emerald-400">£{interestSaved.toLocaleString()}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <p className="text-xs text-slate-500 uppercase tracking-wider">Time Saved</p>
                                <p className="text-2xl font-bold text-white">{monthsFaster + 4} Months</p>
                            </div>
                        </div>
                    </div>
                </DashboardCard>
            </div>

            {/* STRATEGY SELECTOR */}
            <div className="col-span-12 md:col-span-4 space-y-6">
                <DashboardCard title="Payoff Strategy" className="h-full">
                    <div className="space-y-6">
                        <div className="flex bg-slate-900 p-1 rounded-xl border border-white/10">
                            <button
                                onClick={() => setStrategy('snowball')}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${strategy === 'snowball' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                Snowball
                                <span className="block text-[10px] opacity-60 font-normal">Quick Wins</span>
                            </button>
                            <button
                                onClick={() => setStrategy('avalanche')}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${strategy === 'avalanche' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                Avalanche
                                <span className="block text-[10px] opacity-60 font-normal">Save Interest</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Extra Monthly Payment</span>
                                <span className="text-white font-bold">£{extraPayment}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="500"
                                step="10"
                                value={extraPayment}
                                onChange={(e) => setExtraPayment(Number(e.target.value))}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                            />
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Adding just £50/mo saves you £1,200 in interest over the loan term.
                            </p>
                        </div>
                    </div>
                </DashboardCard>
            </div>

            {/* DEBT LIST */}
            <div className="col-span-12">
                <DashboardCard title="Your Debts">
                    <div className="space-y-3">
                        {[
                            { name: 'Amex Platinum', balance: 1200, rate: '22.9%', min: 50, strategy: 'Pay Off Now' },
                            { name: 'Student Loan', balance: 24000, rate: '6.5%', min: 120, strategy: 'Minimum' },
                            { name: 'Car Finance', balance: 8500, rate: '4.9%', min: 250, strategy: 'Minimum' },
                        ].map((debt, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
                                        <TrendingDown size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{debt.name}</h4>
                                        <p className="text-xs text-slate-400">{debt.rate} APR • Min: £{debt.min}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-white">£{debt.balance.toLocaleString()}</p>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${debt.strategy === 'Pay Off Now' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                                        }`}>
                                        {debt.strategy}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </DashboardCard>
            </div>
        </div>
    );
}
