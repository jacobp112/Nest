import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Zap, Bell, Check, User, AlertCircle, ShieldCheck, HeartCrack, TrendingDown, Lock, X } from 'lucide-react';
import { DashboardCard } from './MarketingComponents.jsx'; // Adjust path as needed

// --- Helper Components ---

// A glitchy text effect for the "Guilt" phase
const GlitchText = ({ children }) => {
    return (
        <div className="relative inline-block">
            <motion.span
                className="absolute top-0 left-0 -ml-[2px] text-rose-500 opacity-70 mix-blend-screen"
                animate={{ x: [0, -2, 2, 0], y: [0, 1, -1, 0] }}
                transition={{ repeat: Infinity, duration: 0.2, repeatType: "mirror" }}
            >
                {children}
            </motion.span>
            <motion.span
                className="absolute top-0 left-0 ml-[2px] text-cyan-500 opacity-70 mix-blend-screen"
                animate={{ x: [0, 2, -2, 0], y: [0, -1, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.3, repeatType: "mirror" }}
            >
                {children}
            </motion.span>
            <span className="relative z-10">{children}</span>
        </div>
    );
};

// Dynamic Background that shifts based on mood
const DynamicBackground = ({ step }) => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Base Gradient Layer */}
            <motion.div
                className="absolute inset-0"
                animate={{
                    background: step === 'guilt'
                        ? 'linear-gradient(135deg, #2a0a0a 0%, #000000 100%)' // Dark Red/Black
                        : step === 'hope'
                            ? 'linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)' // Indigo/Blue
                            : step === 'reveal'
                                ? 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)' // Emerald
                                : 'linear-gradient(135deg, #0f172a 0%, #000000 100%)' // Slate/Black (Default)
                }}
                transition={{ duration: 1 }}
            />

            {/* Guilt: Static Noise Overlay */}
            {step === 'guilt' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.15 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-150 contrast-150"
                />
            )}

            {/* Hope/Reveal: Floating Orbs */}
            {(step === 'hope' || step === 'reveal') && (
                <div className="absolute inset-0">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className={`absolute rounded-full blur-[80px] opacity-30 ${step === 'reveal' ? 'bg-emerald-500' : 'bg-indigo-400'}`}
                            initial={{
                                width: Math.random() * 200 + 100,
                                height: Math.random() * 200 + 100,
                                x: Math.random() * 100 + "%",
                                y: Math.random() * 100 + "%",
                            }}
                            animate={{
                                y: [null, Math.random() * -50 + "%"],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: Math.random() * 10 + 10,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Main Component ---

export const ProblemScenarioView = ({ step }) => {
    return (
        <div className="h-full w-full flex items-center justify-center text-white p-8 text-center relative overflow-hidden font-sans">
            <DynamicBackground step={step} />

            {/* 0:00 - 0:01 Intro */}
            <AnimatePresence mode="wait">
                {step === 'intro' && (
                    <motion.div
                        key="intro"
                        className="max-w-xl z-10 flex flex-col items-center gap-6"
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700 shadow-2xl mb-4"
                        >
                            <TrendingDown size={32} className="text-slate-400" />
                        </motion.div>

                        <h2 className="text-4xl md:text-5xl font-light leading-tight text-slate-300">
                            Money is the <br />
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="font-bold text-white inline-block mt-2"
                            >
                                #1 source of stress
                            </motion.span>
                        </h2>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 0:03 - 0:08 Alone (Isolation) */}
            <AnimatePresence>
                {step === 'alone' && (
                    <motion.div
                        key="alone"
                        className="absolute inset-0 flex flex-col items-center justify-center z-10"
                        exit={{ opacity: 0, scale: 0.9 }}
                    >
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-3xl font-light mb-24 text-slate-300 tracking-wide"
                        >
                            Everyone deals with it <span className="font-bold text-white">alone</span>.
                        </motion.h2>

                        {/* Visualizing "Silos" - The Triangle Formation */}
                        <div className="relative w-full max-w-2xl h-64">
                            {[
                                { id: 1, x: '50%', y: '10%', label: "Mom", delay: 0 },
                                { id: 2, x: '20%', y: '90%', label: "Partner", delay: 1 },
                                { id: 3, x: '80%', y: '90%', label: "Dad", delay: 2 },
                            ].map((user) => (
                                <motion.div
                                    key={user.id}
                                    initial={{ left: user.x, top: user.y, scale: 0 }}
                                    animate={{ left: user.x, top: user.y, scale: 1 }}
                                    transition={{ duration: 1, type: "spring" }}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4"
                                >
                                    <div className="relative">

                                        {/* THE SIGNAL JAM ANIMATION */}
                                        {/* 1. The Ripple trying to escape */}
                                        <motion.div
                                            animate={{
                                                scale: [1, 2.5],
                                                opacity: [0.5, 0],
                                                borderColor: ["#94a3b8", "#f43f5e"] // Slate to Red
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                delay: user.delay
                                            }}
                                            className="absolute inset-0 rounded-full border-2 border-slate-400"
                                        />

                                        {/* 2. The "Blocked" Wall Effect */}
                                        <motion.div
                                            animate={{ opacity: [0, 1, 0], scale: [1.8, 1.8, 1.8] }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                delay: user.delay + 0.5, // Syncs with ripple turning red
                                                times: [0, 0.1, 1]
                                            }}
                                            className="absolute inset-0 rounded-full border border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)]"
                                        />

                                        {/* User Bubble */}
                                        <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shadow-xl relative z-20">
                                            <User size={32} className="text-slate-300" />

                                            {/* Lock Icon (Status Indicator) */}
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 1 }}
                                                className="absolute -top-2 -right-2 bg-black rounded-full p-1.5 border border-rose-500/50 shadow-lg"
                                            >
                                                <Lock size={14} className="text-rose-500" />
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Label */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1 }}
                                        className="flex flex-col items-center"
                                    >
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{user.label}</span>
                                        <span className="text-[10px] font-mono text-rose-500 mt-1">DISCONNECTED</span>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 0:03 - 0:06 Guilt (Chaos) */}
            <AnimatePresence>
                {step === 'guilt' && (
                    <motion.div
                        key="guilt"
                        className="absolute inset-0 flex flex-col items-center justify-center z-10"
                        exit={{ opacity: 0 }}
                    >
                        {/* Camera Shake Effect */}
                        <motion.div
                            animate={{ x: [-2, 2, -2, 2, 0], y: [1, -1, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.15 }}
                            className="relative w-full h-full flex items-center justify-center"
                        >
                            <div className="absolute inset-0 bg-rose-500/10 mix-blend-overlay z-0" />

                            <motion.div className="z-10 flex flex-col gap-8 items-center">
                                <motion.div
                                    initial={{ scale: 2, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="p-6 rounded-full bg-rose-500/20 border border-rose-500 text-rose-500"
                                >
                                    <HeartCrack size={64} />
                                </motion.div>

                                <div className="space-y-4 text-center">
                                    <h2 className="text-5xl font-black uppercase tracking-tighter">
                                        <GlitchText>GUILT</GlitchText>
                                    </h2>
                                    <div className="flex flex-wrap justify-center gap-3 max-w-md">
                                        {["Hidden Debt", "Overspending", "Anxiety", "Arguments"].map((text, i) => (
                                            <motion.span
                                                key={i}
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="px-3 py-1 bg-rose-950 border border-rose-800 text-rose-200 text-xs font-bold uppercase rounded"
                                            >
                                                {text}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 0:06 - 0:08 Hope (The Turn) */}
            <AnimatePresence>
                {step === 'hope' && (
                    <motion.div
                        key="hope"
                        className="absolute inset-0 flex items-center justify-center z-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -50 }}
                    >
                        {/* Clearing the storm visual */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 30 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="absolute bg-indigo-500/20 rounded-full w-24 h-24 blur-xl"
                        />

                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative z-10 text-center"
                        >
                            <div className="inline-flex p-4 mb-6 bg-indigo-500/20 rounded-full border border-indigo-400/30 backdrop-blur-md shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                                <ShieldCheck size={48} className="text-indigo-200" />
                            </div>
                            <h2 className="text-3xl font-light text-indigo-100">
                                It doesn't have to be <span className="font-serif italic text-white font-bold">this way.</span>
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
                        className="absolute inset-0 flex flex-col items-center justify-center z-10"
                    >
                        {/* God Rays / Glow */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute w-[600px] h-[600px] bg-gradient-to-t from-emerald-500/10 to-transparent rounded-full blur-3xl"
                        />

                        {/* Logo Reveal */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ type: "spring", duration: 1.5, bounce: 0.5 }}
                            className="relative mb-8"
                        >
                            <div className="w-32 h-32 bg-gradient-to-tr from-emerald-600 to-teal-400 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.4)] border-t border-white/20">
                                <span className="text-6xl drop-shadow-md">🥚</span>
                            </div>

                            {/* Orbiting particles */}
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute inset-0 border border-emerald-500/30 rounded-[2.5rem]"
                                    initial={{ scale: 1.1, rotate: 0 }}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 8 + i, repeat: Infinity, ease: "linear" }}
                                >
                                    <div className="w-2 h-2 bg-emerald-300 rounded-full absolute -top-1 left-1/2 shadow-[0_0_10px_#fff]" />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Text Reveal */}
                        <div className="overflow-hidden mb-2">
                            <motion.h1
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ delay: 0.3, type: "spring" }}
                                className="text-7xl font-bold tracking-tighter text-white"
                            >
                                Nest
                            </motion.h1>
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-emerald-100/70 text-sm uppercase tracking-[0.4em] font-medium"
                        >
                            Family Operating System
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
