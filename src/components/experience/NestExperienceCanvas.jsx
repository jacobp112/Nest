import React, { forwardRef, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import R3fForceGraph from 'r3f-forcegraph';
import useThemeColor from '../../hooks/useThemeColor';

const NOISE_TEXTURE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAACoWZ8PAAAAF0lEQVQYV2NkYGD4z0AEYBxVSFUBAwBnGQHhX9nuSAAAAABJRU5ErkJggg==';

const CHAOS_VERTEX = `
  uniform float uProgress;
  uniform float uTime;
  uniform float uPixelRatio;
  attribute vec3 aPositionTarget;
  varying float vStrength;
  void main() {
    vec3 displaced = mix(position, aPositionTarget, uProgress);
    float wobble = sin((position.x + position.y + position.z + uTime * 0.6) * 0.35) * (1.0 - uProgress) * 0.3;
    displaced += normal * wobble;

    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    float depthAttenuation = clamp(4.0 / (4.0 - mvPosition.z), 0.6, 1.6);
    gl_PointSize = mix(2.0, 5.0, uProgress) * depthAttenuation * uPixelRatio;
    gl_Position = projectionMatrix * mvPosition;
    vStrength = uProgress;
  }
`;

const CHAOS_FRAGMENT = `
  uniform vec3 uColor;
  varying float vStrength;
  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    float alpha = smoothstep(0.5, 0.0, dist);
    vec3 tint = mix(vec3(0.0, 0.12, 0.2), uColor, clamp(vStrength + 0.2, 0.0, 1.0));
    gl_FragColor = vec4(tint, alpha * 0.9);
  }
`;

const STARFIELD_VERTEX = `
  uniform float uTime;
  uniform float uBaseSize;
  uniform float uPixelRatio;
  uniform vec2 uParallax;
  uniform float uMotionStrength;
  attribute float aSize;
  attribute float aPhase;
  attribute float aTwinkle;
  attribute float aSpawn;
  attribute float aHot;
  attribute float aDepth;
  varying float vAlpha;
  varying float vSpawn;
  varying float vHot;
  varying float vDepth;
  void main() {
    float twinkleBase = 0.75 + 0.25 * clamp(aDepth, 0.0, 1.0);
    float twinkle = twinkleBase;
    if (uMotionStrength > 0.0) {
      twinkle += 0.3 * uMotionStrength * sin(uTime * aTwinkle + aPhase);
    }
    twinkle = clamp(twinkle, 0.55, 1.25);
    float depthScale = mix(0.55, 1.18, aDepth);
    float spawnFade = max(0.04, aSpawn);
    float size = aSize * uBaseSize * depthScale * twinkle * spawnFade * uPixelRatio;
    gl_PointSize = clamp(size, 0.5, 18.0);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_Position.xy += uParallax;
    vAlpha = depthScale * (0.6 + 0.4 * aDepth) * (1.0 + aHot * 0.45);
    vSpawn = clamp(aSpawn, 0.0, 1.0);
    vHot = aHot;
    vDepth = aDepth;
  }
`;

const STARFIELD_FRAGMENT = `
  varying float vAlpha;
  varying float vSpawn;
  varying float vHot;
  varying float vDepth;
  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = dot(coord, coord);
    float softness = smoothstep(0.23, 0.0, dist);
    vec3 glowOuter = vec3(0.07, 0.13, 0.19);
    vec3 glowInner = vec3(0.84, 0.95, 1.04);
    vec3 tint = mix(glowOuter, glowInner, clamp(softness * (0.7 + 0.3 * vDepth), 0.0, 1.0));
    tint = mix(tint, vec3(0.95, 1.0, 1.0), min(1.0, vHot * 0.6));
    float alpha = softness * vAlpha * vSpawn * 0.95;
    if (alpha <= 0.001) discard;
    gl_FragColor = vec4(tint, alpha);
  }
`;

const STARFIELD_CONSTANTS = {
  bounds: 28,
  boundsY: 15.4,
  depth: 34,
  safeRadius: 1.6,
};

const STARFIELD_DEFAULTS = {
  maxStarsDesktop: 2200,
  maxStarsMobile: 1100,
  spawnRatePerSec: 1200,
  spawnRampDuration: 2.6,
  initialFill: 0.08,
  targetFill: 0.94,
  baseStarSize: 4.4,
  twinkleMinPeriod: 2.1,
  twinkleMaxPeriod: 5.6,
  parallaxStrength: 3.6,
  hotStarProbability: 0.015,
};

const randomRange = (min, max) => Math.random() * (max - min) + min;
const smoothEase = (t) => t * t * (3 - 2 * t);

const createStarfieldData = (count) => ({
  positions: new Float32Array(count * 3),
  velocities: new Float32Array(count * 3),
  phases: new Float32Array(count),
  twinkles: new Float32Array(count),
  sizes: new Float32Array(count),
  spawnFactors: new Float32Array(count),
  spawnDurations: new Float32Array(count),
  spawnAges: new Float32Array(count),
  depths: new Float32Array(count),
  hot: new Float32Array(count),
});

const useResponsiveStarCount = (desktopCount, mobileCount) => {
  const [count, setCount] = useState(desktopCount);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const update = () => {
      setCount(window.innerWidth <= 768 ? mobileCount : desktopCount);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [desktopCount, mobileCount]);

  return count;
};

const ChaosToNestParticles = forwardRef(function ChaosToNestParticles({ colorLinear, pixelRatio }, ref) {
  const geometry = useMemo(() => {
    const count = 2600;
    const startPositions = new Float32Array(count * 3);
    const targetPositions = new Float32Array(count * 3);
    const tmp = new THREE.Vector3();
    const source = new THREE.Mesh(new THREE.TorusKnotGeometry(1.8, 0.32, 320, 48), new THREE.MeshBasicMaterial());
    const sampler = new MeshSurfaceSampler(source).build();

    for (let i = 0; i < count; i += 1) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 9 * Math.cbrt(Math.random());
      startPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      startPositions[i * 3 + 1] = radius * Math.cos(phi) * 0.45;
      startPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      sampler.sample(tmp);
      targetPositions[i * 3] = tmp.x * 1.5;
      targetPositions[i * 3 + 1] = tmp.y * 1.2;
      targetPositions[i * 3 + 2] = tmp.z * 1.5;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(startPositions, 3));
    geo.setAttribute('aPositionTarget', new THREE.BufferAttribute(targetPositions, 3));
    source.geometry.dispose();
    source.material.dispose();
    return geo;
  }, []);

  useEffect(() => () => {
    geometry.dispose();
  }, [geometry]);

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uColor: { value: colorLinear.clone() },
      uPixelRatio: { value: 1 },
    }),
    [colorLinear],
  );

  const materialRef = useRef();

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uColor.value = colorLinear.clone();
    }
  }, [colorLinear]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uPixelRatio.value = pixelRatio;
    }
  }, [pixelRatio]);

  useEffect(() => () => materialRef.current?.dispose(), []);

  useFrame((_, delta) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value += delta;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={(instance) => {
          materialRef.current = instance;
          if (typeof ref === 'function') {
            ref(instance);
          } else if (ref) {
            // eslint-disable-next-line no-param-reassign
            ref.current = instance;
          }
        }}
        uniforms={uniforms}
        vertexShader={CHAOS_VERTEX}
        fragmentShader={CHAOS_FRAGMENT}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        transparent
      />
    </points>
  );
});

