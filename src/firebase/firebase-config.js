import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAFX7HJQRfAoq2BOANC13xk7dSg9UmsVrw",
    authDomain: "nest-finance-94034.firebaseapp.com",
    projectId: "nest-finance-94034",
    storageBucket: "nest-finance-94034.firebasestorage.app",
    messagingSenderId: "108149121073",
    appId: "1:108149121073:web:8bd415b207eab874e03510",
    measurementId: "G-EE0154TKBX"
};

// FIX: Check if an app is already initialized
// If getApps() has a length, use the existing one (getApp()).
// Otherwise, initialize a new one.
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export default app;