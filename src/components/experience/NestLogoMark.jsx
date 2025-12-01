import React, { forwardRef } from 'react';

// Simple vector mark for Nest with transparent background and layered strokes
const NestLogoMark = forwardRef(function NestLogoMark({ size = 320, accent = '#34d399', secondary = '#6366f1' }, ref) {
  return (
    <div
      ref={ref}
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 512 512"
        role="img"
        aria-label="Nest logo mark"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="nestGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.95" />
            <stop offset="100%" stopColor={secondary} stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#nestGlow)" strokeLinecap="round">
          <path
            d="M96 244c28-74 98-132 182-132 97 0 175 74 175 166 0 73-58 131-132 131-53 0-96-39-96-88 0-42 34-76 76-76 35 0 64 25 64 56 0 24-18 44-40 44-17 0-32-14-32-30"
            strokeWidth="28"
            strokeOpacity="0.9"
          />
          <path
            d="M126 304c30 44 88 72 151 72 44 0 86-10 124-30"
            strokeWidth="20"
            strokeOpacity="0.65"
          />
          <path
            d="M142 192c34-36 88-62 150-62 46 0 89 14 124 40"
            strokeWidth="16"
            strokeOpacity="0.55"
          />
          <path
            d="M168 356c28 28 72 46 120 46 38 0 74-10 104-28"
            strokeWidth="12"
            strokeOpacity="0.45"
          />
          <path
            d="M190 166c30-22 68-34 110-34 44 0 86 14 116 38"
            strokeWidth="10"
            strokeOpacity="0.35"
          />
        </g>
      </svg>
    </div>
  );
});

export default NestLogoMark;
