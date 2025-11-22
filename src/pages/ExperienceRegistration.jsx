'use client';



import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { AnimatePresence, animate, motion, useMotionValue, useTransform, useReducedMotion, useScroll, useSpring } from 'framer-motion';

import { Swiper, SwiperSlide } from 'swiper/react';

import { Pagination, Keyboard, A11y } from 'swiper/modules';

import { useInView } from 'react-intersection-observer';

import { ArrowRight, Check, ChevronDown, ChevronRight } from 'lucide-react';
import BrowserChrome from '../components/BrowserChrome.jsx';

import useSafariPhysics from '../hooks/useSafariPhysics';

import useThemeColor from '../hooks/useThemeColor';

import 'swiper/css';

import 'swiper/css/pagination';



const LazyNestCanvas = lazy(() => import('../components/experience/NestExperienceCanvas.jsx'));

const IMMERSIVE_HEIGHT = 300; // vh

const POSTER_NOISE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAACoWZ8PAAAAF0lEQVQYV2NkYGD4z0AEYBxVSFUBAwBnGQHhX9nuSAAAAABJRU5ErkJggg==';

const STARRY_SKY_STYLE = {

  backgroundImage: `

    radial-gradient(1px 1px at 12% 18%, rgba(255,255,255,0.75), transparent 62%),

    radial-gradient(1px 1px at 72% 12%, rgba(94,234,212,0.45), transparent 62%),

    radial-gradient(1px 1px at 32% 76%, rgba(248,250,252,0.6), transparent 65%),

    radial-gradient(1px 1px at 86% 54%, rgba(147,197,253,0.55), transparent 60%)

  `,

  backgroundSize: '220px 220px, 280px 280px, 320px 320px, 360px 360px',

  backgroundPosition: '0 0, 40px 80px, 110px 20px, 150px 150px',

};

const TWINKLE_LAYER_STYLE_A = {

  backgroundImage: `

    radial-gradient(1px 1px at 10% 30%, rgba(255,255,255,0.8), transparent 55%),

    radial-gradient(1px 1px at 70% 65%, rgba(190,227,248,0.6), transparent 60%)

  `,

  backgroundSize: '260px 260px, 320px 320px',

};

const TWINKLE_LAYER_STYLE_B = {

  backgroundImage: `

    radial-gradient(1px 1px at 35% 15%, rgba(248,250,252,0.65), transparent 55%),

    radial-gradient(1px 1px at 85% 45%, rgba(129,140,248,0.55), transparent 55%)

  `,

  backgroundSize: '300px 300px, 360px 360px',

};



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

const currencyFormatter = new Intl.NumberFormat('en-US', {

  style: 'currency',

  currency: 'USD',

  maximumFractionDigits: 0,

});

const formatCurrency = (value) => currencyFormatter.format(Math.max(0, Math.round(Number(value) || 0)));

const formatInteger = (value) => Math.round(Number(value) || 0).toLocaleString('en-US');

const clampValue = (value, min, max) => Math.min(Math.max(value, min), max);

