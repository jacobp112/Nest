import React, { useMemo } from 'react';
import { useDataStore } from '../../stores/useDataStore.js';
import { formatCurrency } from '../../utils/helpers';

const parseDate = (v) => {
  if (!v) return null;
  if (v instanceof Date) return v;
  if (typeof v.toDate === 'function') return v.toDate();
  return new Date(v);
};

const inRange = (d, start, end) => {
  if (!d) return false;
  const t = d.getTime();
  return (start ? t >= start.getTime() : true) && (end ? t <= end.getTime() : true);
};

export function StatSafeToSpend({ userDoc, dateRange }) {
  const transactions = useDataStore((s) => s.transactions);
  const { value } = useMemo(() => {
    const start = dateRange?.start ? new Date(dateRange.start) : null;
    const end = dateRange?.end ? new Date(dateRange.end) : null;
    let income = 0;
    let expenses = 0;
    (transactions || []).forEach((tx) => {
      const d = parseDate(tx?.date) || null;
      if (!inRange(d, start, end)) return;
      const amt = Number(tx?.amount) || 0;
      if (tx?.type === 'income') income += amt;
      if (tx?.type === 'expense') expenses += amt;
    });
    const recurring = (Number(userDoc?.recurringIncome) || 0) - (Number(userDoc?.recurringExpenses) || 0);
    return { value: recurring + (income - expenses) };
  }, [transactions, userDoc, dateRange]);
  return <span>{formatCurrency(value)}</span>;
}

export function StatNetWorthValue() {
  const accounts = useDataStore((s) => s.accounts);
  const net = useMemo(() => {
    return (accounts || []).reduce((sum, acc) => {
      const n = Number(acc?.balance) || 0;
      return sum + (acc?.type === 'debt' ? -n : n);
    }, 0);
  }, [accounts]);
  return <span>{formatCurrency(net)}</span>;
}

export function StatBudgetProgress({ dateRange }) {
  const budgets = useDataStore((s) => s.budgets);
  const transactions = useDataStore((s) => s.transactions);
  const percent = useMemo(() => {
    const totalBudget = (budgets || []).reduce((sum, b) => sum + (Number(b?.limit) || Number(b?.amount) || 0), 0);
    const start = dateRange?.start ? new Date(dateRange.start) : null;
    const end = dateRange?.end ? new Date(dateRange.end) : null;
    const spent = (transactions || []).reduce((sum, tx) => {
      if (tx?.type !== 'expense') return sum;
      const d = parseDate(tx?.date) || null;
      if (!inRange(d, start, end)) return sum;
      return sum + (Number(tx?.amount) || 0);
    }, 0);
    if (totalBudget <= 0) return 0;
    return Math.min(100, Math.round((spent / totalBudget) * 100));
  }, [budgets, transactions, dateRange]);
  return <span>{percent}%</span>;
}

export function StatBudgetSpentTotal({ dateRange }) {
  const budgets = useDataStore((s) => s.budgets);
  const transactions = useDataStore((s) => s.transactions);
  const { spentDisplay, totalDisplay } = useMemo(() => {
    const totalBudget = (budgets || []).reduce((sum, b) => sum + (Number(b?.limit) || Number(b?.amount) || 0), 0);
    const start = dateRange?.start ? new Date(dateRange.start) : null;
    const end = dateRange?.end ? new Date(dateRange.end) : null;
    const spent = (transactions || []).reduce((sum, tx) => {
      if (tx?.type !== 'expense') return sum;
      const d = parseDate(tx?.date) || null;
      if (!inRange(d, start, end)) return sum;
      return sum + (Number(tx?.amount) || 0);
    }, 0);
    return { spentDisplay: formatCurrency(spent), totalDisplay: formatCurrency(totalBudget) };
  }, [budgets, transactions, dateRange]);
  return (
    <span>
      {spentDisplay} / {totalDisplay} spent
    </span>
  );
}
