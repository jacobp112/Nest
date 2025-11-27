import React, { useState } from 'react';
import Starfield from '../components/experience/Starfield';
import TopNav from '../components/TopNav';
import OnboardingChoiceScreen from '../components/OnboardingChoiceScreen.jsx';
import OpenBankingConsentScreen from '../components/OpenBankingConsentScreen.jsx';
import BankConnecting from '../components/demo/BankConnecting.jsx';
import DemoDashboard from '../components/demo/DemoDashboard.jsx';

export default function DemoPage({ onNavigate }) {
  const [step, setStep] = useState('choice');

  if (step === 'dashboard') {
    return <DemoDashboard onExit={() => onNavigate('home')} />;
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      {step !== 'connecting' && <TopNav onNavigate={onNavigate} />}

      <div className="absolute inset-0 z-0">
        <Starfield density={1500} speed={0.4} reducedMotion={false} />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950 pointer-events-none" />
      </div>

      <div className="relative z-10">
        {step === 'choice' && (
          <OnboardingChoiceScreen
            onChoiceBankLink={() => setStep('consent')}
            onChoiceManual={() => alert('Manual flow coming soon to demo!')}
          />
        )}
        {step === 'consent' && (
          <OpenBankingConsentScreen
            onConsent={() => setStep('connecting')}
          />
        )}

        {step === 'connecting' && (
          <div className="fixed inset-0 z-[60] bg-slate-950">
            <BankConnecting onComplete={() => setStep('dashboard')} />
          </div>
        )}
      </div>
    </div>
  );
}
