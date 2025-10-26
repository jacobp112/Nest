import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

export const register = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName });
  // Create a user document in Firestore
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    displayName,
    email,
    createdAt: new Date(),
    plan: 'free',
  });
  return userCredential.user;
};

export const login = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logout = () => {
  return signOut(auth);
};

export const monitorAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};
