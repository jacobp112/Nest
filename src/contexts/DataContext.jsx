import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  subscribeToTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  subscribeToGoals,
  addGoal,
  contributeToGoal,
  subscribeToBudgets,
  upsertBudget,
  subscribeToAccounts,
  upsertAccount,
  updateUserProfile,
} from '../services/firestoreService';

export const DataContext = createContext();

// External store to enable selector-based subscriptions via useSyncExternalStore
let snapshot = {
  transactions: [],
  goals: [],
  budgets: [],
  accounts: [],
  loading: true,
};
const listeners = new Set();
const notify = () => {
  listeners.forEach((l) => {
    try { l(); } catch (_) {}
  });
};

export const dataStore = {
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => snapshot,
};

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      const setTx = (v) => { setTransactions(v); snapshot = { ...snapshot, transactions: v }; notify(); };
      const setGl = (v) => { setGoals(v); snapshot = { ...snapshot, goals: v }; notify(); };
      const setBd = (v) => { setBudgets(v); snapshot = { ...snapshot, budgets: v }; notify(); };
      const setAc = (v) => { setAccounts(v); snapshot = { ...snapshot, accounts: v }; notify(); };

      const unsubTransactions = subscribeToTransactions(user.uid, setTx);
      const unsubGoals = subscribeToGoals(user.uid, setGl);
      const unsubBudgets = subscribeToBudgets(user.uid, setBd);
      const unsubAccounts = subscribeToAccounts(user.uid, setAc);

      Promise.all([unsubTransactions, unsubGoals, unsubBudgets, unsubAccounts]).then(() => {
        setLoading(false);
        snapshot = { ...snapshot, loading: false };
        notify();
      });

      return () => {
        unsubTransactions();
        unsubGoals();
        unsubBudgets();
        unsubAccounts();
      };
    } else {
      setTransactions([]);
      setGoals([]);
      setBudgets([]);
      setAccounts([]);
      setLoading(false);
      snapshot = { transactions: [], goals: [], budgets: [], accounts: [], loading: false };
      notify();
    }
  }, [user]);

  const value = {
    transactions,
    goals,
    budgets,
    accounts,
    loading,
    addTransaction: (data) => addTransaction(user.uid, data),
    updateTransaction: (id, data) => updateTransaction(user.uid, id, data),
    deleteTransaction: (id) => deleteTransaction(user.uid, id),
    addGoal: (data) => addGoal(user.uid, data),
    contributeToGoal: (id, amount) => contributeToGoal(user.uid, id, amount),
    upsertBudget: (data) => upsertBudget(user.uid, data),
    upsertAccount: (data) => upsertAccount(user.uid, data),
    updateUserProfile: (data) => updateUserProfile(user.uid, data),
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
