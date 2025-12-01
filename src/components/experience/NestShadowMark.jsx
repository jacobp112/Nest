import React from 'react';

/**
 * Symbol-only version with layered strokes and shadow.
 */
const NestShadowMark = ({ size = 240, primary = '#22d3ee', secondary = '#8b5cf6' }) => (
  <svg
    role="img"
    aria-label="Nest symbol"
    width={size}
    height={size}
    viewBox="0 0 240 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="nestMarkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={primary} />
        <stop offset="100%" stopColor={secondary} />
      </linearGradient>
      <filter id="nestMarkShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#0f172a" floodOpacity="0.35" />
      </filter>
    </defs>

    <g filter="url(#nestMarkShadow)" stroke="url(#nestMarkGradient)" strokeLinecap="round" fill="none">
      <circle cx="120" cy="120" r="90" strokeWidth="10" opacity="0.25" />
      <path
        d="M62 128c18 26 51 42 88 42 25 0 49-6 69-18"
        strokeWidth="10"
        opacity="0.55"
      />
      <path
        d="M68 92c20-26 52-42 88-42 27 0 52 8 72 22"
        strokeWidth="9"
        opacity="0.5"
      />
      <path
        d="M82 140c16 18 40 30 68 30 20 0 38-5 54-14"
        strokeWidth="8"
        opacity="0.45"
      />
      <path
        d="M96 78c18-12 40-20 64-20 24 0 46 8 64 20"
        strokeWidth="7"
        opacity="0.4"
      />
      <path
        d="M106 154c12 12 30 20 50 20 16 0 30-4 42-10"
        strokeWidth="6"
        opacity="0.35"
      />
    </g>
  </svg>
);

export default NestShadowMark;
