import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

export const NestIcon = forwardRef(function NestIcon(
  { size = 64, className = "", showGlow = true, glowOpacity = 0.5 },
  ref,
) {
  return (
    <div ref={ref} className={`relative select-none ${className}`} style={{ width: size, height: size }}>
      
      {/* 1. Outer Glow */}
      {showGlow && (
        <div
          className="absolute inset-0 bg-emerald-500/30 blur-2xl rounded-3xl animate-pulse"
          style={{ opacity: glowOpacity }}
        />
      )}

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        <defs>
          <style>
            {`
              @keyframes auroraFill {
                0% { stop-color: #34d399; }
                25% { stop-color: #3b82f6; }
                50% { stop-color: #8b5cf6; }
                75% { stop-color: #3b82f6; }
                100% { stop-color: #34d399; }
              }
              .aurora-1 { animation: auroraFill 6s infinite linear; }
              .aurora-2 { animation: auroraFill 6s infinite linear; animation-delay: -1.5s; }
              .aurora-3 { animation: auroraFill 6s infinite linear; animation-delay: -3s; }
            `}
          </style>
          
          <linearGradient id="iconGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" className="aurora-1" />
            <stop offset="50%" className="aurora-2" />
            <stop offset="100%" className="aurora-3" />
          </linearGradient>

          <mask id="n-cutout-correct">
            <rect x="0" y="0" width="100" height="100" rx="28" fill="white" />
            <path 
              d="M28 28 V72 H38 L62 38 V72 H72 V28 H62 L38 62 V28 H28 Z" 
              fill="black" 
            />
          </mask>
        </defs>

        <rect 
          x="0" y="0" width="100" height="100" rx="28" 
          fill="url(#iconGradient)" 
          mask="url(#n-cutout-correct)" 
        />
        
        <rect 
          x="1" y="1" width="98" height="98" rx="27" 
          stroke="white" strokeOpacity="0.2" strokeWidth="2"
          fill="none"
        />
      </svg>
    </div>
  );
});
