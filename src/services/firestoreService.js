import {
  collection,
  doc,
  onSnapshot,
  query,
  addDoc,
  setDoc,
  updateDoc,
  increment,
  deleteDoc,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';

// Transactions
export const subscribeToTransactions = (userId, callback) => {
  const q = query(collection(db, 'users', userId, 'transactions'), orderBy('date', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const transactions = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(transactions);
  });
};

export const addTransaction = (userId, transaction) => {
  return addDoc(collection(db, 'users', userId, 'transactions'), {
    ...transaction,
    date: serverTimestamp(),
  });
};

export const updateTransaction = (userId, txId, data) => {
  return updateDoc(doc(db, 'users', userId, 'transactions', txId), data);
};

export const deleteTransaction = (userId, txId) => {
  return deleteDoc(doc(db, 'users', userId, 'transactions', txId));
};

// Goals
export const subscribeToGoals = (userId, callback) => {
  const q = query(collection(db, 'users', userId, 'goals'));
  return onSnapshot(q, (snapshot) => {
    const goals = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(goals);
  });
};

export const addGoal = (userId, goal) => {
  return addDoc(collection(db, 'users', userId, 'goals'), goal);
};

export const contributeToGoal = (userId, goalId, amount) => {
  const goalRef = doc(db, 'users', userId, 'goals', goalId);
  return updateDoc(goalRef, {
    currentAmount: increment(amount),
  });
};

// Budgets
export const subscribeToBudgets = (userId, callback) => {
    const q = query(collection(db, 'users', userId, 'budgets'));
    return onSnapshot(q, (snapshot) => {
        const budgets = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        callback(budgets);
    });
};

export const upsertBudget = (userId, budget) => {
    if (budget.id) {
        return updateDoc(doc(db, 'users', userId, 'budgets', budget.id), budget);
    }
    return addDoc(collection(db, 'users', userId, 'budgets'), budget);
};

// Accounts
export const subscribeToAccounts = (userId, callback) => {
    const q = query(collection(db, 'users', userId, 'accounts'));
    return onSnapshot(q, (snapshot) => {
        const accounts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        callback(accounts);
    });
};

export const upsertAccount = (userId, account) => {
    if (account.id) {
        return updateDoc(doc(db, 'users', userId, 'accounts', account.id), account);
    }
    return addDoc(collection(db, 'users', userId, 'accounts'), account);
};


// User Profile
export const updateUserProfile = (userId, data) => {
  return updateDoc(doc(db, 'users', userId), data);
};
