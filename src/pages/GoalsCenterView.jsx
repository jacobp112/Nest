import React, { useMemo, useState, useCallback } from 'react';
import { ArrowRight, Calculator, ImagePlus, PiggyBank, Target, TrendingUp, Wand2 } from 'lucide-react';

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

const GoalsCenterView = ({
  goals = [],
  userDoc = {},
  transactions = [],
  monthlySavings = 0,
  isPremium = false,
  onShowPricingModal,
  onAddGoal,
  onContributeToGoal,
}) => {
  const [goalForm, setGoalForm] = useState({
    name: '',
    type: 'savings',
    targetAmount: '',
    currentAmount: '',
    dueDate: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const computedGoals = useMemo(
    () =>
      (goals || []).map((goal) => {
        const target = Number(goal.targetAmount) || 0;
        const current = Number(goal.currentAmount) || 0;
        const isDebt = goal.type === 'debt' || goal.isDebt;
        const effectiveProgress = target > 0 ? Math.min(Math.max(current / target, 0), 1) : 0;
        const remaining = Math.max(target - current, 0);
        const monthsToGoal =
          monthlySavings > 0 ? Math.max(Math.ceil(remaining / monthlySavings), 0) : null;
        return {
          ...goal,
          target,
          current,
          isDebt,
          progress: effectiveProgress,
          remaining,
          monthsToGoal,
        };
      }),
    [goals, monthlySavings],
  );

  const totalTargets = useMemo(
    () => computedGoals.reduce((sum, goal) => sum + goal.target, 0),
    [computedGoals],
  );

  const handleGoalChange = (field, value) => {
    setGoalForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setGoalForm({
      name: '',
      type: 'savings',
      targetAmount: '',
      currentAmount: '',
      dueDate: '',
    });
  };

  const handleAddGoal = useCallback(
    async (event) => {
      event.preventDefault();
      if (!onAddGoal) return;
      if (!isPremium && goals.length >= 1) {
        onShowPricingModal?.();
        return;
      }
      const name = goalForm.name.trim();
      if (!name) return;
      const payload = {
        name,
        type: goalForm.type,
        targetAmount: Number(goalForm.targetAmount) || 0,
        currentAmount: Number(goalForm.currentAmount) || 0,
        dueDate: goalForm.dueDate || null,
      };
      setSubmitting(true);
      try {
        await onAddGoal(payload);
        resetForm();
      } finally {
        setSubmitting(false);
      }
    },
    [goalForm, goals.length, isPremium, onAddGoal, onShowPricingModal],
  );

  const handleAddImage = (goal) => {
    console.log('Open image picker for goal', goal.id || goal.name);
  };

  const handleContribution = (goal) => {
    if (!onContributeToGoal) return;
    const amount = window.prompt(
      `How much would you like to contribute towards ${goal.name}?`,
      '50',
    );
    if (!amount) return;
    const contribution = Number(amount);
    if (Number.isNaN(contribution) || contribution <= 0) return;
    onContributeToGoal(goal, contribution);
  };

  const premiumAction = useCallback(() => onShowPricingModal?.(), [onShowPricingModal]);

  const totalGoals = computedGoals.length;
  const freeLimitReached = !isPremium && totalGoals >= 1;

  return (
    <div className={backdropClasses}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.1),_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(16,185,129,0.08),_transparent_60%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-10">
        <header className="flex flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-orange-200">
            Goals centre
          </span>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Align money with milestones
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Visualise progress, keep motivation high, and automate the next contribution.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/50 px-5 py-3 text-right shadow-lg shadow-slate-950/40">
              <p className="text-xs uppercase tracking-wide text-slate-400">Goals tracked</p>
              <p className="text-lg font-semibold text-white">{totalGoals}</p>
            </div>
          </div>
        </header>

        <section className={`${sectionCardClasses} space-y-6`}>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-lg shadow-slate-950/20">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total targets</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {totalTargets === 0 ? '£0' : formatCurrency(totalTargets)}
              </p>
              <p className="mt-1 text-xs text-slate-500">Aggregate target value across all goals.</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-lg shadow-slate-950/20">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Monthly savings</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {monthlySavings > 0 ? formatCurrency(monthlySavings) : '£0'}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Estimated leftover cash you can route to goals each month.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-lg shadow-slate-950/20">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Momentum</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {totalGoals === 0
                  ? 'Set your first goal'
                  : `${computedGoals.filter((goal) => goal.progress >= 0.5).length} halfway there`}
              </p>
              <p className="mt-1 text-xs text-slate-500">Keep contributions regular to maintain pace.</p>
            </div>
          </div>

          <form className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-6 md:grid-cols-2" onSubmit={handleAddGoal}>
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Goal name
                <input
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  value={goalForm.name}
                  onChange={(event) => handleGoalChange('name', event.target.value)}
                  placeholder="First home deposit"
                  required
                />
              </label>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Goal type
                <select
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  value={goalForm.type}
                  onChange={(event) => handleGoalChange('type', event.target.value)}
                >
                  <option value="savings">Savings</option>
                  <option value="investment">Investment</option>
                  <option value="debt">Debt payoff</option>
                </select>
              </label>
            </div>
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Target amount
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  value={goalForm.targetAmount}
                  onChange={(event) => handleGoalChange('targetAmount', event.target.value)}
                  placeholder="15000"
                />
              </label>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Current amount
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  value={goalForm.currentAmount}
                  onChange={(event) => handleGoalChange('currentAmount', event.target.value)}
                  placeholder="2500"
                />
              </label>
            </div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 md:col-span-2">
              Target date
              <input
                type="date"
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                value={goalForm.dueDate}
                onChange={(event) => handleGoalChange('dueDate', event.target.value)}
              />
            </label>
            <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3">
              {!isPremium && (
                <p className="text-xs text-emerald-200">
                  Free plan includes one active goal. Upgrade to prioritise and automate multiple outcomes.
                </p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Target className="h-4 w-4" />
                {submitting ? 'Adding...' : 'Add goal'}
              </button>
            </div>
          </form>
          {freeLimitReached && (
            <p className="text-xs text-emerald-200">
              You&apos;ve reached the free goal limit. Upgrade to manage an unlimited portfolio of goals.
            </p>
          )}
        </section>

        <section className={`${sectionCardClasses} space-y-6`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-white">Active goals</h2>
            <span className="rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1 text-xs text-slate-400">
              {totalGoals} in progress
            </span>
          </div>
          {totalGoals === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-700/70 bg-slate-900/60 p-10 text-center">
              <Target className="h-10 w-10 text-slate-500" />
              <p className="text-base font-semibold text-white">No goals yet. Start by adding your first milestone.</p>
              <p className="text-sm text-slate-400">
                Premium unlocks auto-prioritisation, scenario planning, and goal-linked investments.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {computedGoals.map((goal) => (
                <div
                  key={goal.id || goal.name}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-lg shadow-slate-950/20"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{goal.name}</p>
                      <p className="text-xs text-slate-500">
                        {goal.type === 'debt' ? 'Debt payoff' : goal.type === 'investment' ? 'Investment' : 'Savings'} goal
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
                      {Math.round(goal.progress * 100)}% funded
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`h-full rounded-full ${
                          goal.progress >= 1 ? 'bg-emerald-500' : 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                        }`}
                        style={{ width: `${Math.min(goal.progress * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500">
                      {formatCurrency(goal.current)} saved of {formatCurrency(goal.target)}
                    </p>
                    {goal.monthsToGoal !== null && (
                      <p className="text-xs text-slate-500">
                        At the current pace you&apos;ll reach this goal in approximately {goal.monthsToGoal} month
                        {goal.monthsToGoal === 1 ? '' : 's'}.
                      </p>
                    )}
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => handleContribution(goal)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-200 transition hover:border-emerald-400 hover:text-white"
                    >
                      <PiggyBank className="h-4 w-4" />
                      Contribute
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddImage(goal)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-emerald-400 hover:text-white"
                    >
                      <ImagePlus className="h-4 w-4" />
                      Add image
                    </button>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-300">
                      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-800/70 px-2 py-1 font-semibold uppercase tracking-wide text-slate-400">
                        <Wand2 className="h-3 w-3" />
                        Prioritisation
                      </div>
                      {isPremium ? (
                        <p>
                          Assign priority ranking and auto-split contributions. We&apos;ll rebalance when income or
                          costs change.
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={premiumAction}
                          className="inline-flex items-center gap-2 text-emerald-200 transition hover:text-white"
                        >
                          Unlock auto-prioritisation
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-300">
                      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-800/70 px-2 py-1 font-semibold uppercase tracking-wide text-slate-400">
                        <Calculator className="h-3 w-3" />
                        Scenario planner
                      </div>
                      {isPremium ? (
                        <p>
                          Run &ldquo;what if&rdquo; scenarios — test extra contributions or new due dates and see the
                          impact instantly.
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={premiumAction}
                          className="inline-flex items-center gap-2 text-emerald-200 transition hover:text-white"
                        >
                          Unlock scenario planner
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-300">
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-800/70 px-2 py-1 font-semibold uppercase tracking-wide text-slate-400">
                      <TrendingUp className="h-3 w-3" />
                      Investment projections
                    </div>
                    {isPremium ? (
                      <p>
                        Layer in projected returns to show how market growth accelerates this goal versus pure cash
                        savings.
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={premiumAction}
                        className="inline-flex items-center gap-2 text-emerald-200 transition hover:text-white"
                      >
                        Unlock investment projections
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={`${sectionCardClasses} space-y-3`}>
          <h2 className="text-xl font-semibold text-white">Upcoming contributions</h2>
          <p className="text-sm text-slate-300">
            Upcoming contributions are calculated from your transaction cadence. Sync more data to improve predictions.
          </p>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-300">
            {transactions && transactions.length > 0 ? (
              <p>
                We&apos;ll highlight upcoming contributions once enough recurring patterns are detected across your
                accounts.
              </p>
            ) : (
              <p>Log transactions or import bank feeds to see projected contribution schedules.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default GoalsCenterView;
