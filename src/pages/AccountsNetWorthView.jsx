import React, { useCallback, useMemo } from 'react';
import { Landmark, PiggyBank, TrendingUp, Wallet } from 'lucide-react';

import { Card, Badge } from '../components/primitives';

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});

const formatCurrency = (value) => currencyFormatter.format(Number(value) || 0);

const asArray = (value) => (Array.isArray(value) ? value : []);

export const useAccountsNetWorthData = ({ accounts = [], transactions = [] } = {}) => {
  const normalisedAccounts = useMemo(() => {
    const input = asArray(accounts);
    return input.map((account) => {
      const balance = Number(account?.balance) || 0;
      const typeLabel = String(account?.type || '').toLowerCase();
      const isLiability = typeLabel.includes('liability') || balance < 0;
      return {
        ...account,
        balance,
        type: isLiability ? 'liability' : 'asset',
        isLinked: Boolean(
          account?.isLinked ||
            account?.connection === 'linked' ||
            account?.provider ||
            account?.institution,
        ),
      };
    });
  }, [accounts]);

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

    return {
      assets,
      liabilities,
      netWorth: assets + liabilities,
    };
  }, [normalisedAccounts]);

  const topTransactions = useMemo(() => {
    const input = asArray(transactions);
    return input
      .slice()
      .sort((a, b) => {
        const aAmount = Math.abs(Number(a?.amount) || 0);
        const bAmount = Math.abs(Number(b?.amount) || 0);
        return bAmount - aAmount;
      })
      .slice(0, 5)
      .map((transaction, index) => ({
        id: transaction?.id || ${transaction?.description || 'transaction'}-,
        description: transaction?.description || 'Transaction',
        amount: Number(transaction?.amount) || 0,
        type: transaction?.type || 'expense',
        date: transaction?.date?.toDate?.() || transaction?.date || null,
      }));
  }, [transactions]);

  return {
    normalisedAccounts,
    accountGroups,
    netWorthMetrics,
    topTransactions,
  };
};

const AccountsNetWorthView = ({
  accounts = [],
  transactions = [],
  userDoc = {},
  isPremium = false,
  onShowPricingModal,
}) => {
  const { normalisedAccounts, accountGroups, netWorthMetrics, topTransactions } =
    useAccountsNetWorthData({
      accounts,
      transactions,
    });

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
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 text-slate-100">
      <Card className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Net worth today</p>
            <p className="mt-3 text-3xl font-semibold text-white">
              {formatCurrency(netWorthMetrics.netWorth)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleViewHistoricalChart}
            className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:border-white/40"
          >
            View history
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          <Badge variant="emerald">
            <PiggyBank className="h-4 w-4" />
            {formatCurrency(netWorthMetrics.assets)}
          </Badge>
          <Badge variant="rose">
            <Landmark className="h-4 w-4" />
            {formatCurrency(netWorthMetrics.liabilities)}
          </Badge>
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Accounts overview</p>
            <p className="text-lg font-semibold text-white">
              {normalisedAccounts.length} accounts tracked
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Badge variant="emerald">{accountGroups.linked.length} linked</Badge>
            <Badge variant="neutral">{accountGroups.manual.length} manual</Badge>
          </div>
        </div>
        {normalisedAccounts.length === 0 ? (
          <div className="flex flex-col items-start gap-2 text-sm text-slate-400">
            <Wallet className="h-6 w-6" />
            <p>Connect a bank or add an asset to populate your net worth.</p>
            <button
              type="button"
              onClick={handleAddManualAsset}
              className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:border-white/40"
            >
              Add manual asset
            </button>
          </div>
        ) : (
          <ul className="space-y-3">
            {normalisedAccounts.slice(0, 4).map((account) => (
              <li
                key={account?.id || account?.name}
                className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-white"
              >
                <div>
                  <p className="font-semibold">{account?.name || 'Account'}</p>
                  <p className="text-xs text-slate-300">
                    {account?.institution || account?.provider || account?.type || 'Account'}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={
                      account.type === 'liability'
                        ? 'text-rose-200 font-semibold'
                        : 'text-emerald-200 font-semibold'
                    }
                  >
                    {formatCurrency(account.balance)}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">
                    {account.type}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Largest recent movements
            </p>
            <p className="text-lg font-semibold text-white">
              {topTransactions.length ? ${topTransactions.length} records : 'No records'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleViewBreakdown}
            className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:border-white/40"
          >
            View breakdown
          </button>
        </div>
        {topTransactions.length === 0 ? (
          <p className="text-sm text-slate-400">Transactions will appear once activity is synced.</p>
        ) : (
          <ul className="space-y-3">
            {topTransactions.map((transaction) => {
              const isDebit = transaction.type === 'expense';
              return (
                <li
                  key={transaction.id}
                  className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-2 text-sm text-white"
                >
                  <div>
                    <p className="font-semibold">{transaction.description}</p>
                    <p className="text-xs text-slate-300">
                      {transaction.date
                        ? new Date(transaction.date).toLocaleDateString()
                        : 'Recent activity'}
                    </p>
                  </div>
                  <span className={isDebit ? 'text-rose-200 font-semibold' : 'text-emerald-200 font-semibold'}>
                    {isDebit ? '-' : '+'}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Card className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">Preview timeline</p>
          <p className="text-xs text-slate-400">
            Unlock premium analytics to model trends and stress-test liabilities.
          </p>
        </div>
        <button
          type="button"
          onClick={handleViewHistoricalChart}
          className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:border-white/40"
        >
          <TrendingUp className="h-4 w-4" />
          Preview chart
        </button>
      </Card>
    </div>
  );
};

export { currencyFormatter, formatCurrency };
export default AccountsNetWorthView;