function Starfield({ progressRef, pixelRatio = 1, maxStars, config, reducedMotion = false }) {
  const geometryRef = useRef(new THREE.BufferGeometry());
  const materialRef = useRef();
  const attributesRef = useRef({});
  const dataRef = useRef(createStarfieldData(Math.max(1, maxStars || STARFIELD_DEFAULTS.maxStarsDesktop)));
  const activeCountRef = useRef(0);
  const spawnAccumulatorRef = useRef(0);
  const elapsedRef = useRef(0);
  const parallaxTargetRef = useRef(new THREE.Vector2());
  const configRef = useRef(config);
  const maxStarsRef = useRef(Math.max(1, maxStars || STARFIELD_DEFAULTS.maxStarsDesktop));
  const motionRef = useRef(reducedMotion);

  const uniformsRef = useRef();
  if (!uniformsRef.current) {
    uniformsRef.current = {
      uTime: { value: 0 },
      uBaseSize: { value: config.baseStarSize },
      uPixelRatio: { value: pixelRatio || 1 },
      uParallax: { value: new THREE.Vector2() },
      uMotionStrength: { value: reducedMotion ? 0 : 1 },
    };
  }
  const uniforms = uniformsRef.current;

  const respawnStar = useCallback((index) => {
    const data = dataRef.current;
    if (!data) return;
    const settings = configRef.current;
    const { positions, velocities, phases, twinkles, sizes, spawnFactors, spawnDurations, spawnAges, depths, hot } = data;
    const { bounds, boundsY, depth, safeRadius } = STARFIELD_CONSTANTS;
    const i3 = index * 3;

    const depthBias = Math.pow(Math.random(), 1.4);
    depths[index] = depthBias;
    const zPos = THREE.MathUtils.lerp(-depth, depth, depthBias);

    const radialChance = Math.random();
    const innerRadius = radialChance < 0.22 ? randomRange(0.2, safeRadius) : safeRadius;
    const radius = THREE.MathUtils.lerp(innerRadius, bounds, Math.pow(Math.random(), 0.68));
    const angle = Math.random() * Math.PI * 2;
    positions[i3] = radius * Math.cos(angle);
    positions[i3 + 1] = THREE.MathUtils.lerp(-boundsY, boundsY, Math.random());
    positions[i3 + 2] = zPos;

    if (Math.abs(positions[i3]) < safeRadius && Math.random() > 0.35) {
      positions[i3] += (Math.random() > 0.5 ? 1 : -1) * randomRange(0.35, 1.1);
    }
    if (Math.abs(positions[i3 + 1]) < safeRadius * 0.7 && Math.random() > 0.5) {
      positions[i3 + 1] += (Math.random() > 0.5 ? 1 : -1) * randomRange(0.3, 0.9);
    }

    positions[i3] = THREE.MathUtils.clamp(positions[i3], -bounds, bounds);
    positions[i3 + 1] = THREE.MathUtils.clamp(positions[i3 + 1], -boundsY, boundsY);
    positions[i3 + 2] = THREE.MathUtils.clamp(positions[i3 + 2], -depth, depth);

    const speedScale = THREE.MathUtils.lerp(0.6, 1.35, depthBias);
    velocities[i3] = (Math.random() - 0.5) * 0.012 * speedScale;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.008 * speedScale;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.014 * speedScale;

    phases[index] = Math.random() * Math.PI * 2;
    const twinklePeriod = randomRange(settings.twinkleMinPeriod, settings.twinkleMaxPeriod);
    twinkles[index] = (Math.PI * 2) / Math.max(0.0001, twinklePeriod);

    sizes[index] = THREE.MathUtils.lerp(0.55, 1.25, depthBias) * THREE.MathUtils.lerp(0.85, 1.25, Math.random());
    spawnFactors[index] = 0;
    spawnAges[index] = 0;
    spawnDurations[index] = randomRange(0.3, 0.6);
    hot[index] = Math.random() < settings.hotStarProbability ? randomRange(0.25, 0.55) : 0;
  }, []);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    maxStarsRef.current = Math.max(1, maxStars || 1);
    const capacity = maxStarsRef.current;
    const geometry = geometryRef.current;
    if (!geometry) return;
    const data = createStarfieldData(capacity);
    dataRef.current = data;

    const positionAttr = new THREE.BufferAttribute(data.positions, 3);
    positionAttr.setUsage(THREE.DynamicDrawUsage);
    const phaseAttr = new THREE.BufferAttribute(data.phases, 1);
    phaseAttr.setUsage(THREE.DynamicDrawUsage);
    const sizeAttr = new THREE.BufferAttribute(data.sizes, 1);
    sizeAttr.setUsage(THREE.DynamicDrawUsage);
    const twinkleAttr = new THREE.BufferAttribute(data.twinkles, 1);
    twinkleAttr.setUsage(THREE.DynamicDrawUsage);
    const spawnAttr = new THREE.BufferAttribute(data.spawnFactors, 1);
    spawnAttr.setUsage(THREE.DynamicDrawUsage);
    const hotAttr = new THREE.BufferAttribute(data.hot, 1);
    hotAttr.setUsage(THREE.DynamicDrawUsage);
    const depthAttr = new THREE.BufferAttribute(data.depths, 1);
    depthAttr.setUsage(THREE.DynamicDrawUsage);

    geometry.setAttribute('position', positionAttr);
    geometry.setAttribute('aPhase', phaseAttr);
    geometry.setAttribute('aSize', sizeAttr);
    geometry.setAttribute('aTwinkle', twinkleAttr);
    geometry.setAttribute('aSpawn', spawnAttr);
    geometry.setAttribute('aHot', hotAttr);
    geometry.setAttribute('aDepth', depthAttr);
    geometry.setDrawRange(0, 0);

    attributesRef.current = {
      position: positionAttr,
      phase: phaseAttr,
      size: sizeAttr,
      twinkle: twinkleAttr,
      spawn: spawnAttr,
      hot: hotAttr,
      depth: depthAttr,
    };

    activeCountRef.current = 0;
    spawnAccumulatorRef.current = 0;
    elapsedRef.current = 0;

    const initialVisible = Math.max(10, Math.floor(capacity * configRef.current.initialFill));
    for (let i = 0; i < initialVisible; i += 1) {
      respawnStar(i);
      const duration = data.spawnDurations[i] || 0.4;
      data.spawnAges[i] = Math.random() * duration;
      const eased = smoothEase(Math.min(1, data.spawnAges[i] / duration));
      data.spawnFactors[i] = eased;
    }
    activeCountRef.current = initialVisible;
    geometry.setDrawRange(0, initialVisible);
    Object.values(attributesRef.current).forEach((attr) => {
      if (attr) attr.needsUpdate = true;
    });
  }, [maxStars, respawnStar]);

  useEffect(() => {
    motionRef.current = reducedMotion;
    uniforms.uMotionStrength.value = reducedMotion ? 0 : 1;
  }, [reducedMotion, uniforms]);

  useEffect(() => {
    uniforms.uBaseSize.value = config.baseStarSize;
  }, [config.baseStarSize, uniforms]);

  useEffect(() => {
    uniforms.uPixelRatio.value = Math.max(1, pixelRatio || 1);
  }, [pixelRatio, uniforms]);

  useEffect(
    () => () => {
      geometryRef.current?.dispose();
      materialRef.current?.dispose();
    },
    [],
  );

  useFrame((state, delta) => {
    const geometry = geometryRef.current;
    const material = materialRef.current;
    const attributes = attributesRef.current;
    const data = dataRef.current;
    if (!geometry || !material || !attributes.spawn || !data) return;

    const settings = configRef.current;
    const maxCount = maxStarsRef.current;
    const motionDisabled = motionRef.current;
    const clampedProgress = THREE.MathUtils.clamp(progressRef?.current ?? 0, 0, 1);
    elapsedRef.current += delta;
    const ramp = settings.spawnRampDuration > 0 ? 1 - Math.exp(-elapsedRef.current / settings.spawnRampDuration) : 1;
    const ambientFill = THREE.MathUtils.lerp(settings.initialFill, settings.targetFill, ramp);
    const progressFill = THREE.MathUtils.lerp(settings.initialFill, 1, clampedProgress);
    const desiredFill = Math.min(1, Math.max(ambientFill, progressFill));
    const desiredCount = Math.min(maxCount, Math.floor(maxCount * desiredFill));

    if (activeCountRef.current < desiredCount) {
      spawnAccumulatorRef.current += delta * settings.spawnRatePerSec;
      while (activeCountRef.current < desiredCount && spawnAccumulatorRef.current >= 1) {
        const idx = activeCountRef.current;
        respawnStar(idx);
        activeCountRef.current += 1;
        spawnAccumulatorRef.current -= 1;
      }
      geometry.setDrawRange(0, activeCountRef.current);
      if (attributes.position) attributes.position.needsUpdate = true;
      if (attributes.phase) attributes.phase.needsUpdate = true;
      if (attributes.size) attributes.size.needsUpdate = true;
      if (attributes.twinkle) attributes.twinkle.needsUpdate = true;
      if (attributes.hot) attributes.hot.needsUpdate = true;
      if (attributes.depth) attributes.depth.needsUpdate = true;
    } else {
      spawnAccumulatorRef.current = Math.min(spawnAccumulatorRef.current, desiredCount);
    }

    const spanX = STARFIELD_CONSTANTS.bounds * 2;
    const spanY = STARFIELD_CONSTANTS.boundsY * 2;
    const spanZ = STARFIELD_CONSTANTS.depth * 2;
    if (!motionDisabled) {
      for (let i = 0; i < activeCountRef.current; i += 1) {
        const base = i * 3;
        data.positions[base] += data.velocities[base] * delta;
        data.positions[base + 1] += data.velocities[base + 1] * delta;
        data.positions[base + 2] += data.velocities[base + 2] * delta;

        if (data.positions[base] < -STARFIELD_CONSTANTS.bounds) data.positions[base] += spanX;
        else if (data.positions[base] > STARFIELD_CONSTANTS.bounds) data.positions[base] -= spanX;

        if (data.positions[base + 1] < -STARFIELD_CONSTANTS.boundsY) data.positions[base + 1] += spanY;
        else if (data.positions[base + 1] > STARFIELD_CONSTANTS.boundsY) data.positions[base + 1] -= spanY;

        if (data.positions[base + 2] < -STARFIELD_CONSTANTS.depth) data.positions[base + 2] += spanZ;
        else if (data.positions[base + 2] > STARFIELD_CONSTANTS.depth) data.positions[base + 2] -= spanZ;
      }
      if (attributes.position) {
        attributes.position.needsUpdate = true;
      }
    }

    const spawnDelta = Math.min(delta, 0.1);
    for (let i = 0; i < activeCountRef.current; i += 1) {
      data.spawnAges[i] += spawnDelta;
      const duration = data.spawnDurations[i] || 0.45;
      const t = Math.min(1, data.spawnAges[i] / duration);
      data.spawnFactors[i] = smoothEase(t);
    }
    attributes.spawn.needsUpdate = true;

    if (!motionDisabled) {
      const pointer = state.pointer;
      const maxShiftPx = settings.parallaxStrength;
      const shiftX = THREE.MathUtils.clamp(pointer.x, -1, 1) * maxShiftPx;
      const shiftY = THREE.MathUtils.clamp(pointer.y, -1, 1) * maxShiftPx;
      const clipX = (shiftX / state.size.width) * 2;
      const clipY = (-shiftY / state.size.height) * 2;
      parallaxTargetRef.current.set(clipX, clipY);
      material.uniforms.uTime.value += delta;
    } else {
      parallaxTargetRef.current.set(0, 0);
    }

    uniforms.uParallax.value.lerp(parallaxTargetRef.current, motionDisabled ? 0.12 : 0.08);
  });

  return (
    <points geometry={geometryRef.current} frustumCulled={false} renderOrder={-5}>
      <shaderMaterial
        ref={(instance) => {
          materialRef.current = instance;
        }}
        uniforms={uniforms}
        vertexShader={STARFIELD_VERTEX}
        fragmentShader={STARFIELD_FRAGMENT}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

const clampValue = (value, min = 0.4, max = 4) => Math.min(max, Math.max(min, value));

const buildGraphData = (state, primaryColor) => {
  const nodes = [];
  const links = [];
  const nodeMap = new Map();
  const addNode = (id, data) => {
    if (nodeMap.has(id)) return nodeMap.get(id);
    const node = { id, ...data };
    nodeMap.set(id, node);
    nodes.push(node);
    return node;
  };

  const centerColor = primaryColor.getStyle();
  addNode('nest', { label: 'Shared Nest', color: centerColor, size: 14 });

  const accounts = state?.accounts || [];
  accounts.slice(0, 12).forEach((account, index) => {
    const balance = Number(account?.balance) || 0;
    const id = `acc:${account?.id || index}`;
    addNode(id, {
      label: account?.name || 'Account',
      color: '#4ade80',
      size: 6 + clampValue(Math.abs(balance) / 2500, 0, 4),
    });
    links.push({
      source: 'nest',
      target: id,
      value: clampValue(Math.abs(balance) / 5000 + 0.5),
    });
  });

  const goals = state?.goals || [];
  goals.slice(0, 8).forEach((goal, index) => {
    const progress = Number(goal?.currentAmount || 0) / Math.max(1, Number(goal?.targetAmount) || 1);
    const id = `goal:${goal?.id || index}`;
    addNode(id, {
      label: goal?.name || 'Goal',
      color: '#fde68a',
      size: 5 + clampValue(progress * 4, 0, 5),
    });
    links.push({
      source: 'nest',
      target: id,
      value: clampValue(progress * 3 + 0.4),
    });
  });

  const budgets = state?.budgets || [];
  budgets.slice(0, 6).forEach((budget, index) => {
    const limit = Number(budget?.amount || budget?.limit) || 0;
    const id = `budget:${budget?.id || index}`;
    addNode(id, {
      label: budget?.category || 'Budget',
      color: '#c4b5fd',
      size: 4 + clampValue(limit / 2000, 0, 4),
    });
    links.push({
      source: 'nest',
      target: id,
      value: clampValue(limit / 4000 + 0.4),
    });
  });

  const transactions = (state?.transactions || []).filter((tx) => tx?.type === 'expense');
  const categoryMap = new Map();
  transactions.forEach((tx) => {
    const category = tx?.category || 'General';
    const amount = Number(tx?.amount) || 0;
    categoryMap.set(category, (categoryMap.get(category) || 0) + amount);
  });

  const topCategories = Array.from(categoryMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  topCategories.forEach(([category, total], index) => {
    const id = `cat:${category.toLowerCase().replace(/\s+/g, '-')}-${index}`;
    addNode(id, {
      label: category,
      color: '#38bdf8',
      size: 4 + clampValue(total / 2000, 0, 4),
    });
    links.push({
      source: 'nest',
      target: id,
      value: clampValue(total / 4000 + 0.3),
    });
  });

  if (!nodes.length) {
    addNode('empty', { label: 'Gathering data…', color: '#94a3b8', size: 6 });
    links.push({ source: 'nest', target: 'empty', value: 0.6 });
  }

  return { nodes, links };
};

function NestForceGraph({ colorLinear, colorSrgb, accentHex, data }) {
  const fgRef = useRef();
  const graphData = useMemo(() => buildGraphData(data, colorSrgb), [data, colorSrgb]);

  useFrame(() => {
    fgRef.current?.tickFrame();
  });

  const nodeThreeObject = useCallback(
    (node) => {
      const material = new THREE.MeshStandardMaterial({
        color: node.color ? node.color : colorLinear.clone(),
        emissive: colorLinear.clone().multiplyScalar(0.35),
        emissiveIntensity: 0.7,
        roughness: 0.35,
        metalness: 0.2,
        transparent: true,
        opacity: 0.9,
      });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.12 + node.size * 0.015, 16, 16), material);
      return mesh;
    },
    [colorLinear],
  );

  return (
    <R3fForceGraph
      ref={fgRef}
      graphData={graphData}
      nodeThreeObject={nodeThreeObject}
      nodeThreeObjectExtend
      nodeRelSize={4}
      linkOpacity={0.35}
      linkColor={() => accentHex}
      linkWidth={(link) => clampValue(link?.value || 0.6, 0.4, 3)}
      linkDirectionalParticles={0}
      warmupTicks={60}
      cooldownTicks={0}
    />
  );
}

