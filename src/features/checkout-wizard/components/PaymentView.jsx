import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { checkoutWizardSelectors, useCheckoutWizardStore } from '../stores/useCheckoutWizardStore';

const STORAGE_KEY = 'checkout-payment-wizard';
const wizardSteps = [
  { id: 'card', title: 'Card details', description: 'Securely store your payment method' },
  { id: 'billing', title: 'Billing address', description: 'Match the address on file with your bank' },
  { id: 'confirm', title: 'Review', description: 'Confirm totals before submitting payment' },
];

const defaultFormState = {
  cardholderName: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  region: '',
  postalCode: '',
  country: 'United States',
};

const hydrateInitialState = () => {
  if (typeof window === 'undefined') {
    return { stepIndex: 0, formData: defaultFormState };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { stepIndex: 0, formData: defaultFormState };
    const parsed = JSON.parse(raw);
    return {
      stepIndex: Math.min(parsed?.stepIndex ?? 0, wizardSteps.length - 1),
      formData: { ...defaultFormState, ...(parsed?.formData || {}) },
    };
  } catch {
    return { stepIndex: 0, formData: defaultFormState };
  }
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

export default function PaymentView() {
  const [wizardState, setWizardState] = useState(hydrateInitialState);
  const { stepIndex, formData } = wizardState;
  const cartTotal = checkoutWizardSelectors.useCartTotal();
  const goToStep = useCheckoutWizardStore((state) => state.goToStep);
  const setProcessing = useCheckoutWizardStore((state) => state.setProcessing);
  const isProcessing = checkoutWizardSelectors.useIsProcessing();
  const persistFrameRef = useRef(null);

  useEffect(() => {
    goToStep('payment');
    return () => {
      if (persistFrameRef.current) {
        cancelAnimationFrame(persistFrameRef.current);
      }
    };
  }, [goToStep]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (persistFrameRef.current) {
      cancelAnimationFrame(persistFrameRef.current);
    }
    persistFrameRef.current = window.requestAnimationFrame(() => {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          stepIndex,
          formData,
        }),
      );
      persistFrameRef.current = null;
    });
    return undefined;
  }, [stepIndex, formData]);

  const isFinalStep = stepIndex === wizardSteps.length - 1;

  const handleFieldChange = useCallback((field, value) => {
    setWizardState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        [field]: value,
      },
    }));
  }, []);

  const handleNext = useCallback(() => {
    setWizardState((prev) => ({
      ...prev,
      stepIndex: Math.min(prev.stepIndex + 1, wizardSteps.length - 1),
    }));
  }, []);

  const handleBack = useCallback(() => {
    setWizardState((prev) => ({
      ...prev,
      stepIndex: Math.max(prev.stepIndex - 1, 0),
    }));
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!isFinalStep) {
        handleNext();
        return;
      }

      setProcessing(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        goToStep('confirmation');
      } finally {
        setProcessing(false);
      }
    },
    [goToStep, handleNext, isFinalStep, setProcessing],
  );

  const reviewEntries = useMemo(() => {
    const lastFourDigits = formData.cardNumber?.replace(/\D/g, '').slice(-4) || '';
    return [
      { label: 'Cardholder', value: formData.cardholderName || '–' },
      { label: 'Card ending in', value: lastFourDigits ? lastFourDigits.padStart(4, '•') : '–' },
      { label: 'Expiry', value: formData.expiry || '–' },
      {
        label: 'Billing address',
        value: [formData.addressLine1, formData.addressLine2, `${formData.city} ${formData.region} ${formData.postalCode}`, formData.country]
          .filter(Boolean)
          .join(', ') || '–',
      },
    ];
  }, [formData]);

  return (
    <div className="relative min-h-screen bg-background pb-36 pt-6">
      <div className="mx-auto flex w-full max-w-screen-sm flex-col gap-6 sm:gap-8 px-4 pb-6 sm:px-6">
        <header className="space-y-2">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200/70">Checkout</p>
          <h1 className="font-display text-2xl sm:text-3xl text-text-primary sm:text-4xl">Payment</h1>
          <p className="font-sans text-xs sm:text-sm text-text-secondary">Designed for thumbs: stay focused on one step at a time and finish with a single tap.</p>
        </header>
        <ol className="flex flex-wrap items-center gap-3">
          {wizardSteps.map((step, index) => (
            <li key={step.id} className="flex items-center gap-3">
              <div
                className={clsx(
                  'flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold',
                  index === stepIndex
                    ? 'border-emerald-300/60 bg-emerald-400/20 text-emerald-100'
                    : index < stepIndex
                      ? 'border-emerald-200/30 bg-emerald-400/10 text-emerald-200/80'
                      : 'border-white/15 bg-white/5 text-text-secondary',
                )}
                aria-current={index === stepIndex ? 'step' : undefined}
              >
                {index + 1}
              </div>
              <div className="hidden flex-col sm:flex">
                <p className="font-sans text-xs uppercase tracking-[0.25em] text-text-secondary">{step.title}</p>
                <p className="font-sans text-xs text-text-tertiary">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <form onSubmit={handleSubmit} className="mt-4 space-y-8">
          {/* Step 0: Card Details */}
          {stepIndex === 0 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Cardholder Name</label>
                <input
                  type="text"
                  value={formData.cardholderName}
                  onChange={(e) => handleFieldChange('cardholderName', e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Card Number</label>
                <input
                  type="text"
                  value={formData.cardNumber}
                  onChange={(e) => handleFieldChange('cardNumber', e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="0000 0000 0000 0000"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Expiry</label>
                  <input
                    type="text"
                    value={formData.expiry}
                    onChange={(e) => handleFieldChange('expiry', e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="MM/YY"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">CVV</label>
                  <input
                    type="text"
                    value={formData.cvv}
                    onChange={(e) => handleFieldChange('cvv', e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Billing Address */}
          {stepIndex === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Address Line 1</label>
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => handleFieldChange('addressLine1', e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="123 Main St"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Address Line 2</label>
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) => handleFieldChange('addressLine2', e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Apt 4B"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleFieldChange('city', e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="London"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Region</label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => handleFieldChange('region', e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="Greater London"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Postal Code</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => handleFieldChange('postalCode', e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="SW1A 1AA"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleFieldChange('country', e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="United Kingdom"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {stepIndex === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
                <h3 className="text-lg font-bold text-white">Summary</h3>
                <div className="space-y-3">
                  {reviewEntries.map((entry, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-slate-400">{entry.label}</span>
                      <span className="text-white font-medium text-right max-w-[60%]">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-emerald-200 font-bold">Total to Pay</span>
                <span className="text-xl font-bold text-emerald-400">{currencyFormatter.format(cartTotal)}</span>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-background/80 p-4 backdrop-blur-xl sm:static sm:border-0 sm:bg-transparent sm:p-0">
            <div className="mx-auto flex max-w-screen-sm items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleBack}
                disabled={stepIndex === 0}
                className="font-sans rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-text-secondary disabled:opacity-50 hover:bg-white/5 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className={clsx(
                  'font-sans rounded-2xl px-6 py-3 text-base font-semibold text-emerald-950 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200',
                  isFinalStep
                    ? 'bg-emerald-400 shadow-[0_15px_45px_rgba(16,185,129,0.45)] hover:bg-emerald-300'
                    : 'bg-emerald-500/80 hover:bg-emerald-400',
                )}
                disabled={isProcessing}
              >
                {isFinalStep ? (isProcessing ? 'Processing...' : 'Pay Now') : 'Next'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
