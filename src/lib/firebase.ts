import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, limit, orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

// 1. FIREBASE CONFIG
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAyKtCovELdLl95wzmZ2PdbB7AeATQI_5c",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "website-smk-al-kaaffah.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "website-smk-al-kaaffah",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "website-smk-al-kaaffah.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "250718833346",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:250718833346:web:863dfef2f493df08d0495b",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-F0M9SK89D5"
};

// 2. INITIALIZE APPS
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const secondaryApp = getApps().find((a) => a.name === "Secondary") 
  || initializeApp(firebaseConfig, "Secondary");

// 3. EXPORT SERVICES
const db = getFirestore(app);
const auth = getAuth(app);
const secondaryAuth = getAuth(secondaryApp);
const functions = getFunctions(app);

export { db, auth, secondaryAuth, functions };

// ----------------------------------------------------------------------
// 4. ALUMNI SERVICE (Fungsi Fetch Alumni dari Firestore)
// ----------------------------------------------------------------------

export interface AlumniData {
  id?: string;
  name: string;
  quote: string;
  role: string;
  isFeatured?: boolean;
}

export async function getFeaturedAlumni(): Promise<AlumniData[]> {
  try {
    const alumniRef = collection(db, "alumni");
    const q = query(alumniRef, limit(6)); 
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map((doc) => {
      const data = doc.data();

      // Format Jabatan + Tempat Kerja / Angkatan
      // Contoh hasil: "Staff Admin di Gallery Chia • Alumni 2023"
      let formattedRole = "";
      if (data.jabatanJurusan && data.namaInstansi) {
        formattedRole = `${data.jabatanJurusan} di ${data.namaInstansi}`;
      } else if (data.jabatanJurusan) {
        formattedRole = data.jabatanJurusan;
      } else if (data.jurusan) {
        formattedRole = `Alumni ${data.jurusan}`;
      } else {
        formattedRole = "Alumni SMK";
      }

      if (data.tahunLulus) {
        formattedRole += ` • Lulus ${data.tahunLulus}`;
      }

      return {
        id: doc.id,
        name: data.namaLengkap || data.nama || "Alumni",
        quote: data.kesanPesan || data.testimoni || data.quote || "-",
        role: formattedRole,
        isFeatured: true,
      };
    }) as AlumniData[];
  } catch (error) {
    console.error("Error fetching alumni from Firestore:", error);
    return [];
  }
}