import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getCssVar } from '../utils/cssVars';

function PointsField({ count = 400, radius = 8, speed = 0.05 }) {
  const pointsRef = useRef();
  const color = useMemo(() => getCssVar('--color-primary') || '#0f766e', []);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = radius * (0.5 + Math.random() * 0.5);
      const a = Math.random() * Math.PI * 2;
      const x = Math.cos(a) * r;
      const y = (Math.random() - 0.5) * radius * 0.6;
      const z = Math.sin(a) * r;
      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, [count, radius]);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  const material = useMemo(() => new THREE.PointsMaterial({ color, size: 0.06, sizeAttenuation: true, transparent: true, opacity: 0.5 }), [color]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = t * speed;
    pointsRef.current.rotation.x = Math.sin(t * speed * 0.5) * 0.15;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

export default function PointsBackground({ className = '' }) {
  return (
    <div className={`pointer-events-none ${className}`}>
      <Canvas gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]} camera={{ position: [0, 0, 10], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <PointsField />
      </Canvas>
    </div>
  );
}

