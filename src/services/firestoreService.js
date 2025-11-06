import {
  collection,
  doc,
  addDoc,
  updateDoc,
  increment,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

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

export const addGoal = (userId, goal) => {
  return addDoc(collection(db, 'users', userId, 'goals'), goal);
};

export const contributeToGoal = (userId, goalId, amount) => {
  const goalRef = doc(db, 'users', userId, 'goals', goalId);
  return updateDoc(goalRef, {
    currentAmount: increment(amount),
  });
};

export const upsertBudget = (userId, budget) => {
    if (budget.id) {
        return updateDoc(doc(db, 'users', userId, 'budgets', budget.id), budget);
    }
    return addDoc(collection(db, 'users', userId, 'budgets'), budget);
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
