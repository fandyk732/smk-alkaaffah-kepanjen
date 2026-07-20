"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth, secondaryAuth } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  serverTimestamp
} from "firebase/firestore";
import {
  Users,
  UserPlus,
  ShieldCheck,
  Trash2,
  LogOut,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  Mail,
  User as UserIcon,
  KeyRound,
  Check
} from "lucide-react";
import Link from "next/link";

// 📝 OPTION ROLE YANG TERSEDIA
const AVAILABLE_ROLES = [
  { id: "superadmin", label: "Superadmin (Akses Penuh)" },
  { id: "admin_artikel", label: "Admin Artikel (Berita & Blog)" },
  { id: "panitia_ppdb", label: "Panitia PPDB" },
  { id: "admin_alumni", label: "Admin Alumni" },
];

interface UserData {
  id: string; // Email dijadikan ID Document
  nama: string;
  email: string;
  role: string[]; // 🔄 DIUBAH MENJADI ARRAY STRING
  createdAt?: any;
}

export default function SuperadminUsersPage() {
  const router = useRouter();

  // State User & App
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [usersList, setUsersList] = useState<UserData[]>([]);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Form State (Tambah User Native)
  const [namaBaru, setNamaBaru] = useState("");
  const [emailBaru, setEmailBaru] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  
  // 🔄 Multi-Role State (Default: Admin Artikel)
  const [rolesBaru, setRolesBaru] = useState<string[]>(["admin_artikel"]);

  // --- 🛡️ PROTEKSI HALAMAN: Hanya Superadmin yang Boleh Masuk ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.email || ""));
        
        if (userDoc.exists()) {
          const roles = userDoc.data().role;
          // Cek apakah role berupa Array & mengandung 'superadmin' atau string 'superadmin'
          const isSuperadmin = Array.isArray(roles) 
            ? roles.includes("superadmin") 
            : roles === "superadmin";

          if (isSuperadmin) {
            setCurrentUserEmail(user.email || "");
            setLoadingAuth(false);
            ambilDaftarUser();
            return;
          }
        }

        alert("Akses ditolak! Halaman ini khusus Superadmin.");
        router.push("/admin/artikel");
      } catch (err) {
        console.error("Gagal verifikasi role superadmin:", err);
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // 1. Ambil List User dari Firestore
  const ambilDaftarUser = async () => {
    setLoadingFetch(true);
    try {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      const list: UserData[] = [];
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        
        // Handling Backward Compatibility (jika data lama masih berupa Single String)
        let formattedRoles: string[] = [];
        if (Array.isArray(data.role)) {
          formattedRoles = data.role;
        } else if (typeof data.role === "string") {
          formattedRoles = [data.role];
        }

        list.push({
          id: docSnapshot.id,
          nama: data.nama || "",
          email: data.email || docSnapshot.id,
          role: formattedRoles,
          createdAt: data.createdAt
        });
      });
      setUsersList(list);
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    } finally {
      setLoadingFetch(false);
    }
  };

  // Toggle Selection Role pada Form Tambah User
  const handleToggleRoleBaru = (roleId: string) => {
    if (rolesBaru.includes(roleId)) {
      if (rolesBaru.length === 1) {
        alert("Minimal user harus memiliki 1 role!");
        return;
      }
      setRolesBaru(rolesBaru.filter((r) => r !== roleId));
    } else {
      setRolesBaru([...rolesBaru, roleId]);
    }
  };

  // 2. Tambah Data User Baru (Firebase Auth + Firestore)
  const handleTambahUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailBaru.trim() || !namaBaru.trim() || !passwordBaru.trim()) {
      alert("Harap isi semua bidang termasuk password!");
      return;
    }

    if (passwordBaru.length < 6) {
      alert("Password minimal harus 6 karakter!");
      return;
    }

    if (rolesBaru.length === 0) {
      alert("Pilih minimal 1 role untuk pengguna baru!");
      return;
    }

    setLoadingSubmit(true);
    const emailNormalized = emailBaru.toLowerCase().trim();

    try {
      // 🔑 STEP A: Secondary Auth (biar Superadmin tidak logout)
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        emailNormalized,
        passwordBaru
      );

      await secondaryAuth.signOut();

      // 📂 STEP B: Simpan Array Roles ke Firestore
      await setDoc(doc(db, "users", emailNormalized), {
        uid: userCredential.user.uid,
        nama: namaBaru.trim(),
        email: emailNormalized,
        role: rolesBaru, // ARRAY OF ROLES
        createdAt: serverTimestamp()
      });

      alert(`Pengguna ${namaBaru} berhasil didaftarkan dengan ${rolesBaru.length} role!`);
      
      // Reset Form
      setNamaBaru("");
      setEmailBaru("");
      setPasswordBaru("");
      setRolesBaru(["admin_artikel"]);
      
      ambilDaftarUser();
    } catch (error: any) {
      console.error("Gagal menambahkan user:", error);
      if (error.code === "auth/email-already-in-use") {
        alert("Email ini sudah terdaftar di Firebase Authentication!");
      } else {
        alert(`Gagal membuat akun: ${error.message}`);
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  // 3. Ubah Role User dari Daftar List (Toggle Checkbox On-the-fly)
  const handleToggleExistingUserRole = async (userEmail: string, currentRoles: string[], targetRole: string) => {
    let updatedRoles: string[];

    if (currentRoles.includes(targetRole)) {
      if (currentRoles.length === 1) {
        alert("Pengguna harus memiliki minimal 1 role!");
        return;
      }
      updatedRoles = currentRoles.filter((r) => r !== targetRole);
    } else {
      updatedRoles = [...currentRoles, targetRole];
    }

    try {
      const userRef = doc(db, "users", userEmail);
      await updateDoc(userRef, { role: updatedRoles });
      
      // Update local state agar tidak perlu full-re-fetch
      setUsersList((prev) =>
        prev.map((u) => (u.email === userEmail ? { ...u, role: updatedRoles } : u))
      );
    } catch (error) {
      console.error("Gagal mengubah role:", error);
      alert("Gagal memperbarui role user.");
    }
  };

  // 4. Hapus User
  const handleHapusUser = async (userEmail: string, namaUser: string) => {
    if (userEmail === currentUserEmail) {
      alert("Anda tidak bisa menghapus akun Anda sendiri yang sedang login!");
      return;
    }

    const konfirmasi = window.confirm(`Apakah Anda yakin ingin menghapus hak akses Firestore untuk:\n"${namaUser}" (${userEmail})?`);
    if (konfirmasi) {
      try {
        await deleteDoc(doc(db, "users", userEmail));
        alert("Akses pengguna berhasil dihapus dari database!");
        ambilDaftarUser();
      } catch (error) {
        console.error("Gagal menghapus user:", error);
        alert("Gagal menghapus user.");
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-28 pb-20 px-4 sm:px-6 lg:px-8 [color-scheme:light]">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <Link href="/admin/artikel" className="text-slate-400 hover:text-slate-600 transition">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="h-7 w-7 text-blue-600" /> Superadmin Portal
              </h1>
            </div>
            <p className="text-slate-500 text-sm mt-1">
              Kelola daftar akun guru dan kombinasi hak akses/role administrator.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition self-start md:self-auto"
          >
            <LogOut className="h-3.5 w-3.5" /> Keluar
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ================= FORM TAMBAH USER ================= */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm h-fit">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <UserPlus className="h-5 w-5 text-blue-600" /> Tambah Akun Baru
            </h2>

            <form onSubmit={handleTambahUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Nama Lengkap Guru / Staf
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="mis: Bpk. Ahmad, S.Pd"
                    value={namaBaru}
                    onChange={(e) => setNamaBaru(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Email Akun (Native / Custom)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="guru@smkalkaaffah.sch.id"
                    value={emailBaru}
                    onChange={(e) => setEmailBaru(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Password Akun (Min. 6 Karakter)
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={passwordBaru}
                    onChange={(e) => setPasswordBaru(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* MULTI-SELECT ROLE CHECKBOXES */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Hak Akses / Role (Bisa pilih lebih dari 1)
                </label>
                <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  {AVAILABLE_ROLES.map((r) => {
                    const isChecked = rolesBaru.includes(r.id);
                    return (
                      <label
                        key={r.id}
                        onClick={() => handleToggleRoleBaru(r.id)}
                        className={`flex items-center justify-between p-2 rounded-lg border text-xs font-medium cursor-pointer transition select-none ${
                          isChecked
                            ? "bg-blue-50 border-blue-300 text-blue-900"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <span>{r.label}</span>
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border ${
                            isChecked ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300"
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingSubmit}
                className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition flex justify-center items-center gap-2"
              >
                {loadingSubmit ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" /> Daftarkan Akun
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ================= DAFTAR USER & ROLE ================= */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" /> Daftar Pengguna ({usersList.length})
              </h2>
            </div>

            {loadingFetch ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : usersList.length === 0 ? (
              <p className="text-center py-8 text-slate-400 text-sm">Belum ada data user terdaftar.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {usersList.map((item) => (
                  <div key={item.id} className="py-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800 text-sm">{item.nama}</h4>
                        {item.email === currentUserEmail && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Anda
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-mono">{item.email}</p>
                    </div>

                    {/* MULTI ROLE BADGES / TOGGLES PER USER */}
                    <div className="flex flex-wrap items-center gap-1.5 max-w-xs md:justify-end">
                      {AVAILABLE_ROLES.map((r) => {
                        const hasRole = item.role.includes(r.id);
                        const isSelf = item.email === currentUserEmail;

                        return (
                          <button
                            key={r.id}
                            disabled={isSelf}
                            onClick={() => handleToggleExistingUserRole(item.email, item.role, r.id)}
                            title={isSelf ? "Anda tidak bisa merubah role Anda sendiri" : `Klik untuk ${hasRole ? "mencabut" : "memberikan"} role ${r.label}`}
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border transition flex items-center gap-1 ${
                              hasRole
                                ? r.id === "superadmin"
                                  ? "bg-purple-100 text-purple-800 border-purple-300"
                                  : "bg-blue-100 text-blue-800 border-blue-300"
                                : "bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300"
                            } ${isSelf ? "cursor-not-allowed opacity-80" : "cursor-pointer"}`}
                          >
                            <span>{r.id.replace("_", " ").toUpperCase()}</span>
                            {hasRole && <Check className="w-3 h-3 stroke-[3]" />}
                          </button>
                        );
                      })}

                      {/* Tombol Hapus */}
                      <button
                        onClick={() => handleHapusUser(item.email, item.nama)}
                        disabled={item.email === currentUserEmail}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-30 ml-2"
                        title="Hapus Hak Akses"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}