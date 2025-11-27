import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Zap, Bell, Check, User, AlertCircle, ShieldCheck, HeartCrack, TrendingDown } from 'lucide-react';
import { DashboardCard } from '../DashboardCard.jsx';

// --- Helper Components ---

// Floating background particles for atmosphere
const BackgroundParticles = ({ mode }) => {
    const color = mode === 'guilt' ? 'bg-rose-500' : mode === 'hope' ? 'bg-indigo-400' : 'bg-slate-700';
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    className={`absolute w-1 h-1 rounded-full ${color} opacity-20`}
                    initial={{
                        x: Math.random() * 100 + "%",
                        y: Math.random() * 100 + "%",
                        scale: 0
                    }}
                    animate={{
                        y: [null, Math.random() * -100 + "%"],
                        opacity: [0, 0.5, 0],
                        scale: [0, 1.5, 0]
                    }}
                    transition={{
                        duration: Math.random() * 5 + 5,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 2
                    }}
                />
            ))}
        </div>
    );
};

export const NetWorthCard = ({ value = "£142,500", change = "+£3,200", graphData = [10, 25, 40, 35, 50, 65, 85] }) => {
    return (
        <DashboardCard className="w-80 p-6">
            <div className="mb-4">
                <h3 className="text-sm font-medium text-slate-400">Total Net Worth</h3>
                <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">{value}</span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">{change}</span>
                </div>
            </div>

            <div className="h-24 flex items-end gap-1">
                {graphData.map((h, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.05, duration: 0.5, type: "spring" }}
                        className="flex-1 bg-emerald-500/20 rounded-t-sm hover:bg-emerald-500/40 transition-colors"
                    />
                ))}
            </div>
        </DashboardCard>
    );
};

export const SubscriptionCard = ({ name = "Netflix", cost = "£15.99", cycle = "Monthly" }) => {
    return (
        <DashboardCard className="w-72 p-0 overflow-hidden border-rose-500/20">
            <div className="bg-rose-500/10 p-4 border-b border-rose-500/10 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                    <Zap size={18} />
                </div>
                <span className="font-bold text-rose-100">Recurring Detected</span>
            </div>
            <div className="p-4 bg-slate-900/40">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h4 className="font-bold text-white">{name}</h4>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">{cycle}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-mono text-lg text-white">{cost}</p>
                    </div>
                </div>
                <button className="w-full py-2 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-bold uppercase hover:bg-rose-500 hover:text-white transition-colors">
                    Cancel Subscription?
                </button>
            </div>
        </DashboardCard>
    );
};

export const NotificationToast = ({ title = "Budget Alert", message = "You've exceeded your dining budget.", type = "alert" }) => {
    const isSuccess = type === 'success';
    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`flex items-center gap-4 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl w-80 ${isSuccess
                ? 'border-emerald-500/20 bg-emerald-900/40'
                : 'border-amber-500/20 bg-amber-900/40'
                }`}
        >
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isSuccess ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                {isSuccess ? <Check size={20} /> : <Bell size={20} />}
            </div>
            <div>
                <h4 className={`text-sm font-bold ${isSuccess ? 'text-emerald-100' : 'text-amber-100'}`}>{title}</h4>
                <p className="text-xs text-slate-300">{message}</p>
            </div>
        </motion.div>
    );
};

