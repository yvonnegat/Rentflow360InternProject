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
  const [role, setRole] = useState("guest");
  const [loading, setLoading] = useState(true);

  // 🔹 Keep user + role in sync with Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Fetch role from Firestore
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        const userRole = docSnap.exists() ? docSnap.data().role : "user";

        setUser(currentUser);
        setRole(userRole);
      } else {
        setUser(null);
        setRole("guest");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 🟢 Register new users and assign a role
  const register = async (email, password, role = "user") => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email,
      role,
      createdAt: new Date(),
    });
    setUser(userCredential.user);
    setRole(role);
  };

  // 🟡 Login existing users
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const docRef = doc(db, "users", userCredential.user.uid);
    const docSnap = await getDoc(docRef);
    setUser(userCredential.user);
    setRole(docSnap.exists() ? docSnap.data().role : "user");
  };

  // 🔴 Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setRole("guest");
  };

  const value = { user, role, register, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
