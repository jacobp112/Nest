import React from 'react';
import { motion } from 'framer-motion';
import { User, Zap, HeartHandshake, Crown, Check, Sparkles, Clock } from 'lucide-react';
import TopNav from '../components/TopNav';
import Starfield from '../components/experience/Starfield';

const WAITLIST_SUBTEXT =
  'We only send one welcome email plus launch-day priority instructions.';

const PLAN_CONTEXT_MAP = {
  'solo-free': {
    heroText: 'Reserving your Solo Basic seat.',
    subtext: WAITLIST_SUBTEXT,
    velvetText: 'Secure your Founding Member rate.',
  },
  'solo-paid': {
    heroText: 'Reserving your Solo Plus seat.',
    subtext: WAITLIST_SUBTEXT,
    velvetText: 'Secure your Founding Member rate.',
  },
  partners: {
    heroText: 'Reserving your Partner Seat.',
    subtext: WAITLIST_SUBTEXT,
    velvetText: 'Secure your Founding Member rate.',
  },
  family: {
    heroText: 'Reserving your Family Access.',
    subtext: WAITLIST_SUBTEXT,
    velvetText: 'Secure your Founding Member rate.',
  },
};

const PLANS = [
  {
    key: 'solo-free',
    name: 'Solo Basic',
    price: '£0',
    period: '/ forever',
    description: 'Manual tracking for the mindful individual.',
    icon: User,
    features: [
      'Manual transaction entry',
      'Basic monthly budgeting',
      '1 Custom Category Group',
      '7-day data retention',
    ],
    cta: 'Join Free Waitlist',
    highlight: false,
  },
  {
    key: 'solo-paid',
    name: 'Solo Plus',
    price: '£4.99',
    period: '/ month',
    description: 'Automated clarity for your personal wealth.',
    icon: Zap,
    features: [
      'Unlimited Bank Sync (Open Banking)',
      'Automated categorization',
      'Net Worth tracking',
      'Unlimited history',
    ],
    cta: 'Reserve Plus Access',
    highlight: false,
  },
  {
    key: 'partners',
    name: 'Partners',
    price: '£8.99',
    period: '/ month',
    description: 'Shared visibility without losing autonomy.',
    icon: HeartHandshake,
    features: [
      'Everything in Solo Plus',
      '2 User Accounts',
      'Shared "Joint" Spaces',
      'Private "Personal" Spaces',
      'Couple’s Goal Tracking',
    ],
    cta: 'Reserve Partner Access',
    highlight: true,
    badge: 'High Demand',
  },
  {
    key: 'family',
    name: 'Family',
    price: '£12.99',
    period: '/ month',
    description: 'Financial literacy for the whole home.',
    icon: Crown,
    features: [
      'Everything in Partners',
      'Up to 6 User Accounts',
      'Kids & Teen Views (Read-only)',
      'Allowance & Chore Tracking',
      'Legacy & Estate Planning Vault',
    ],
    cta: 'Reserve Family Access',
    highlight: false,
  },
];

export default function PricingPage({ onNavigate }) {

  const handlePlanSelection = (planKey) => {
    onNavigate('experience', { plan: planKey });
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      <TopNav onNavigate={onNavigate} />

      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <Starfield density={1500} speed={0.5} reducedMotion={false} />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950 pointer-events-none" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-screen-2xl flex-col items-center justify-center px-4 py-24 md:px-12">

        {/* Hero Header */}
        <motion.div
          className="flex flex-col items-center text-center space-y-6 max-w-4xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-b from-emerald-400/80 via-emerald-400/40 to-transparent shadow-[0_0_40px_rgba(16,185,129,0.6)]">
            <Clock className="text-white" size={40} />
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-emerald-200/80">
              Early Access
            </p>
            <h1 className="font-display text-4xl font-semibold leading-tight text-white md:text-7xl mt-2">
              Reserve your spot.
              <br />
              <span className="text-slate-400">Lock in your pricing.</span>
            </h1>
          </div>

          <p className="text-lg leading-relaxed text-slate-200 max-w-2xl">
            We are currently accepting a limited number of founding members.
            Select your preferred plan below to fast-track your invitation and secure these launch rates for life.
          </p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="mt-16 grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((plan, index) => {
            const Icon = plan.icon;
            const isHighlighted = plan.highlight;

            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border p-6 backdrop-blur-[24px] transition-all duration-500
                  ${isHighlighted
                    ? 'bg-emerald-950/30 border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.15)] hover:border-emerald-400'
                    : 'bg-[rgba(15,23,42,0.45)] border-white/10 hover:border-white/20 hover:bg-[rgba(15,23,42,0.55)]'
                  }
                `}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute top-0 right-0 rounded-bl-2xl bg-emerald-500 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-950">
                    {plan.badge}
                  </div>
                )}

                <div>
                  {/* Card Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2.5 rounded-xl ${isHighlighted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-slate-400'}`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="font-display text-xl font-bold text-white">
                      {plan.name}
                    </h3>
                  </div>

                  {/* Price Display */}
                  <div className="mb-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white tracking-tight">{plan.price}</span>
                    <span className="text-sm text-slate-400 font-medium">{plan.period}</span>
                  </div>

                  <p className="text-sm text-slate-400 leading-relaxed mb-8 min-h-[40px]">
                    {plan.description}
                  </p>

                  <div className={`h-px w-full mb-8 ${isHighlighted ? 'bg-emerald-500/20' : 'bg-white/10'}`} />

                  {/* Feature List */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                        <Check
                          size={16}
                          className={`mt-0.5 shrink-0 ${isHighlighted ? 'text-emerald-400' : 'text-slate-500'}`}
                        />
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handlePlanSelection(plan.key)}
                  className={`w-full rounded-xl py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300
                    ${isHighlighted
                      ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                      : 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20'
                    }
                  `}
                >
                  {plan.cta}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Note */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            No credit card required for waitlist
          </p>
        </motion.div>

      </main>
    </div>
  );
}
