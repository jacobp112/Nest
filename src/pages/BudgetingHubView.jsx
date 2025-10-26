import React, { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  PiggyBank,
  TrendingDown,
  Target,
  Pencil,
  Lock,
  ArrowRight,
  Sparkles,
  CalendarClock,
  Layers,
  Loader2,
} from 'lucide-react';

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 2,
});

const formatCurrency = (value) => currencyFormatter.format(Number(value) || 0);

const resolveDate = (input) => {
  if (!input) return null;
  if (input instanceof Date) return new Date(input);
  if (typeof input.toDate === 'function') return input.toDate();
  const candidate = new Date(input);
  return Number.isNaN(candidate.valueOf()) ? null : candidate;
};

const getMonthBounds = (reference) => {
  const base =
    reference instanceof Date && !Number.isNaN(reference.valueOf()) ? new Date(reference) : new Date();
  const start = new Date(base.getFullYear(), base.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(base.getFullYear(), base.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
};

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const listItemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
      delay: index * 0.04,
    },
  }),
};

const MAX_FREE_BUDGETS = 5;

const BudgetingHubView = ({
  budgets = [],
  transactions = [],
  userDoc = {},
  selectedMonth = new Date(),
  onUpsertBudget,
  onShowPricingModal,
  isPremium = false,
}) => {
  const [editingBudgetKey, setEditingBudgetKey] = useState(null);
  const [draftAmount, setDraftAmount] = useState('');
  const [savingBudgetKey, setSavingBudgetKey] = useState(null);
  const [suggestedBudgets, setSuggestedBudgets] = useState([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  const monthBounds = useMemo(() => getMonthBounds(selectedMonth), [selectedMonth]);

  const monthlyTransactions = useMemo(() => {
    const { start, end } = monthBounds;
    return transactions.filter((transaction) => {
      const transactionDate = resolveDate(transaction.date);
      if (!transactionDate) return false;
      return transactionDate >= start && transactionDate <= end;
    });
  }, [monthBounds, transactions]);

  const { monthlyIncome, monthlyExpenses } = useMemo(() => {
    let income = 0;
    let expenses = 0;
    monthlyTransactions.forEach((transaction) => {
      const amount = Number(transaction.amount) || 0;
      if (transaction.type === 'income') {
        income += amount;
      } else if (transaction.type === 'expense') {
        expenses += amount;
      }
    });
    const recurringIncome = Number(userDoc?.recurringIncome) || 0;
    return {
      monthlyIncome: recurringIncome + income,
      monthlyExpenses: expenses,
    };
  }, [monthlyTransactions, userDoc]);

  const categorySpendMap = useMemo(() => {
    const map = new Map();
    monthlyTransactions.forEach((transaction) => {
      if (transaction.type !== 'expense') return;
      const category = transaction.category || 'General';
      const amount = Number(transaction.amount) || 0;
      map.set(category, (map.get(category) || 0) + amount);
    });
    return map;
  }, [monthlyTransactions]);

  const sortedBudgets = useMemo(() => {
    const list = Array.isArray(budgets) ? budgets.slice() : [];
    return list.sort((a, b) => {
      const labelA = (a?.category || '').toLowerCase();
      const labelB = (b?.category || '').toLowerCase();
      return labelA.localeCompare(labelB);
    });
  }, [budgets]);

  const budgetCategorySet = useMemo(
    () =>
      new Set(
        sortedBudgets
          .map((budget) => (budget?.category || '').toString().toLowerCase())
          .filter(Boolean),
      ),
    [sortedBudgets],
  );

  const canAddBudgetForCategory = useCallback(
    (category) => {
      if (!category) return true;
      if (isPremium) return true;
      const normalized = category.toString().toLowerCase();
      if (budgetCategorySet.has(normalized)) return true;
      if (budgetCategorySet.size >= MAX_FREE_BUDGETS) {
        onShowPricingModal?.();
        return false;
      }
      return true;
    },
    [budgetCategorySet, isPremium, onShowPricingModal],
  );

  const freeLimitRemaining = Math.max(MAX_FREE_BUDGETS - budgetCategorySet.size, 0);
  const customBudgetLimitReached = !isPremium && budgetCategorySet.size >= MAX_FREE_BUDGETS;

  const categorySummaries = useMemo(
    () =>
      sortedBudgets.map((budget) => {
        const amount = Number(budget.amount) || 0;
        const spent = categorySpendMap.get(budget.category) || 0;
        return {
          ...budget,
          amount,
          spent,
          remaining: amount - spent,
          progress: amount > 0 ? Math.min(spent / amount, 1) : spent > 0 ? 1 : 0,
        };
      }),
    [categorySpendMap, sortedBudgets],
  );

  const totalBudgeted = useMemo(
    () => categorySummaries.reduce((sum, budget) => sum + budget.amount, 0),
    [categorySummaries],
  );

  const remainingToBudget = monthlyIncome - totalBudgeted;

  const unbudgetedCategories = useMemo(() => {
    const categoriesWithBudgets = new Set(sortedBudgets.map((budget) => budget.category));
    return Array.from(categorySpendMap.entries())
      .filter(([category]) => !categoriesWithBudgets.has(category))
      .map(([category, spent]) => ({ category, spent }));
  }, [categorySpendMap, sortedBudgets]);

  const handleGenerateSuggestions = useCallback(() => {
    if (isGeneratingSuggestions) return;
    setIsGeneratingSuggestions(true);
    window.setTimeout(() => {
      const suggestions = [];

      unbudgetedCategories.slice(0, 3).forEach(({ category, spent }) => {
        if (!category) return;
        const rounded = Math.max(Math.round((spent || 0) * 1.1 / 10) * 10, 25);
        suggestions.push({
          category,
          amount: rounded,
          type: 'new',
          reason: 'Recent spending detected without an allocation.',
        });
      });

      if (suggestions.length < 3) {
        const overspentCategories = categorySummaries
          .filter((summary) => summary.amount > 0 && summary.spent > summary.amount)
          .sort((a, b) => (b.spent / b.amount) - (a.spent / a.amount));

        overspentCategories.some((summary) => {
          if (suggestions.length >= 3) return true;
          const delta = summary.spent - summary.amount;
          const recommended = Math.max(Math.round((summary.amount + delta * 0.6) / 10) * 10, 25);
          suggestions.push({
            category: summary.category,
            amount: recommended,
            type: 'adjust',
            reason: 'You keep overspending here. Consider expanding the limit.',
          });
          return false;
        });
      }

      if (suggestions.length === 0) {
        categorySummaries
          .filter((summary) => summary.spent > 0)
          .sort((a, b) => b.spent - a.spent)
          .slice(0, 3)
          .forEach((summary) => {
            suggestions.push({
              category: summary.category,
              amount: Math.max(Math.round(Math.max(summary.spent, summary.amount || summary.spent) / 10) * 10, 25),
              type: 'adjust',
              reason: 'Largest spending category this month.',
            });
          });
      }

      setSuggestedBudgets(suggestions.slice(0, 3));
      setIsGeneratingSuggestions(false);
    }, 420);
  }, [categorySummaries, isGeneratingSuggestions, unbudgetedCategories]);

  const handleBeginEdit = useCallback((budget) => {
    if (!budget) return;
    const key = budget.id || budget.category;
    setEditingBudgetKey(key);
    setDraftAmount(budget.amount?.toString() || '');
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingBudgetKey(null);
    setDraftAmount('');
    setSavingBudgetKey(null);
  }, []);

  const handleSaveBudget = useCallback(
    async (budget) => {
      if (!onUpsertBudget) return;
      const resolvedAmount = Number(draftAmount);
      setSavingBudgetKey(budget.id || budget.category);
      try {
        if (!canAddBudgetForCategory(budget.category)) {
          return;
        }
        await onUpsertBudget({
          category: budget.category,
          amount: Number.isFinite(resolvedAmount) ? resolvedAmount : 0,
        });
        setEditingBudgetKey(null);
        setDraftAmount('');
      } finally {
        setSavingBudgetKey(null);
      }
    },
    [canAddBudgetForCategory, draftAmount, onUpsertBudget],
  );

  const handleSuggestionApply = useCallback(
    async (suggestion) => {
      if (!suggestion) return;
      const { category, amount } = suggestion;
      const normalized = category.toString().toLowerCase();
      const existing = sortedBudgets.find(
        (budget) => (budget?.category || '').toLowerCase() === normalized,
      );

      if (existing) {
        handleBeginEdit(existing);
        setDraftAmount((amount || 0).toString());
        setSuggestedBudgets((prev) => prev.filter((item) => item.category !== category));
        return;
      }

      if (!canAddBudgetForCategory(category)) return;
      if (!onUpsertBudget) return;

      await onUpsertBudget({ category, amount });
      setSuggestedBudgets((prev) => prev.filter((item) => item.category !== category));
    },
    [canAddBudgetForCategory, handleBeginEdit, onUpsertBudget, sortedBudgets],
  );

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat('en-GB', {
        month: 'long',
        year: 'numeric',
      }).format(
        selectedMonth instanceof Date && !Number.isNaN(selectedMonth.valueOf())
          ? selectedMonth
          : new Date(),
      ),
    [selectedMonth],
  );

  const resolveRemainingTone = () => {
    if (remainingToBudget > 0) {
      return {
        badgeClass: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
        helper: 'You still have income left to allocate this month.',
      };
    }
    if (remainingToBudget < 0) {
      return {
        badgeClass: 'bg-rose-100 text-rose-700 border border-rose-200',
        helper: 'You have allocated more than your monthly income. Revisit your plan.',
      };
    }
    return {
      badgeClass: 'bg-sky-100 text-sky-700 border border-sky-200',
      helper: 'Perfectly allocated. Monitor spending to stay aligned.',
    };
  };

  const remainingTone = resolveRemainingTone();

  const handlePaydaySyncClick = useCallback(() => {
    if (!isPremium) {
      onShowPricingModal?.();
      return;
    }
    console.log('Open payday sync settings');
  }, [isPremium, onShowPricingModal]);

  return (
    <motion.main
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.08),_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(59,130,246,0.06),_transparent_60%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-10">
        <motion.header
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col gap-3"
        >
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Proactive Budgeting Hub
          </span>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Monthly Budgeting Hub
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Align your spending with intention and stay ahead of each category.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-slate-700/60 bg-slate-900/50 px-5 py-3 text-right shadow-lg shadow-slate-950/40">
                <p className="text-xs uppercase tracking-wide text-slate-400">Current cycle</p>
                <p className="text-lg font-semibold text-white">{monthLabel}</p>
              </div>
              <button
                type="button"
                onClick={handlePaydaySyncClick}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:border-emerald-400 hover:text-white"
              >
                <CalendarClock className="h-4 w-4" />
                {isPremium ? 'Configure payday sync' : 'Align budget to payday'}
                {!isPremium && <Lock className="h-3.5 w-3.5 opacity-70" />}
              </button>
            </div>
          </div>
        </motion.header>

        <motion.section
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="sticky top-6 z-20 space-y-4 rounded-3xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                id: 'income',
                label: 'Total Available Income',
                value: formatCurrency(monthlyIncome),
                icon: Wallet,
                caption: 'Recurring income plus tracked inflows this month.',
                badgeClass: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
              },
              {
                id: 'spent',
                label: 'Total Spent',
                value: formatCurrency(monthlyExpenses),
                icon: TrendingDown,
                caption: 'Categorised expenses recorded this month.',
                badgeClass: 'bg-rose-500/10 text-rose-300 border border-rose-500/30',
              },
              {
                id: 'budgeted',
                label: 'Total Budgeted',
                value: formatCurrency(totalBudgeted),
                icon: PiggyBank,
                caption: 'Sum of all category allocations.',
                badgeClass: 'bg-sky-500/10 text-sky-300 border border-sky-500/30',
              },
              {
                id: 'remaining',
                label: 'Remaining to Budget',
                value: formatCurrency(remainingToBudget),
                icon: Target,
                caption: remainingTone.helper,
                badgeClass: remainingTone.badgeClass,
              },
            ].map(({ id, label, value, icon: Icon, caption, badgeClass }) => (
              <motion.div
                key={id}
                className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/40"
                variants={fadeInUp}
              >
                <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${badgeClass} opacity-20`} />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
                  </div>
                  <div className="rounded-full border border-slate-700/60 bg-slate-900/80 p-2 text-slate-300">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-500">{caption}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.18 }}
          className="space-y-6 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-white">Category budgets</h2>
              <p className="text-sm text-slate-400">
                Track progress for each allocation and adjust as you respond to the month.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1 text-xs text-slate-400">
                {categorySummaries.length} categories tracked
              </div>
              <button
                type="button"
                onClick={handleGenerateSuggestions}
                disabled={isGeneratingSuggestions}
                className={`inline-flex items-center gap-2 rounded-full border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold transition ${
                  isGeneratingSuggestions
                    ? 'bg-emerald-500/10 text-emerald-200 opacity-80'
                    : 'bg-emerald-500/10 text-emerald-200 hover:border-emerald-400 hover:text-white'
                }`}
              >
                {isGeneratingSuggestions ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analysing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Get AI suggestions
                  </>
                )}
              </button>
            </div>
          </div>
          {!isPremium && (
            <p className="text-xs text-emerald-200">
              Free plan includes up to {MAX_FREE_BUDGETS} categories
              {customBudgetLimitReached
                ? '. Upgrade to add unlimited envelopes.'
                : ` (${freeLimitRemaining} remaining).`}
            </p>
          )}

          {suggestedBudgets.length > 0 && (
            <div className="mt-4 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-100">
                  <Sparkles className="h-4 w-4" />
                  Suggested allocations ready
                </div>
                <button
                  type="button"
                  onClick={() => setSuggestedBudgets([])}
                  className="text-xs font-semibold text-emerald-300 transition hover:text-white"
                >
                  Clear
                </button>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {suggestedBudgets.map((suggestion) => (
                  <div
                    key={suggestion.category}
                    className="flex items-start justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-50"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{suggestion.category}</p>
                      <p className="text-xs text-emerald-200">
                        Recommended {formatCurrency(suggestion.amount)}
                      </p>
                      <p className="mt-1 text-xs text-emerald-300/80">{suggestion.reason}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {suggestion.type === 'new' && !isPremium && customBudgetLimitReached ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-200">
                          <Lock className="h-3 w-3" />
                          Premium
                        </span>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => handleSuggestionApply(suggestion)}
                        className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-100 transition hover:border-emerald-400 hover:text-white"
                      >
                        Apply
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {categorySummaries.length === 0 ? (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-700/70 bg-slate-900/60 p-10 text-center"
              >
                <PiggyBank className="h-10 w-10 text-slate-500" />
                <div>
                  <p className="text-base font-semibold text-white">
                    No budgets yet. Start by allocating your first category.
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Use the dashboard quick add or the controls below to create your plan.
                  </p>
                </div>
              </motion.div>
            ) : (
              categorySummaries.map((budget, index) => {
                const key = budget.id || budget.category;
                const isEditing = editingBudgetKey === key;
                const isSaving = savingBudgetKey === key;
                const overspent = budget.spent > budget.amount;
                const remainingLabel =
                  budget.amount === 0
                    ? 'No limit set'
                    : `${budget.remaining >= 0 ? 'Remaining' : 'Over by'} ${formatCurrency(Math.abs(budget.remaining))}`;

                return (
                  <motion.div
                    key={key}
                    custom={index}
                    variants={listItemVariants}
                    initial="hidden"
                    animate="visible"
                    className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/20"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                          {budget.category || 'General'}
                        </p>
                        <p className="text-lg font-semibold text-white">
                          {formatCurrency(budget.amount)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatCurrency(budget.spent)} spent /{' '}
                          {formatCurrency(budget.amount)} budgeted
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                            overspent
                              ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                              : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {remainingLabel}
                        </span>
                        <button
                          type="button"
                          onClick={() => (isEditing ? handleCancelEdit() : handleBeginEdit(budget))}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-emerald-500/50 hover:text-emerald-200"
                        >
                          <Pencil className="h-4 w-4" />
                          {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800/80">
                        <motion.div
                          className={`h-full rounded-full ${
                            overspent ? 'bg-gradient-to-r from-rose-500 to-rose-400' : 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                          }`}
                          animate={{ width: `${budget.progress * 100}%` }}
                          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                        />
                      </div>
                      {isEditing && (
                        <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 sm:flex-row sm:items-center sm:justify-between">
                          <label className="flex w-full flex-1 flex-col gap-2 text-xs font-medium uppercase tracking-wide text-slate-400 sm:flex-row sm:items-center">
                            <span className="sm:w-40">New budget amount</span>
                            <input
                              type="number"
                              min={0}
                              step="0.01"
                              value={draftAmount}
                              onChange={(event) => setDraftAmount(event.target.value)}
                              className="w-full flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                            />
                          </label>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:border-slate-500 hover:text-slate-100"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveBudget(budget)}
                              disabled={isSaving}
                              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              {isSaving ? (
                                <>
                                  <span className="h-2.5 w-2.5 animate-ping rounded-full bg-emerald-950/70" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <ArrowRight className="h-4 w-4" />
                                  Save changes
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.section>

        {unbudgetedCategories.length > 0 && (
          <motion.section
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.22 }}
            className="space-y-4 rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6 text-amber-100 shadow-2xl shadow-amber-900/10 backdrop-blur"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-white">Unbudgeted activity detected</h3>
                <p className="text-sm text-amber-200">
                  Create categories for these spends to keep allocations aligned.
                </p>
              </div>
              <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                Attention needed
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {unbudgetedCategories.map(({ category, spent }) => (
                <div
                  key={category}
                  className="flex items-center justify-between rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-white"
                >
                  <div>
                    <p className="font-semibold">{category}</p>
                    <p className="text-xs text-amber-200">Spent {formatCurrency(spent)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!canAddBudgetForCategory(category)) return;
                      onUpsertBudget?.({ category, amount: spent });
                    }}
                    className="rounded-full border border-amber-400/40 bg-amber-400/20 px-3 py-1 text-xs font-semibold text-white transition hover:bg-amber-300/30"
                  >
                    Quick budget
                  </button>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        <motion.section
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.28 }}
          className="rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Premium preview
              </p>
              <h3 className="mt-1 text-lg font-semibold text-white">Rollover budgeting</h3>
              <p className="mt-1 text-sm text-slate-400">
                Carry forward unused allocations or overages automatically into your next cycle.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {!isPremium && (
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  <Lock className="h-4 w-4" />
                  Premium feature
                </span>
              )}
            </div>
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr,auto]">
            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Automatically applies surpluses to upcoming months so you stay ahead.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
                  Assign unique rollover rules per category to mirror your habits.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-400" />
                  Combine with alerts to nudge you before overspending happens.
                </li>
              </ul>
            </div>
            <div className="flex items-center justify-center">
              {isPremium ? (
                <div className="flex flex-col items-start gap-2 rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-100">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-200">
                    <PiggyBank className="h-4 w-4" />
                    Included in your plan
                  </span>
                  <p>Great news! Rollover budgeting is active. Configure rules in category settings.</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onShowPricingModal?.()}
                  className="inline-flex items-center gap-3 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400"
                >
                  Unlock rollover budgeting
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </motion.section>

        <motion.section
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.34 }}
          className="rounded-3xl border border-violet-500/25 bg-violet-500/10 p-6 text-violet-100 shadow-2xl shadow-violet-900/10 backdrop-blur"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-300/80">
                Premium preview
              </p>
              <h3 className="mt-1 text-lg font-semibold text-white">Digital envelopes & jars</h3>
              <p className="mt-1 text-sm text-violet-200/80">
                Allocate money into named jars, automate fills from income, and move leftovers with a tap.
              </p>
            </div>
            {!isPremium && (
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-100">
                <Lock className="h-4 w-4" />
                Premium feature
              </span>
            )}
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr),auto]">
            <div className="space-y-3 rounded-2xl border border-violet-500/25 bg-violet-900/40 p-5 text-sm text-violet-100">
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-violet-200">
                <Layers className="h-4 w-4" />
                How it helps
              </div>
              <ul className="space-y-2 text-violet-100/90">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-violet-300" />
                  Auto-fill jars from every payday and track how much is left in each envelope.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-300" />
                  Drag-and-drop to reallocate funds between jars without breaking your monthly plan.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  Pair jars with goals or sinking funds to visualise progress in real time.
                </li>
              </ul>
            </div>
            <div className="flex items-center justify-center">
              {isPremium ? (
                <div className="flex flex-col items-start gap-2 rounded-2xl border border-violet-400/40 bg-violet-400/10 px-5 py-4 text-sm text-violet-100">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-violet-200">
                    <Wallet className="h-4 w-4" />
                    Coming to your plan soon
                  </span>
                  <p>We&apos;re polishing the jar experience next. Let us know which jars you&apos;d like first.</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onShowPricingModal?.()}
                  className="inline-flex items-center gap-3 rounded-full bg-violet-400 px-6 py-3 text-sm font-semibold text-violet-950 shadow-lg shadow-violet-500/30 transition hover:bg-violet-300"
                >
                  Unlock digital envelopes
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </motion.section>
      </div>
    </motion.main>
  );
};

export default BudgetingHubView;
