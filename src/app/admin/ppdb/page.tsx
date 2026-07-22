"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, doc, updateDoc, getDoc } from "firebase/firestore";
import { Search, Filter, Loader2, RefreshCw, Printer, FileSpreadsheet, LogOut, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Pendaftar {
  id: string;
  namaLengkap: string;
  nisn: string;
  asalSekolah: string;
  whatsapp: string;
  pilihanJurusan: string;
  statusPendaftaran: "Menunggu Verifikasi" | "Diterima" | "Ditolak";
  createdAt: any;
}

export default function AdminPPDBPage() {
  const router = useRouter();
  const [listPendaftar, setListPendaftar] = useState<Pendaftar[]>([]);
  const [loading, setLoading] = useState(true);
  const [panitiaName, setPanitiaName] = useState("");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterJurusan, setFilterJurusan] = useState("");

  // --- AMBIL DATA PPDB FROM FIRESTORE ---
  const ambilDataPPDB = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "PPDB"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data: Pendaftar[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Pendaftar);
      });
      setListPendaftar(data);
    } catch (error) {
      console.error("Gagal mengambil data PPDB:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- 🛡️ PROTEKSI HALAMAN & AUTOMATIC FETCH ---
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

          // 🎯 1. Konversi role ke Array (Mendukung data lama & baru)
          const roles: string[] = Array.isArray(data.role) ? data.role : [data.role];

          // 🎯 2. Cek apakah punya akses panitia_PPDB atau superadmin
          const hasAccess = roles.includes("panitia_PPDB") || roles.includes("superadmin");

          if (hasAccess) {
            setPanitiaName(data.nama || "Panitia PPDB");
            // 🎯 3. Ambil data PPDB otomatis setelah auth terverifikasi!
            await ambilDataPPDB();
          } else {
            alert("Anda tidak memiliki akses ke modul PPDB!");
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

  // --- HANDLER NAVIGASI KEMBALI KE DASHBOARD (TANPA LOGOUT) ---
  const handleKembaliKeDashboard = () => {
    router.push("/admin/dashboard");
  };

  // --- HANDLER KELUAR SISTEM (LOGOUT TOTAL) ---
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  // --- UBAH STATUS PENDAFTARAN SISWA ---
  const ubahStatus = async (id: string, statusBaru: "Diterima" | "Ditolak") => {
    try {
      const docRef = doc(db, "PPDB", id);
      await updateDoc(docRef, { statusPendaftaran: statusBaru });
      
      setListPendaftar((prev) =>
        prev.map((item) => (item.id === id ? { ...item, statusPendaftaran: statusBaru } : item))
      );
    } catch (error) {
      alert("Gagal mengubah status pendaftaran.");
      console.error(error);
    }
  };

  // --- FUNGSI DOWNLOAD EXCEL (CSV) ---
  const downloadExcel = () => {
    if (pendaftarDifilter.length === 0) return alert("Tidak ada data untuk diexport");

    const headers = ["Nama Lengkap", "NISN", "Asal Sekolah", "WhatsApp", "Pilihan Jurusan", "Status Pendaftaran"];
    const rows = pendaftarDifilter.map(p => [
      `"${p.namaLengkap.replace(/"/g, '""')}"`,
      ` font-mono:"${p.nisn}"`,
      `"${p.asalSekolah.replace(/"/g, '""')}"`,
      `"${p.whatsapp}"`,
      `"${p.pilihanJurusan}"`,
      `"${p.statusPendaftaran}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Data_PPDB_Export_${new Date().toLocaleDateString("id-ID")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printSemua = () => {
    window.print();
  };

  const printIndividu = (pendaftar: Pendaftar) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Bukti Pendaftaran - ${pendaftar.namaLengkap}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 3px double #333; padding-bottom: 20px; mb: 30px; }
            .title { font-size: 24px; font-weight: bold; margin: 0; }
            .subtitle { font-size: 14px; margin: 5px 0 0 0; color: #666; }
            table { width: 100%; margin-top: 30px; border-collapse: collapse; }
            td { padding: 12px; font-size: 16px; border-bottom: 1px solid #ddd; }
            td.label { font-weight: bold; width: 30%; color: #555; }
            .footer { margin-top: 60px; text-align: right; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">SMK AL KAAFFAH KEPANJEN</div>
            <div class="subtitle">Bukti Pendaftaran Peserta Didik Baru (PPDB)</div>
          </div>
          <h3 style="text-align: center; margin-top: 20px;">BIODATA CALON SISWA</h3>
          <table>
            <tr><td class="label">Nama Lengkap</td><td>: ${pendaftar.namaLengkap}</td></tr>
            <tr><td class="label">NISN</td><td>: ${pendaftar.nisn}</td></tr>
            <tr><td class="label">Asal Sekolah</td><td>: ${pendaftar.asalSekolah}</td></tr>
            <tr><td class="label">Pilihan Jurusan</td><td>: ${pendaftar.pilihanJurusan}</td></tr>
            <tr><td class="label">No. WhatsApp</td><td>: ${pendaftar.whatsapp}</td></tr>
            <tr><td class="label">Status Saat Ini</td><td>: <strong>${pendaftar.statusPendaftaran}</strong></td></tr>
          </table>
          <div class="footer">
            <p>Kepanjen, ${new Date().toLocaleDateString("id-ID")}</p>
            <p>Panitia PPDB,</p>
            <br/><br/><br/>
            <p>_______________________</p>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // --- LOGIKA FILTER SEARCH & DROP DOWN JURUSAN ---
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
            <h1 className="text-3xl font-extrabold tracking-tight">Dashboard Panitia PPDB</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Petugas: <span className="font-semibold text-foreground">{panitiaName || "Panitia PPDB"}</span> • Total pendaftar: <span className="font-bold text-primary">{listPendaftar.length} siswa</span>
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
            
            {/* 🎯 TOMBOL NAVIGASI HUB DASHBOARD (Pindah Modul Tanpa Logout) */}
            <Button onClick={handleKembaliKeDashboard} variant="outline" size="sm" className="gap-1.5 rounded-xl border-slate-300">
              <LayoutGrid className="h-4 w-4" /> Dashboard Hub
            </Button>

            {/* 🎯 TOMBOL LOGOUT TOTAL */}
            <Button onClick={handleLogout} variant="destructive" size="sm" className="gap-1.5 rounded-xl">
              <LogOut className="h-4 w-4" /> Keluar
            </Button>
          </div>
        </div>

        {/* Laporan Print Area */}
        <div className="hidden print:block text-center border-b-2 pb-4 mb-6">
          <h1 className="text-2xl font-bold uppercase">Laporan Pendaftaran PPDB</h1>
          <p className="text-sm">SMK Al Kaaffah Kepanjen — Petugas Cetak: {panitiaName} — Tanggal: {new Date().toLocaleDateString("id-ID")}</p>
        </div>

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

        {/* Data Table */}
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
          <div className="overflow-x-auto rounded-2xl border bg-card shadow-sm print:border-none print:shadow-none">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 dark:bg-slate-900 text-xs uppercase font-semibold text-muted-foreground border-b print:bg-transparent print:text-black">
                <tr>
                  <th className="px-6 py-4">Nama Lengkap / NISN</th>
                  <th className="px-6 py-4">Asal Sekolah</th>
                  <th className="px-6 py-4">Pilihan Jurusan</th>
                  <th className="px-6 py-4">Kontak WA</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center print:hidden">Aksi & Berkas</th>
                </tr>
              </thead>
              <tbody className="divide-y print:divide-y-2">
                {pendaftarDifilter.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition print:hover:bg-transparent">
                    <td className="px-6 py-4">
                      <p className="font-bold">{p.namaLengkap}</p>
                      <p className="text-xs text-muted-foreground font-mono">NISN: {p.nisn}</p>
                    </td>
                    <td className="px-6 py-4 font-medium">{p.asalSekolah}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-800 dark:text-slate-100 border print:border-none print:bg-transparent print:p-0">
                        {p.pilihanJurusan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`https://wa.me/${p.whatsapp ? p.whatsapp.replace(/^0/, "62") : ""}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline font-medium print:text-black print:no-underline"
                      >
                        {p.whatsapp}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      {p.statusPendaftaran === "Diterima" && (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-950/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 print:text-black print:border-none">
                          Diterima
                        </span>
                      )}
                      {p.statusPendaftaran === "Ditolak" && (
                        <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-950/30 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900 print:text-black print:border-none">
                          Ditolak
                        </span>
                      )}
                      {(!p.statusPendaftaran || p.statusPendaftaran === "Menunggu Verifikasi") && (
                        <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-950/30 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-500 border border-amber-200 dark:border-amber-900 print:text-black print:border-none">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex flex-wrap items-center justify-center gap-1.5 print:hidden">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => ubahStatus(p.id, "Diterima")}
                        disabled={p.statusPendaftaran === "Diterima"}
                        className="text-emerald-600 hover:text-white hover:bg-emerald-600 border-emerald-200 dark:border-emerald-900 h-8 text-xs"
                      >
                        Terima
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => ubahStatus(p.id, "Ditolak")}
                        disabled={p.statusPendaftaran === "Ditolak"}
                        className="text-destructive hover:text-white hover:bg-destructive h-8 text-xs"
                      >
                        Tolak
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => printIndividu(p)}
                        className="h-8 text-xs"
                      >
                        <Printer className="h-3 w-3 mr-1" /> Bukti
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}