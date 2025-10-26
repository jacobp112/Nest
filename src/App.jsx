import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadFull } from 'tsparticles';
import GrowingTreeBackground from './components/GrowingTreeBackground.jsx';
import PricingPlanSelection from './components/PricingPlanSelection.jsx';
import NestFinanceLandingPage from './pages/NestFinanceLandingPage.jsx';
import OnboardingChoiceScreen from './pages/OnboardingChoiceScreen.jsx';
import ManualSetupScreen from './pages/ManualSetupScreen.jsx';
import OpenBankingConsentScreen from './pages/OpenBankingConsentScreen.jsx';
import BankSelectionScreen from './pages/BankSelectionScreen.jsx';
import AccountSelectionScreen from './pages/AccountSelectionScreen.jsx';
import BudgetingHubView from './pages/BudgetingHubView.jsx';
import GoalsCenterView from './pages/GoalsCenterView.jsx';
import AccountsNetWorthView from './pages/AccountsNetWorthView.jsx';
import ReportingHubView from './pages/ReportingHubView.jsx';
import PrototypeRouter from './PrototypeRouter.jsx';
import { serverTimestamp } from 'firebase/firestore';
import { useAuth } from './hooks/useAuth.js';
import AuthCard from './components/AuthCard.jsx';
import { useData } from './hooks/useData.js';
import {
  startOfDay,
  calculateNetMonthlySavings,
  serialiseDate,
} from './utils/helpers';
import {
  PRIMARY_NAV_VIEW_MAP,
} from './utils/constants';
import DashboardView from './pages/DashboardView.jsx';

// This file is getting too large. The DashboardView component will be moved to its own file.
// The helper functions and constants have been moved to /utils

