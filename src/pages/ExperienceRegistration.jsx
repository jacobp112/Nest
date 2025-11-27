'use client';



import React, { Suspense, lazy, startTransition, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { AnimatePresence, animate, motion, useMotionValue, useTransform, useReducedMotion, useScroll, useSpring } from 'framer-motion';

import { Swiper, SwiperSlide } from 'swiper/react';

import { Pagination, Keyboard, A11y } from 'swiper/modules';

import { useInView } from 'react-intersection-observer';

import { ArrowRight, Check, ChevronDown, ChevronRight, Sparkles, Lock } from 'lucide-react';
import BrowserChrome from '../components/BrowserChrome.jsx';

import useSafariPhysics from '../hooks/useSafariPhysics';

import useThemeColor from '../hooks/useThemeColor';

import 'swiper/css';

import 'swiper/css/pagination';

import Starfield from '../components/experience/Starfield.jsx';
import TopNav from '../components/TopNav.jsx';
import DemoDashboard from '../components/demo/DemoDashboard.jsx';


const LazyNestCanvas = lazy(() => import('../components/experience/NestExperienceCanvas.jsx'));
const AccountsNetWorthView = lazy(() => import('./AccountsNetWorthView'));
const GoalsCenterView = lazy(() => import('./GoalsCenterView'));
const ReportingHubView = lazy(() => import('./ReportingHubView'));

const IMMERSIVE_HEIGHT = 300; // vh

const POSTER_NOISE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAACoWZ8PAAAAF0lEQVQYV2NkYGD4z0AEYBxVSFUBAwBnGQHhX9nuSAAAAABJRU5ErkJggg==';





const IMMERSIVE_STARFIELD_CONFIG = {

  maxStarsDesktop: 3200,

  maxStarsMobile: 1800,

  spawnRatePerSec: 2000,

  spawnRampDuration: 1.8,

  initialFill: 0.12,

  targetFill: 0.98,

  baseStarSize: 5.2,

  twinkleMinPeriod: 1,

  twinkleMaxPeriod: 2.8,

  parallaxStrength: 4.2,

  hotStarProbability: 0.18,

};

const CONFETTI_COLORS = ['#34d399', '#2dd4bf', '#0d9488', '#6ee7b7', '#5eead4', '#a7f3d0'];

const CONFETTI_PIECES = 48;

const SAVINGS_MILESTONES = [

  { id: 'glow', value: 1000, glowStrength: 0.35, particleCount: 0, hapticDuration: 18 },

  { id: 'burst', value: 5000, glowStrength: 0.6, particleCount: 18, hapticDuration: 32 },

  { id: 'celebration', value: 10000, glowStrength: 0.85, particleCount: 28, hapticDuration: 64, confetti: true },

];

const currencyFormatter = new Intl.NumberFormat('en-GB', {

  style: 'currency',

  currency: 'GBP',

  maximumFractionDigits: 0,

});

const formatCurrency = (value) => currencyFormatter.format(Math.max(0, Math.round(Number(value) || 0)));

const formatInteger = (value) => Math.round(Number(value) || 0).toLocaleString('en-US');

const clampValue = (value, min, max) => Math.min(Math.max(value, min), max);





const VALUE_PROPS = [

  {

    id: 'aggregation',

    label: 'Connect',

    title: 'First, we connect everything',

    subtitle: 'Secure bank-level aggregation pulls in every account, card, loan, and pocketed savings so nothing is lost in the shuffle.',

  },

  {

    id: 'insights',

    label: 'Insights',

    title: 'Then, our AI finds insights',

    subtitle: 'Threads of cash flow, spending spikes, and goal gaps surface automatically so you focus on decisions, not detective work.',

  },

  {

    id: 'collaboration',

    label: 'Collaborate',

    title: 'Finally, you work together',

    subtitle: 'Shared rituals, nudges, and accountability keep partners and co-parents flying in formation instead of fighting the current.',

  },

];

const DEFAULT_WAITLIST_MESSAGE = 'Join 5,000+ families already on the waitlist.';
const DEFAULT_WAITLIST_SUBTEXT =
  'We only send one welcome email plus launch-day priority instructions.';
const DEFAULT_VELVET_TEXT = 'Secure your Founding Member rate.';



const productSlides = [
  {
    id: 'architect',
    slug: 'architect',
    title: 'The Architect View',
    description: 'See your entire financial life in one high-fidelity dashboard. Assets, liabilities, and net worth—visualized.',
    accent: 'from-indigo-500/20 via-purple-400/10 to-slate-900/60',
    url: 'nest.finance/architect',
    faviconColor: '#6366f1',
    ambientColor: 'rgba(99,102,241,0.35)',
    stats: [],
    items: [],
  },
  {
    id: 'rituals',
    slug: 'rituals',
    title: 'Shared Rituals',
    description: 'Build healthy financial habits together with guided monthly reviews and automated check-ins.',
    accent: 'from-orange-500/20 via-amber-400/10 to-slate-900/60',
    url: 'nest.finance/rituals',
    faviconColor: '#f59e0b',
    ambientColor: 'rgba(245,158,11,0.35)',
    stats: [],
    items: [],
  },
  {
    id: 'vision',
    slug: 'vision',
    title: 'Long-term Vision',
    description: 'Align on your 5, 10, and 20-year goals. Visualize your future and track progress towards your dreams.',
    accent: 'from-emerald-500/20 via-teal-400/10 to-slate-900/60',
    url: 'nest.finance/vision',
    faviconColor: '#10b981',
    ambientColor: 'rgba(16,185,129,0.35)',
    stats: [],
    items: [],
  },
  {
    id: 'collaborator',
    slug: 'collaborator',
    title: 'Collaborator Mode',
    description: 'Seamlessly manage joint finances while maintaining individual privacy. The perfect balance for modern couples.',
    accent: 'from-rose-500/20 via-pink-400/10 to-slate-900/60',
    url: 'nest.finance/collaborator',
    faviconColor: '#f43f5e',
    ambientColor: 'rgba(244,63,94,0.35)',
    stats: [],
    items: [],
  },
]; const slideVariantsBase = {

  active: {

    opacity: 1,

    y: 0,

    scale: 1,

    transition: { duration: 0.45, ease: 'easeOut' },

  },

  inactive: {

    opacity: 0.75,

    y: 16,

    scale: 0.99,

    transition: { duration: 0.35, ease: 'easeOut' },

  },

};



const slideVariantsReduced = {

  active: {

    opacity: 1,

    y: 0,

    scale: 1,

    transition: { duration: 0.35, ease: 'easeOut' },

  },

  inactive: {

    opacity: 0.85,

    y: 0,

    scale: 1,

    transition: { duration: 0.3, ease: 'easeOut' },

  },

};



const textContainerVariants = {

  active: {

    transition: {

      staggerChildren: 0.08,

      delayChildren: 0.12,

    },

  },

  inactive: {},

};



const textItemVariants = {

  active: {

    opacity: 1,

    y: 0,

    transition: { duration: 0.4, ease: 'easeOut' },

  },

  inactive: {

    opacity: 0.65,

    y: 12,

    transition: { duration: 0.3, ease: 'easeOut' },

  },

};



const textItemVariantsReduced = {

  active: {

    opacity: 1,

    y: 0,

    transition: { duration: 0.3, ease: 'easeOut' },

  },

  inactive: {

    opacity: 0.5,

    y: 0,

    transition: { duration: 0.2, ease: 'easeOut' },

  },

};



const mockVariants = {

  active: {

    opacity: 1,

    y: 0,

    transition: { duration: 0.6, ease: 'easeOut' },

  },

  inactive: {

    opacity: 0.65,

    y: 24,

    transition: { duration: 0.4, ease: 'easeIn' },

  },

};



const mockVariantsReduced = {

  active: {

    opacity: 1,

    y: 0,

    transition: { duration: 0.4, ease: 'easeOut' },

  },

  inactive: {

    opacity: 0.8,

    y: 0,

    transition: { duration: 0.3, ease: 'easeOut' },

  },

};



const householdFocusOptions = ['Get on the same page weekly', 'Plan major purchases calmly', 'Pay off debt together', 'Grow generational wealth'];



const motionFade = {

  initial: { opacity: 0, y: 24 },

  animate: { opacity: 1, y: 0 },

};



const fadeByProgress = (progress, start, end) => {

  const padding = 0.08;

  const paddedStart = Math.max(0, start - padding);

  const paddedEnd = Math.min(1, end + padding);



  if (progress <= paddedStart) {

    return start === 0 ? 1 : 0;

  }

  if (progress >= paddedEnd) return 0;



  const midpoint = (start + end) / 2;

  if (progress <= midpoint) {

    return (progress - paddedStart) / Math.max(0.0001, midpoint - paddedStart);

  }

  return (paddedEnd - progress) / Math.max(0.0001, paddedEnd - midpoint);

};



const ITEM_GLYPHS = ['A', 'B', 'C', 'D'];

const getItemGlyph = (item, index) => {

  const typeInitial = item?.type?.[0] ?? ITEM_GLYPHS[index % ITEM_GLYPHS.length];

  return `${typeInitial}`.toUpperCase();

};



const MetricDelta = ({

  delta,

  visible,

  formatter = (value) => value,

  positiveColor = 'text-emerald-300',

  negativeColor = 'text-slate-100/80',

}) => (

  <AnimatePresence initial={false}>

    {visible && delta !== 0 ? (

      <motion.span

        key={`${delta > 0 ? 'inc' : 'dec'}-${Math.abs(delta)}`}

        className={`text-sm font-semibold ${delta > 0 ? positiveColor : negativeColor}`}

        initial={{ opacity: 0, y: -4 }}

        animate={{ opacity: 1, y: 0 }}

        exit={{ opacity: 0, y: -4 }}

      >

        {delta > 0 ? '+' : '-'}

        {formatter(Math.abs(delta))}

      </motion.span>

    ) : null}

  </AnimatePresence>

);



const CelebrationParticles = ({ count = 16 }) => (

  <div className="pointer-events-none absolute inset-0">

    {Array.from({ length: count }).map((_, index) => {

      const angle = (index / count) * Math.PI * 2;

      const distance = 70 + (index % 6) * 10;

      const delay = index * 0.015;

      return (

        <motion.span

          key={`particle-${index}`}

          className="absolute left-1/2 top-1/2 h-1 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 shadow-[0_0_14px_rgba(16,185,129,0.3)]"

          style={{ transformOrigin: 'center' }}

          initial={{ opacity: 0, x: 0, y: 0, scale: 0.6 }}

          animate={{

            opacity: [0, 1, 0],

            x: Math.cos(angle) * distance,

            y: Math.sin(angle) * distance,

            scale: [0.8, 1.05, 0.8],

            rotate: angle * (180 / Math.PI),

          }}

          transition={{ duration: 1.2, delay, ease: 'easeOut' }}

        />

      );

    })}

  </div>

);



const CelebrationConfetti = ({ pieces = 28 }) => {

  const config = useMemo(

    () =>

      Array.from({ length: pieces }, (_, index) => ({

        id: index,

        left: `${Math.round((index / pieces) * 100)}%`,

        delay: (index % 6) * 0.05,

        duration: 1.4 + (index % 5) * 0.15,

        color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],

      })),

    [pieces],

  );



  return (

    <div className="pointer-events-none absolute inset-0 overflow-visible">

      {config.map((piece) => (

        <motion.span

          key={`inline-confetti-${piece.id}`}

          className="absolute block rounded-full shadow-[0_2px_6px_rgba(15,118,110,0.25)]"

          style={{ width: 6, height: 12, left: piece.left, backgroundColor: piece.color }}

          initial={{ opacity: 0, y: '-10%', scale: 0.8 }}

          animate={{

            opacity: [0, 1, 1, 0],

            y: '110%',

            scale: [0.8, 1, 1],

            rotate: 90 + piece.id * 6,

          }}

          transition={{ duration: piece.duration, delay: piece.delay, ease: 'easeOut' }}

        />

      ))}

    </div>

  );

};



