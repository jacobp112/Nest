import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PiggyBank, Wallet, ArrowRight } from 'lucide-react';

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
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

const ManualSetupScreen = ({ onSubmit = () => {} }) => {
  const [mainBalance, setMainBalance] = useState('');
  const [lastIncome, setLastIncome] = useState('');
  const [errors, setErrors] = useState({ mainBalance: '', lastIncome: '' });

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = { mainBalance: '', lastIncome: '' };

    const parsedBalance = parseFloat(mainBalance);
    if (Number.isNaN(parsedBalance) || parsedBalance < 0) {
      validationErrors.mainBalance = 'Enter a balance greater than or equal to 0.';
    }

    const parsedIncome = parseFloat(lastIncome);
    if (Number.isNaN(parsedIncome) || parsedIncome < 0) {
      validationErrors.lastIncome = 'Enter an income amount greater than or equal to 0.';
    }

    const hasErrors = validationErrors.mainBalance || validationErrors.lastIncome;
    setErrors(validationErrors);

    if (hasErrors) {
      return;
    }

    onSubmit({
      currency: 'GBP',
      mainBalance: parsedBalance,
      lastIncome: parsedIncome,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-slate-900/40 backdrop-blur-lg sm:p-10 lg:p-12"
      >
        <motion.header className="text-center" variants={itemVariants}>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Manual Setup
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Let&apos;s Get Your Starting Point
          </h1>
          <p className="mt-4 text-base text-slate-300 sm:text-lg">
            Just a couple of details to set up your manual tracking.
          </p>
        </motion.header>

        <motion.div
          variants={itemVariants}
          className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-left shadow-inner shadow-slate-950/40 sm:p-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-slate-200">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600/20 text-emerald-400">
                <Wallet className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400/90">
                  Currency
                </p>
                <p className="text-lg font-semibold">GBP (&pound;)</p>
              </div>
            </div>
            <p className="text-sm text-slate-400">
              Locked for now. Multiple currencies are coming soon.
            </p>
          </div>
        </motion.div>

        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit}
          className="mt-10 space-y-8"
          noValidate
        >
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-inner shadow-slate-950/30 sm:p-8">
            <div className="flex items-center gap-3 text-slate-200">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600/20 text-emerald-400">
                <PiggyBank className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-semibold text-white sm:text-xl">
                Your Key Starting Balances
              </h2>
            </div>

            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <div>
                <label htmlFor="mainBalance" className="block text-sm font-semibold text-slate-200">
                  Main Account Balance (&pound;)
                </label>
                <input
                  id="mainBalance"
                  name="mainBalance"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  placeholder="1500.00"
                  value={mainBalance}
                  onChange={(event) => setMainBalance(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                />
                <p className="mt-2 text-xs text-slate-400">
                  Enter the current balance of your primary checking account.
                </p>
                {errors.mainBalance && (
                  <p className="mt-2 text-xs font-semibold text-rose-400">
                    {errors.mainBalance}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="lastIncome" className="block text-sm font-semibold text-slate-200">
                  Last Income Amount (&pound;)
                </label>
                <input
                  id="lastIncome"
                  name="lastIncome"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  placeholder="3000.00"
                  value={lastIncome}
                  onChange={(event) => setLastIncome(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/60"
                />
                <p className="mt-2 text-xs text-slate-400">
                  Enter the amount of your most recent income deposit.
                </p>
                {errors.lastIncome && (
                  <p className="mt-2 text-xs font-semibold text-rose-400">
                    {errors.lastIncome}
                  </p>
                )}
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`${buttonClasses} w-full justify-center gap-2 text-base sm:w-auto sm:px-8`}
          >
            See My Dashboard
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </motion.button>
        </motion.form>
      </motion.main>
    </div>
  );
};

export default ManualSetupScreen;
