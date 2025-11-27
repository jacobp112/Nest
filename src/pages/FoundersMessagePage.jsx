import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Heart, Sparkles, ArrowRight } from 'lucide-react';
import TopNav from '../components/TopNav';
import Starfield from '../components/experience/Starfield';

// --- Engineer's Grid Background ---
const GridPattern = () => (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,#020617,transparent)]"></div>
    </div>
);

const Section = ({ title, children, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
        className="mb-12 relative"
    >
        {title && (
            <h3 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-indigo-500/50"></span>
                {title}
            </h3>
        )}
        <div className="text-lg text-slate-300 leading-relaxed space-y-6 font-light">
            {children}
        </div>
    </motion.div>
);

export default function FoundersMessagePage({ onNavigate }) {
    return (
        <div className="relative min-h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30">
            <TopNav onNavigate={onNavigate} />

            {/* Background */}
            <div className="absolute inset-0 z-0 fixed">
                <GridPattern />
                <Starfield density={1500} speed={0.3} reducedMotion={false} />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950 pointer-events-none" />
            </div>

            <main className="relative z-10 mx-auto flex flex-col items-center px-4 py-24 md:px-12 max-w-5xl">

                {/* Hero Header */}
                <motion.div
                    className="flex flex-col items-center text-center space-y-8 mb-24 pt-10"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <div className="relative group">
                        <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full group-hover:bg-indigo-500/30 transition-colors duration-500" />
                        <div className="relative h-28 w-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px] shadow-2xl shadow-indigo-500/20">
                            <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
                                <span className="font-display text-5xl font-bold text-white">J</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                            <Sparkles size={12} /> Founder's Message
                        </div>
                        <h1 className="font-display text-4xl md:text-7xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50">
                            Hi, I’m Jacob.
                        </h1>
                    </div>
                </motion.div>

                {/* Main Content Container */}
                <div className="w-full max-w-3xl relative">
                    {/* Decorative line */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent -ml-8 hidden md:block" />

                    <Section delay={0.1}>
                        <p>
                            Nest began as a simple idea between two brothers: <span className="text-white font-medium">what if money, instead of being a source of stress and secrecy, could become the foundation that brings families closer?</span>
                        </p>
                        <p>
                            For years, I watched the same pattern unfold in households: tension around budgeting, guilt around spending, fear around debt, and a universal silence around the struggle. We realised the core problem was never the numbers. It was the loneliness.
                        </p>
                        <p>
                            Our solution was not built in a boardroom. It was built in kitchens, over late-night conversations, and between family members trying to make sense of life, just like yours.
                        </p>
                    </Section>

                    {/* Featured Quote */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="my-20 p-10 rounded-[2rem] bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                            <Quote size={120} className="text-indigo-400" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-2xl md:text-3xl font-display font-medium text-white italic leading-relaxed">
                                "We reject the belief that financial strength requires secrecy. We believe clarity, dignity and hope should be available to everyone."
                            </p>
                        </div>
                    </motion.div>

                    <Section title="Thank You for Trusting Our Vision" delay={0.2}>
                        <p>
                            If you are here reading this, thank you. You are trusting us to build the tools that support radical transparency in your most important relationships. Thank you for believing that money can be handled differently.
                        </p>
                        <p>
                            Nest is not just an app. It is a companion. It is the shared home for the essential conversations that shape your life.
                        </p>
                    </Section>

                    <Section title="Our Commitment to Community" delay={0.3}>
                        <p>
                            Looking ahead, Nest’s commitment goes far beyond features and balance sheets. I want to personally commit to giving back to our community, especially to users facing the heaviest financial burdens.
                        </p>
                        <p>
                            I am still exploring the right approach, whether that means offering specialised financial guidance, interest-free microloans, or dedicated support for our hardest-hit users. Whatever the final form, I promise this mission will stay at the heart of Nest.
                        </p>
                    </Section>

                    <Section title="Welcome to the Family" delay={0.4}>
                        <p>
                            We are building this with you, not just for you.
                        </p>
                        <div className="mt-12 flex items-center gap-6">
                            <div className="h-16 w-16 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-2xl font-display font-bold text-indigo-400">J</div>
                            <div>
                                <p className="font-handwriting text-4xl text-white mb-2" style={{ fontFamily: 'cursive' }}>Jacob</p>
                                <p className="text-xs text-indigo-400 uppercase tracking-widest font-bold">Founder, Nest Finance</p>
                            </div>
                        </div>
                    </Section>

                    {/* Dedication Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mt-32 pt-12 border-t border-white/5 text-center"
                    >
                        <div className="inline-flex items-center gap-2 text-slate-500 mb-6 bg-slate-900/50 px-4 py-2 rounded-full border border-white/5">
                            <Heart size={14} className="text-rose-500" />
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Dedication</span>
                        </div>
                        <p className="text-slate-400 text-sm italic max-w-xl mx-auto leading-relaxed">
                            Dedicated to my family, my brothers, and to Henry, Kealan, Lois and Lucy, who pushed, challenged and inspired me through this journey. Thank you all.
                        </p>
                    </motion.div>

                </div>
            </main>
        </div>
    );
}
