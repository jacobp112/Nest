import React from 'react';

/**
 * Vector Nest wordmark + symbol with soft shadow. Transparent background.
 */
const NestShadowLogo = ({ width = 440, height = 140, primary = '#22d3ee', secondary = '#8b5cf6' }) => (
  <svg
    role="img"
    aria-label="Nest logo"
    width={width}
    height={height}
    viewBox="0 0 440 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="nestGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={primary} />
        <stop offset="100%" stopColor={secondary} />
      </linearGradient>
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="16" floodColor="#0f172a" floodOpacity="0.35" />
      </filter>
    </defs>

    {/* Symbol */}
    <g filter="url(#softShadow)">
      <circle cx="70" cy="70" r="54" fill="url(#nestGradient)" opacity="0.12" />
      <circle cx="70" cy="70" r="48" stroke="url(#nestGradient)" strokeWidth="6" opacity="0.6" />
      <path
        d="M45 80c10 12 26 20 43 20 9 0 18-2 26-6"
        stroke="url(#nestGradient)"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M48 60c10-14 27-24 47-24 13 0 25 4 35 10"
        stroke="url(#nestGradient)"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.65"
      />
      <path
        d="M58 72c8 8 20 14 34 14 12 0 24-3 34-8"
        stroke="url(#nestGradient)"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M70 90c6 6 16 10 26 10 8 0 16-2 22-6"
        stroke="url(#nestGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.45"
      />
    </g>

    {/* Wordmark */}
    <g filter="url(#softShadow)" transform="translate(140 32)">
      <path
        d="M12 69V10h16l22 34 22-34h16v59h-15V37l-22 32h-2L27 37v32H12Z"
        fill="url(#nestGradient)"
      />
      <path
        d="M111 70c-17 0-30-12-30-30 0-18 12-30 30-30 12 0 22 5 26 16l-12 5c-2-6-7-9-14-9-9 0-15 6-15 18 0 11 6 18 16 18 7 0 12-4 14-9l12 5c-4 10-14 16-27 16Z"
        fill="url(#nestGradient)"
      />
      <path
        d="M150 69V10h45v12h-31v10h27v12h-27v12h32v13h-46Z"
        fill="url(#nestGradient)"
      />
      <path
        d="M205 52h15c1 5 4 8 12 8 7 0 11-3 11-7 0-4-3-6-9-7l-7-1c-14-2-20-9-20-19 0-13 11-22 27-22 16 0 26 8 27 21h-15c-1-5-5-8-12-8-6 0-10 3-10 7 0 3 2 5 9 6l8 1c14 2 20 9 20 19 0 13-11 22-28 22-17 0-27-8-28-20Z"
        fill="url(#nestGradient)"
      />
    </g>
  </svg>
);

export default NestShadowLogo;
