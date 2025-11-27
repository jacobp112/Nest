import React from 'react';
import { motion } from 'framer-motion';

export default function BudgetEligibility() {
    return (
        <div className="min-h-screen bg-background text-text-primary flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl w-full text-center z-10"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Nest Premium Access Program
                </div>

                <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 tracking-tight">
                    <span className="text-gradient">Premium tools,</span><br />
                    <span className="text-gradient-emerald">on the house.</span>
                </h1>

                <p className="text-lg text-text-secondary mb-12 leading-relaxed">
                    We believe financial clarity shouldn't be a luxury. By connecting your accounts, our system can verify your eligibility for a <span className="text-white font-semibold">free 12-month sponsorship</span> of Nest Premium.
                </p>

                <div className="grid gap-6 md:grid-cols-3 mb-12 text-left">
                    {[
                        { title: 'Connect', desc: 'Securely link your primary bank account.' },
                        { title: 'Verify', desc: 'Our AI instantly reviews your transaction history.' },
                        { title: 'Unlock', desc: 'Get full access to Premium tools to build your safety net.' }
                    ].map((step, i) => (
                        <div key={i} className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="text-emerald-500 font-display text-xl font-bold mb-2">0{i + 1}</div>
                            <h3 className="text-white font-semibold mb-1">{step.title}</h3>
                            <p className="text-sm text-slate-400">{step.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-4">
                    <button className="btn btn-primary w-full md:w-auto text-lg px-8 py-4 shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:shadow-[0_0_60px_rgba(16,185,129,0.6)]">
                        Check My Eligibility
                    </button>
                    <p className="text-xs text-slate-500 max-w-md">
                        We use bank-level encryption. Your data is never sold. Once you're back on track, you can choose to continue with a paid plan or return to the free tier.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
