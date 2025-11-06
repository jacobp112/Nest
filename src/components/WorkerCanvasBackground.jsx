import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getCssVar } from '../utils/cssVars';

const supportsOffscreen = () => {
  try {
    return typeof window !== 'undefined' && 'OffscreenCanvas' in window && 'transferControlToOffscreen' in HTMLCanvasElement.prototype;
  } catch (_) {
    return false;
  }
};

const prefersReducedMotion = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (_) {
    return false;
  }
};

const themeColors = () => ({
  bg: getCssVar('--color-background') || '#041b29',
  primary: getCssVar('--color-primary') || '#0f766e',
  accent: getCssVar('--color-accent') || '#22d3ee',
});

export default function WorkerCanvasBackground({ className = 'absolute inset-0 pointer-events-none' }) {
  const canvasRef = useRef(null);
  const workerRef = useRef(null);
  const [enabled, setEnabled] = useState(() => supportsOffscreen() && !prefersReducedMotion());

  const postTheme = useCallback(() => {
    if (!workerRef.current) return;
    workerRef.current.postMessage({ type: 'theme', colors: themeColors() });
  }, []);

  useEffect(() => {
    if (!enabled || !canvasRef.current) return undefined;
    const worker = new Worker(new URL('../workers/tree.worker.js', import.meta.url), { type: 'module' });
    workerRef.current = worker;
    const canvas = canvasRef.current;
    const offscreen = canvas.transferControlToOffscreen();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const { width, height } = canvas.getBoundingClientRect();
    worker.postMessage({ type: 'init', canvas: offscreen, dpr, width, height }, [offscreen]);
    postTheme();

    const onResize = () => {
      const rect = canvas.getBoundingClientRect();
      worker.postMessage({ type: 'resize', width: rect.width, height: rect.height, dpr: Math.min(2, window.devicePixelRatio || 1) });
    };
    const onVisibility = () => {
      worker.postMessage({ type: document.hidden ? 'pause' : 'resume' });
    };
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      worker.terminate();
      workerRef.current = null;
    };
  }, [enabled, postTheme]);

  useEffect(() => {
    // Re-send theme on possible changes
    postTheme();
  }, [postTheme]);

  if (!enabled) return null;
  return <canvas ref={canvasRef} className={className} />;
}

