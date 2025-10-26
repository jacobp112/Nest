import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  initial: {
    y: 0,
    scale: 1,
    boxShadow: '0 0 0 0 rgba(15, 118, 110, 0)',
  },
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow:
      '0 20px 25px -5px rgba(15, 118, 110, 0.15), 0 8px 10px -6px rgba(15, 118, 110, 0.12)',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

const vineVariants = {
  initial: {
    pathLength: 0,
    pathOffset: 1,
    opacity: 0,
  },
  hover: {
    pathLength: 1,
    pathOffset: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'circOut',
    },
  },
};

const DEFAULT_RADIUS = 24;
const STROKE_INSET = 1.5;

const FeatureCardVine = ({ children, className = '', borderRadius = DEFAULT_RADIUS }) => {
  const wrapperRef = useRef(null);
  const [{ width, height }, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;

    const updateDimensions = () => {
      setDimensions({
        width: node.offsetWidth,
        height: node.offsetHeight,
      });
    };

    updateDimensions();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateDimensions);
      observer.observe(node);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const hasDimensions = width > 0 && height > 0;
  const adjustedRadius = Math.max(borderRadius - STROKE_INSET, 0);

  return (
    <motion.div
      ref={wrapperRef}
      className={`relative ${className}`}
      style={{ borderRadius }}
      variants={containerVariants}
      initial="initial"
      whileHover="hover"
    >
      {children}
      {hasDimensions && (
        <motion.svg
          className="pointer-events-none absolute inset-0 z-10"
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          style={{ borderRadius, overflow: 'visible' }}
        >
          <motion.rect
            x={STROKE_INSET}
            y={STROKE_INSET}
            width={Math.max(width - STROKE_INSET * 2, 0)}
            height={Math.max(height - STROKE_INSET * 2, 0)}
            rx={adjustedRadius}
            ry={adjustedRadius}
            fill="none"
            stroke="#059669"
            strokeWidth={STROKE_INSET}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            pathLength="1"
            variants={vineVariants}
          />
        </motion.svg>
      )}
    </motion.div>
  );
};

export default FeatureCardVine;
