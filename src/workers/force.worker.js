/* eslint-env worker */
/* eslint-disable no-restricted-globals */

// Minimal force simulation without external deps (spring links, repulsion, collision, centering)
let rafId = null;
let nodes = [];
let links = [];
let width = 800;
let height = 500;

const rand = (min, max) => min + Math.random() * (max - min);

function initSimulation(payload) {
  width = payload.width || 800;
  height = payload.height || 500;
  nodes = (payload?.data?.nodes || []).map((n) => ({
    id: n.id,
    label: n.label,
    r: Number(n.r) || 6,
    x: isFinite(n.x) ? n.x : rand(0, width),
    y: isFinite(n.y) ? n.y : rand(0, height),
    vx: 0,
    vy: 0,
  }));
  const idToIndex = new Map(nodes.map((n, i) => [n.id, i]));
  links = (payload?.data?.links || [])
    .map((l) => {
      const s = typeof l.source === 'object' ? l.source.id : l.source;
      const t = typeof l.target === 'object' ? l.target.id : l.target;
      const si = idToIndex.get(s);
      const ti = idToIndex.get(t);
      if (si == null || ti == null) return null;
      return {
        si,
        ti,
        distance: Number(l.distance) || 60,
        strength: Number(l.strength) || 0.7,
        weight: Number(l.weight) || 1,
      };
    })
    .filter(Boolean);

  start();
}

function step(dt = 0.016) {
  const kCenter = 0.02;
  const kRepel = 2000; // repulsion constant
  const kLink = 0.05;  // spring stiffness
  const damping = 0.85;

  // Link springs
  for (let i = 0; i < links.length; i++) {
    const L = links[i];
    const a = nodes[L.si];
    const b = nodes[L.ti];
    let dx = b.x - a.x;
    let dy = b.y - a.y;
    let dist = Math.hypot(dx, dy) || 1e-6;
    const diff = dist - L.distance;
    const force = kLink * diff * L.strength;
    dx /= dist; dy /= dist;
    a.vx += force * dx;
    a.vy += force * dy;
    b.vx -= force * dx;
    b.vy -= force * dy;
  }

  // Repulsion (O(n^2)) small graphs only
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let dist2 = dx * dx + dy * dy + 0.01;
      let dist = Math.sqrt(dist2);
      const rep = kRepel / dist2;
      dx /= dist; dy /= dist;
      a.vx -= rep * dx;
      a.vy -= rep * dy;
      b.vx += rep * dx;
      b.vy += rep * dy;
      // Collision separation
      const minDist = (a.r || 6) + (b.r || 6) + 2;
      if (dist < minDist) {
        const push = (minDist - dist) * 0.5;
        a.vx -= push * dx;
        a.vy -= push * dy;
        b.vx += push * dx;
        b.vy += push * dy;
      }
    }
  }

  // Centering + integrate
  const cx = width / 2;
  const cy = height / 2;
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    n.vx += (cx - n.x) * kCenter * dt;
    n.vy += (cy - n.y) * kCenter * dt;
    n.vx *= damping;
    n.vy *= damping;
    n.x += n.vx * dt * 60;
    n.y += n.vy * dt * 60;
  }
}

function start() {
  stop();
  const loop = (ts) => {
    step(0.016);
    postMessage({ type: 'tick', nodes: nodes.map(({ id, x, y }) => ({ id, x, y })) });
    rafId = requestAnimationFrame(loop);
  };
  rafId = requestAnimationFrame(loop);
}

function stop() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
}

onmessage = (e) => {
  const { type } = e.data || {};
  if (type === 'init' || type === 'update') {
    initSimulation(e.data);
    return;
  }
  if (type === 'stop') {
    stop();
  }
};
