import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ComposedChart,
  ReferenceLine,
  Cell,
} from 'recharts';
import {
  ArrowUpRight,
  CalendarDays,
  BarChart3,
  CheckCircle,
  Download,
  Loader2,
  Lock,
  LogOut,
  PiggyBank,
  PlusCircle,
  Settings2,
  Sparkles,
  Wallet,
  Pencil,
  Trash2,
  Cog,
  ChevronLeft,
  ChevronRight,
  X,
  AlertTriangle,
  ThumbsUp,
  Info,
} from 'lucide-react';
import { serverTimestamp } from 'firebase/firestore';
import {
  formatCurrency,
  startOfDay,
  endOfDay,
  formatMonthYear,
  calculateNetMonthlySavings,
} from '../utils/helpers';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { useTheme } from '../contexts/ThemeContext';
import { card } from '../theme/styles';
import D3SpendingByCategory from '../components/d3/D3SpendingByCategory.jsx';
import { useDataSelector } from '../hooks/useDataSelector';
import { StatSafeToSpend, StatNetWorthValue, StatBudgetProgress, StatBudgetSpentTotal } from '../components/dashboard/StatCards.jsx';
const NetWorthBarsLazy = React.lazy(() => import('../components/three/NetWorthBars.jsx'));
const ForceGraphLazy = React.lazy(() => import('../components/d3/ForceGraph.jsx'));

