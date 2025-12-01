import React from 'react';
import { motion } from 'framer-motion';

export const NestNegativeLogo = ({ size = 64, withText = true }) => {
  return (
    <div className="flex items-center gap-4 select-none group">
      <div className="relative" style={{ width: size, height: size }}>
        
        {/* 1. Ambient Glow (Behind everything) */}
        <div className="absolute inset-0 bg-emerald-500/30 blur-2xl rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-700" />

        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 overflow-visible"
        >
          <defs>
            {/* The Gradient that paints the "structure" */}
            <linearGradient id="structureGradient" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="#34d399" /> {/* Emerald-400 */}
              <stop offset="100%" stopColor="#6366f1" /> {/* Indigo-500 */}
            </linearGradient>

            {/* The Mask: White = Visible, Black = Invisible (The "N") */}
            <mask id="n-mask">
              {/* White background means "Show the structure" */}
              <rect x="0" y="0" width="100" height="100" fill="white" rx="24" />
              
              {/* Black N means "Cut this out" (The Negative Space) */}
              <path
                d="M28 28V72H38L62 38V72H72V28H62L38 62V28H28Z"
                fill="black"
              />
            </mask>

            {/* A pattern to give the structure texture (The "Nest" weave) */}
            <pattern id="weave" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
               <path d="M-2 10L10 -2" stroke="url(#structureGradient)" strokeWidth="1.5" />
            </pattern>
          </defs>

          {/* 2. The Structure Layer 
             This is the solid shape that gets masked.
          */}
          <motion.g 
            mask="url(#n-mask)"
            initial={{ scale: 0.95 }}
            whileHover={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            {/* The Glassy Block */}
            <rect 
                x="0" y="0" width="100" height="100" rx="24" 
                fill="rgba(255,255,255,0.03)" 
                stroke="url(#structureGradient)" 
                strokeWidth="2"
            />
            
            {/* The "Fibers" inside the block */}
            <rect x="2" y="2" width="96" height="96" rx="22" fill="url(#weave)" opacity="0.8" />
            
            {/* A subtle sheen animation moving across the block */}
            <motion.rect
                x="-100" y="-20" width="40" height="140"
                fill="url(#structureGradient)"
                opacity="0.2"
                transform="rotate(20)"
                animate={{ x: [0, 300] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
                style={{ mixBlendMode: 'overlay' }}
            />
          </motion.g>

          {/* 3. The "Void" Highlight
             Adds a faint inner glow to the edges of the cut-out N to give it depth 
          */}
          <path
            d="M28 28V72H38L62 38V72H72V28H62L38 62V28H28Z"
            fill="none"
            stroke="white"
            strokeWidth="1"
            strokeOpacity="0.1"
            pointerEvents="none"
          />

        </svg>
      </div>

      {withText && (
        <div className="flex flex-col justify-center">
          <h1 className="font-display text-2xl font-bold tracking-tighter text-white leading-none group-hover:tracking-normal transition-all duration-500">
            Nest
          </h1>
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500 group-hover:text-emerald-400 transition-colors">
            Wealth OS
          </span>
        </div>
      )}
    </div>
  );
};
