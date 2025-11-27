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
      { label: 'Cardholder', value: formData.cardholderName || '—' },
      { label: 'Card ending in', value: lastFourDigits ? lastFourDigits.padStart(4, '•') : '—' },
      { label: 'Expiry', value: formData.expiry || '—' },
      {
        label: 'Billing address',
        value: [formData.addressLine1, formData.addressLine2, `${formData.city} ${formData.region} ${formData.postalCode}`, formData.country]
          .filter(Boolean)
          .join(', ') || '—',
      },
    ];
  }, [formData]);

  return (
    <div className="relative min-h-screen bg-background pb-36 pt-6">
      <div className="mx-auto flex w-full max-w-screen-sm flex-col gap-8 px-4 pb-6 sm:px-6">
        <header className="space-y-2">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200/70">Checkout</p>
          <h1 className="font-display text-3xl text-text-primary sm:text-4xl">Payment</h1>
          <p className="font-sans text-sm text-text-secondary">Designed for thumbs: stay focused on one step at a time and finish with a single tap.</p>
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
      </div>

      <form className="mx-auto w-full max-w-screen-sm px-4 pb-32 sm:px-6" onSubmit={handleSubmit}>
        <div className="space-y-6">
          {stepIndex === 0 && (
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="space-y-1">
              <h2 className="font-display text-2xl text-text-primary">Card details</h2>
              <p className="font-sans text-sm text-text-secondary">We tokenize your card with bank-level controls.</p>
            </div>
            <div className="mt-6 space-y-4">
              <label className="font-sans text-sm text-text-secondary">
                Name on card
                <input
                  type="text"
                  autoComplete="cc-name"
                  className="font-sans mt-2 w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-text-primary focus:border-emerald-300/60 focus:outline-none"
                  value={formData.cardholderName}
                  onChange={(event) => handleFieldChange('cardholderName', event.target.value)}
                  placeholder="Jordan Smith"
                />
              </label>
              <label className="font-sans text-sm text-text-secondary">
                Card number
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  pattern="[0-9 ]*"
                  maxLength={23}
                  className="font-sans mt-2 w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-text-primary focus:border-emerald-300/60 focus:outline-none"
                  value={formData.cardNumber}
                  onChange={(event) => handleFieldChange('cardNumber', event.target.value)}
                  placeholder="4242 4242 4242 4242"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="font-sans text-sm text-text-secondary">
                  Expiration date
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    maxLength={5}
                    className="font-sans mt-2 w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-text-primary focus:border-emerald-300/60 focus:outline-none"
                    value={formData.expiry}
                    onChange={(event) => handleFieldChange('expiry', event.target.value)}
                  />
                </label>
                <label className="font-sans text-sm text-text-secondary">
                  Security code
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    maxLength={4}
                    placeholder="123"
                    className="font-sans mt-2 w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-text-primary focus:border-emerald-300/60 focus:outline-none"
                    value={formData.cvv}
                    onChange={(event) => handleFieldChange('cvv', event.target.value)}
                  />
                </label>
              </div>
            </div>
          </section>
          )}

          {stepIndex === 1 && (
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="space-y-1">
              <h2 className="font-display text-2xl text-text-primary">Billing address</h2>
              <p className="font-sans text-sm text-text-secondary">Match the details that your card issuer has on file.</p>
            </div>
            <div className="mt-6 space-y-4">
              <label className="font-sans text-sm text-text-secondary">
                Street address
                <input
                  type="text"
                  autoComplete="address-line1"
                  className="font-sans mt-2 w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-text-primary focus:border-emerald-300/60 focus:outline-none"
                  value={formData.addressLine1}
                  onChange={(event) => handleFieldChange('addressLine1', event.target.value)}
                  placeholder="123 Coastal Way"
                />
              </label>
              <label className="font-sans text-sm text-text-secondary">
                Apartment, suite, etc. (optional)
                <input
                  type="text"
                  autoComplete="address-line2"
                  className="font-sans mt-2 w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-text-primary focus:border-emerald-300/60 focus:outline-none"
                  value={formData.addressLine2}
                  onChange={(event) => handleFieldChange('addressLine2', event.target.value)}
                  placeholder="Unit 5B"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="font-sans text-sm text-text-secondary">
                  City
                  <input
                    type="text"
                    autoComplete="address-level2"
                    className="font-sans mt-2 w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-text-primary focus:border-emerald-300/60 focus:outline-none"
                    value={formData.city}
                    onChange={(event) => handleFieldChange('city', event.target.value)}
                  />
                </label>
                <label className="font-sans text-sm text-text-secondary">
                  State / Region
                  <input
                    type="text"
                    autoComplete="address-level1"
                    className="font-sans mt-2 w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-text-primary focus:border-emerald-300/60 focus:outline-none"
                    value={formData.region}
                    onChange={(event) => handleFieldChange('region', event.target.value)}
                  />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="font-sans text-sm text-text-secondary">
                  Postal code
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    className="font-sans mt-2 w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-text-primary focus:border-emerald-300/60 focus:outline-none"
                    value={formData.postalCode}
                    onChange={(event) => handleFieldChange('postalCode', event.target.value)}
                  />
                </label>
                <label className="font-sans text-sm text-text-secondary">
                  Country
                  <select
                    autoComplete="country"
                    className="font-sans mt-2 w-full rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-text-primary focus:border-emerald-300/60 focus:outline-none"
                    value={formData.country}
                    onChange={(event) => handleFieldChange('country', event.target.value)}
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                    <option>Other</option>
                  </select>
                </label>
              </div>
            </div>
          </section>
          )}

          {stepIndex === 2 && (
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="space-y-1">
              <h2 className="font-display text-2xl text-text-primary">Review payment</h2>
              <p className="font-sans text-sm text-text-secondary">Double-check everything before pay-off.</p>
            </div>
            <dl className="mt-6 space-y-4">
              {reviewEntries.map((entry) => (
                <div key={entry.label} className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-background/50 p-4">
                  <dt className="font-sans text-sm text-text-secondary">{entry.label}</dt>
                  <dd className="font-display text-base text-text-primary">{entry.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-emerald-200/80">Cart total</p>
              <p className="font-display text-3xl text-emerald-100">{currencyFormatter.format(cartTotal)}</p>
            </div>
          </section>
          )}
        </div>

        <div className="fixed inset-x-0 bottom-0 border-t border-white/10 bg-background/95 px-4 py-4 shadow-[0_-16px_40px_rgba(2,6,23,0.65)] backdrop-blur">
          <div className="mx-auto flex w-full max-w-screen-sm items-center gap-3">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.35em] text-text-secondary">Total due</p>
              <p className="font-display text-2xl text-text-primary">{currencyFormatter.format(cartTotal)}</p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              {stepIndex > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="font-sans rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-text-secondary"
                >
                  Back
                </button>
              )}
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
        </div>
      </form>
    </div>
  );
}
