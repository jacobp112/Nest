import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale,
  Check,
  X,
  Info,
  Split,
  Receipt,
  MessageCircle,
  Send,
  Sparkles,
  Plus,
  Heart,
  Plane,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Clock,
  Filter,
  CreditCard,
  ThumbsUp
} from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard.jsx';

// --- 1. Premium UI Components ---

// Reusing the "Tactile" Slider for consistency across the app
const SmartSlider = ({ value, min, max, step = 1, onChange, label, unit = '' }) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3 select-none group">
      <div className="flex justify-between items-end">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider transition-colors group-hover:text-slate-300">{label}</label>
      </div>
      <div className="relative h-6 flex items-center cursor-pointer">
        {/* Track */}
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
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      </div>
    </div>
  );
};

const FairShareMeter = ({ userSplit, partnerSplit }) => {
  return (
    <div className="relative pt-8 pb-4">
      {/* Markers */}
      <div className="absolute top-0 left-0 w-full flex justify-between px-1 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
        <span>You (0%)</span>
        <span>50/50</span>
        <span>Jamie (100%)</span>
      </div>

      {/* The Bar */}
      <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex border border-white/5 relative shadow-inner">
        {/* User Segment */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${userSplit}%` }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 relative"
        >
          <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white/50 shadow-[0_0_10px_white]" />
        </motion.div>

        {/* Partner Segment (Background is already slate, but we visually distinguish if needed) */}
        <div className="flex-1 bg-slate-800/50" />
      </div>

      {/* Dynamic Labels */}
      <div className="flex justify-between mt-3">
        <div className="text-left">
          <div className="text-xs text-indigo-400 font-bold uppercase tracking-wider">You Contributed</div>
          <div className="text-xl font-bold text-white">{userSplit}%</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Jamie Contributed</div>
          <div className="text-xl font-bold text-slate-400">{partnerSplit}%</div>
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
      className="mt-4 p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-white/10 overflow-hidden"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-indigo-300">
          <Split size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Split Adjustment</span>
        </div>
        <div className="text-right">
          <span className="text-white font-bold text-base sm:text-lg">£{amount.toFixed(2)}</span>
          <div className="text-[10px] text-slate-500">Total Bill</div>
        </div>
      </div>

      <div className="mb-6">
        <SmartSlider
          label="Your Share"
          value={split} min={0} max={100} step={5}
          onChange={setSplit}
        />
      </div>

      <div className="flex justify-between items-center mb-6 px-2">
        <div className="text-center">
          <div className="text-xs sm:text-sm font-bold text-indigo-400">£{myShare.toFixed(2)}</div>
          <div className="text-[10px] text-slate-500 font-bold uppercase">You Pay</div>
        </div>
        <div className="h-8 w-[1px] bg-white/10" />
        <div className="text-center">
          <div className="text-xs sm:text-sm font-bold text-slate-300">£{partnerShare.toFixed(2)}</div>
          <div className="text-[10px] text-slate-500 font-bold uppercase">Jamie Pays</div>
        </div>
      </div>

      <button
        onClick={() => onInteract(`Split bill ${split}/${100 - split}`)}
        className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-indigo-900/20"
      >
        Confirm Split
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
      className="mt-3 bg-slate-950 rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
    >
      <div className="px-4 py-3 bg-white/5 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Discussion</span>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={14} /></button>
      </div>

      <div className="p-4 space-y-4 max-h-[200px] overflow-y-auto bg-slate-900/50">
        {messages.map((msg) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            key={msg.id}
            className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
          >
            <div className={`px-4 py-2.5 rounded-2xl text-xs max-w-[85%] shadow-sm ${msg.isMe
              ? 'bg-indigo-600 text-white rounded-br-none'
              : 'bg-slate-800 text-slate-200 rounded-bl-none border border-white/5'
              }`}>
              {msg.text}
            </div>
            <span className="text-[9px] text-slate-600 mt-1 px-1">{msg.time}</span>
          </motion.div>
        ))}
      </div>

      <div className="p-3 border-t border-white/5 bg-slate-950 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-slate-900/50 border border-white/5 rounded-xl text-xs text-white px-4 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/20">
          <Send size={14} />
        </button>
      </div>
    </motion.div>
  );
};

const InboxItem = ({ item, onInteract }) => {
  const [showThread, setShowThread] = useState(false);
  const [showSplitter, setShowSplitter] = useState(false);
  const isUrgent = item.type === 'approval' || (item.type === 'bill' && !item.paid);

  return (
    <div className="p-1 rounded-2xl transition-all duration-300 hover:bg-white/5 group">
      <div className="p-4 rounded-xl border border-white/5 bg-slate-900/40 hover:border-white/10 transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${item.type === 'bill' ? 'bg-rose-500/10 text-rose-400' : 'bg-indigo-500/10 text-indigo-400'} border border-white/5`}>
              {item.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-xs sm:text-sm">{item.title}</h4>
                <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium text-slate-500 bg-slate-900 border border-white/5">
                  <Clock size={12} className="text-slate-400" />
                  {item.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                {isUrgent && <AlertCircle size={12} className="text-rose-400" />}
                {item.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowThread(!showThread)}
              className={`p-2 rounded-lg transition-colors border border-transparent ${showThread ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
            >
              <MessageCircle size={16} />
            </button>

            {item.actions && (
              <div className="flex gap-1 pl-2 border-l border-white/10">
                <button onClick={() => onInteract('Approve')} className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors border border-emerald-500/20"><Check size={16} /></button>
                <button onClick={() => onInteract('Reject')} className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors border border-rose-500/20"><X size={16} /></button>
              </div>
            )}

            {item.type === 'bill' && !item.actions && (
              <button
                onClick={() => setShowSplitter(!showSplitter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors border ${showSplitter
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

const SharedInbox = ({ isExpanded, onExpandToggle, onInteract }) => {
  const [filter, setFilter] = useState('action');
  const items = [
    {
      id: 1,
      type: 'approval',
      title: 'New Sofa',
      subtitle: 'Jamie requests approval • £899',
      timestamp: '2h ago',
      icon: <ThumbsUp size={18} />,
      actions: true,
      category: 'action'
    },
    {
      id: 2,
      type: 'bill',
      title: 'Waitrose',
      subtitle: 'Shared Grocery Run • £45.00',
      timestamp: '5h ago',
      icon: <Receipt size={18} />,
      paid: false,
      category: 'action'
    },
    {
      id: 3,
      type: 'approval',
      title: 'Utility Warehouse',
      subtitle: 'Direct Debit Paid • £120',
      timestamp: '1d ago',
      icon: <Check size={18} />,
      actions: false,
      category: 'history'
    },
    {
      id: 4,
      type: 'bill',
      title: 'Netflix',
      subtitle: 'Subscription • £15.99',
      timestamp: '2d ago',
      icon: <CreditCard size={18} />,
      paid: true,
      category: 'history'
    }
  ];

  const filteredItems = filter === 'all' ? items : items.filter((item) => item.category === 'action');
  const actionCount = items.filter((item) => item.category === 'action').length;

  return (
    <DashboardCard title="Shared Inbox" className="h-full border-0 ring-1 ring-white/5 bg-slate-900/50 relative flex flex-col">
      <div className="absolute top-6 right-6 flex items-center gap-2 bg-slate-950/80 rounded-full px-1 py-0.5 border border-white/5 text-[10px] uppercase tracking-[0.3em]">
        <Filter size={12} className="text-slate-500" />
        <button
          onClick={() => setFilter('action')}
          className={`px-3 py-0.5 rounded-full transition-colors ${filter === 'action' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Needs Action
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-0.5 rounded-full transition-colors ${filter === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
        >
          History
        </button>
      </div>

      <motion.div
        layout
        className={`mt-6 space-y-2 sm:space-y-3 relative transition-all duration-500 ease-[0.23,1,0.32,1] ${isExpanded ? 'h-auto pb-12' : 'h-[340px] overflow-hidden'}`}
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <InboxItem item={item} onInteract={onInteract} />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-slate-500"
            >
              <div className="p-4 rounded-full bg-slate-800/50 mb-3">
                <Check size={24} className="text-emerald-500/70" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider">All Caught Up</p>
            </motion.div>
          )}
        </AnimatePresence>

        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent z-20 flex items-end justify-center pointer-events-none">
            <div className="pointer-events-auto" />
          </div>
        )}
      </motion.div>

      <div
        className={`absolute bottom-6 left-0 right-0 flex justify-center z-30 transition-transform duration-300 ${isExpanded ? 'translate-y-2' : 'translate-y-0'}`}
      >
        <button
          onClick={onExpandToggle}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-800 border border-white/10 text-xs font-bold text-white uppercase tracking-wider hover:bg-slate-700 transition-all shadow-xl hover:scale-105 active:scale-95 group"
        >
          {isExpanded ? (
            <>
              Collapse <ChevronUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
            </>
          ) : (
            <>
              Open Inbox
              <span className="bg-indigo-500 text-white text-[9px] px-1.5 rounded-full">{actionCount}</span>
              <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
            </>
          )}
        </button>
      </div>
    </DashboardCard>
  );
};

const DreamBoardCard = ({ title, target, current, image, color, onInteract }) => {
  const progress = Math.min(100, (current / target) * 100);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      className="relative overflow-hidden rounded-[2rem] bg-slate-900 border border-white/10 w-64 shrink-0 cursor-pointer shadow-2xl group"
    >
      {/* Cinematic Image Background */}
      <div className="h-48 w-full relative overflow-hidden">
        {image ? (
          <>
            <div className={`absolute inset-0 bg-${color.replace('bg-', '')} mix-blend-overlay opacity-20 z-10`} />
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </>
        ) : (
          <div className={`w-full h-full ${color} opacity-20`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10" />

        {/* Floating Boost Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          className="absolute top-4 right-4 z-20"
        >
          <button
            onClick={(e) => { e.stopPropagation(); onInteract(`Boost ${title}`); }}
            className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-white/30 transition-colors shadow-lg"
          >
            <Sparkles size={12} className="text-amber-300" /> Boost
          </button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 relative z-20 -mt-16">
        {/* Icon */}
        <div className={`mb-4 inline-flex p-3 rounded-2xl ${color.replace('bg-', 'bg-').replace('500', '500/20')} ${color.replace('bg-', 'text-').replace('500', '400')} backdrop-blur-xl border border-white/10 shadow-lg`}>
          {title.includes('Bali') ? <Plane size={20} /> : <Heart size={20} />}
        </div>

        <h4 className="font-display font-bold text-xl sm:text-2xl text-white mb-2 leading-tight">{title}</h4>

        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">Pot Value</div>
            <div className="font-mono text-base sm:text-lg text-white">£{current.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">Goal</div>
            <div className="font-mono text-xs sm:text-sm text-slate-400">£{target.toLocaleString()}</div>
          </div>
        </div>

        {/* Custom Progress Bar */}
        <div className="relative h-2.5 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "circOut" }}
            className={`h-full ${color} shadow-[0_0_12px_currentColor]`}
          />
        </div>

        <div className="mt-3 flex justify-between items-center">
          <span className={`text-[10px] font-bold ${progress >= 100 ? 'text-emerald-400' : 'text-slate-400'}`}>
            {progress.toFixed(0)}% Complete
          </span>
          {progress >= 100 && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full">
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
  const [isInboxExpanded, setIsInboxExpanded] = useState(false);
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 pb-20">

      {/* 1. Fair Share Meter (Hero) */}
      <div className="col-span-12 md:col-span-8">
        <DashboardCard className="relative overflow-hidden min-h-[320px] flex flex-col justify-center p-6 sm:p-8 border-0 ring-1 ring-white/5 bg-slate-900/50 group">
          {/* Ambient Background */}
          <div className="absolute -top-24 -right-24 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-indigo-600/20 transition-colors duration-1000" />

          <div className="relative z-10 max-w-2xl">
            <div className="flex items-start gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/20 shadow-lg">
                <Scale size={28} />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">Fair Share Ratio</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Auto-Adjusted</span>
                  <p className="text-slate-400 text-xs sm:text-sm">Based on income (55/45)</p>
                </div>
              </div>
            </div>

            <FairShareMeter userSplit={54} partnerSplit={46} />

            <div className="mt-8 p-4 rounded-xl bg-slate-950/40 border border-white/5 flex items-start gap-4 backdrop-blur-md">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 mt-0.5">
                <Info size={16} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-white uppercase tracking-wider">Adjustment Needed</p>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  You paid the <strong>Car Insurance</strong> (£800) solo.
                  Jamie owes you <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">£120.00</span> to restore the 55/45 balance.
                </p>
              </div>
              <button onClick={() => onInteract('Settle Balance')} className="ml-auto px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-900/20 whitespace-nowrap transition-colors">
                Settle Up
              </button>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* 2. Inbox */}
      <div className="col-span-12 md:col-span-4">
        <SharedInbox
          isExpanded={isInboxExpanded}
          onExpandToggle={() => setIsInboxExpanded((prev) => !prev)}
          onInteract={onInteract}
        />
      </div>

      {/* 3. Dream Board */}
      <div className="col-span-12">
        <DashboardCard className="relative overflow-hidden border-0 ring-1 ring-white/5 bg-slate-900/50">
          {/* Gradient Mesh Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-slate-900 to-purple-900/20 opacity-50" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8 px-2">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-white">Dream Board</h3>
                  <p className="text-slate-400 text-xs sm:text-sm mt-0.5">Visualise and fund your shared future.</p>
                </div>
              </div>

              <button onClick={() => onInteract("Add Dream")} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider transition-colors">
                <Plus size={14} /> New Goal
              </button>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-8 pt-2 px-2 scrollbar-hide -mx-2">
              <DreamBoardCard
                title="Bali 2025"
                target={5000}
                current={2400}
                color="bg-emerald-500"
                image="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80"
                onInteract={onInteract}
              />
              <DreamBoardCard
                title="New Kitchen"
                target={15000}
                current={4500}
                color="bg-amber-500"
                image="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80"
                onInteract={onInteract}
              />
              <DreamBoardCard
                title="Date Night"
                target={500}
                current={120}
                color="bg-rose-500"
                image="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
                onInteract={onInteract}
              />

              {/* Add New Card Placeholder */}
              <motion.div
                whileHover={{ scale: 1.02, rotate: 1 }}
                onClick={() => onInteract("Add Dream")}
                className="relative h-[340px] w-64 shrink-0 rounded-[2rem] border-2 border-dashed border-white/10 hover:border-white/20 hover:bg-white/5 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all group"
              >
                <div className="h-16 w-16 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center text-slate-500 group-hover:text-white transition-colors">
                  <Plus size={32} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">Create Goal</span>
              </motion.div>
            </div>
          </div>
        </DashboardCard>
      </div>

    </div>
  );
}
