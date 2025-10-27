import React, { useContext, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import ThemeContext from '../../contexts/ThemeContext.jsx';

export default function BarChart({ data = [], colorMapping = {}, height = 180 }) {
  const { theme } = useContext(ThemeContext);

  const rechartsData = useMemo(
    () =>
      data.map((d) => ({
        name: d.label,
        value: Number(d.value),
        fill: colorMapping[d.label] || colorMapping.default,
      })),
    [colorMapping, data],
  );

  const colors = useMemo(() => {
    const fallback = theme?.colors?.primary || '#2563EB';
    const surfaceMuted = theme?.colors?.surfaceMuted || '#f1f5f9';
    const border = theme?.colors?.border || '#e2e8f0';
    const textMuted = theme?.colors?.textMuted || '#64748b';

    return {
      bar: fallback,
      grid: border,
      axis: textMuted,
      background: surfaceMuted,
    };
  }, [theme]);

  const tooltipStyle = useMemo(
    () => ({
      backgroundColor: theme?.colors?.surface || '#ffffff',
      border: `1px solid ${theme?.colors?.border || '#e2e8f0'}`,
      borderRadius: '0.75rem',
      boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)',
      color: theme?.colors?.textPrimary || '#0f172a',
      padding: '0.75rem 0.95rem',
      textTransform: 'capitalize',
      fontSize: '0.75rem',
    }),
    [theme],
  );

  if (!data || data.length === 0) {
    return <div style={{ height }}>No data</div>;
  }

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart data={rechartsData} margin={{ top: 6, right: 12, left: 0, bottom: 6 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: colors.axis }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: colors.axis }} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: colors.background }} contentStyle={tooltipStyle} />
          <Bar dataKey="value" radius={[8, 8, 4, 4]} fill={colors.bar} background={{ fill: 'transparent' }}>
            {rechartsData.map((entry) => (
              <Cell key={entry.name} fill={entry.fill || colors.bar} />
            ))}
          </Bar>
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}
