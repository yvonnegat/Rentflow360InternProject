// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Sync Firebase Auth + Firestore user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            // Merge Firebase Auth user and Firestore data
            const firestoreData = docSnap.data();
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              ...firestoreData, // includes role, createdAt, etc.
            });
          } else {
            // If user doc doesn’t exist, set default role
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              role: "user",
            });
          }
        } catch (error) {
          console.error("Error fetching Firestore user:", error);
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            role: "user",
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 🟢 Register new users
  const register = async (email, password, role = "user") => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email,
      role,
      createdAt: new Date(),
    });

    setUser({
      uid: userCredential.user.uid,
      email,
      role,
    });
  };

  // 🟡 Login existing users
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const docRef = doc(db, "users", userCredential.user.uid);
    const docSnap = await getDoc(docRef);

    const role = docSnap.exists() ? docSnap.data().role : "user";
    setUser({
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      role,
    });
  };

  // 🔴 Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const value = { user, register, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
