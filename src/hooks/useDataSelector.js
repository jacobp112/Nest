import { dataStore } from '../contexts/DataContext';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';

// True selector semantics using useSyncExternalStore.
// Components re-render only when the selected slice changes (by reference or custom isEqual).
export function useDataSelector(selector = (s) => s, isEqual = Object.is) {
  return useSyncExternalStoreWithSelector(
    dataStore.subscribe,
    dataStore.getSnapshot,
    dataStore.getSnapshot,
    selector,
    isEqual
  );
}
