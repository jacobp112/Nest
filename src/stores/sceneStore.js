import { create } from 'zustand';

// Global scene store for r3f data-driven visuals.
export const useSceneStore = create(() => ({
  bars: [], // [{x, z, height, id?, label?}]
  color: '#0f766e',
  hoveredIndex: -1,
  selectedIndex: -1,
  setBars: (bars) => ({ bars }),
  setColor: (color) => ({ color }),
  setHoveredIndex: (i) => ({ hoveredIndex: i }),
  setSelectedIndex: (i) => ({ selectedIndex: i }),
}));
