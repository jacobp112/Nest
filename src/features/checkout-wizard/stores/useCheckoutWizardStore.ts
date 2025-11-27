import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

export type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'confirmation';

export interface CheckoutWizardState {
  currentStep: CheckoutStep;
  cartTotal: number;
  isProcessing: boolean;
  goToStep: (step: CheckoutStep) => void;
  setCartTotal: (total: number) => void;
  setProcessing: (processing: boolean) => void;
  reset: () => void;
}

const DEFAULT_STATE: Pick<CheckoutWizardState, 'currentStep' | 'cartTotal' | 'isProcessing'> = {
  currentStep: 'cart',
  cartTotal: 0,
  isProcessing: false,
};

const createStore = subscribeWithSelector<CheckoutWizardState>((set) => ({
  ...DEFAULT_STATE,
  goToStep: (step) => set({ currentStep: step }),
  setCartTotal: (total) => set({ cartTotal: total }),
  setProcessing: (processing) => set({ isProcessing: processing }),
  reset: () => set({ ...DEFAULT_STATE }),
}));

export const useCheckoutWizardStore = create(devtools(createStore, { name: 'checkout-wizard' }));

type StoreApi = typeof useCheckoutWizardStore;

const createSelectors = (store: StoreApi) => ({
  useCurrentStep: () => store((state) => state.currentStep),
  useCartTotal: () => store((state) => state.cartTotal),
  useIsProcessing: () => store((state) => state.isProcessing),
});

export const checkoutWizardSelectors = createSelectors(useCheckoutWizardStore);
