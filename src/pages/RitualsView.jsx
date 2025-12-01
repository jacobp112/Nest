import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  MessageCircle,
  CheckCircle2,
  Calendar,
  Coffee,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  X,
  Check,
  HeartHandshake
} from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard.jsx';

// --- 1. Premium Micro-Components ---

const MoodSlider = ({ label, value, onChange, leftIcon: LeftIcon, rightIcon: RightIcon, disabled = false }) => {
  const percentage = Math.min(Math.max(value, 0), 100);

  return (
    <div className="space-y-4 select-none group">
      <div className="flex justify-between text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider">
        <span className="flex items-center gap-2 group-hover:text-rose-400 transition-colors">
          <LeftIcon size={14} /> Anxious
        </span>
        <span className="flex items-center gap-2 group-hover:text-emerald-400 transition-colors">
          Confident <RightIcon size={14} />
        </span>
      </div>

      <div className="relative h-14 w-full bg-slate-900 rounded-2xl border border-white/5 flex items-center px-3 shadow-inner">
        <input
          type="range" min="0" max="100" step="1" value={value} disabled={disabled}
          onChange={(e) => onChange && onChange(Number(e.target.value))}
          className="w-full h-full opacity-0 cursor-pointer absolute inset-0 z-20"
        />

        {/* Track */}
        <div className="absolute left-3 right-3 h-2 bg-slate-800 rounded-full overflow-hidden pointer-events-none">
          <motion.div
            className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500"
            animate={{ width: `${percentage}%` }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
          />
        </div>

        {/* Thumb */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 h-8 w-8 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)] flex items-center justify-center z-10 pointer-events-none border-2 border-slate-900"
          animate={{ left: `calc(${percentage}% - 16px)` }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="h-2 w-2 bg-slate-900 rounded-full" />
        </motion.div>
      </div>
      <p className="text-center text-xs text-slate-500 font-bold uppercase tracking-widest">{label}</p>
    </div>
  );
};

// Swipeable Card Component
const SwipeCard = ({ topic, onSwipe, index }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  const bg = useTransform(x, [-150, 0, 150], ["rgb(244, 63, 94)", "rgb(30, 41, 59)", "rgb(16, 185, 129)"]); // Rose -> Slate -> Emerald

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      onSwipe('right'); // Approved/Done
    } else if (info.offset.x < -100) {
      onSwipe('left'); // Skip
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity, backgroundColor: bg }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
      className="absolute inset-0 rounded-3xl border border-white/10 p-6 sm:p-8 flex flex-col justify-between shadow-2xl cursor-grab z-10"
    >
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 text-white/70 text-[10px] font-bold uppercase tracking-widest mb-6 border border-white/5">
          <MessageCircle size={12} /> Topic {index + 1}
        </div>
        <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4 leading-tight">{topic.title}</h3>
        <p className="text-base sm:text-lg text-white/80 leading-relaxed">{topic.desc}</p>
      </div>

      <div className="flex justify-between items-center text-white/50 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
        <span className="flex items-center gap-2"><X size={16} /> Swipe Left to Skip</span>
        <span className="flex items-center gap-2">Swipe Right to Done <Check size={16} /></span>
      </div>
    </motion.div>
  );
};

// --- Main View ---

