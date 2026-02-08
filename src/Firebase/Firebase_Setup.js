// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, sendPasswordResetEmail, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCJn847wyi78dVL_GqXe_Oju9EiZPApRdw",
    authDomain: "show-time-d09eb.firebaseapp.com",
    projectId: "show-time-d09eb",
    storageBucket: "show-time-d09eb.firebasestorage.app",
    messagingSenderId: "468765698958",
    appId: "1:468765698958:web:4fa69ac82880eeb261d2df",
    measurementId: "G-ZRR3HF3ZG8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Auth
export const auth = getAuth(app);
auth.useDeviceLanguage();
export const googleProvider = new GoogleAuthProvider();

// Export utilities for email, google login, and password management
export {
    signInWithPopup,
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink,
    sendPasswordResetEmail,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
};

export default app;