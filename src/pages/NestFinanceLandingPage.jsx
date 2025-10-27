import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import { loadFull } from 'tsparticles';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import {
  ShieldCheck,
  Target,
  TrendingUp,
  Menu,
  X,
  CheckCircle,
} from 'lucide-react';
import FeatureCardVine from './FeatureCardVine';
import AtmosphericLayer from './AtmosphericLayer';
import { btn, card } from '../theme/styles';

// --- Centralized all variants for consistency ---
const globalVariants = {
  textStagger: {
    hidden: { opacity: 0, y: 28 },
    visible: (index = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        delay: index * 0.12,
      },
    }),
  },
  featureCard: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  },
  dashboardItem: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  },
};

const noop = () => {};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (start, end, t) => start + (end - start) * t;

const mergeRefs =
  (...refs) =>
  (value) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(value);
      } else {
        ref.current = value;
      }
    });
  };

const HeroParticlesLayer = () => {
  const [init, setInit] = useState(false);

  // Initialize tsParticles engine only once
  useEffect(() => {
    console.log('Initializing particles engine...');
    initParticlesEngine(async (engine) => {
      // Load the full preset for all features
      await loadFull(engine);
    })
      .then(() => {
        console.log('Particles engine initialized!');
        setInit(true); // Mark as initialized
      })
      .catch((error) => {
        console.error('Particles engine failed to initialize:', error);
      });
  }, []); // Empty dependency array ensures this runs only once on mount

  const particlesLoaded = (container) => {
    // Optional: Callback function when particles are loaded
    // console.log('Particles container loaded', container);
  };

  console.log('Particles init state:', init);
  const particlesOptions = useMemo(
    () => ({
      fullScreen: { enable: false }, // Prevent particles from covering the whole page
      detectRetina: true,
      fpsLimit: 60,
      background: { color: 'transparent' }, // Use parent's background
      interactivity: {
        detectsOn: 'window', // Detect mouse over the whole window area
        events: {
          onHover: { enable: true, mode: 'repulse' }, // Repulse particles on hover
          resize: true, // Re-layout particles on window resize
        },
        modes: {
          repulse: { distance: 100, duration: 0.4 }, // Repulsion effect settings
        },
      },
      particles: {
        number: { value: 80, density: { enable: true, area: 1000 } }, // Number of particles
        color: { value: ['#0f766e', '#34d399', '#fbbf24'] }, // Theme colors
        shape: { type: 'circle' },
        opacity: {
          value: { min: 0.2, max: 0.7 }, // Random opacity
          animation: { enable: true, speed: 0.4, minimumValue: 0.2, sync: false }, // Fade in/out
        },
        size: {
          value: { min: 1, max: 3 }, // Random size
          animation: { enable: true, speed: 2, minimumValue: 1, sync: false }, // Pulsate size
        },
        move: {
          enable: true,
          speed: 0.5, // Slow movement speed
          direction: 'none',
          random: true, // Random initial direction
          straight: false,
          outModes: { default: 'out' }, // Particles disappear when leaving canvas
          // Wobble effect for gentle drifting
          wobble: { enable: true, distance: 5, speed: 0.2 },
        },
        links: { enable: false }, // No lines connecting particles
      },
    }),
    []
  );

  // Only render Particles component after the engine is initialized
  if (init) {
    return (
      // --- CORRECTED Z-INDEX ---
      // Positioned above hero backgrounds but below foreground content
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={particlesOptions}
          className="h-full w-full"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    );
  }

  return null; // Render nothing until initialized
};

