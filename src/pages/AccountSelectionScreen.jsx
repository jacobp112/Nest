import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2, Wallet2 } from 'lucide-react';

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

const listItemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const AccountSelectionScreen = ({
  bankName = 'Your bank',
  accounts = [],
  onAccountsSelected = () => {},
  isLoading = false,
}) => {
  const [selectedIds, setSelectedIds] = useState(() => accounts.map((account) => account.id));

  useEffect(() => {
    setSelectedIds(accounts.map((account) => account.id));
  }, [accounts]);

  const allSelected = useMemo(() => selectedIds.length === accounts.length && accounts.length > 0, [accounts, selectedIds]);
  const formattedBankName = bankName || 'your bank';

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(Number(value) || 0);

  const toggleAccount = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((accountId) => accountId !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(accounts.map((account) => account.id));
    }
  };

  const handleConfirm = () => {
    if (selectedIds.length === 0 || isLoading) return;
    onAccountsSelected(selectedIds);
  };

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
            Select your {formattedBankName} accounts
          </h1>
          <p className="mt-4 text-base text-slate-300 sm:text-lg">
            Choose which accounts you want to track in Nest Finance. You remain in complete control.
          </p>
        </motion.header>

        <motion.section variants={itemVariants} className="mt-10">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/70 p-10 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-emerald-400" aria-hidden="true" />
              <p className="mt-4 text-sm text-slate-300">Fetching your accounts...</p>
              <p className="mt-2 text-xs text-slate-400">
                This may take a moment while we securely retrieve your accounts.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 text-slate-200">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                    <Wallet2 className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">Accounts retrieved from {formattedBankName}</p>
                    <p className="text-xs text-slate-400">
                      {accounts.length > 0
                        ? `${accounts.length} account${accounts.length === 1 ? '' : 's'} available`
                        : 'No accounts returned'}
                    </p>
                  </div>
                </div>
                {accounts.length > 0 && (
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300 transition hover:border-emerald-400 hover:text-emerald-200"
                  >
                    {allSelected ? 'Deselect all' : 'Select all'}
                  </button>
                )}
              </div>

              {accounts.length > 0 ? (
                <div className="space-y-3">
                  {accounts.map((account, index) => (
                    <motion.label
                      key={account.id}
                      variants={listItemVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                      className={`flex cursor-pointer items-center justify-between rounded-2xl border px-5 py-4 transition ${
                        selectedIds.includes(account.id)
                          ? 'border-emerald-500/40 bg-slate-900/70'
                          : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-950/60'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{account.name}</p>
                        <p className="mt-1 text-xs text-slate-400">Balance {formatCurrency(account.balance)}</p>
                      </div>
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-2 focus:ring-emerald-500"
                        checked={selectedIds.includes(account.id)}
                        onChange={() => toggleAccount(account.id)}
                      />
                    </motion.label>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-center text-sm text-slate-400">
                  No accounts were returned. Please retry or choose a different bank.
                </div>
              )}
            </div>
          )}
        </motion.section>

        <motion.footer
          variants={itemVariants}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="text-xs text-slate-400">
            We only import balances and transactions from the accounts you choose. You can adjust this later in settings.
          </div>
          <motion.button
            type="button"
            onClick={handleConfirm}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={isLoading || selectedIds.length === 0}
            className={`${buttonClasses} w-full justify-center gap-2 text-base sm:w-auto sm:px-8 ${
              isLoading || selectedIds.length === 0 ? 'cursor-not-allowed opacity-60' : ''
            }`}
          >
            Link Selected Accounts
          </motion.button>
        </motion.footer>
      </motion.main>
    </div>
  );
};

export default AccountSelectionScreen;
