import React, { useMemo, useCallback } from 'react';
import {
  ArrowRight,
  BarChart3,
  Download,
  FileSpreadsheet,
  Layers,
  LineChart,
  Lock,
  PieChart,
  Sparkles,
} from 'lucide-react';

const backdropClasses =
  'relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100';
const sectionCardClasses =
  'rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur';

const ReportingHubView = ({
  transactions = [],
  budgets = [],
  userDoc = {},
  isPremium = false,
  onShowPricingModal,
}) => {
  const monthlySpend = useMemo(
    () =>
      (transactions || []).reduce((sum, tx) => {
        const amount = Number(tx.amount) || 0;
        if (tx.type === 'expense') return sum + amount;
        if (tx.type === 'income') return sum - amount;
        return sum;
      }, 0),
    [transactions],
  );

  const budgetCoverage = useMemo(() => {
    if (!budgets || budgets.length === 0) return 'No budgets logged yet.';
    const totalBudgeted = budgets.reduce((sum, budget) => sum + (Number(budget.amount) || 0), 0);
    return `${budgets.length} categories • £${totalBudgeted.toLocaleString('en-GB')} allocated`;
  }, [budgets]);

  const householdPlan = (userDoc?.plan || '').toLowerCase();
  const supportsComparisons = ['couple', 'family', 'household'].some((plan) => householdPlan.includes(plan));

  const handleExport = useCallback(
    (type) => {
      if (!isPremium) {
        onShowPricingModal?.();
        return;
      }
      console.log(`Trigger ${type} export`);
    },
    [isPremium, onShowPricingModal],
  );

  const handleOpenReport = useCallback((reportId) => {
    console.log(`Open report: ${reportId}`);
  }, []);

  const premiumAction = useCallback(() => onShowPricingModal?.(), [onShowPricingModal]);

  const predefinedReports = [
    {
      id: 'monthly-spend',
      title: 'Monthly spending overview',
      caption: 'Compare income vs. expense trends with category drill-downs.',
      icon: PieChart,
    },
    {
      id: 'cash-flow',
      title: 'Cash flow health',
      caption: 'Identify months with surplus or strain to forecast future liquidity.',
      icon: BarChart3,
    },
    {
      id: 'budget-performance',
      title: 'Budget performance',
      caption: budgetCoverage,
      icon: Layers,
    },
    {
      id: 'savings-progress',
      title: 'Savings progress',
      caption: 'Track goal contributions and runway.',
      icon: LineChart,
    },
  ];

  return (
    <div className={backdropClasses}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(16,185,129,0.08),_transparent_60%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-10">
        <header className="flex flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-500/40 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-sky-300">
            Reporting hub
          </span>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Insights without the spreadsheet grind
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Surface the metrics that matter, highlight anomalies, and keep stakeholders aligned.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/50 px-5 py-3 text-right shadow-lg shadow-slate-950/40">
              <p className="text-xs uppercase tracking-wide text-slate-400">Net monthly spend</p>
              <p className="text-lg font-semibold text-white">
                {monthlySpend === 0 ? '£0' : `£${Math.abs(monthlySpend).toLocaleString('en-GB')}`}
              </p>
            </div>
          </div>
        </header>

        <section className={`${sectionCardClasses} space-y-5`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-white">Pre-defined reports</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleExport('csv')}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-emerald-400 hover:text-white"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Export CSV
              </button>
              <button
                type="button"
                onClick={() => handleExport('pdf')}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-emerald-400 hover:text-white"
              >
                <Download className="h-4 w-4" />
                Export PDF
              </button>
            </div>
          </div>
          {!isPremium && (
            <p className="rounded-2xl border border-sky-500/20 bg-sky-500/10 px-4 py-3 text-xs text-sky-200">
              Premium unlocks printable PDF packs and CSV exports with one click.
            </p>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            {predefinedReports.map((report) => {
              const Icon = report.icon;
              return (
                <div
                  key={report.id}
                  className="flex h-full flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-lg shadow-slate-950/20"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                        {report.title}
                      </p>
                      <p className="mt-2 text-sm text-slate-300">{report.caption}</p>
                    </div>
                    <span className="rounded-full border border-slate-700 bg-slate-900/80 p-2 text-slate-300">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenReport(report.id)}
                    className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-emerald-400 hover:text-white"
                  >
                    View report
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className={`${sectionCardClasses} space-y-4`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-white">Custom report builder</h2>
            {!isPremium && (
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                <Lock className="h-4 w-4" />
                Premium feature
              </span>
            )}
          </div>
          {isPremium ? (
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr),auto]">
              <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">
                  <Sparkles className="h-4 w-4" />
                  Builder canvas
                </div>
                <p className="text-sm text-slate-300">
                  Drag metrics, filters, and visualisations onto the canvas. Save templates and share
                  dashboards with collaborators.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => console.log('Open custom report builder')}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:border-emerald-400 hover:text-white"
                >
                  Launch builder
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
              <p className="text-sm text-slate-300">
                Build bespoke reports with filters, cohort comparisons, and auto-refresh schedules. Upgrade
                to unlock the full builder.
              </p>
              <button
                type="button"
                onClick={premiumAction}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500"
              >
                Unlock custom builder
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </section>

        {supportsComparisons && (
          <section className={`${sectionCardClasses} space-y-4`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">Comparative household reports</h2>
              {!isPremium && (
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  <Lock className="h-4 w-4" />
                  Premium feature
                </span>
              )}
            </div>
            {isPremium ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 text-sm text-slate-300">
                Generate partner or family comparisons, see combined budgets, and highlight who is driving
                variances. Overlay projections to spot gaps early.
              </div>
            ) : (
              <div className="flex flex-col items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
                <p className="text-sm text-slate-300">
                  Couple and family plans can compare spending, income, and saving behaviours side-by-side.
                </p>
                <button
                  type="button"
                  onClick={premiumAction}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-emerald-400 hover:text-white"
                >
                  Preview comparative reports
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </section>
        )}

        {!supportsComparisons && (
          <section className={`${sectionCardClasses} space-y-3`}>
            <h2 className="text-xl font-semibold text-white">Bring your partner on board</h2>
            <p className="text-sm text-slate-300">
              Invite a partner or upgrade to a household plan to compare finances across members. Once
              activated, comparative dashboards will appear automatically.
            </p>
          </section>
        )}
      </div>
    </div>
  );
};

export default ReportingHubView;
