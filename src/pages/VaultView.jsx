import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Unlock,
  Fingerprint,
  Shield,
  FileText,
  Key,
  ChevronRight,
  AlertTriangle,
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
  Wifi
} from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard.jsx';

// --- 1. Premium Micro-Components ---

const BiometricLock = ({ onUnlock }) => {
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    if (scanning) return;
    setScanning(true);

    // Simulate scan delay
    setTimeout(() => {
      onUnlock();
    }, 2500);
  };

  return (
    <div className="flex h-[60vh] w-full flex-col items-center justify-center relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative">
          {/* Pulse Rings */}
          {scanning && (
            <>
              <motion.div
                initial={{ scale: 1, opacity: 0.5 }} animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border border-emerald-500/50"
              />
              <motion.div
                initial={{ scale: 1, opacity: 0.5 }} animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.2 }}
                className="absolute inset-0 rounded-full border border-emerald-500/30"
              />
            </>
          )}

          {/* Fingerprint Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleScan}
            className={`h-24 w-24 rounded-full flex items-center justify-center border-2 transition-all duration-500 relative overflow-hidden ${scanning
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)]'
                : 'border-white/10 bg-white/5 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-400'
              }`}
          >
            <Fingerprint size={48} />

            {/* Scanning Beam */}
            {scanning && (
              <motion.div
                initial={{ top: "-100%" }}
                animate={{ top: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1/2 bg-gradient-to-b from-transparent to-emerald-500/50 border-b border-emerald-400"
              />
            )}
          </motion.button>
        </div>

        <div className="mt-8 text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
            {scanning ? 'Authenticating...' : 'Vault Locked'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-[200px] mx-auto leading-relaxed">
            {scanning ? 'Verifying biometric signature...' : 'Touch fingerprint sensor to decrypt sensitive data.'}
          </p>
        </div>
      </div>
    </div>
  );
};

const DecryptText = ({ text, revealed }) => {
  const [display, setDisplay] = useState('••••••••••••');

  useEffect(() => {
    if (revealed) {
      let iterations = 0;
      const interval = setInterval(() => {
        setDisplay(prev =>
          prev.split('').map((char, index) => {
            if (index < iterations) return text[index];
            return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'[Math.floor(Math.random() * 36)];
          }).join('')
        );
        if (iterations >= text.length) clearInterval(interval);
        iterations += 1 / 2;
      }, 30);
      return () => clearInterval(interval);
    } else {
      setDisplay('••••••••••••');
    }
  }, [revealed, text]);

  return <span className="font-mono">{display}</span>;
};

const SecureItem = ({ icon: Icon, title, value, type, onInteract }) => {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    setCopied(true);
    onInteract(`Copied ${title}`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      onClick={() => setRevealed(!revealed)}
      className={`group flex items-center justify-between p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer ${revealed
          ? 'bg-slate-800/50 border-emerald-500/30 shadow-lg'
          : 'bg-slate-900/30 border-white/5 hover:bg-slate-800/50 hover:border-white/10'
        }`}
    >
      <div className="flex items-center gap-4">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${revealed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
          }`}>
          <Icon size={18} />
        </div>
        <div>
          <p className={`text-xs sm:text-sm font-bold transition-colors ${revealed ? 'text-white' : 'text-slate-300'}`}>{title}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">{type}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className={`text-xs sm:text-sm font-mono transition-colors ${revealed ? 'text-emerald-400' : 'text-slate-600'}`}>
          <DecryptText text={value} revealed={revealed} />
        </div>
        <button
          onClick={handleCopy}
          className={`p-2 rounded-lg transition-colors ${copied
              ? 'bg-emerald-500 text-white'
              : 'hover:bg-white/10 text-slate-500 hover:text-white'
            }`}
        >
          {copied ? <Check size={14} /> : (revealed ? <Copy size={14} /> : <EyeOff size={14} />)}
        </button>
      </div>
    </motion.div>
  );
};

// --- Main View ---

const VaultView = ({ onInteract = () => { }, className = '' }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  // Auto-lock timer
  useEffect(() => {
    let interval;
    if (isUnlocked && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsUnlocked(false);
      setTimeLeft(300);
    }
    return () => clearInterval(interval);
  }, [isUnlocked, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!isUnlocked) {
    return (
      <div className={className}>
        <BiometricLock onUnlock={() => { setIsUnlocked(true); onInteract('Vault Decrypted'); }} />
      </div>
    );
  }

  return (
    <div className={`mx-auto w-full max-w-6xl space-y-6 sm:space-y-8 pb-20 ${className}`}>

      {/* Header Status */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 sm:p-6 rounded-3xl bg-emerald-900/10 border border-emerald-500/20 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <Unlock size={24} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-white">Vault Decrypted</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs text-emerald-200/70 font-mono">
                Session expires in {formatTime(timeLeft)}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsUnlocked(false)}
          className="relative z-10 px-4 py-2 rounded-xl bg-slate-900 text-xs font-bold text-slate-300 hover:text-white transition-colors border border-white/10 hover:border-white/20 flex items-center gap-2"
        >
          <Lock size={12} /> Lock Now
        </button>
      </motion.div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">

        {/* Secrets Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-base sm:text-lg font-bold text-white">Shared Secrets</h3>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">AES-256 Encrypted</span>
          </div>

          <DashboardCard className="border-0 ring-1 ring-white/5 bg-slate-900/50 space-y-2">
            <SecureItem
              icon={Wifi}
              title="Home WiFi"
              value="NestFamily_2024!"
              type="Network"
              onInteract={onInteract}
            />
            <SecureItem
              icon={Lock}
              title="Front Door Code"
              value="8842#"
              type="Entry"
              onInteract={onInteract}
            />
            <SecureItem
              icon={Shield}
              title="Netflix Password"
              value="hunter2"
              type="Login"
              onInteract={onInteract}
            />

            <button
              onClick={() => onInteract('Add Secret Wizard')}
              className="w-full mt-2 py-3 rounded-xl border border-dashed border-white/10 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
            >
              <div className="h-4 w-4 rounded bg-white/10 flex items-center justify-center text-white">+</div> Add New Secret
            </button>
          </DashboardCard>
        </div>

        {/* Documents & Legacy */}
        <div className="space-y-6">

          {/* Critical Docs */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white px-2 mb-4">Critical Documents</h3>
            <DashboardCard className="space-y-3 border-0 ring-1 ring-white/5 bg-slate-900/50">
              <div
                className="group flex items-center gap-4 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 cursor-pointer hover:bg-indigo-500/10 transition-all"
                onClick={() => onInteract('Viewing Will')}
              >
                <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                  <FileText size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-bold text-indigo-100">Last Will & Testament.pdf</p>
                  <p className="text-[10px] text-indigo-300/60 mt-0.5">Updated 6 months ago • 2.4MB</p>
                </div>
                <ChevronRight size={16} className="text-indigo-400/50 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </div>

              <div
                className="group flex items-center gap-4 p-3 rounded-xl bg-slate-800/30 border border-white/5 cursor-pointer hover:bg-slate-800/50 transition-all"
                onClick={() => onInteract('Viewing Policy')}
              >
                <div className="p-2.5 rounded-lg bg-slate-800 text-slate-400 group-hover:text-white transition-colors">
                  <FileText size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-bold text-slate-200">Life_Insurance_Policy.pdf</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Aviva • #99283811</p>
                </div>
                <ChevronRight size={16} className="text-slate-600 group-hover:text-white transition-colors" />
              </div>
            </DashboardCard>
          </div>

          {/* Legacy Protocol */}
          <DashboardCard className="bg-gradient-to-br from-rose-900/20 to-slate-900/50 border-rose-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <AlertTriangle size={80} className="text-rose-500" />
            </div>

            <div className="flex items-start gap-4 relative z-10">
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
                <RefreshCw size={20} />
              </div>
              <div>
                <h4 className="font-bold text-rose-100 flex items-center gap-2">
                  Legacy Protocol
                  <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-[9px] border border-rose-500/20 text-rose-400 font-mono">ACTIVE</span>
                </h4>
                <p className="text-xs text-rose-200/70 mt-2 leading-relaxed max-w-[260px]">
                  If you are inactive for <strong>30 days</strong>, access to this vault will be securely transferred to <strong>Sarah (Partner)</strong>.
                </p>

                <div className="flex items-center gap-2 mt-4">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Monitoring Heartbeat</span>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>

      </div>
    </div>
  );
};

export default VaultView;