const createPreviewData = (primary, accent) => {

  const svg = `<svg width="600" height="420" viewBox="0 0 600 420" xmlns="http://www.w3.org/2000/svg">

    <defs>

      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">

        <stop offset="0%" stop-color="${primary}" stop-opacity="0.9" />

        <stop offset="100%" stop-color="${accent}" stop-opacity="0.4" />

      </linearGradient>

    </defs>

    <rect width="600" height="420" fill="#020617" />

    <rect x="28" y="44" width="544" height="332" rx="32" fill="#0f172a" opacity="0.9" />

    <circle cx="160" cy="190" r="110" fill="url(#grad)" opacity="0.8" />

    <circle cx="420" cy="140" r="90" fill="${accent}" opacity="0.35" />

    <rect x="120" y="270" width="360" height="18" rx="9" fill="${primary}" opacity="0.65" />

    <rect x="140" y="300" width="320" height="14" rx="7" fill="${accent}" opacity="0.45" />

  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

};



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



const productSlides = [

  {

    id: 'accounts',

    slug: 'accounts',

    title: 'All Accounts, One View',

    description: 'Link every card, loan, and investment to see live balances, health indicators, and household net worth in a single dashboard.',

    accent: 'from-emerald-500/20 via-teal-400/10 to-slate-900/60',

    url: 'nest.finance/accounts',

    faviconColor: '#34d399',

    ambientColor: 'rgba(34,197,94,0.35)',

    previewImage: createPreviewData('#34d399', '#0ea5e9'),

    stats: [

      { label: 'Net worth', value: ',190', change: '+3.2% this month' },

      { label: 'Cash runway', value: '8.4 months', change: 'Household ready' },

    ],

    items: [

      { name: 'Joint Checking', amount: ',900', type: 'Bank' },

      { name: 'Everyday Card', amount: '$-1,780', type: 'Credit' },

      { name: 'Nest 401(k)', amount: ',410', type: 'Retirement' },

    ],

  },

  {

    id: 'goals',

    slug: 'goals',

    title: 'Collaborative Goal Tracking',

    description: 'Design shared goals, auto-allocate deposits, and celebrate milestones together with transparent progress.',

    accent: 'from-orange-500/20 via-rose-400/10 to-slate-900/60',

    url: 'nest.finance/goals',

    faviconColor: '#fb923c',

    ambientColor: 'rgba(251,146,60,0.32)',

    previewImage: createPreviewData('#fb7185', '#f97316'),

    stats: [

      { label: 'Vacation Fund', value: '72% funded', change: ' scheduled this week' },

      { label: 'Emergency Cushion', value: '4.5 months', change: '+ this month' },

    ],

    items: [

      { name: 'Lake Como Escape', amount: ',400 / ,000', type: 'Shared' },

      { name: 'College Seed', amount: ',200 / ,000', type: 'Long-term' },

      { name: 'Studio Upgrade', amount: ',450 / ,000', type: 'Short-term' },

    ],

  },

  {

    id: 'insights',

    slug: 'insights',

    title: 'Clear Spending Insights',

    description: "Surface calmly designed trendlines that show where money is moving, with smart highlights for the partner who doesn't live in spreadsheets.",

    accent: 'from-indigo-500/20 via-sky-400/10 to-slate-900/60',

    url: 'nest.finance/insights',

    faviconColor: '#38bdf8',

    ambientColor: 'rgba(99,102,241,0.35)',

    previewImage: createPreviewData('#6366f1', '#22d3ee'),

    stats: [

      { label: 'Monthly burn', value: ',420', change: '-4.8% vs last month' },

      { label: 'Top category', value: 'Home & Rituals', change: ',340' },

    ],

    items: [

      { name: 'Groceries', amount: ' (12%)', type: 'Needs' },

      { name: 'Wellness', amount: ' (9%)', type: 'Lifestyle' },

      { name: 'Travel', amount: ' (6%)', type: 'Joy' },

    ],

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



const useCountUp = (target, reducedMotion, forceMotion = false) => {

  const motionValue = useMotionValue(target);

  const rounded = useTransform(motionValue, (value) => Math.round(value));

  const [display, setDisplay] = useState(target);

  const [delta, setDelta] = useState(0);

  const [isDeltaVisible, setIsDeltaVisible] = useState(false);

  const [isAnimating, setIsAnimating] = useState(false);

  const [isClient, setIsClient] = useState(false);

  const previousTargetRef = useRef(target);

  const hideDeltaTimeout = useRef(null);



  useEffect(() => {

    setIsClient(true);

    return () => {

      if (hideDeltaTimeout.current) {

        clearTimeout(hideDeltaTimeout.current);

      }

    };

  }, []);



  useEffect(() => {

    const unsubscribe = rounded.on('change', (value) => setDisplay(value));

    return () => unsubscribe();

  }, [rounded]);



  useEffect(() => {

    if (!isClient) return undefined;

    const shouldDecorate = forceMotion ? true : !reducedMotion;

    const difference = target - previousTargetRef.current;

    previousTargetRef.current = target;

    if (difference === 0) return undefined;



    setDelta(difference);

    if (!shouldDecorate) {

      setIsDeltaVisible(false);

      return undefined;

    }

    if (hideDeltaTimeout.current) {

      clearTimeout(hideDeltaTimeout.current);

    }

    hideDeltaTimeout.current = setTimeout(() => {

      setIsDeltaVisible(false);

    }, 1500);

    setIsDeltaVisible(true);

    return undefined;

  }, [target, isClient, reducedMotion, forceMotion]);



  useEffect(() => {

    const shouldReduce = isClient ? (forceMotion ? false : reducedMotion) : false;

    if (shouldReduce || !isClient) {

      motionValue.set(target);

      setDisplay(target);

      setIsAnimating(false);

      if (shouldReduce) {

        setIsDeltaVisible(false);

      }

      return undefined;

    }



    setIsAnimating(true);

    const controls = animate(motionValue, target, {

      type: 'spring',

      stiffness: 220,

      damping: 18,

      mass: 0.7,

      restDelta: 0.2,

      restSpeed: 0.1,

      velocity: (target - motionValue.get()) * 0.2,

      onComplete: () => setIsAnimating(false),

    });



    return () => controls.stop();

  }, [target, reducedMotion, forceMotion, isClient, motionValue]);



  return {

    value: display,

    delta,

    direction: delta >= 0 ? 'up' : 'down',

    isDeltaVisible,

    isAnimating,

  };

};



const useSavingsMilestones = (amount, reducedMotion) => {

  const [activeCelebration, setActiveCelebration] = useState(null);

  const previousAmountRef = useRef(amount);

  const timeoutRef = useRef(null);



  useEffect(() => () => {

    if (timeoutRef.current) {

      clearTimeout(timeoutRef.current);

    }

  }, []);



  const highestMilestone = useMemo(() => {

    let matched = null;

    for (let index = 0; index < SAVINGS_MILESTONES.length; index += 1) {

      const milestone = SAVINGS_MILESTONES[index];

      if (amount >= milestone.value) {

        matched = milestone;

      } else {

        break;

      }

    }

    return matched;

  }, [amount]);



  useEffect(() => {

    if (reducedMotion) {

      previousAmountRef.current = amount;

      setActiveCelebration(null);

      return undefined;

    }

    const previousAmount = previousAmountRef.current;

    previousAmountRef.current = amount;

    if (amount <= previousAmount) return undefined;

    let triggered = null;

    for (let index = SAVINGS_MILESTONES.length - 1; index >= 0; index -= 1) {

      const milestone = SAVINGS_MILESTONES[index];

      if (amount >= milestone.value && previousAmount < milestone.value) {

        triggered = milestone;

        break;

      }

    }

    if (!triggered) return undefined;



    const celebrationPayload = {

      ...triggered,

      instanceId: `${triggered.id}-${Date.now()}`,

    };

    setActiveCelebration(celebrationPayload);

    if (timeoutRef.current) {

      clearTimeout(timeoutRef.current);

    }

    timeoutRef.current = setTimeout(() => setActiveCelebration(null), 2200);

    if (typeof window !== 'undefined') {

      try {

        window.navigator?.vibrate?.(triggered.hapticDuration || 30);

      } catch (_) {

        /* no-op */

      }

    }

    return undefined;

  }, [amount, reducedMotion]);



  return {

    activeCelebration,

    highestMilestone,

  };

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

    <StarBackdrop intensity={0.6} />

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

    <StarBackdrop intensity={0.8} />

    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-slate-900/80 pointer-events-none" />

    <div className="absolute inset-0 opacity-40 blur-3xl bg-gradient-to-tr from-emerald-500/10 via-cyan-400/5 to-transparent pointer-events-none" />

  </div>

);



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

        className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/80 backdrop-blur-2xl"

        style={{ ...tiltStyle, boxShadow, transformStyle: 'preserve-3d' }}

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



        <div className="relative z-10 flex flex-col overflow-hidden rounded-[32px]">

          <BrowserChrome url={url} faviconColor={faviconColor} reducedMotion={reducedMotion} />

          <div className="relative min-h-[520px] rounded-b-[32px] bg-slate-950/85">

            <div

              aria-hidden="true"

              className={`absolute inset-0 rounded-b-[32px] border-t border-white/5 bg-gradient-to-br from-slate-900/80 to-slate-950/90 transition-opacity duration-500 ${isReady ? 'opacity-0' : 'opacity-100'} ${reducedMotion ? '' : 'animate-pulse'}`}

            >

              <div className="absolute inset-6 rounded-2xl border border-white/5 bg-slate-800/40" />

            </div>

            <div className={`relative z-10 h-full w-full rounded-b-[32px] transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>

              {children}

            </div>

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



function ActOneHero() {

  const heroRef = useRef(null);

  const reducedMotion = useReducedMotion();

  const [hideIndicator, setHideIndicator] = useState(false);

  const indicatorAccent = 'rgba(167, 243, 208, 0.7)';

  useEffect(() => {

    if (hideIndicator) return undefined;

    if (typeof window === 'undefined') return undefined;

    const handleScroll = () => {

      if (window.scrollY > 50) {

        setHideIndicator(true);

      }

    };

    handleScroll();

    const scrollOptions = { passive: true };

    window.addEventListener('scroll', handleScroll, scrollOptions);

    return () => window.removeEventListener('scroll', handleScroll, scrollOptions);

  }, [hideIndicator]);

  const handleIndicatorClick = useCallback(() => {

    setHideIndicator(true);

    if (!heroRef.current) return;

    const nextSection = heroRef.current.nextElementSibling;

    if (nextSection && typeof nextSection.scrollIntoView === 'function') {

      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    }

  }, []);

  const indicatorAnimate = reducedMotion

    ? { opacity: hideIndicator ? 0 : 0.85 }

    : {

      y: hideIndicator ? 16 : [0, 10, 0],

      opacity: hideIndicator ? 0 : [0.45, 1, 0.45],

    };

  const indicatorTransition = reducedMotion

    ? { duration: hideIndicator ? 0.35 : 0.9, ease: 'easeOut' }

    : hideIndicator

      ? { duration: 0.5, ease: [0.22, 1, 0.36, 1] }

      : { duration: 2.5, repeat: Infinity, repeatType: 'loop', ease: [0.23, 1, 0.32, 1] };

  return (


    <section ref={heroRef} className="relative flex min-h-[100vh] items-center py-16 md:py-24 overflow-hidden">

      {/* Ambient Glow */}

      {/* Ambient Glow - Removed as requested */}

      {/* <div className="glow-orb w-[500px] h-[500px] bg-emerald-500/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[120px]" /> */}



      <div className="relative z-10 mx-auto flex max-w-screen-xl flex-col items-center gap-8 px-4 text-center sm:px-6 lg:px-8">

        <motion.div

          className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5"

          {...motionFade}

          transition={{ duration: 0.8 }}

        >

          <span className="relative flex h-2 w-2">

            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>

            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>

          </span>

          <span className="font-sans text-xs font-semibold uppercase tracking-widest text-emerald-300">Act I · The Problem</span>

        </motion.div>



        <motion.h1

          className="font-display text-4xl font-bold leading-tight text-text-primary sm:text-5xl md:text-6xl"

          initial={{ opacity: 0, y: 30 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: 0.9, delay: 0.1 }}

        >

          Your family&apos;s finances.<br />

          <span className="text-gradient-emerald">It&apos;s... complicated.</span>

        </motion.h1>

        <motion.p className="font-sans max-w-2xl text-base text-text-secondary sm:text-lg leading-relaxed" {...motionFade} transition={{ duration: 0.9, delay: 0.2 }}>

          Hidden subscriptions. Rogue cards. Spreadsheets that only one of you speaks. Nest steps in with calm choreography so the whole household can finally breathe.

        </motion.p>

      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-12 z-20 flex justify-center">
        <motion.button
          type="button"
          aria-label="Scroll to explore"
          onClick={handleIndicatorClick}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
          animate={indicatorAnimate}
          transition={indicatorTransition}
          className="pointer-events-auto flex flex-col items-center gap-2 rounded-full border bg-white/5 px-6 py-4 text-center text-[0.6rem] font-semibold uppercase tracking-[0.4em] backdrop-blur-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200/70 cursor-pointer"
          style={{ borderColor: indicatorAccent, color: indicatorAccent }}
        >
          <ChevronDown className="h-6 w-6 text-current drop-shadow-[0_0_8px_rgba(167,243,208,0.35)]" />
          <motion.span
            className="text-[0.55rem] tracking-[0.45em]"
            initial={{ opacity: 0 }}
            animate={{ opacity: hideIndicator ? 0 : 1 }}
            transition={{ delay: hideIndicator ? 0 : 1.5, duration: 0.6, ease: 'easeOut' }}
          >
            Scroll to explore
          </motion.span>
        </motion.button>
      </div>

    </section>

  );

}



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

                <p className="font-sans text-[0.58rem] font-semibold uppercase tracking-[0.55em] text-text-secondary">Act II · Windows of clarity</p>

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

        <p className="font-sans text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200/70">Act III · The Conversion</p>

        <h2 className="font-display mt-6 text-3xl font-semibold text-text-primary sm:text-4xl md:text-4xl">The nest is almost ready. Claim your branch.</h2>

        <p className="font-sans mt-6 max-w-2xl text-base text-text-secondary md:text-lg">

          Curated onboarding waves mean seats are scarce. Register your interest with one tap, then share a collaborative savings plan to prove you&apos;re serious about building wealth together.

        </p>

      </div>

    </section>

  );

}



