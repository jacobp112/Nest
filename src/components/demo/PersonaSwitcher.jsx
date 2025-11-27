import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Shield, Users, TrendingUp, ChevronUp, Check, Sparkles } from 'lucide-react';

const PERSONAS = [
  {
    id: 'architect',
    label: 'Architect',
    desc: 'Optimization & Control',
    icon: Brain,
    color: 'text-indigo-400',
    glow: 'shadow-[0_0_15px_rgba(99,102,241,0.3)]'
  },
  {
    id: 'steward',
    label: 'Steward',
    desc: 'Legacy & Security',
    icon: Shield,
    color: 'text-emerald-400',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]'
  },
  {
    id: 'collaborator',
    label: 'Collaborator',
    desc: 'Harmony & Fairness',
    icon: Users,
    color: 'text-rose-400',
    glow: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]'
  },
  {
    id: 'ascender',
    label: 'Ascender',
    desc: 'Growth & Momentum',
    icon: TrendingUp,
    color: 'text-amber-400',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]'
  },
];

export default function PersonaSwitcher({ currentPersona, onChange, direction = 'up' }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const active = PERSONAS.find(p => p.id === currentPersona) || PERSONAS[0];
  const isUp = direction === 'up';

  const triggerHaptic = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  }, []);

  // Handle clicking outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    // Use 'mousedown' to catch clicks before they trigger other actions
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOpen = (e) => {
    // Stop propagation to prevent immediate closing if the event bubbles up
    e.stopPropagation();
    setIsOpen(!isOpen);
    triggerHaptic();
  };

  const handleSelect = (id) => {
    onChange(id);
    setIsOpen(false);
    triggerHaptic();
  };

  return (
    <div className="relative w-full z-50" ref={containerRef}>

      {/* Main Trigger Button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={toggleOpen}
        className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 group relative z-10 ${
          isOpen
            ? 'bg-slate-800 border-white/10 shadow-2xl'
            : 'bg-white/5 border-transparent hover:bg-white/10'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl bg-slate-950 border border-white/5 ${active.glow}`}>
            <active.icon size={16} className={active.color} />
          </div>
          <div className="text-left">
            <p className="text-[9px] uppercase tracking-widest text-slate-500 group-hover:text-slate-400 transition-colors font-bold">
              Viewing as
            </p>
            <p className="text-sm font-bold text-white flex items-center gap-1.5">
              {active.label}
            </p>
          </div>
        </div>

        {/* Animated Chevron */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-slate-500 group-hover:text-white"
        >
          <ChevronUp size={16} />
        </motion.div>
      </motion.button>

      {/* Dropdown / Pop-up Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: isUp ? 10 : -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isUp ? 10 : -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`absolute left-0 w-full p-2 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[100] flex flex-col gap-1 ring-1 ring-white/10 ${
              isUp ? 'bottom-full mb-3' : 'top-full mt-3'
            }`}
          >
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2 border-b border-white/5 mb-1">
               <Sparkles size={10} /> Select Archetype
            </div>

            {PERSONAS.map((p) => {
              const isActive = currentPersona === p.id;
              return (
                <button
                  key={p.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(p.id);
                  }}
                  className={`relative flex items-center gap-3 p-3 rounded-xl transition-all group w-full text-left ${
                    isActive
                      ? 'bg-white/10 text-white shadow-inner border border-white/5'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  {/* Icon Box */}
                  <div className={`p-2 rounded-lg bg-slate-950 border border-white/5 group-hover:border-white/10 transition-colors ${isActive ? p.glow : ''}`}>
                    <p.icon size={16} className={p.color} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                      {p.label}
                    </p>
                    <p className="text-[10px] text-slate-500 opacity-80 truncate">
                      {p.desc}
                    </p>
                  </div>

                  {/* Selection Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="check"
                      className="text-emerald-400 bg-emerald-500/10 p-1 rounded-full"
                    >
                      <Check size={14} />
                    </motion.div>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}