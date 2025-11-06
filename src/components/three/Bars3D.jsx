import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useSceneStore } from '../../stores/sceneStore';

export default function Bars3D() {
  const bars = useSceneStore((s) => s.bars);
  const color = useSceneStore((s) => s.color);
  const hoveredIndex = useSceneStore((s) => s.hoveredIndex);
  const selectedIndex = useSceneStore((s) => s.selectedIndex);
  const setHoveredIndex = useSceneStore((s) => s.setHoveredIndex);
  const setSelectedIndex = useSceneStore((s) => s.setSelectedIndex);
  const meshRef = useRef();
  const [material] = useState(() => new THREE.MeshStandardMaterial({ color }));
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    material.color = new THREE.Color(color);
  }, [color, material]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const count = bars.length;
    for (let i = 0; i < count; i++) {
      const { x, z, height } = bars[i];
      const isSelected = i === selectedIndex;
      const isHovered = i === hoveredIndex;
      const scaleY = Math.max(0.1, height) * (isSelected ? 1.15 : isHovered ? 1.08 : 1);
      const scaleXZ = (isSelected ? 1.05 : isHovered ? 1.02 : 0.9);
      dummy.position.set(x, (scaleY) * 0.5, z);
      dummy.scale.set(scaleXZ, scaleY, scaleXZ);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [bars, dummy, hoveredIndex, selectedIndex]);

  return (
    <>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, Math.max(1, bars.length)]}
        material={material}
        castShadow
        receiveShadow
        onPointerMove={(e) => {
          e.stopPropagation();
          if (typeof e.instanceId === 'number') setHoveredIndex(e.instanceId);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredIndex(-1);
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (typeof e.instanceId === 'number') setSelectedIndex(e.instanceId);
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>
      {hoveredIndex >= 0 && bars[hoveredIndex] ? (
        <Html position={[bars[hoveredIndex].x, Math.max(0.1, bars[hoveredIndex].height) + 0.6, bars[hoveredIndex].z]} center>
          <div style={{
            background: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--border-radius-small)',
            padding: '4px 6px',
            fontSize: 12,
            boxShadow: 'var(--ui-shadow-soft)'
          }}>
            {bars[hoveredIndex].label || 'Account'}
          </div>
        </Html>
      ) : null}
    </>
  );
}
