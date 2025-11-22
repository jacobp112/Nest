'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Lock } from 'lucide-react';

const TRAFFIC_LIGHTS = [
  { color: '#FF5F57', label: 'Close tab', symbol: 'x' },
  { color: '#FEBC2E', label: 'Minimize window', symbol: '-' },
  { color: '#28C840', label: 'Expand window', symbol: '+' },
];

const clampLabel = (value) => {
  if (!value) return 'VIEW';
  return value.replace(/https?:\/\//, '').split(/[/?#]/)[0].slice(0, 3).toUpperCase();
};

export default function BrowserChrome({ url = 'nest.finance', faviconColor = '#34d399', reducedMotion = false }) {
  const [displayUrl, setDisplayUrl] = useState(url);
  const timeoutsRef = useRef([]);
  const lastUpdateRef = useRef(0);

  const clearTypingTimers = () => {
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current = [];
  };

  useEffect(() => () => clearTypingTimers(), []);

  useEffect(() => {
    clearTypingTimers();

    if (!url) {
      setDisplayUrl('');
      return;
    }

    const now = performance.now();
    const elapsed = now - lastUpdateRef.current;
    lastUpdateRef.current = now;

    if (reducedMotion || elapsed < 180) {
      setDisplayUrl(url);
      return;
    }

    setDisplayUrl('');
    const chars = url.split('');
    chars.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setDisplayUrl(url.slice(0, index + 1));
      }, 70 + index * 28);
      timeoutsRef.current.push(timeout);
    });

    const finalize = setTimeout(() => setDisplayUrl(url), 70 + chars.length * 28 + 120);
    timeoutsRef.current.push(finalize);
  }, [url, reducedMotion]);

  return (
    <div className="flex items-center gap-4 border-b border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
      <div className="flex gap-2">
        {TRAFFIC_LIGHTS.map((light) => (
          <button
            key={light.label}
            type="button"
            className="group relative flex h-3.5 w-3.5 items-center justify-center rounded-full transition shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white/70"
            style={{ backgroundColor: light.color }}
            aria-label={light.label}
          >
            <span className="pointer-events-none text-[8px] font-bold text-black/40 opacity-0 transition group-hover:opacity-70">
              {light.symbol}
            </span>
          </button>
        ))}
      </div>

      <div className="flex gap-4 text-slate-500" aria-hidden="true">
        <ChevronLeft size={16} className="transition hover:text-slate-200" />
        <ChevronRight size={16} className="transition hover:text-slate-200" />
        <RotateCw size={14} className="transition hover:text-slate-200" />
      </div>

      <div className="mx-4 flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/5 bg-slate-950/60 px-3 py-1.5 text-center font-mono text-xs text-slate-200 shadow-inner">
        <Lock size={12} className="text-emerald-400" aria-hidden="true" />
        <span aria-hidden="true" className="truncate">
          {displayUrl}
        </span>
        <span className="sr-only">{url}</span>
      </div>

      <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-slate-400">
        <span>Tab</span>
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 font-semibold text-[11px] shadow-lg"
          style={{ background: faviconColor, color: '#020617' }}
          aria-hidden="true"
        >
          {clampLabel(url)}
        </span>
      </div>
    </div>
  );
}
