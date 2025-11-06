import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../contexts/ThemeContext';

const DEFAULT_COLOR = '#0f172a';

export function useThemeColor(cssVariable = '--color-primary') {
  const { resolvedThemeName } = useTheme();
  const [color, setColor] = useState(() => new THREE.Color(DEFAULT_COLOR));

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const computed = getComputedStyle(document.documentElement).getPropertyValue(cssVariable)?.trim();
    const next = computed && computed.length > 0 ? computed : DEFAULT_COLOR;
    setColor(new THREE.Color(next));
  }, [cssVariable, resolvedThemeName]);

  return color;
}

export default useThemeColor;
