import React from 'react';
import { ResponsiveContainer, BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function BarChart({ data = [], colorMapping = {}, height = 180 }) {
  if (!data || data.length === 0) return <div style={{ height }}>No data</div>;

  const rechartsData = data.map((d) => ({ name: d.label, value: Number(d.value) }));

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart data={rechartsData} margin={{ top: 6, right: 12, left: 0, bottom: 6 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="value" radius={[8, 8, 4, 4]} fill="#2563EB" />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}
