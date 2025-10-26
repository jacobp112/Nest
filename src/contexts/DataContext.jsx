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
      const unsubTransactions = subscribeToTransactions(user.uid, setTransactions);
      const unsubGoals = subscribeToGoals(user.uid, setGoals);
      const unsubBudgets = subscribeToBudgets(user.uid, setBudgets);
      const unsubAccounts = subscribeToAccounts(user.uid, setAccounts);

      Promise.all([unsubTransactions, unsubGoals, unsubBudgets, unsubAccounts]).then(() => {
        setLoading(false);
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
