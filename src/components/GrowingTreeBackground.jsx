import React from 'react';
import { ReactP5Wrapper } from 'react-p5-wrapper';

const sketch = (p5) => {
  let tree;
  let tipCache = [];
  let startMillis = 0;

  const backgroundHex = '#041b29';
  const growthSpeed = 0.00012; // controls how quickly the tree grows in

  const rebuildTree = () => {
    tree = generateTree(p5);
    tipCache = new Array(tree.branches.length);
    startMillis = p5.millis();
  };

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.pixelDensity(Math.min(2, window.devicePixelRatio || 1));
    rebuildTree();
  };

  p5.windowResized = () => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    rebuildTree();
  };

  p5.draw = () => {
    if (!tree) return;

    p5.background(backgroundHex);
    const elapsed = p5.millis() - startMillis;
    const growth = Math.min(1, elapsed * growthSpeed);
    const root = p5.createVector(p5.width / 2, p5.height * 0.95);
    const globalDrift = (p5.noise(999, elapsed * 0.00006) - 0.5) * 0.12;

    tree.branches.forEach((branch, index) => {
      const baseStart =
        branch.parentIndex === null ? root : tipCache[branch.parentIndex] || root;

      const sway =
        (p5.noise(branch.noiseSeed, elapsed * 0.00025 + branch.depth) - 0.5) *
          branch.swayAmplitude +
        globalDrift;

      const direction = p5
        .createVector(0, -branch.length)
        .rotate(branch.angle + sway);

      if (growth <= branch.progressStart) {
        tipCache[index] = baseStart.copy();
        return;
      }

      const localT =
        growth >= branch.progressEnd
          ? 1
          : (growth - branch.progressStart) /
            (branch.progressEnd - branch.progressStart);

      const currentEnd = p5.createVector(
        baseStart.x + direction.x * localT,
        baseStart.y + direction.y * localT,
      );

      p5.stroke(34, 197, 94, 220);
      p5.strokeWeight(p5.map(branch.depth, 0, tree.maxDepth, 5, 0.8));
      p5.drawingContext.shadowBlur = Math.max(0, 18 - branch.depth * 1.5);
      p5.drawingContext.shadowColor = 'rgba(16, 185, 129, 0.5)';
      p5.line(baseStart.x, baseStart.y, currentEnd.x, currentEnd.y);

      tipCache[index] =
        localT >= 1
          ? p5.createVector(baseStart.x + direction.x, baseStart.y + direction.y)
          : currentEnd.copy();
    });

    p5.drawingContext.shadowBlur = 0;

    tree.leaves.forEach((leaf) => {
      const anchor = tipCache[leaf.branchIndex];
      if (!anchor) return;

      const bloom = p5.constrain((growth - leaf.delay) / leaf.duration, 0, 1);
      if (bloom <= 0) return;

      const pulse = 1 + 0.08 * p5.sin(elapsed * 0.002 + leaf.noiseSeed);
      const size = leaf.maxSize * bloom * pulse;

      const glow = p5.color(56, 255, 178, 90 * bloom);
      const inner = p5.color(56, 255, 178, 200 * bloom);

      p5.noStroke();
      p5.fill(glow);
      p5.circle(anchor.x, anchor.y, size * 1.45);
      p5.fill(inner);
      p5.circle(anchor.x, anchor.y, size);
    });
  };

  function generateTree(p5) {
    const branches = [];
    const leaves = [];
    const maxDepth = 7;
    const baseLength = Math.min(p5.height, p5.width) * 0.28;
    const baseSpread = p5.PI / 5;

    function grow(parentIndex, depth, angle, length) {
      const index = branches.length;
      branches.push({
        parentIndex,
        depth,
        angle,
        length,
        noiseSeed: p5.random(1000),
      });

      if (depth >= maxDepth) {
        leaves.push({ branchIndex: index });
        return;
      }

      const nextLength = length * p5.random(0.66, 0.76);
      const spreadFactor = baseSpread * p5.random(0.9, 1.15);

      grow(index, depth + 1, angle - spreadFactor, nextLength);
      grow(index, depth + 1, angle + spreadFactor, nextLength);

      if (depth > 1 && p5.random() > 0.7) {
        grow(
          index,
          depth + 1,
          angle + p5.random(-spreadFactor * 0.6, spreadFactor * 0.6),
          nextLength * p5.random(0.8, 0.9),
        );
      }
    }

    grow(null, 0, 0, baseLength);

    const totalBranches = branches.length;
    branches.forEach((branch, index) => {
      branch.progressStart = index / totalBranches;
      branch.progressEnd = (index + 1) / totalBranches;
      branch.swayAmplitude = p5.map(branch.depth, 0, maxDepth, 0.04, 0.28);
    });

    leaves.forEach((leaf) => {
      const branch = branches[leaf.branchIndex];
      leaf.delay = branch.progressEnd + p5.random(0.04, 0.14);
      leaf.duration = p5.random(0.1, 0.2);
      leaf.maxSize = p5.map(branch.depth, maxDepth, 0, 6, 14);
      leaf.noiseSeed = p5.random(1000);
    });

    return { branches, leaves, maxDepth };
  }
};

const GrowingTreeBackground = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#041b29]">
    <ReactP5Wrapper sketch={sketch} className="absolute inset-0" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#041b29] via-transparent to-[#041b29]/35" />
  </div>
);

export default GrowingTreeBackground;
