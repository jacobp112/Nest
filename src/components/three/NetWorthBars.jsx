import React, { useEffect, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import Bars3D from './Bars3D';
import { getCssVar } from '../../utils/cssVars';
import { useSceneStore } from '../../stores/sceneStore';

// Convert accounts into bar heights (simple net-worth view)
function toBars(accounts = []) {
  const vals = (accounts || []).map((a) => {
    const n = Number(a.balance) || 0;
    return { id: a.id || a.name || Math.random().toString(36).slice(2), name: a.name || 'Account', value: a.type === 'debt' ? -n : n };
  });
  const sorted = vals.sort((a, b) => b.value - a.value).slice(0, 24);
  const spacing = 1.4;
  return sorted.map((v, i) => ({ x: (i - sorted.length / 2) * spacing, z: 0, height: Math.max(0.2, Math.abs(v.value) / 1000), id: v.id, label: v.name }));
}

export default function NetWorthBars({ accounts = [] }) {
  const bars = useMemo(() => toBars(accounts), [accounts]);
  const color = useMemo(() => getCssVar('--color-primary') || '#0f766e', []);

  // Writer that runs inside the Canvas to update the store and invalidate once
  const StoreWriter = ({ bars, color }) => {
    const setBars = useSceneStore((s) => s.setBars);
    const setColor = useSceneStore((s) => s.setColor);
    const invalidate = useThree((s) => s.invalidate);

    useEffect(() => {
      setBars(bars);
      invalidate();
    }, [bars, setBars, invalidate]);

    useEffect(() => {
      setColor(color);
      invalidate();
    }, [color, setColor, invalidate]);

    return null;
  };

  return (
    <div className="h-72 w-full overflow-hidden rounded-xl">
      <Canvas camera={{ position: [0, 10, 20], fov: 50 }} dpr={[1, 1.5]} shadows frameloop="demand">
        <StoreWriter bars={bars} color={color} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 12, 6]} intensity={1.2} castShadow />
        <Bars3D />
        <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
        <PerformanceMonitor />
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  );
}
