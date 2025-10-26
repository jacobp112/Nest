import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Check } from 'lucide-react';

const buttonClasses =
  'inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', when: 'beforeChildren', staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const reassurancePoints = [
  {
    title: 'Secure & regulated',
    copy:
      'We use Open Banking, a secure, UK-regulated technology. Our partner aggregator is authorised by the Financial Conduct Authority (FCA).',
  },
  {
    title: 'You stay in control',
    copy:
      'You choose which accounts to share. You can revoke access at any time from Nest Finance or directly with your bank.',
  },
  {
    title: 'Read-only access',
    copy:
      'We only request permission to view balances and transactions. We never see your login credentials and cannot move money.',
  },
];

const OpenBankingConsentScreen = ({ onConsent = () => {} }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-4xl rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-slate-900/40 backdrop-blur-lg sm:p-10 lg:p-12"
      >
        <motion.header className="text-center" variants={itemVariants}>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600/15 text-emerald-400 shadow-lg shadow-emerald-500/10">
            <ShieldCheck className="h-10 w-10" aria-hidden="true" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Connect Your Bank Securely
          </h1>
          <p className="mt-4 text-base text-slate-300 sm:text-lg">
            We rely on trusted Open Banking connections to keep your finances automatically up to date while giving you full control.
          </p>
        </motion.header>

        <motion.section
          variants={itemVariants}
          className="mt-10 grid gap-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-inner shadow-slate-950/50 lg:grid-cols-[1fr_1.1fr]"
        >
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
              <Lock className="h-4 w-4" aria-hidden="true" />
              Trusted access
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              When you continue, you will be redirected to your bank to sign in securely. Your bank will confirm you want to share read-only data with Nest Finance.
              You will never enter your banking password inside Nest.
            </p>
            <p className="text-sm leading-relaxed text-slate-300">
              Linking now means your balances and transactions flow in automatically, keeping your dashboard accurate without manual updates.
            </p>
          </div>

          <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
            {reassurancePoints.map((item) => (
              <div key={item.title} className="flex gap-4">
                <span className="mt-1 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                  <Check className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-300">{item.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.footer variants={itemVariants} className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="max-w-xl text-center text-sm text-slate-400 sm:text-left">
            By continuing, you agree to use secure Open Banking via our FCA-regulated partner so Nest Finance can retrieve your balances and transactions.
          </div>
          <motion.button
            type="button"
            onClick={onConsent}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`${buttonClasses} w-full justify-center gap-2 text-base sm:w-auto sm:px-8`}
          >
            Agree & Continue
          </motion.button>
        </motion.footer>
      </motion.main>
    </div>
  );
};

export default OpenBankingConsentScreen;
