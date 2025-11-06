import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial } from '@react-three/drei';
import { useTheme } from '../contexts/ThemeContext';

const useClientOK = () => {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const smallScreen = window.innerWidth < 640; // disable on very small screens
    setOk(!prefersReducedMotion && !smallScreen);
  }, []);
  return ok;
};

const Blob = ({ color = '#0f766e', position = [0, 0, 0], scale = 1, speed = 0.4, distort = 0.35, roughness = 0.2, opacity = 0.35 }) => {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!ref.current) return;
    ref.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    ref.current.rotation.y = t * 0.2;
  });
  return (
    <Icosahedron ref={ref} args={[1, 2]} position={position} scale={scale}>
      <MeshDistortMaterial
        color={color}
        roughness={roughness}
        metalness={0.05}
        transparent
        opacity={opacity}
        speed={speed}
        distort={distort}
      />
    </Icosahedron>
  );
};

const Scene = () => {
  const { themeColors } = useTheme();
  const colors = useMemo(() => {
    const primary = themeColors?.primary || '#0f766e';
    const accent = themeColors?.accent || '#f97316';
    const secondary = themeColors?.secondary || '#1d4ed8';
    return { primary, accent, secondary };
  }, [themeColors]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 5]} intensity={0.8} />
      <directionalLight position={[-5, -2, -4]} intensity={0.3} />

      <group position={[0, 0, 0]}>
        <Blob color={colors.primary} position={[-1.8, 0.5, -1.5]} scale={1.9} speed={0.45} distort={0.35} opacity={0.32} />
        <Blob color={colors.accent} position={[1.6, -0.3, -1.2]} scale={1.4} speed={0.6} distort={0.4} opacity={0.28} />
        <Blob color={colors.secondary} position={[0.2, 0.8, -2.0]} scale={2.2} speed={0.35} distort={0.3} opacity={0.22} />
      </group>
    </>
  );
};

const ThreeBackground = ({ className = '' }) => {
  const canRender = useClientOK();
  if (!canRender) return null;

  return (
    <div className={`pointer-events-none ${className}`}>
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4.2], fov: 45 }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;

