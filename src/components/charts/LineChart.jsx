import React from 'react';
import { ResponsiveContainer, LineChart as ReLineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function LineChart({ data = [], color = '#2563EB', showTooltip = true, height = 140 }) {
  if (!data || data.length === 0) return <div style={{ height }}>No data</div>;

  // Recharts expects data points like { x: ..., y: ... } or {name, value}
  const rechartsData = data.map((d) => ({ name: d.x, value: Number(d.y) }));

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ReLineChart data={rechartsData} margin={{ top: 6, right: 12, left: 0, bottom: 6 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          {showTooltip && <Tooltip />}
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
}