function Scene({ progressRef, progressValue, fallbackProgress, data, pixelRatio, maxStars, starfieldConfig, reducedMotion }) {
  const primary = useThemeColor('--color-primary');
  const accent = useThemeColor('--color-accent');
  const primaryLinear = useMemo(() => primary.clone().convertSRGBToLinear(), [primary]);
  const primaryHex = useMemo(() => primary.getStyle(), [primary]);
  const accentHex = useMemo(() => accent.getStyle(), [accent]);
  const morphRef = useRef();
  const graphGroupRef = useRef();

  const applyProgress = useCallback((rawValue) => {
    const value = THREE.MathUtils.clamp(rawValue ?? 0, 0, 1);
    if (morphRef.current) {
      morphRef.current.uniforms.uProgress.value = value;
    }
    if (graphGroupRef.current) {
      const visibleProgress = THREE.MathUtils.clamp((value - 0.5) / 0.35, 0, 1);
      graphGroupRef.current.visible = visibleProgress > 0.02;
      const scale = 0.7 + visibleProgress * 0.4;
      graphGroupRef.current.scale.setScalar(scale);
      graphGroupRef.current.children.forEach((child) => {
        if (child.material) {
          child.material.opacity = 0.15 + visibleProgress * 0.85;
        }
      });
    }
  }, []);

  useEffect(() => {
    applyProgress(progressRef.current);
  }, [applyProgress, progressRef]);

  useEffect(() => {
    if (!progressValue || typeof progressValue.on !== 'function') return undefined;
    const unsubscribe = progressValue.on('change', applyProgress);
    return () => unsubscribe();
  }, [progressValue, applyProgress]);

  useEffect(() => {
    if (progressValue) return undefined;
    applyProgress(progressRef.current);
    return undefined;
  }, [progressValue, fallbackProgress, applyProgress, progressRef]);

  useEffect(() => {
    if (graphGroupRef.current) {
      graphGroupRef.current.visible = false;
    }
  }, []);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2.4, 8.5]} fov={48} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 6, 4]} intensity={1.1} color={accentHex} />
      <directionalLight position={[-4, 3, -5]} intensity={0.8} color={primaryHex} />
      <Starfield
        progressRef={progressRef}
        pixelRatio={pixelRatio}
        maxStars={maxStars}
        config={starfieldConfig}
        reducedMotion={reducedMotion}
      />
      <ChaosToNestParticles ref={morphRef} colorLinear={primaryLinear} pixelRatio={pixelRatio} />
      <group ref={graphGroupRef} position={[0, -0.2, 0]} visible={false}>
        <NestForceGraph colorLinear={primaryLinear} colorSrgb={primary} accentHex={accentHex} data={data} />
      </group>
    </>
  );
}

