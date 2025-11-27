import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import ExperienceRegistration from './pages/ExperienceRegistration.jsx';
import DashboardView from './pages/DashboardView.jsx';
import { useAuth } from './hooks/useAuth.js';
import { formatMonthYear } from './utils/helpers';
import LazyInView from './components/LazyInView.jsx';
import { useDataStore } from './stores/useDataStore.js';
import VisionPage from './pages/VisionPage.jsx';
import SecurityPage from './pages/SecurityPage.jsx';
import PricingPage from './pages/PricingPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DemoPage from './pages/DemoPage.jsx';
import FoundersMessagePage from './pages/FoundersMessagePage.jsx';
import SocialAssetsPage from './pages/SocialAssetsPage.jsx';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage.jsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx';
import AppShell from './components/AppShell.jsx';

const PointsBackgroundLazy = React.lazy(() => import('./components/PointsBackground.jsx'));

const LoadingScreen = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-background">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
  </div>
);

export default function App() {
  const { isAuthenticated, user, userDoc, loading: authLoading, logout } = useAuth();
  const connectData = useDataStore((state) => state.connect);
  const disconnectData = useDataStore((state) => state.disconnect);

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [currentView, setCurrentView] = useState('home');
  const [planContext, setPlanContext] = useState(null);

  const navigate = useCallback((view, context = null) => {
    setCurrentView(view);
    const isRegistrationView = view === 'home' || view === 'register';
    setPlanContext(isRegistrationView ? context : null);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/share' || window.location.search.includes('share')) {
        setCurrentView('share');
      }
    }
  }, []);

  // Prelaunch: no auth modal on landing; we show the Experience page
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
    } catch (_) { }
  };

  useEffect(() => {
    if (isAuthenticated && user?.uid) {
      connectData(user.uid);
    } else {
      disconnectData();
    }
    return () => {
      disconnectData();
    };
  }, [connectData, disconnectData, isAuthenticated, user?.uid]);

  if (currentView === 'share') {
    return <SocialAssetsPage />;
  }

  if (authLoading && isAuthenticated) return <LoadingScreen />;

  if (!isAuthenticated) {
    if (currentView === 'vision') {
      return <VisionPage onNavigate={navigate} />;
    }
    if (currentView === 'founders-message') {
      return <FoundersMessagePage onNavigate={navigate} />;
    }

    if (currentView === 'security') {
      return <SecurityPage onNavigate={navigate} />;
    }
    if (currentView === 'pricing') {
      return <PricingPage onNavigate={navigate} />;
    }
    if (currentView === 'privacy') {
      return <PrivacyPolicyPage onNavigate={navigate} />;
    }
    if (currentView === 'terms') {
      return <TermsAndConditionsPage onNavigate={navigate} />;
    }
    if (currentView === 'register') {
      return (
        <div className="relative min-h-screen">
          <RegisterPage onNavigate={navigate} planContext={planContext} />
        </div>
      );
    }
    if (currentView === 'onboarding-demo') {
      return (
        <div className="relative min-h-screen">
          <DemoPage onNavigate={navigate} />
        </div>
      );
    }
    return (
      <div className="relative min-h-screen">
        <ExperienceRegistration onNavigate={navigate} planContext={planContext} />
      </div>
    );
  }

  return (
    <AppShell>
      <div className="relative min-h-screen">
        <LazyInView className="absolute inset-0 -z-10">
          <React.Suspense fallback={null}>
            <PointsBackgroundLazy className="absolute inset-0" />
          </React.Suspense>
        </LazyInView>
        <div className="relative z-10">
          <DashboardView
            userDoc={userDoc}
            onLogout={logout}
            selectedMonth={selectedMonth}
            dateRange={dateRange}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onDateRangeChange={handleDateRangeChange}
          />
        </div>
      </div>
    </AppShell>
  );
}
