import React from 'react';

export default function BulletChart({ value = 0, target = 0, ranges = [], height = 28 }) {
  const width = 400;
  const total = ranges.reduce((s, r) => s + r.value, 0) || Math.max(target, value) || 1;
  let x = 0;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height }}>
      {ranges.map((r, i) => {
        const w = (r.value / total) * width;
        const rect = <rect key={i} x={x} y={height * 0.2} width={w} height={height * 0.6} fill={r.color} />;
        x += w;
        return rect;
      })}
      {/* value bar */}
      <rect x={0} y={height * 0.35} width={(value / total) * width} height={height * 0.3} fill="#2563EB" rx={4} />
      {/* target marker */}
      <line x1={(target / total) * width} x2={(target / total) * width} y1={height * 0.15} y2={height * 0.85} stroke="#111827" strokeWidth={2} />
    </svg>
  );
}