const ContributionSlider = ({

  label,

  value,

  onChange,

  min = 0,

  max = 10000,

  step = 10,

  prefix = '$',

  suffix = '',

  helper,

  formatValue = formatInteger,

}) => {

  const safeValue = Number.isFinite(value) ? value : 0;

  const clamped = clampValue(safeValue, min, max);

  const [isActive, setIsActive] = useState(false);

  const progress = ((clamped - min) / Math.max(1, max - min)) * 100;



  return (

    <label className="flex flex-col gap-3">

      <div className="flex items-baseline justify-between">

        <span className="font-sans text-sm font-medium text-text-secondary ml-1">{label}</span>

        <span className="font-display text-xl font-semibold text-white">

          {formatValue(clamped)}

          {suffix ? <span className="ml-1 text-base font-medium text-slate-400">{suffix}</span> : null}

        </span>

      </div>

      <div

        className={`rounded-3xl border bg-slate-950/60 p-4 shadow-inner transition-all ${isActive

          ? 'border-emerald-300/60 ring-2 ring-emerald-400/40'

          : 'border-white/10 focus-within:border-emerald-300/50 focus-within:ring-1 focus-within:ring-emerald-300/40'

          }`}

      >

        <div className="relative flex items-center py-4">

          <div className="absolute inset-x-1 h-1.5 rounded-full bg-slate-800/70">

            <div

              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-emerald-300 to-cyan-300"

              style={{ width: `${progress}%` }}

            />

          </div>

          <input

            type="range"

            min={min}

            max={max}

            step={step}

            value={clamped}

            onChange={(event) => onChange(clampValue(Number(event.target.value) || 0, min, max))}

            className="calculator-slider relative z-10 w-full bg-transparent"

            data-active={isActive}

            onPointerDown={() => setIsActive(true)}

            onPointerUp={() => setIsActive(false)}

            onPointerCancel={() => setIsActive(false)}

            onBlur={() => setIsActive(false)}

          />

        </div>

        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white/5 bg-slate-900/60 px-3 py-2">

          {prefix ? <span className="text-sm text-slate-400">{prefix}</span> : null}

          <input

            type="number"

            min={min}

            max={max}

            step={step}

            value={Math.round(clamped)}

            onChange={(event) => onChange(clampValue(Number(event.target.value) || 0, min, max))}

            className="flex-1 bg-transparent text-right font-sans text-lg font-semibold text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"

          />

        </div>

        {helper ? <p className="mt-2 text-xs text-slate-500">{helper}</p> : null}

      </div>

    </label>

  );

};



