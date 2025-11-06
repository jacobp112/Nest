import React, { useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import NestFinanceLandingPage from './pages/NestFinanceLandingPage.jsx';
import DashboardView from './pages/DashboardView.jsx';
import { useAuth } from './hooks/useAuth.js';
import { useData } from './hooks/useData.js';
import { formatMonthYear } from './utils/helpers';
import LazyInView from './components/LazyInView.jsx';
import AuthCard from './components/AuthCard.jsx';

const WorkerCanvasBackgroundLazy = React.lazy(() => import('./components/WorkerCanvasBackground.jsx'));
const PointsBackgroundLazy = React.lazy(() => import('./components/PointsBackground.jsx'));

const LoadingScreen = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-background">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
  </div>
);

export default function App() {
  const { isAuthenticated, userDoc, loading: authLoading, error: authError, login, register, logout } = useAuth();
  const data = useData();

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const dateRange = useMemo(() => {
    const start = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
    const end = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
    return {
      type: 'month',
      start: start.toISOString(),
      end: end.toISOString(),
      label: formatMonthYear(selectedMonth),
    };
  }, [selectedMonth]);

  const handlePrevMonth = () => setSelectedMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const handleNextMonth = () => setSelectedMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  const handleDateRangeChange = (payload) => {
    try {
      if (!payload?.start) return;
      const d = new Date(payload.start);
      setSelectedMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    } catch (_) {}
  };

  if (authLoading) return <LoadingScreen />;

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen">
        <React.Suspense fallback={null}>
          <WorkerCanvasBackgroundLazy />
        </React.Suspense>
        <div className="relative z-10">
          <NestFinanceLandingPage
            onGetStartedClick={() => {
              setAuthMode('register');
              setAuthOpen(true);
            }}
            onLoginClick={() => {
              setAuthMode('login');
              setAuthOpen(true);
            }}
          />
        </div>

        {authOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative w-full max-w-md">
              <AuthCard
                mode={authMode}
                setMode={setAuthMode}
                onLogin={login}
                onRegister={register}
                loading={authLoading}
                error={authError}
              />
              <button
                type="button"
                aria-label="Close auth"
                onClick={() => setAuthOpen(false)}
                className="absolute right-2 top-2 rounded-full bg-surface px-2 py-1 text-xs text-text-secondary hover:bg-surface-muted"
              >
                Close
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <LazyInView className="absolute inset-0 -z-10">
        <React.Suspense fallback={null}>
          <PointsBackgroundLazy className="absolute inset-0" />
        </React.Suspense>
      </LazyInView>
      <div className="relative z-10">
        <DashboardView
          userDoc={userDoc}
          transactions={data.transactions}
          goals={data.goals}
          onAddTransaction={data.addTransaction}
          onAddGoal={data.addGoal}
          onLogout={logout}
          selectedMonth={selectedMonth}
          dateRange={dateRange}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onUpdateTransaction={data.updateTransaction}
          onDeleteTransaction={data.deleteTransaction}
          onUpdateProfile={data.updateUserProfile}
          budgets={data.budgets}
          onUpsertBudget={data.upsertBudget}
          onContributeToGoal={data.contributeToGoal}
          accounts={data.accounts}
          onUpsertAccount={data.upsertAccount}
          onDateRangeChange={handleDateRangeChange}
        />
      </div>
    </div>
  );
}
