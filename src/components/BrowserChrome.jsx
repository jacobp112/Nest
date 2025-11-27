'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Lock, Share, Plus, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const TRAFFIC_LIGHTS = [
  { color: '#FF5F57', border: '#E0443E', label: 'Close tab', symbol: 'x' },
  { color: '#FEBC2E', border: '#D89E24', label: 'Minimize window', symbol: '-' },
  { color: '#28C840', border: '#1AAB29', label: 'Expand window', symbol: '+' },
];

export default function BrowserChrome({ url = 'nest.finance', faviconColor = '#34d399', reducedMotion = false }) {
  const [displayUrl, setDisplayUrl] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const timeoutsRef = useRef([]);

  // --- Typing Simulation Logic ---
  useEffect(() => {
    // Clear existing timers
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    if (!url) {
      setDisplayUrl('');
      return;
    }

    // Instant render for reduced motion
    if (reducedMotion) {
      setDisplayUrl(url);
      setIsTyping(false);
      return;
    }

    // Start typing sequence
    setIsTyping(true);
    setDisplayUrl('');

    const chars = url.split('');
    const baseDelay = 400; // Wait a bit before starting

    chars.forEach((char, index) => {
      const timeout = setTimeout(() => {
        setDisplayUrl((prev) => prev + char);
        // If it's the last character, stop the cursor blinking shortly after
        if (index === chars.length - 1) {
          setTimeout(() => setIsTyping(false), 800);
        }
      }, baseDelay + index * (30 + Math.random() * 20)); // Random typing speed variance

      timeoutsRef.current.push(timeout);
    });

    return () => timeoutsRef.current.forEach(clearTimeout);
  }, [url, reducedMotion]);

  return (
    <div className="relative flex w-full items-center gap-4 border-b border-white/5 bg-slate-900/80 px-5 py-3.5 backdrop-blur-xl">

      {/* 1. Traffic Lights (MacOS Style) */}
      <div className="flex gap-2 shrink-0">
        {TRAFFIC_LIGHTS.map((light) => (
          <div
            key={light.label}
            className="group relative flex h-3 w-3 items-center justify-center rounded-full shadow-inner"
            style={{ backgroundColor: light.color, border: `1px solid ${light.border}` }}
            aria-label={light.label}
          >
            <span className="pointer-events-none text-[8px] font-bold text-black/50 opacity-0 transition group-hover:opacity-100">
              {light.symbol}
            </span>
          </div>
        ))}
      </div>

      {/* 2. Navigation Controls */}
      <div className="flex gap-3 text-slate-500 shrink-0 pl-2">
        <ChevronLeft size={18} strokeWidth={2} className="transition hover:text-slate-200 cursor-pointer" />
        <ChevronRight size={18} strokeWidth={2} className="opacity-50 cursor-not-allowed" />
        <RotateCw size={16} strokeWidth={2.5} className="mt-[1px] transition hover:text-slate-200 cursor-pointer hover:rotate-180 duration-500" />
      </div>

      {/* 3. Address Bar (The Centerpiece) */}
      <div className="group relative mx-2 flex flex-1 items-center justify-center rounded-lg border border-white/5 bg-slate-950/50 px-3 py-1.5 shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] transition-colors hover:bg-slate-950/70 hover:border-white/10">

        {/* Secure Lock Badge */}
        <div className="flex items-center gap-1.5 opacity-90">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Lock
              size={10}
              className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]"
              fill="currentColor"
            />
          </motion.div>

          {/* URL Text with Blinking Cursor */}
          <div className="font-mono text-[11px] tracking-wide text-slate-300 selection:bg-emerald-500/30">
            {displayUrl}
            <span
              className={`inline-block h-3 w-[2px] align-middle bg-emerald-400 ml-[1px] ${isTyping ? 'animate-pulse' : 'opacity-0'}`}
            />
          </div>
        </div>

        {/* Reload visual cue (hidden detail) */}
        <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="h-1.5 w-1.5 rounded-full bg-slate-500" />
        </div>
      </div>

      {/* 4. Right Side Actions (Visual Balance) */}
      <div className="flex gap-4 text-slate-500 shrink-0 pr-1">
        <Share size={14} className="transition hover:text-slate-200 cursor-pointer" />
        <Plus size={16} className="transition hover:text-slate-200 cursor-pointer" />
        <div className="w-px h-4 bg-white/10 my-auto" />
        <MoreHorizontal size={16} className="transition hover:text-slate-200 cursor-pointer" />
      </div>

    </div>
  );
}