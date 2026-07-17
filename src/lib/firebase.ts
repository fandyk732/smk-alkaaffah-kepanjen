import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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

// Inisialisasi Firebase (mencegah inisialisasi ganda di Next.js)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Ekspor database Firestore agar bisa dipakai di halaman admin & berita
export const db = getFirestore(app);