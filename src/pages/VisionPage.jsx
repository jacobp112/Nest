import React, { useRef } from 'react';
import { motion, useSpring, useMotionValue, useMotionTemplate, useTransform, useScroll } from 'framer-motion';
import { MessageCircle, Scale, Sparkles, ArrowRight, DraftingCompass, Home, TrendingUp, Users, Check, X, Zap, Target, Heart, ShieldCheck } from 'lucide-react';
import TopNav from '../components/TopNav';
import Starfield from '../components/experience/Starfield';

// --- Engineer's Grid Background ---
const GridPattern = () => (
  <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,#020617,transparent)]"></div>
  </div>
);

// --- Vision Card with Spotlight ---
const VisionCard = ({ title, subtitle, description, icon: Icon, delay }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const spotlight = useMotionTemplate`radial-gradient(
    650px circle at ${mouseX}px ${mouseY}px,
    rgba(16, 185, 129, 0.1),
    transparent 80%
  )`;

  return (
    <motion.div
      className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 p-8 backdrop-blur-md shadow-2xl transition-all duration-500 hover:border-emerald-500/30 hover:bg-slate-900/60"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      onMouseMove={handleMouseMove}
    >
      {/* Spotlight Layer */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{ background: spotlight }}
      />

      <div className="relative space-y-4 z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
            <Icon size={24} />
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-emerald-200/60 font-semibold">
            {subtitle}
          </span>
        </div>

        <h3 className="font-display text-2xl font-bold text-white group-hover:text-emerald-100 transition-colors">
          {title}
        </h3>

        <p className="text-sm leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

// --- Archetype Card ---
const ArchetypeCard = ({ title, role, focus, dashboard, icon: Icon, color, delay }) => {
  const baseColor = color.replace('bg-', '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.7, ease: "backOut" }}
      whileHover={{ y: -10 }}
      className="relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 hover:from-white/20 hover:to-white/5 transition-all duration-300 group"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />

      <div className="relative h-full p-6 rounded-[20px] bg-slate-950/90 backdrop-blur-xl border border-white/5 overflow-hidden">
        {/* Ambient Glow */}
        <div className={`absolute -top-20 -right-20 w-40 h-40 ${color} opacity-20 blur-[60px] group-hover:opacity-40 transition-opacity duration-500`} />

        <div className={`w-14 h-14 rounded-2xl ${color} bg-opacity-10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/10`}>
          <Icon size={28} className={color.replace('bg-', 'text-').replace('500', '400')} />
        </div>

        <h3 className="text-2xl font-display font-bold text-white mb-1">{title}</h3>
        <p className={`text-xs uppercase tracking-wider font-bold mb-6 ${color.replace('bg-', 'text-').replace('500', '400')}`}>{role}</p>

        <div className="space-y-4 relative z-10">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-semibold">Focus</p>
            <p className="text-sm text-slate-300 leading-snug">{focus}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-semibold">Dashboard</p>
            <p className="text-sm text-slate-300 leading-snug">{dashboard}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Magnetic CTA Button ---
const MagneticButton = ({ text, onClick }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const ySpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * 0.3);
    y.set((clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="group relative inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 text-slate-950 font-bold rounded-full text-sm tracking-widest uppercase hover:bg-emerald-400 transition-colors shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)]"
    >
      <span>{text}</span>
      <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
    </motion.button>
  );
};

export default function VisionPage({ onNavigate }) {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-emerald-500/30">
      <TopNav onNavigate={onNavigate} />

      {/* Background - Aligned with Security */}
      <div className="absolute inset-0 z-0 fixed">
        <GridPattern />
        <Starfield density={1500} speed={0.5} reducedMotion={false} />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950 pointer-events-none" />
      </div>

      <main className="relative z-10 mx-auto flex flex-col items-center px-4 py-24 md:px-12 max-w-[1400px]">

        {/* Header */}
        <motion.div
          style={{ opacity, scale }}
          className="flex flex-col items-center text-center space-y-8 max-w-4xl mb-40 pt-10"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/30 blur-[60px] rounded-full" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-b from-emerald-400/20 to-transparent border border-emerald-500/20 backdrop-blur-sm shadow-2xl">
              <Sparkles className="text-emerald-400" size={48} />
            </div>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-emerald-400 font-bold mb-4">
              Our Mission
            </p>
            <h1 className="font-display text-4xl md:text-7xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50">
              The Vision of Nest
            </h1>
            <p className="text-2xl md:text-3xl text-slate-400 font-light mt-4">
              Empowerment Built Together.
            </p>
          </div>

          <p className="text-lg md:text-xl leading-relaxed text-slate-300 max-w-2xl font-light">
            At Nest, we believe money should never be a source of silence.
            Whether a household earns £12k or £300k, every family deserves the chance to build a future they can be proud of.
          </p>
        </motion.div>

        {/* Section 2: Our Approach */}
        <div className="w-full mb-40">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
              <Target size={14} /> Our Approach
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Built Around You, Not the Average User</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Most financial apps treat everyone the same. Nest rejects the one-size-fits-all template. We built our platform around <span className="text-white font-bold">Archetypes</span> – dynamic profiles that adapt your entire experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            <ArchetypeCard
              title="The Architect"
              role="The Wealth Builder"
              focus="Investments, tax efficiency, asset allocation."
              dashboard="Performance, ISA optimisation, CGT efficiency."
              icon={DraftingCompass}
              color="bg-indigo-500"
              delay={0.1}
            />
            <ArchetypeCard
              title="The Steward"
              role="The Asset Manager"
              focus="Home equity, mortgages, renovations, rental yields."
              dashboard="LTV health, equity progression, renovation ROI."
              icon={Home}
              color="bg-emerald-500"
              delay={0.2}
            />
            <ArchetypeCard
              title="The Ascender"
              role="The Fighter"
              focus="Debt payoff, interest savings, freedom date."
              dashboard="Payoff strategy, timeline acceleration, lifestyle boosts."
              icon={TrendingUp}
              color="bg-rose-500"
              delay={0.3}
            />
            <ArchetypeCard
              title="The Collaborator"
              role="The Heart"
              focus="Fairness, shared decisions, goals, transparency."
              dashboard="Shared expenses, proposals, contributions."
              icon={Users}
              color="bg-amber-500"
              delay={0.4}
            />
          </div>
        </div>

        {/* Section 3: Why It Matters */}
        <div className="w-full max-w-7xl mb-40 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center px-4">
          <div>
            <h3 className="text-4xl font-display font-bold text-white mb-8">Why Archetypes Matter</h3>
            <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
              <p>
                A household isn’t one person. It’s a system. And that system works best when every role is recognised, every contribution counts, and every journey is personal.
              </p>
              <p>
                Archetypes let households understand each other better. They bring empathy into money. They create structure where chaos used to be.
              </p>
            </div>

            <div className="mt-10 flex gap-4">
              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/5 min-w-[120px]">
                <span className="text-3xl font-bold text-white">4</span>
                <span className="text-xs uppercase tracking-wider text-slate-500">Unique<br />Archetypes</span>
              </div>
              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/5 min-w-[120px]">
                <span className="text-3xl font-bold text-white">100%</span>
                <span className="text-xs uppercase tracking-wider text-slate-500">Adaptive<br />Experience</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-[32px] opacity-20 blur-xl" />
            <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-[30px] p-8 border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/10">
                <h4 className="font-bold text-xl text-white">Why Other Apps Can't Do This</h4>
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Comparison
                </div>
              </div>

              <div className="space-y-5">
                {[
                  { text: "Built for individuals, not households", check: false },
                  { text: "Shallow behavioural modelling", check: false },
                  { text: "Focused on budgets, not roles", check: false },
                  { text: "Based on averages, not people", check: false },
                  { text: "Nest understands your role and context", check: true },
                  { text: "Evolves with you as you grow", check: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${item.check ? 'bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-rose-500/10 text-rose-500/50'}`}>
                      {item.check ? <Check size={16} /> : <X size={16} />}
                    </div>
                    <span className={`text-base ${item.check ? 'text-white font-medium' : 'text-slate-500'}`}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Vision Pillars (Original) */}
        <div className="w-full max-w-6xl mb-40 px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-display font-bold text-white">Core Principles</h3>
            <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-transparent mx-auto mt-6 rounded-full" />
          </div>
          <div className="grid w-full gap-8 md:grid-cols-2">
            <VisionCard
              title="A Shared Journey"
              subtitle="Breaking the Silence"
              icon={MessageCircle}
              delay={0.1}
              description="We are building a platform that replaces fear with understanding and isolation with teamwork. We give families the tools to talk about money honestly; clearing the air for a better future."
            />

            <VisionCard
              title="Fair Pricing"
              subtitle="Smart Technology"
              icon={Scale}
              delay={0.3}
              description="Financial stability is a right, not a privilege. Our smart technology ensures pricing is fair, not flat. Free for those in need, and a standard subscription for those with means to sustain the community."
            />
          </div>
        </div>

        {/* CTA Footer */}
        <motion.div
          className="flex flex-col items-center justify-center gap-8 text-center px-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 tracking-tight">Your Nest. Your Role.<br />Your Journey.</h2>
          <p className="text-slate-400 max-w-xl mb-8 text-lg">
            Whether you’re building wealth, managing property, fighting debt, or running the household – Nest gives you a personalised experience that respects your starting point.
          </p>
          <MagneticButton text="Join Our Family" onClick={() => onNavigate('register')} />
          <p className="text-xs uppercase tracking-[0.2em] text-slate-600 font-bold">
            Start your journey today
          </p>
        </motion.div>
      </main>
    </div>
  );
}