import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useD3 } from '../../hooks/useD3';

export default function ForceGraph({ data, width = 680, height = 320, className = '', onNodeSelect }) {
  const workerRef = useRef(null);
  const containerRef = useRef(null);
  const [positions, setPositions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: '' });

  useEffect(() => {
    const w = new Worker(new URL('../../workers/force.worker.js', import.meta.url), { type: 'module' });
    workerRef.current = w;
    w.onmessage = (e) => {
      if (e?.data?.type === 'tick') {
        setPositions(e.data.nodes);
      }
    };
    w.postMessage({ type: 'init', width, height, data });
    return () => {
      try { w.postMessage({ type: 'stop' }); } catch (_) {}
      w.terminate();
      workerRef.current = null;
    };
  }, [data, width, height]);

  const merged = useMemo(() => {
    const map = new Map(positions.map((p) => [p.id, p]));
    const nodes = (data?.nodes || []).map((n) => ({ ...n, ...map.get(n.id) }));
    const links = data?.links || [];
    return { nodes, links };
  }, [positions, data]);

  const neighborMap = useMemo(() => {
    const m = new Map();
    for (const l of merged.links) {
      const s = l.source?.id || l.source;
      const t = l.target?.id || l.target;
      if (!m.has(s)) m.set(s, new Set());
      if (!m.has(t)) m.set(t, new Set());
      m.get(s).add(t);
      m.get(t).add(s);
    }
    return m;
  }, [merged]);

  const ref = useD3((svgEl) => {
    // Basic SVG render, theme-aware via CSS variables
    while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);
    svgEl.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svgEl.appendChild(g);

    const linkGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    linkGroup.setAttribute('stroke', 'var(--color-border)');
    linkGroup.setAttribute('stroke-opacity', '0.6');
    g.appendChild(linkGroup);

    const maxW = Math.max(1, ...merged.links.map((l) => l.weight || 1));
    const minStroke = 0.6;
    const maxStroke = 3;
    const strokeFor = (w) => {
      const ww = Math.max(1, w || 1);
      return minStroke + (maxStroke - minStroke) * (ww - 1) / (maxW - 1 || 1);
    };

    for (const l of merged.links) {
      const src = merged.nodes.find((n) => n.id === (l.source.id || l.source));
      const tgt = merged.nodes.find((n) => n.id === (l.target.id || l.target));
      if (!src || !tgt) continue;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', `${src.x || 0}`);
      line.setAttribute('y1', `${src.y || 0}`);
      line.setAttribute('x2', `${tgt.x || 0}`);
      line.setAttribute('y2', `${tgt.y || 0}`);
      line.setAttribute('stroke-width', `${strokeFor(l.weight)}`);
      line.setAttribute('data-source', `${l.source.id || l.source}`);
      line.setAttribute('data-target', `${l.target.id || l.target}`);
      linkGroup.appendChild(line);
    }

    const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.appendChild(nodeGroup);
    const isHighlightedNode = (id) => {
      if (!selectedId) return true;
      if (id === selectedId) return true;
      return neighborMap.get(selectedId)?.has(id);
    };
    const isHighlightedLink = (s, t) => {
      if (!selectedId) return true;
      return s === selectedId || t === selectedId;
    };

    for (const n of merged.nodes) {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', `${n.x || 0}`);
      circle.setAttribute('cy', `${n.y || 0}`);
      circle.setAttribute('r', `${n.r || 6}`);
      const id = n.id || '';
      const fill = id.startsWith('acc:') ? 'var(--color-secondary)' : id.startsWith('mer:') ? 'var(--color-accent)' : 'var(--color-primary)';
      circle.setAttribute('fill', fill);
      circle.setAttribute('fill-opacity', isHighlightedNode(n.id) ? '0.9' : '0.25');
      circle.setAttribute('stroke', 'var(--color-surface)');
      circle.setAttribute('stroke-width', '1');
      circle.style.cursor = 'pointer';
      circle.addEventListener('click', () => {
        setSelectedId(n.id);
        if (typeof onNodeSelect === 'function') onNodeSelect(n);
      });
      circle.addEventListener('mouseenter', (e) => {
        const rect = containerRef.current?.getBoundingClientRect();
        const cx = e.clientX - (rect?.left || 0) + 8;
        const cy = e.clientY - (rect?.top || 0) + 8;
        setTooltip({ visible: true, x: cx, y: cy, text: n.label || n.id });
      });
      circle.addEventListener('mousemove', (e) => {
        const rect = containerRef.current?.getBoundingClientRect();
        const cx = e.clientX - (rect?.left || 0) + 8;
        const cy = e.clientY - (rect?.top || 0) + 8;
        setTooltip((t) => ({ ...t, x: cx, y: cy }));
      });
      circle.addEventListener('mouseleave', () => {
        setTooltip((t) => ({ ...t, visible: false }));
      });
      nodeGroup.appendChild(circle);

      if (n.label) {
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', `${(n.x || 0) + 10}`);
        label.setAttribute('y', `${(n.y || 0) + 4}`);
        label.setAttribute('fill', 'var(--color-text-secondary)');
        label.setAttribute('opacity', isHighlightedNode(n.id) ? '1' : '0.3');
        label.style.fontSize = '12px';
        label.textContent = n.label;
        nodeGroup.appendChild(label);
      }
    }

    return () => {
      while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);
    };
    // Dim non-highlighted links
    if (selectedId) {
      const lines = linkGroup.querySelectorAll('line');
      lines.forEach((ln) => {
        const s = ln.getAttribute('data-source');
        const t = ln.getAttribute('data-target');
        ln.setAttribute('stroke-opacity', isHighlightedLink(s, t) ? '0.8' : '0.2');
      });
    }

  }, [JSON.stringify(merged), selectedId]);

  return (
    <div ref={containerRef} className={className} style={{ position: 'relative' }}>
      <svg ref={ref} role="img" aria-label="Force graph" style={{ width: '100%', height }} />
      {tooltip.visible ? (
        <div
          style={{
            position: 'absolute',
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -120%)',
            pointerEvents: 'none',
            background: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--border-radius-small)',
            padding: '4px 6px',
            fontSize: 12,
            boxShadow: 'var(--ui-shadow-soft)'
          }}
        >
          {tooltip.text}
        </div>
      ) : null}
    </div>
  );
}
