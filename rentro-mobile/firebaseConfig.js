// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firebase services
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
