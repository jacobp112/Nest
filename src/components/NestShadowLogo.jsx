import React from 'react';
import { motion } from 'framer-motion';

export const NestShadowLogo = ({ className = "", showIcon = true, textOffset = 0 }) => {
  const id = React.useId();
  const iconGradientId = `iconGradient-${id}`;
  const iconMaskId = `icon-mask-${id}`;
  const textGradientId = `textGradient-${id}`;
  const textMaskId = `text-mask-${id}`;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`} aria-label="Nest Logo">

      {/* 1. THE ICON (Negative Space Monogram) */}
      {showIcon && (
        <div className="relative w-10 h-10 shrink-0">
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
            <defs>
              {/* Re-use the animation style here to ensure sync */}
              {/* Animation styles moved to text SVG to ensure availability */}
              <linearGradient id={iconGradientId} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" className="stop-a" />
                <stop offset="50%" className="stop-b" />
                <stop offset="100%" className="stop-c" />
              </linearGradient>

              {/* Mask to carve out the "N" */}
              <mask id={iconMaskId}>
                <rect x="0" y="0" width="100" height="100" rx="24" fill="white" />
                <path d="M28 28V72H38L62 38V72H72V28H62L38 62V28H28Z" fill="black" />
              </mask>
            </defs>

            {/* The Solid Block */}
            <rect
              x="0" y="0" width="100" height="100" rx="24"
              fill={`url(#${iconGradientId})`}
              mask={`url(#${iconMaskId})`}
            />
          </svg>
        </div>
      )}

      {/* 2. THE TEXT (Shadow Effect) */}
      <div className="relative h-10 w-32" style={{ transform: `translateX(${textOffset}px)` }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 140 50"
          fill="none"
          className="overflow-visible"
        >
          <defs>
            <linearGradient id={textGradientId} x1="0" y1="0" x2="140" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%" className="stop-a" />
              <stop offset="50%" className="stop-b" />
              <stop offset="100%" className="stop-c" />
            </linearGradient>

            <style>
              {`
                @keyframes auroraFlow {
                  0% { stop-color: #34d399; }
                  25% { stop-color: #3b82f6; }
                  50% { stop-color: #8b5cf6; }
                  75% { stop-color: #3b82f6; }
                  100% { stop-color: #34d399; }
                }
                .stop-a { animation: auroraFlow 6s infinite linear; }
                .stop-b { animation: auroraFlow 6s infinite linear; animation-delay: -1.5s; }
                .stop-c { animation: auroraFlow 6s infinite linear; animation-delay: -3s; }

                .nest-font {
                  font-family: 'Outfit', system-ui, -apple-system, sans-serif;
                  font-weight: 900;
                  font-size: 48px;
                  letter-spacing: -2px;
                }
              `}
            </style>

            <mask id={textMaskId}>
              <rect x="-50" y="-50" width="300" height="200" fill="white" />
              {/* The "Cutout" Layer */}
              <text x="0" y="42" className="nest-font" fill="black">
                Nest
              </text>
            </mask>
          </defs>

          {/* The "Shadow" Layer */}
          <motion.text
            x="3"
            y="42"
            className="nest-font"
            fill={`url(#${textGradientId})`}
            stroke={`url(#${textGradientId})`}
            strokeWidth="1.5"
            mask={`url(#${textMaskId})`}
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 3 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            Nest
          </motion.text>
        </svg>
      </div>
    </div>
  );
};
