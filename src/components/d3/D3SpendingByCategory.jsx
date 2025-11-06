import React, { useMemo } from 'react';
import { useD3 } from '../../hooks/useD3';

// Simple horizontal bar chart of spending by category
export default function D3SpendingByCategory({ data = [], height = 260, margin = { top: 8, right: 8, bottom: 24, left: 120 } }) {
  const theme = useMemo(() => {
    return {
      bar: 'var(--color-destructive)',
      grid: 'var(--color-border)',
      text: 'var(--color-text-secondary)',
      bg: 'var(--color-surface)',
    };
  }, []);

  const width = 680;
  const ref = useD3((svgEl) => {
    // Simple SVG render without external d3 dependency
    // Clear
    while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);
    svgEl.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const sorted = [...data]
      .filter((d) => Number.isFinite(d.value))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    const names = sorted.map((d) => d.name);
    const max = Math.max(1, ...sorted.map((d) => d.value));
    const x = (v) => (v / max) * innerW;

    const padding = 0.18; // similar to scaleBand padding
    const band = innerH / (names.length + (names.length - 1) * padding);
    const step = band * (1 + padding);
    const yForIndex = (i) => i * step;

    // Root group
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${margin.left},${margin.top})`);
    svgEl.appendChild(g);

    // Left labels
    names.forEach((name, i) => {
      const ty = yForIndex(i) + band / 2;
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', '-8');
      text.setAttribute('y', `${ty}`);
      text.setAttribute('fill', theme.text);
      text.setAttribute('text-anchor', 'end');
      text.setAttribute('dominant-baseline', 'middle');
      text.style.fontSize = '12px';
      text.textContent = name;
      g.appendChild(text);
    });

    // Bars
    sorted.forEach((d, i) => {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', '0');
      rect.setAttribute('y', `${yForIndex(i)}`);
      rect.setAttribute('width', `${x(d.value)}`);
      rect.setAttribute('height', `${band}`);
      rect.setAttribute('fill', 'var(--color-destructive)');
      g.appendChild(rect);

      const tx = x(d.value) + 6;
      const ty = yForIndex(i) + band / 2;
      const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      valueText.setAttribute('x', `${tx}`);
      valueText.setAttribute('y', `${ty}`);
      valueText.setAttribute('fill', theme.text);
      valueText.setAttribute('dominant-baseline', 'middle');
      valueText.style.fontSize = '11px';
      valueText.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(d.value);
      g.appendChild(valueText);
    });

    // Bottom axis (few ticks)
    const ticks = 4;
    for (let i = 0; i <= ticks; i++) {
      const v = (max * i) / ticks;
      const tx = x(v);
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', `${tx}`);
      label.setAttribute('y', `${innerH + 16}`);
      label.setAttribute('text-anchor', i === 0 ? 'start' : i === ticks ? 'end' : 'middle');
      label.setAttribute('fill', theme.text);
      label.style.fontSize = '11px';
      label.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
      g.appendChild(label);
    }

    return () => {
      while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);
    };
  }, [JSON.stringify(data)]);

  return (
    <svg ref={ref} role="img" aria-label="Spending by category (D3)" style={{ width: '100%', height }} />
  );
}
