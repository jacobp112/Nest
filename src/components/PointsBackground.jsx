import React, { useMemo } from 'react';

// Soft constellation background rendered as SVG so it stays inexpensive
const PointsBackground = ({ className = '', pointCount = 64 }) => {
  const points = useMemo(() => {
    const items = [];
    for (let i = 0; i < pointCount; i += 1) {
      items.push({
        id: `pt-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        r: Math.random() * 1.6 + 0.4,
        opacity: 0.25 + Math.random() * 0.4,
      });
    }
    return items;
  }, [pointCount]);

  return (
    <div className={`pointer-events-none ${className}`} aria-hidden>
      <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <radialGradient id="bg-glow" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.25" />
            <stop offset="70%" stopColor="var(--color-surface)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#bg-glow)" />
        {points.map((point) => (
          <circle
            key={point.id}
            cx={point.x}
            cy={point.y}
            r={point.r}
            fill="var(--color-accent)"
            opacity={point.opacity}
          />
        ))}
      </svg>
    </div>
  );
};

export default PointsBackground;

