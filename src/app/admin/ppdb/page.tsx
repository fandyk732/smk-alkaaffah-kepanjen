"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDoc 
} from "firebase/firestore";
import { 
  Search, 
  Filter, 
  Loader2, 
  RefreshCw, 
  Printer, 
  FileSpreadsheet, 
  LogOut, 
  LayoutGrid, 
  Calendar, 
  Eye, 
  Compass, 
  Award, 
  Sparkles, 
  Pencil, 
  Trash2, 
  X, 
  Save 
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Pendaftar {
  id: string;
  namaLengkap: string;
  nisn: string;
  asalSekolah: string;
  whatsapp: string;
  pilihanJurusan: string;
  ekstrakurikuler?: string;
  programUnggulan?: string;
  statusPendaftaran: "Menunggu Verifikasi" | "Diterima" | "Ditolak";
  createdAt: any;
  tes?: {
    butaWarna?: {
      skor: number;
      totalSoal: number;
      status: string;
      selesaiPada?: any;
    };
    jurusan?: {
      rekomendasi: string;
      skor: Record<string, number>;
      selesaiPada?: any;
    };
  };
}

// --- FUNGSI HELPER FORMAT TIMESTAMP FIRESTORE KE INDONESIA ---
const formatTanggalIndo = (timestamp: any) => {
  if (!timestamp) return "-";

  let date: Date;

  if (timestamp?.toDate && typeof timestamp.toDate === "function") {
    date = timestamp.toDate();
  } else if (timestamp?.seconds) {
    date = new Date(timestamp.seconds * 1000);
  } else {
    date = new Date(timestamp);
  }

  if (isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export default function AdminPPDBPage() {
  const router = useRouter();
  const [listPendaftar, setListPendaftar] = useState<Pendaftar[]>([]);
  const [loading, setLoading] = useState(true);
  const [panitiaName, setPanitiaName] = useState("");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterJurusan, setFilterJurusan] = useState("");

  const [selectedIndividu, setSelectedIndividu] = useState<Pendaftar | null>(null);

  // --- STATE KONTROL MODAL EDIT & HAPUS ---
  const [editingPendaftar, setEditingPendaftar] = useState<Pendaftar | null>(null);
  const [editNama, setEditNama] = useState("");
  const [editNisn, setEditNisn] = useState("");
  const [editAsalSekolah, setEditAsalSekolah] = useState("");
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const [deletingPendaftar, setDeletingPendaftar] = useState<Pendaftar | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- AMBIL DATA PPDB FROM FIRESTORE ---
  const ambilDataPPDB = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "ppdb"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data: Pendaftar[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Pendaftar);
      });
      setListPendaftar(data);
    } catch (error) {
      console.error("Gagal mengambil data SPMB:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- PROTEKSI HALAMAN & AUTOMATIC FETCH ---
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
          const roles: string[] = Array.isArray(data.role) ? data.role : [data.role];
          const hasAccess = roles.includes("panitia_PPDB") || roles.includes("admin_ppdb") || roles.includes("superadmin");

          if (hasAccess) {
            setPanitiaName(data.nama || "Panitia SPMB");
            await ambilDataPPDB();
          } else {
            alert("Anda tidak memiliki akses ke modul SPMB!");
            router.push("/admin/dashboard");
          }
        } else {
          await auth.signOut();
          router.push("/login");
        }
      } catch (err) {
        console.error("Gagal verifikasi hak akses:", err);
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router, ambilDataPPDB]);

  const handleKembaliKeDashboard = () => {
    router.push("/admin/dashboard");
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const ubahStatus = async (id: string, statusBaru: "Diterima" | "Ditolak") => {
    try {
      const docRef = doc(db, "ppdb", id);
      await updateDoc(docRef, { statusPendaftaran: statusBaru });
      
      setListPendaftar((prev) =>
        prev.map((item) => (item.id === id ? { ...item, statusPendaftaran: statusBaru } : item))
      );
    } catch (error) {
      alert("Gagal mengubah status pendaftaran.");
      console.error(error);
    }
  };

  // --- FUNGSI BUKA MODAL EDIT ---
  const handleOpenEdit = (pendaftar: Pendaftar) => {
    setEditingPendaftar(pendaftar);
    setEditNama(pendaftar.namaLengkap || "");
    setEditNisn(pendaftar.nisn || "");
    setEditAsalSekolah(pendaftar.asalSekolah || "");
  };

  // --- FUNGSI SIMPAN HASIL EDIT ---
  const handleSaveEdit = async () => {
    if (!editingPendaftar) return;
    if (!editNama.trim() || !editNisn.trim() || !editAsalSekolah.trim()) {
      alert("Nama, NISN, dan Asal Sekolah tidak boleh kosong!");
      return;
    }

    setIsSubmittingEdit(true);
    try {
      const docRef = doc(db, "ppdb", editingPendaftar.id);
      await updateDoc(docRef, {
        namaLengkap: editNama.trim(),
        nisn: editNisn.trim(),
        asalSekolah: editAsalSekolah.trim(),
      });

      setListPendaftar((prev) =>
        prev.map((item) =>
          item.id === editingPendaftar.id
            ? {
                ...item,
                namaLengkap: editNama.trim(),
                nisn: editNisn.trim(),
                asalSekolah: editAsalSekolah.trim(),
              }
            : item
        )
      );

      setEditingPendaftar(null);
    } catch (error) {
      console.error("Gagal mengupdate data pendaftar:", error);
      alert("Gagal memperbarui data pendaftar.");
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // --- FUNGSI HAPUS DATA PENDAFTAR ---
  const handleDelete = async () => {
    if (!deletingPendaftar) return;

    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "ppdb", deletingPendaftar.id));

      setListPendaftar((prev) => prev.filter((item) => item.id !== deletingPendaftar.id));
      setDeletingPendaftar(null);
    } catch (error) {
      console.error("Gagal menghapus data pendaftar:", error);
      alert("Gagal menghapus data pendaftar.");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- FUNGSI DOWNLOAD EXCEL (CSV UTF-8 AMAN BUKA DI EXCEL) ---
  const downloadExcel = () => {
    if (pendaftarDifilter.length === 0) return alert("Tidak ada data untuk diexport");

    const headers = [
      "Waktu Daftar", 
      "Nama Lengkap", 
      "NISN", 
      "Asal Sekolah", 
      "WhatsApp", 
      "Pilihan Jurusan",
      "Program Unggulan",
      "Ekstrakurikuler",
      "Tes Buta Warna", 
      "Rekomendasi Tes Jurusan", 
      "Status Pendaftaran"
    ];
    
    // Fungsi sanitasi sederhana biar aman dari tanda petik ganda
    const clean = (text: any) => `"${String(text || "").replace(/"/g, '""')}"`;

    const rows = pendaftarDifilter.map(p => [
      clean(formatTanggalIndo(p.createdAt)),
      clean(p.namaLengkap),
      clean(`'${p.nisn}`), // Tambah petik tunggal di depan NISN agar Excel membacanya sebagai Teks (Nol depan/angka panjang tak terpotong)
      clean(p.asalSekolah),
      clean(`'${p.whatsapp}`),
      clean(p.pilihanJurusan),
      clean(p.programUnggulan || "Belum Memilih"),
      clean(p.ekstrakurikuler || "Belum Memilih"),
      clean(p.tes?.butaWarna ? `${p.tes.butaWarna.status} (${p.tes.butaWarna.skor}/${p.tes.butaWarna.totalSoal})` : "Belum Tes"),
      clean(p.tes?.jurusan?.rekomendasi || "Belum Tes"),
      clean(p.statusPendaftaran || "Menunggu Verifikasi")
    ]);

    // Gabungkan baris header & data
    const csvArray = [headers.map(clean).join(","), ...rows.map(row => row.join(","))];
    const csvString = csvArray.join("\r\n");

    // \uFEFF adalah UTF-8 BOM agar Excel Windows langsung membaca baris & karakter dengan sempurna
    const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8;" });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Data_PPDB_Export_${new Date().toLocaleDateString("id-ID")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const printSemua = () => {
    setSelectedIndividu(null);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const printIndividu = (pendaftar: Pendaftar) => {
    setSelectedIndividu(pendaftar);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const pendaftarDifilter = listPendaftar.filter((p) => {
    const cocokSearch =
      (p.namaLengkap || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.nisn || "").includes(searchQuery) ||
      (p.asalSekolah || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const cocokJurusan = filterJurusan === "" || p.pilihanJurusan === filterJurusan;
    return cocokSearch && cocokJurusan;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16 text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Disembunyikan saat print */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5 mb-8 print:hidden">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Dashboard Panitia SPMB</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Petugas: <span className="font-semibold text-foreground">{panitiaName || "Panitia SPMB"}</span> • Total pendaftar: <span className="font-bold text-primary">{listPendaftar.length} siswa</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={downloadExcel} variant="outline" size="sm" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400">
              <FileSpreadsheet className="mr-2 h-4 w-4" /> Export Excel
            </Button>
            <Button onClick={printSemua} variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" /> Cetak Semua
            </Button>
            <Button onClick={ambilDataPPDB} variant="ghost" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
            
            <Button onClick={handleKembaliKeDashboard} variant="outline" size="sm" className="gap-1.5 rounded-xl border-slate-300">
              <LayoutGrid className="h-4 w-4" /> Kembali ke Dashboard
            </Button>

            <Button onClick={handleLogout} variant="destructive" size="sm" className="gap-1.5 rounded-xl">
              <LogOut className="h-4 w-4" /> Keluar
            </Button>
          </div>
        </div>

        {/* Laporan Print Area (Hanya Muncul saat Cetak Semua) */}
        {!selectedIndividu && (
          <div className="hidden print:block text-center border-b-2 pb-4 mb-6">
            <h1 className="text-2xl font-bold uppercase text-black">Laporan Pendaftaran SPMB</h1>
            <p className="text-sm text-black">SMK Al Kaaffah Kepanjen — Petugas Cetak: {panitiaName} — Tanggal: {new Date().toLocaleDateString("id-ID")}</p>
          </div>
        )}

        {/* Search Bar & Filter */}
        <div className="grid gap-4 sm:grid-cols-3 mb-6 print:hidden">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari berdasarkan Nama, NISN, atau Asal Sekolah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 rounded-xl border bg-card px-4 py-2 text-sm outline-none focus:border-primary transition"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <select
              value={filterJurusan}
              onChange={(e) => setFilterJurusan(e.target.value)}
              className="w-full pl-9 rounded-xl border bg-card px-4 py-2 text-sm outline-none focus:border-primary transition appearance-none"
            >
              <option value="">Semua Jurusan</option>
              {Array.from(new Set(listPendaftar.map((p) => p.pilihanJurusan))).map((jurus) => (
                <option key={jurus} value={jurus}>{jurus}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Content */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 print:hidden gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground font-medium">Memuat data pendaftar...</p>
          </div>
        ) : pendaftarDifilter.length === 0 ? (
          <div className="text-center py-20 border rounded-2xl bg-card">
            <p className="text-muted-foreground">Tidak ada data pendaftar yang cocok.</p>
          </div>
        ) : (
          <>
            {/* =========================================================
                1. TAMPILAN MODE KARTU (KHUSUS HP / MOBILE)
                ========================================================= */}
            <div className="grid gap-4 sm:hidden print:hidden">
              {pendaftarDifilter.map((p) => {
                const tesBW = p.tes?.butaWarna;
                const tesJur = p.tes?.jurusan;

                return (
                  <div key={p.id} className="p-4 rounded-2xl border bg-card shadow-sm space-y-3">
                    {/* Header Kartu: Nama & Status */}
                    <div className="flex justify-between items-start border-b pb-2">
                      <div>
                        <h3 className="font-bold text-sm">{p.namaLengkap}</h3>
                        <p className="text-xs text-muted-foreground font-mono">NISN: {p.nisn}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {p.statusPendaftaran === "Diterima" && (
                          <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200">
                            Diterima
                          </span>
                        )}
                        {p.statusPendaftaran === "Ditolak" && (
                          <span className="rounded-full bg-red-100 dark:bg-red-950/30 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:text-red-400 border border-red-200">
                            Ditolak
                          </span>
                        )}
                        {(!p.statusPendaftaran || p.statusPendaftaran === "Menunggu Verifikasi") && (
                          <span className="rounded-full bg-amber-100 dark:bg-amber-950/30 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-500 border border-amber-200">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Detail Informasi Utama */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[10px]">WAKTU DAFTAR</span>
                        <span className="font-medium">{formatTanggalIndo(p.createdAt)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">ASAL SEKOLAH</span>
                        <span className="font-medium">{p.asalSekolah}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">PILIHAN JURUSAN</span>
                        <span className="font-semibold text-primary">{p.pilihanJurusan}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">KONTAK WA</span>
                        <a href={`https://wa.me/${p.whatsapp ? p.whatsapp.replace(/^0/, "62") : ""}`} target="_blank" rel="noreferrer" className="text-primary underline font-medium">
                          {p.whatsapp}
                        </a>
                      </div>
                    </div>

                    {/* PROGRAM UNGGULAN & EKSKUL (MOBILE) */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                        <span className="text-muted-foreground text-[11px]">Program:</span>
                        <span className="font-semibold text-foreground">{p.programUnggulan || "Belum Memilih"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Award className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        <span className="text-muted-foreground text-[11px]">Ekskul:</span>
                        <span className="font-semibold text-foreground">{p.ekstrakurikuler || "Belum Memilih"}</span>
                      </div>
                    </div>

                    {/* Hasil Tes */}
                    <div className="pt-2 border-t flex items-center justify-between gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[10px]">TES BUTA WARNA</span>
                        {tesBW ? (
                          <span className={`font-semibold px-1.5 py-0.5 rounded text-[10px] ${tesBW.status === "Normal" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                            {tesBW.status} ({tesBW.skor}/{tesBW.totalSoal})
                          </span>
                        ) : (
                          <span className="italic text-muted-foreground text-[11px]">Belum Tes</span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-muted-foreground block text-[10px]">REKOMENDASI TES</span>
                        {tesJur ? (
                          <span className="font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px]">
                            {tesJur.rekomendasi}
                          </span>
                        ) : (
                          <span className="italic text-muted-foreground text-[11px]">Belum Tes</span>
                        )}
                      </div>
                    </div>

                    {/* Tombol Aksi di HP */}
                    <div className="pt-2 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => ubahStatus(p.id, "Diterima")}
                          disabled={p.statusPendaftaran === "Diterima"}
                          className="flex-1 text-emerald-600 hover:text-white hover:bg-emerald-600 border-emerald-200 h-8 text-xs"
                        >
                          Terima
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => ubahStatus(p.id, "Ditolak")}
                          disabled={p.statusPendaftaran === "Ditolak"}
                          className="flex-1 text-destructive hover:text-white hover:bg-destructive h-8 text-xs"
                        >
                          Tolak
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenEdit(p)}
                          className="flex-1 border-slate-300 h-8 text-xs text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeletingPendaftar(p)}
                          className="flex-1 border-red-200 h-8 text-xs text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" /> Hapus
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => printIndividu(p)}
                          className="h-8 text-xs px-3"
                        >
                          <Printer className="h-3.5 w-3.5 mr-1" /> Bukti
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* =========================================================
                2. TAMPILAN TABEL BIASA (DESKTOP / TABLET)
                ========================================================= */}
            <div className="hidden sm:block overflow-x-auto rounded-2xl border bg-card shadow-sm print:block print:border-none print:shadow-none">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-900 uppercase font-semibold text-muted-foreground border-b print:bg-transparent print:text-black">
                  <tr>
                    <th className="px-3 py-3.5">Waktu / NISN</th>
                    <th className="px-3 py-3.5">Nama & Sekolah</th>
                    <th className="px-3 py-3.5">Jurusan Utama</th>
                    <th className="px-3 py-3.5">Program & Ekskul</th>
                    <th className="px-3 py-3.5">Kontak WA</th>
                    <th className="px-3 py-3.5">Hasil Tes</th>
                    <th className="px-3 py-3.5">Status</th>
                    <th className="px-3 py-3.5 text-center print:hidden sticky right-0 bg-slate-100 dark:bg-slate-900 shadow-l">Aksi & Berkas</th>
                  </tr>
                </thead>
                <tbody className="divide-y print:divide-y-2">
                  {pendaftarDifilter.map((p) => {
                    const tesBW = p.tes?.butaWarna;
                    const tesJur = p.tes?.jurusan;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition print:hover:bg-transparent">
                        {/* Waktu & NISN */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium print:text-black">
                            <Calendar className="h-3 w-3 shrink-0 print:hidden text-slate-400" />
                            <span>{formatTanggalIndo(p.createdAt)}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground font-mono print:text-black mt-0.5">NISN: {p.nisn}</p>
                        </td>

                        {/* Nama & Asal Sekolah */}
                        <td className="px-3 py-3">
                          <p className="font-bold text-xs print:text-black">{p.namaLengkap}</p>
                          <p className="text-[11px] text-muted-foreground font-medium print:text-black">{p.asalSekolah}</p>
                        </td>

                        {/* Pilihan Jurusan */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-800 dark:text-slate-100 border print:border-none print:bg-transparent print:p-0 print:text-black">
                            {p.pilihanJurusan}
                          </span>
                        </td>

                        {/* PROGRAM UNGGULAN & EKSKUL */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-[11px]">
                              <Sparkles className="h-3 w-3 text-purple-600 print:hidden shrink-0" />
                              <span className="font-medium text-slate-700 dark:text-slate-300 print:text-black">
                                {p.programUnggulan || "Belum Memilih"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px]">
                              <Award className="h-3 w-3 text-amber-600 print:hidden shrink-0" />
                              <span className="text-muted-foreground print:text-black">
                                {p.ekstrakurikuler || "Belum Memilih"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Kontak WA */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          <a
                            href={`https://wa.me/${p.whatsapp ? p.whatsapp.replace(/^0/, "62") : ""}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:underline font-medium text-xs print:text-black print:no-underline"
                          >
                            {p.whatsapp}
                          </a>
                        </td>

                        {/* HASIL TES */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="space-y-1">
                            {/* Tes BW */}
                            {tesBW ? (
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3 text-cyan-600 print:hidden" />
                                <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${
                                  tesBW.status === "Normal" 
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400" 
                                    : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400"
                                }`}>
                                  BW: {tesBW.status} ({tesBW.skor}/{tesBW.totalSoal})
                                </span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-muted-foreground italic block">BW: Belum Tes</span>
                            )}

                            {/* Rekomendasi Jurusan */}
                            {tesJur ? (
                              <div className="flex items-center gap-1">
                                <Compass className="h-3 w-3 text-indigo-600 print:hidden" />
                                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 px-1.5 py-0.2 rounded">
                                  Rek: {tesJur.rekomendasi}
                                </span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-muted-foreground italic block">Rek: Belum Tes</span>
                            )}
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          {p.statusPendaftaran === "Diterima" && (
                            <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-950/30 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 print:text-black print:border-none">
                              Diterima
                            </span>
                          )}
                          {p.statusPendaftaran === "Ditolak" && (
                            <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-950/30 px-2 py-0.5 text-[11px] font-semibold text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900 print:text-black print:border-none">
                              Ditolak
                            </span>
                          )}
                          {(!p.statusPendaftaran || p.statusPendaftaran === "Menunggu Verifikasi") && (
                            <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-950/30 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-500 border border-amber-200 dark:border-amber-900 print:text-black print:border-none">
                              Pending
                            </span>
                          )}
                        </td>

                        {/* KOLOM AKSI (Sticky Right) */}
                        <td className="px-3 py-3 print:hidden whitespace-nowrap sticky right-0 bg-card shadow-l">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => ubahStatus(p.id, "Diterima")}
                              disabled={p.statusPendaftaran === "Diterima"}
                              className="text-emerald-600 hover:text-white hover:bg-emerald-600 border-emerald-200 dark:border-emerald-900 h-7 px-2 text-[11px]"
                            >
                              Terima
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => ubahStatus(p.id, "Ditolak")}
                              disabled={p.statusPendaftaran === "Ditolak"}
                              className="text-destructive hover:text-white hover:bg-destructive h-7 px-2 text-[11px]"
                            >
                              Tolak
                            </Button>
                            
                            {/* Tombol Edit */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenEdit(p)}
                              className="h-7 px-2 text-[11px] text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950"
                              title="Edit Nama, NISN & Sekolah"
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>

                            {/* Tombol Hapus */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeletingPendaftar(p)}
                              className="h-7 px-2 text-[11px] text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950"
                              title="Hapus Pendaftar"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>

                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => printIndividu(p)}
                              className="h-7 px-2 text-[11px]"
                              title="Cetak Bukti"
                            >
                              <Printer className="h-3 w-3 mr-1" /> Bukti
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* =========================================================================
          MODAL EDIT DATA PENDAFTAR
          ========================================================================= */}
      {editingPendaftar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm print:hidden">
          <div className="bg-card w-full max-w-md rounded-2xl border shadow-xl overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Pencil className="h-5 w-5 text-blue-600" /> Edit Data Pendaftar
              </h2>
              <button 
                onClick={() => setEditingPendaftar(null)}
                className="text-muted-foreground hover:text-foreground transition rounded-lg p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={editNama}
                  onChange={(e) => setEditNama(e.target.value)}
                  className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition"
                  placeholder="Masukkan Nama Lengkap"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  NISN
                </label>
                <input
                  type="text"
                  value={editNisn}
                  onChange={(e) => setEditNisn(e.target.value)}
                  className="w-full rounded-xl border bg-background px-3 py-2 text-sm font-mono outline-none focus:border-primary transition"
                  placeholder="Masukkan NISN"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Asal Sekolah
                </label>
                <input
                  type="text"
                  value={editAsalSekolah}
                  onChange={(e) => setEditAsalSekolah(e.target.value)}
                  className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition"
                  placeholder="Masukkan Asal Sekolah"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingPendaftar(null)}
                disabled={isSubmittingEdit}
              >
                Batal
              </Button>
              <Button
                size="sm"
                onClick={handleSaveEdit}
                disabled={isSubmittingEdit}
                className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmittingEdit ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL KONFIRMASI HAPUS PENDAFTAR
          ========================================================================= */}
      {deletingPendaftar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm print:hidden">
          <div className="bg-card w-full max-w-sm rounded-2xl border shadow-xl overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold">Hapus Data Pendaftar?</h2>
              <p className="text-xs text-muted-foreground">
                Apakah Anda yakin ingin menghapus data <strong className="text-foreground">{deletingPendaftar.namaLengkap}</strong> (NISN: {deletingPendaftar.nisn})? Action ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex justify-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingPendaftar(null)}
                disabled={isDeleting}
                className="w-full"
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Menghapus...
                  </>
                ) : (
                  "Ya, Hapus"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TEMPLATE SURAT BUKTI INDIVIDU (PRINT PROPER)
          ========================================================================= */}
      {selectedIndividu && (
        <>
          <style jsx global>{`
            @media print {
              body * {
                visibility: hidden !important;
              }

              #area-bukti-individu, #area-bukti-individu * {
                visibility: visible !important;
              }

              #area-bukti-individu {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 10mm !important;
                box-shadow: none !important;
                background-color: #ffffff !important;
                color: #000000 !important;
              }

              @page {
                size: A4 portrait;
                margin: 0;
              }
            }
          `}</style>

          <div className="hidden print:block">
            <div
              id="area-bukti-individu"
              className="w-[210mm] min-h-[297mm] p-[15mm] text-black font-serif text-[15px] leading-relaxed bg-white"
              style={{ fontFamily: "'Times New Roman', Times, serif" }}
            >
              {/* Kop Surat Header */}
              <div className="w-full mb-6 text-center">
                <img 
                  src="/images/kop-sekolah.png" 
                  alt="Kop Surat SMK Al Kaaffah" 
                  className="w-full h-auto object-contain block mx-auto" 
                />
              </div>

              {/* Judul Surat */}
              <div className="text-center mb-6">
                <p className="text-[17px] font-bold underline m-0 text-black">BUKTI PENDAFTARAN & HASIL TES SPMB</p>
                <p className="text-[14px] m-0 text-black">Tahun Ajaran {new Date().getFullYear()}/{new Date().getFullYear() + 1}</p>
              </div>

              <p className="text-justify mb-4 text-black">
                Berikut adalah bukti data pendaftaran beserta hasil tes Sistem Penerimaan Murid Baru (SPMB) SMK Al Kaaffah Kepanjen:
              </p>

              {/* Tabel Identitas Siswa & Hasil Tes */}
              <table className="w-[90%] mx-auto my-6 border-collapse text-[15px] text-black">
                <tbody>
                  <tr className="border-b border-gray-300">
                    <td className="py-2.5 w-[38%] font-bold">Waktu Pendaftaran</td>
                    <td className="py-2.5">: {formatTanggalIndo(selectedIndividu.createdAt)}</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="py-2.5 font-bold">Nama Lengkap</td>
                    <td className="py-2.5">: {selectedIndividu.namaLengkap}</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="py-2.5 font-bold">NISN</td>
                    <td className="py-2.5">: {selectedIndividu.nisn}</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="py-2.5 font-bold">Asal Sekolah</td>
                    <td className="py-2.5">: {selectedIndividu.asalSekolah}</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="py-2.5 font-bold">Pilihan Jurusan Utama</td>
                    <td className="py-2.5">: <strong>{selectedIndividu.pilihanJurusan}</strong></td>
                  </tr>
                  {/* EKSKUL & PROGRAM UNGGULAN PADA SURAT BUKTI */}
                  <tr className="border-b border-gray-300">
                    <td className="py-2.5 font-bold">Minat Program Unggulan</td>
                    <td className="py-2.5">: {selectedIndividu.programUnggulan || "Belum Memilih"}</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="py-2.5 font-bold">Minat Ekstrakurikuler</td>
                    <td className="py-2.5">: {selectedIndividu.ekstrakurikuler || "Belum Memilih"}</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="py-2.5 font-bold">No. WhatsApp</td>
                    <td className="py-2.5">: {selectedIndividu.whatsapp}</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="py-2.5 font-bold">Hasil Tes Buta Warna</td>
                    <td className="py-2.5">: {selectedIndividu.tes?.butaWarna ? `${selectedIndividu.tes.butaWarna.status} (Skor: ${selectedIndividu.tes.butaWarna.skor}/${selectedIndividu.tes.butaWarna.totalSoal})` : "Belum Mengikuti Tes"}</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="py-2.5 font-bold">Rekomendasi Jurusan Tes</td>
                    <td className="py-2.5">: <strong>{selectedIndividu.tes?.jurusan?.rekomendasi || "Belum Mengikuti Tes"}</strong></td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="py-2.5 font-bold">Status Pendaftaran</td>
                    <td className="py-2.5">: <strong>{selectedIndividu.statusPendaftaran || "Menunggu Verifikasi"}</strong></td>
                  </tr>
                </tbody>
              </table>

              <p className="text-justify my-4 text-black text-[13px] italic">
                *Simpan bukti pendaftaran ini sebagai bukti verifikasi ulang saat proses pendaftaran fisik di sekolah.
              </p>

              {/* Tanda Tangan */}
              <div className="mt-16 float-right text-center w-[250px] text-black">
                <p className="m-0">Kepanjen, {new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="m-0 mb-16">Panitia SPMB,</p>
                <p className="m-0 font-bold underline">{panitiaName || "Panitia PPDB"}</p>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}