const PosterOrnament = ({ glowHex }) => (

  <div className="absolute inset-0 overflow-hidden rounded-[36px] bg-background">
    <Starfield density={800} reducedMotion={true} />

    <div

      className="absolute inset-0 opacity-[0.08]"

      style={{

        background: 'transparent', // Removed green circle gradient completely

      }}

    />

    <div

      className="absolute inset-0 opacity-[0.04]"

      style={{ backgroundImage: `url(${POSTER_NOISE})`, backgroundRepeat: 'repeat' }}

    />

  </div>

);



const CanvasPoster = ({ glowHex }) => (

  <div className="relative flex h-full items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6">

    <PosterOrnament glowHex={glowHex} />
    <Starfield density={1200} reducedMotion={true} />

    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-slate-900/80 pointer-events-none" />

    <div className="absolute inset-0 opacity-40 blur-3xl bg-gradient-to-tr from-emerald-500/10 via-cyan-400/5 to-transparent pointer-events-none" />

  </div>

);

const DESKTOP_TARGET_WIDTH = 1024; // Lowered to 1024px (lg) for larger text while maintaining grid layout

const ScaleWrapper = ({ children }) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.offsetWidth;
        const newScale = parentWidth / DESKTOP_TARGET_WIDTH;
        setScale(newScale);
      }
    };

    // Initial scale
    updateScale();

    // Resize observer for container width
    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(updateScale);
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-slate-950 select-none"
    >
      {/* Interaction Shield */}
      <div className="absolute inset-0 z-50 bg-transparent" />

      {/* Scaled Content */}
      <div
        ref={contentRef}
        className="origin-top-left will-change-transform"
        style={{
          width: `${DESKTOP_TARGET_WIDTH}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left'
        }}
      >
        {children}
      </div>
    </div>
  );
};

const SafariWindow = ({
  children,
  url,
  className,
  faviconColor,
  ambientColor,
  reducedMotion,
  isReady,
}) => {
  const {
    containerRef,
    tiltStyle,
    rimLight,
    glareGradient,
    glareTransform,
    boxShadow,
    handlers,
    cursor,
  } = useSafariPhysics({ reducedMotion });

  return (
    <div
      ref={containerRef}
      className={`relative z-10 ${className || ''}`}
      {...handlers}
    >
      <motion.div
        className="group relative h-full overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/80 backdrop-blur-2xl transition-all duration-500 ease-in-out"
        style={{
          ...tiltStyle,
          boxShadow,
          transformStyle: 'preserve-3d',
        }}
      >
        {!reducedMotion && (
          <>
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-px rounded-[32px] z-50"
              style={{ backgroundImage: rimLight, opacity: 0.65, mixBlendMode: 'screen' }}
            />
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[32px] z-40"
              style={{ backgroundImage: glareGradient, opacity: 0.35, mixBlendMode: 'soft-light', transform: glareTransform }}
            />
          </>
        )}
        {ambientColor ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[32px]"
            style={{ background: `radial-gradient(circle at 25% -10%, ${ambientColor}, transparent 60%)`, opacity: 0.4 }}
          />
        ) : null}

        <div className="relative z-10 flex flex-col h-full overflow-hidden rounded-[32px]">
          <BrowserChrome url={url} faviconColor={faviconColor} reducedMotion={reducedMotion} />

          {/* Content Container */}
          <div className="relative flex-1 bg-slate-950/85 overflow-hidden">
            <div
              aria-hidden="true"
              className={`absolute inset-0 z-20 border-t border-white/5 bg-gradient-to-br from-slate-900/80 to-slate-950/90 transition-opacity duration-500 ${isReady ? 'opacity-0' : 'opacity-100'} ${reducedMotion ? '' : 'animate-pulse'}`}
            >
              <div className="absolute inset-6 rounded-2xl border border-white/5 bg-slate-800/40" />
            </div>

            {/* Actual Content */}
            <div className={`relative z-10 h-full w-full transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              {children}
            </div>

            {/* Bottom Blur Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-30 pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {!reducedMotion && (
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 z-[60] flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 text-[10px] font-semibold uppercase tracking-[0.35em] text-white mix-blend-difference backdrop-blur-sm"
          style={{ x: cursor.x, y: cursor.y, opacity: cursor.visible ? 0.85 : 0 }}
        >
          Drag
        </motion.div>
      )}
    </div>
  );
};



const HeroTitle = () => (
  <div className="relative z-10 text-center space-y-6 max-w-5xl mx-auto pt-32 pb-24 px-6">
    {/* Badge */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/20 border border-emerald-500/20 backdrop-blur-md mb-6 shadow-lg shadow-emerald-900/20"
    >
      <Sparkles size={14} className="text-emerald-400 animate-pulse" />
      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-200">
        Private Wealth OS
      </span>
    </motion.div>

    {/* Massive Headline */}
    <motion.h1
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-white tracking-tighter leading-[0.9]"
    >
      Family finance <br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-white">
        reimagined.
      </span>
    </motion.h1>

    {/* Subtext */}
    <motion.p
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light"
    >
      The first collaborative operating system for high-net-worth households.
      Align your wealth, goals, and legacy in one secure vault.
    </motion.p>

    {/* Magnetic CTA Button */}
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="pt-10"
    >
      <button
        onClick={() => document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' })}
        className="group relative px-10 py-5 rounded-full bg-white text-slate-950 font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_50px_rgba(255,255,255,0.3)] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-300 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
        <span className="relative z-10">Request Early Access</span>
      </button>
    </motion.div>
  </div>
);



const PROGRESS_TRACK_HEIGHT = 120;



function ValuePropProgressIndicator({ progressValue, currentProgress = 0, onSegmentClick, reducedMotion, isVisible = true }) {

  const fallbackProgressValue = useMotionValue(0);

  const resolvedProgressValue = progressValue ?? fallbackProgressValue;



  const springProgress = useSpring(resolvedProgressValue, {

    stiffness: 200,

    damping: 32,

    mass: 0.8,

  });



  const animatedProgress = reducedMotion ? resolvedProgressValue : springProgress;



  const dotY = useTransform(animatedProgress, (value = 0) => Math.min(1, Math.max(0, value)) * PROGRESS_TRACK_HEIGHT);



  const activeIndex = Math.min(

    VALUE_PROPS.length - 1,

    Math.max(0, Math.floor(currentProgress * VALUE_PROPS.length + 0.00001)),

  );



  if (!progressValue || !isVisible) return null;



  return (

    <motion.div

      className="pointer-events-none fixed right-6 top-1/2 z-30 -translate-y-1/2 text-left"

      initial={{ opacity: 0 }}

      animate={{ opacity: isVisible ? 1 : 0 }}

      transition={{ duration: reducedMotion ? 0.2 : 0.4, ease: 'easeOut' }}

    >

      <div className="pointer-events-auto">

        <div

          className="relative flex w-16 flex-col items-center justify-between"

          style={{ height: PROGRESS_TRACK_HEIGHT }}

        >

          <div

            className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 rounded-full bg-slate-500/25"

            aria-hidden="true"

          />

          <motion.span

            aria-hidden="true"

            className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300 ${reducedMotion ? '' : 'shadow-[0_0_14px_rgba(16,185,129,0.8)]'}`}

            style={{

              width: '0.85rem',

              height: '0.85rem',

              y: dotY,

            }}

          />

          {VALUE_PROPS.map((prop, index) => {

            const status = index < activeIndex ? 'complete' : index === activeIndex ? 'active' : 'upcoming';

            const isActive = status === 'active';

            const isComplete = status === 'complete';

            const widthClass = isActive ? 'w-[3px]' : 'w-0.5';

            const colorClass = isActive

              ? 'bg-emerald-300'

              : isComplete

                ? 'bg-emerald-300/80'

                : 'bg-slate-500/55';

            const opacity = isActive ? 1 : isComplete ? 0.65 : 0.25;

            const boxShadow = isActive && !reducedMotion ? '0 0 12px rgba(16,185,129,0.65)' : 'none';

            return (

              <button

                key={prop.id}

                type="button"

                aria-label={`Skip to ${prop.label || prop.title}`}

                aria-current={isActive ? 'step' : undefined}

                onClick={() => onSegmentClick?.(index)}

                className="group relative flex w-full flex-col items-center gap-2 rounded-full px-2 py-1 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300/60"

              >

                <span

                  className={`block ${widthClass} rounded-full transition-all duration-300 ease-out ${colorClass}`}

                  style={{

                    height: `${PROGRESS_TRACK_HEIGHT / VALUE_PROPS.length - 6}px`,

                    opacity,

                    boxShadow,

                  }}

                />

                <motion.span

                  className="pointer-events-none absolute right-full mr-3 whitespace-nowrap text-right text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-50"

                  initial={{ opacity: 0, x: 8 }}

                  animate={{ opacity: isVisible ? 0.9 : 0, x: isVisible ? 0 : 8 }}

                  transition={{ duration: reducedMotion ? 0.2 : 0.35, ease: 'easeOut' }}

                >

                  {prop.label || prop.title}

                </motion.span>

              </button>

            );

          })}

        </div>

      </div>

    </motion.div>

  );

}



function ValuePropOverlay({ progressValue, progress = 0, sectionRef = null, reducedMotion = false, isSectionActive = true }) {

  const fallbackProgressValue = useMotionValue(progress);

  useEffect(() => {

    fallbackProgressValue.set(progress);

  }, [progress, fallbackProgressValue]);



  const trackedProgressValue = progressValue ?? fallbackProgressValue;

  const [currentProgress, setCurrentProgress] = useState(trackedProgressValue?.get?.() ?? progress);



  useEffect(() => {

    if (!trackedProgressValue || typeof trackedProgressValue.on !== 'function') {

      setCurrentProgress(progress);

      return undefined;

    }

    setCurrentProgress(trackedProgressValue.get?.() ?? progress);

    const unsubscribe = trackedProgressValue.on('change', (latest) => {

      setCurrentProgress(latest);

    });

    return () => unsubscribe();

  }, [trackedProgressValue, progress]);



  const slot = currentProgress * VALUE_PROPS.length;

  const handleSegmentClick = useCallback(

    (index) => {

      if (!sectionRef?.current || typeof window === 'undefined') return;

      const sectionNode = sectionRef.current;

      const rect = sectionNode.getBoundingClientRect();

      const startOffset = (window.pageYOffset || window.scrollY || 0) + rect.top;

      const sectionHeight = sectionNode.offsetHeight || rect.height || 0;

      if (sectionHeight <= 0) return;

      const denominator = Math.max(1, VALUE_PROPS.length - 1);

      const targetProgress = VALUE_PROPS.length === 1 ? 0 : index / denominator;

      const targetScroll = startOffset + sectionHeight * targetProgress;

      window.scrollTo({

        top: targetScroll,

        behavior: reducedMotion ? 'auto' : 'smooth',

      });

    },

    [sectionRef, reducedMotion],

  );

  return (

    <>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 sm:px-6">

        {VALUE_PROPS.map((block, idx) => {

          const start = idx / VALUE_PROPS.length;

          const end = (idx + 1) / VALUE_PROPS.length;

          const opacity = fadeByProgress(currentProgress, start, end);

          const relative = idx - slot;

          const translateY = relative * 60;

          const scale = 1 - Math.min(Math.abs(relative) * 0.06, 0.18);

          const blur = 0;

          const depth = 100 - Math.abs(relative) * 20;

          return (

            <div

              key={block.id}

              className="absolute inset-x-0 flex justify-center"

              style={{

                opacity,

                transform: `translateY(${translateY}px) scale(${scale})`,

                zIndex: depth,

              }}

            >

              <div

                className="w-full max-w-xl rounded-[24px] border border-white/12 bg-slate-950/65 p-5 sm:p-6 text-left shadow-[0_40px_90px_rgba(8,47,73,0.35)] backdrop-blur-xl transition-all duration-300"

                style={{

                  filter: `blur(${blur}px)`,

                  willChange: 'transform, opacity',

                }}

              >

                <p className="font-sans text-[0.58rem] font-semibold uppercase tracking-[0.55em] text-text-secondary">Windows of Clarity</p>

                <h3 className="font-display mt-4 text-2xl font-semibold text-text-primary md:text-3xl leading-tight">

                  <span className="text-emerald-300">{block.title}</span>

                </h3>

                <p className="font-sans mt-4 text-base text-text-secondary">{block.subtitle}</p>

              </div>

            </div>

          );

        })}

      </div>

      <ValuePropProgressIndicator

        progressValue={trackedProgressValue}

        currentProgress={currentProgress}

        onSegmentClick={handleSegmentClick}

        reducedMotion={reducedMotion}

        isVisible={isSectionActive}

      />

    </>

  );

}



function ActThreeIntro() {

  return (

    <section className="flex min-h-[100vh] items-center py-16 md:py-24">

      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">

        <p className="font-sans text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200/70">The Next Step</p>

        <h2 className="font-display mt-6 text-3xl font-semibold text-text-primary sm:text-4xl md:text-4xl">The nest is almost ready. Claim your branch.</h2>

        <p className="font-sans mt-6 max-w-2xl text-base text-text-secondary md:text-lg">

          Curated onboarding waves mean seats are scarce. Register your interest with one tap, then share a collaborative savings plan to prove you&apos;re serious about building wealth together.

        </p>

      </div>

    </section>

  );

}





const MOCK_ACCOUNTS = [
  { id: '1', name: 'Main Current', balance: 2450.50, type: 'asset', provider: 'Monzo' },
  { id: '2', name: 'Joint Savings', balance: 12000.00, type: 'asset', provider: 'Starling' },
  { id: '3', name: 'Amex Gold', balance: -450.20, type: 'liability', provider: 'Amex' },
];

const MOCK_TRANSACTIONS = [
  { id: 't1', description: 'Waitrose', amount: -85.40, date: new Date().toISOString(), type: 'expense' },
  { id: 't2', description: 'Salary', amount: 3200.00, date: new Date().toISOString(), type: 'income' },
  { id: 't3', description: 'Netflix', amount: -15.99, date: new Date().toISOString(), type: 'expense' },
  { id: 't4', description: 'TFL Travel', amount: -4.50, date: new Date().toISOString(), type: 'expense' },
  { id: 't5', description: 'Coffee', amount: -3.50, date: new Date().toISOString(), type: 'expense' },
];

const MOCK_GOALS = [
  { id: 'g1', name: 'Wedding Fund', target: 15000, current: 8500, deadline: '2024-12-01', color: 'rose' },
  { id: 'g2', name: 'Emergency Fund', target: 10000, current: 10000, deadline: '2024-06-01', color: 'emerald' },
  { id: 'g3', name: 'Japan Trip', target: 5000, current: 1200, deadline: '2025-04-01', color: 'sky' },
];

const MOCK_BUDGETS = [
  { id: 'b1', category: 'Groceries', limit: 400, spent: 250, color: 'emerald' },
  { id: 'b2', category: 'Dining Out', limit: 200, spent: 180, color: 'rose' },
  { id: 'b3', category: 'Transport', limit: 150, spent: 45, color: 'sky' },
];



const PRODUCT_SLIDE_COMPONENTS = {
  architect: <DemoDashboard initialTab="overview" initialPersona="architect" showIntro={false} />,
  rituals: <DemoDashboard initialTab="rituals" showIntro={false} />,
  vision: <DemoDashboard initialTab="vision" showIntro={false} />,
  collaborator: <DemoDashboard initialTab="overview" initialPersona="collaborator" showIntro={false} />,
};
function ProductPreviewCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const handleSlideSelect = useCallback((idx) => {
    startTransition(() => {
      setActiveIndex(idx);
    });
  }, []);

  const slides = productSlides.map((slide) => ({
    ...slide,
    component: PRODUCT_SLIDE_COMPONENTS[slide.id] ?? null,
  }));

  const activeSlide = slides[Math.min(activeIndex, slides.length - 1)] ?? slides[0];
  if (!activeSlide) return null;

  const fallbackPoster = <CanvasPoster glowHex={activeSlide.faviconColor} />;

  const motionTransition = prefersReducedMotion
    ? { duration: 0.4, ease: 'easeOut' }
    : { duration: 0.8, ease: [0.16, 1, 0.3, 1] };

  return (
    <div className="relative w-full max-w-[1400px] mx-auto px-6 py-32">
      <div className="flex flex-col items-center gap-12">

        {/* Header & Navigation */}
        <div className="text-center space-y-8 max-w-3xl mx-auto">
          <div className="space-y-4 flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight">Inside the OS</h2>
            <div className="h-1.5 w-24 bg-emerald-500 rounded-full" />
          </div>

          {/* Horizontal Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => handleSlideSelect(idx)}
                className={`px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${activeIndex === idx
                  ? 'bg-white text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105'
                  : 'bg-slate-900/50 text-slate-500 hover:bg-slate-800 hover:text-slate-300 border border-white/5'
                  }`}
              >
                {slide.title}
              </button>
            ))}
          </div>

          {/* Active Description */}
          <motion.p
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto"
          >
            {activeSlide.description}
          </motion.p>
        </div>

        {/* Visual Window */}
        <div className="relative h-[700px] w-full max-w-5xl perspective-[2000px]">
          {/* Background Bloom */}
          <div className="absolute inset-0 bg-emerald-500/10 blur-[150px] rounded-full -z-10" />

          <SafariWindow
            url={activeSlide.url}
            faviconColor={activeSlide.faviconColor}
            ambientColor={activeSlide.ambientColor}
            reducedMotion={prefersReducedMotion}
            className="h-full w-full"
            isReady={true}
          >
            <div className="relative flex h-full w-full overflow-hidden bg-[#0B0F19]">
              <ScaleWrapper>
                <Suspense fallback={fallbackPoster}>
                  {activeSlide.component ?? fallbackPoster}
                </Suspense>
              </ScaleWrapper>
            </div>
          </SafariWindow>
        </div>

      </div>
    </div>
  );
}




function RegisterInterestForm({ onRegister, loading }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  return (
    <div id="register-form" className="relative w-full max-w-5xl mx-auto px-6 pb-40 pt-20">
      <div className="relative rounded-[4rem] border border-white/10 bg-[#0B0F19] p-12 md:p-24 overflow-hidden text-center shadow-2xl">

        {/* Lighting Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-70 blur-[1px]" />
        <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-10">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tighter">
              Secure your spot.
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed">
              We are onboarding families in curated waves to ensure the highest quality of service.
            </p>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); onRegister(email, name); }}
            className="space-y-5 text-left bg-slate-900/50 p-8 rounded-3xl border border-white/5 backdrop-blur-sm"
          >
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">Full Name</label>
                <input
                  value={name} onChange={e => setName(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-950 border border-white/10 text-white placeholder:text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                  placeholder="Jane Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">Email Address</label>
                <input
                  type="email"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-950 border border-white/10 text-white placeholder:text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                  placeholder="jane@example.com"
                  required
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full py-6 rounded-2xl bg-white text-slate-950 font-bold text-sm uppercase tracking-widest hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? 'Processing...' : 'Join Waitlist'}
            </button>
          </form>

          <div className="flex items-center justify-center gap-3 text-[10px] text-slate-500 uppercase tracking-widest pt-4">
            <Lock size={12} className="text-emerald-500" />
            <span>Bank-Level Encryption</span>
            <span className="text-slate-700">•</span>
            <span>No Spam</span>
          </div>
        </div>
      </div>
    </div>
  );
}



function ThankYouPanel({ referralCopied, onCopy, forceMotion = false }) {

  const systemPrefersReducedMotion = useReducedMotion();

  const prefersReducedMotion = forceMotion ? false : systemPrefersReducedMotion;

  const [burstId, setBurstId] = useState(0);

  const [buttonBurstId, setButtonBurstId] = useState(0);

  const celebrationCompleteRef = useRef(false);



  const handleCelebrationComplete = useCallback(() => {

    if (celebrationCompleteRef.current) return;

    celebrationCompleteRef.current = true;

    if (typeof window !== 'undefined') {

      window.dispatchEvent?.(new CustomEvent('nest:registration-celebration-complete'));

      window?.analytics?.track?.('registration_celebration_complete');

    }

  }, []);



  useEffect(() => {

    if (prefersReducedMotion) return;

    const timeout = setTimeout(() => setBurstId((prev) => prev + 1), 200);

    return () => clearTimeout(timeout);

  }, [prefersReducedMotion]);



  useEffect(() => {

    if (!referralCopied || prefersReducedMotion) return;

    setButtonBurstId((prev) => prev + 1);

  }, [referralCopied, prefersReducedMotion]);



  const containerVariants = useMemo(

    () => ({

      hidden: { opacity: 1 },

      visible: {

        opacity: 1,

        transition: prefersReducedMotion

          ? { duration: 0.2 }

          : { delayChildren: 0.45, staggerChildren: 0.12 },

      },

    }),

    [prefersReducedMotion],

  );



  const itemVariants = useMemo(

    () => ({

      hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },

      visible: {

        opacity: 1,

        y: 0,

        transition: {

          type: prefersReducedMotion ? 'tween' : 'spring',

          stiffness: 220,

          damping: 18,

          duration: prefersReducedMotion ? 0.3 : 0.7,

        },

      },

    }),

    [prefersReducedMotion],

  );



  return (

    <div className="relative">

      {!prefersReducedMotion ? (

        <motion.div

          aria-hidden="true"

          className="pointer-events-none absolute -inset-1 rounded-[34px] bg-gradient-to-r from-emerald-400/20 via-teal-300/10 to-cyan-300/20 blur-2xl"

          animate={{ opacity: [0.25, 0.55, 0.25], scale: [0.96, 1.05, 0.96] }}

          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}

        />

      ) : null}

      <motion.div

        role="status"

        aria-live="polite"

        className="relative overflow-hidden rounded-3xl border border-emerald-300/25 bg-gradient-to-b from-emerald-900/40 via-emerald-900/30 to-emerald-900/10 p-6 shadow-[0_35px_80px_rgba(16,185,129,0.35)] backdrop-blur-xl md:p-10"

        initial={

          prefersReducedMotion

            ? { opacity: 0 }

            : { opacity: 0, scale: 0.85, filter: 'blur(8px)', backdropFilter: 'blur(8px)' }

        }

        animate={

          prefersReducedMotion

            ? { opacity: 1, scale: 1, y: 0, backdropFilter: 'blur(12px)' }

            : { opacity: 1, scale: 1, filter: 'blur(0px)', y: [0, -4, 0, -6, 0], backdropFilter: 'blur(18px)' }

        }

        exit={

          prefersReducedMotion

            ? { opacity: 0 }

            : { opacity: 0, scale: 0.9, filter: 'blur(6px)', backdropFilter: 'blur(6px)' }

        }

        onAnimationComplete={handleCelebrationComplete}

        transition={{

          default: prefersReducedMotion

            ? { duration: 0.35, ease: 'easeOut' }

            : { type: 'spring', stiffness: 160, damping: 18 },

          y: prefersReducedMotion

            ? { duration: 0 }

            : { duration: 10, repeat: Infinity, ease: 'easeInOut' },

        }}

      >

        {!prefersReducedMotion ? <ConfettiBurst burstId={burstId} disabled={prefersReducedMotion} /> : null}

        <motion.div

          className="relative z-20 space-y-4 text-text-primary"

          variants={containerVariants}

          initial="hidden"

          animate="visible"

        >

          <motion.p

            className="font-sans text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200/80"

            variants={itemVariants}

          >

            Post-conversion · Viral loop

          </motion.p>

          <motion.h3 className="font-display text-3xl font-semibold text-white" variants={itemVariants}>

            You&apos;re on the manifest.

          </motion.h3>

          <motion.p className="font-sans text-base text-emerald-50/80" variants={itemVariants}>

            Your Nest needs a partner. Invite them to join the waitlist with you?

          </motion.p>

          <motion.div className="flex flex-col gap-3 md:flex-row md:items-center" variants={itemVariants}>

            <div className="relative md:w-auto">

              <motion.button

                type="button"

                onClick={onCopy}

                className="relative flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-sans text-base font-semibold focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"

                whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}

                animate={

                  referralCopied

                    ? {

                      backgroundColor: 'rgba(16,185,129,1)',

                      color: '#ecfdf5',

                      scale: prefersReducedMotion ? 1 : [1, 1.05, 1],

                      boxShadow: '0 25px 60px rgba(16,185,129,0.35)',

                    }

                    : {

                      backgroundColor: '#ffffff',

                      color: '#065f46',

                      scale: 1,

                      boxShadow: '0 20px 45px rgba(15,118,110,0.25)',

                    }

                }

                transition={{

                  type: prefersReducedMotion ? 'tween' : 'spring',

                  stiffness: 320,

                  damping: 20,

                  duration: prefersReducedMotion ? 0.2 : 0.6,

                  scale: prefersReducedMotion

                    ? { duration: 0.2, ease: 'easeOut' }

                    : { type: 'tween', duration: 0.5, ease: 'easeOut' },

                }}

              >

                <AnimatePresence mode="wait" initial={false}>

                  {referralCopied ? (

                    <motion.span

                      key="copied"

                      className="flex items-center gap-2"

                      initial={{ opacity: 0, y: 6 }}

                      animate={{ opacity: 1, y: 0 }}

                      exit={{ opacity: 0, y: -6 }}

                      transition={{ duration: 0.25, ease: 'easeOut' }}

                    >

                      <motion.span

                        className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600/40"

                        initial={{ scale: 0.4, rotate: -20 }}

                        animate={{ scale: 1, rotate: 0 }}

                        exit={{ scale: 0.4, rotate: 20 }}

                        transition={{ duration: 0.25, ease: 'easeOut' }}

                      >

                        <Check size={16} className="text-emerald-50" strokeWidth={3} />

                      </motion.span>

                      <span>Referral link copied</span>

                    </motion.span>

                  ) : (

                    <motion.span

                      key="copy"

                      className="flex items-center gap-2"

                      initial={{ opacity: 0, y: 6 }}

                      animate={{ opacity: 1, y: 0 }}

                      exit={{ opacity: 0, y: -6 }}

                      transition={{ duration: 0.25, ease: 'easeOut' }}

                    >

                      <span>Copy referral link</span>

                      <ArrowRight size={16} />

                    </motion.span>

                  )}

                </AnimatePresence>

                {!prefersReducedMotion ? (

                  <ButtonSuccessParticles trigger={buttonBurstId} disabled={prefersReducedMotion} />

                ) : null}

              </motion.button>

            </div>

            <p className="font-sans text-xs text-emerald-50/70">

              Partners who join from your link skip the next waitlist wave.

            </p>

          </motion.div>

        </motion.div>

      </motion.div>

    </div>

  );

}



function ConfettiBurst({ burstId, disabled }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!burstId || disabled) return;
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const horizontalSpread = viewportWidth * 0.9;
    const newPieces = Array.from({ length: CONFETTI_PIECES }, (_, index) => ({
      id: `${burstId}-${index}`,
      startX: (Math.random() - 0.5) * horizontalSpread,
      driftX: (Math.random() - 0.5) * 160,
      startYOffset: -(40 + Math.random() * 80),
      fallDistance: 280 + Math.random() * 320,
      width: 4 + Math.random() * 5,
      height: 8 + Math.random() * 10,
      color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
      delay: Math.random() * 0.15,
      rotate: (Math.random() - 0.5) * 360,
      duration: 2.2 + Math.random() * 0.4,
    }));
    setPieces(newPieces);
    const timeout = setTimeout(() => setPieces([]), 2600);
    return () => clearTimeout(timeout);
  }, [burstId, disabled]);

  if (!pieces.length || disabled) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-0 overflow-visible">
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2" style={{ width: '100vw' }}>
        <AnimatePresence>
          {pieces.map((piece) => (
            <motion.span
              key={piece.id}
              className="absolute block rounded-full shadow-[0_6px_18px_rgba(16,185,129,0.2)]"
              style={{ width: piece.width, height: piece.height, backgroundColor: piece.color }}
              initial={{ opacity: 0, scale: 0.6, x: piece.startX, y: piece.startYOffset, rotate: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: [piece.startX, piece.startX + piece.driftX],
                y: [piece.startYOffset, piece.fallDistance * 0.65, piece.fallDistance],
                rotate: piece.rotate,
                scale: [0.6, 1, 0.85],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: piece.duration, ease: 'easeOut', delay: piece.delay }}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ButtonSuccessParticles({ trigger, disabled }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!trigger || disabled) return;
    const newParticles = Array.from({ length: 6 }, (_, index) => ({
      id: `${trigger}-${index}`,
      x: (Math.random() - 0.5) * 36,
      y: -18 - Math.random() * 16,
      size: 4 + Math.random() * 4,
      delay: index * 0.04,
    }));
    setParticles(newParticles);
    const timeout = setTimeout(() => setParticles([]), 600);
    return () => clearTimeout(timeout);
  }, [trigger, disabled]);

  if (!particles.length || disabled) return null;

  return (
    <div className="pointer-events-none absolute inset-0">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-50 shadow-[0_0_14px_rgba(16,185,129,0.4)]"
            style={{ width: particle.size, height: particle.size }}
            initial={{ opacity: 0, scale: 0.4, x: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.6], x: particle.x, y: particle.y }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: particle.delay }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}



export default function ExperienceRegistration({ onRegister, loading = false, error, onNavigate, planContext }) {
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    partnerEmail: '',
    householdFocus: householdFocusOptions[0],
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referralCopied, setReferralCopied] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const contactFormRef = useRef(null);
  const canSendContact = Boolean(contactSubject.trim() && contactMessage.trim());
  const waitlistHero = planContext?.heroText ?? DEFAULT_WAITLIST_MESSAGE;
  const waitlistSubtext = planContext?.subtext ?? DEFAULT_WAITLIST_SUBTEXT;
  const waitlistVelvetText = planContext ? planContext.velvetText ?? DEFAULT_VELVET_TEXT : null;

  const primaryColor = useThemeColor('--color-primary');
  const primaryHex = primaryColor.getStyle();

  const prefersReducedMotion = useReducedMotion();
  const { ref: immersiveTriggerRef, inView: immersiveSectionInView } = useInView({ triggerOnce: true, rootMargin: '200px' });
  const { ref: sectionVisibilityRef, inView: isSectionInView } = useInView({ threshold: 0 });
  const pinnedSectionRef = useRef(null);

  useEffect(() => {
    const node = pinnedSectionRef.current;
    if (node) {
      immersiveTriggerRef(node);
      sectionVisibilityRef(node);
    }
    return () => {
      if (node) {
        immersiveTriggerRef(null);
        sectionVisibilityRef(null);
      }
    };
  }, [immersiveTriggerRef, sectionVisibilityRef]);

  const immersiveEnabled = immersiveSectionInView && !prefersReducedMotion;

  const { scrollYProgress } = useScroll({
    target: pinnedSectionRef,
    offset: ['start start', 'end end'],
  });

  const shootingStarOpacity = useTransform(scrollYProgress, [0.08, 0.2, 0.36], [0, 1, 0]);
  const shootingStarX = useTransform(scrollYProgress, [0.08, 0.36], [-320, 420]);
  const shootingStarY = useTransform(scrollYProgress, [0.08, 0.36], [60, -240]);
  const shootingStarScale = useTransform(scrollYProgress, [0.08, 0.2, 0.36], [0.6, 1, 0.6]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStepOne = () => {
    if (!formData.email) return;
    setFormStep(2);
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.partnerEmail) return;
    if (typeof onRegister === 'function') {
      await onRegister(formData.email, formData.partnerEmail, formData.name);
    }
    setIsSubmitted(true);
  };

  const handleContactSubmit = (event) => {
    event.preventDefault();
    if (!canSendContact) return;
    setContactSubject('');
    setContactMessage('');
  };

  const scrollToContact = () => {
    contactFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleCopyReferral = async () => {
    const link = `https://nest.finance/waitlist?ref=${encodeURIComponent(formData.email || 'nest')}`;
    try {
      await navigator.clipboard?.writeText(link);
      setReferralCopied(true);
      setTimeout(() => setReferralCopied(false), 3000);
    } catch (_) {
      setReferralCopied(false);
    }
  };

  const PLACEHOLDER_NEST_DATA = {
    nodes: [
      { id: 'nest', label: 'Shared Nest', size: 14 },
      { id: 'acc:1', label: 'Current', size: 8 },
      { id: 'acc:2', label: 'Savings', size: 7 },
      { id: 'goal:1', label: 'Holiday Fund', size: 6 },
      { id: 'budget:1', label: 'Groceries', size: 5 },
      { id: 'cat:wellness', label: 'Wellness', size: 5 },
      { id: 'goal:2', label: 'Emergency Cushion', size: 6 },
    ],
    links: [
      { source: 'nest', target: 'acc:1' },
      { source: 'nest', target: 'acc:2' },
      { source: 'nest', target: 'goal:1' },
      { source: 'nest', target: 'goal:2' },
      { source: 'nest', target: 'budget:1' },
      { source: 'budget:1', target: 'cat:wellness' },
    ],
  };

  return (
    <div className="relative min-h-screen bg-background text-text-primary">
      <TopNav onNavigate={onNavigate} />
      <HeroTitle />

      <motion.section
        ref={pinnedSectionRef}
        className="relative w-full"
        style={{ height: `${IMMERSIVE_HEIGHT}vh`, minHeight: '220vh' }}
      >
        <div className="sticky top-0 h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950/70 to-slate-950">
          <div className="relative h-full w-full">
            <Starfield density={2500} reducedMotion={prefersReducedMotion} />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/30 to-slate-950/85" />

            <motion.div
              className="pointer-events-none absolute left-[10%] top-1/4 z-20 h-[2px] w-[140px] -rotate-[15deg]"
              style={{
                opacity: shootingStarOpacity,
                x: shootingStarX,
                y: shootingStarY,
                scale: shootingStarScale,
              }}
            >
              <div className="relative h-full w-full">
                {/* Tail */}
                <div className="absolute right-0 top-1/2 h-[1px] w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-sky-100/40 to-white blur-[0.5px]" />
                {/* Head */}
                <span className="absolute right-0 top-1/2 h-0.5 w-6 -translate-y-1/2 rounded-full bg-gradient-to-l from-white to-transparent shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                <span className="absolute right-0 top-1/2 h-0.5 w-2 -translate-y-1/2 bg-white blur-[0.5px]" />
              </div>
            </motion.div>

            <div className="absolute inset-0 z-10">
              {immersiveEnabled ? (
                <Suspense fallback={<PosterOrnament glowHex={primaryHex} />}>
                  <LazyNestCanvas
                    progressValue={scrollYProgress}
                    data={PLACEHOLDER_NEST_DATA}
                    reducedMotion={prefersReducedMotion}
                    starfieldConfig={IMMERSIVE_STARFIELD_CONFIG}
                  />
                </Suspense>
              ) : (
                <CanvasPoster glowHex={primaryHex} />
              )}
            </div>

            <div className="absolute inset-0 z-20">
              <ValuePropOverlay progressValue={scrollYProgress} sectionRef={pinnedSectionRef} reducedMotion={prefersReducedMotion} isSectionActive={isSectionInView} />
            </div>
          </div>
        </div>
      </motion.section >

      <ActThreeIntro />

      <motion.section
        id="product-preview"
        className="py-16 md:py-24"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.4 }}
      >
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <ProductPreviewCarousel />
        </div>
      </motion.section>

      <motion.section
        className="min-h-[100vh] bg-slate-950/90 py-24 md:py-32"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        viewport={{ once: true, amount: 0.4 }}
      >
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="registration-success"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 40 }}
                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -40 }}
                transition={{ duration: prefersReducedMotion ? 0.25 : 0.6, ease: 'easeOut' }}
              >
                <ThankYouPanel referralCopied={referralCopied} onCopy={handleCopyReferral} forceMotion />
              </motion.div>
            ) : (
              <motion.div
                key="registration-form"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: prefersReducedMotion ? 0.25 : 0.5, ease: 'easeInOut' }}
              >
                <RegisterInterestForm
                  formStep={formStep}
                  loading={loading}
                  error={error}
                  formData={formData}
                  onFieldChange={handleFieldChange}
                  onStepOne={handleStepOne}
                  onSubmit={handleSubmit}
                  waitlistHero={waitlistHero}
                  waitlistSubtext={waitlistSubtext}
                  waitlistVelvetText={waitlistVelvetText}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      <footer className="mt-12 border-t border-white/10 bg-slate-950/70 py-12">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start">
            <div className="space-y-2 text-xs leading-relaxed text-slate-400">
              <p>© 2025 Nest Finance</p>
              <p>A platform wholly owned and operated by Phillips Holdings Ltd (registered in england and wales).</p>
              <p>Nest cannot move or withdraw your funds. Open banking access is consent-based and read-only by default.</p>
            </div>
            <div ref={contactFormRef} className="space-y-3">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.6em] text-slate-400">Contact</p>
              <form onSubmit={handleContactSubmit} className="space-y-3">
                <label htmlFor="footer-subject" className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Subject
                </label>
                <input
                  id="footer-subject"
                  type="text"
                  value={contactSubject}
                  onChange={(event) => setContactSubject(event.target.value)}
                  placeholder="Subject"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
                <label htmlFor="footer-message" className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Message
                </label>
                <textarea
                  id="footer-message"
                  rows={3}
                  value={contactMessage}
                  onChange={(event) => setContactMessage(event.target.value)}
                  placeholder="Share a question or request"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 resize-none"
                />
                <button
                  type="submit"
                  disabled={!canSendContact}
                  className="w-full rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-slate-950 transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-slate-400">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('security')}
              className="transition hover:text-white"
            >
              security
            </button>
            <span className="text-white/30">|</span>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('privacy')}
              className="transition hover:text-white"
            >
              privacy policy
            </button>
            <span className="text-white/30">|</span>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('terms')}
              className="transition hover:text-white"
            >
              terms &amp; conditions
            </button>
            <span className="text-white/30">|</span>
            <button
              type="button"
              onClick={scrollToContact}
              className="transition hover:text-white"
            >
              contact
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
