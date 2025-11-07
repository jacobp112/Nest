import React, { forwardRef, Suspense, useCallback, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import R3fForceGraph from 'r3f-forcegraph';
import useThemeColor from '../../hooks/useThemeColor';
import { useDataStore } from '../../stores/useDataStore';

const CHAOS_VERTEX = `
  uniform float uProgress;
  uniform float uTime;
  attribute vec3 aPositionTarget;
  varying float vStrength;
  void main() {
    vec3 displaced = mix(position, aPositionTarget, uProgress);
    float wobble = sin((position.x + position.y + position.z + uTime * 0.6) * 0.35) * (1.0 - uProgress) * 0.3;
    displaced += normal * wobble;
    vStrength = uProgress;
    gl_PointSize = mix(2.0, 5.0, uProgress);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
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

const ChaosToNestParticles = forwardRef(function ChaosToNestParticles({ color }, ref) {
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
    return geo;
  }, []);

  useEffect(() => () => {
    geometry.dispose();
  }, [geometry]);

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uColor: { value: color.clone() },
    }),
    [color],
  );

  const materialRef = useRef();

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uColor.value = color.clone();
    }
  }, [color]);

  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
    }
  });

  return (
    <points geometry={geometry}>
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

const signatureFromState = (state) => Number(state?.revision || 0);

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

function NestForceGraph({ color }) {
  const fgRef = useRef();
  const initialState = useRef(useDataStore.getState());
  const graphDataRef = useRef(buildGraphData(initialState.current, color));
  const lastRevisionRef = useRef(signatureFromState(initialState.current));

  const rebuildGraph = useCallback(
    (state) => {
      graphDataRef.current = buildGraphData(state, color);
      if (fgRef.current) {
        fgRef.current.graphData(graphDataRef.current);
      }
    },
    [color],
  );

  useEffect(() => {
    rebuildGraph(initialState.current);
  }, [rebuildGraph]);

  useFrame(() => {
    const state = useDataStore.getState();
    const revision = signatureFromState(state);
    if (revision !== lastRevisionRef.current) {
      lastRevisionRef.current = revision;
      rebuildGraph(state);
    }
    fgRef.current?.tickFrame();
  });

  const baseColor = useMemo(() => color.getStyle(), [color]);

  const nodeThreeObject = useCallback(
    (node) => {
      const material = new THREE.MeshStandardMaterial({
        color: node.color || baseColor,
        emissive: color.clone().multiplyScalar(0.35),
        emissiveIntensity: 0.7,
        roughness: 0.35,
        metalness: 0.2,
        transparent: true,
        opacity: 0.9,
      });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.12 + node.size * 0.015, 16, 16), material);
      return mesh;
    },
    [baseColor, color],
  );

  return (
    <R3fForceGraph
      ref={fgRef}
      graphData={graphDataRef.current}
      nodeThreeObject={nodeThreeObject}
      nodeThreeObjectExtend
      nodeRelSize={4}
      linkOpacity={0.35}
      linkColor={() => '#0ea5e9'}
      linkWidth={(link) => clampValue(link?.value || 0.6, 0.4, 3)}
      linkDirectionalParticles={0}
      warmupTicks={60}
      cooldownTicks={0}
    />
  );
}

function Scene({ progress }) {
  const primary = useThemeColor('--color-primary');
  const accent = useThemeColor('--color-accent');
  const morphRef = useRef();
  const graphGroupRef = useRef();
  const sparklesRef = useRef();

  useEffect(() => {
    const value = THREE.MathUtils.clamp(progress, 0, 1);
    if (morphRef.current) {
      morphRef.current.uniforms.uProgress.value = value;
    }
    if (sparklesRef.current?.material) {
      sparklesRef.current.material.opacity = 0.2 + value * 0.5;
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
  }, [progress]);

  useEffect(() => {
    if (graphGroupRef.current) {
      graphGroupRef.current.visible = false;
    }
  }, []);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2.4, 8.5]} fov={48} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 6, 4]} intensity={1.1} color={accent.getStyle()} />
      <directionalLight position={[-4, 3, -5]} intensity={0.8} color={primary.getStyle()} />
      <Sparkles
        ref={sparklesRef}
        count={160}
        size={2.5}
        speed={0.12}
        noise={2}
        scale={[20, 10, 20]}
        color={accent.getStyle()}
      />
      <ChaosToNestParticles ref={morphRef} color={primary} />
      <group ref={graphGroupRef} position={[0, -0.2, 0]} visible={false}>
        <NestForceGraph color={primary} />
      </group>
    </>
  );
}

export default function NestExperienceCanvas({ progress = 0 }) {
  return (
    <Canvas frameloop="demand" dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
      <color attach="background" args={['#020617']} />
      <Suspense fallback={null}>
        <Scene progress={progress} />
      </Suspense>
    </Canvas>
  );
}
