import { useEffect, useReducer, useRef } from 'react';

// Generic helper to subscribe to a Firestore stream and map it to a slice.
// subscribeFn: (userId, cb) => unsubscribe
// select: (full) => slice
// areEqual: (a, b) => boolean
export function useLiveSlice(subscribeFn, userId, select, areEqual = Object.is, initial = null) {
  const stateRef = useRef(initial);
  const [, force] = useReducer((c) => c + 1, 0);

  useEffect(() => {
    if (!userId) return undefined;
    const unsub = subscribeFn(userId, (full) => {
      const next = select ? select(full) : full;
      if (!areEqual(stateRef.current, next)) {
        stateRef.current = next;
        force();
      }
    });
    return () => unsub && unsub();
  }, [subscribeFn, userId, select, areEqual]);

  return stateRef.current;
}