export const ProblemScenarioView = ({ step }) => {

    // Dynamic background based on emotional state
    const getBackgroundGradient = () => {
        switch (step) {
            case 'guilt': return 'bg-gradient-to-br from-rose-950 via-slate-950 to-black';
            case 'hope': return 'bg-gradient-to-b from-indigo-950 via-slate-900 to-black';
            case 'reveal': return 'bg-gradient-to-br from-emerald-950 via-slate-900 to-black';
            default: return 'bg-black';
        }
    };

    return (
        <motion.div
            className={`h-full w-full flex items-center justify-center text-white p-8 text-center relative overflow-hidden transition-colors duration-1000 ${getBackgroundGradient()}`}
        >
            <BackgroundParticles mode={step} />

            {/* 0:00 - 0:01 Intro */}
            <AnimatePresence mode="wait">
                {step === 'intro' && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
                        className="max-w-md z-10"
                    >
                        <motion.h2 className="text-3xl font-light leading-relaxed text-slate-200">
                            Money is the <span className="text-white font-bold">#1 source of stress</span>
                            <br />for modern families.
                        </motion.h2>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 0:01 - 0:03 Alone (Isolation) */}
            <AnimatePresence>
                {step === 'alone' && (
                    <motion.div
                        key="alone"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center z-10"
                    >
                        <motion.h2
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-2xl font-light mb-16 text-slate-300"
                        >
                            Yet everyone deals with it <span className="text-white border-b border-white/20 pb-1">alone</span>.
                        </motion.h2>

                        {/* The "Islands" Visualization */}
                        <div className="flex gap-8">
                            {[1, 2, 3, 4].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: i * 0.1, type: "spring" }}
                                    className="relative"
                                >
                                    {/* Pulse Effect */}
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                                        className="absolute inset-0 rounded-full bg-slate-500/20"
                                    />
                                    <div className="w-14 h-14 rounded-full bg-slate-800/80 border border-slate-600 flex items-center justify-center backdrop-blur-sm relative z-10">
                                        <User size={20} className="text-slate-400" />
                                    </div>
                                    {/* Lock Icon to symbolize privacy/secrecy */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 1 + (i * 0.1) }}
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center border border-slate-700"
                                    >
                                        <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 0:03 - 0:06 Guilt (Chaos & Stress) */}
            <AnimatePresence>
                {step === 'guilt' && (
                    <motion.div
                        key="guilt"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center z-10"
                    >
                        {/* Red vignette */}
                        <div className="absolute inset-0 bg-rose-500/10 radial-gradient-vignette" />

                        <div className="flex gap-16 mb-8">
                            {[1, 2, 3, 4].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        x: (i - 2.5) * 60, // Drifting further apart
                                        y: [0, -5, 5, 0], // Shaking vertically
                                        opacity: 0.4
                                    }}
                                    transition={{ x: { duration: 3 }, y: { repeat: Infinity, duration: 0.2 } }}
                                    className="w-14 h-14 rounded-full bg-rose-950/50 border border-rose-500/30 flex items-center justify-center grayscale"
                                >
                                    <HeartCrack size={20} className="text-rose-500/50" />
                                </motion.div>
                            ))}
                        </div>

                        {/* Text Attacks */}
                        <div className="relative h-32 w-full max-w-lg">
                            {[
                                { text: "Budgeting Guilt", delay: 0, x: "-30%", y: "-40%", rotate: -5 },
                                { text: "Debt Shame", delay: 0.8, x: "30%", y: "20%", rotate: 5 },
                                { text: "Silent Arguments", delay: 1.6, x: "0%", y: "50%", rotate: 0 }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 2, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3, delay: item.delay, type: "spring" }}
                                    style={{ left: "50%", top: "50%", x: item.x, y: item.y, rotate: item.rotate }}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
                                >
                                    <div className="flex items-center gap-2 text-rose-200 font-bold text-2xl drop-shadow-[0_0_15px_rgba(225,29,72,0.5)]">
                                        <AlertCircle size={24} className="text-rose-500" />
                                        {item.text}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 0:06 - 0:08 Hope (The Turn) */}
            <AnimatePresence>
                {step === 'hope' && (
                    <motion.div
                        key="hope"
                        className="absolute inset-0 flex items-center justify-center z-20"
                    >
                        {/* Sunrise Effect */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 4, opacity: 0.2 }}
                            transition={{ duration: 1.5 }}
                            className="absolute bg-indigo-500 rounded-full w-96 h-96 blur-[100px]"
                        />

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="relative z-10 flex flex-col items-center gap-6"
                        >
                            <div className="p-4 bg-indigo-500/20 rounded-full border border-indigo-400/30 backdrop-blur-md">
                                <ShieldCheck size={48} className="text-indigo-300" />
                            </div>
                            <h2 className="text-4xl font-bold text-white tracking-tight drop-shadow-2xl">
                                It doesn’t have to be this way.
                            </h2>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 0:08 - 0:12 Reveal (The Solution) */}
            <AnimatePresence>
                {step === 'reveal' && (
                    <motion.div
                        key="reveal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex flex-col items-center justify-center z-10"
                    >
                        {/* Ambient Glow */}
                        <motion.div
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]"
                        />

                        <motion.div
                            initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            transition={{ type: "spring", duration: 1.5, bounce: 0.5 }}
                            className="w-32 h-32 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-[2rem] mb-8 flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.4)] relative"
                        >
                            <span className="text-6xl filter drop-shadow-lg">🥚</span>
                            {/* Shine effect on logo */}
                            <motion.div
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                                className="absolute inset-0 bg-white/20 skew-x-12 w-1/2 overflow-hidden opacity-50"
                            />
                        </motion.div>

                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-6xl font-display font-bold mb-4 tracking-tighter"
                        >
                            Nest
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="text-emerald-100/60 text-sm uppercase tracking-[0.3em] font-medium"
                        >
                            The Operating System for your Family
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
