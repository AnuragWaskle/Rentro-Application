// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, clearIndexedDbPersistence, getFirestore } from "firebase/firestore";
import { getFirestore as getFirestoreLite } from "firebase/firestore/lite";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCbnRoyeadP0F1Yb0rHM0ZJL5soHLK3In4",
    authDomain: "rentro-application.firebaseapp.com",
    projectId: "rentro-application",
    storageBucket: "rentro-application.firebasestorage.app",
    messagingSenderId: "582622365004",
    appId: "1:582622365004:web:0a2c4dc59328731721bbe9",
    measurementId: "G-9H35K7TFR3"
};

// Initialize Firebase (Safely)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth = getAuth(app);

// Initialize Firestore with Long Polling to bypass WebSocket blocks (for main app)
// We need to check if it's already initialized to avoid errors on reload
let dbInstance;
try {
    dbInstance = initializeFirestore(app, {
        experimentalForceLongPolling: true,
    });
} catch (e) {
    // If already initialized, just get the existing instance
    dbInstance = getFirestore(app);
}
export const db = dbInstance;

// Initialize a SEPARATE app instance for Lite to avoid conflict with the main Firestore instance
// This ensures dbLite is a true Lite instance, not the Standard instance returned by getFirestore(app)
let appLite;
const existingLiteApp = getApps().find(a => a.name === 'RENTRO_LITE');
if (existingLiteApp) {
    appLite = existingLiteApp;
} else {
    appLite = initializeApp(firebaseConfig, 'RENTRO_LITE');
}

export const dbLite = getFirestoreLite(appLite);

export const storage = getStorage(app);

// Attempt to clear persistence to fix potential hangs
clearIndexedDbPersistence(db)
    .then(() => console.log("Persistence cleared"))
    .catch((err) => {
        // It's okay if it fails (e.g. if multiple tabs are open), just log it
        if (err.code === 'failed-precondition') {
            console.warn("Persistence clear failed: Multiple tabs open or already initialized.");
        } else if (err.code === 'unimplemented') {
            console.warn("Persistence not supported in this environment.");
        }
    });

export default app;
