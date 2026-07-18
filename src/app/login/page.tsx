"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Cek email & password ke Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Ambil data role staf dari Firestore collection 'users'
      const userDocRef = doc(db, "users", user.email || "");
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role;

        // 3. Arahkan staf ke halaman masing-masing sesuai role
        if (role === "bkk" || role === "superadmin") {
          router.push("/admin/alumni");
        } else if (role === "panitia_ppdb") {
          router.push("/admin/ppdb");
        } else if (role === "admin_artikel") {
          router.push("/admin/artikel");
        } else {
          setError("Akun Anda tidak memiliki hak akses role.");
        }
      } else {
        setError("Email Anda terdaftar di Auth, tapi data role di Firestore belum dibuat.");
      }
    } catch (err: any) {
      console.error("Firebase Auth Error:", err.code);
      
      // 🎯 INJEKSI DI SINI: Filter kode error Firebase menjadi bahasa manusia
      if (
        err.code === "auth/invalid-credential" || 
        err.code === "auth/user-not-found" || 
        err.code === "auth/wrong-password"
      ) {
        setError("Email atau password yang lo masukkan salah, bro. Coba cek lagi.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Terlalu banyak percobaan login gagal. Akun diblokir sementara, coba beberapa saat lagi.");
      } else if (err.code === "auth/network-request-failed") {
        setError("Koneksi internet bermasalah. Cek jaringan lo, bro.");
      } else {
        setError("Terjadi kesalahan sistem. Silakan hubungi admin IT sekolah.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid place-items-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-xl font-black text-gray-800">Sistem Portal Staf</h1>
          <p className="text-xs text-gray-500 mt-1">SMK Al Kaaffah Kepanjen</p>
        </div>

        {error && (
          <div className="mb-4 text-xs bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold block mb-1 text-gray-600">EMAIL RESMI</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@smkalkaaffah.sch.id" 
              className="w-full bg-white rounded-xl px-4 py-2.5 text-sm border border-gray-300 focus:outline-none focus:border-blue-600 text-black"
            />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1 text-gray-600">PASSWORD</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full bg-white rounded-xl px-4 py-2.5 text-sm border border-gray-300 focus:outline-none focus:border-blue-600 text-black"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold mt-2 text-sm disabled:bg-gray-400 transition-colors"
          >
            {loading ? "Memverifikasi..." : "Masuk ke Dashboard"}
          </button>
        </form>
      </div>
    </main>
  );
}