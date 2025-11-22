import React from 'react';

import { checkoutWizardSelectors } from '../../features/checkout-wizard/stores/useCheckoutWizardStore';

export default function NavbarCartTotal() {
  const cartTotal = checkoutWizardSelectors.useCartTotal();

  return (
    <nav className="flex items-center justify-between border-b border-white/10 bg-background/80 px-6 py-4 backdrop-blur">
      <p className="font-display text-lg text-text-primary">Nest Checkout</p>
      <div className="flex items-center gap-2">
        <span className="font-sans text-sm uppercase tracking-[0.3em] text-text-secondary">Cart Total</span>
        <span className="font-display text-xl text-emerald-300" aria-live="polite">
          {cartTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </span>
      </div>
    </nav>
  );
}