export default function NestExperienceCanvas({
  progress = 0,
  progressValue,
  data,
  reducedMotion = false,
  starfieldConfig = {},
}) {
  const [pixelRatio, setPixelRatio] = useState(1);
  const [maxDpr, setMaxDpr] = useState(1.5);
  const mergedStarfieldConfig = useMemo(
    () => ({
      ...STARFIELD_DEFAULTS,
      ...starfieldConfig,
    }),
    [starfieldConfig],
  );
  const maxStars = useResponsiveStarCount(mergedStarfieldConfig.maxStarsDesktop, mergedStarfieldConfig.maxStarsMobile);
  const progressRef = useRef(
    typeof progressValue?.get === 'function' ? progressValue.get() : progress ?? 0,
  );

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const updateDpr = () => {
      setMaxDpr(Math.min(window.devicePixelRatio || 1.5, 2));
    };
    updateDpr();
    window.addEventListener('resize', updateDpr);
    return () => window.removeEventListener('resize', updateDpr);
  }, []);

  useEffect(() => {
    if (!progressValue || typeof progressValue.on !== 'function') return undefined;
    progressRef.current =
      typeof progressValue.get === 'function' ? progressValue.get() : progressRef.current;
    const unsubscribe = progressValue.on('change', (latest) => {
      progressRef.current = latest;
    });
    return () => unsubscribe();
  }, [progressValue]);

  useEffect(() => {
    if (progressValue) return;
    progressRef.current = progress;
  }, [progress, progressValue]);

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-background"
      aria-hidden="true"
      style={{ touchAction: 'pan-y' }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(circle at 50% 38%, rgba(20,48,72,0.45), rgba(2,8,20,0) 70%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          background: 'radial-gradient(circle at 35% 82%, rgba(2,6,23,0.85), rgba(2,11,22,0) 75%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(2,10,20,0.55), rgba(2,8,18,0) 68%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{ backgroundImage: `url(${NOISE_TEXTURE})`, backgroundRepeat: 'repeat' }}
      />
      <Canvas
        frameloop="always"
        dpr={[1, maxDpr]}
        gl={{ antialias: true, alpha: true, premultipliedAlpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;
          gl.setClearAlpha(0);
          const runtimePixelRatio = gl.getPixelRatio?.() ?? window.devicePixelRatio ?? 1;
          setPixelRatio(runtimePixelRatio);
          setMaxDpr((current) => (runtimePixelRatio > current ? Math.min(runtimePixelRatio, 2) : current));
        }}
      >
        <Suspense fallback={null}>
          <Scene
            progressRef={progressRef}
            progressValue={progressValue}
            fallbackProgress={progress}
            data={data}
            pixelRatio={pixelRatio}
            maxStars={maxStars}
            starfieldConfig={mergedStarfieldConfig}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
