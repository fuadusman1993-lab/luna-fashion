import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDt4tE_fFdKF01W5atJ1jYlol3IOuzgQYM",
  authDomain: "luna-fashion-eefb2.firebaseapp.com",
  projectId: "luna-fashion-eefb2",
  storageBucket: "luna-fashion-eefb2.firebasestorage.app",
  messagingSenderId: "593821929374",
  appId: "1:593821929374:web:cf8d9c4f946f290153908f",
  measurementId: "G-BR3TR9ZZ59"
};

export const isFirebaseConfigured = true;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, storage, googleProvider };
