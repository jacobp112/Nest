import React, { createContext, useContext, useEffect, useState } from 'react';
import { monitorAuthState, login as loginService, register as registerService, logout as logoutService } from '../services/authService';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = monitorAuthState(async (user) => {
      setUser(user);
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const unsubDoc = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setUserDoc({ id: doc.id, ...doc.data() });
          } else {
            setUserDoc(null);
          }
          setLoading(false);
        });
        return () => unsubDoc();
      } else {
        setUserDoc(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      await loginService(email, password);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, displayName) => {
    setLoading(true);
    setError(null);
    try {
      await registerService(email, password, displayName);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
      await logoutService();
  }

  const value = {
    user,
    userDoc,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