const RitualsView = ({ onInteract = () => { }, className = '' }) => {
  const [mood, setMood] = useState(65);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  const TOPICS = [
    { id: 'waitrose', title: 'The "Waitrose" Spike', desc: 'Grocery spend was 18% higher this week. Special occasion or inflation creep?' },
    { id: 'holiday', title: 'Holiday Fund Pace', desc: 'We are £200 behind for Tokyo. Should we boost contributions next month?' },
    { id: 'adobe', title: 'Subscription Audit', desc: 'Do we still use Adobe Creative Cloud? It renewed yesterday for £19.99.' },
  ];

  const handleSwipe = (direction) => {
    if (window.navigator.vibrate) window.navigator.vibrate(50); // Haptic

    setTimeout(() => {
      if (activeCardIndex < TOPICS.length - 1) {
        setActiveCardIndex(prev => prev + 1);
      } else {
        setCompleted(true);
        onInteract('Ritual Completed');
      }
    }, 200); // Wait for animation
  };

  const ACTION_ITEMS = [
    { id: 1, text: 'Cancel Adobe Subscription', who: 'You', done: false },
    { id: 2, text: 'Move £200 to Holiday Pot', who: 'Lucy', done: true },
  ];

  return (
    <div className={`mx-auto w-full max-w-6xl space-y-6 sm:space-y-8 pb-20 ${className}`}>

      {/* 1. Hero: The Weekly Ritual */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-[2fr_1fr]">
        <DashboardCard className="relative overflow-hidden flex flex-col justify-center min-h-[240px] border-0 ring-1 ring-white/5 bg-slate-900/50 group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-indigo-600/20 transition-colors duration-1000" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
                <Coffee size={20} />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-400">Weekly Sync</p>
            </div>
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight mb-4">
              Money Date
            </h2>
            <p className="text-slate-400 max-w-md leading-relaxed text-xs sm:text-sm">
              Align on spending, check goals, and clear the air. <br />
              <span className="text-white font-bold">You are on a 3 week streak! 🔥</span>
            </p>
          </div>
        </DashboardCard>

        <DashboardCard className="flex flex-col items-center justify-center text-center border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer group" onClick={() => onInteract('Calendar')}>
          <h3 className="font-bold text-white mb-2">Next Date</h3>
          <p className="text-sm text-emerald-100 mb-4">Sunday, 7:00 PM</p>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Add to Calendar</span>
        </DashboardCard>
      </div>

      {/* 2. Main Interactive Grid */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">

        {/* Left: Pulse Check (Mood) */}
        <DashboardCard className="border-0 ring-1 ring-white/5 bg-slate-900/50 h-full flex flex-col justify-center">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-lg sm:text-xl font-bold text-white">Pulse Check</h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Live Sync Active
            </span>
          </div>

          <div className="space-y-8 sm:space-y-10">
            <MoodSlider
              label="How do you feel about our finances?"
              value={mood}
              onChange={setMood}
              leftIcon={ThumbsDown}
              rightIcon={ThumbsUp}
            />

            {/* Partner (Hidden State) */}
            <div className="relative h-24 rounded-2xl bg-slate-950/50 border border-white/5 flex items-center justify-center overflow-hidden group cursor-wait">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-5" />
              <div className="flex flex-col items-center gap-3 relative z-10">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                      className="h-2.5 w-2.5 bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1]"
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">
                  Lucy is answering...
                </span>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* Right: Topic Deck (Swipeable) */}
        <div className="relative h-[480px] w-full perspective-1000">
          <AnimatePresence mode="wait">
            {!completed ? (
              // Stack Effect
              <div className="relative w-full h-full">
                {/* Background Cards for Depth */}
                <div className="absolute inset-0 bg-slate-800 rounded-3xl transform translate-y-4 scale-95 opacity-40 border border-white/10 z-0" />
                <div className="absolute inset-0 bg-slate-800 rounded-3xl transform translate-y-8 scale-90 opacity-20 border border-white/10 -z-10" />

                {/* Active Card */}
                <SwipeCard
                  key={activeCardIndex}
                  topic={TOPICS[activeCardIndex]}
                  onSwipe={handleSwipe}
                  index={activeCardIndex}
                />
              </div>
            ) : (
              // Completion State
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-slate-900 rounded-3xl border border-emerald-500/30 flex flex-col items-center justify-center text-center p-6 sm:p-8 backdrop-blur-xl"
              >
                <div className="h-24 w-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] mb-6">
                  <HeartHandshake size={48} className="text-emerald-950" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">All Sync'd Up!</h3>
                <p className="text-emerald-100/70 max-w-xs text-xs sm:text-sm leading-relaxed">
                  Great job. You've cleared the deck for this week. See you next Sunday.
                </p>
                <button
                  onClick={() => { setCompleted(false); setActiveCardIndex(0); }}
                  className="mt-8 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-widest text-white transition-colors"
                >
                  Restart Review
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Action Plan */}
      <DashboardCard className="bg-slate-900/50 border-0 ring-1 ring-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Sparkles size={18} />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white">Action Items</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {ACTION_ITEMS.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-slate-950 border border-white/5 hover:border-white/10 transition-colors group cursor-pointer" onClick={() => onInteract(`Toggle Item ${item.id}`)}>
              <div className="flex items-center gap-4">
                <div
                  className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${item.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600 group-hover:border-emerald-500'
                    }`}
                >
                  {item.done && <Check size={14} className="text-slate-900 stroke-[3]" />}
                </div>
                <span className={`text-xs sm:text-sm font-medium ${item.done ? 'text-slate-500 line-through' : 'text-white'}`}>
                  {item.text}
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                {item.who}
              </span>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
};

export default RitualsView;
