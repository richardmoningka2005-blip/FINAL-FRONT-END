import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Konfigurasi Firebase dari Environment Variables atau nilai fallback
// Ganti nilai-nilai di bawah ini dengan konfigurasi dari Firebase Console proyek Anda
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoPlaceholderKey1234567890",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890",
};

// Inisialisasi Firebase App
const app = initializeApp(firebaseConfig);

// Inisialisasi Firebase Authentication
export const auth = getAuth(app);

export default app;

