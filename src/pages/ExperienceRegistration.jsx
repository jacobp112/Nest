import React, { Suspense, lazy, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const LazyNestCanvas = lazy(() => import('../components/experience/NestExperienceCanvas.jsx'));

const VALUE_PROPS = [
  {
    id: 'aggregation',
    title: 'First, we connect everything',
    subtitle: 'Secure bank-level aggregation pulls in every account, card, loan, and pocketed savings so nothing is lost in the shuffle.',
  },
  {
    id: 'insights',
    title: 'Then, our AI finds insights',
    subtitle: 'Threads of cash flow, spending spikes, and goal gaps surface automatically so you focus on decisions, not detective work.',
  },
  {
    id: 'collaboration',
    title: 'Finally, you work together',
    subtitle: 'Shared rituals, nudges, and accountability keep partners and co-parents flying in formation instead of fighting the current.',
  },
];

const NEST_POSTER =
  'data:image/svg+xml;utf8,<svg width="900" height="600" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="a" cx="50%" cy="45%" r="65%"><stop stop-color="%230ea5e9" offset="0%"/><stop stop-color="%2301111c" offset="100%"/></radialGradient></defs><rect width="900" height="600" fill="%2301111c"/><circle cx="450" cy="300" r="230" fill="url(%23a)" opacity="0.55"/><path d="M200 300 Q450 120 700 300" stroke="%23fef3c7" stroke-width="6" fill="none" opacity="0.4"/><path d="M200 320 Q450 500 700 320" stroke="%236ee7b7" stroke-width="4" fill="none" opacity="0.35"/><text x="50%" y="70%" fill="%23e2e8f0" font-family="Segoe UI" font-size="36" text-anchor="middle">Nest Preview</text></svg>';

const householdFocusOptions = ['Get on the same page weekly', 'Plan major purchases calmly', 'Pay off debt together', 'Grow generational wealth'];

const motionFade = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

function CanvasPoster() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-950">
      <img src={NEST_POSTER} alt="Nest preview artwork" className="h-auto max-h-[80vh] w-[90vw] max-w-4xl rounded-3xl border border-white/10 shadow-2xl" />
    </div>
  );
}

function ActOneHero() {
  return (
    <section className="flex h-screen flex-col items-center justify-center gap-8 px-6 text-center md:px-12">
      <motion.p className="text-xs font-semibold uppercase tracking-[0.45em] text-emerald-200/80" {...motionFade} transition={{ duration: 0.8 }}>
        Act I · The Problem
      </motion.p>
      <motion.h1
        className="text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1 }}
      >
        Your family&apos;s finances. It&apos;s... complicated.
      </motion.h1>
      <motion.p className="max-w-2xl text-base text-slate-200/80 sm:text-lg" {...motionFade} transition={{ duration: 0.9, delay: 0.2 }}>
        Hidden subscriptions. Rogue cards. Spreadsheets that only one of you speaks. Nest steps in with calm choreography so the whole household can finally breathe.
      </motion.p>
    </section>
  );
}

