import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, EyeOff, FileKey, Users } from 'lucide-react';
import TopNav from '../components/TopNav';
import Starfield from '../components/experience/Starfield';

const PILLARS = [
  {
    key: 'vault',
    title: 'The Vault',
    subtitle: 'Bank-Grade Protection',
    body:
      'We use AES-256 encryption; the same standard used by major banks and governments; to lock your data the moment it enters our systems. TLS 1.3 for transit and automatic key rotation keep information unreadable to anyone but you.',
    icon: ShieldCheck,
  },
  {
    key: 'guard',
    title: 'The Guard',
    subtitle: 'Read-Only Access',
    body:
      'Connections are routed through regulated Open Banking rails and are strictly read-only. Nest can surface insights, but it can never move money; we leave that power in your hands.',
    icon: EyeOff,
  },
  {
    key: 'privacy',
    title: 'The Privacy',
    subtitle: 'Data Ethics',
    body:
      'We never sell your data. Zero-knowledge spaces keep private family notes safe, and exporting or deleting everything is instant whenever you decide to leave.',
    icon: FileKey,
  },
  {
    key: 'circle',
    title: 'The Family Circle',
    subtitle: 'Safe Collaboration',
    body:
      'Households decide what is visible to whom; partners, parents, teens. Granular permissions let you celebrate progress while keeping the details you choose to keep private.',
    icon: Users,
  },
];

const TRUST_BADGES = [
  'Regulated by the FCA',
  'GDPR Compliant',
  'AES-256 Encrypted',
  'ISO 27001 Certified',
];

export default function SecurityPage({ onNavigate }) {
  return (
    <div className="relative min-h-screen bg-slate-950 text-text-primary overflow-hidden">
      <TopNav onNavigate={onNavigate} />

      <div className="absolute inset-0 z-0">
        <Starfield density={1800} speed={0.6} reducedMotion={false} />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950 pointer-events-none" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-screen-2xl flex-col items-center justify-center px-4 py-24 md:px-12">
        <motion.div
          className="flex flex-col items-center text-center space-y-6 max-w-4xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-b from-emerald-400/80 via-emerald-400/40 to-transparent shadow-[0_0_40px_rgba(16,185,129,0.6)]">
            <ShieldCheck className="text-white" size={48} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-emerald-200/80">
              Security Pillars
            </p>
            <h1 className="font-display text-4xl font-semibold leading-tight text-white md:text-7xl">
              Security at Nest
              <br />
              Your Money. Your Data. Protected.
            </h1>
          </div>
          <p className="text-lg leading-relaxed text-slate-200">
            We treat your financial life with the same care we would want for our own families. Security isn't a feature; it is the foundation of everything we build.
          </p>
        </motion.div>

        <div className="mt-16 grid w-full gap-6 md:grid-cols-2">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.key}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-[rgba(15,23,42,0.45)] p-8 backdrop-blur-[24px] shadow-[0_15px_50px_rgba(0,0,0,0.45)] transition hover:border-white/20 hover:bg-[rgba(15,23,42,0.55)]"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                {pillar.key === 'vault' && (
                  <div className="absolute inset-x-4 -top-1 h-[1px] bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.9)] opacity-70 animate-scan" />
                )}
                <div className="relative space-y-4">
                  <div className="flex items-center gap-3">
                    <Icon
                      size={32}
                      className="text-emerald-300 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                    />
                    <span className="text-xs uppercase tracking-[0.4em] text-emerald-200/80">
                      {pillar.subtitle}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-white">
                    {pillar.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-300">{pillar.body}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="mt-14 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          {TRUST_BADGES.map((badge) => (
            <div
              key={badge}
              className="flex min-w-[180px] items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.4em] text-slate-300 transition hover:border-white/30 hover:text-white"
            >
              {badge}
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
