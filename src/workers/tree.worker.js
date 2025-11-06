/*
  Workerized background renderer using OffscreenCanvas.
  Draws a soft, animated particle/tree-like field. Theme colors are pushed in
  from the main thread via postMessage({ type: 'theme', colors: {...} }).
*/
/* eslint-env worker */
/* eslint-disable no-restricted-globals */

let ctx = null;
let width = 0;
let height = 0;
let dpr = 1;
let animationFrame = null;
let running = false;

let colors = {
  bg: '#041b29',
  primary: '#0f766e',
  accent: '#22d3ee',
};

// Simple PRNG
function rand(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function resize(w, h, devicePixelRatio = 1) {
  width = Math.floor(w);
  height = Math.floor(h);
  dpr = devicePixelRatio || 1;
  if (ctx && ctx.canvas) {
    ctx.canvas.width = Math.floor(width * dpr);
    ctx.canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
}

function clear() {
  if (!ctx) return;
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, width, height);
}

function draw(ts) {
  if (!running || !ctx) return;
  clear();

  const t = ts * 0.001;
  const cx = width / 2;
  const cy = height * 0.95;
  const count = 180;

  // Glowing base
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const r = 40 + 24 * Math.sin(t * 0.7 + i * 0.15);
    const x = cx + Math.cos(a) * r * (1 + 0.4 * Math.sin(t + i));
    const y = cy - i * 3 - 60 * Math.sin(t * 0.3 + i * 0.05);

    const alpha = 0.06 + 0.04 * Math.sin(t * 0.9 + i);
    ctx.fillStyle = hexToRgba(colors.accent, Math.max(0, alpha));
    ctx.beginPath();
    ctx.arc(x, y, 6 + 2 * Math.sin(t * 1.2 + i), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Stems
  ctx.strokeStyle = hexToRgba(colors.primary, 0.6);
  for (let i = 0; i < 80; i++) {
    const n = i * 0.07 + Math.sin(t * 0.4 + i) * 0.06;
    const sway = 30 * Math.sin(t * 0.8 + i * 0.3);
    const x1 = cx + sway * 0.1;
    const y1 = cy - i * 7;
    const x2 = cx + sway * 0.25 + Math.sin(i * 0.2) * 2;
    const y2 = y1 - 10 - Math.cos(t + i) * 2;

    ctx.lineWidth = Math.max(0.5, 3 - i * 0.03);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  animationFrame = self.requestAnimationFrame(draw);
}

function start() {
  if (running) return;
  running = true;
  animationFrame = self.requestAnimationFrame(draw);
}

function stop() {
  running = false;
  if (animationFrame) {
    self.cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
}

function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

onmessage = (e) => {
  const { type } = e.data || {};
  if (type === 'init') {
    const { canvas, dpr: devicePixelRatio = 1, width: w, height: h } = e.data;
    ctx = canvas.getContext('2d');
    resize(w, h, devicePixelRatio);
    start();
    return;
  }
  if (type === 'resize') {
    resize(e.data.width, e.data.height, e.data.dpr);
    return;
  }
  if (type === 'theme') {
    colors = { ...colors, ...e.data.colors };
    return;
  }
  if (type === 'pause') {
    stop();
    return;
  }
  if (type === 'resume') {
    start();
    return;
  }
};