const DashboardView = ({
    userDoc,
    transactions: pTransactions,
    goals: pGoals,
    onAddTransaction,
    onAddGoal,
    onLogout,
    selectedMonth,
    dateRange,
    onPrevMonth,
    onNextMonth,
    onUpdateTransaction,
    onDeleteTransaction,
    onUpdateProfile,
    budgets: pBudgets,
    onUpsertBudget,
    onContributeToGoal,
    accounts: pAccounts,
    onUpsertAccount,
    isInitialLink = false,
    isSyncingTransactions = false,
    accountsData = [],
    onShowPricingModal,
    onDateRangeChange = () => {},
    onNavChange = () => {},
  }) => {
    // Select slices directly from external store to avoid unnecessary re-renders
    const transactions = useDataSelector((s) => s.transactions);
    const goals = useDataSelector((s) => s.goals);
    const budgets = useDataSelector((s) => s.budgets);
    const accounts = useDataSelector((s) => s.accounts);
    const dataLoading = useDataSelector((s) => s.loading);
    const { themeColors } = useTheme();
    const [expenseForm, setExpenseForm] = useState({ description: '', amount: '', category: 'General', accountId: '' });
    const [incomeForm, setIncomeForm] = useState({ description: '', amount: '', accountId: '' });
    const [goalForm, setGoalForm] = useState({ name: '', type: 'savings', targetAmount: '', currentAmount: '' });
    const [rate, setRate] = useState(0.04);
    const [projectionHorizon, setProjectionHorizon] = useState(5);
    const greetingName = useMemo(() => {
      if (userDoc?.displayName) return userDoc.displayName.split(' ')[0];
      if (userDoc?.email) return userDoc.email.split('@')[0];
      return 'Investor';
    }, [userDoc]);

    const [accountFilter, setAccountFilter] = useState('all');
    const [datePreset, setDatePreset] = useState(dateRange?.type || 'month');
    const [customDateDraft, setCustomDateDraft] = useState(() => ({
      start: dateRange?.start ? dateRange.start.slice(0, 10) : '',
      end: dateRange?.end ? dateRange.end.slice(0, 10) : '',
    }));

    useEffect(() => {
      setDatePreset(dateRange?.type || 'custom');
      setCustomDateDraft({
        start: dateRange?.start ? dateRange.start.slice(0, 10) : '',
        end: dateRange?.end ? dateRange.end.slice(0, 10) : '',
      });
    }, [dateRange]);

    const buildRangePayload = (startDate, endDate, type = 'custom', labelOverride) => {
      const startValue = startDate ? startOfDay(startDate) : null;
      const endValue = endDate ? endOfDay(endDate) : null;
      const startIso = startValue ? startValue.toISOString() : null;
      const endIso = endValue ? endValue.toISOString() : null;
      let label = labelOverride;
      if (!label) {
        if (startValue && endValue) {
          const sameYear = startValue.getFullYear() === endValue.getFullYear();
          const startFormatter = new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: sameYear ? undefined : 'numeric',
          });
          const endFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          label = `${startFormatter.format(startValue)} – ${endFormatter.format(endValue)}`;
        } else if (startValue) {
          label = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(startValue);
        } else if (endValue) {
          label = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(endValue);
        } else {
          label = rangeLabel;
        }
      }
      return { type, start: startIso, end: endIso, label };
    };

    const getTransactionDate = (value) => {
      if (!value) return null;
      if (value instanceof Date) return value;
      if (typeof value.toDate === 'function') return value.toDate();
      return new Date(value);
    };

    // Spending by category (for current filtered date range)
  const spendingByCategory = useMemo(() => {
      if (!transactions || !Array.isArray(transactions)) return [];
      const map = new Map();
      for (const tx of transactions) {
        if (!tx || tx.type !== 'expense') continue;
        const name = tx.category || 'Uncategorized';
        const amount = Number(tx.amount) || 0;
        map.set(name, (map.get(name) || 0) + amount);
      }
      return Array.from(map.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Build force graph data: Accounts -> Categories -> Merchants (if available)
  const [showMerchants, setShowMerchants] = useState(true);

  const forceGraphData = useMemo(() => {
    const nodes = new Map();
    const links = new Map(); // key `${source}|${target}` -> weight

    const addNode = (id, label, r = 6) => {
      if (!nodes.has(id)) nodes.set(id, { id, label, r });
    };
    const addLink = (source, target, inc = 1) => {
      const key = `${source}|${target}`;
      links.set(key, (links.get(key) || 0) + inc);
    };

    // Seed account nodes
    (accounts || []).forEach((acc) => addNode(`acc:${acc.id || acc.name}`, acc.name || 'Account', 7));

    (transactions || []).forEach((tx) => {
      if (!tx || tx.type !== 'expense') return;
      const category = tx.category || 'Uncategorized';
      const accountId = tx.accountId || (tx.account && tx.account.id);
      const accountKey = accountId ? `acc:${accountId}` : 'acc:unknown';
      const categoryKey = `cat:${category}`;
      const amount = Number(tx.amount) || 0;
      addNode(accountKey, nodes.get(accountKey)?.label || 'Account', 7);
      addNode(categoryKey, category, 6);
      addLink(accountKey, categoryKey, amount);

      // Optional merchant tier
      const merchant = tx.merchant || tx.description;
      if (merchant && showMerchants) {
        const merchantKey = `mer:${merchant}`;
        addNode(merchantKey, merchant, 5);
        addLink(categoryKey, merchantKey, amount * 0.5);
      }
    });

    const nodeArr = Array.from(nodes.values());
    const linkArr = Array.from(links.entries()).map(([key, weight]) => {
      const [source, target] = key.split('|');
      // Map weight to link distance (heavier -> shorter)
      const distance = 140 - Math.max(0, Math.min(120, weight / 10));
      return { source, target, weight, distance, strength: 0.7 };
    });

    return { nodes: nodeArr, links: linkArr };
  }, [transactions, accounts, showMerchants]);

    const applyPresetRange = (preset) => {
      const today = new Date();
      if (preset === 'month') {
        const monthStart = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
        const monthEnd = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
        const payload = buildRangePayload(monthStart, monthEnd, 'month', formatMonthYear(selectedMonth));
        onDateRangeChange(payload);
        setCustomDateDraft({ start: payload.start.slice(0, 10), end: payload.end.slice(0, 10) });
        return;
      }

      if (preset === 'last30') {
        const end = today;
        const start = new Date(end);
        start.setDate(end.getDate() - 29);
        const payload = buildRangePayload(start, end, 'last30', 'Last 30 days');
        onDateRangeChange(payload);
        setCustomDateDraft({ start: payload.start.slice(0, 10), end: payload.end.slice(0, 10) });
        return;
      }

      if (preset === 'last90') {
        const end = today;
        const start = new Date(end);
        start.setDate(end.getDate() - 89);
        const payload = buildRangePayload(start, end, 'last90', 'Last 90 days');
        onDateRangeChange(payload);
        setCustomDateDraft({ start: payload.start.slice(0, 10), end: payload.end.slice(0, 10) });
        return;
      }

      if (preset === 'ytd') {
        const end = today;
        const start = new Date(end.getFullYear(), 0, 1);
        const payload = buildRangePayload(start, end, 'ytd', `${end.getFullYear()} YTD`);
        onDateRangeChange(payload);
        setCustomDateDraft({ start: payload.start.slice(0, 10), end: payload.end.slice(0, 10) });
        return;
      }
    };

    const handlePresetChange = (event) => {
      const value = event.target.value;
      setDatePreset(value);
      if (value !== 'custom') {
        applyPresetRange(value);
      }
    };

    const handleCustomRangeApply = () => {
      if (!customDateDraft.start || !customDateDraft.end) return;
      const startDate = new Date(customDateDraft.start);
      const endDate = new Date(customDateDraft.end);
      if (endDate < startDate) return;
      const payload = buildRangePayload(startDate, endDate, 'custom');
      onDateRangeChange(payload);
    };

    const resolvedDateRange = useMemo(() => {
      if (dateRange?.start || dateRange?.end) {
        return {
          start: dateRange?.start ? startOfDay(dateRange.start) : null,
          end: dateRange?.end ? endOfDay(dateRange.end) : null,
          type: dateRange?.type || 'custom',
          label: dateRange?.label || null,
        };
      }
      const fallbackStart = startOfDay(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1));
      const fallbackEnd = endOfDay(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0));
      return {
        start: fallbackStart,
        end: fallbackEnd,
        type: 'month',
        label: formatMonthYear(selectedMonth),
      };
    }, [dateRange, selectedMonth]);

    const rangeLabel = useMemo(() => {
      if (resolvedDateRange.label) return resolvedDateRange.label;
      const { start, end } = resolvedDateRange;
      if (start && end) {
        const sameYear = start.getFullYear() === end.getFullYear();
        const startFormatter = new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: sameYear ? undefined : 'numeric',
        });
        const endFormatter = new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
        return `${startFormatter.format(start)} - ${endFormatter.format(end)}`;
      }
      if (start) {
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(start);
      }
      if (end) {
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(end);
      }
      return formatMonthYear(selectedMonth);
    }, [resolvedDateRange, selectedMonth]);

    const isMonthRange = resolvedDateRange.type === 'month';

    const extractTransactionsForCategory = useCallback(
      (category) => {
        const target = category || 'General';
        const rangeStart = resolvedDateRange.start;
        const rangeEnd = resolvedDateRange.end;
        return transactions
          .filter((transaction) => {
            if (transaction.type !== 'expense') return false;
            const txDate = getTransactionDate(transaction.date);
            if (!txDate) return false;
            const inRange =
              (!rangeStart || txDate >= rangeStart) &&
              (!rangeEnd || txDate <= rangeEnd);
            if (!inRange) return false;
            const matchesAccount = accountFilter === 'all' || (transaction.accountId || '') === accountFilter;
            if (!matchesAccount) return false;
            const txCategory = transaction.category || 'General';
            return txCategory === target;
          })
          .sort((a, b) => {
            const dateA = getTransactionDate(a.date) || new Date(0);
            const dateB = getTransactionDate(b.date) || new Date(0);
            return dateB.getTime() - dateA.getTime();
          });
      },
      [accountFilter, resolvedDateRange.end, resolvedDateRange.start, transactions],
    );

    const [drilldown, setDrilldown] = useState(null);

    const drilldownDateFormatter = useMemo(
      () => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      [],
    );

    const filteredTransactions = useMemo(() => {
      return transactions.filter((transaction) => {
        const date = transaction.date?.toDate?.() || transaction.date || new Date();
        const txDate = date instanceof Date ? date : new Date(date);
        const inRange =
          (!resolvedDateRange.start || txDate >= resolvedDateRange.start) &&
          (!resolvedDateRange.end || txDate <= resolvedDateRange.end);
        const inAccount = accountFilter === 'all' || (transaction.accountId || '') === accountFilter;
        return inRange && inAccount;
      });
    }, [transactions, resolvedDateRange, accountFilter]);

    const totals = useMemo(() => {
      const income = (userDoc?.recurringIncome || 0) +
        filteredTransactions.filter((tx) => tx.type === 'income').reduce((sum, tx) => sum + (tx.amount || 0), 0);
      const expenses = (userDoc?.recurringExpenses || 0) +
        filteredTransactions.filter((tx) => tx.type === 'expense').reduce((sum, tx) => sum + (tx.amount || 0), 0);
      const net = income - expenses;
      return { income, expenses, net };
    }, [filteredTransactions, userDoc]);

    const expenseCategoryBreakdown = useMemo(() => {
      const breakdownMap = new Map();
      const pushAmount = (label, amount) => {
        if (!label || !amount) return;
        const current = breakdownMap.get(label) || 0;
        breakdownMap.set(label, current + amount);
      };

      if (userDoc?.recurringExpenses) {
        pushAmount('Recurring essentials', userDoc.recurringExpenses);
      }

      filteredTransactions.forEach((transaction) => {
        if (transaction.type !== 'expense') return;
        const label = transaction.category || 'General';
        pushAmount(label, transaction.amount || 0);
      });

      const totalSpend = Array.from(breakdownMap.values()).reduce((sum, value) => sum + value, 0);

      return Array.from(breakdownMap.entries())
        .map(([label, amount]) => ({
          label,
          amount,
          percentage: totalSpend > 0 ? (amount / totalSpend) * 100 : 0,
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);
    }, [filteredTransactions, userDoc]);

    const spendingTrendData = useMemo(() => {
      if (!transactions || transactions.length === 0) return [];

      const referenceMonth = selectedMonth ? new Date(selectedMonth) : new Date();
      const currentStart = new Date(referenceMonth.getFullYear(), referenceMonth.getMonth(), 1);
      const nextMonthStart = new Date(referenceMonth.getFullYear(), referenceMonth.getMonth() + 1, 1);
      const previousMonthStart = new Date(referenceMonth.getFullYear(), referenceMonth.getMonth() - 1, 1);

      const matchesAccount = (transaction) =>
        accountFilter === 'all' || (transaction.accountId || '') === accountFilter;

      const toJsDate = (dateLike) => {
        if (!dateLike) return null;
        if (typeof dateLike.toDate === 'function') return dateLike.toDate();
        return new Date(dateLike);
      };

      const aggregateByCategory = (rangeStart, rangeEnd) => {
        const totals = new Map();
        transactions.forEach((transaction) => {
          if (transaction.type !== 'expense' || !matchesAccount(transaction)) return;
          const txDate = toJsDate(transaction.date);
          if (!txDate || txDate < rangeStart || txDate >= rangeEnd) return;

          const amount = Number(transaction.amount) || 0;
          if (amount <= 0) return;

          const category = transaction.category || 'General';
          totals.set(category, (totals.get(category) || 0) + amount);
        });
        return totals;
      };

      const normalizeValue = (value) => Math.round(value * 100) / 100;

      const currentTotals = aggregateByCategory(currentStart, nextMonthStart);
      if (currentTotals.size === 0) return [];

      const previousTotals = aggregateByCategory(previousMonthStart, currentStart);

      const topCategories = Array.from(currentTotals.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      return topCategories.map(([category, currentValue]) => {
        const previousValue = previousTotals.get(category) || 0;
        return {
          category,
          currentMonthSpending: normalizeValue(currentValue),
          previousMonthSpending: normalizeValue(previousValue),
        };
      });
    }, [transactions, selectedMonth, accountFilter]);

    const hasSpendingTrendData = spendingTrendData.length > 0;
    const userPlan = userDoc?.plan || 'free';
    const isPremium = userPlan !== 'free';

    const projectionData = useMemo(() => {
      const baseSavings = Math.max(
        calculateNetMonthlySavings(userDoc?.recurringIncome, userDoc?.recurringExpenses, filteredTransactions),
        0,
      );
      const annualContribution = baseSavings * 12;
      let runningTotal = 0;
      const projection = [];
      for (let year = 1; year <= projectionHorizon; year += 1) {
        runningTotal = (runningTotal + annualContribution) * (1 + rate);
        projection.push({ year: `Year ${year}`, savings: Number(runningTotal.toFixed(2)) });
      }
      return projection;
    }, [filteredTransactions, projectionHorizon, rate, userDoc]);

    const cashFlowWaterfallData = useMemo(() => {
      const incomeTotal = Number(totals.income || 0);
      if (incomeTotal <= 0) return [];

      const steps = [
        {
          key: 'income',
          name: 'Income',
          value: incomeTotal,
          type: 'income',
        },
      ];

      let trackedExpenseTotal = 0;
      expenseCategoryBreakdown.slice(0, 4).forEach((entry) => {
        const amount = Number(entry.amount) || 0;
        if (amount <= 0) return;
        trackedExpenseTotal += amount;
        steps.push({
          key: `expense-${entry.label}`,
          name: entry.label,
          value: -amount,
          type: 'expense',
        });
      });

      const remainingExpenses = Math.max(Number(totals.expenses || 0) - trackedExpenseTotal, 0);
      if (remainingExpenses > 0) {
        steps.push({
          key: 'expense-other',
          name: 'Other spend',
          value: -remainingExpenses,
          type: 'expense',
        });
      }

      steps.push({
        key: 'net',
        name: 'Net savings',
        value: Number(totals.net || 0),
        type: totals.net >= 0 ? 'net-positive' : 'net-negative',
        isTotal: true,
      });

      let runningTotal = 0;
      return steps.map((step, index) => {
        if (step.isTotal) {
          return {
            ...step,
            start: 0,
            end: runningTotal,
            base: Math.min(0, runningTotal),
            delta: Math.abs(runningTotal),
            displayValue: runningTotal,
            cumulative: runningTotal,
            sequence: index,
          };
        }
        const start = runningTotal;
        const end = start + step.value;
        runningTotal = end;
        return {
          ...step,
          start,
          end,
          base: start,
          delta: Math.abs(step.value),
          displayValue: step.value,
          cumulative: end,
          sequence: index,
        };
      });
    }, [expenseCategoryBreakdown, totals]);

    const shortDateFormatter = useMemo(
      () =>
        new Intl.DateTimeFormat('en-GB', {
          day: 'numeric',
          month: 'short',
        }),
      [],
    );

    const cashFlowCalendarData = useMemo(() => {
      const resolvedMonth =
        selectedMonth instanceof Date && !Number.isNaN(selectedMonth.valueOf())
          ? new Date(selectedMonth)
          : new Date();
      const year = resolvedMonth.getFullYear();
      const monthIndex = resolvedMonth.getMonth();
      const monthStart = new Date(year, monthIndex, 1);
      const monthEnd = new Date(year, monthIndex + 1, 0);
      const daysInMonth = monthEnd.getDate();
      const firstDayOffset = monthStart.getDay();

      const toDate = (value) => {
        const date = getTransactionDate(value);
        return date instanceof Date && !Number.isNaN(date.valueOf()) ? date : null;
      };

      const ensureMonthDate = (referenceDate) => {
        if (!referenceDate) return null;
        const dayOfMonth = Math.min(referenceDate.getDate(), daysInMonth);
        return new Date(year, monthIndex, dayOfMonth);
      };

      const groupRecurring = (list) => {
        const groups = new Map();
        list.forEach((transaction) => {
          const txDate = toDate(transaction.date);
          if (!txDate) return;
          const key = (transaction.description || transaction.category || transaction.id || transaction.type || '')
            .toString()
            .toLowerCase()
            .trim();
          if (!groups.has(key)) groups.set(key, []);
          groups.get(key).push({ ...transaction, date: txDate });
        });
        const recurring = [];
        groups.forEach((entries) => {
          if (entries.length < 2) return;
          entries.sort((a, b) => a.date - b.date);
          recurring.push(entries[entries.length - 1]);
        });
        return recurring;
      };

      const incomeTransactions = (transactions || []).filter((transaction) => transaction.type === 'income');
      const expenseTransactions = (transactions || []).filter((transaction) => transaction.type === 'expense');

      const recurringIncomeMarkers = groupRecurring(incomeTransactions)
        .map((entry) => {
          const predictedDate = ensureMonthDate(entry.date);
          if (!predictedDate || predictedDate.getMonth() !== monthIndex) return null;
          return {
            key: `recurring-income-${entry.id || entry.description || entry.date?.toString()}`,
            date: predictedDate,
            type: 'income',
            label: entry.description || 'Recurring income',
            amount: Number(entry.amount) || 0,
            kind: 'recurring-income',
          };
        })
        .filter(Boolean);

      const recurringExpenseMarkers = groupRecurring(expenseTransactions)
        .map((entry) => {
          const predictedDate = ensureMonthDate(entry.date);
          if (!predictedDate || predictedDate.getMonth() !== monthIndex) return null;
          return {
            key: `recurring-expense-${entry.id || entry.description || entry.date?.toString()}`,
            date: predictedDate,
            type: 'expense',
            label: entry.description || entry.category || 'Recurring expense',
            amount: Math.abs(Number(entry.amount) || 0),
            kind: 'recurring-expense',
          };
        })
        .filter(Boolean);

      const monthExpenseCandidates = expenseTransactions
        .map((transaction) => {
          const date = toDate(transaction.date);
          return {
            ...transaction,
            date,
            amount: Math.abs(Number(transaction.amount) || 0),
          };
        })
        .filter(
          (entry) =>
            entry.date &&
            entry.date.getFullYear() === year &&
            entry.date.getMonth() === monthIndex &&
            entry.amount > 0,
        )
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 3)
        .map((entry) => ({
          key: `major-expense-${entry.id || entry.description || entry.date?.toISOString()}`,
          date: entry.date,
          type: 'expense',
          label: entry.description || entry.category || 'Upcoming bill',
          amount: entry.amount,
          kind: 'major-expense',
        }));

      const markers = [...recurringIncomeMarkers, ...recurringExpenseMarkers];

      const seenMarkerKeys = new Set(markers.map((marker) => `${marker.type}-${marker.date.toDateString()}-${marker.label}`));
      monthExpenseCandidates.forEach((candidate) => {
        const markerKey = `${candidate.type}-${candidate.date.toDateString()}-${candidate.label}`;
        if (!seenMarkerKeys.has(markerKey)) {
          markers.push(candidate);
        }
      });

      if (markers.length === 0) {
        if (Number(userDoc?.recurringIncome) > 0) {
          markers.push({
            key: 'fallback-income',
            date: new Date(year, monthIndex, Math.min(1, daysInMonth)),
            type: 'income',
            label: 'Recurring income',
            amount: Number(userDoc.recurringIncome) || 0,
            kind: 'recurring-income',
          });
        }
        if (Number(userDoc?.recurringExpenses) > 0) {
          markers.push({
            key: 'fallback-expense',
            date: new Date(year, monthIndex, Math.min(15, daysInMonth)),
            type: 'expense',
            label: 'Recurring expenses',
            amount: Number(userDoc.recurringExpenses) || 0,
            kind: 'recurring-expense',
          });
        }
      }

      const markersByDay = new Map();
      markers.forEach((marker) => {
        if (!marker?.date) return;
        const dayOfMonth = marker.date.getDate();
        if (!markersByDay.has(dayOfMonth)) markersByDay.set(dayOfMonth, []);
        const dayEntries = markersByDay.get(dayOfMonth);
        dayEntries.push(marker);
      });

      const cells = [];
      for (let spacer = 0; spacer < firstDayOffset; spacer += 1) {
        cells.push({ key: `spacer-${spacer}`, type: 'spacer' });
      }
      for (let day = 1; day <= daysInMonth; day += 1) {
        cells.push({
          key: `day-${day}`,
          type: 'day',
          day,
          markers: markersByDay.get(day) || [],
        });
      }

      const sortedIncomeMarkers = markers
        .filter((marker) => marker.type === 'income')
        .sort((a, b) => a.date - b.date);

      return {
        cells,
        nextIncome: sortedIncomeMarkers[0]?.date || null,
        upcomingBills: markers.filter((marker) => marker.type === 'expense').length,
      };
    }, [selectedMonth, transactions, userDoc?.recurringExpenses, userDoc?.recurringIncome]);

    const waterfallHasData = cashFlowWaterfallData.length > 0;
    const cashFlowWeekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const waterfallColorByType = {
      income: themeColors.primary,
      expense: themeColors.destructive,
      'net-positive': themeColors.success,
      'net-negative': themeColors.destructive,
    };
    const cashFlowWaterfallChartData = useMemo(() => {
      if (!waterfallHasData) return [];
      return cashFlowWaterfallData.map((step) => {
        const positive = step.displayValue >= 0;
        const netStep = step.isTotal;
        const baseValue = positive ? step.start : step.start;
        const deltaPositive = positive ? step.delta : 0;
        const deltaNegative = positive ? 0 : -step.delta;
        return {
          key: step.key,
          name: step.name,
          type: step.type,
          base: netStep ? 0 : baseValue,
          deltaPositive: netStep ? Math.max(step.displayValue, 0) : deltaPositive,
          deltaNegative: netStep ? Math.min(step.displayValue, 0) : deltaNegative,
          displayValue: step.displayValue,
          cumulative: step.cumulative,
          sequence: step.sequence,
        };
      });
    }, [cashFlowWaterfallData, waterfallHasData]);

    const [editTx, setEditTx] = useState(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [settingsForm, setSettingsForm] = useState({
      recurringIncome: userDoc?.recurringIncome || 0,
      recurringExpenses: userDoc?.recurringExpenses || 0,
    });

    const [contributeGoal, setContributeGoal] = useState(null);
    const [contributeAmount, setContributeAmount] = useState('');

    const [budgetsOpen, setBudgetsOpen] = useState(false);
    const [budgetForm, setBudgetForm] = useState({ category: 'General', amount: '' });
    const [accountsOpen, setAccountsOpen] = useState(false);
    const [accountName, setAccountName] = useState('');

    const [showFirstTransactionPrompt, setShowFirstTransactionPrompt] = useState(true);
    const transactionCount = Array.isArray(transactions) ? transactions.length : 0;
    const shouldShowFirstTransactionPrompt = showFirstTransactionPrompt && transactionCount === 0;

    useEffect(() => {
      if (transactionCount > 0) {
        setShowFirstTransactionPrompt(false);
      }
    }, [transactionCount]);

    const [showOnboardingChecklist, setShowOnboardingChecklist] = useState(isInitialLink);

    useEffect(() => {
      if (isInitialLink) {
        setShowOnboardingChecklist(true);
      }
    }, [isInitialLink]);

    const accountSummaries = useMemo(() => {
      if (Array.isArray(accountsData) && accountsData.length > 0) {
        return accountsData.map((account) => ({
          id: account.id,
          name: account.name || 'Account',
          balance: Number(account.balance) || 0,
          type: account.type || account.accountType || '',
        }));
      }
      if (Array.isArray(accounts) && accounts.length > 0) {
        return accounts
          .filter((account) => typeof account.balance === 'number')
          .map((account) => ({
            id: account.id,
            name: account.name || 'Account',
            balance: Number(account.balance) || 0,
            type: account.type || account.accountType || '',
          }));
      }
      return [];
    }, [accountsData, accounts]);

    const totalLinkedBalance = useMemo(
      () => accountSummaries.reduce((sum, account) => sum + (account.balance || 0), 0),
      [accountSummaries],
    );
    const hasLinkedAccounts = accountSummaries.length > 0;

    const onboardingChecklistItems = useMemo(
      () => [
        {
          id: 'goal',
          title: 'Set your first savings goal',
          description: 'Create a savings or debt payoff goal to give your new data a purpose.',
        },
        {
          id: 'categories',
          title: 'Review your spending categories',
          description: 'Check that upcoming transactions are organised the way you expect.',
        },
        {
          id: 'projection',
          title: 'Explore your financial projection',
          description: 'See how your recurring income and expenses shape the path ahead.',
        },
      ],
      [],
    );

    const shouldShowChecklist = isInitialLink && showOnboardingChecklist;

    const handleExpenseSubmit = async (event) => {
      event.preventDefault();
      if (!expenseForm.description || !expenseForm.amount) return;
      await onAddTransaction({
        type: 'expense',
        description: expenseForm.description,
        amount: Number(expenseForm.amount),
        category: expenseForm.category,
        accountId: expenseForm.accountId || '',
      });
      setExpenseForm({ description: '', amount: '', category: 'General', accountId: '' });
    };

    const handleIncomeSubmit = async (event) => {
      event.preventDefault();
      if (!incomeForm.description || !incomeForm.amount) return;
      await onAddTransaction({
        type: 'income',
        description: incomeForm.description,
        amount: Number(incomeForm.amount),
        category: 'Income',
        accountId: incomeForm.accountId || '',
      });
      setIncomeForm({ description: '', amount: '', accountId: '' });
    };

    const handleGoalSubmit = async (event) => {
      event.preventDefault();
      if (!goalForm.name || !goalForm.targetAmount) return;
      const payload = {
        name: goalForm.name,
        targetAmount: Number(goalForm.targetAmount),
        createdAt: serverTimestamp(),
      };
      if (goalForm.type === 'debt') {
        payload.isDebt = true;
        payload.currentAmount = Number(goalForm.currentAmount) || 0;
      }
      await onAddGoal(payload);
      setGoalForm({ name: '', type: 'savings', targetAmount: '', currentAmount: '' });
    };

    const netMonthlySavings = calculateNetMonthlySavings(
      userDoc?.recurringIncome,
      userDoc?.recurringExpenses,
      filteredTransactions,
    );
    const monthlySavings = Math.max(netMonthlySavings, 0);
    const annualSavingsProjection = Math.max(monthlySavings * 12, 0);
    const savingsRate = totals.income > 0 ? Math.max((netMonthlySavings / totals.income) * 100, 0) : 0;
    const manualEntryCount = filteredTransactions.length;
  const quickAddSectionClasses = card({
    className: [
      'lg:col-span-2',
      shouldShowFirstTransactionPrompt &&
        'relative ring-2 ring-emerald-300 shadow-xl transition duration-300',
    ],
  });
  const expenseFormCardClasses = card({
    variant: 'muted',
    padding: 'sm',
    className: [
      'space-y-3',
      shouldShowFirstTransactionPrompt && 'border-emerald-200 shadow-md',
    ],
  });
  const incomeFormCardClasses = card({
    variant: 'muted',
    padding: 'sm',
    className: 'space-y-3',
  });
  const goalFormCardClasses = card({
    variant: 'muted',
    padding: 'sm',
    className: 'mt-4 space-y-3',
  });
    const prioritizedGoal = useMemo(() => {
      const monthly = monthlySavings;
      if (!monthly || monthly <= 0) return null;
      const goalsWithTimeline = goals
        .map((goal) => {
          const currentAmount = goal.currentAmount || 0;
          const remaining = Math.max(goal.targetAmount - currentAmount, 0);
          return {
            ...goal,
            months: remaining > 0 ? Math.ceil(remaining / monthly) : 0,
          };
        })
        .filter((goal) => goal.months !== null)
        .sort((a, b) => a.months - b.months);
      return goalsWithTimeline[0] || null;
    }, [goals, monthlySavings]);

    const insightCards = useMemo(
      () => [
        {
          title: 'Savings rate',
          value: `${Math.round(savingsRate)}%`,
          caption: 'of monthly income preserved',
          accent: savingsRate >= 20,
          detail: `Based on ${formatCurrency(totals.income)} tracked income vs ${formatCurrency(totals.expenses)} expenses during ${rangeLabel}.`,
        },
        {
          title: 'Year-end projection',
          value: formatCurrency(annualSavingsProjection),
          caption: 'If you maintain this pace all year',
          accent: true,
          detail: `Assumes keeping ${formatCurrency(monthlySavings)} aside each month through the end of the year.`,
        },
        {
          title: 'Fixed commitments',
          value: formatCurrency(userDoc?.recurringExpenses || 0),
          caption: 'Recurring expenses each month',
          accent: false,
          detail: 'Compares your logged fixed bills to your variable spending. Lowering recurring costs frees up future budget.',
        },
        {
          title: 'Active goals',
          value: `${goals.length}`,
          caption: 'Targets in your plan',
          accent: goals.length > 0,
          detail: goals.length > 0
            ? 'Tap to review your current goal timeline and accelerate the next milestone.'
            : 'Set a goal to give your savings a mission.',
        },
      ],
      [
        annualSavingsProjection,
        goals.length,
        monthlySavings,
        rangeLabel,
        savingsRate,
        totals.expenses,
        totals.income,
        userDoc?.recurringExpenses,
      ],
    );

    const aiInsights = useMemo(() => {
      if (!isPremium) return [];

      const insights = [];
      const netValue = Number(totals.net || 0);
      const incomeTotal = Number(totals.income || 0);
      const expenseTotal = Number(totals.expenses || 0);
      const positiveSavingsRate = Number.isFinite(savingsRate) ? savingsRate : 0;

      if (netValue < 0) {
        insights.push({
          id: 'insight-spending-alert',
          tone: 'alert',
          title: 'Spending alert',
          body: `You're overspending by ${formatCurrency(Math.abs(netValue))} during ${rangeLabel}. Focus on the largest categories first.`,
        });
      }

      if (positiveSavingsRate >= 20) {
        insights.push({
          id: 'insight-strong-savings',
          tone: 'positive',
          title: 'Great savings rate!',
          body: `You're keeping ${positiveSavingsRate.toFixed(0)}% of your income aside. Keep the momentum going!`,
        });
      } else if (monthlySavings > 0) {
        insights.push({
          id: 'insight-projection',
          tone: 'positive',
          title: 'Savings momentum',
          body: `At this pace you could set aside ${formatCurrency(monthlySavings * 12)} over the next year.`,
        });
      }

      if (insights.length === 0 && incomeTotal > 0) {
        insights.push({
          id: 'insight-spending-balance',
          tone: 'info',
          title: 'Track spending mix',
          body: `You're allocating ${formatCurrency(expenseTotal)} against ${formatCurrency(incomeTotal)} income. Review the Cash Flow Waterfall to stay balanced.`,
        });
      }

      return insights.slice(0, 3);
    }, [isPremium, monthlySavings, rangeLabel, savingsRate, totals.expenses, totals.income, totals.net]);

    const aiIconByTone = {
      alert: AlertTriangle,
      positive: ThumbsUp,
      info: Info,
    };

    const handleCategoryDrilldown = useCallback(
      (category) => {
        if (!category) return;
        const matches = extractTransactionsForCategory(category);
        const trend = spendingTrendData.find((entry) => entry.category === category);
        setDrilldown({
          type: 'category',
          title: `${category} spending`,
          category,
          transactions: matches,
          metrics: trend
            ? {
                current: trend.currentMonthSpending,
                previous: trend.previousMonthSpending,
                delta: trend.currentMonthSpending - trend.previousMonthSpending,
              }
            : null,
        });
      },
      [extractTransactionsForCategory, spendingTrendData],
    );

    const closeDrilldown = useCallback(() => {
      setDrilldown(null);
    }, []);

    const handleHeadlineCardClick = useCallback((card) => {
      if (!card) return;
      setDrilldown({
        type: 'insight',
        title: card.title,
        insight: { body: card.detail, caption: card.caption },
      });
    }, []);

    const handleCustomizeClick = useCallback(() => {
      if (!isPremium) {
        if (typeof onShowPricingModal === 'function') onShowPricingModal();
        return;
      }
      console.log('Open customize modal');
    }, [isPremium, onShowPricingModal]);

    const handleExportTransactions = useCallback(() => {
      if (!isPremium) {
        if (typeof onShowPricingModal === 'function') onShowPricingModal();
        return;
      }
      console.log('Initiate CSV export');
    }, [isPremium, onShowPricingModal]);

    const handleInsightSelect = useCallback(
      (insight) => {
        if (!insight) return;
        if (insight.category) {
          handleCategoryDrilldown(insight.category);
          return;
        }
        setDrilldown({
          type: 'insight',
          title: insight.title,
          insight,
        });
      },
      [handleCategoryDrilldown],
    );

    const safeToSpendDisplay = '\u00A31,234';
    const netWorthDisplay = '\u00A356,789';
    const netWorthChangeDisplay = '+1.2%';
    const budgetProgress = 60;
    const budgetSpentDisplay = '\u00A31500';
    const budgetTotalDisplay = '\u00A32500';

    return (
      <div className="min-h-screen bg-surface">
        <header
          className={card({
            variant: 'glass',
            padding: 'none',
            className: 'rounded-none border-x-0 border-t-0 border-b border-border/70 shadow-none backdrop-blur',
          })}
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Nest Finance</p>
              <h1 className="text-2xl font-semibold text-text-primary">Secure Financial Command Center</h1>
            </div>
            <div className="flex items-center gap-3">
              {onShowPricingModal ? (
                <button
                  type="button"
                  onClick={onShowPricingModal}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-surface px-4 py-2 text-sm font-semibold text-emerald-600 shadow-sm transition hover:border-emerald-400 hover:text-emerald-700"
                >
                  Show Pricing Modal (Test)
                </button>
              ) : null}
              <button onClick={onLogout} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary transition hover:border-primary/70 hover:text-primary">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-8">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div
                className={card({
                  padding: 'none',
                  className: 'inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1 text-xs font-medium text-text-secondary shadow-none',
                })}
              >
                <button
                  aria-label="Previous month"
                  onClick={isMonthRange ? onPrevMonth : undefined}
                  className={`rounded-full p-1 transition ${isMonthRange ? 'hover:bg-surface-muted/70' : 'cursor-not-allowed opacity-40'}`}
                  disabled={!isMonthRange}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span>{rangeLabel}</span>
                <button
                  aria-label="Next month"
                  onClick={isMonthRange ? onNextMonth : undefined}
                  className={`rounded-full p-1 transition ${isMonthRange ? 'hover:bg-surface-muted/70' : 'cursor-not-allowed opacity-40'}`}
                  disabled={!isMonthRange}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <select
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary transition hover:border-primary/70 hover:text-text-primary"
                value={datePreset}
                onChange={handlePresetChange}
              >
                <option value="month">This month</option>
                <option value="last30">Last 30 days</option>
                <option value="last90">Last 90 days</option>
                <option value="ytd">Year to date</option>
                <option value="custom">Custom range</option>
              </select>
              {datePreset === 'custom' ? (
                <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
                  <label className="sr-only" htmlFor="custom-range-start">Range start</label>
                  <input
                    id="custom-range-start"
                    type="date"
                    value={customDateDraft.start}
                    onChange={(event) => setCustomDateDraft((prev) => ({ ...prev, start: event.target.value }))}
                    className="rounded-lg border border-border bg-surface px-2 py-1 text-xs text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/40 focus:outline-none"
                  />
                  <span className="text-text-muted">to</span>
                  <label className="sr-only" htmlFor="custom-range-end">Range end</label>
                  <input
                    id="custom-range-end"
                    type="date"
                    value={customDateDraft.end}
                    min={customDateDraft.start || undefined}
                    onChange={(event) => setCustomDateDraft((prev) => ({ ...prev, end: event.target.value }))}
                    className="rounded-lg border border-border bg-surface px-2 py-1 text-xs text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/40 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCustomRangeApply}
                    disabled={!customDateDraft.start || !customDateDraft.end}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      customDateDraft.start && customDateDraft.end
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                        : 'cursor-not-allowed bg-surface-muted text-text-muted'
                    }`}
                  >
                    Apply
                  </button>
                </div>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                className="rounded-pill border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary transition hover:border-primary hover:text-text-primary"
                value={accountFilter}
                onChange={(e) => setAccountFilter(e.target.value)}
                title="View by account"
              >
                <option value="all">All accounts</option>
                {(accounts || []).map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setAccountsOpen(true)}
                className="btn btn-secondary"
              >
                Accounts
              </button>
              <button
                type="button"
                onClick={handleCustomizeClick}
                className="btn btn-primary"
              >
                <Settings2 className="h-4 w-4" />
                Customize
              </button>
              <button
                onClick={() => {
                  setSettingsForm({
                    recurringIncome: userDoc?.recurringIncome || 0,
                    recurringExpenses: userDoc?.recurringExpenses || 0,
                  });
                  setSettingsOpen(true);
                }}
                className="btn btn-secondary"
              >
                <Cog className="h-4 w-4" />
                Settings
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

            <section className={card({ className: 'lg:col-span-3' })}>
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">At-a-Glance</p>
                  <h2 className="mt-2 text-xl font-semibold text-text-primary">Today's financial pulse</h2>
                </div>
                <p className="text-xs text-text-muted">Snapshot prototype - Placeholder values</p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div
                  className={card({ variant: 'muted', padding: 'md', className: 'space-y-3 shadow-none' })}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Safe to Spend</p>
                  <p className="mt-3 text-3xl font-semibold text-text-primary">
                    <StatSafeToSpend userDoc={userDoc} dateRange={dateRange} />
                  </p>
                  <p className="mt-1 text-xs text-text-muted">After upcoming bills & goals.</p>
                </div>
                <div className={card({ padding: 'md', className: 'space-y-3' })}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Net Worth</p>
                      <p className="mt-3 text-3xl font-semibold text-text-primary"><StatNetWorthValue /></p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {netWorthChangeDisplay}
                    </span>
                  </div>
                  <div className="mt-4 flex h-16 items-center justify-center rounded-lg border border-dashed border-border/60 bg-surface-muted text-xs font-medium text-text-muted">
                    [Sparkline]
                  </div>
                </div>
                <div className={card({ padding: 'md', className: 'space-y-3' })}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Monthly Budget</p>
                  <div className="mt-3 flex items-baseline gap-2">
                    <p className="text-3xl font-semibold text-text-primary"><StatBudgetProgress dateRange={dateRange} /></p>
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary">60% full</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-surface-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${budgetProgress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-text-muted">
                    <StatBudgetSpentTotal dateRange={dateRange} />
                  </p>
                </div>
              </div>
            </section>

            {/* D3: Spending by Category (Alpha) */}
            <section className={card({ padding: 'lg' })}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text-primary">Spending by Category (D3)</h2>
                <p className="text-sm text-text-secondary">Theme-aware via CSS variables</p>
              </div>
              <div className="mt-4">
                {spendingByCategory && spendingByCategory.length > 0 ? (
                  <D3SpendingByCategory data={spendingByCategory} />
                ) : (
                  <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-border/60 bg-surface-muted p-6 text-center text-sm text-text-secondary">
                    Not enough data to render categories yet.
                  </div>
                )}
              </div>
            </section>

            {/* 3D: Net Worth Bars (Alpha) */}
            <section className={card({ padding: 'lg' })}>
              <h2 className="text-lg font-semibold text-text-primary">Net Worth (3D)</h2>
              <p className="text-sm text-text-secondary">GPU-accelerated bars; updates without full re-render</p>
              <div className="mt-4">
                <React.Suspense fallback={<div className="h-72" />}>
                  {accounts ? <NetWorthBarsLazy accounts={accounts} /> : null}
                </React.Suspense>
              </div>
            </section>

            {/* D3 Force Graph (Workerised) */}
            <section className={card({ padding: 'lg' })}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text-primary">Spending Relationships (D3 Force)</h2>
                <p className="text-sm text-text-secondary">Simulation runs in a Web Worker</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-text-secondary">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border"
                    checked={showMerchants}
                    onChange={(e) => setShowMerchants(e.target.checked)}
                  />
                  Show merchants
                </label>
                <div className="flex items-center gap-4 text-xs text-text-muted">
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                    Category
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-secondary" />
                    Account
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-accent" />
                    Merchant
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <React.Suspense fallback={<div className="h-80" />}>
                  <ForceGraphLazy
                    data={forceGraphData}
                    onNodeSelect={(n) => {
                      const id = n?.id || '';
                      if (id.startsWith('cat:')) {
                        const name = n.label || id.slice(4);
                        handleCategoryDrilldown(name);
                      } else if (id.startsWith('acc:')) {
                        setDrilldown({ type: 'account', title: n.label || 'Account', node: n });
                      } else if (id.startsWith('mer:')) {
                        setDrilldown({ type: 'merchant', title: n.label || 'Merchant', node: n });
                      }
                    }}
                  />
                </React.Suspense>
              </div>
            </section>

            <section
              className="relative overflow-hidden rounded-3xl border border-emerald-100/60 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-700 p-8 text-emerald-50 shadow-2xl lg:col-span-2"
            >
            <div className="pointer-events-none absolute inset-0 opacity-80">
              <div className="absolute -left-16 top-16 h-40 w-40 rounded-full bg-surface opacity-20 blur-3xl" />
              <div className="absolute -right-12 bottom-0 h-48 w-48 rounded-full bg-emerald-300/30 blur-3xl" />
            </div>
            <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-surface bg-opacity-10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100">
                  <Sparkles className="h-4 w-4" />
                  Personalized briefing
                </div>
                <div>
                  <h2 className="text-3xl font-semibold">Welcome back, {greetingName}</h2>
                  <p className="mt-2 text-sm text-emerald-50/80">
                      Here's the state of your finances today. Keep logging transactions to fine-tune these projections.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className={`subtle-chip text-left text-sm text-emerald-50/90`}>
                  <p className="text-xs font-medium uppercase tracking-wide text-emerald-100/80">Net monthly position</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{formatCurrency(totals.net)}</p>
                  <p className="mt-1 flex items-center gap-2 text-xs text-emerald-100/70">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      {monthlySavings > 0
                        ? `${formatCurrency(annualSavingsProjection)} projected this year`
                        : 'Track expenses to turn this positive'}
                  </p>
                </div>
                <div className={`subtle-chip text-left text-sm text-emerald-50/90`}>
                  <p className="text-xs font-medium uppercase tracking-wide text-emerald-100/80">Manual entries - {rangeLabel}</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{manualEntryCount}</p>
                  <p className="mt-1 flex items-center gap-2 text-xs text-emerald-100/70">
                      <BarChart3 className="h-3.5 w-3.5" />
                      {manualEntryCount === 0 ? 'Add new transactions to unlock trends' : 'Real-time analytics enabled'}
                  </p>
                </div>
                <div className={`subtle-chip text-left text-sm text-emerald-50/90`}>
                  <p className="text-xs font-medium uppercase tracking-wide text-emerald-100/80">Recurring income</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{formatCurrency(userDoc?.recurringIncome || 0)}</p>
                  <p className="mt-1 flex items-center gap-2 text-xs text-emerald-100/70">
                      <Wallet className="h-3.5 w-3.5" />
                      Foundation for your baseline lifestyle
                  </p>
                </div>
                <div className={`subtle-chip text-left text-sm text-emerald-50/90`}>
                  <p className="text-xs font-medium uppercase tracking-wide text-emerald-100/80">Goals momentum</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{goals.length}</p>
                  <p className="mt-1 flex items-center gap-2 text-xs text-emerald-100/70">
                      <PiggyBank className="h-3.5 w-3.5" />
                      {goals.length === 0
                        ? 'Set a goal to give savings direction'
                        : prioritizedGoal
                          ? `${prioritizedGoal.months} month${prioritizedGoal.months === 1 ? '' : 's'} to ${prioritizedGoal.name}`
                          : 'Keep contributing to accelerate progress'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <AnimatePresence>
            {shouldShowChecklist && (
              <motion.section
                key="onboarding-checklist"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="lg:col-span-3 rounded-3xl border border-emerald-500/40 bg-slate-900/80 p-6 shadow-2xl shadow-emerald-900/30"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">Next steps</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">Make the most of your new data</h3>
                    <p className="mt-2 text-sm text-text-muted">
                      Follow this quick checklist to settle in while we finish syncing your transactions.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowOnboardingChecklist(false)}
                    className="self-end rounded-full p-2 text-text-muted transition hover:bg-surface-muted/60 hover:text-text-primary"
                    aria-label="Dismiss onboarding checklist"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <ul className="mt-6 grid gap-4 sm:grid-cols-3">
                  {onboardingChecklistItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 shadow-inner shadow-emerald-900/20"
                    >
                      <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                        <CheckCircle className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">{item.title}</p>
                        <p className="mt-1 text-xs text-text-muted">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.section>
            )}
          </AnimatePresence>

          {hasLinkedAccounts && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="lg:col-span-3 rounded-2xl border border-emerald-500/30 bg-slate-900/80 p-6 shadow-xl shadow-emerald-900/30"
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">Live linked balances</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{formatCurrency(totalLinkedBalance)}</h3>
                  <p className="mt-2 text-sm text-text-muted">
                    These balances were imported directly from your connected bank.
                  </p>
                </div>
                <div className="grid w-full gap-4 sm:grid-cols-2 md:max-w-xl">
                  {accountSummaries.slice(0, 4).map((account) => (
                    <div
                      key={account.id}
                      className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 shadow-inner shadow-emerald-900/20"
                    >
                      <p className="text-sm font-semibold text-white">{account.name}</p>
                      <p className="mt-2 text-lg font-semibold text-emerald-400">{formatCurrency(account.balance)}</p>
                      {account.type ? (
                        <p className="mt-1 text-xs text-text-muted">{account.type}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
              {accountSummaries.length > 4 && (
                <p className="mt-4 text-xs text-text-secondary">
                  Showing your first four accounts. Open the accounts panel to view everything you linked.
                </p>
              )}
            </motion.section>
          )}

          {shouldShowFirstTransactionPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="lg:col-span-3 flex flex-col gap-4 rounded-2xl border border-emerald-200/70 bg-emerald-50/80 p-6 text-emerald-900 shadow-lg sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-surface p-3 text-emerald-500 shadow">
                  <PlusCircle className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Add your first expense</h3>
                  <p className="mt-2 text-sm text-emerald-900/80">
                    Great start! Now, log your first expense to see your budget in action. Use the{' '}
                    <span className="font-semibold">"Quick add entries"</span> form on the right to record it in seconds.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowFirstTransactionPrompt(false)}
                className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-surface px-5 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-100"
              >
                Okay, got it!
              </button>
            </motion.div>
          )}

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 lg:col-span-3">
            {insightCards.map((insight) => (
              <button
                key={insight.title}
                type="button"
                onClick={() => handleHeadlineCardClick(insight)}
                className={card({
                  className: [
                    'relative overflow-hidden text-left transition hover:shadow-xl',
                    insight.accent && 'bg-emerald-50/90 ring-emerald-200',
                  ],
                  padding: 'md',
                })}
              >
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-200/30 blur-2xl" />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">{insight.title}</p>
                    <ArrowUpRight className={`h-4 w-4 ${insight.accent ? 'text-emerald-500' : 'text-text-muted'}`} />
                  </div>
                  <p className="text-2xl font-semibold text-text-primary">{insight.value}</p>
                  <p className="text-xs text-text-muted">{insight.caption}</p>
                </div>
              </button>
            ))}
            </section>

          <section className={card({ className: 'lg:col-span-2' })}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Cash Flow Waterfall</h2>
                <p className="text-sm text-text-secondary">Follow how income funds top categories before landing in savings.</p>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Net {formatCurrency(totals.net)}
              </div>
            </div>
            <div className="mt-6 h-72">
              {waterfallHasData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={cashFlowWaterfallChartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" tickFormatter={(value) => formatCurrency(value)} width={80} />
                    <Tooltip
                      cursor={{ fill: 'rgba(15,118,110,0.08)' }}
                      formatter={(value, _name, { payload } = {}) => [
                        formatCurrency(payload?.displayValue ?? value ?? 0),
                        'Change',
                      ]}
                      labelFormatter={(label, payload) => {
                        const cumulative = payload?.[0]?.payload?.cumulative ?? 0;
                        return `${label} · Cumulative ${formatCurrency(cumulative)}`;
                      }}
                    />
                    <ReferenceLine y={0} stroke="#cbd5f5" strokeDasharray="4 4" />
                    <Bar dataKey="base" stackId="waterfall" fill="transparent" stroke="transparent" />
                    <Bar dataKey="deltaPositive" stackId="waterfall" radius={[6, 6, 0, 0]}>
                      {cashFlowWaterfallChartData.map((entry) => (
                        <Cell
                          key={`waterfall-positive-${entry.key}`}
                          fill={waterfallColorByType[entry.type] || themeColors.primary}
                        />
                      ))}
                    </Bar>
                    <Bar dataKey="deltaNegative" stackId="waterfall" radius={[0, 0, 6, 6]}>
                      {cashFlowWaterfallChartData.map((entry) => (
                        <Cell
                          key={`waterfall-negative-${entry.key}`}
                          fill={waterfallColorByType[entry.type] || themeColors.destructive}
                        />
                      ))}
                    </Bar>
                    <Line type="monotone" dataKey="cumulative" stroke="#1e293b" strokeWidth={2} dot={{ r: 0 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border/60 bg-surface-muted p-6 text-center text-sm text-text-secondary">
                  Add income and expense activity to map your monthly flow.
                </div>
              )}
            </div>
          </section>

          <section className={card({ className: 'lg:col-span-1' })}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Cash Flow Calendar</h2>
                <p className="text-sm text-text-secondary">A high-level glance at expected inflows and bills this month.</p>
              </div>
              <span className="rounded-full bg-emerald-50 p-2 text-emerald-600">
                <CalendarDays className="h-5 w-5" />
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="grid grid-cols-7 gap-1 text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                {cashFlowWeekdayLabels.map((label) => (
                  <span key={label} className="text-center">{label}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {cashFlowCalendarData.cells.map((cell) => {
                  if (cell.type === 'spacer') {
                    return <span key={cell.key} className="h-10" />;
                  }
                  return (
                    <div
                      key={cell.key}
                      className={card({
                        padding: 'none',
                        className: 'min-h-[2.75rem] rounded-lg border border-border/70 p-1 text-[11px] shadow-none',
                      })}
                    >
                      <span className="block text-right text-[10px] font-semibold text-text-secondary">{cell.day}</span>
                      <div className="mt-1 space-y-1">
                        {cell.markers.slice(0, 2).map((marker) => (
                          <div
                            key={marker.key}
                            className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] ${
                              marker.type === 'income'
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-rose-50 text-rose-600'
                            }`}
                          >
                            <span className="truncate">{marker.label}</span>
                          </div>
                        ))}
                        {cell.markers.length > 2 ? (
                          <p className="text-[10px] text-text-muted">+{cell.markers.length - 2} more</p>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-4 space-y-1 text-xs text-text-secondary">
              <p>
                Next income:{' '}
                {cashFlowCalendarData.nextIncome
                  ? shortDateFormatter.format(cashFlowCalendarData.nextIncome)
                  : 'Not scheduled'}
              </p>
              <p>Bills due soon: {cashFlowCalendarData.upcomingBills}</p>
            </div>
          </section>

          <section className={quickAddSectionClasses}>
            <h2 className="text-lg font-semibold text-text-primary">Quick add entries</h2>
            <p className="mt-1 text-sm text-text-secondary">Capture income and expenses instantly to keep your dashboard current.</p>
            <div className="mt-6 space-y-4">
              <form onSubmit={handleExpenseSubmit} className={expenseFormCardClasses}>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                      <PlusCircle className="h-4 w-4 text-red-500" />
                      Add expense
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        className="input-base"
                        placeholder="Description"
                        value={expenseForm.description}
                        onChange={(event) => setExpenseForm((prev) => ({ ...prev, description: event.target.value }))}
                      />
                      <input
                        className="input-base"
                        placeholder="Amount"
                        type="number"
                        min={0}
                        step="0.01"
                        value={expenseForm.amount}
                        onChange={(event) => setExpenseForm((prev) => ({ ...prev, amount: event.target.value }))}
                      />
                      <select
                        className="input-base"
                        value={expenseForm.accountId}
                        onChange={(e) => setExpenseForm((p) => ({ ...p, accountId: e.target.value }))}
                      >
                        <option value="">No account</option>
                        {(accounts || []).map((a) => (
                          <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                      </select>
                      <select
                        className="input-base sm:col-span-2"
                        value={expenseForm.category}
                        onChange={(event) => setExpenseForm((prev) => ({ ...prev, category: event.target.value }))}
                      >
                        <option>General</option>
                        <option>Housing</option>
                        <option>Utilities</option>
                        <option>Groceries</option>
                        <option>Dining</option>
                        <option>Transport</option>
                        <option>Health</option>
                        <option>Entertainment</option>
                      </select>
                  </div>
                  <button type="submit" className="btn btn-primary w-full">Record expense</button>
                </form>

                <form onSubmit={handleIncomeSubmit} className={incomeFormCardClasses}>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                      <PlusCircle className="h-4 w-4 text-emerald-500" />
                      Add income
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        className="input-base"
                        placeholder="Description"
                        value={incomeForm.description}
                        onChange={(event) => setIncomeForm((prev) => ({ ...prev, description: event.target.value }))}
                      />
                      <input
                        className="input-base"
                        placeholder="Amount"
                        type="number"
                        min={0}
                        step="0.01"
                        value={incomeForm.amount}
                        onChange={(event) => setIncomeForm((prev) => ({ ...prev, amount: event.target.value }))}
                      />
                      <select
                        className="input-base"
                        value={incomeForm.accountId}
                        onChange={(e) => setIncomeForm((p) => ({ ...p, accountId: e.target.value }))}
                      >
                        <option value="">No account</option>
                        {(accounts || []).map((a) => (
                          <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                      </select>
                  </div>
                  <button type="submit" className="btn btn-primary w-full">Record income</button>
                </form>
              </div>
          </section>

            <section className={card({ className: 'lg:col-span-1' })}>
              <h2 className="text-lg font-semibold text-text-primary">Savings goals</h2>
              <p className="mt-1 text-sm text-text-secondary">Align your monthly savings with meaningful milestones.</p>
              <form onSubmit={handleGoalSubmit} className={goalFormCardClasses}>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-text-secondary">Goal name</label>
                  <input
                        className="input-base"
                      value={goalForm.name}
                      onChange={(event) => setGoalForm((prev) => ({ ...prev, name: event.target.value }))}
                      placeholder="Emergency Fund"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-text-secondary">Goal type</label>
                  <select
                        className="input-base"
                      value={goalForm.type}
                      onChange={(e) => setGoalForm((p) => ({ ...p, type: e.target.value }))}
                      >
                      <option value="savings">Savings Goal</option>
                      <option value="debt">Debt Paydown</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-text-secondary">{goalForm.type === 'debt' ? 'Initial debt amount' : 'Target amount'}</label>
                  <input
                        className="input-base"
                      type="number"
                      min={0}
                      step="0.01"
                      value={goalForm.targetAmount}
                      onChange={(event) => setGoalForm((prev) => ({ ...prev, targetAmount: event.target.value }))}
                      placeholder="5000"
                  />
                </div>
                {goalForm.type === 'debt' && (
                  <div>
                      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-text-secondary">Current balance</label>
                      <input
                        className="input-base"
                        type="number"
                        min={0}
                        step="0.01"
                        value={goalForm.currentAmount}
                        onChange={(event) => setGoalForm((prev) => ({ ...prev, currentAmount: event.target.value }))}
                        placeholder="2500"
                      />
                  </div>
                )}
                <button type="submit" className="btn btn-primary w-full">Create goal</button>
              </form>
              <div className="mt-6 space-y-4">
                {goals.length === 0 && (
                  <p className="text-sm text-text-secondary">No goals yet. Start by creating your first savings target.</p>
                )}
                <AnimatePresence>
                  {goals.map((goal) => {
                    const isDebt = !!goal.isDebt;
                    const currentAmount = Number(goal.currentAmount || 0);
                    const target = Number(goal.targetAmount || 0);
                    const progress = target > 0
                      ? Math.min(
                          Math.max(
                            (isDebt ? ((target - currentAmount) / target) * 100 : (currentAmount / target) * 100),
                            0,
                          ),
                          100,
                        )
                      : 0;
                    const achieved = isDebt ? (target - currentAmount) : currentAmount;
                    const remaining = Math.max(target - achieved, 0);
                    const monthsToGoal = monthlySavings > 0
                      ? Math.max(
                          Math.ceil(remaining / monthlySavings),
                          1,
                        )
                      : null;
                    return (
                      <div
                        key={goal.id}
                        className={card({ variant: 'muted', padding: 'sm', className: 'shadow-inner' })}
                      >
                        <div className="flex items-center justify-between text-sm">
                          <h3 className="font-semibold text-text-primary">{goal.name}</h3>
                          <span className="text-xs font-semibold text-emerald-600">{progress.toFixed(0)}%</span>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-emerald-500 transition-all"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <p className="mt-2 text-xs text-text-secondary">
                          {isDebt ? 'Initial:' : 'Target:'} {formatCurrency(target)} - {isDebt ? 'Balance:' : 'Saved:'}{' '}
                          {formatCurrency(currentAmount)}
                        </p>
                        <p className="mt-1 text-xs text-text-muted">
                          {monthlySavings > 0
                            ? monthsToGoal
                              ? `At ${formatCurrency(monthlySavings)} saved monthly, reach in ~${monthsToGoal} month${monthsToGoal === 1 ? '' : 's'}.`
                              : 'Keep contributing to accelerate progress.'
                            : 'Log more manual entries to improve projections.'}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setContributeGoal(goal)}
                            className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
                          >
                            {isDebt ? 'Log payment' : 'Contribute'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </section>

            <section className={card({ className: 'lg:col-span-2' })}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">Spending Trends (This Month vs. Last Month)</h2>
                  <p className="text-sm text-text-secondary">Spot the categories with the biggest month-over-month shifts.</p>
                </div>
              </div>
              <div className="mt-6 h-72">
                {hasSpendingTrendData ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={spendingTrendData} barGap={12} barSize={28}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="category"
                        stroke="#94a3b8"
                        tick={{ fill: '#475569', fontSize: 12 }}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        tickFormatter={(value) => formatCurrency(value)}
                        width={80}
                      />
                      <Tooltip
                        cursor={{ fill: 'rgba(15, 118, 110, 0.1)' }}
                        formatter={(value) => formatCurrency(value)}
                      />
                      <Bar
                        dataKey="currentMonthSpending"
                        name="This Month"
                        fill={themeColors.destructive}
                        radius={[6, 6, 0, 0]}
                        cursor="pointer"
                        onClick={(data) => handleCategoryDrilldown(data?.payload?.category)}
                      />
                      <Bar
                        dataKey="previousMonthSpending"
                        name="Last Month"
                        fill="#94a3b8"
                        radius={[6, 6, 0, 0]}
                        cursor="pointer"
                        onClick={(data) => handleCategoryDrilldown(data?.payload?.category)}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border/60 bg-surface-muted p-6 text-center text-sm text-text-secondary">
                    Not enough expense data to compare trends yet.
                  </div>
                )}
              </div>
            </section>

            <section className={card({ className: 'lg:col-span-1' })}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">AI Insights Engine</h2>
                  <p className="text-sm text-text-secondary">
                    {isPremium ? `Intelligent highlights for ${rangeLabel}.` : 'Unlock personalised guidance with Premium.'}
                  </p>
                </div>
                {isPremium ? (
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Beta
                  </span>
                ) : null}
              </div>
              <div className="mt-4 space-y-3">
                {isPremium ? (
                  aiInsights.length > 0 ? (
                    <ul className="space-y-3">
                      {aiInsights.map((insight) => {
                        const Icon = aiIconByTone[insight.tone] || Info;
                        return (
                          <li key={insight.id}>
                            <button
                              type="button"
                              onClick={() => handleInsightSelect(insight)}
                              className={card({
                                variant: 'muted',
                                padding: 'sm',
                                interactive: true,
                                className: 'group flex w-full items-start gap-3 rounded-xl text-left hover:border-emerald-300',
                              })}
                            >
                              <span className="mt-1 rounded-full bg-emerald-50 p-2 text-emerald-600 group-hover:bg-emerald-100">
                                <Icon className="h-4 w-4" />
                              </span>
                              <span className="space-y-1 text-sm text-text-secondary">
                                <span className="block font-semibold text-text-primary">{insight.title}</span>
                                <span className="block text-xs text-text-muted">{insight.body}</span>
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border/60 bg-surface-muted p-4 text-sm text-text-secondary">
                      Insights will appear here once we have enough activity for this range.
                    </div>
                  )
                ) : (
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900">
                    <p className="font-semibold">Get AI-powered budgeting nudges, anomaly alerts, and weekly digests.</p>
                    <p className="mt-2 text-emerald-800/80">Premium keeps you ahead of cash leaks and celebrates wins.</p>
                    {onShowPricingModal ? (
                      <button
                        type="button"
                        onClick={onShowPricingModal}
                        className="mt-3 inline-flex items-center rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                      >
                        Unlock insights with Premium
                      </button>
                    ) : null}
                  </div>
                )}
              </div>
            </section>

            <section className={card({ className: 'lg:col-span-2' })}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">Investment projection</h2>
                  <p className="text-sm text-text-secondary">
                    Model potential savings growth over the next {projectionHorizon} year{projectionHorizon === 1 ? '' : 's'}.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex rounded-full border border-border bg-surface p-1 text-xs font-semibold text-text-secondary">
                    {[1, 5, 10].map((years) => {
                      const isActive = projectionHorizon === years;
                      return (
                        <button
                          key={years}
                          type="button"
                          onClick={() => setProjectionHorizon(years)}
                          className={`rounded-full px-3 py-1 transition ${isActive ? 'bg-emerald-500 text-white shadow-sm' : 'hover:text-emerald-600'}`}
                        >
                          {years}Y
                        </button>
                      );
                    })}
                  </div>
                  <select
                    className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary transition hover:border-primary/60 hover:text-text-primary"
                    value={rate}
                    onChange={(event) => setRate(Number(event.target.value))}
                  >
                    <option value={0.04}>Conservative · 4%</option>
                    <option value={0.07}>Balanced · 7%</option>
                    <option value={0.1}>Growth · 10%</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={projectionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" tickFormatter={(value) => formatCurrency(value)} width={90} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Line
                      type="monotone"
                      dataKey="savings"
                      stroke={themeColors.primary}
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              {!isPremium ? (
                <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm text-emerald-900">
                  <span>Overlay goal timelines and compare scenarios with Nest Premium.</span>
                  {onShowPricingModal ? (
                    <button
                      type="button"
                      onClick={onShowPricingModal}
                      className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-emerald-700"
                    >
                      Upgrade
                    </button>
                  ) : null}
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-border/60 bg-surface-muted p-4 text-xs text-text-secondary">
                  Goal overlay controls will appear here soon. Tell us which milestones you’d like to plot.
                </div>
              )}
            </section>

            <section className={card({ className: 'lg:col-span-1' })}>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">Net Worth Trend</h2>
                  <p className="text-sm text-text-secondary">See how assets and liabilities stack up over time.</p>
                </div>
                {!isPremium ? (
                  <span className="rounded-full bg-surface-muted p-2 text-text-muted">
                    <Lock className="h-4 w-4" />
                  </span>
                ) : null}
              </div>
              {isPremium ? (
                <div className="mt-6 rounded-xl border border-dashed border-border/60 bg-surface-muted p-5 text-sm text-text-secondary">
                  Net worth chart coming soon. Head to the Accounts & Net Worth hub for deeper breakdowns.
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  <div className="relative flex h-36 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-200 bg-gradient-to-br from-slate-100 via-white to-slate-50">
                    <div className="absolute inset-x-10 bottom-6 h-20 rounded-full bg-emerald-100/50 blur-2xl" />
                    <span className="relative text-xs font-semibold uppercase tracking-wide text-text-muted">
                      Premium chart locked
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    Track your trajectory with interactive assets vs. liabilities timelines, only in Nest Premium.
                  </p>
                  {onShowPricingModal ? (
                    <button
                      type="button"
                      onClick={onShowPricingModal}
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                    >
                      <Lock className="h-4 w-4" />
                      Upgrade to view
                    </button>
                  ) : null}
                </div>
              )}
            </section>

          <section className={card({ className: 'lg:col-span-3' })}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-text-primary">Transactions - {rangeLabel}</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportTransactions}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary transition hover:border-primary/60 hover:text-text-primary"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {filteredTransactions.length} entries
                </span>
              </div>
            </div>
            <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-2">
              {isSyncingTransactions && (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-800 shadow-inner shadow-emerald-200/40">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-500" aria-hidden="true" />
                  <p>Syncing recent transactions... They will appear here shortly.</p>
                </div>
              )}
              {!isSyncingTransactions && filteredTransactions.length === 0 && (
                <p className="rounded-xl border border-dashed border-border/60 bg-surface-muted p-6 text-center text-sm text-text-secondary">
                  You have no manual entries this month. Use the quick add forms to record income and expenses.
                </p>
              )}
              <AnimatePresence>
                {filteredTransactions.map((transaction) => {
                  const isIncome = transaction.type === 'income';
                  const amount = formatCurrency(transaction.amount);
                  const date = transaction.date?.toDate?.() || transaction.date || new Date();
                  return (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className={card({
                        padding: 'sm',
                        className: 'flex items-center justify-between shadow-sm',
                      })}
                    >
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{transaction.description}</p>
                        <p className="text-xs text-text-secondary">
                          {isIncome ? 'Income' : transaction.category} - {date.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${isIncome ? 'text-emerald-600' : 'text-red-500'}`}>
                          {isIncome ? '+' : '-'}{amount}
                        </span>
                        <button
                          aria-label="Edit transaction"
                          onClick={() =>
                            setEditTx({
                              id: transaction.id,
                              type: transaction.type,
                              description: transaction.description,
                              amount: transaction.amount,
                              category: transaction.category || 'General',
                            })
                          }
                          className="rounded-full p-2 text-text-muted transition hover:bg-surface-muted hover:text-text-primary"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          aria-label="Delete transaction"
                          onClick={() => {
                            if (window.confirm('Delete this transaction?')) {
                              onDeleteTransaction(transaction.id);
                            }
                          }}
                          className="rounded-full p-2 text-text-muted transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </section>
          </div>

          <AnimatePresence>
            {drilldown ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 md:items-center"
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  transition={{ duration: 0.25 }}
                  className={card({
                    variant: 'elevated',
                    padding: 'lg',
                    className: 'w-full max-w-2xl rounded-2xl shadow-2xl',
                  })}
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">{drilldown.title}</h3>
                      <p className="text-xs uppercase tracking-wide text-text-muted">{rangeLabel}</p>
                    </div>
                    <button
                      type="button"
                      onClick={closeDrilldown}
                      className="rounded-full p-2 text-text-muted transition hover:bg-surface-muted hover:text-text-primary"
                      aria-label="Close drilldown"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  {drilldown.type === 'category' ? (
                    <div className="space-y-4">
                      {drilldown.metrics ? (
                        <div className="grid gap-3 sm:grid-cols-3">
                          <div className="rounded-xl border border-border/60 bg-surface-muted p-3">
                            <p className="text-xs uppercase tracking-wide text-text-secondary">This month</p>
                            <p className="mt-1 text-lg font-semibold text-text-primary">
                              {formatCurrency(drilldown.metrics.current)}
                            </p>
                          </div>
                          <div className="rounded-xl border border-border/60 bg-surface-muted p-3">
                            <p className="text-xs uppercase tracking-wide text-text-secondary">Last month</p>
                            <p className="mt-1 text-lg font-semibold text-text-primary">
                              {formatCurrency(drilldown.metrics.previous)}
                            </p>
                          </div>
                          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                            <p className="text-xs uppercase tracking-wide text-emerald-600">Change</p>
                            <p
                              className={`mt-1 text-lg font-semibold ${
                                drilldown.metrics.delta >= 0 ? 'text-emerald-700' : 'text-red-600'
                              }`}
                            >
                              {drilldown.metrics.delta >= 0 ? '+' : '-'}{formatCurrency(Math.abs(drilldown.metrics.delta))}
                            </p>
                          </div>
                        </div>
                      ) : null}
                      <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                        {drilldown.transactions && drilldown.transactions.length > 0 ? (
                          drilldown.transactions.map((transaction) => {
                            const txDate = getTransactionDate(transaction.date) || new Date();
                            return (
                              <div
                                key={transaction.id || `${transaction.description}-${txDate.toISOString()}`}
                                className="flex items-center justify-between rounded-xl border border-border/60 bg-surface-muted px-4 py-3 text-sm text-text-secondary"
                              >
                                <div>
                                  <p className="font-semibold text-text-primary">{transaction.description}</p>
                                  <p className="text-xs text-text-muted">
                                    {drilldownDateFormatter.format(txDate)} · {transaction.category || 'General'}
                                  </p>
                                </div>
                                <span className="text-sm font-semibold text-text-primary">
                                  {formatCurrency(transaction.amount)}
                                </span>
                              </div>
                            );
                          })
                        ) : (
                          <p className="rounded-xl border border-dashed border-border/60 bg-surface-muted p-4 text-center text-sm text-text-secondary">
                            No transactions in this category for the selected range.
                          </p>
                        )}
                      </div>
                    </div>
                   ) : drilldown.type === 'merchant' ? (
                     <div className="space-y-4">
                       <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                         {(() => {
                           const items = (transactions || []).filter((tx) => {
                             if (!tx || tx.type !== 'expense') return false;
                             const merchant = tx.merchant || tx.description;
                             return merchant && merchant === (drilldown.node?.label || drilldown.title);
                           });
                           return items.length > 0 ? (
                             items.map((transaction) => {
                               const txDate = getTransactionDate(transaction.date) || new Date();
                               return (
                                 <div
                                   key={transaction.id || `${transaction.description}-${txDate.toISOString()}`}
                                   className="flex items-center justify-between rounded-xl border border-border/60 bg-surface-muted px-4 py-3 text-sm text-text-secondary"
                                 >
                                   <div>
                                     <p className="font-semibold text-text-primary">{transaction.description}</p>
                                     <p className="text-xs text-text-muted">
                                       {drilldownDateFormatter.format(txDate)} · {transaction.category || 'General'}
                                     </p>
                                   </div>
                                   <span className="text-sm font-semibold text-text-primary">{formatCurrency(transaction.amount)}</span>
                                 </div>
                               );
                             })
                           ) : (
                             <p className="rounded-xl border border-dashed border-border/60 bg-surface-muted p-4 text-center text-sm text-text-secondary">
                               No transactions found for this merchant.
                             </p>
                           );
                         })()}
                       </div>
                     </div>
                   ) : (
                     <div className="space-y-3 text-sm text-text-secondary">
                       {drilldown.insight?.caption ? (
                         <p className="text-xs uppercase tracking-wide text-text-secondary">{drilldown.insight.caption}</p>
                       ) : null}
                       <p>{drilldown.insight?.body}</p>
                       <p className="text-xs text-text-muted">Click another insight or bar to explore more detail.</p>
                     </div>
                   )}
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </main>
        {contributeGoal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div
              className={card({
                variant: 'elevated',
                padding: 'lg',
                className: 'w-full max-w-sm rounded-2xl shadow-2xl',
              })}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">Contribute to {contributeGoal.name}</h3>
                <button onClick={() => setContributeGoal(null)} className="rounded-full p-2 text-text-muted hover:bg-surface-muted hover:text-text-primary">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-text-secondary">Amount</label>
                  <input
                        className="input-base"
                      type="number"
                      min={0}
                      step="0.01"
                      value={contributeAmount}
                      onChange={(e) => setContributeAmount(e.target.value)}
                      placeholder="100"
                  />
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button onClick={() => setContributeGoal(null)} className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary transition hover:border-primary/60 hover:text-text-primary">Cancel</button>
                  <button
                      onClick={async () => {
                        const amt = Number(contributeAmount) || 0;
                        if (amt <= 0) return;
                        await onContributeToGoal(contributeGoal, amt);
                        setContributeGoal(null);
                      }}
                        className="btn btn-primary"
                      >
                      Contribute
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {budgetsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div
              className={card({
                variant: 'elevated',
                padding: 'lg',
                className: 'w-full max-w-md rounded-2xl shadow-2xl',
              })}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">Monthly budgets</h3>
                <button onClick={() => setBudgetsOpen(false)} className="rounded-full p-2 text-text-muted transition hover:bg-surface-muted hover:text-text-primary">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-text-secondary">Category</label>
                  <select
                        className="input-base"
                      value={budgetForm.category}
                      onChange={(e) => setBudgetForm((p) => ({ ...p, category: e.target.value }))}
                      >
                      <option>General</option>
                      <option>Housing</option>
                      <option>Utilities</option>
                      <option>Groceries</option>
                      <option>Dining</option>
                      <option>Transport</option>
                      <option>Health</option>
                      <option>Entertainment</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-text-secondary">Monthly limit</label>
                  <input
                        className="input-base"
                      type="number"
                      min={0}
                      step="0.01"
                      value={budgetForm.amount}
                      onChange={(e) => setBudgetForm((p) => ({ ...p, amount: e.target.value }))}
                      placeholder="300"
                  />
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button onClick={() => setBudgetsOpen(false)} className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary transition hover:border-primary/60 hover:text-text-primary">Close</button>
                  <button
                      onClick={async () => {
                        const amt = Number(budgetForm.amount) || 0;
                        await onUpsertBudget({ category: budgetForm.category, amount: amt });
                        setBudgetForm({ category: budgetForm.category, amount: '' });
                        setBudgetsOpen(false);
                      }}
                        className="btn btn-primary"
                      >
                      Save budget
                  </button>
                </div>
                <div className="pt-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">Existing budgets</p>
                  <ul className="max-h-40 space-y-2 overflow-auto pr-1">
                      {(budgets || []).map((b) => (
                        <li key={b.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-surface-muted p-2 text-sm text-text-secondary">
                          <span>{b.category}</span>
                          <span className="font-semibold text-text-primary">{formatCurrency(b.amount)}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {accountsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div
              className={card({
                variant: 'elevated',
                padding: 'lg',
                className: 'w-full max-w-md rounded-2xl shadow-2xl',
              })}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">Accounts</h3>
                <button onClick={() => setAccountsOpen(false)} className="rounded-full p-2 text-text-muted transition hover:bg-surface-muted hover:text-text-primary">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-text-secondary">Account name</label>
                  <input
                        className="input-base"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="Chase Checking"
                  />
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button onClick={() => setAccountsOpen(false)} className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary transition hover:border-primary/60 hover:text-text-primary">Close</button>
                  <button
                      onClick={async () => {
                        const name = String(accountName || '').trim();
                        if (name) {
                          await onUpsertAccount({ name });
                          setAccountName('');
                        }
                        setAccountsOpen(false);
                      }}
                        className="btn btn-primary"
                      >
                      Add account
                  </button>
                </div>
                <div className="pt-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">Existing accounts</p>
                  <ul className="max-h-40 space-y-2 overflow-auto pr-1">
                      {(accounts || []).map((a) => (
                        <li key={a.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-surface-muted p-2 text-sm text-text-secondary">
                          <span>{a.name}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        {editTx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div
              className={card({
                variant: 'elevated',
                padding: 'lg',
                className: 'w-full max-w-md rounded-2xl shadow-2xl',
              })}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">Edit transaction</h3>
                <button onClick={() => setEditTx(null)} className="rounded-full p-2 text-text-muted transition hover:bg-surface-muted hover:text-text-primary">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-text-secondary">Description</label>
                  <input
                        className="input-base"
                      value={editTx.description}
                      onChange={(e) => setEditTx((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-text-secondary">Amount</label>
                  <input
                        className="input-base"
                      type="number"
                      min={0}
                      step="0.01"
                      value={editTx.amount}
                      onChange={(e) => setEditTx((prev) => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
                {editTx.type === 'expense' && (
                  <div>
                      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-text-secondary">Category</label>
                      <input
                        className="input-base"
                        value={editTx.category || 'General'}
                        onChange={(e) => setEditTx((prev) => ({ ...prev, category: e.target.value }))}
                      />
                  </div>
                )}
                <div className="mt-4 flex justify-end gap-2">
                  <button onClick={() => setEditTx(null)} className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary transition hover:border-primary/60 hover:text-text-primary">Cancel</button>
                  <button
                      onClick={async () => {
                        await onUpdateTransaction(editTx.id, {
                          description: editTx.description,
                          amount: Number(editTx.amount) || 0,
                          ...(editTx.type === 'expense' ? { category: editTx.category || 'General' } : {}),
                        });
                        setEditTx(null);
                      }}
                        className="btn btn-primary"
                      >
                      Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {settingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className={card({ className: 'w-full max-w-md' })}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">Workspace preferences</h3>
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="rounded-full p-2 text-text-muted transition hover:bg-surface-muted hover:text-text-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Monthly Income
                  </label>
                  <input
                    className="input-base"
                    type="number"
                    min={0}
                    step="0.01"
                    value={settingsForm.recurringIncome}
                    onChange={(e) => setSettingsForm((p) => ({ ...p, recurringIncome: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Monthly Recurring Expenses
                  </label>
                  <input
                    className="input-base"
                    type="number"
                    min={0}
                    step="0.01"
                    value={settingsForm.recurringExpenses}
                    onChange={(e) => setSettingsForm((p) => ({ ...p, recurringExpenses: e.target.value }))}
                  />
                </div>
                <div className="border-t border-border/60 pt-4">
                  <ThemeSwitcher />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSettingsOpen(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      await onUpdateProfile({
                        recurringIncome: settingsForm.recurringIncome,
                        recurringExpenses: settingsForm.recurringExpenses,
                      });
                      setSettingsOpen(false);
                    }}
                    className="btn btn-primary"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default DashboardView;

