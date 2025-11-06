import React, { useEffect, useRef, useState } from 'react';

// Renders children only when the wrapper scrolls into view.
// Does not load/lazy-mount heavy visuals until needed.
export default function LazyInView({ root = null, rootMargin = '200px', threshold = 0, className = '', style, children }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current || inView) return undefined;
    const el = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { root, rootMargin, threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, root, rootMargin, threshold]);

  return (
    <div ref={ref} className={className} style={style}>
      {inView ? children : null}
    </div>
  );
}