function ActTwoValueProps({ mode = 'static', scrollProgress = 0 }) {
  const opacities = useMemo(() => {
    if (mode !== 'immersive') {
      return VALUE_PROPS.map((_, idx) => 1 - idx * 0.15);
    }
    return VALUE_PROPS.map((_, idx) => {
      const slice = 0.18 + idx * 0.15;
      const start = slice;
      const mid = slice + 0.08;
      const end = slice + 0.16;
      if (scrollProgress <= start || scrollProgress >= end) return 0;
      if (scrollProgress <= mid) {
        return (scrollProgress - start) / (mid - start + 1e-6);
      }
      return (end - scrollProgress) / (end - mid + 1e-6);
    });
  }, [mode, scrollProgress]);

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden px-6 text-left">
      <div className="pointer-events-none relative h-[60vh] w-full max-w-3xl">
        {VALUE_PROPS.map((block, idx) => (
          <div
            key={block.id}
            className="absolute inset-0 flex flex-col justify-center rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-[0_25px_80px_rgba(15,118,110,0.3)] backdrop-blur md:p-10"
            style={{
              opacity: opacities[idx],
              transform: `translateY(${(idx - 1) * 24}px)`,
              zIndex: 10 - idx,
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200/70">Act II · Windows of clarity</p>
            <h3 className="mt-4 text-2xl font-semibold text-white md:text-3xl">{block.title}</h3>
            <p className="mt-3 text-base text-slate-200/80">{block.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ActThreeIntro() {
  return (
    <section className="flex h-screen flex-col justify-center gap-6 px-6 md:px-16">
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200/70">Act III · The Conversion</p>
      <h2 className="text-4xl font-semibold text-white sm:text-5xl">The nest is almost ready. Claim your branch.</h2>
      <p className="max-w-2xl text-lg text-slate-200/85">
        Curated onboarding waves mean seats are scarce. Register your interest with one tap, then share a collaborative savings plan to prove you&apos;re serious about building wealth together.
      </p>
    </section>
  );
}

function CollaborativeSavingsCalculator() {
  const [goalAmount, setGoalAmount] = useState(18000);
  const [yourMonthly, setYourMonthly] = useState(450);
  const [partnerMonthly, setPartnerMonthly] = useState(350);

  const { soloMonths, togetherMonths } = useMemo(() => {
    const solo = Math.ceil(Math.max(goalAmount, 0) / Math.max(1, yourMonthly));
    const together = Math.ceil(Math.max(goalAmount, 0) / Math.max(1, yourMonthly + partnerMonthly));
    return {
      soloMonths: solo,
      togetherMonths: together,
    };
  }, [goalAmount, yourMonthly, partnerMonthly]);

  const savingsBoost = Math.max(0, soloMonths - togetherMonths);

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-[0_35px_100px_rgba(15,118,110,0.35)] backdrop-blur md:p-10">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200/70">Soft CTA · Lead capture</p>
        <h3 className="text-2xl font-semibold text-white md:text-3xl">Collaborative savings calculator</h3>
        <p className="text-base text-slate-200/80">
          Plug in your goal and monthly contributions to see how much faster the two of you can land it.
        </p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <label className="flex flex-col gap-2 text-sm text-slate-200/80">
          Goal amount
          <input
            type="number"
            min={500}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-emerald-300/60 focus:outline-none"
            value={goalAmount}
            onChange={(e) => setGoalAmount(Number(e.target.value))}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-200/80">
          Your monthly savings
          <input
            type="number"
            min={0}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-emerald-300/60 focus:outline-none"
            value={yourMonthly}
            onChange={(e) => setYourMonthly(Number(e.target.value))}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-200/80">
          Partner&apos;s monthly savings
          <input
            type="number"
            min={0}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-emerald-300/60 focus:outline-none"
            value={partnerMonthly}
            onChange={(e) => setPartnerMonthly(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-200/60">Saving alone</p>
          <p className="mt-2 text-4xl font-semibold text-white">{soloMonths} months</p>
          <p className="mt-1 text-sm text-slate-200/70">Staying the solo route keeps the journey long.</p>
        </div>
        <div className="rounded-2xl border border-emerald-300/30 bg-emerald-400/10 p-6 shadow-[0_0_40px_rgba(52,211,153,0.3)]">
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-200/80">Saving together</p>
          <p className="mt-2 text-4xl font-semibold text-emerald-100">{togetherMonths} months</p>
          <p className="mt-1 text-sm text-emerald-100/80">
            Teaming up pulls your landing date forward by <span className="font-semibold">{savingsBoost} months</span>.
          </p>
        </div>
      </div>
    </div>
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

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-6 shadow-[0_35px_100px_rgba(15,118,110,0.35)] backdrop-blur md:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200/80">Register your interest</p>
      <h3 className="mt-2 text-3xl font-semibold text-white">Progressive disclosure keeps things calm.</h3>
      <p className="mt-3 text-base text-slate-200/80">
        Step 1 collects your best contact so we can hold a spot. Step 2 gives us context so the private beta feels handcrafted for you.
      </p>
      <div className="mt-8 flex flex-col gap-6">
        {formStep === 1 ? (
          <form
            className="flex flex-col gap-4 md:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              if (!disableStepOne) onStepOne();
            }}
          >
            <label className="flex-1 text-sm text-slate-200/80">
              Email address
              <input
                type="email"
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-emerald-300/60 focus:outline-none"
                value={formData.email}
                onChange={(e) => onFieldChange('email', e.target.value)}
              />
            </label>
            <button
              type="submit"
              className="rounded-2xl bg-emerald-400 px-6 py-3 text-base font-semibold text-emerald-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-emerald-700/40 disabled:text-emerald-100/60"
              disabled={disableStepOne}
            >
              {loading ? 'Saving...' : 'Register'}
            </button>
          </form>
        ) : (
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (!disableFinal) onSubmit();
            }}
          >
            <label className="text-sm text-slate-200/80">
              Preferred name
              <input
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-emerald-300/60 focus:outline-none"
                value={formData.name}
                onChange={(e) => onFieldChange('name', e.target.value)}
                required
              />
            </label>
            <label className="text-sm text-slate-200/80">
              Partner email
              <input
                type="email"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-emerald-300/60 focus:outline-none"
                value={formData.partnerEmail}
                onChange={(e) => onFieldChange('partnerEmail', e.target.value)}
                required
              />
            </label>
            <label className="md:col-span-2 text-sm text-slate-200/80">
              What&apos;s your collaborative focus?
              <select
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-emerald-300/60 focus:outline-none"
                value={formData.householdFocus}
                onChange={(e) => onFieldChange('householdFocus', e.target.value)}
              >
                {householdFocusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <div className="md:col-span-2 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="rounded-2xl bg-emerald-400 px-6 py-3 text-base font-semibold text-emerald-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-emerald-700/40 disabled:text-emerald-100/60"
                disabled={disableFinal}
              >
                {loading ? 'Submitting...' : 'Send my profile'}
              </button>
              <p className="text-xs text-slate-300/80">Your data is encrypted at rest and in transit.</p>
            </div>
          </form>
        )}
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200/80">
          <p className="font-semibold text-white">Join 5,000+ families already on the waitlist.</p>
          <p className="mt-1 text-slate-200/70">We only send one welcome email plus launch-day priority instructions.</p>
        </div>
      </div>
    </div>
  );
}

function ThankYouPanel({ referralCopied, onCopy }) {
  return (
    <div className="rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-6 shadow-[0_35px_80px_rgba(16,185,129,0.35)] backdrop-blur md:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200/80">Post-conversion · Viral loop</p>
      <h3 className="mt-2 text-3xl font-semibold text-white">You&apos;re on the manifest.</h3>
      <p className="mt-3 text-base text-emerald-50/80">Your Nest needs a partner. Invite them to join the waitlist with you?</p>
      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <button
          type="button"
          onClick={onCopy}
          className="rounded-2xl bg-white px-6 py-3 text-base font-semibold text-emerald-900 transition hover:bg-emerald-100"
        >
          {referralCopied ? 'Link copied!' : 'Copy referral link'}
        </button>
        <p className="text-xs text-emerald-50/70">Partners who join from your link skip the next waitlist wave.</p>
      </div>
    </div>
  );
}

function ScrollStory({
  mode,
  scrollProgress,
  formStep,
  loading,
  error,
  formData,
  onFieldChange,
  onStepOne,
  onSubmit,
  isSubmitted,
  referralCopied,
  onCopyReferral,
}) {
  return (
    <div className="pointer-events-auto w-full text-slate-50">
      <ActOneHero />
      <ActTwoValueProps mode={mode} scrollProgress={scrollProgress} />
      <ActThreeIntro />
      <section className="min-h-screen bg-gradient-to-b from-slate-950/0 to-slate-950/80 px-6 py-24 md:px-16">
        <CollaborativeSavingsCalculator />
      </section>
      <section className="min-h-screen bg-slate-950/90 px-6 py-24 md:px-16">
        {isSubmitted ? (
          <ThankYouPanel referralCopied={referralCopied} onCopy={onCopyReferral} />
        ) : (
          <RegisterInterestForm
            formStep={formStep}
            loading={loading}
            error={error}
            formData={formData}
            onFieldChange={onFieldChange}
            onStepOne={onStepOne}
            onSubmit={onSubmit}
          />
        )}
      </section>
    </div>
  );
}

function FallbackExperience(props) {
  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-950/80 to-black">
      <ScrollStory {...props} mode="static" />
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
  const [scrollProgress, setScrollProgress] = useState(0);

  const prefersReducedMotion = useReducedMotion();
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '200px' });

  const shouldRenderCanvas = inView && !prefersReducedMotion;

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

  const storyProps = {
    scrollProgress,
    formStep,
    loading,
    error,
    formData,
    onFieldChange: handleFieldChange,
    onStepOne: handleStepOne,
    onSubmit: handleSubmit,
    isSubmitted,
    referralCopied,
    onCopyReferral: handleCopyReferral,
  };

  return (
    <div ref={ref} className="relative min-h-screen bg-slate-950 text-slate-50">
      {shouldRenderCanvas ? (
        <Suspense fallback={<CanvasPoster />}>
          <LazyNestCanvas pages={5.6} onScrollProgress={setScrollProgress}>
            <ScrollStory mode="immersive" {...storyProps} />
          </LazyNestCanvas>
        </Suspense>
      ) : (
        <FallbackExperience {...storyProps} />
      )}
    </div>
  );
}