// --- Living growth spine that adapts to layout ---
const PageGrowthSpine = ({ scrollRef, sectionRefs }) => {
  const { hero, heroVisual, features, testimonials, cta } = sectionRefs;
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start end', 'end start'],
  });

  const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
  const [pathD, setPathD] = useState('');
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const [leafNodes, setLeafNodes] = useState([]);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!scrollRef?.current) return;

    let frame;
    const scheduleMeasure = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = undefined;
        const container = scrollRef.current;
        if (!container) return;

        const width = container.offsetWidth;
        const height = container.scrollHeight;
        if (!width || !height) return;

        const safeTop = (ref, fallback = 0) =>
          ref?.current ? ref.current.offsetTop : fallback;
        const safeHeight = (ref, fallback = 0) =>
          ref?.current ? ref.current.offsetHeight : fallback;

        const heroBottom =
          safeTop(hero, height * 0.05) + safeHeight(hero, height * 0.2) * 0.9;
        const visualMidY =
          safeTop(heroVisual, heroBottom + height * 0.12) +
          safeHeight(heroVisual, height * 0.18) * 0.5;
        const featuresTop = safeTop(features, visualMidY + height * 0.18);
        const featuresHeight = safeHeight(features, height * 0.22);
        const featuresAnchorY = featuresTop + featuresHeight * 0.35;

        const testimonialsTop = safeTop(testimonials, featuresAnchorY + height * 0.2);
        const testimonialsHeight = safeHeight(testimonials, height * 0.22);
        const testimonialsAnchorY = testimonialsTop + testimonialsHeight * 0.4;

        const ctaTop = safeTop(cta, testimonialsAnchorY + height * 0.22);
        const ctaHeight = safeHeight(cta, height * 0.24);
        const ctaCenterY = ctaTop + ctaHeight * 0.35;

        const centerX = width / 2;
        const branchOffset = Math.max(80, width * 0.18);
        const testimonialBranchOffset = Math.max(90, width * 0.22);
        const nestRadius = Math.max(100, width * 0.16);

        let path = `M ${centerX} ${heroBottom}`;
        path += ` C ${centerX} ${heroBottom + (visualMidY - heroBottom) * 0.3}, ${centerX} ${heroBottom + (visualMidY - heroBottom) * 0.7}, ${centerX} ${visualMidY}`;
        path += ` C ${centerX} ${visualMidY + (featuresAnchorY - visualMidY) * 0.4}, ${centerX - branchOffset * 0.6} ${featuresAnchorY - 60}, ${centerX - branchOffset} ${featuresAnchorY}`;
        path += ` C ${centerX - branchOffset - 40} ${featuresAnchorY + 70}, ${centerX - branchOffset / 2} ${featuresAnchorY + 130}, ${centerX} ${featuresAnchorY + 150}`;
        path += ` C ${centerX + branchOffset / 2} ${featuresAnchorY + 130}, ${centerX + branchOffset + 40} ${featuresAnchorY + 70}, ${centerX + branchOffset} ${featuresAnchorY}`;
        path += ` C ${centerX + branchOffset * 0.6} ${featuresAnchorY - 60}, ${centerX} ${featuresAnchorY - 10}, ${centerX} ${testimonialsAnchorY - 170}`;
        path += ` C ${centerX} ${testimonialsAnchorY - 60}, ${centerX - testimonialBranchOffset} ${testimonialsAnchorY - 10}, ${centerX - testimonialBranchOffset} ${testimonialsAnchorY + 40}`;
        path += ` C ${centerX - testimonialBranchOffset} ${testimonialsAnchorY + 130}, ${centerX - testimonialBranchOffset / 3} ${testimonialsAnchorY + 190}, ${centerX} ${testimonialsAnchorY + 210}`;
        path += ` C ${centerX + testimonialBranchOffset / 3} ${testimonialsAnchorY + 190}, ${centerX + testimonialBranchOffset} ${testimonialsAnchorY + 130}, ${centerX + testimonialBranchOffset} ${testimonialsAnchorY + 40}`;
        path += ` C ${centerX + testimonialBranchOffset} ${testimonialsAnchorY - 10}, ${centerX} ${testimonialsAnchorY - 70}, ${centerX} ${ctaCenterY - nestRadius}`;
        path += ` C ${centerX - nestRadius} ${ctaCenterY - nestRadius}, ${centerX - nestRadius} ${ctaCenterY + nestRadius}, ${centerX} ${ctaCenterY + nestRadius}`;
        path += ` C ${centerX + nestRadius} ${ctaCenterY + nestRadius}, ${centerX + nestRadius} ${ctaCenterY - nestRadius}, ${centerX} ${ctaCenterY - nestRadius * 0.3}`;
        path += ` C ${centerX - nestRadius * 0.6} ${ctaCenterY + nestRadius * 0.2}, ${centerX + nestRadius * 0.6} ${ctaCenterY + nestRadius * 0.9}, ${centerX} ${ctaCenterY + nestRadius * 1.2}`;
        path += ` C ${centerX - nestRadius * 0.4} ${ctaCenterY + nestRadius * 1.4}, ${centerX + nestRadius * 0.4} ${ctaCenterY + nestRadius * 1.6}, ${centerX} ${ctaCenterY + nestRadius * 1.8}`;

        const totalHeight = Math.max(height, ctaCenterY + nestRadius * 2);
        setSvgDimensions({ width, height: totalHeight });
        setPathD(path);

        const newLeaves = [
          {
            id: 'features-left',
            cx: centerX - branchOffset,
            cy: featuresAnchorY,
            radius: Math.max(6, width * 0.012),
            color: '#10b981',
            opacityRange: [0.18, 0.32],
            scaleRange: [0.8, 1.08],
          },
          {
            id: 'features-right',
            cx: centerX + branchOffset,
            cy: featuresAnchorY,
            radius: Math.max(5, width * 0.01),
            color: '#34d399',
            opacityRange: [0.22, 0.36],
            scaleRange: [0.85, 1.12],
          },
          {
            id: 'testimonials-right',
            cx: centerX + testimonialBranchOffset,
            cy: testimonialsAnchorY + 40,
            radius: Math.max(7, width * 0.013),
            color: '#059669',
            opacityRange: [0.4, 0.58],
            scaleRange: [0.8, 1.15],
          },
          {
            id: 'cta-nest',
            cx: centerX,
            cy: ctaCenterY + nestRadius * 1.1,
            radius: Math.max(6, width * 0.011),
            color: '#047857',
            opacityRange: [0.55, 0.72],
            scaleRange: [0.85, 1.2],
          },
        ];

        setLeafNodes(newLeaves);
      });
    };

    scheduleMeasure();
    window.addEventListener('resize', scheduleMeasure);

    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(scheduleMeasure)
        : null;

    if (observer) {
      observer.observe(scrollRef.current);
      [hero, heroVisual, features, testimonials, cta].forEach((ref) => {
        if (ref?.current) observer.observe(ref.current);
      });
    }

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('resize', scheduleMeasure);
      observer?.disconnect();
    };
  }, [scrollRef, hero, heroVisual, features, testimonials, cta]);

  useEffect(() => {
    return scrollYProgress.on('change', (value) => {
      setScrollProgress(value);
    });
  }, [scrollYProgress]);

  const leavesWithMotion = useMemo(
    () =>
      leafNodes.map((leaf) => ({
        ...leaf,
        opacity: (() => {
          const [start, end] = leaf.opacityRange;
          if (scrollProgress <= start) return 0;
          if (scrollProgress >= end) return 1;
          return (scrollProgress - start) / (end - start);
        })(),
        scale: (() => {
          const [start, end] = leaf.opacityRange;
          const [minScale, maxScale] = leaf.scaleRange;
          const t = clamp((scrollProgress - start) / (end - start), 0, 1);
          return lerp(minScale, maxScale, t);
        })(),
      })),
    [leafNodes, scrollProgress]
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <svg
        className="h-full w-full"
        viewBox={`0 0 ${Math.max(svgDimensions.width, 1)} ${Math.max(
          svgDimensions.height,
          1
        )}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="page-growth-gradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
        </defs>

        <motion.path
          d={pathD || `M 0 0`}
          fill="none"
          stroke="url(#page-growth-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength }}
        />

        {leavesWithMotion.map(
          ({ id, cx, cy, radius, color, opacity, scale }) => (
            <motion.circle
              key={id}
              cx={cx}
              cy={cy}
              r={radius}
              fill={color}
              style={{ opacity, scale }}
            />
          )
        )}
      </svg>
    </div>
  );
};

// --- No changes to main component ---
const NestFinanceLandingPage = ({
  onLoginClick = noop,
  onGetStartedClick = noop,
}) => {
  const mainRef = useRef(null);
  const heroRef = useRef(null);
  const heroVisualRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);
  const finalCTARef = useRef(null);

  const sectionRefs = useMemo(
    () => ({
      hero: heroRef,
      heroVisual: heroVisualRef,
      features: featuresRef,
      testimonials: testimonialsRef,
      cta: finalCTARef,
    }),
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white text-slate-900">
      <AtmosphericLayer />
      <Navbar onLoginClick={onLoginClick} onGetStartedClick={onGetStartedClick} />
      <main ref={mainRef} className="relative overflow-x-hidden">
        <PageGrowthSpine scrollRef={mainRef} sectionRefs={sectionRefs} />
        <HeroSection ref={heroRef} onGetStartedClick={onGetStartedClick} />
        <HeroVisual ref={heroVisualRef} />
        <FeaturesSection ref={featuresRef} />
        <TestimonialsSection ref={testimonialsRef} />
        <FinalCTASection ref={finalCTARef} onGetStartedClick={onGetStartedClick} />
      </main>
      <Footer />
    </div>
  );
};

// --- No changes to Navbar ---
const Navbar = ({ onLoginClick, onGetStartedClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const mobileNavLinks = [
    { href: '#features', label: 'Features' },
    { href: '#security', label: 'Security' },
    { href: '#testimonials', label: 'Testimonials' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#top" className="text-lg font-semibold text-primary">
            Nest Finance
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            {mobileNavLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition hover:text-slate-900"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={onLoginClick}
              className="transition hover:text-slate-900"
            >
              Login
            </button>
            <button
              type="button"
              onClick={onGetStartedClick}
              className={btn({ variant: 'primary', size: 'md', className: 'shadow-soft' })}
            >
              Get Started
            </button>
          </nav>
          <div className="flex items-center gap-3 md:hidden">
            <button
              type="button"
              onClick={onLoginClick}
              className="text-sm font-medium text-slate-600"
            >
              Login
            </button>
            <button
              type="button"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              onClick={toggleMobileMenu}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="x"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-x-0 top-0 z-40 origin-top bg-white p-4 pt-20 shadow-xl md:hidden"
          >
            <nav className="flex flex-col gap-6 px-4">
              {mobileNavLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium text-slate-700"
                  onClick={toggleMobileMenu} // Close menu on click
                >
                  {link.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  onGetStartedClick();
                  toggleMobileMenu();
                }}
                className={btn({ variant: 'primary', size: 'md', block: true, className: 'shadow-soft' })}
              >
                Get Started
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- HeroSection: Adjusted z-indices for particle layering ---
const HeroSection = React.forwardRef(({ onGetStartedClick }, ref) => (
  // Added relative positioning context for absolute children
  <section ref={ref} className="relative min-h-screen overflow-hidden" id="top">
    {/* Particles layer: Renders conditionally after init */}
    <HeroParticlesLayer />

    {/* Background Gradient: Kept behind particles */}
    <div className="absolute inset-0 -z-30 bg-gradient-to-br from-emerald-100/30 via-emerald-50/10 to-white" />
    {/* Blur Circles: Kept behind particles */}
    <div className="absolute -z-20 -top-1/4 left-1/4 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
    <div className="absolute -z-20 bottom-0 right-0 h-1/2 w-1/2 translate-x-1/3 translate-y-1/4 rounded-full bg-emerald-500/10 blur-3xl" />

    {/* Text Content: Needs a relative z-index higher than particles (z-index: 0 or higher) */}
    <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
      <motion.div initial="hidden" animate="visible" className="text-center">
        <motion.p
          custom={0}
          variants={globalVariants.textStagger}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary"
        >
          Nest Finance
          <span className="hidden h-1.5 w-1.5 rounded-full bg-primary sm:inline-block" />
          Manual-first, insight-rich
        </motion.p>

        <motion.h1
          custom={1}
          variants={globalVariants.textStagger}
          className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
        >
          Your Financial Command Center.
        </motion.h1>

        <motion.p
          custom={2}
          variants={globalVariants.textStagger}
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl"
        >
          Nest Finance is a secure, manual-entry dashboard that puts you in
          complete control. Track your spending, set your goals, and build your
          future—all without linking a bank account.
        </motion.p>

        <motion.div
          custom={3}
          variants={globalVariants.textStagger}
          className="mt-10 flex justify-center"
        >
          <motion.button
            type="button"
            onClick={onGetStartedClick}
            className={btn({ variant: 'primary', size: 'lg', className: 'shadow-glow-primary' })}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            Get Started for Free
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  </section>
));
HeroSection.displayName = 'HeroSection';

// --- IMPROVEMENT ---
// Added a taller bottom padding (pb-32) to give the 3D tile more
// room to animate before the next section.
const HeroVisual = React.forwardRef((_, forwardedRef) => {
  const visualRef = useRef(null);
  const setRefs = useMemo(() => mergeRefs(visualRef, forwardedRef), [forwardedRef]);

  return (
    <section ref={setRefs} className="relative bg-white pb-32">
      <div className="absolute inset-x-0 -top-24 -z-20 h-64 bg-gradient-to-b from-emerald-100/30 to-transparent blur-3xl" />
      {/* --- IMPROVEMENT ---
          This container sets the 3D stage. `perspective` is required
          for its children to have 3D transformations.
      */}
      <div
        className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
        style={{ perspective: '1500px' }}
      >
        <AnimatedDashboardMock scrollRef={visualRef} />
      </div>
    </section>
  );
});
HeroVisual.displayName = 'HeroVisual';

// --- IMPROVEMENT ---
// This is now the single 3D tile.
const AnimatedDashboardMock = ({ scrollRef }) => {
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start end', 'end start'], // Animate as it passes through the viewport
  });

  // --- 3D TILE ANIMATIONS ---
  // Applies the "angle" to the entire component
  const rotateX = useTransform(scrollYProgress, [0.1, 0.7], ['20deg', '-15deg']);
  // Applies the "hover" (zoom) to the entire component
  const scale = useTransform(scrollYProgress, [0.1, 0.5], [0.9, 1]);

  // --- CONTENT SCROLL ANIMATION ---
  // Applies the "y" (vertical) scroll *inside* the frame
  const verticalShift = useTransform(
    scrollYProgress,
    [0.3, 0.9], // Start scrolling the content a bit later
    ['0%', '-40%'] // Scrolls the content up
  );

  return (
    <motion.div
      className="relative mx-auto mt-12 h-[600px] w-full max-w-3xl rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-emerald-200/20"
      style={{
        // --- These transforms apply to the WHOLE component ---
        rotateX,
        scale,
        transformStyle: 'preserve-3d', // Important for 3D
      }}
    >
      {/* Browser Frame (Stays 2D relative to this component) */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 [border-top-left-radius:24px] [border-top-right-radius:24px]">
        <span className="h-3 w-3 rounded-full bg-emerald-400" />
        <span className="h-3 w-3 rounded-full bg-emerald-300" />
        <span className="h-3 w-3 rounded-full bg-emerald-200" />
      </div>

      {/* --- Content Scroller --- */}
      <div className="absolute top-[50px] left-0 h-[calc(100%-50px)] w-full overflow-hidden [border-bottom-left-radius:24px] [border-bottom-right-radius:24px]">
        <motion.div
          className="w-full"
          style={{
            // --- This transform applies ONLY to the content ---
            y: verticalShift,
          }}
        >
          <DashboardPreview />
        </motion.div>
      </div>
    </motion.div>
  );
};

// --- IMPROVEMENT ---
// Reverted to a 2D layout. It will animate its children in as they
// scroll into view *inside* the `AnimatedDashboardMock` frame.
const DashboardPreview = () => (
  <motion.div
    className="flex w-full flex-col gap-6 p-8"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.1 }} // `amount: 0.1` ensures it fires early
    variants={{
      visible: {
        transition: {
          staggerChildren: 0.1,
        },
      },
    }}
  >
    {/* --- Monthly Position Card --- */}
    <motion.div
      className="overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-700 p-6 text-white shadow-lg"
      variants={globalVariants.dashboardItem}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-100/90">
            Monthly position
          </p>
          <p className="mt-2 text-3xl font-semibold">$3,870</p>
          <p className="mt-1 text-sm text-emerald-100/80">
            Projection backed by your manual entries.
          </p>
        </div>
        <div className="rounded-full bg-white/15 px-4 py-2 text-xs uppercase tracking-widest">
          Confidence: High
        </div>
      </div>
    </motion.div>

    {/* --- Grid for Cash Flow & Projection --- */}
    <div className="grid gap-6 md:grid-cols-2">
      {/* --- Cash Flow Card --- */}
      <motion.div
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        variants={globalVariants.dashboardItem}
      >
        <p className="text-xs uppercase tracking-wide text-slate-500">
          Cash Flow Split
        </p>
        <div className="mt-4 flex items-center gap-4">
          <div className="h-24 w-24 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="transform -rotate-90">
              <motion.circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="4"
              />
              <motion.circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#0f766e" // incomeColor
                strokeWidth="4"
                strokeDasharray="100"
                variants={{
                  hidden: { strokeDashoffset: 100 },
                  visible: {
                    strokeDashoffset: 45, // 55%
                    transition: { duration: 1, ease: 'easeOut', delay: 0.5 },
                  },
                }}
              />
            </svg>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Income · $8,240
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Expenses · $4,370
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-200" />
              Savings power · $3,870
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- Projection Card --- */}
      <motion.div
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        variants={globalVariants.dashboardItem}
      >
        <p className="text-xs uppercase tracking-wide text-slate-500">
          Projection
        </p>
        <div className="mt-4 space-y-3 text-xs text-slate-500">
          <div className="flex justify-between">
            <span>Year 1</span>
            <span className="font-semibold text-slate-900">$46,400</span>
          </div>
          <div className="flex justify-between">
            <span>Year 2</span>
            <span className="font-semibold text-slate-900">$98,120</span>
          </div>
          <div className="flex justify-between">
            <span>Year 5</span>
            <span className="font-semibold text-emerald-600">$322,980</span>
          </div>
        </div>
      </motion.div>
    </div>

    {/* --- Goals Grid --- */}
    <div className="grid gap-4 md:grid-cols-3">
      {['Emergency Fund', 'Investments', 'Travel'].map((goal, i) => (
        <motion.div
          key={goal}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          variants={globalVariants.dashboardItem}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {goal}
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">$8,500</p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300"
              variants={{
                hidden: { width: '0%' },
                visible: {
                  width: '66.6%',
                  transition: { duration: 1, ease: 'easeOut', delay: 0.2 * i },
                },
              }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-400">
            3 months ahead of schedule
          </p>
        </motion.div>
      ))}
    </div>

    {/* --- Recent Transactions Card --- */}
    <motion.div
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      variants={globalVariants.dashboardItem}
    >
      <p className="text-xs uppercase tracking-wide text-slate-500">
        Recent transactions
      </p>
      <div className="mt-3 space-y-3 text-sm text-slate-600">
        {[
          ['Rent', '-$1,850', 'Housing'],
          ['Freelance invoice', '+$2,200', 'Income'],
          ['Groceries', '-$140', 'Food'],
        ].map(([label, amount, tag]) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
          >
            <div>
              <p className="font-semibold text-slate-900">{label}</p>
              <p className="text-xs text-slate-400">{tag}</p>
            </div>
            <span
              className={`font-semibold ${
                amount.startsWith('+') ? 'text-emerald-600' : 'text-red-500'
              }`}
            >
              {amount}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  </motion.div>
);

// --- FeaturesSection forwards ref for path calculations ---
const FeaturesSection = React.forwardRef((_, ref) => {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Secure by Design',
      description:
        'We never link to your bank accounts. Your data is 100% manual-entry, private, and secure.',
      id: 'security',
    },
    {
      icon: Target,
      title: 'Track Your Goals',
      description:
        'Create, fund, and track your financial goals, from an emergency fund to a vacation.',
      id: 'features',
    },
    {
      icon: TrendingUp,
      title: 'Project Your Future',
      description:
        'Use our built-in projection tools to see how your savings can grow over time.',
      id: 'about',
    },
  ];

  return (
    <section ref={ref} id="features-anchor" className="relative bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to own your finances.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Nest Finance combines secure manual entry with projection tools so
            you can make confident decisions.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCardVine
              key={feature.title}
              className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <motion.article
                id={feature.id}
                className="h-full"
                variants={globalVariants.featureCard}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.6,
                  ease: 'easeOut',
                  delay: index * 0.1,
                }}
              >
                <feature.icon
                  className="h-10 w-10 text-emerald-600"
                  aria-hidden
                />
                <h3 className="mt-6 text-xl font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </motion.article>
            </FeatureCardVine>
          ))}
        </div>
      </div>
    </section>
  );
});
FeaturesSection.displayName = 'FeaturesSection';

// --- TestimonialsSection forwards ref for path calculations ---
const TestimonialsSection = React.forwardRef((_, ref) => {
  const testimonials = [
    {
      name: 'Sarah K.',
      role: 'Freelance Designer',
      quote:
        'Nest Finance gave me clarity. I finally feel in control of my variable income and can confidently plan for my goals.',
    },
    {
      name: 'Michael T.',
      role: 'Software Engineer',
      quote:
        "I love that it doesn't link to my bank. Manual entry makes me conscious of every dollar I spend. It's a game-changer.",
    },
    {
      name: 'Alex & Jamie',
      role: 'Household Planners',
      quote:
        "This is the only app we found that lets us manage our finances *together* without the complexity. The projections are our favorite part.",
    },
  ];

  return (
    <section
      id="testimonials"
      ref={ref}
      className="relative bg-emerald-50/70 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Trusted by users who value control.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            See what our users are saying about their new-found financial
            clarity.
          </p>
        </div>
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <FeatureCardVine
              key={index}
              className="flex flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <motion.div
                className="flex h-full flex-col"
                variants={globalVariants.featureCard}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.6,
                  ease: 'easeOut',
                  delay: index * 0.1,
                }}
              >
                <div className="flex-1">
                  <p className="text-lg leading-relaxed text-slate-700">
                    "{testimonial.quote}"
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-slate-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            </FeatureCardVine>
          ))}
        </div>
      </div>
    </section>
  );
});
TestimonialsSection.displayName = 'TestimonialsSection';

// --- FinalCTASection forwards ref for path calculations ---
const FinalCTASection = React.forwardRef(({ onGetStartedClick }, ref) => {
  const finalCtaCardClassName = card({
    variant: 'glass',
    padding: 'lg',
    className:
      'relative isolate mx-auto max-w-4xl text-center text-text-on-dark shadow-glow-primary border border-primary/40',
  });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24 text-text-on-dark"
    >
      <div className="absolute inset-0 -z-30 bg-[linear-gradient(140deg,_rgb(var(--color-primary-rgb)/0.75)_0%,_rgb(var(--color-primary-soft-rgb)/0.55)_45%,_rgb(var(--color-background-rgb)/0.75)_100%)]" />
      <div className="absolute inset-0 -z-20 animate-pulse bg-[radial-gradient(circle_at_top,_rgb(var(--color-primary-rgb)/0.32),_transparent_60%)]" />
      <div className="absolute inset-0 -z-10 animate-pulse [animation-delay:-2s] bg-[radial-gradient(circle_at_bottom_left,_rgb(var(--color-primary-soft-rgb)/0.24),_transparent_55%)]" />

      <div className="relative z-10 px-4 sm:px-6 lg:px-8">
        <div className={finalCtaCardClassName}>
          <motion.h2
            className="text-3xl font-semibold sm:text-4xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={globalVariants.fadeInUp}
          >
            Ready to build your nest?
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-text-on-dark/80"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={{
              ...globalVariants.fadeInUp,
              visible: {
                ...globalVariants.fadeInUp.visible,
                transition: { ...globalVariants.fadeInUp.visible.transition, delay: 0.1 },
              },
            }}
          >
            Take the first step toward financial clarity. It&apos;s free to start.
          </motion.p>
          <motion.div
            className="mt-8 flex justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={{
              ...globalVariants.fadeInUp,
              visible: {
                ...globalVariants.fadeInUp.visible,
                transition: { ...globalVariants.fadeInUp.visible.transition, delay: 0.2 },
              },
            }}
          >
            <motion.button
              type="button"
              onClick={onGetStartedClick}
              className={btn({ variant: 'secondary', size: 'lg', className: 'shadow-glow-primary backdrop-blur-sm' })}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              Get Started for Free
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
});
FinalCTASection.displayName = 'FinalCTASection';

// --- No changes to Footer ---
const Footer = () => (
  <footer className="bg-slate-900 py-16 text-slate-400">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="text-center md:text-left">
          <p className="text-lg font-semibold text-white">Nest Finance</p>
          <p className="mt-1 text-sm">Your Financial Command Center.</p>
        </div>
        <nav className="flex gap-6 text-sm font-medium">
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <a href="#security" className="transition hover:text-white">
            Security
          </a>
          <a href="#testimonials" className="transition hover:text-white">
            Testimonials
          </a>
        </nav>
      </div>
      <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm">
        © 2025 Nest Finance. All rights reserved.
      </div>
    </div>
  </footer>
);

export default NestFinanceLandingPage;
