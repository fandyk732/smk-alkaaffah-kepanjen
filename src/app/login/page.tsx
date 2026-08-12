"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";
import { Loader2, Eye, EyeOff, ShieldAlert, X, UserCheck } from "lucide-react";

interface SuperadminInfo {
  nama?: string;
  email: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // State Form Input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // State Modal Lupa Password
  const [showResetModal, setShowResetModal] = useState(false);
  const [loadingSuperadmin, setLoadingSuperadmin] = useState(false);
  const [superadmins, setSuperadmins] = useState<SuperadminInfo[]>([]);

  // 🎯 HELPER UTAMA: CEK ROLE & REDIRECT OTOMATIS BERDASARKAN JUMLAH ROLE
  const handleArahkanBerdasarkanRole = async (userEmail: string) => {
    try {
      const userRef = doc(db, "users", userEmail.toLowerCase().trim());
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        // Backward compatibility: Handle jika role masih String tunggal atau sudah Array
        const roles: string[] = Array.isArray(data.role) ? data.role : [data.role];

        if (roles.length === 0) {
          alert("Akun Anda belum memiliki hak akses. Hubungi Superadmin.");
          await auth.signOut();
          return;
        }

        // Standardisasi role ke lowercase untuk menghindari issue typo huruf besar/kecil
        const normalizedRoles = roles.map((r) => r.toLowerCase().trim());

        // 1. Jika punya role 'superadmin' -> langsung lempar ke Superadmin Portal
        if (normalizedRoles.includes("superadmin")) {
          router.push("/superadmin/users");
          return;
        }

        // 2. Jika punya LEBIH DARI 1 ROLE -> Lempar ke Dashboard Hub / Selection Panel
        if (normalizedRoles.length > 1) {
          router.push("/admin/dashboard");
          return;
        }

        // 3. Jika HANYA PUNYA 1 ROLE -> Langsung ke modul spesifik
        const singleRole = normalizedRoles[0];
        if (singleRole === "admin_artikel") {
          router.push("/admin/artikel");
        } else if (singleRole === "panitia_ppdb" || singleRole === "admin_ppdb") {
          router.push("/admin/ppdb");
        } else if (singleRole === "admin_alumni") {
          router.push("/admin/alumni");
        } else if (singleRole === "admin_galeri") {
          router.push("/admin/galeri");
        } else if (singleRole === "admin_prestasi") {
          router.push("/admin/prestasi");
        } else if (singleRole === "admin_announcement") {
          router.push("/admin/announcement"); // 🎯 INJEKSI HALAMAN ANNOUNCEMENT
        } else {
          alert("Role tidak dikenali. Hubungi Superadmin.");
          await auth.signOut();
        }
      } else {
        alert("Akun Anda belum terdaftar sebagai admin. Minta Superadmin mendaftarkan email Anda terlebih dahulu.");
        await auth.signOut();
      }
    } catch (error) {
      console.error("Gagal verifikasi role:", error);
      alert("Terjadi kesalahan saat memeriksa hak akses.");
      await auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  // 1. LOGIN DENGAN GOOGLE
  const handleLoginGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user.email) {
        await handleArahkanBerdasarkanRole(result.user.email);
      }
    } catch (error) {
      console.error("Login Google Gagal:", error);
      setLoading(false);
    }
  };

  // 2. LOGIN DENGAN EMAIL & PASSWORD
  const handleLoginEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (result.user.email) {
        await handleArahkanBerdasarkanRole(result.user.email);
      }
    } catch (error) {
      console.error("Login Email Gagal:", error);
      alert("Email atau password salah!");
      setLoading(false);
    }
  };

  // 3. FITUR LUPA PASSWORD
  const handleBukaModalLupaPassword = async () => {
    setShowResetModal(true);
    setLoadingSuperadmin(true);

    try {
      const qArray = query(
        collection(db, "users"), 
        where("role", "array-contains", "superadmin")
      );
      
      const qString = query(
        collection(db, "users"), 
        where("role", "==", "superadmin")
      );

      const [snapArray, snapString] = await Promise.all([
        getDocs(qArray),
        getDocs(qString)
      ]);

      const adminMap = new Map<string, SuperadminInfo>();

      snapArray.forEach((docSnap) => {
        const data = docSnap.data();
        adminMap.set(docSnap.id, {
          nama: data.nama || "Superadmin",
          email: data.email || docSnap.id,
        });
      });

      snapString.forEach((docSnap) => {
        const data = docSnap.data();
        adminMap.set(docSnap.id, {
          nama: data.nama || "Superadmin",
          email: data.email || docSnap.id,
        });
      });

      setSuperadmins(Array.from(adminMap.values()));
    } catch (error) {
      console.error("Gagal mengambil data Superadmin:", error);
    } finally {
      setLoadingSuperadmin(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-slate-950 text-white p-4 relative">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-center mb-2">Portal Admin</h1>
        <p className="text-slate-400 text-sm text-center mb-8">
          Silakan masuk menggunakan akun terdaftar.
        </p>
        
        {/* Form Login Email */}
        <form onSubmit={handleLoginEmail} className="space-y-4">
          <div>
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Input Password + Tombol Toggle Lihat Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-4 pr-12 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition p-1"
              title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Tombol Lupa Password */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleBukaModalLupaPassword}
              className="text-xs text-slate-400 hover:text-blue-400 transition"
            >
              Lupa Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Masuk"}
          </button>
        </form>
      </div>

      {/* 🛑 MODAL NOTIFIKASI HUBUNGI SUPERADMIN */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowResetModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition p-1"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-semibold text-white mb-2">Lupa Password?</h3>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              Untuk keamanan sistem, perbaikan atau reset password akun dilakukan secara internal. Silakan hubungi <strong className="text-slate-200">Superadmin</strong> di bawah ini untuk mereset akun Anda:
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 mb-6 space-y-3 max-h-48 overflow-y-auto">
              {loadingSuperadmin ? (
                <div className="flex items-center justify-center py-4 text-slate-500 gap-2 text-xs">
                  <Loader2 className="h-4 w-4 animate-spin" /> Memuat data admin...
                </div>
              ) : superadmins.length > 0 ? (
                superadmins.map((admin, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <UserCheck className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-slate-200">{admin.nama}</p>
                      <p className="text-slate-400 select-all font-mono">{admin.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center py-2">
                  Kontak Superadmin: <br />
                  <span className="font-mono text-slate-300">Hubungi Administrator Utama</span>
                </p>
              )}
            </div>

            <button
              onClick={() => setShowResetModal(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}