function CollaborativeSavingsCalculator() {

  const [goalAmount, setGoalAmount] = useState(18000);

  const [yourMonthly, setYourMonthly] = useState(450);

  const [partnerMonthly, setPartnerMonthly] = useState(350);

  const [showCalculatorCTA, setShowCalculatorCTA] = useState(false);

  const calculatorPrefersReducedMotion = useReducedMotion();



  const safeGoal = Math.max(goalAmount, 0);

  const safeYourMonthly = Math.max(yourMonthly, 0);

  const safePartnerMonthly = Math.max(partnerMonthly, 0);



  const { soloMonths, togetherMonths } = useMemo(() => {

    const soloPace = Math.max(1, safeYourMonthly || 0);

    const teamPace = Math.max(1, safeYourMonthly + safePartnerMonthly || 0);

    const solo = Math.ceil(safeGoal / soloPace);

    const together = Math.ceil(safeGoal / teamPace);

    return {

      soloMonths: Number.isFinite(solo) ? solo : 0,

      togetherMonths: Number.isFinite(together) ? together : 0,

    };

  }, [safeGoal, safeYourMonthly, safePartnerMonthly]);



  useEffect(() => {

    setShowCalculatorCTA(true);

  }, []);



  const soloDisplay = useCountUp(soloMonths, calculatorPrefersReducedMotion);

  const togetherDisplay = useCountUp(togetherMonths, calculatorPrefersReducedMotion);



  const combinedMonthly = safeYourMonthly + safePartnerMonthly;

  const soloAnnualSavings = safeYourMonthly * 12;

  const partnerAnnualContribution = safePartnerMonthly * 12;

  const combinedAnnualSavings = combinedMonthly * 12;

  const unlockedAnnualSavings = Math.max(combinedAnnualSavings - soloAnnualSavings, 0);



  const accelerationMonths = Math.max(0, soloDisplay.value - togetherDisplay.value);

  const annualTeamDisplay = useCountUp(combinedAnnualSavings, calculatorPrefersReducedMotion);

  const unlockedSavingsDisplay = useCountUp(unlockedAnnualSavings, calculatorPrefersReducedMotion);

  const soloAnnualDisplay = useCountUp(soloAnnualSavings, calculatorPrefersReducedMotion);



  const { activeCelebration, highestMilestone } = useSavingsMilestones(

    combinedAnnualSavings,

    calculatorPrefersReducedMotion,

  );



  const glowIntensity = highestMilestone?.glowStrength ?? 0.2;

  const gradientStop = Math.min(100, (combinedAnnualSavings / 20000) * 100);

  const resultBorder = highestMilestone

    ? `rgba(52,211,153,${0.35 + glowIntensity * 0.35})`

    : 'rgba(255,255,255,0.12)';

  const resultShadow = `0 0 ${28 + glowIntensity * 34}px rgba(16,185,129,${0.2 + glowIntensity * 0.45})`;

  const resultScale = calculatorPrefersReducedMotion

    ? 1

    : Math.abs(unlockedSavingsDisplay.delta) >= 500

      ? 1.03

      : 1;

  const resultBackgroundStyle = {

    backgroundImage: `linear-gradient(135deg, rgba(16,185,129,${0.25 + glowIntensity * 0.35}) 0%, rgba(6,182,212,0.18) ${Math.min(95, gradientStop + 20)}%, rgba(2,6,23,0.92) 100%)`,

  };



  return (

    <div className="glass-panel p-6 md:p-8 rounded-[24px] relative overflow-hidden">

      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />



      <div className="relative z-10 flex flex-col gap-4">

        <div className="inline-flex self-start items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1">

          <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-emerald-300">Soft CTA / Lead capture</span>

        </div>

        <h3 className="font-display text-3xl md:text-4xl font-bold text-white">Collaborative savings calculator</h3>

        <p className="font-sans text-lg text-text-secondary max-w-2xl">

          Slide through your goal and monthly contributions to feel how quickly the plan accelerates when both of you show up.

        </p>

      </div>



      <div className="mt-10 grid gap-6 md:grid-cols-3">

        <ContributionSlider

          label="Goal amount"

          value={goalAmount}

          onChange={setGoalAmount}

          min={5000}

          max={120000}

          step={500}

          prefix="$"

          formatValue={formatCurrency}

          helper="Most families start with $5k-$120k on deck."

        />

        <ContributionSlider

          label="Your monthly savings"

          value={yourMonthly}

          onChange={setYourMonthly}

          min={50}

          max={5000}

          step={25}

          prefix="$"

          suffix="/mo"

          formatValue={formatCurrency}

          helper="What you set aside solo each month."

        />

        <ContributionSlider

          label="Partner's monthly savings"

          value={partnerMonthly}

          onChange={setPartnerMonthly}

          min={0}

          max={5000}

          step={25}

          prefix="$"

          suffix="/mo"

          formatValue={formatCurrency}

          helper="Invite their contribution to feel the lift."

        />

      </div>



      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.85fr)]">

        <div className="grid gap-6 sm:grid-cols-2">

          <div className="rounded-3xl border border-white/5 bg-slate-950/30 p-6 flex flex-col justify-between min-h-[220px]">

            <div className="flex items-center justify-between gap-3">

              <p className="font-sans text-xs font-bold uppercase tracking-[0.35em] text-slate-500">Saving alone</p>

              <MetricDelta

                delta={soloDisplay.delta}

                visible={soloDisplay.isDeltaVisible}

                formatter={(value) => formatInteger(value)}

              />

            </div>

            <div className="mt-auto">

              <p className="font-display text-5xl font-bold text-slate-200 flex items-baseline gap-2">

                {formatInteger(soloDisplay.value)}

                <span className="text-2xl font-medium text-slate-500">months</span>

              </p>

              <p className="font-sans mt-4 text-sm text-slate-400">

                Staying solo keeps the landing date far out.

              </p>

            </div>

          </div>



          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 shadow-[0_0_40px_rgba(16,185,129,0.15)] relative overflow-hidden flex flex-col justify-between min-h-[220px]">

            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-40" />

            <div className="relative z-10 flex items-center justify-between gap-3">

              <p className="font-sans text-xs font-bold uppercase tracking-[0.35em] text-emerald-300">Saving together</p>

              <MetricDelta

                delta={togetherDisplay.delta}

                visible={togetherDisplay.isDeltaVisible}

                formatter={(value) => formatInteger(value)}

                positiveColor="text-emerald-100"

                negativeColor="text-white/80"

              />

            </div>

            <div className="relative z-10 mt-auto">

              <p className="font-display text-6xl font-bold text-emerald-200 flex items-baseline gap-2">

                {formatInteger(togetherDisplay.value)}

                <span className="text-2xl font-medium text-emerald-400/80">months</span>

              </p>

              <p className="font-sans mt-4 text-sm text-emerald-100/80">

                Teaming up pulls your landing date forward by <span className="font-semibold text-emerald-100">{formatInteger(accelerationMonths)} months</span>.

              </p>

            </div>

          </div>

        </div>



        <motion.div

          className="relative overflow-hidden rounded-3xl border p-8 shadow-[0_0_40px_rgba(15,118,110,0.25)]"

          style={{ ...resultBackgroundStyle, boxShadow: resultShadow }}

          animate={{ scale: resultScale, borderColor: resultBorder }}

          initial={false}

          transition={{ type: 'spring', stiffness: 220, damping: 22 }}

        >

          {activeCelebration?.particleCount ? (

            <CelebrationParticles key={activeCelebration.instanceId} count={activeCelebration.particleCount} />

          ) : null}

          {activeCelebration?.confetti ? (

            <CelebrationConfetti key={`${activeCelebration.instanceId}-confetti`} />

          ) : null}

          <div className="relative z-10 space-y-4">

            <p className="font-sans text-xs font-bold uppercase tracking-[0.4em] text-emerald-200/80">

              You could save

            </p>

            <div className="flex flex-wrap items-baseline gap-4">

              <p className="font-display text-4xl font-semibold text-white">

                {formatCurrency(unlockedSavingsDisplay.value)}

                <span className="text-base font-medium text-emerald-100/80 ml-2">per year</span>

              </p>

              <MetricDelta

                delta={unlockedSavingsDisplay.delta}

                visible={unlockedSavingsDisplay.isDeltaVisible}

                formatter={(value) => formatCurrency(value)}

                positiveColor="text-emerald-100"

              />

            </div>

            <p className="font-sans text-sm text-emerald-50/80">

              Combining contributions unlocks <span className="font-semibold text-white/90">{formatCurrency(unlockedAnnualSavings)}</span> in annual savings momentum compared to the solo plan.

            </p>

            <div className="space-y-3 pt-2 text-sm">

              <div className="flex items-center justify-between text-white/90">

                <span>Annual team savings</span>

                <span className="font-semibold">{formatCurrency(annualTeamDisplay.value)}</span>

              </div>

              <div className="flex items-center justify-between text-emerald-100/70">

                <span>Solo pace</span>

                <span>{formatCurrency(soloAnnualSavings)}</span>

              </div>

              <div className="flex items-center justify-between text-emerald-100/70">

                <span>Partner unlock</span>

                <span>+{formatCurrency(partnerAnnualContribution)}</span>

              </div>

            </div>

            {highestMilestone?.id === 'celebration' ? (

              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-emerald-500/20 px-3 py-1 text-sm font-semibold text-white/90">

                <span role="img" aria-label="Nest family benchmark">

                  ??

                </span>

                Nest Family Benchmark

              </div>

            ) : null}

          </div>

        </motion.div>

      </div>



      <motion.div

        className="mt-8 rounded-3xl border border-white/5 bg-slate-950/40 p-6"

        initial={{ opacity: 0, y: 12 }}

        whileInView={{ opacity: 1, y: 0 }}

        viewport={{ once: true, amount: 0.4 }}

        transition={{ duration: 0.5 }}

      >

        <div className="flex flex-wrap items-center justify-between gap-2">

          <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">Comparison mode</p>

          <span className="text-xs text-slate-500">Before vs after Nest</span>

        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">

          <div className="rounded-2xl border border-white/5 bg-white/5 p-4">

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Without Nest</p>

            <p className="mt-2 font-display text-2xl font-semibold text-white">

              {formatCurrency(soloAnnualDisplay.value)}

              <span className="text-sm font-medium text-slate-400 ml-1">/ yr</span>

            </p>

            <p className="mt-2 text-xs text-rose-200">

              -{formatCurrency(partnerAnnualContribution)} potential left on the table

            </p>

          </div>

          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 shadow-[0_0_30px_rgba(16,185,129,0.2)]">

            <div className="flex items-center justify-between">

              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">With Nest</p>

              <MetricDelta

                delta={annualTeamDisplay.delta}

                visible={annualTeamDisplay.isDeltaVisible}

                formatter={(value) => formatCurrency(value)}

                positiveColor="text-emerald-100"

              />

            </div>

            <p className="mt-2 font-display text-2xl font-semibold text-white">

              {formatCurrency(annualTeamDisplay.value)}

              <span className="text-sm font-medium text-emerald-100/80 ml-1">/ yr</span>

            </p>

            <p className="mt-2 text-xs text-emerald-100/80">

              +{formatCurrency(unlockedAnnualSavings)} captured together

            </p>

          </div>

        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-sm text-emerald-100/80">

          <ArrowRight size={16} className="text-emerald-300" />

          <span className="font-semibold text-white/90">+{formatCurrency(unlockedAnnualSavings)}</span>

          <span className="text-slate-400">difference / year</span>

        </div>

      </motion.div>



      <div className="mt-10 flex justify-center">

        <AnimatePresence>

          {showCalculatorCTA ? (

            <motion.button

              key="calculator-cta"

              type="button"

              initial={{ opacity: 0, y: 10 }}

              animate={{ opacity: 1, y: 0 }}

              exit={{ opacity: 0, y: 10 }}

              className="btn btn-primary text-lg px-10 py-4"

              onClick={() => document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' })}

            >

              Register to Start Saving

            </motion.button>

          ) : null}

        </AnimatePresence>

      </div>

    </div>

  );

}





