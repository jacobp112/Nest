import React, { Suspense, forwardRef, useCallback, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Scroll, ScrollControls, Sparkles, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import R3fForceGraph from 'r3f-forcegraph';
import useThemeColor from '../../hooks/useThemeColor';

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

function createGraphData() {
  const nodes = [
    { id: 'nest', label: 'Shared Nest', color: '#fde68a', size: 12 },
    { id: 'data', label: 'Data Aggregation', color: '#38bdf8', size: 9 },
    { id: 'ai', label: 'AI Insights', color: '#a5b4fc', size: 8 },
    { id: 'collab', label: 'Collaboration', color: '#f472b6', size: 8 },
    { id: 'partner', label: 'Partner', color: '#34d399', size: 7 },
    { id: 'advisor', label: 'Advisor', color: '#f97316', size: 7 },
    { id: 'goals', label: 'Goals', color: '#c4b5fd', size: 6 },
    { id: 'cash', label: 'Accounts', color: '#4ade80', size: 6 },
  ];

  const links = [
    { source: 'nest', target: 'data', value: 2 },
    { source: 'nest', target: 'ai', value: 2 },
    { source: 'nest', target: 'collab', value: 2 },
    { source: 'collab', target: 'partner', value: 1.2 },
    { source: 'collab', target: 'advisor', value: 1.2 },
    { source: 'ai', target: 'goals', value: 1 },
    { source: 'data', target: 'cash', value: 1 },
    { source: 'partner', target: 'goals', value: 0.8 },
    { source: 'advisor', target: 'cash', value: 0.8 },
  ];

  return { nodes, links };
}

function NestForceGraph({ color }) {
  const fgRef = useRef();
  const graphData = useMemo(() => createGraphData(), []);

  useFrame(() => {
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
      graphData={graphData}
      nodeThreeObject={nodeThreeObject}
      nodeThreeObjectExtend
      nodeRelSize={4}
      linkOpacity={0.35}
      linkColor={() => '#0ea5e9'}
      linkDirectionalParticles={0}
      warmupTicks={60}
      cooldownTicks={0}
    />
  );
}

function ScrollChoreographer({ onProgress }) {
  const scroll = useScroll();
  const { invalidate } = useThree();
  const lastOffset = useRef(0);

  useFrame(() => {
    const offset = scroll.offset;
    if (Math.abs(offset - lastOffset.current) < 1e-4) {
      return;
    }
    lastOffset.current = offset;
    const morphProgress = scroll.range(0.12, 0.62);
    onProgress(morphProgress, offset);
    invalidate();
  });

  return null;
}

function Scene({ onScrollProgress }) {
  const primary = useThemeColor('--color-primary');
  const accent = useThemeColor('--color-accent');
  const morphRef = useRef();
  const graphGroupRef = useRef();
  const sparklesRef = useRef();

  const handleProgress = useCallback((value) => {
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
    onScrollProgress?.(value);
  }, [onScrollProgress]);

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
      <ScrollChoreographer onProgress={handleProgress} />
    </>
  );
}

export default function NestExperienceCanvas({ children, pages = 5.2, onScrollProgress }) {
  return (
    <Canvas frameloop="demand" dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
      <color attach="background" args={['#020617']} />
      <Suspense fallback={null}>
        <ScrollControls pages={pages} damping={0.18}>
          <Scene onScrollProgress={onScrollProgress} />
          <Scroll html style={{ width: '100%' }}>
            {children}
          </Scroll>
        </ScrollControls>
      </Suspense>
    </Canvas>
  );
}
