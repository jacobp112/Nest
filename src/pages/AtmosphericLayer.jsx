import React, { useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const AtmosphericLayer = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const particles = useMemo(
    () =>
      Array.from({ length: 80 }).map((_, id) => {
        const size = Math.random() * 4 + 3; // 3px - 7px
        return {
          id,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          size,
          blur: Math.random() * 0.8 + 0.4,
          opacity: Math.random() * 0.2 + 0.35,
          animationDuration: `${Math.random() * 15 + 18}s`,
          animationDelay: `${Math.random() * -40}s`,
        };
      }),
    []
  );

  return (
    <motion.div className="pointer-events-none fixed inset-0 -z-5 h-full w-full" style={{ y }}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            top: particle.top,
            left: particle.left,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animationName: 'float',
            animationDuration: particle.animationDuration,
            animationDelay: particle.animationDelay,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
            filter: `blur(${particle.blur}px)`,
            background:
              'radial-gradient(circle, rgba(236,253,245,0.95) 0%, rgba(16,185,129,0.8) 40%, rgba(15,118,110,0.2) 65%, rgba(15,118,110,0) 85%)',
            boxShadow: '0 0 30px rgba(16,185,129,0.55), 0 0 20px rgba(255,255,255,0.35)',
            mixBlendMode: 'normal',
          }}
        />
      ))}
    </motion.div>
  );
};

export default AtmosphericLayer;