function ProductPreviewCarousel() {

  const prefersReducedMotion = useReducedMotion();

  const slides = productSlides;

  const [swiperInstance, setSwiperInstance] = useState(null);

  const [activeAnnouncement, setActiveAnnouncement] = useState(

    slides.length ? `Showing 1 of ${slides.length}: ${slides[0].title}` : 'Product preview',

  );

  const [activeUrl, setActiveUrl] = useState(slides[0]?.url || 'nest.finance/overview');

  const [activeFavicon, setActiveFavicon] = useState(slides[0]?.faviconColor || '#34d399');

  const [ambientColor, setAmbientColor] = useState(slides[0]?.ambientColor || 'rgba(34,197,94,0.35)');

  const [slideProgress, setSlideProgress] = useState(() => slides.map(() => 0));

  const [windowReady, setWindowReady] = useState(() => !slides.some((slide) => slide.previewImage));

  const slideHeadingRefs = useRef({});

  const [shouldFocusHeading, setShouldFocusHeading] = useState(false);

  const ambientGlowValue = useMotionValue(ambientColor);

  const ambientGlowAnimation = useRef(null);



  useEffect(() => {

    ambientGlowAnimation.current?.stop?.();

    ambientGlowAnimation.current = animate(ambientGlowValue, ambientColor, {

      duration: 0.8,

      ease: 'easeOut',

    });

    return () => ambientGlowAnimation.current?.stop?.();

  }, [ambientColor, ambientGlowValue]);



  useEffect(() => {

    if (typeof window === 'undefined') {

      setWindowReady(true);

      return undefined;

    }

    const sources = slides.map((slide) => slide.previewImage).filter(Boolean);

    if (!sources.length) {

      setWindowReady(true);

      return undefined;

    }

    let cancelled = false;

    let loaded = 0;

    const fallback = setTimeout(() => {

      if (!cancelled) setWindowReady(true);

    }, 1500);

    const handleDone = () => {

      loaded += 1;

      if (!cancelled && loaded >= sources.length) {

        setWindowReady(true);

      }

    };

    const images = sources.map((src) => {

      const image = new Image();

      image.onload = handleDone;

      image.onerror = handleDone;

      image.src = src;

      return image;

    });

    return () => {

      cancelled = true;

      clearTimeout(fallback);

      images.forEach((image) => {

        image.onload = null;

        image.onerror = null;

      });

    };

  }, [slides]);



  const handleCarouselKeyDown = useCallback((event) => {

    if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {

      setShouldFocusHeading(true);

    }

    if (event.key === 'Home' && swiperInstance) {

      event.preventDefault();

      setShouldFocusHeading(true);

      swiperInstance.slideTo(0);

    }

    if (event.key === 'End' && swiperInstance) {

      event.preventDefault();

      setShouldFocusHeading(true);

      swiperInstance.slideTo(swiperInstance.slides?.length - 1 || slides.length - 1);

    }

  }, [swiperInstance, slides.length]);



  useEffect(() => {

    if (!swiperInstance) return;

    const updateAria = () => {

      const currentIndex = swiperInstance.activeIndex;

      const currentSlide = slides[currentIndex];

      const currentTitle = currentSlide?.title || 'Product preview';

      const currentSlug = currentSlide?.slug || 'overview';

      const nextUrl = currentSlide?.url || `nest.finance/${currentSlug}`;

      setActiveAnnouncement(`Showing ${currentIndex + 1} of ${slides.length}: ${currentTitle}`);

      setActiveUrl(nextUrl);

      setActiveFavicon(currentSlide?.faviconColor || '#34d399');

      setAmbientColor(currentSlide?.ambientColor || 'rgba(34,197,94,0.35)');

      const heading = currentSlide ? slideHeadingRefs.current[currentSlide.id] : null;

      if (heading && shouldFocusHeading) {

        heading.focus({ preventScroll: true });

        setShouldFocusHeading(false);

      }

      const paginationEl = swiperInstance.pagination?.el;

      if (paginationEl) {

        paginationEl.setAttribute('aria-label', 'Slide selector');

        paginationEl.setAttribute('role', 'group');

      }

      swiperInstance.pagination?.bullets?.forEach((bullet, index) => {

        if (!bullet) return;

        bullet.setAttribute('aria-label', `${slides[index]?.title || 'Slide'} preview`);

        bullet.setAttribute(

          'aria-current',

          bullet.classList.contains('swiper-pagination-bullet-active') ? 'true' : 'false',

        );

      });

    };

    updateAria();

    swiperInstance.on('slideChange', updateAria);

    swiperInstance.on('paginationUpdate', updateAria);

    return () => {

      swiperInstance.off('slideChange', updateAria);

      swiperInstance.off('paginationUpdate', updateAria);

    };

  }, [swiperInstance, slides, shouldFocusHeading]);



  useEffect(() => {

    if (!swiperInstance || prefersReducedMotion) return undefined;

    let frame;

    const updateProgress = () => {

      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {

        const mapped = slides.map((_, index) => {

          const slideEl = swiperInstance.slides?.[index];

          return typeof slideEl?.progress === 'number' ? slideEl.progress : 0;

        });

        setSlideProgress(mapped);

      });

    };

    swiperInstance.on('setTranslate', updateProgress);

    swiperInstance.on('touchEnd', updateProgress);

    swiperInstance.on('slideChange', updateProgress);

    updateProgress();

    return () => {

      cancelAnimationFrame(frame);

      swiperInstance.off('setTranslate', updateProgress);

      swiperInstance.off('touchEnd', updateProgress);

      swiperInstance.off('slideChange', updateProgress);

    };

  }, [swiperInstance, slides, prefersReducedMotion]);



  useEffect(() => {

    if (!swiperInstance) return undefined;

    const vibrate = () => {

      if (typeof window !== 'undefined' && typeof window.navigator?.vibrate === 'function') {

        window.navigator.vibrate(5);

      }

    };

    swiperInstance.on('slideChangeTransitionEnd', vibrate);

    swiperInstance.on('reachBeginning', vibrate);

    swiperInstance.on('reachEnd', vibrate);

    return () => {

      swiperInstance.off('slideChangeTransitionEnd', vibrate);

      swiperInstance.off('reachBeginning', vibrate);

      swiperInstance.off('reachEnd', vibrate);

    };

  }, [swiperInstance]);



  const activeSlideVariants = prefersReducedMotion ? slideVariantsReduced : slideVariantsBase;

  const activeTextVariants = prefersReducedMotion ? textItemVariantsReduced : textItemVariants;

  const activeMockVariants = prefersReducedMotion ? mockVariantsReduced : mockVariants;



  if (!slides.length) {

    return (

      <div className="rounded-3xl border border-white/10 bg-background/60 p-8 text-center text-text-secondary">

        <p className="font-display text-2xl text-text-primary">Product preview</p>

        <p className="font-sans mt-2">Interactive preview coming soon.</p>

      </div>

    );

  }



  return (

    <>

      <div

        className="relative w-full max-w-6xl mx-auto"

        onKeyDown={handleCarouselKeyDown}

      >

        {/* Background Glow */}

        <motion.div

          aria-hidden="true"

          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none blur-[140px]"

          style={{

            '--orb-color': ambientGlowValue,

            background: 'radial-gradient(circle at 50% 10%, var(--orb-color), transparent 65%)',

            opacity: prefersReducedMotion ? 0.25 : 0.6,

          }}

        />



        <div className="text-center relative z-10 mb-12">

          <p className="font-sans text-xs font-bold uppercase tracking-widest text-emerald-300/80">Product preview</p>

          <h3 className="font-display mt-4 text-4xl md:text-5xl font-bold text-white">See what Nest looks like on the inside</h3>

          <p className="font-sans mx-auto mt-4 max-w-3xl text-lg text-text-secondary">

            Swipe through the core authenticated experiences that keep couples calm, aligned, and in formation.

          </p>

          <p className="sr-only">Use left and right arrow keys to change slides.</p>

        </div>



        <SafariWindow

          url={activeUrl}

          faviconColor={activeFavicon}

          ambientColor={ambientColor}

          reducedMotion={prefersReducedMotion}

          isReady={windowReady}

          className="w-full"

        >

          <Swiper

            modules={[Pagination, Keyboard, A11y]}

            watchSlidesProgress={!prefersReducedMotion}

            speed={prefersReducedMotion ? 0 : 700}

            pagination={{

              clickable: true,

              renderBullet: (index, className) =>

                `<button class="${className} !bg-emerald-500/50 !w-2 !h-2 hover:!bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70" type="button" aria-label="${slides[index]?.title || 'Slide'} preview"></button>`,

            }}

            keyboard={{ enabled: true }}

            a11y={{

              enabled: true,

              prevSlideMessage: 'Previous product preview',

              nextSlideMessage: 'Next product preview',

              slideRole: 'group',

            }}

            spaceBetween={0}

            threshold={10}

            autoHeight={false}

            centeredSlides={true}

            slidesPerView={1}

            resistance

            resistanceRatio={0.85}

            touchRatio={1.05}

            longSwipesRatio={0.2}

            longSwipesMs={250}

            grabCursor={!prefersReducedMotion}

            onSwiper={setSwiperInstance}

            className="w-full h-full"

          >

            {slides.map((slide, index) => {

              const rawProgress = prefersReducedMotion ? 0 : slideProgress[index] || 0;

              const limitedProgress = Math.max(-1.2, Math.min(1.2, rawProgress));

              const depthScale = prefersReducedMotion ? 1 : 1 - Math.min(Math.abs(limitedProgress) * 0.04, 0.04);

              const textOffset = prefersReducedMotion || Math.abs(limitedProgress) > 0.9 ? 0 : limitedProgress * -24;

              const visualOffset = prefersReducedMotion ? 0 : limitedProgress * 20;

              const visualScale = prefersReducedMotion ? 1 : 1 - Math.min(Math.abs(limitedProgress) * 0.02, 0.02);



              return (

                <SwiperSlide key={slide.id} className="h-full">

                  {({ isActive }) => (

                    <motion.div

                      className="grid h-full grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12 items-center"

                      initial="inactive"

                      animate={isActive ? 'active' : 'inactive'}

                      variants={activeSlideVariants}

                      style={{

                        transformOrigin: 'center',

                        transform: `translate3d(0, ${limitedProgress * 18}px, 0) scale(${depthScale})`,

                        backfaceVisibility: 'hidden',

                        willChange: 'transform',

                      }}

                    >

                      {/* Text Content */}

                      <motion.div

                        variants={textContainerVariants}

                        className="text-left space-y-6"

                        style={{

                          transform: `translateY(${textOffset}px) translateZ(0)`,

                          backfaceVisibility: 'hidden',

                        }}

                      >

                        <motion.div variants={activeTextVariants}>

                          <h4

                            ref={(el) => (slideHeadingRefs.current[slide.id] = el)}

                            tabIndex={-1}

                            className="font-display text-3xl font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg"

                          >

                            {slide.title}

                          </h4>

                          <p className="font-sans mt-4 text-lg text-text-secondary leading-relaxed">

                            {slide.description}

                          </p>

                        </motion.div>



                        <motion.div variants={activeTextVariants} className="grid grid-cols-2 gap-4" style={{ backfaceVisibility: 'hidden' }}>

                          {slide.stats.map((stat, i) => (

                            <div key={i} className="rounded-2xl bg-white/5 p-4 border border-white/5">

                              <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">{stat.label}</p>

                              <p className="mt-1 text-xl font-semibold text-white">{stat.value}</p>

                              <p className="mt-1 text-xs text-emerald-400">{stat.change}</p>

                            </div>

                          ))}

                        </motion.div>

                      </motion.div>



                      {/* Visual Content */}

                      <motion.div

                        variants={activeMockVariants}

                        className={`relative h-full min-h-[300px] rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br ${slide.accent} p-6 shadow-2xl`}

                        style={{

                          transform: `translateY(${visualOffset}px) scale(${visualScale})`,

                          backfaceVisibility: 'hidden',

                          backgroundImage: slide.previewImage ? `url(${slide.previewImage})` : undefined,

                          backgroundSize: 'cover',

                          backgroundPosition: 'top center',

                          backgroundBlendMode: slide.previewImage ? 'screen' : undefined,

                        }}

                      >

                        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" />

                        <div className="relative z-10 space-y-3">

                          {slide.items.map((item, i) => (

                            <div key={i} className="flex items-center justify-between rounded-xl bg-slate-900/80 p-4 border border-white/5 shadow-lg backdrop-blur-md">

                              <div className="flex items-center gap-3">

                                <div className="w-10 h-10 rounded-full bg-white/5 text-sm font-bold uppercase text-white/80 flex items-center justify-center">

                                  {getItemGlyph(item, i)}

                                </div>

                                <div>

                                  <p className="font-medium text-white">{item.name}</p>

                                  <p className="text-xs text-slate-400">{item.type}</p>

                                </div>

                              </div>

                              <p className="font-mono text-sm font-medium text-emerald-400">{item.amount}</p>

                            </div>

                          ))}



                          {/* Mock Graph/Chart Area */}

                          <div className="mt-6 h-32 rounded-xl bg-white/5 border border-white/5 p-4 flex items-end gap-2">

                            {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (

                              <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-sm hover:bg-emerald-500/40 transition-colors" style={{ height: `${h}%` }} />

                            ))}

                          </div>

                        </div>

                      </motion.div>

                    </motion.div>

                  )}

                </SwiperSlide>

              );

            })}

          </Swiper>

        </SafariWindow>



        {/* External Link */}

        <div className="mt-8 text-center">

          <a

            href="/budget-eligibility"

            onClick={(e) => {

              e.preventDefault();

              window.location.search = '?page=budget-eligibility';

            }}

            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-emerald-400 transition-colors group"

          >

            Struggling to find our plans in your budget?

            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />

          </a>

        </div>

      </div>



      <span className="sr-only" aria-live="polite" role="status">

        {activeAnnouncement}

      </span>

    </>

  );

}



