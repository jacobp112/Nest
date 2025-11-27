import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';

import { db } from '../../../services/firebase';

const mapSnapshot = (snapshot) =>
  snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));

export const fetchAccounts = async (userId) => {
  if (!userId) return [];
  const accountsRef = collection(db, 'users', userId, 'accounts');
  const snapshot = await getDocs(accountsRef);
  return mapSnapshot(snapshot);
};

export const fetchRecentTransactions = async (userId) => {
  if (!userId) return [];
  const transactionsRef = collection(db, 'users', userId, 'transactions');
  const txQuery = query(transactionsRef, orderBy('date', 'desc'), limit(20));
  const snapshot = await getDocs(txQuery);
  return mapSnapshot(snapshot);
};

export const useAccountsQuery = (userId) =>
  useQuery({
    queryKey: ['accounts', userId],
    queryFn: () => fetchAccounts(userId),
    enabled: Boolean(userId),
    staleTime: 1000 * 60,
  });

export const useRecentTransactionsQuery = (userId) =>
  useQuery({
    queryKey: ['transactions', userId, 'recent'],
    queryFn: () => fetchRecentTransactions(userId),
    enabled: Boolean(userId),
    staleTime: 1000 * 30,
  });
