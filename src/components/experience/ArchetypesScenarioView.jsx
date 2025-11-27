import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, TrendingUp, Home, Users, Check } from 'lucide-react';

// Import your existing views
import ArchitectView from '../../pages/ArchitectView.jsx';
import PropertyTycoonView from '../../pages/PropertyTycoonView.jsx';
import DebtDestroyerView from '../../pages/DebtDestroyerView.jsx';
import CollaboratorView from '../../pages/CollaboratorView.jsx';

// --- Overlay Components for the "Premium" Feel ---

const LabelOverlay = ({ title, subtitle, icon: Icon, align = 'left' }) => (
    <motion.div
        initial={{ opacity: 0, x: align === 'left' ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className={`absolute bottom-8 ${align === 'left' ? 'left-8 text-left' : 'right-8 text-right'} z-50`}
    >
        <div className={`flex items-center gap-3 mb-2 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
            <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20">
                <Icon size={20} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
        </div>
        <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">{subtitle}</p>
    </motion.div>
);

const FloatingHighlight = ({ text }) => (
    <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="absolute -top-4 -right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-emerald-500/30 z-50 flex items-center gap-1"
    >
        <Check size={12} /> {text}
    </motion.div>
);

// --- Main Component ---

export const ArchetypesScenarioView = ({ step }) => {

    const isGrid = step === 'grid' || step === 'message' || step === 'outro';
    
    const spotlightVariants = {
        hidden: { opacity: 0, scale: 0.8, z: -100 },
        active: { opacity: 1, scale: 1, z: 0, filter: 'blur(0px)' },
        background: { opacity: 0.3, scale: 0.85, z: -50, filter: 'blur(4px)' }
    };

    return (
        <div className="h-full w-full relative bg-slate-950 overflow-hidden flex flex-col items-center justify-center font-sans perspective-1000">
            
            {/* 0:00 - 0:01 Intro Text */}
            <AnimatePresence>
                {step === 'intro' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="absolute z-50 text-center"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-4">
                            Four roles.
                        </h1>
                        <p className="text-xl text-slate-400 font-light tracking-[0.2em] uppercase">
                            One household system.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* THE STAGE: Moves from Spotlight Stack to Grid */}
            <motion.div 
                className={`w-full max-w-5xl transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
                    isGrid 
                        ? 'grid grid-cols-2 gap-4 px-8 h-[80%]' 
                        : 'relative h-[600px] flex items-center justify-center'
                }`}
            >
                {/* 1. THE ARCHITECT */}
                <motion.div
                    layoutId="card-architect"
                    initial={{ x: -100, opacity: 0 }}
                    animate={
                        step === 'intro' ? "hidden" :
                        step === 'architect' ? "active" :
                        step === 'steward' ? { x: "-20%", scale: 0.8, opacity: 0.3, filter: "blur(4px)" } : // Shrink left
                        step === 'ascender' ? "background" :
                        isGrid ? { x: 0, scale: 1, opacity: 1, filter: "blur(0px)" } : "hidden"
                    }
                    transition={{ type: "spring", bounce: 0, duration: 0.8 }}
                    className={`bg-slate-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl ${!isGrid ? 'absolute w-[360px] h-[640px]' : 'w-full h-full'}`}
                >
                    <div className="absolute inset-0 overflow-hidden opacity-80 pointer-events-none transform scale-[0.6] origin-top-left">
                         <ArchitectView /> 
                    </div>
                    {step === 'architect' && (
                        <motion.div 
                            className="absolute inset-0 bg-indigo-500/10 mix-blend-overlay"
                            animate={{ opacity: [0, 0.5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    )}
                </motion.div>

                {/* 2. THE STEWARD */}
                <motion.div
                    layoutId="card-steward"
                    initial={{ x: 100, opacity: 0 }}
                    animate={
                        step === 'intro' || step === 'architect' ? "hidden" :
                        step === 'steward' ? "active" :
                        step === 'ascender' ? { x: "20%", scale: 0.8, opacity: 0.3, filter: "blur(4px)" } : // Shrink right
                        isGrid ? { x: 0, scale: 1, opacity: 1, filter: "blur(0px)" } : "hidden"
                    }
                    transition={{ type: "spring", bounce: 0, duration: 0.8 }}
                    className={`bg-slate-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl ${!isGrid ? 'absolute w-[360px] h-[640px]' : 'w-full h-full'}`}
                >
                    <div className="absolute inset-0 overflow-hidden opacity-80 pointer-events-none transform scale-[0.6] origin-top-left">
                         <PropertyTycoonView />
                    </div>
                </motion.div>

                {/* 3. THE ASCENDER */}
                <motion.div
                    layoutId="card-ascender"
                    initial={{ y: 100, opacity: 0, rotateX: 20 }}
                    animate={
                        (step === 'intro' || step === 'architect' || step === 'steward') ? "hidden" :
                        step === 'ascender' ? { ...spotlightVariants.active, rotateX: 0 } :
                        step === 'collaborator' ? { y: 40, scale: 0.9, opacity: 0.4 } :
                        isGrid ? { y: 0, scale: 1, opacity: 1, rotateX: 0, filter: "blur(0px)" } : "hidden"
                    }
                    transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
                    className={`bg-slate-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl ${!isGrid ? 'absolute w-[360px] h-[640px]' : 'w-full h-full'}`}
                >
                     {step === 'ascender' && <FloatingHighlight text="Freedom Date: 2028" />}
                    <div className="absolute inset-0 overflow-hidden opacity-80 pointer-events-none transform scale-[0.6] origin-top-left">
                        <DebtDestroyerView />
                    </div>
                </motion.div>

                {/* 4. THE COLLABORATOR */}
                <motion.div
                    layoutId="card-collaborator"
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={
                        (step !== 'collaborator' && !isGrid) ? "hidden" :
                        step === 'collaborator' ? { ...spotlightVariants.active, rotateY: 0 } :
                        isGrid ? { rotateY: 0, scale: 1, opacity: 1, filter: "blur(0px)" } : "hidden"
                    }
                    transition={{ type: "spring", bounce: 0, duration: 0.8 }}
                    className={`bg-slate-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl ${!isGrid ? 'absolute w-[360px] h-[640px]' : 'w-full h-full'}`}
                >
                    <div className="absolute inset-0 overflow-hidden opacity-80 pointer-events-none transform scale-[0.6] origin-top-left">
                        <CollaboratorView />
                    </div>
                </motion.div>

            </motion.div>

            {/* --- Text Overlays (Timed) --- */}
            <AnimatePresence>
                {step === 'architect' && (
                    <LabelOverlay 
                        key="architect"
                        title="The Architect" 
                        subtitle="The long-term planner" 
                        icon={Layers} 
                        align="left" 
                    />
                )}
                {step === 'steward' && (
                    <LabelOverlay 
                        key="steward"
                        title="The Steward" 
                        subtitle="Home & Equity Builder" 
                        icon={Home} 
                        align="right" 
                    />
                )}
                {step === 'ascender' && (
                    <LabelOverlay 
                        key="ascender"
                        title="The Ascender" 
                        subtitle="Fighting Debt & Rising Out" 
                        icon={TrendingUp} 
                        align="left" 
                    />
                )}
                {step === 'collaborator' && (
                    <LabelOverlay 
                        key="collaborator"
                        title="The Collaborator" 
                        subtitle="Bringing the family together" 
                        icon={Users} 
                        align="right" 
                    />
                )}
                {step === 'message' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-[100]"
                    >
                         {/* Particles Burst */}
                         <motion.div 
                             className="absolute w-full h-full"
                             initial={{ opacity: 1 }}
                             animate={{ opacity: 0 }}
                             transition={{ duration: 1.5 }}
                         >
                            {[...Array(20)].map((_, i) => (
                                <motion.div 
                                    key={i}
                                    className="absolute bg-white rounded-full w-1 h-1"
                                    initial={{ x: "50vw", y: "50vh", scale: 0 }}
                                    animate={{ 
                                        x: Math.random() * 100 + "%", 
                                        y: Math.random() * 100 + "%", 
                                        scale: [0, 1.5, 0] 
                                    }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                />
                            ))}
                         </motion.div>

                         <h2 className="text-4xl font-bold text-white text-center mb-2">Nest adapts to you.</h2>
                         <p className="text-xl text-slate-300">Not the other way around.</p>
                    </motion.div>
                )}
                {step === 'outro' && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-black z-[101] flex flex-col items-center justify-center"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1 }}
                            className="flex flex-col items-center"
                        >
                            <span className="text-6xl mb-4">🥚</span>
                            <h1 className="text-5xl font-bold text-white tracking-tighter mb-4">Nest</h1>
                            <p className="text-sm text-slate-400 uppercase tracking-widest">Your household. Your roles. Your journey.</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
