import React from 'react';
import { motion } from 'framer-motion';
import { Zap, FileText, Check } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      when: 'beforeChildren',
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

const bankBenefits = [
  'See all accounts in one place',
  'Transactions appear automatically',
  'Save time & never miss a thing',
];

const manualBenefits = [
  'Be mindful of every transaction',
  'No bank connection needed',
  'Get started in seconds',
];

const OnboardingChoiceScreen = ({
  onChoiceManual = () => {},
  onChoiceBankLink = () => {},
}) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-4xl rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-emerald-900/20 backdrop-blur-lg sm:p-10 lg:p-12"
      >
        <motion.header
          className="mx-auto max-w-2xl text-center"
          variants={itemVariants}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Welcome to Nest Finance
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            How would you like to add your financial data?
          </h1>
          <p className="mt-4 text-base text-slate-300 sm:text-lg">
            Choose the option that fits your comfort level. You can always
            switch later - Nest keeps your information secure every step of the
            way.
          </p>
        </motion.header>

        <motion.div
          className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-2"
          variants={itemVariants}
        >
          <motion.button
            type="button"
            onClick={onChoiceBankLink}
            whileHover={{ y: -6, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="group relative flex h-full flex-col rounded-2xl border border-emerald-300/40 bg-white/90 p-7 text-left text-slate-900 shadow-xl shadow-emerald-200/40 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            <span className="absolute right-6 top-6 inline-flex items-center rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
              Recommended
            </span>
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 transition group-hover:bg-emerald-200">
                <Zap className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500">
                  Link Your Accounts
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                  Automate Your Finances
                </h2>
              </div>
            </div>
            <ul className="mt-6 flex flex-col gap-3">
              {bankBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex rounded-full bg-emerald-100 p-1 text-emerald-600">
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="text-sm font-medium text-slate-800">{benefit}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-slate-600">
              Connect securely via Open Banking. Read-only access means we never
              see or store your bank login details.
            </p>
          </motion.button>

          <motion.button
            type="button"
            onClick={onChoiceManual}
            whileHover={{ y: -6, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="group relative flex h-full flex-col rounded-2xl border border-slate-700 bg-slate-900/80 p-7 text-left text-slate-100 shadow-xl shadow-slate-900/50 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-emerald-300 transition group-hover:bg-slate-700">
                <FileText className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300/80">
                  Start Manually
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-white">
                  Track with Full Control
                </h2>
              </div>
            </div>
            <ul className="mt-6 flex flex-col gap-3">
              {manualBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex rounded-full bg-slate-800 p-1 text-emerald-300">
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="text-sm font-medium text-slate-200">{benefit}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-slate-400">
              Requires regular data entry to stay up-to-date.
            </p>
          </motion.button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-10 text-center text-sm text-slate-400"
        >
          <button
            type="button"
            className="inline-flex items-center gap-2 font-medium text-slate-300 transition hover:text-emerald-400"
            aria-label="Learn how secure linking works"
          >
            How does secure linking work?
            <span aria-hidden="true" className="text-lg leading-none">
              &gt;
            </span>
          </button>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default OnboardingChoiceScreen;
