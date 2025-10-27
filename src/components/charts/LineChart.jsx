import React, { useContext, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import ThemeContext from '../../contexts/ThemeContext.jsx';

export default function LineChart({ data = [], color, showTooltip = true, height = 140 }) {
  const { theme } = useContext(ThemeContext);

  const rechartsData = useMemo(
    () => data.map((d) => ({ name: d.x, value: Number(d.y) })),
    [data],
  );

  const colors = useMemo(() => {
    const primary = color || theme?.colors?.primary || '#2563EB';
    const border = theme?.colors?.border || '#e2e8f0';
    const surfaceMuted = theme?.colors?.surfaceMuted || '#f1f5f9';
    const textMuted = theme?.colors?.textMuted || '#64748b';

    return {
      line: primary,
      grid: border,
      axis: textMuted,
      cursor: surfaceMuted,
    };
  }, [color, theme]);

  const tooltipStyle = useMemo(
    () => ({
      backgroundColor: theme?.colors?.surface || '#ffffff',
      border: `1px solid ${theme?.colors?.border || '#e2e8f0'}`,
      borderRadius: '0.75rem',
      boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)',
      color: theme?.colors?.textPrimary || '#0f172a',
      padding: '0.75rem 0.95rem',
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
        <ReLineChart data={rechartsData} margin={{ top: 6, right: 12, left: 0, bottom: 6 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: colors.axis }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: colors.axis }} axisLine={false} tickLine={false} />
          {showTooltip && (
            <Tooltip cursor={{ stroke: colors.cursor, strokeWidth: 1 }} contentStyle={tooltipStyle} />
          )}
          <Line type="monotone" dataKey="value" stroke={colors.line} strokeWidth={2.25} dot={false} />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
}
