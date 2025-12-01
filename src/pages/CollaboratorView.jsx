import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale,
  Check,
  X,
  Info,
  HelpCircle,
  Split,
  Receipt,
  MessageCircle,
  Send,
  Sparkles,
  Plus,
  Heart,
  Plane,
  Home,
  ChevronDown,
  Bell
} from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard.jsx';

// --- 1. Utilities & Toast ---

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-3 py-2 sm:px-4 sm:py-3 bg-slate-900 border border-white/10 rounded-xl shadow-2xl"
    >
      <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
        <Check size={14} />
      </div>
      <p className="text-xs sm:text-sm font-bold text-white">{message}</p>
    </motion.div>
  );
};

// --- 2. Premium UI Components ---

const SmartSlider = ({ value, min, max, step = 1, onChange, label }) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3 select-none group">
      <div className="flex justify-between items-end">
        <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider transition-colors group-hover:text-slate-300">{label}</label>
      </div>
      <div className="relative h-6 flex items-center cursor-pointer">
        <div className="absolute w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-100 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
        />
        <motion.div
          className="absolute h-4 w-4 bg-white rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)] border-2 border-indigo-500 pointer-events-none"
          style={{ left: `calc(${percentage}% - 8px)` }}
          layoutId={`thumb-${label}`}
        />
      </div>
    </div>
  );
};