function NestFinanceApp() {
  const {
    user,
    userDoc,
    loading: authLoading,
    error: authError,
    login,
    register,
    logout,
    isAuthenticated,
  } = useAuth();
  const {
    transactions,
    goals,
    budgets,
    accounts,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addGoal,
    contributeToGoal,
    upsertBudget,
    upsertAccount,
    updateUserProfile,
  } = useData();

  const [view, setView] = useState('landing');
  const [mode, setMode] = useState('login');
  const [currentNavView, setCurrentNavView] = useState(PRIMARY_NAV_VIEW_MAP.dashboard.key);

  const getMonthRange = useCallback((value) => {
    const base = value instanceof Date ? new Date(value) : new Date(value || Date.now());
    const start = serialiseDate(new Date(base.getFullYear(), base.getMonth(), 1));
    const end = serialiseDate(new Date(base.getFullYear(), base.getMonth() + 1, 0), 'end');
    const label = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(base);
    return { type: 'month', start, end, label };
  }, []);

  const [dateRange, setDateRange] = useState(() => getMonthRange(new Date()));
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [onboardingStep, setOnboardingStep] = useState('choice');
  const [isSyncing, setIsSyncing] = useState(false);
  const [linkedAccountsData, setLinkedAccountsData] = useState(null);
  // justLinkedBank state removed; tracking handled via isSyncing / linkedAccountsData
  const [selectedBankName, setSelectedBankName] = useState('');
  const [selectedBankId, setSelectedBankId] = useState('');
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [dashboardParticlesReady, setDashboardParticlesReady] = useState(false);
  const [isCheckoutProcessing, setIsCheckoutProcessing] = useState(false);
  const bankFetchTimeoutRef = useRef(null);
  const syncTimeoutRef = useRef(null);
  const checkoutTimeoutRef = useRef(null);

  useEffect(() => {
    if (authLoading) {
      setView('loading');
    } else if (isAuthenticated) {
      if (userDoc && (userDoc.recurringIncome === undefined || userDoc.onboardingMethod === undefined)) {
        setView('onboarding');
      } else {
        setView('dashboard');
      }
    } else {
      // If there was a user before (e.g. logged out), go to landing.
      // If loading is finished and there's no user, stay on auth/landing.
      if (view === 'dashboard') {
        setView('landing');
      }
    }
  }, [isAuthenticated, authLoading, userDoc, view]);

  const handleLogin = async (email, password) => {
    await login(email, password);
  };

  const handleRegister = async (email, password, displayName) => {
    await register(email, password, displayName);
  };

  const showPricingModal = () => setIsPricingModalOpen(true);
  const hidePricingModal = () => setIsPricingModalOpen(false);

  const handleNavChange = useCallback(
    (nextView) => {
      if (!nextView || !PRIMARY_NAV_VIEW_MAP[nextView]) {
        return;
      }
      setCurrentNavView(nextView);
    },
    [],
  );

  const isPremiumPlan = useMemo(() => (userDoc?.plan || 'free') !== 'free', [userDoc]);

  const initiatePaddleCheckout = useCallback((checkoutLink) => {
    if (!checkoutLink) {
      console.error('Missing checkout link for Paddle session.');
      return;
    }
    window.location.href = checkoutLink;
  }, []);

  useEffect(() => {
    if (view !== 'dashboard' && currentNavView !== PRIMARY_NAV_VIEW_MAP.dashboard.key) {
      setCurrentNavView(PRIMARY_NAV_VIEW_MAP.dashboard.key);
    }
  }, [currentNavView, view]);

  const handlePlanSelected = (planId) => {
    if (!planId) {
      console.error('Cannot initiate checkout without a plan identifier.');
      return;
    }
    if (!user?.uid) {
      console.error('Cannot initiate checkout without an authenticated user.');
      return;
    }

    setIsCheckoutProcessing(true);
    if (checkoutTimeoutRef.current) {
      clearTimeout(checkoutTimeoutRef.current);
    }

    const checkoutRequestPayload = {
      planId,
      uid: user.uid,
    };

    console.info('Requesting Paddle checkout session', checkoutRequestPayload);

    checkoutTimeoutRef.current = setTimeout(() => {
      checkoutTimeoutRef.current = null;

      const simulatedCheckoutLink = `https://sandbox-checkout.paddle.com/session?plan_id=${encodeURIComponent(
        planId,
      )}&uid=${encodeURIComponent(user.uid)}`;

      setIsCheckoutProcessing(false);
      hidePricingModal();
      initiatePaddleCheckout(simulatedCheckoutLink);
    }, 1000);
  };

  const shiftMonth = useCallback(
    (offset) => {
      setSelectedMonth((prev) => {
        const next = new Date(prev.getFullYear(), prev.getMonth() + offset, 1);
        setDateRange(getMonthRange(next));
        return next;
      });
    },
    [getMonthRange],
  );

  const handlePrevMonth = useCallback(() => {
    shiftMonth(-1);
  }, [shiftMonth]);

  const handleNextMonth = useCallback(() => {
    shiftMonth(1);
  }, [shiftMonth]);

  const handleDateRangeChange = useCallback(
    (nextRange) => {
      if (!nextRange) return;
      setDateRange(nextRange);
      if (nextRange.start) {
        const rangeStart = startOfDay(nextRange.start);
        setSelectedMonth(new Date(rangeStart.getFullYear(), rangeStart.getMonth(), 1));
      }
    },
    [],
  );

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    })
      .then(() => setDashboardParticlesReady(true))
      .catch((error) => {
        console.error('Failed to initialise dashboard particles', error);
      });
  }, []);

  const dashboardParticlesOptions = useMemo(
    () => ({
      fullScreen: { enable: false },
      detectRetina: true,
      background: { color: 'transparent' },
      fpsLimit: 60,
      interactivity: {
        detectsOn: 'window',
        events: {
          onHover: { enable: true, mode: 'bubble' },
          resize: true,
        },
        modes: {
          bubble: { distance: 140, duration: 2, opacity: 0.35, size: 4 },
        },
      },
      particles: {
        number: { value: 70, density: { enable: true, area: 900 } },
        color: { value: ['#22d3ee', '#34d399', '#a855f7'] },
        shape: { type: 'circle' },
        opacity: {
          value: { min: 0.2, max: 0.45 },
          animation: { enable: true, speed: 0.5, minimumValue: 0.2, sync: false },
        },
        size: {
          value: { min: 1, max: 3 },
          animation: { enable: true, speed: 2, minimumValue: 1, sync: false },
        },
        move: {
          enable: true,
          speed: 0.5,
          direction: 'none',
          random: true,
          straight: false,
          outModes: { default: 'out' },
        },
        links: { enable: false },
      },
    }),
    [],
  );

  useEffect(
    () => () => {
      if (bankFetchTimeoutRef.current) {
        clearTimeout(bankFetchTimeoutRef.current);
      }
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      if (checkoutTimeoutRef.current) {
        clearTimeout(checkoutTimeoutRef.current);
      }
    },
    [],
  );

  const handleChoiceManual = () => {
    if (bankFetchTimeoutRef.current) {
      clearTimeout(bankFetchTimeoutRef.current);
      bankFetchTimeoutRef.current = null;
    }
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = null;
    }
    setOnboardingStep('manualSetup');
    setLinkedAccountsData(null);
    setSelectedBankName('');
    setSelectedBankId('');
  // justLinkedBank removed
    setIsSyncing(false);
  };

  const handleChoiceBankLink = () => {
    if (bankFetchTimeoutRef.current) {
      clearTimeout(bankFetchTimeoutRef.current);
      bankFetchTimeoutRef.current = null;
    }
    setOnboardingStep('consent');
    setLinkedAccountsData(null);
    setSelectedBankName('');
    setSelectedBankId('');
  // justLinkedBank removed
    setIsSyncing(false);
  };

  const handleManualSubmit = async (manualData) => {
    if (!user) return;
    const { lastIncome = 0, mainBalance = 0 } = manualData || {};
    await handleOnboardingSubmit(lastIncome, 0, {
      onboardingMethod: 'manual',
      startingBalance: Number(mainBalance) || 0,
      lastManualIncome: Number(lastIncome) || 0,
    });
    if (bankFetchTimeoutRef.current) {
      clearTimeout(bankFetchTimeoutRef.current);
      bankFetchTimeoutRef.current = null;
    }
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = null;
    }
    setLinkedAccountsData(null);
    setIsSyncing(false);
  // justLinkedBank removed
    setSelectedBankName('');
    setSelectedBankId('');
  };

  const handleConsent = () => {
    setOnboardingStep('bankSelect');
  };

  const bankNameById = {
    chase: 'Chase',
    boa: 'Bank of America',
    wells: 'Wells Fargo',
  };

  const handleBankSelected = (bankId) => {
    const friendlyName = bankNameById[bankId] || 'Selected Bank';
    setSelectedBankId(bankId);
    setSelectedBankName(friendlyName);
    setOnboardingStep('accountSelect');
    setLinkedAccountsData(null);
  // justLinkedBank removed
    if (bankFetchTimeoutRef.current) {
      clearTimeout(bankFetchTimeoutRef.current);
    }
    const mockAccounts = [
      { id: `${bankId || 'bank'}-acc1`, name: `${friendlyName} Current Account`, balance: 1234.56, type: 'checking' },
      { id: `${bankId || 'bank'}-acc2`, name: `${friendlyName} Savings`, balance: 5678.9, type: 'savings' },
    ];
    bankFetchTimeoutRef.current = setTimeout(() => {
      setLinkedAccountsData(mockAccounts);
      bankFetchTimeoutRef.current = null;
    }, 1500);
  };

  const handleAccountsSelected = async (selectedAccountIds) => {
    if (!user || !Array.isArray(selectedAccountIds) || selectedAccountIds.length === 0) return;
    const availableAccounts = linkedAccountsData || [];
    const selectedAccounts = availableAccounts.filter((account) => selectedAccountIds.includes(account.id));

    for (const acc of selectedAccounts) {
      await upsertAccount({
        name: acc.name,
        balance: acc.balance,
        type: acc.type,
        linkedBank: selectedBankName,
      });
    }

    setLinkedAccountsData(selectedAccounts);
    setOnboardingStep('dashboard');
    setView('dashboard');
    if (bankFetchTimeoutRef.current) {
      clearTimeout(bankFetchTimeoutRef.current);
      bankFetchTimeoutRef.current = null;
    }
  // justLinkedBank removed
    setIsSyncing(true);
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    syncTimeoutRef.current = setTimeout(() => {
      setIsSyncing(false);
      syncTimeoutRef.current = null;
    }, 3500);
    const onboardingExtras = {
      onboardingMethod: 'bank',
      linkedInstitution: {
        bankId: selectedBankId || 'unknown',
        bankName: selectedBankName || bankNameById[selectedBankId] || 'Selected Bank',
        accounts: selectedAccounts.map(a => a.id),
        lastLinkedAt: serverTimestamp(),
      },
    };
    await handleOnboardingSubmit(userDoc?.recurringIncome ?? 0, userDoc?.recurringExpenses ?? 0, onboardingExtras);
  };

  const handleOnboardingSubmit = async (income, expenses, extraFields = {}) => {
    if (!user) return;
    try {
      await updateUserProfile({
        recurringIncome: Number(income) || 0,
        recurringExpenses: Number(expenses) || 0,
        ...extraFields,
        updatedAt: serverTimestamp(),
      });
      setView('dashboard');
      setOnboardingStep('dashboard');
    } catch (error) {
      console.error('Failed to save onboarding data', error);
    }
  };

  const monthlySavingsEstimate = useMemo(() => {
    return calculateNetMonthlySavings(userDoc?.recurringIncome, userDoc?.recurringExpenses, transactions);
  }, [userDoc, transactions]);

  if (view === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900 px-5 py-3 text-slate-200 shadow-xl">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
          <span className="text-sm font-medium">Securing your dashboard...</span>
        </div>
      </div>
    );
  }

  if (view === 'landing') {
    return (
      <NestFinanceLandingPage
        onLoginClick={() => {
          setMode('login');
          setView('auth');
        }}
        onGetStartedClick={() => {
          setMode('register');
          setView('auth');
        }}
      />
    );
  }

  const isAuthView = view === 'auth';

  return (
    <div className="relative min-h-screen">
      {isAuthView ? (
        <GrowingTreeBackground />
      ) : (
        <>
          <div
            className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
            aria-hidden
          />
          {dashboardParticlesReady && (
            <div className="pointer-events-none absolute inset-0 -z-10">
              <Particles options={dashboardParticlesOptions} className="h-full w-full" />
            </div>
          )}
        </>
      )}
      <div
        className={`relative z-10 min-h-screen ${
          isAuthView ? '' : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
        }`}
      >
        {view !== 'dashboard' && (
          <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-12">
            {view === 'auth' && (
              <AuthCard
                key="auth"
                mode={mode}
                setMode={setMode}
                onLogin={handleLogin}
                onRegister={handleRegister}
                loading={authLoading}
                error={authError}
              />
            )}
            {view === 'onboarding' && (
              <>
                {onboardingStep === 'choice' && (
                  <OnboardingChoiceScreen
                    key="onboarding-choice"
                    onChoiceManual={handleChoiceManual}
                    onChoiceBankLink={handleChoiceBankLink}
                  />
                )}
                {onboardingStep === 'manualSetup' && (
                  <ManualSetupScreen key="manual-setup" onSubmit={handleManualSubmit} />
                )}
                {onboardingStep === 'consent' && (
                  <OpenBankingConsentScreen key="consent" onConsent={handleConsent} />
                )}
                {onboardingStep === 'bankSelect' && (
                  <BankSelectionScreen key="bank-select" onBankSelected={handleBankSelected} />
                )}
                {onboardingStep === 'accountSelect' && (
                  <AccountSelectionScreen
                    key="account-select"
                    bankName={selectedBankName || 'Selected Bank'}
                    accounts={linkedAccountsData || []}
                    onAccountsSelected={handleAccountsSelected}
                    isLoading={!linkedAccountsData}
                  />
                )}
              </>
            )}
          </div>
        )}
        {view === 'dashboard' && userDoc && (
          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-10 lg:py-12">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800/60 bg-slate-900/60 px-4 py-3 shadow-lg shadow-slate-950/20">
              <div className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Primary views
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {Object.values(PRIMARY_NAV_VIEW_MAP).map((item) => {
                  const isActive = currentNavView === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleNavChange(item.key)}
                      className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        isActive
                          ? 'border-emerald-500/70 bg-emerald-500/20 text-emerald-200'
                          : 'border-slate-700 bg-slate-900/80 text-slate-300 hover:border-emerald-500/40 hover:text-emerald-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
            {currentNavView === PRIMARY_NAV_VIEW_MAP.dashboard.key ? (
              <DashboardView
                userDoc={userDoc}
                transactions={transactions}
                goals={goals}
                onAddTransaction={addTransaction}
                onAddGoal={addGoal}
                onLogout={logout}
                selectedMonth={selectedMonth}
                dateRange={dateRange}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onUpdateTransaction={updateTransaction}
                onDeleteTransaction={deleteTransaction}
                onUpdateProfile={updateUserProfile}
                budgets={budgets}
                onUpsertBudget={upsertBudget}
                onContributeToGoal={contributeToGoal}
                accounts={accounts}
                onUpsertAccount={upsertAccount}
                isSyncingTransactions={isSyncing}
                onShowPricingModal={() => setIsPricingModalOpen(true)}
                onDateRangeChange={handleDateRangeChange}
                onNavChange={setCurrentNavView}
              />
            ) : null}
            {currentNavView === PRIMARY_NAV_VIEW_MAP.budgets.key ? (
              <BudgetingHubView
                budgets={budgets}
                transactions={transactions}
                userDoc={userDoc}
                selectedMonth={selectedMonth}
                onUpsertBudget={upsertBudget}
                onShowPricingModal={showPricingModal}
                isPremium={isPremiumPlan}
              />
            ) : null}
            {currentNavView === PRIMARY_NAV_VIEW_MAP.goals.key ? (
              <GoalsCenterView
                goals={goals}
                userDoc={userDoc}
                transactions={transactions}
                monthlySavings={monthlySavingsEstimate}
                isPremium={isPremiumPlan}
                onShowPricingModal={showPricingModal}
                onAddGoal={addGoal}
                onContributeToGoal={contributeToGoal}
              />
            ) : null}
            {currentNavView === PRIMARY_NAV_VIEW_MAP.accounts.key ? (
              <AccountsNetWorthView
                accounts={accounts}
                transactions={transactions}
                userDoc={userDoc}
                isPremium={isPremiumPlan}
                onShowPricingModal={showPricingModal}
              />
            ) : null}
            {currentNavView === PRIMARY_NAV_VIEW_MAP.reports.key ? (
              <ReportingHubView
                transactions={transactions}
                budgets={budgets}
                userDoc={userDoc}
                isPremium={isPremiumPlan}
                onShowPricingModal={showPricingModal}
              />
            ) : null}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isPricingModalOpen && (
          <PricingPlanSelection
            currentPlan={userDoc?.plan || 'free'}
            onSelectPlan={handlePlanSelected}
            onDismiss={hidePricingModal}
            isProcessing={isCheckoutProcessing}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// If the app is opened with ?prototype=1 we render the prototype router (non-destructive)
let AppExport = NestFinanceApp;
try {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('prototype') === '1') {
      AppExport = PrototypeRouter;
    }
  }
} catch (e) {
  // ignore parsing errors and fall back to main app
}

export default AppExport;

