import { useEffect, useRef } from 'react';

// useD3: keep D3-driven DOM inside a single SVG/group without causing React re-renders.
// renderFn(svgOrGElement) is called on mount and whenever deps change.
export function useD3(renderFn, deps = []) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return undefined;
    return renderFn(ref.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

