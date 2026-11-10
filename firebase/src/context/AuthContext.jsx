import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fungsi Register Akun Baru
  function register(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Fungsi Login Akun
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Fungsi Logout
  function logout() {
    return signOut(auth);
  }

  // Fungsi Reset Password via Email
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Fungsi Update Profil (Display Name & Avatar)
  async function updateUserProfile(displayName, photoURL = null) {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, { displayName, photoURL });
    // Refresh user state
    setCurrentUser({ ...auth.currentUser });
  }

  // Fungsi Kirim Email Verifikasi
  function sendVerification() {
    if (!auth.currentUser) return;
    return sendEmailVerification(auth.currentUser);
  }

  // Pantau perubahan status login pengguna
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    register,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    sendVerification,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
}
