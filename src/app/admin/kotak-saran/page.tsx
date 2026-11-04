"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import {
  Inbox,
  Loader2,
  Trash2,
  CheckCircle,
  Clock,
  Archive,
  UserX,
  Phone,
  RefreshCw,
  LogOut,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface KotakSaranItem {
  id: string;
  isAnonim: boolean;
  nama?: string;
  whatsapp?: string;
  kategori: string;
  subjek: string;
  pesan: string;
  status: "baru" | "diproses" | "selesai" | "diarsipkan";
  createdAt?: any;
}

export default function AdminKotakSaranPage() {
  const router = useRouter();
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [saranList, setSaranList] = useState<KotakSaranItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("semua");
  const [filterKategori, setFilterKategori] = useState<string>("semua");

  // 1. Verifikasi Auth & Role
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.email || ""));
        if (userDoc.exists()) {
          const rolesData = userDoc.data().role;
          const roles: string[] = Array.isArray(rolesData) ? rolesData : [rolesData];
          const normalized = roles.map((r) => r.toLowerCase().trim());

          if (normalized.includes("superadmin") || normalized.includes("admin_saran")) {
            setLoadingAuth(false);
            fetchSaran();
            return;
          }
        }
        alert("Akses ditolak! Anda tidak memiliki izin Admin Kotak Saran.");
        router.push("/admin/dashboard");
      } catch (err) {
        console.error("Gagal verifikasi role:", err);
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // 2. Fetch Data dari Firestore
  const fetchSaran = async () => {
    setLoadingFetch(true);
    try {
      const q = query(collection(db, "kotak_saran"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const list: KotakSaranItem[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as KotakSaranItem);
      });
      setSaranList(list);
    } catch (err) {
      console.error("Gagal mengambil data kotak saran:", err);
      toast.error("Gagal memuat data saran.");
    } finally {
      setLoadingFetch(false);
    }
  };

  // 3. Update Status Saran
  const handleUpdateStatus = async (id: string, newStatus: KotakSaranItem["status"]) => {
    try {
      await updateDoc(doc(db, "kotak_saran", id), { status: newStatus });
      setSaranList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      toast.success(`Status berhasil diubah jadi '${newStatus}'`);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memperbarui status.");
    }
  };

  // 4. Hapus Saran
  const handleHapus = async (id: string, subjek: string) => {
    if (!confirm(`Yakin ingin menghapus saran: "${subjek}"?`)) return;
    try {
      await deleteDoc(doc(db, "kotak_saran", id));
      setSaranList((prev) => prev.filter((item) => item.id !== id));
      toast.success("Saran berhasil dihapus.");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus saran.");
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-950 text-white">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span className="text-sm">Memeriksa hak akses...</span>
        </div>
      </div>
    );
  }

  // Filter Data
  const filteredList = saranList.filter((item) => {
    const matchStatus = filterStatus === "semua" || item.status === filterStatus;
    const matchKategori = filterKategori === "semua" || item.kategori === filterKategori;
    return matchStatus && matchKategori;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
              <Inbox className="h-6 w-6 text-blue-400" /> Dashboard Kotak Saran
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Kelola masukan, kritik, dan aspirasi dari siswa & wali murid.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchSaran}
              className="p-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl transition text-slate-300"
              title="Refresh Data"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={() => auth.signOut().then(() => router.push("/login"))}
              className="px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-xl text-xs font-semibold transition flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" /> Keluar
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl">
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">Status Pesan</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 transition block"
            >
              <option value="semua">Semua Status</option>
              <option value="baru">🟡 Baru</option>
              <option value="diproses">🔵 Diproses</option>
              <option value="selesai">🟢 Selesai</option>
              <option value="diarsipkan">⚪ Diarsipkan</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">Kategori</label>
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 transition block"
            >
              <option value="semua">Semua Kategori</option>
              <option value="fasilitas">Fasilitas</option>
              <option value="pembelajaran">Pembelajaran</option>
              <option value="ekskul">Ekskul</option>
              <option value="pelayanan">Pelayanan</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>

          <div className="ml-auto text-xs text-slate-400 self-end pb-2">
            Total: <strong className="text-white">{filteredList.length}</strong> saran
          </div>
        </div>

        {/* Content List */}
        {loadingFetch ? (
          <div className="py-20 text-center text-slate-500 flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="text-sm">Memuat masukan dari Firestore...</span>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/40 border border-slate-800/60 rounded-3xl space-y-3">
            <Inbox className="h-12 w-12 text-slate-600 mx-auto" />
            <p className="text-slate-400 text-sm">Belum ada saran yang sesuai dengan filter.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredList.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition"
              >
                {/* Card Top: Badges & Identitas */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {item.kategori}
                    </span>

                    {/* Status Badge */}
                    {item.status === "baru" && (
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Baru
                      </span>
                    )}
                    {item.status === "diproses" && (
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> Diproses
                      </span>
                    )}
                    {item.status === "selesai" && (
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Selesai
                      </span>
                    )}
                    {item.status === "diarsipkan" && (
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 text-slate-400 flex items-center gap-1">
                        <Archive className="h-3 w-3" /> Arsip
                      </span>
                    )}
                  </div>

                  {/* Info Pengirim */}
                  <div className="text-xs text-slate-400 flex items-center gap-3">
                    {item.isAnonim ? (
                      <span className="flex items-center gap-1 text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                        <UserX className="h-3.5 w-3.5 text-slate-500" /> Pengirim Anonim
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200">{item.nama || "Anonim"}</span>
                        {item.whatsapp && (
                          <a
                            href={`https://wa.me/62${item.whatsapp.replace(/^0/, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-emerald-400 hover:underline bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20"
                          >
                            <Phone className="h-3 w-3" /> {item.whatsapp}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Subjek & Isi Pesan */}
                <div>
                  <h3 className="text-base font-bold text-white mb-1">{item.subjek}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                    {item.pesan}
                  </p>
                </div>

                {/* Card Action / Ubah Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-500">Ubah Status:</span>
                    <button
                      onClick={() => handleUpdateStatus(item.id, "diproses")}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-sky-500 text-sky-400 text-[11px] font-medium transition"
                    >
                      Diproses
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(item.id, "selesai")}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500 text-emerald-400 text-[11px] font-medium transition"
                    >
                      Selesai
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(item.id, "diarsipkan")}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-600 text-slate-400 text-[11px] font-medium transition"
                    >
                      Arsip
                    </button>
                  </div>

                  <button
                    onClick={() => handleHapus(item.id, item.subjek)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                    title="Hapus Saran"
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
  );
}