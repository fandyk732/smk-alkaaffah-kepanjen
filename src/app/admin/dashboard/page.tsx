"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { 
  FileText, 
  UserPlus, 
  GraduationCap, 
  ShieldCheck, 
  LogOut, 
  Loader2, 
  LayoutGrid 
} from "lucide-react";

export default function AdminDashboardHub() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.email || ""));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserName(data.nama || user.displayName || "Admin");
          
          const roles = Array.isArray(data.role) ? data.role : [data.role];
          setUserRoles(roles);
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-950 text-white">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-3">
              <LayoutGrid className="h-8 w-8 text-blue-500" /> Dashboard Administrator
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Selamat datang, <strong className="text-slate-200">{userName}</strong>. Pilih modul aplikasi di bawah ini:
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-slate-900 hover:bg-red-500/10 hover:text-red-400 border border-slate-800 hover:border-red-500/30 rounded-xl text-xs font-semibold flex items-center gap-2 transition self-start md:self-auto"
          >
            <LogOut className="h-4 w-4" /> Keluar
          </button>
        </div>

        {/* Grid Pilihan Menu Berdasarkan Role */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 1. Admin Artikel */}
          {(userRoles.includes("admin_artikel") || userRoles.includes("superadmin")) && (
            <Link
              href="/admin/artikel"
              className="group bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl transition hover:shadow-xl hover:shadow-blue-500/5 flex items-start gap-4"
            >
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl group-hover:scale-110 transition">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-100 group-hover:text-blue-400 transition">
                  Kelola Artikel & Berita
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Tulis, edit, dan publikasikan artikel atau pengumuman sekolah.
                </p>
              </div>
            </Link>
          )}

          {/* 2. Panitia PPDB */}
          {(userRoles.includes("panitia_PPDB") || userRoles.includes("superadmin")) && (
            <Link
              href="/admin/ppdb"
              className="group bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-2xl transition hover:shadow-xl hover:shadow-emerald-500/5 flex items-start gap-4"
            >
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:scale-110 transition">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-100 group-hover:text-emerald-400 transition">
                  Panitia PPDB
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Kelola pendaftaran siswa baru, verifikasi berkas, dan seleksi.
                </p>
              </div>
            </Link>
          )}

          {/* 3. Admin Alumni */}
          {(userRoles.includes("admin_alumni") || userRoles.includes("superadmin")) && (
            <Link
              href="/admin/alumni"
              className="group bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-6 rounded-2xl transition hover:shadow-xl hover:shadow-amber-500/5 flex items-start gap-4"
            >
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl group-hover:scale-110 transition">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-100 group-hover:text-amber-400 transition">
                  Sistem Alumni
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Pendataan alumni, tracer study, dan info lowongan kerja.
                </p>
              </div>
            </Link>
          )}

          {/* 4. Portal Superadmin */}
          {userRoles.includes("superadmin") && (
            <Link
              href="/superadmin/users"
              className="group bg-slate-900 border border-slate-800 hover:border-purple-500/50 p-6 rounded-2xl transition hover:shadow-xl hover:shadow-purple-500/5 flex items-start gap-4"
            >
              <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl group-hover:scale-110 transition">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-100 group-hover:text-purple-400 transition">
                  Kelola Akun & User
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Manajemen pendaftaran akun guru dan hak akses role.
                </p>
              </div>
            </Link>
          )}

        </div>
      </div>
    </div>
  );
}