import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// 1. IMPORT getAuth DARI FIREBASE AUTH
import { getAuth } from "firebase/auth";

// Masukkan SDK Firebase Configuration lo di sini
const firebaseConfig = {
  apiKey: "AIzaSyAyKtCovELdLl95wzmZ2PdbB7AeATQI_5c",
  authDomain: "website-smk-al-kaaffah.firebaseapp.com",
  projectId: "website-smk-al-kaaffah",
  storageBucket: "website-smk-al-kaaffah.firebasestorage.app",
  messagingSenderId: "250718833346",
  appId: "1:250718833346:web:863dfef2f493df08d0495b",
  measurementId: "G-F0M9SK89D5"
};

// Initialize Firebase Primary (Anti duplikasi untuk Next.js SSR)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Secondary (Khusus Pendaftaran User Baru oleh Superadmin agar Sesi Utama Tidak Tertimpa)
const secondaryApp = getApps().find((a) => a.name === "Secondary") 
  || initializeApp(firebaseConfig, "Secondary");

// 2. INISIALISASI DATABASE & AUTH
const db = getFirestore(app);
const auth = getAuth(app);
const secondaryAuth = getAuth(secondaryApp); // <-- Secondary Auth untuk Superadmin tambah user

// 3. EXPORT SEMUA AGAR BISA DIPAKAI DI TEMPAT LAIN
export { db, auth, secondaryAuth };