const FairShareMeter = ({ userSplit, partnerSplit }) => {
  return (
    <div className="relative pt-4 pb-2 sm:pt-6">
      <div className="absolute top-0 left-0 w-full flex justify-between px-1 text-[8px] sm:text-[9px] font-bold text-slate-600 uppercase tracking-widest">
        <span>You (0%)</span>
        <span>50/50</span>
        <span>Jamie (100%)</span>
      </div>
      <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex border border-white/5 relative shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${userSplit}%` }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 relative"
        >
          <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white/50 shadow-[0_0_10px_white]" />
        </motion.div>
        <div className="flex-1 bg-slate-800/50" />
      </div>
      <div className="flex justify-between mt-2">
        <div className="text-left">
          <div className="text-[9px] sm:text-[10px] text-indigo-400 font-bold uppercase tracking-wider">You Contributed</div>
          <div className="text-base sm:text-lg font-bold text-white">{userSplit}%</div>
        </div>
        <div className="text-right">
          <div className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-wider">Jamie Contributed</div>
          <div className="text-base sm:text-lg font-bold text-slate-400">{partnerSplit}%</div>
        </div>
      </div>
    </div>
  );
};

const BillSplitter = ({ onInteract }) => {
  const [split, setSplit] = useState(50);
  const amount = 45.00;
  const myShare = (amount * split) / 100;
  const partnerShare = amount - myShare;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      className="mt-4 p-3 sm:p-4 rounded-xl bg-slate-900/80 border border-white/10 overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-indigo-300">
          <Split size={14} />
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Split Adjustment</span>
        </div>
        <div className="text-right">
          <span className="text-white font-bold text-xs sm:text-sm">£{amount.toFixed(2)}</span>
        </div>
      </div>
      <div className="mb-4">
        <SmartSlider
          label="Your Share" value={split} min={0} max={100} step={5}
          onChange={setSplit}
        />
      </div>
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="text-center">
          <div className="text-[10px] sm:text-xs font-bold text-indigo-400">£{myShare.toFixed(2)}</div>
          <div className="text-[8px] sm:text-[9px] text-slate-500 font-bold uppercase">You Pay</div>
        </div>
        <div className="h-6 w-[1px] bg-white/10" />
        <div className="text-center">
          <div className="text-[10px] sm:text-xs font-bold text-slate-300">£{partnerShare.toFixed(2)}</div>
          <div className="text-[8px] sm:text-[9px] text-slate-500 font-bold uppercase">Jamie Pays</div>
        </div>
      </div>
      <button
        onClick={() => onInteract(`Split bill ${split}/${100 - split}`)}
        className="w-full py-1.5 sm:py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all shadow-lg shadow-indigo-900/20"
      >
        Confirm
      </button>
    </motion.div>
  );
};

const TransactionThread = ({ transaction, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, user: 'Jamie', text: 'Is this for the cat food? 🐱', time: '10:42 AM', isMe: false },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), user: 'Alex', text: input, time: 'Just now', isMe: true }]);
    setInput('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="mt-2 sm:mt-3 bg-slate-950 rounded-xl border border-white/10 overflow-hidden shadow-2xl"
    >
      <div className="px-2 py-1.5 sm:px-3 sm:py-2 bg-white/5 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-slate-300">Chat</span>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={12} /></button>
      </div>
      <div className="p-2 sm:p-3 space-y-3 max-h-[150px] overflow-y-auto bg-slate-900/50">
        {messages.map((msg) => (
          <motion.div
            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
            key={msg.id}
            className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
          >
            <div className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl text-[9px] sm:text-[10px] max-w-[85%] shadow-sm ${msg.isMe
                ? 'bg-indigo-600 text-white rounded-br-none'
                : 'bg-slate-800 text-slate-200 rounded-bl-none border border-white/5'
              }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="p-1.5 sm:p-2 border-t border-white/5 bg-slate-950 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Reply..."
          className="flex-1 bg-slate-900/50 border border-white/5 rounded-lg text-[9px] sm:text-[10px] text-white px-2 py-1 sm:px-3 sm:py-1.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-lg">
          <Send size={12} />
        </button>
      </div>
    </motion.div>
  );
};

const InboxItem = ({ item, onInteract }) => {
  const [showThread, setShowThread] = useState(false);
  const [showSplitter, setShowSplitter] = useState(false);

  return (
    <div className="p-0.5 sm:p-1 rounded-2xl transition-all duration-300 hover:bg-white/5 group">
      <div className="p-2 sm:p-3 rounded-xl border border-white/5 bg-slate-900/40 hover:border-white/10 transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-1.5 sm:p-2 rounded-xl ${item.type === 'bill' ? 'bg-rose-500/10 text-rose-400' : 'bg-indigo-500/10 text-indigo-400'} border border-white/5`}>
              {item.icon}
            </div>
            <div>
              <h4 className="font-bold text-white text-xs sm:text-sm">{item.title}</h4>
              <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5">{item.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowThread(!showThread)}
              className={`p-1 sm:p-1.5 rounded-lg transition-colors border border-transparent ${showThread ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
            >
              <MessageCircle size={14} />
            </button>
            {item.actions && (
              <div className="flex gap-1 pl-1.5 sm:pl-2 border-l border-white/10">
                <button onClick={() => onInteract('Approve')} className="p-1 sm:p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors border border-emerald-500/20"><Check size={14} /></button>
                <button onClick={() => onInteract('Reject')} className="p-1 sm:p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors border border-rose-500/20"><X size={14} /></button>
              </div>
            )}
            {item.type === 'bill' && !item.actions && (
              <button
                onClick={() => setShowSplitter(!showSplitter)}
                className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md text-[8px] sm:text-[9px] font-bold uppercase tracking-wider transition-colors border ${showSplitter
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-800 text-slate-300 border-white/10 hover:bg-slate-700'
                  }`}
              >
                {showSplitter ? 'Cancel' : 'Split'}
              </button>
            )}
          </div>
        </div>
        <AnimatePresence>
          {showSplitter && <BillSplitter onInteract={onInteract} />}
          {showThread && <TransactionThread transaction={item} onClose={() => setShowThread(false)} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

const themeConfig = {
  emerald: {
    bg: 'bg-emerald-500',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    iconBg: 'bg-emerald-500/20',
    progress: 'bg-emerald-500'
  },
  amber: {
    bg: 'bg-amber-500',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
    iconBg: 'bg-amber-500/20',
    progress: 'bg-amber-500'
  },
  rose: {
    bg: 'bg-rose-500',
    text: 'text-rose-400',
    border: 'border-rose-500/20',
    glow: 'shadow-[0_0_20px_rgba(244,63,94,0.15)]',
    iconBg: 'bg-rose-500/20',
    progress: 'bg-rose-500'
  }
};

const DreamBoardCard = ({ title, target, current, image, theme = 'emerald', onInteract }) => {
  const progress = Math.min(100, (current / target) * 100);
  const [isHovered, setIsHovered] = useState(false);
  const styles = themeConfig[theme];

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      className={`relative overflow-hidden rounded-[2rem] bg-slate-900 border border-white/5 w-64 shrink-0 cursor-pointer transition-all duration-300 ${isHovered ? styles.glow : 'shadow-2xl'}`}
    >
      <div className="h-48 w-full relative overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90"
          />
        ) : (
          <div className={`w-full h-full ${styles.bg} opacity-10`} />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          className="absolute top-4 right-4 z-20"
        >
          <button
            onClick={(e) => { e.stopPropagation(); onInteract(`Boost ${title}`); }}
            className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-white/20 transition-colors shadow-lg"
          >
            <Sparkles size={12} className={styles.text} /> Boost
          </button>
        </motion.div>
      </div>

      <div className="p-4 sm:p-6 relative z-20 -mt-16">
        <div className={`mb-4 inline-flex p-2 sm:p-3 rounded-2xl ${styles.iconBg} ${styles.text} backdrop-blur-xl border border-white/10 shadow-lg`}>
          {title.includes('Bali') ? <Plane size={20} /> : title.includes('Home') ? <Home size={20} /> : <Heart size={20} />}
        </div>

        <h4 className="font-display font-bold text-xl sm:text-2xl text-white mb-2 leading-tight drop-shadow-md">{title}</h4>

        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">Pot Value</div>
            <div className="font-mono text-base sm:text-lg text-white">£{current.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">Goal</div>
            <div className="font-mono text-xs sm:text-sm text-slate-400">£{target.toLocaleString()}</div>
          </div>
        </div>

        <div className="relative h-2.5 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "circOut" }}
            className={`h-full ${styles.progress} shadow-[0_0_12px_currentColor]`}
          />
        </div>

        <div className="mt-3 flex justify-between items-center">
          <span className={`text-[9px] sm:text-[10px] font-bold ${progress >= 100 ? styles.text : 'text-slate-400'}`}>
            {progress.toFixed(0)}% Complete
          </span>
          {progress >= 100 && (
            <span className={`flex items-center gap-1 text-[9px] sm:text-[10px] ${styles.text} font-bold uppercase tracking-wider ${styles.iconBg} px-1.5 py-0.5 sm:px-2 rounded-full`}>
              <Check size={10} /> Ready
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- Main View ---

export default function CollaboratorView({ onInteract = () => { } }) {
  const [toastMessage, setToastMessage] = useState(null);

  const handleOpenInbox = () => {
    setToastMessage('Opening full inbox...');
    onInteract('Open Inbox Full View');
  };

  return (
    <div className="relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-20">

        {/* 1. Fair Share Meter - FIXED HEIGHT */}
        <div className="col-span-12 md:col-span-8">
          <DashboardCard className="relative overflow-hidden h-[320px] flex flex-col justify-center p-4 sm:p-6 md:p-8 border-0 ring-1 ring-white/5 bg-slate-900/50 group">
            <div className="absolute -top-24 -right-24 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-indigo-600/20 transition-colors duration-1000" />

            <div className="relative z-10 max-w-2xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-2 sm:p-3 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/20 shadow-lg">
                  <Scale size={28} />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">Fair Share Ratio</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-1.5 py-0.5 sm:px-2 rounded bg-white/5 border border-white/5 text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Auto-Adjusted</span>
                    <p className="text-slate-400 text-xs sm:text-sm">Based on income (55/45)</p>
                  </div>
                </div>
              </div>

              <FairShareMeter userSplit={54} partnerSplit={46} />

              <div className="mt-6 p-2 sm:p-3 rounded-xl bg-slate-950/40 border border-white/5 flex items-start gap-3 backdrop-blur-md">
                <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400 mt-0.5">
                  <Info size={14} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-wider">Adjustment Needed</p>
                  <p className="text-[10px] sm:text-xs text-slate-300 leading-relaxed">
                    You paid the <strong>Car Insurance</strong> (£800) solo.
                    Jamie owes you <span className="text-emerald-400 font-bold">£120.00</span>.
                  </p>
                </div>
                <button onClick={() => onInteract('Settle Balance')} className="ml-auto px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-indigo-900/20 whitespace-nowrap transition-colors">
                  Settle Up
                </button>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* 2. Inbox (FIXED HEIGHT + CSS MASK + BOTTOM BUTTON) */}
        <div className="col-span-12 md:col-span-4">
          <DashboardCard title="Shared Inbox" className="h-[320px] border-0 ring-1 ring-white/5 bg-slate-900/50 flex flex-col relative overflow-hidden">

            {/* List with CSS Mask for fading bottom */}
            <div
              className="flex-1 overflow-y-auto overflow-x-hidden relative pr-1"
              style={{
                maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
              }}
            >
              <div className="space-y-3 mt-4 pb-20">
                <InboxItem
                  item={{
                    type: 'approval',
                    title: 'New Sofa',
                    subtitle: 'Jamie requests approval • £899',
                    icon: <HelpCircle size={18} />,
                    actions: true
                  }}
                  onInteract={onInteract}
                />
                <InboxItem
                  item={{
                    type: 'bill',
                    title: 'Waitrose',
                    subtitle: 'Shared Grocery Run • £45.00',
                    icon: <Receipt size={18} />
                  }}
                  onInteract={onInteract}
                />
                <InboxItem
                  item={{
                    type: 'approval',
                    title: 'Utility Warehouse',
                    subtitle: 'Monthly Direct Debit • £120',
                    icon: <Check size={18} />,
                    actions: false
                  }}
                  onInteract={onInteract}
                />
                <InboxItem
                  item={{
                    type: 'bill',
                    title: 'Netflix',
                    subtitle: 'Subscription • £15.99',
                    icon: <Receipt size={18} />
                  }}
                  onInteract={onInteract}
                />
                {/* Extra items to ensure fade effect is visible */}
                <InboxItem
                  item={{
                    type: 'bill',
                    title: 'Spotify',
                    subtitle: 'Family Plan • £17.99',
                    icon: <Receipt size={18} />
                  }}
                  onInteract={onInteract}
                />
              </div>
            </div>

            {/* Floating Action Button - Positioned absolutely at bottom */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
              <button
                onClick={handleOpenInbox}
                className="flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-slate-800 border border-white/10 text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-wider hover:bg-slate-700 hover:scale-105 transition-all shadow-xl"
              >
                Open Inbox <ChevronDown size={14} />
              </button>
            </div>

          </DashboardCard>
        </div>

        {/* 3. Dream Board */}
        <div className="col-span-12">
          <DashboardCard className="relative overflow-hidden border-0 ring-1 ring-white/5 bg-slate-900/50">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6 sm:mb-8 px-2">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/10 border border-white/10 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.1)] backdrop-blur-md">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-white">Dream Board</h3>
                    <p className="text-slate-400 text-xs sm:text-sm mt-0.5">Visualise and fund your shared future.</p>
                  </div>
                </div>

                <button onClick={() => onInteract("Add Dream")} className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors">
                  <Plus size={14} /> New Goal
                </button>
              </div>

              <div className="flex gap-6 overflow-x-auto pb-8 pt-2 px-2 sm:pb-12 scrollbar-hide -mx-2">
                <DreamBoardCard
                  title="Bali 2025"
                  target={5000}
                  current={2400}
                  theme="emerald"
                  image="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80"
                  onInteract={onInteract}
                />
                <DreamBoardCard
                  title="New Kitchen"
                  target={15000}
                  current={4500}
                  theme="amber"
                  image="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80"
                  onInteract={onInteract}
                />
                <DreamBoardCard
                  title="Date Night"
                  target={500}
                  current={120}
                  theme="rose"
                  image="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
                  onInteract={onInteract}
                />

                <motion.div
                  whileHover={{ scale: 1.02, rotate: 1 }}
                  onClick={() => onInteract("Add Dream")}
                  className="relative h-[340px] w-64 shrink-0 rounded-[2rem] border-2 border-dashed border-white/10 hover:border-white/20 hover:bg-white/5 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all group"
                >
                  <div className="h-16 w-16 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center text-slate-500 group-hover:text-white transition-colors">
                    <Plus size={32} />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">Create Goal</span>
                </motion.div>
              </div>
            </div>
          </DashboardCard>
        </div>

      </div>
    </div>
  );
}