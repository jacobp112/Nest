import React, { useMemo, useCallback } from 'react';
import {
  ArrowRight,
  Building,
  Landmark,
  Lock,
  PiggyBank,
  PieChart,
  PlusCircle,
  TrendingUp,
  Wallet,
} from 'lucide-react';

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});

const formatCurrency = (value) => currencyFormatter.format(Number(value) || 0);

const backdropClasses =
  'relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100';

const sectionCardClasses =
  'rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur';

const AccountsNetWorthView = ({
  accounts = [],
  transactions = [],
  userDoc = {},
  isPremium = false,
  onShowPricingModal,
}) => {
  const normalisedAccounts = useMemo(
    () =>
      (accounts || []).map((account) => {
        const balance = Number(account.balance) || 0;
        const type =
          account.type ||
          (account.category || '').toLowerCase().includes('loan') ||
          (account.accountType || '').toLowerCase().includes('liability')
            ? 'liability'
            : balance >= 0
              ? 'asset'
              : 'liability';
        const isLinked = Boolean(
          account.isLinked ||
            account.connection === 'linked' ||
            account.provider ||
            account.institution,
        );
        return {
          ...account,
          balance,
          type,
          isLinked,
        };
      }),
    [accounts],
  );

  const accountGroups = useMemo(() => {
    const linked = normalisedAccounts.filter((account) => account.isLinked);
    const manual = normalisedAccounts.filter((account) => !account.isLinked);
    return {
      linked,
      manual,
    };
  }, [normalisedAccounts]);

  const netWorthMetrics = useMemo(() => {
    const assets = normalisedAccounts
      .filter((account) => account.type === 'asset')
      .reduce((sum, account) => sum + account.balance, 0);
    const liabilities = normalisedAccounts
      .filter((account) => account.type === 'liability')
      .reduce((sum, account) => sum + account.balance, 0);
    const netWorth = assets + liabilities;
    return {
      assets,
      liabilities,
      netWorth,
    };
  }, [normalisedAccounts]);

  const topTransactions = useMemo(() => {
    const sorted = (transactions || [])
      .slice()
      .sort((a, b) => {
        const aAmount = Math.abs(Number(a.amount) || 0);
        const bAmount = Math.abs(Number(b.amount) || 0);
        return bAmount - aAmount;
      })
      .slice(0, 5);
    return sorted.map((transaction, index) => ({
      id: transaction.id || `${transaction.description}-${index}`,
      description: transaction.description || 'Transaction',
      amount: Number(transaction.amount) || 0,
      date: transaction.date?.toDate?.() || transaction.date || null,
      type: transaction.type || 'expense',
    }));
  }, [transactions]);

  const handleAddManualAsset = useCallback(() => {
    if (!isPremium) {
      onShowPricingModal?.();
      return;
    }
    console.log('Open manual asset dialog');
  }, [isPremium, onShowPricingModal]);

  const handleViewHistoricalChart = useCallback(() => {
    if (!isPremium) {
      onShowPricingModal?.();
      return;
    }
    console.log('Open historical chart view');
  }, [isPremium, onShowPricingModal]);

  const handleViewBreakdown = useCallback(() => {
    if (!isPremium) {
      onShowPricingModal?.();
      return;
    }
    console.log('Open asset/liability breakdown');
  }, [isPremium, onShowPricingModal]);

  return (
    <div className={backdropClasses}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.08),_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(59,130,246,0.06),_transparent_60%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-10">
        <header className="flex flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Accounts &amp; Net Worth Hub
          </span>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Holistic wealth snapshot
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Review balances across every account and understand how they contribute to your net worth.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/50 px-5 py-3 text-right shadow-lg shadow-slate-950/40">
              <p className="text-xs uppercase tracking-wide text-slate-400">Accounts tracked</p>
              <p className="text-lg font-semibold text-white">{normalisedAccounts.length}</p>
            </div>
          </div>
        </header>

        <section className={`${sectionCardClasses} space-y-6`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Net worth today</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">
                {formatCurrency(netWorthMetrics.netWorth)}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1">
                <PiggyBank className="h-4 w-4 text-emerald-300" />
                Assets {formatCurrency(netWorthMetrics.assets)}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1">
                <Landmark className="h-4 w-4 text-rose-300" />
                Liabilities {formatCurrency(netWorthMetrics.liabilities)}
              </span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Linked accounts</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {formatCurrency(
                  accountGroups.linked.reduce((sum, account) => sum + account.balance, 0),
                )}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {accountGroups.linked.length} institutions syncing automatically.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Manual accounts</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {formatCurrency(
                  accountGroups.manual.reduce((sum, account) => sum + account.balance, 0),
                )}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {accountGroups.manual.length} accounts you maintain.
              </p>
            </div>
          </div>
        </section>

        <section className={`${sectionCardClasses} space-y-4`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-white">Account directory</h2>
            <span className="rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1 text-xs text-slate-400">
              {normalisedAccounts.length} accounts listed
            </span>
          </div>
          {normalisedAccounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-700/70 bg-slate-900/60 px-6 py-10 text-center">
              <Wallet className="h-10 w-10 text-slate-500" />
              <p className="text-base font-semibold text-white">
                Link a bank or add a manual account to begin tracking.
              </p>
              <p className="text-sm text-slate-400">
                Use the onboarding flow or the Accounts panel on the dashboard.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {normalisedAccounts.map((account) => {
                const isLiability = account.type === 'liability' || account.balance < 0;
                return (
                  <div
                    key={account.id || account.name}
                    className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-lg shadow-slate-950/10"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {account.name || 'Unnamed account'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {account.institution || account.provider || account.type || 'Account'}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
                          isLiability
                            ? 'border-rose-500/40 bg-rose-500/10 text-rose-200'
                            : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                        }`}
                      >
                        {isLiability ? 'Liability' : 'Asset'}
                      </span>
                    </div>
                    <p
                      className={`mt-4 text-2xl font-semibold ${
                        isLiability ? 'text-rose-300' : 'text-emerald-300'
                      }`}
                    >
                      {formatCurrency(account.balance)}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {account.isLinked ? 'Linked automatically' : 'Manual balance'} • Updated{' '}
                      {account.updatedAt
                        ? new Date(account.updatedAt).toLocaleDateString()
                        : 'recently'}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className={`${sectionCardClasses} space-y-4`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-white">Net worth history</h2>
            {!isPremium && (
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                <Lock className="h-4 w-4" />
                Premium feature
              </span>
            )}
          </div>
          {isPremium ? (
            <div className="flex flex-col items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">
                <TrendingUp className="h-4 w-4" />
                Coming soon
              </div>
              <p className="text-sm text-slate-300">
                We&apos;re finalising the interactive historical chart. You&apos;ll soon be able to
                visualise progress across months and benchmark against previous periods.
              </p>
              <button
                type="button"
                onClick={handleViewHistoricalChart}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-emerald-400 hover:text-white"
              >
                Preview chart concept
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
              <p className="text-sm text-slate-300">
                Unlock the interactive historical chart to track the momentum of your wealth over time.
              </p>
              <button
                type="button"
                onClick={() => onShowPricingModal?.()}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500"
              >
                Upgrade to view chart
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </section>

        <section className={`${sectionCardClasses} space-y-4`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-white">Asset &amp; liability breakdown</h2>
            {!isPremium && (
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                <Lock className="h-4 w-4" />
                Premium feature
              </span>
            )}
          </div>
          {isPremium ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">
                  <PieChart className="h-4 w-4" />
                  Assets mix
                </div>
                <p className="mt-3 text-sm text-slate-300">
                  Visualise how cash, investments, and property combine to form your asset base. Drill down
                  into each category to manage concentration risk.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-200">
                  <Building className="h-4 w-4" />
                  Liability stack
                </div>
                <p className="mt-3 text-sm text-slate-300">
                  Highlight high-impact debt, interest schedules, and payoff timelines so you can stay in
                  control of obligations.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
              <p className="text-sm text-slate-300">
                Premium unlocks detailed asset vs. liability visuals, helping you rebalance and prioritise
                payoff strategies.
              </p>
              <button
                type="button"
                onClick={handleViewBreakdown}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-emerald-400 hover:text-white"
              >
                See what&apos;s included
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </section>

        <section className={`${sectionCardClasses} space-y-4`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-white">Manual assets</h2>
            {!isPremium && (
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                <Lock className="h-4 w-4" />
                Premium feature
              </span>
            )}
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
            <p className="text-sm text-slate-300">
              Keep high-value items, property, or alternative assets in sync with your financial picture.
              Nest Premium lets you catalogue and depreciate them intelligently.
            </p>
            <button
              type="button"
              onClick={handleAddManualAsset}
              className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                isPremium
                  ? 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 hover:border-emerald-400 hover:text-white'
                  : 'border border-slate-700 bg-slate-900/70 text-slate-300 hover:border-emerald-400 hover:text-white'
              }`}
            >
              <PlusCircle className="h-4 w-4" />
              {isPremium ? 'Add manual asset' : 'Preview manual assets'}
            </button>
          </div>
        </section>

        <section className={`${sectionCardClasses} space-y-4`}>
          <h2 className="text-xl font-semibold text-white">Largest recent movements</h2>
          {topTransactions.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-700/70 bg-slate-900/60 px-5 py-4 text-sm text-slate-400">
              Transactions will appear here as soon as you log income or expenses.
            </p>
          ) : (
            <div className="space-y-3">
              {topTransactions.map((transaction) => {
                const isDebit = transaction.type === 'expense';
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-200"
                  >
                    <div>
                      <p className="font-semibold text-white">{transaction.description}</p>
                      <p className="text-xs text-slate-500">
                        {transaction.date
                          ? new Date(transaction.date).toLocaleDateString()
                          : 'Recent activity'}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        isDebit ? 'text-rose-300' : 'text-emerald-300'
                      }`}
                    >
                      {isDebit ? '-' : '+'}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AccountsNetWorthView;
