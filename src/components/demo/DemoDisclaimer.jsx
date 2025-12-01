import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { NestIcon } from '../NestIcon.jsx';
import { NestShadowLogo } from '../NestShadowLogo.jsx';
import { useIsMobile } from '../../hooks/useIsMobile';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.2, ease: "easeOut", staggerChildren: 0.2 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.8, ease: "easeInOut" }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

export default function DemoDisclaimer({ onEnter }) {
  const [hasMounted, setHasMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial={isMobile ? { opacity: 0 } : "hidden"}
      animate="visible"
      exit="exit"
      // Full screen, solid background, no scrolling
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center px-6 h-[100dvh] w-screen bg-[#020617] touch-none overscroll-none overflow-hidden"
    >
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full flex flex-col items-center text-center">

        {/* The Animated Icon Mark */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="scale-125 hover:scale-110 transition-transform duration-700">
            <NestIcon size={96} />
          </div>
        </motion.div>

        {/* The Text & Wordmark */}
        <motion.div variants={itemVariants} className="mb-10 flex flex-col items-center w-full">
          <span className="text-xl font-medium text-slate-400 uppercase tracking-widest mb-4">
            Welcome to
          </span>

          <div className="flex justify-center items-center scale-150 origin-center drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] pl-2">
            <NestShadowLogo showIcon={false} textOffset={6} />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6 max-w-md mx-auto">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent mx-auto" />

          <p className="text-lg text-slate-300 leading-relaxed font-light">
            We ask for your understanding that this is a <strong className="text-white font-medium">live preview</strong>.
          </p>

          <p className="text-sm text-slate-500 leading-relaxed">
            Some features are simulated, data is for demonstration purposes, and functionality is subject to change as we build the future of wealth management.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-12">
          <button
            onClick={onEnter}
            className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full bg-white text-slate-950 font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform duration-300 shadow-[0_0_50px_rgba(255,255,255,0.15)] overflow-hidden"
          >
            <span className="relative z-10">Enter Experience</span>
            <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform" />

            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
          </button>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="mt-8 text-[10px] text-slate-600 max-w-xs leading-relaxed mx-auto"
        >
          Names, characters, businesses, places, events, locales, and incidents are either the products of the author's imagination or used in a fictitious manner.
        </motion.p>

      </div>
    </motion.div>
  );
}
