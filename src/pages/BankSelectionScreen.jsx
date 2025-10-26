import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Lock, Building2 } from 'lucide-react';

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
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const bankCardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const banks = [
  { id: 'monzo', name: 'Monzo', badgeClass: 'bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500' },
  { id: 'revolut', name: 'Revolut', badgeClass: 'bg-gradient-to-br from-sky-500 to-blue-700' },
  { id: 'starling', name: 'Starling Bank', badgeClass: 'bg-gradient-to-br from-emerald-500 to-teal-600' },
  { id: 'natwest', name: 'NatWest', badgeClass: 'bg-gradient-to-br from-purple-600 to-indigo-700' },
  { id: 'barclays', name: 'Barclays', badgeClass: 'bg-gradient-to-br from-blue-500 to-blue-700' },
  { id: 'hsbc', name: 'HSBC', badgeClass: 'bg-gradient-to-br from-red-500 to-rose-600' },
  { id: 'lloyds', name: 'Lloyds Bank', badgeClass: 'bg-gradient-to-br from-emerald-600 to-green-700' },
  { id: 'santander', name: 'Santander', badgeClass: 'bg-gradient-to-br from-red-500 to-rose-700' },
  { id: 'halifax', name: 'Halifax', badgeClass: 'bg-gradient-to-br from-indigo-500 to-blue-700' },
  { id: 'nationwide', name: 'Nationwide', badgeClass: 'bg-gradient-to-br from-blue-600 to-slate-700' },
  { id: 'other', name: 'Other Bank', badgeClass: 'bg-gradient-to-br from-slate-500 to-slate-700' },
];

const BankSelectionScreen = ({ onBankSelected = () => {} }) => {
  const [query, setQuery] = useState('');

  const filteredBanks = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return banks;
    return banks.filter((bank) => bank.name.toLowerCase().includes(trimmed));
  }, [query]);

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
            <Building2 className="h-10 w-10" aria-hidden="true" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Select Your Bank</h1>
          <p className="mt-4 text-base text-slate-300 sm:text-lg">
            Choose your bank below to securely connect your accounts. You will be redirected to authorise access with your bank.
          </p>
        </motion.header>

        <motion.div variants={itemVariants} className="mt-10">
          <label htmlFor="bankSearch" className="sr-only">
            Search banks
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="bankSearch"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for your bank"
              className="w-full rounded-2xl border border-slate-800 bg-slate-950/60 py-3 pl-12 pr-4 text-sm text-white shadow-inner shadow-slate-950/60 outline-none ring-emerald-500/40 transition focus:border-emerald-500 focus:ring-2"
            />
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredBanks.map((bank, index) => (
            <motion.button
              key={bank.id}
              type="button"
              onClick={() => onBankSelected(bank.id)}
              variants={bankCardVariants}
              custom={index}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group flex w-full items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 px-5 py-4 text-left transition-colors hover:border-emerald-400/70 hover:bg-slate-900"
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold uppercase text-white ${bank.badgeClass}`}>
                  {bank.name
                    .split(' ')
                    .map((word) => word[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{bank.name}</p>
                  <p className="text-xs text-slate-400">Secure redirect to authorise</p>
                </div>
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400 opacity-0 transition-opacity group-hover:opacity-100">
                Connect
              </span>
            </motion.button>
          ))}
        </motion.div>

        {filteredBanks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-xl border border-slate-800 bg-slate-900/80 p-6 text-center text-sm text-slate-400"
          >
            We could not find that bank. Try a different name or choose Other Bank to continue.
          </motion.div>
        )}

        <motion.footer
          variants={itemVariants}
          className="mt-12 flex flex-col items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 px-6 py-5 text-xs text-slate-400 sm:flex-row sm:justify-center"
        >
          <Lock className="h-4 w-4 text-emerald-400" aria-hidden="true" />
          <span>
            You will be securely redirected to your bank to authorise the connection. Nest Finance never sees your login credentials.
          </span>
        </motion.footer>
      </motion.main>
    </div>
  );
};

export default BankSelectionScreen;
