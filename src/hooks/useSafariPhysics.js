import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSpring, useTransform } from 'framer-motion';

const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

const DEFAULTS = {
  maxTilt: 15,
  idleAmplitude: 6,
  idleSpeed: 6000,
};

const noop = () => {};

export default function useSafariPhysics(options = {}) {
  const {
    reducedMotion: _ignoredReducedMotion = false,
    maxTilt = DEFAULTS.maxTilt,
  } = options;
  // TEMPORARY DEBUG: Force false to ignore system settings
  const reducedMotion = false;

  const containerRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [gyroEnabled, setGyroEnabled] = useState(false);
  const gyroRequestedRef = useRef(false);

  const tiltX = useSpring(0, { stiffness: 180, damping: 24, mass: 0.9 });
  const tiltY = useSpring(0, { stiffness: 180, damping: 24, mass: 0.9 });
  const floatY = useSpring(0, { stiffness: 50, damping: 12, mass: 0.9 });
  const shadowStrength = useSpring(0.2, { stiffness: 140, damping: 30 });
  const shineX = useSpring(50, { stiffness: 320, damping: 40 });
  const shineY = useSpring(30, { stiffness: 320, damping: 40 });
  const glareShift = useSpring(0, { stiffness: 260, damping: 35 });
  const cursorX = useSpring(0, { stiffness: 300, damping: 35 });
  const cursorY = useSpring(0, { stiffness: 300, damping: 35 });

  useEffect(() => {
    if (reducedMotion) {
      tiltX.set(0);
      tiltY.set(0);
      floatY.set(0);
      shadowStrength.set(0.15);
      return noop;
    }

    floatY.set(0);
    return noop;
  }, [floatY, reducedMotion, shadowStrength, tiltX, tiltY]);

  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined') return noop;
    if (!('DeviceOrientationEvent' in window)) return noop;
    if (typeof window.DeviceOrientationEvent.requestPermission === 'function') return noop;
    setGyroEnabled(true);
    return noop;
  }, [reducedMotion]);

  const requestGyroPermission = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!('DeviceOrientationEvent' in window)) return;
    if (typeof window.DeviceOrientationEvent.requestPermission !== 'function') return;
    if (gyroRequestedRef.current) return;
    gyroRequestedRef.current = true;
    window.DeviceOrientationEvent
      .requestPermission()
      .then((state) => {
        if (state === 'granted') {
          setGyroEnabled(true);
        }
      })
      .catch(() => {
        gyroRequestedRef.current = false;
      });
  }, []);

  const updateFromPointer = useCallback(
    (clientX, clientY) => {
      if (reducedMotion || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = clamp((clientX - rect.left) / rect.width, 0, 1);
      const y = clamp((clientY - rect.top) / rect.height, 0, 1);
      const tiltHorizontal = (x - 0.5) * 2;

      tiltY.set(-tiltHorizontal * maxTilt);
      tiltX.set(0);
      shadowStrength.set(0.25 + Math.abs(tiltHorizontal) * 0.25);
      shineX.set(x * 100);
      shineY.set((1 - y) * 100);
      glareShift.set(tiltHorizontal * 12);
      cursorX.set(clientX - (rect.left + rect.width / 2));
      cursorY.set(clientY - (rect.top + rect.height / 2));
    },
    [reducedMotion, glareShift, shineX, shineY, tiltX, tiltY, shadowStrength, cursorX, cursorY, maxTilt],
  );

  const handlePointerMove = useCallback(
    (event) => {
      if (event?.pointerType === 'touch') return;
      setIsInteracting(true);
      requestGyroPermission();
      updateFromPointer(event.clientX, event.clientY);
    },
    [requestGyroPermission, updateFromPointer],
  );

  const handlePointerEnter = useCallback(
    (event) => {
      if (!event) return;
      setIsInteracting(true);
      requestGyroPermission();
      updateFromPointer(event.clientX, event.clientY);
    },
    [updateFromPointer, requestGyroPermission],
  );

  const handlePointerLeave = useCallback(() => {
    setIsInteracting(false);
    if (reducedMotion) return;
    tiltX.set(0);
    tiltY.set(0);
    shadowStrength.set(0.2);
    shineX.set(50);
    shineY.set(35);
    glareShift.set(0);
    cursorX.set(0);
    cursorY.set(0);
  }, [glareShift, reducedMotion, shineX, shineY, shadowStrength, tiltX, tiltY, cursorX, cursorY]);

  useEffect(() => {
    if (!gyroEnabled || reducedMotion || typeof window === 'undefined') return noop;
    const handleOrientation = (event) => {
      if (isInteracting) return;
      const beta = clamp(event.beta ?? 0, -30, 30);
      const gamma = clamp(event.gamma ?? 0, -30, 30);
      const normalizedX = gamma / 30;
      const normalizedY = beta / 30;
      tiltY.set(-normalizedX * maxTilt * 0.6);
      tiltX.set(0);
      shadowStrength.set(0.25 + Math.abs(normalizedX) * 0.2);
      shineX.set((normalizedX + 1) * 50);
      shineY.set((1 - (normalizedY + 1) / 2) * 100);
      glareShift.set(-normalizedX * 10);
    };

    window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [gyroEnabled, reducedMotion, isInteracting, glareShift, maxTilt, shineX, shineY, shadowStrength, tiltX, tiltY]);

  const rimLight = useTransform([shineX, shineY], ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.45), rgba(255,255,255,0) 60%)`);
  const glareGradient = useTransform(glareShift, (value) => `linear-gradient(${125 + value / 18}deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%)`);
  const glareTransform = useTransform(glareShift, (value) => `translate3d(${value * -1}px, ${value * 0.35}px, 0)`);
  const boxShadow = useTransform(shadowStrength, (value) => `0 ${18 + value * 32}px ${80 + value * 60}px rgba(2,6,23,${0.45 + value * 0.25})`);

  const tiltStyle = useMemo(
    () => ({
      rotateX: reducedMotion ? 0 : tiltX,
      rotateY: reducedMotion ? 0 : tiltY,
      y: reducedMotion ? 0 : floatY,
      transformPerspective: '1400px',
    }),
    [floatY, tiltX, tiltY, reducedMotion],
  );

  return {
    containerRef,
    tiltStyle,
    rimLight,
    glareGradient,
    glareTransform,
    boxShadow,
    handlers: {
      onPointerMove: handlePointerMove,
      onPointerLeave: handlePointerLeave,
      onPointerEnter: handlePointerEnter,
      onPointerDown: handlePointerEnter,
    },
    cursor: {
      x: cursorX,
      y: cursorY,
      visible: isInteracting && !reducedMotion,
    },
  };
}
