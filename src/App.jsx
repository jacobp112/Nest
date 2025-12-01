import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { motion, AnimatePresence } from 'framer-motion';
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
import DemoDashboard from './components/demo/DemoDashboard.jsx';
import SocialAssetsPage from './pages/SocialAssetsPage.jsx';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage.jsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx';
import AppShell from './components/AppShell.jsx';
import EmailTemplateAdminView from './pages/EmailTemplateAdminView.jsx';
import TopNav from './components/TopNav.jsx';
import BentoLandingPage from './pages/BentoLandingPage.jsx';

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
  // CHANGE: Default view is now 'bento' instead of 'home'
  const [currentView, setCurrentView] = useState('bento');
  const [planContext, setPlanContext] = useState(null);
  const [demoConfig, setDemoConfig] = useState({ tab: 'overview', persona: 'architect' });

  const navigate = useCallback((view, context = null) => {
    if (view === 'demo' && context) {
      setDemoConfig((prev) => ({ ...prev, ...context }));
    }
    setCurrentView(view);
    // Adjust plan context logic if needed, usually mostly for registration flows
    const isRegistrationView = view === 'register' || view === 'home';
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
    // 1. New Default Landing Page
    if (currentView === 'bento') {
      return <BentoLandingPage onNavigate={navigate} />;
    }

    // 2. Experience (Waitlist)
    if (currentView === 'experience') {
      return (
        <div className="relative min-h-screen">
          <ExperienceRegistration onNavigate={navigate} planContext={planContext} />
          <SpeedInsights />
        </div>
      );
    }

    // 3. The Full "Experience" / Registration Page
    if (currentView === 'register' || currentView === 'home') {
      return (
        <div className="relative min-h-screen">
          <RegisterPage onNavigate={navigate} planContext={planContext} />
        </div>
      );
    }

    if (currentView === 'demo') {
      return (
        <div className="bg-[#020617] min-h-screen text-slate-200 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key="demo"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 z-50 bg-[#020617]"
            >
              <DemoDashboard
                initialTab={demoConfig.tab}
                initialPersona={demoConfig.persona}
                onExit={() => navigate('bento')} // Return to Bento, not Home
              />
            </motion.div>
          </AnimatePresence>
        </div>
      );
    }

    // New Pages linked from Bento
    if (currentView === 'vision') {
      return <VisionPage onNavigate={navigate} />;
    }
    if (currentView === 'founder') {
      return <FoundersMessagePage onNavigate={navigate} />;
    }

    // Legacy / Admin Pages
    if (currentView === 'security') return <SecurityPage onNavigate={navigate} />;
    if (currentView === 'pricing') return <PricingPage onNavigate={navigate} />;
    if (currentView === 'privacy') return <PrivacyPolicyPage onNavigate={navigate} />;
    if (currentView === 'terms') return <TermsAndConditionsPage onNavigate={navigate} />;

    if (currentView === 'admin_email') {
      return (
        <div className="relative min-h-screen bg-slate-950 text-slate-100">
          <TopNav onNavigate={navigate} />
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-10">
            <EmailTemplateAdminView onInteract={(message) => console.info(message)} />
          </div>
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

    // Fallback
    return <BentoLandingPage onNavigate={navigate} />;
  }

  // AUTHENTICATED VIEW
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
      <SpeedInsights />
    </AppShell>
  );
}