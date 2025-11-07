import { create } from 'zustand';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../services/firebase';
import {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  addGoal,
  contributeToGoal,
  upsertBudget,
  upsertAccount,
  updateUserProfile,
} from '../services/firestoreService';

const emptyState = () => ({
  userId: null,
  loading: false,
  transactions: [],
  goals: [],
  budgets: [],
  accounts: [],
  revision: 0,
  _disconnect: null,
});

const requireUser = (fnName, userId) => {
  if (!userId) {
    throw new Error(`Cannot call ${fnName} without an authenticated user`);
  }
  return userId;
};

export const useDataStore = create((set, get) => ({
  ...emptyState(),
  connect: (userId) => {
    const prevDisconnect = get()._disconnect;
    if (get().userId === userId && prevDisconnect) {
      return;
    }
    prevDisconnect?.();

    if (!userId) {
      set(emptyState());
      return;
    }

    const unsubscribers = [];
    const readiness = {
      transactions: false,
      goals: false,
      budgets: false,
      accounts: false,
    };
    const markReady = (key) => {
      if (readiness[key]) return;
      readiness[key] = true;
      const allReady = Object.values(readiness).every(Boolean);
      if (allReady) {
        set({ loading: false });
      }
    };

    set({
      userId,
      loading: true,
      transactions: [],
      goals: [],
      budgets: [],
      accounts: [],
      _disconnect: null,
    });

    const txQuery = query(collection(db, 'users', userId, 'transactions'), orderBy('date', 'desc'));
    unsubscribers.push(
      onSnapshot(txQuery, (snapshot) => {
        const transactions = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
        set((state) => ({
          transactions,
          revision: state.revision + 1,
        }));
        markReady('transactions');
      }),
    );

    unsubscribers.push(
      onSnapshot(collection(db, 'users', userId, 'goals'), (snapshot) => {
        const goals = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
        set((state) => ({
          goals,
          revision: state.revision + 1,
        }));
        markReady('goals');
      }),
    );

    unsubscribers.push(
      onSnapshot(collection(db, 'users', userId, 'budgets'), (snapshot) => {
        const budgets = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
        set((state) => ({
          budgets,
          revision: state.revision + 1,
        }));
        markReady('budgets');
      }),
    );

    unsubscribers.push(
      onSnapshot(collection(db, 'users', userId, 'accounts'), (snapshot) => {
        const accounts = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
        set((state) => ({
          accounts,
          revision: state.revision + 1,
        }));
        markReady('accounts');
      }),
    );

    set({
      _disconnect: () => {
        unsubscribers.forEach((unsub) => {
          try {
            unsub?.();
          } catch (_) {}
        });
      },
    });
  },
  disconnect: () => {
    const prevDisconnect = get()._disconnect;
    prevDisconnect?.();
    set(emptyState());
  },
  addTransaction: async (payload) => {
    const userId = requireUser('addTransaction', get().userId);
    return addTransaction(userId, payload);
  },
  updateTransaction: async (id, payload) => {
    const userId = requireUser('updateTransaction', get().userId);
    return updateTransaction(userId, id, payload);
  },
  deleteTransaction: async (id) => {
    const userId = requireUser('deleteTransaction', get().userId);
    return deleteTransaction(userId, id);
  },
  addGoal: async (payload) => {
    const userId = requireUser('addGoal', get().userId);
    return addGoal(userId, payload);
  },
  contributeToGoal: async (goalId, amount) => {
    const userId = requireUser('contributeToGoal', get().userId);
    return contributeToGoal(userId, goalId, amount);
  },
  upsertBudget: async (payload) => {
    const userId = requireUser('upsertBudget', get().userId);
    return upsertBudget(userId, payload);
  },
  upsertAccount: async (payload) => {
    const userId = requireUser('upsertAccount', get().userId);
    return upsertAccount(userId, payload);
  },
  updateUserProfile: async (data) => {
    const userId = requireUser('updateUserProfile', get().userId);
    return updateUserProfile(userId, data);
  },
}));