function RegisterInterestForm({

  formStep,

  loading,

  error,

  formData,

  onFieldChange,

  onStepOne,

  onSubmit,

}) {

  const disableStepOne = !formData.email || loading;

  const disableFinal = loading || !formData.name || !formData.partnerEmail;

  const stepVariants = {

    initial: { x: '100%', opacity: 0 },

    animate: { x: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },

    exit: { x: '-100%', opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } },

  };



  return (

    <div

      id="register-form"

      className="glass-panel p-8 md:p-12 rounded-[32px] relative overflow-hidden"

    >

      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 opacity-50" />



      <p className="font-sans text-xs font-bold uppercase tracking-widest text-emerald-300/80">Register your interest</p>

      <h3 className="font-display mt-3 text-3xl md:text-4xl font-bold text-white">Progressive disclosure keeps things calm.</h3>

      <p className="font-sans mt-4 text-lg text-text-secondary max-w-2xl">

        Step 1 collects your best contact so we can hold a spot. Step 2 gives us context so the private beta feels handcrafted for you.

      </p>



      <div className="mt-10 flex flex-col gap-6">

        <AnimatePresence exitBeforeEnter>

          {formStep === 1 ? (

            <motion.form

              key="step1"

              variants={stepVariants}

              initial="initial"

              animate="animate"

              exit="exit"

              className="flex flex-col gap-4 md:flex-row"

              onSubmit={(event) => {

                event.preventDefault();

                if (!disableStepOne) onStepOne();

              }}

            >

              <label className="font-sans flex-1 text-sm font-medium text-text-secondary">

                Email address

                <input

                  type="email"

                  required

                  className="input-premium mt-2"

                  placeholder="you@example.com"

                  value={formData.email}

                  onChange={(e) => onFieldChange('email', e.target.value)}

                />

              </label>

              <button

                type="submit"

                className="btn btn-primary mt-auto mb-[1px]"

                disabled={disableStepOne}

              >

                {loading ? 'Saving...' : 'Register'}

              </button>

            </motion.form>

          ) : (

            <motion.form

              key="step2"

              variants={stepVariants}

              initial="initial"

              animate="animate"

              exit="exit"

              className="grid gap-6 md:grid-cols-2"

              onSubmit={(event) => {

                event.preventDefault();

                if (!disableFinal) onSubmit();

              }}

            >

              <label className="font-sans text-sm font-medium text-text-secondary">

                Preferred name

                <input

                  className="input-premium mt-2"

                  placeholder="What should we call you?"

                  value={formData.name}

                  onChange={(e) => onFieldChange('name', e.target.value)}

                  required

                />

              </label>

              <label className="font-sans text-sm font-medium text-text-secondary">

                Partner email

                <input

                  type="email"

                  className="input-premium mt-2"

                  placeholder="partner@example.com"

                  value={formData.partnerEmail}

                  onChange={(e) => onFieldChange('partnerEmail', e.target.value)}

                  required

                />

              </label>

              <label className="font-sans md:col-span-2 text-sm font-medium text-text-secondary">

                What&apos;s your collaborative focus?

                <div className="relative mt-2">

                  <select

                    className="input-premium appearance-none cursor-pointer"

                    value={formData.householdFocus}

                    onChange={(e) => onFieldChange('householdFocus', e.target.value)}

                  >

                    {householdFocusOptions.map((option) => (

                      <option key={option} value={option} className="bg-slate-900 text-white">

                        {option}

                      </option>

                    ))}

                  </select>

                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">

                    <ChevronRight className="rotate-90" size={16} />

                  </div>

                </div>

              </label>

              <div className="md:col-span-2 flex flex-wrap items-center gap-6 mt-2">

                <button

                  type="submit"

                  className="btn btn-primary w-full md:w-auto"

                  disabled={disableFinal}

                >

                  {loading ? 'Submitting...' : 'Send my profile'}

                </button>

                <p className="font-sans text-xs text-slate-500">Your data is encrypted at rest and in transit.</p>

              </div>

            </motion.form>

          )}

        </AnimatePresence>

        {error ? <p className="font-sans text-sm text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">{error}</p> : null}

        <div className="font-sans rounded-2xl border border-white/5 bg-white/5 p-5 text-sm text-text-secondary flex items-start gap-3">

          <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0 animate-pulse" />

          <div>

            <p className="font-display font-semibold text-text-primary">Join 5,000+ families already on the waitlist.</p>

            <p className="mt-1 text-slate-400">We only send one welcome email plus launch-day priority instructions.</p>

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



export default function ExperienceRegistration({ onRegister, loading = false, error }) {

  const [formStep, setFormStep] = useState(1);

  const [formData, setFormData] = useState({

    email: '',

    name: '',

    partnerEmail: '',

    householdFocus: householdFocusOptions[0],

  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [referralCopied, setReferralCopied] = useState(false);



  const primaryColor = useThemeColor('--color-primary');

  const primaryHex = primaryColor.getStyle();



  const prefersReducedMotion = useReducedMotion();

  const { ref: immersiveTriggerRef, inView: immersiveSectionInView } = useInView({ triggerOnce: true, rootMargin: '200px' });

  const { ref: sectionVisibilityRef, inView: isSectionInView } = useInView({ threshold: 0 });

  const pinnedSectionRef = useRef(null);

  const setPinnedSectionRef = useCallback((node) => {

    pinnedSectionRef.current = node;

    immersiveTriggerRef(node);

    sectionVisibilityRef(node);

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

    { id: 'acc:1', label: 'Checking', size: 8 },

    { id: 'acc:2', label: 'Savings', size: 7 },

    { id: 'goal:1', label: 'Vacation Fund', size: 6 },

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

    <ActOneHero />

    <motion.section

      ref={setPinnedSectionRef}

      className="relative w-full"

      style={{ height: `${IMMERSIVE_HEIGHT}vh`, minHeight: '220vh' }}

    >

      <div className="sticky top-0 h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950/70 to-slate-950">

        <div className="relative h-full w-full">

          <StarBackdrop intensity={1} />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/30 to-slate-950/85" />

          <motion.div

            className="pointer-events-none absolute left-[-15%] top-1/4 z-20 h-[1.5px] w-[30%] -rotate-[11deg]"

            style={{

              opacity: shootingStarOpacity,

              x: shootingStarX,

              y: shootingStarY,

              scale: shootingStarScale,

            }}

          >

            <div className="relative h-[2px] w-full bg-gradient-to-r from-white via-sky-100 to-transparent blur-[0.8px] opacity-80">

              <span className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white/95 shadow-[0_0_18px_rgba(255,255,255,0.8)]" />

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

          {/* <PosterOrnament scrollYProgress={scrollYProgress} /> */}

        </div>

      </div>

    </motion.section >

    <ActThreeIntro />

    <motion.section

      className="min-h-[100vh] py-16 md:py-24"

      initial={{ opacity: 0, y: 60 }}

      whileInView={{ opacity: 1, y: 0 }}

      transition={{ duration: 0.8, ease: 'easeOut' }}

      viewport={{ once: true, amount: 0.4 }}

    >

      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">

        <CollaborativeSavingsCalculator />

      </div>

    </motion.section>

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

              />

            </motion.div>

          )}

        </AnimatePresence>

      </div>

    </motion.section>

  </div >

);

}

const StarBackdrop = ({ className = '', intensity = 1 }) => (

  <div className={`pointer-events-none absolute inset-0 ${className}`}>

    <div

      className="absolute inset-0"

      style={{

        ...STARRY_SKY_STYLE,

        opacity: Math.min(0.95, 0.8 * intensity),

      }}

    />

    <motion.div

      className="absolute inset-0"

      style={{ ...TWINKLE_LAYER_STYLE_A, mixBlendMode: 'screen' }}

      animate={{ opacity: [0.25 * intensity, 0.8 * intensity, 0.3 * intensity] }}

      transition={{ duration: 6.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}

    />

    <motion.div

      className="absolute inset-0"

      style={{ ...TWINKLE_LAYER_STYLE_B, mixBlendMode: 'screen' }}

      animate={{ opacity: [0.22 * intensity, 0.7 * intensity, 0.22 * intensity] }}

      transition={{ duration: 10, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}

    />

  </div>

);

