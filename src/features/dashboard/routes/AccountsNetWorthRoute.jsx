import React, { useCallback, useMemo } from 'react';
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
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

import { useAuth } from '../../../hooks/useAuth';
import { useAccountsQuery, useRecentTransactionsQuery } from '../api/financeQueries';

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});

const formatCurrency = (value) => currencyFormatter.format(Number(value) || 0);

const cx = (...classes) => twMerge(clsx(...classes));

const pageShellClasses =
  'relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.08),_rgba(2,6,23,1)_65%)] text-slate-100';

const glassPanelClasses =
  'relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/40 p-6 shadow-[0_30px_120px_rgba(2,6,23,0.85)] backdrop-blur-xl';

const gradientNumberClasses =
  'bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-300 bg-clip-text text-transparent';

const accentNumberClasses =
  'bg-gradient-to-r from-rose-200 via-fuchsia-200 to-amber-200 bg-clip-text text-transparent';

const AccountsNetWorthRoute = ({ onShowPricingModal }) => {
  const { user, userDoc } = useAuth();
  const userId = user?.uid;
  const isPremium = Boolean(userDoc?.isPremium || userDoc?.plan === 'premium');

  const {
    data: accounts = [],
    isLoading: accountsLoading,
    isError: accountsError,
  } = useAccountsQuery(userId);
  const {
    data: transactions = [],
    isLoading: transactionsLoading,
    isError: transactionsError,
  } = useRecentTransactionsQuery(userId);

  const isLoading = accountsLoading || transactionsLoading;
  const hasError = accountsError || transactionsError;

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
    const linkedValue = linked.reduce((sum, account) => sum + account.balance, 0);
    const manualValue = manual.reduce((sum, account) => sum + account.balance, 0);
    return {
      linked,
      manual,
      linkedValue,
      manualValue,
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

  const directoryAccounts = useMemo(
    () => normalisedAccounts.slice().sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance)),
    [normalisedAccounts],
  );

  const holdingsHighlights = useMemo(() => {
    const sumMatching = (predicate) =>
      normalisedAccounts.filter(predicate).reduce((sum, account) => sum + account.balance, 0);

    return {
      realEstate: sumMatching((account) => (account.category || '').toLowerCase() === 'real estate'),
      retirement: sumMatching((account) => (account.category || '').toLowerCase().includes('retirement')),
      investments: sumMatching((account) => (account.category || '').toLowerCase().includes('investment')),
    };
  }, [normalisedAccounts]);

  const liquidityInsights = useMemo(
    () => ({
      safeToSpend: netWorthMetrics.assets * 0.05,
      emergencyRunway: Math.max(netWorthMetrics.assets - Math.abs(netWorthMetrics.liabilities), 0),
      opportunityPool: netWorthMetrics.assets * 0.1,
    }),
    [netWorthMetrics],
  );

  const connectivityCoverage = normalisedAccounts.length
    ? Math.round((accountGroups.linked.length / normalisedAccounts.length) * 100)
    : 0;

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

  const promptUpgrade = useCallback(() => {
    if (!isPremium) {
      onShowPricingModal?.();
      return true;
    }
    return false;
  }, [isPremium, onShowPricingModal]);

  const handleAddManualAsset = useCallback(() => {
    if (promptUpgrade()) return;
  }, [promptUpgrade]);

  const handleViewHistoricalChart = useCallback(() => {
    if (promptUpgrade()) return;
  }, [promptUpgrade]);

  const handleViewBreakdown = useCallback(() => {
    if (promptUpgrade()) return;
  }, [promptUpgrade]);

  if (!userId) {
    return (
      <div className={cx(pageShellClasses, 'flex items-center justify-center px-4')}>
        <div className={cx(glassPanelClasses, 'text-sm text-slate-200')}>
          Sign in to view your accounts and net worth.
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={cx(pageShellClasses, 'flex items-center justify-center px-4')}>
        <div className={cx(glassPanelClasses, 'text-sm text-rose-100')}>
          Unable to load accounts right now. Please try again shortly.
        </div>
      </div>
    );
  }

  return (
    <div className={pageShellClasses}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-emerald-500/20 via-transparent to-transparent blur-[128px]" />
      <div className="pointer-events-none absolute left-[8%] top-1/3 h-[360px] w-[360px] rounded-full bg-sky-500/15 blur-[128px]" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-12%] h-[420px] w-[420px] rounded-full bg-fuchsia-500/20 blur-[128px]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-12">
        <header className="relative flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-slate-950/40 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-200/80 backdrop-blur-xl">
            Accounts &amp; Net Worth
          </span>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-white sm:text-4xl">Deep Glass Wealth Console</h1>
              <p className="mt-2 text-sm text-slate-300/80">
                Curate every institution, monitor liabilities, and keep premium assets aligned with your strategy.
              </p>
            </div>
            <div className="rounded-full border border-white/10 bg-slate-950/40 px-5 py-3 text-right backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Accounts tracked</p>
              <p className={cx('text-2xl font-semibold', gradientNumberClasses)}>{normalisedAccounts.length}</p>
            </div>
          </div>
        </header>

        <div className="grid auto-rows-[minmax(0,1fr)] gap-6 md:grid-cols-6">
          <section className={cx(glassPanelClasses, 'md:col-span-4 space-y-6 overflow-hidden')}>
            <div className="pointer-events-none absolute -right-10 top-[-40px] h-64 w-64 rounded-full bg-emerald-500/25 blur-[128px]" />
            <div className="pointer-events-none absolute left-16 top-1/2 h-56 w-56 rounded-full bg-sky-500/20 blur-[128px]" />
            <div className="relative flex flex-col gap-6">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-300/80">Net worth today</p>
                  <p className={cx('mt-4 text-4xl font-semibold leading-tight sm:text-5xl', gradientNumberClasses)}>
                    {isLoading ? '—' : formatCurrency(netWorthMetrics.netWorth)}
                  </p>
                  <p className="mt-2 text-sm text-slate-300/90">
                    A living snapshot of your assets, liabilities, and the energy driving your balance sheet.
                  </p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <button
                    type="button"
                    onClick={handleViewHistoricalChart}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/40 px-5 py-2 text-xs font-semibold text-white transition hover:border-emerald-300/60"
                  >
                    Preview trendline
                    <TrendingUp className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <span className="text-xs uppercase tracking-[0.4em] text-slate-400">{connectivityCoverage}% synced</span>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-emerald-200/80">
                    <PiggyBank className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                    Assets
                  </div>
                  <p className={cx('mt-3 text-2xl font-semibold', gradientNumberClasses)}>
                    {isLoading ? '—' : formatCurrency(netWorthMetrics.assets)}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">Cash, investments, property</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-rose-200/80">
                    <Landmark className="h-4 w-4 text-rose-200" aria-hidden="true" />
                    Liabilities
                  </div>
                  <p className={cx('mt-3 text-2xl font-semibold', accentNumberClasses)}>
                    {isLoading ? '—' : formatCurrency(netWorthMetrics.liabilities)}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">Mortgages, lending, obligations</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-sky-200/80">
                    <Wallet className="h-4 w-4 text-sky-200" aria-hidden="true" />
                    Momentum
                  </div>
                  <p className={cx('mt-3 text-2xl font-semibold', gradientNumberClasses)}>
                    {isLoading ? '—' : formatCurrency(netWorthMetrics.netWorth)}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">Blended net position</p>
                </div>
              </div>
            </div>
          </section>

          <section className={cx(glassPanelClasses, 'md:col-span-2 space-y-5')}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Connectivity mix</p>
              <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-slate-400">
                Always on
              </span>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Accounts curated</p>
                <p className={cx('text-3xl font-semibold', gradientNumberClasses)}>{normalisedAccounts.length}</p>
                <p className="text-xs text-slate-400">Split across linked and private holdings</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 backdrop-blur-xl">
                  <div>
                    <p className="text-sm font-semibold text-white">Linked</p>
                    <p className="text-xs text-slate-400">{accountGroups.linked.length} institutions</p>
                  </div>
                  <p className={cx('text-lg font-semibold', gradientNumberClasses)}>
                    {isLoading ? '—' : formatCurrency(accountGroups.linkedValue)}
                  </p>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 backdrop-blur-xl">
                  <div>
                    <p className="text-sm font-semibold text-white">Manual</p>
                    <p className="text-xs text-slate-400">{accountGroups.manual.length} statements</p>
                  </div>
                  <p className={cx('text-lg font-semibold', accentNumberClasses)}>
                    {isLoading ? '—' : formatCurrency(accountGroups.manualValue)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className={cx(glassPanelClasses, 'md:col-span-4 space-y-5')}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-white">Account directory</h2>
                <p className="text-sm text-slate-300/80">Review every ledger and how it feeds your net worth.</p>
              </div>
              <span className="rounded-full border border-white/10 px-4 py-1 text-[10px] uppercase tracking-[0.3em] text-slate-400">
                {normalisedAccounts.length} listings
              </span>
            </div>
            {normalisedAccounts.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-950/40 px-6 py-10 text-center backdrop-blur-xl">
                <Wallet className="h-10 w-10 text-slate-500" aria-hidden="true" />
                <p className="text-base font-semibold text-white">
                  Link a bank or add a manual account to begin tracking.
                </p>
                <p className="text-sm text-slate-400">
                  Use onboarding or the accounts panel to seed your net worth view.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {directoryAccounts.map((account) => {
                  const isLiability = account.type === 'liability' || account.balance < 0;
                  return (
                    <div
                      key={account.id || account.name}
                      className="rounded-2xl border border-white/10 bg-slate-950/40 p-5 backdrop-blur-xl"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-white">{account.name || 'Unnamed account'}</p>
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                            {account.institution || account.provider || account.type || 'Account'}
                          </p>
                        </div>
                        <span
                          className={cx(
                            'inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em]',
                            isLiability ? 'text-rose-200' : 'text-emerald-200',
                          )}
                        >
                          {isLiability ? 'Liability' : 'Asset'}
                        </span>
                      </div>
                      <p
                        className={cx(
                          'mt-4 text-2xl font-semibold',
                          isLiability ? accentNumberClasses : gradientNumberClasses,
                        )}
                      >
                        {formatCurrency(account.balance)}
                      </p>
                      <p className="mt-2 text-xs text-slate-400">
                        {account.isLinked ? 'Linked automatically' : 'Manual balance'} • Updated{' '}
                        {account.updatedAt ? new Date(account.updatedAt).toLocaleDateString() : 'recently'}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className={cx(glassPanelClasses, 'md:col-span-2 space-y-4')}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">Net worth history</h2>
              {!isPremium && (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-200">
                  <Lock className="h-4 w-4" aria-hidden="true" />
                  Premium
                </span>
              )}
            </div>
            {isPremium ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-4 backdrop-blur-xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-200">
                    <TrendingUp className="h-4 w-4" aria-hidden="true" />
                    Coming soon
                  </div>
                  <p className="mt-3 text-sm text-slate-300">
                    We&apos;re finalising the interactive historical canvas so you can benchmark monthly shifts.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleViewHistoricalChart}
                  className="inline-flex w-full items-center justify-between rounded-full border border-white/10 bg-slate-950/40 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-emerald-400/60"
                >
                  Preview chart concept
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-slate-300">
                  Unlock timeline visualisations to chart the momentum of your wealth over quarters.
                </p>
                <button
                  type="button"
                  onClick={() => onShowPricingModal?.()}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500"
                >
                  Upgrade to view chart
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            )}
          </section>

          <section className={cx(glassPanelClasses, 'md:col-span-3 space-y-5')}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">Asset &amp; liability breakdown</h2>
              {!isPremium && (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-200">
                  <Lock className="h-4 w-4" aria-hidden="true" />
                  Premium
                </span>
              )}
            </div>
            {isPremium ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-200">
                      <PieChart className="h-4 w-4" aria-hidden="true" />
                      Assets mix
                    </div>
                    <p className="mt-3 text-sm text-slate-300">
                      Visualise how cash, investments, and property combine to form your asset base.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-rose-200">
                      <Building className="h-4 w-4" aria-hidden="true" />
                      Liability stack
                    </div>
                    <p className="mt-3 text-sm text-slate-300">
                      Highlight high-impact debt, interest schedules, and payoff timelines to stay in control.
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { label: 'Real estate', value: holdingsHighlights.realEstate, icon: Building },
                    { label: 'Retirement', value: holdingsHighlights.retirement, icon: Landmark },
                    { label: 'Investments', value: holdingsHighlights.investments, icon: TrendingUp },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-xl">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
                        <Icon className="h-4 w-4 text-slate-300" aria-hidden="true" />
                        {label}
                      </div>
                      <p className={cx('mt-3 text-xl font-semibold', gradientNumberClasses)}>
                        {formatCurrency(value)}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-slate-300">
                  Premium unlocks immersive visuals so you can rebalance, ladder payoffs, and model trade-offs with clarity.
                </p>
                <button
                  type="button"
                  onClick={handleViewBreakdown}
                  className="inline-flex w-full items-center justify-between rounded-full border border-white/10 bg-slate-950/40 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-emerald-400/60"
                >
                  See what&apos;s included
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            )}
          </section>

          <section className={cx(glassPanelClasses, 'md:col-span-3 space-y-4')}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">Manual assets</h2>
              {!isPremium && (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-200">
                  <Lock className="h-4 w-4" aria-hidden="true" />
                  Premium
                </span>
              )}
            </div>
            <p className="text-sm text-slate-300">
              Keep high-value items, private equity, or art cataloged with intelligent depreciation and secure metadata.
            </p>
            <button
              type="button"
              onClick={handleAddManualAsset}
              className={cx(
                'inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition',
                isPremium
                  ? 'border border-white/10 bg-slate-950/40 text-emerald-200 hover:border-emerald-400/60'
                  : 'border border-white/10 bg-slate-950/40 text-slate-200 hover:border-emerald-400/60',
              )}
            >
              <PlusCircle className="h-4 w-4" aria-hidden="true" />
              {isPremium ? 'Add manual asset' : 'Preview manual assets'}
            </button>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• Store valuations with provenance and attach documentation.</li>
              <li>• Model appreciation or depreciation curves automatically.</li>
            </ul>
          </section>

          <section className={cx(glassPanelClasses, 'md:col-span-2 space-y-5')}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Liquidity lens</h2>
              <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Based on assets</span>
            </div>
            <div className="space-y-3">
              {[
                {
                  label: 'Safe-to-spend',
                  value: liquidityInsights.safeToSpend,
                  caption: '5% of liquid assets',
                  icon: Wallet,
                },
                {
                  label: 'Emergency runway',
                  value: liquidityInsights.emergencyRunway,
                  caption: 'Protected for 6 months',
                  icon: Lock,
                },
                {
                  label: 'Opportunity pool',
                  value: liquidityInsights.opportunityPool,
                  caption: 'Ready for deployment',
                  icon: PiggyBank,
                },
              ].map(({ label, value, caption, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 backdrop-blur-xl"
                >
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <Icon className="h-4 w-4 text-slate-300" aria-hidden="true" />
                      {label}
                    </div>
                    <p className="text-xs text-slate-400">{caption}</p>
                  </div>
                  <p className={cx('text-lg font-semibold', gradientNumberClasses)}>{formatCurrency(value)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={cx(glassPanelClasses, 'md:col-span-4 space-y-5')}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">Largest recent movements</h2>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
                <PieChart className="h-4 w-4 text-slate-300" aria-hidden="true" />
                Synced live
              </div>
            </div>
            {topTransactions.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 px-5 py-4 text-sm text-slate-400 backdrop-blur-xl">
                Transactions land here as soon as new income or expenses stream in.
              </p>
            ) : (
              <div className="space-y-3">
                {topTransactions.map((transaction) => {
                  const isDebit = transaction.type === 'expense';
                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm backdrop-blur-xl"
                    >
                      <div>
                        <p className="font-semibold text-white">{transaction.description}</p>
                        <p className="text-xs text-slate-400">
                          {transaction.date ? new Date(transaction.date).toLocaleDateString() : 'Recent activity'}
                        </p>
                      </div>
                      <span
                        className={cx(
                          'text-sm font-semibold',
                          isDebit ? accentNumberClasses : gradientNumberClasses,
                        )}
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

          <section className={cx(glassPanelClasses, 'md:col-span-6 flex flex-wrap items-center justify-between gap-4')}>
            <div>
              <p className="text-sm font-semibold text-white">Need priority support?</p>
              <p className="text-xs text-slate-400">
                Premium households get 1:1 concierge onboarding to connect every institution and private asset.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onShowPricingModal?.()}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:border-emerald-400/60"
            >
              <PieChart className="h-4 w-4" aria-hidden="true" />
              View plans
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AccountsNetWorthRoute;
