import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCyzAPxvK3iuGP3xJ7zDIuIwFq6Z-_iN1E",
  authDomain: "rentflow360.firebaseapp.com",
  projectId: "rentflow360",
  storageBucket: "rentflow360.firebasestorage.app",
  messagingSenderId: "253046525607",
  appId: "1:253046525607:web:070f02273efefdd16a5582",
  measurementId: "G-S00425X06K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);