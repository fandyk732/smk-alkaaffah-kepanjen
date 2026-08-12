"use client";

import React, { useMemo } from "react";
import { usePPDBAdmin } from "@/hooks/usePPDBAdmin";
import { downloadExcel } from "@/utils/exportExcel";
import { Pendaftar } from "@/types/ppdb";

// Components
import { EditPendaftarModal } from "@/components/admin/ppdb/EditPendaftarModal";
import { DeleteConfirmModal } from "@/components/admin/ppdb/DeleteConfirmModal";
import { PrintBuktiIndividu } from "@/components/admin/ppdb/PrintBuktiIndividu";
import { PPDBMobileList } from "@/components/admin/ppdb/PPDBMobileList";
import { PPDBDesktopTable } from "@/components/admin/ppdb/PPDBDesktopTable";
import { SpmbStatsChart, PendaftarSpmb } from "@/components/admin/SpmbStatsChart";

// UI Components & Icons
import { Button } from "@/components/ui/button";
import { Search, Filter, Loader2, RefreshCw, Printer, FileSpreadsheet, LogOut, LayoutGrid } from "lucide-react";

export default function AdminPPDBPage() {
  const {
    listPendaftar,
    pendaftarDifilter,
    loading,
    panitiaName,
    searchQuery,
    setSearchQuery,
    filterJurusan,
    setFilterJurusan,
    selectedIndividu,
    setSelectedIndividu,
    editingPendaftar,
    setEditingPendaftar,
    deletingPendaftar,
    setDeletingPendaftar,
    isSubmittingEdit,
    isDeleting,
    ambilDataPPDB,
    handleKembaliKeDashboard,
    handleLogout,
    ubahStatus,
    handleSaveEdit,
    handleDelete,
  } = usePPDBAdmin();

  // 📊 MAPPER SUPER DEFENSIVE (Mencegah Typo Field Database)
  const dataChartSpmb = useMemo<PendaftarSpmb[]>(() => {
    return listPendaftar.map((p: any) => {
      // A. Ambil Nilai Status dari Semua Kemungkinan Field
      const rawStatus = String(
        p.statusSeleksi ?? p.status ?? p.statusPendaftaran ?? p.verifikasi ?? ""
      ).toLowerCase().trim();

      let statusFormatted: "diterima" | "proses" | "ditolak" = "proses";

      if (
        rawStatus.includes("terima") || 
        rawStatus.includes("lulus") || 
        rawStatus.includes("acc") ||
        rawStatus === "1" ||
        p.isLulus === true
      ) {
        statusFormatted = "diterima";
      } else if (
        rawStatus.includes("tolak") || 
        rawStatus.includes("batal") || 
        rawStatus.includes("gagal") ||
        rawStatus === "2"
      ) {
        statusFormatted = "ditolak";
      } else {
        statusFormatted = "proses";
      }

      // B. Ambil Nilai Jurusan dari Semua Kemungkinan Field
      const jurusan = 
        p.pilihanJurusan || 
        p.jurusan || 
        p.jurusanPilihan || 
        p.prodi || 
        "Belum Memilih";

      // C. Ambil Nilai Ekskul dari Semua Kemungkinan Field
      const ekskul = 
        p.ekstrakurikuler || 
        p.ekskul || 
        p.pilihanEkskul || 
        "";

      // Ambil Program Unggulan (dengan fallback property)
      const progUnggulan = 
        p.programUnggulan || 
        p.program || 
        p.pilihanProgram || 
        "";  

      return {
        id: p.id || Math.random().toString(),
        namaLengkap: p.namaLengkap || p.nama || "Siswa",
        jurusanPilihan: String(jurusan),
        statusSeleksi: statusFormatted,
        ekstrakurikuler: String(ekskul),
        programUnggulan: String(progUnggulan),
      };
    });
  }, [listPendaftar]);

      

  const printSemua = () => {
    setSelectedIndividu(null);
    setTimeout(() => window.print(), 100);
  };

  const printIndividu = (pendaftar: Pendaftar) => {
    setSelectedIndividu(pendaftar);
    setTimeout(() => window.print(), 150);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16 text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Dashboard */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5 mb-8 print:hidden">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Dashboard Panitia SPMB</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Petugas: <span className="font-semibold text-foreground">{panitiaName || "Panitia SPMB"}</span> • Total pendaftar: <span className="font-bold text-primary">{listPendaftar.length} siswa</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => downloadExcel(pendaftarDifilter)} variant="outline" size="sm" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400">
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

        {/* Laporan Print Header */}
        {!selectedIndividu && (
          <div className="hidden print:block text-center border-b-2 pb-4 mb-6">
            <h1 className="text-2xl font-bold uppercase text-black">Laporan Pendaftaran SPMB</h1>
            <p className="text-sm text-black">SMK Al Kaaffah Kepanjen — Petugas Cetak: {panitiaName} — Tanggal: {new Date().toLocaleDateString("id-ID")}</p>
          </div>
        )}

        {/* 📊 GRAFIS STATISTIK SPMB (Sembunyi saat dicetak) */}
        {!loading && listPendaftar.length > 0 && (
          <div className="mb-10 print:hidden">
            <SpmbStatsChart dataPendaftar={dataChartSpmb} />
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="grid gap-4 sm:grid-cols-3 mb-6 print:hidden">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari berdasarkan No. Reg, Nama, NISN, atau Asal Sekolah..."
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

        {/* Dynamic Views */}
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
            <PPDBMobileList
              data={pendaftarDifilter}
              onUbahStatus={ubahStatus}
              onOpenEdit={setEditingPendaftar}
              onOpenDelete={setDeletingPendaftar}
              onPrintIndividu={printIndividu}
            />
            <PPDBDesktopTable
              data={pendaftarDifilter}
              onUbahStatus={ubahStatus}
              onOpenEdit={setEditingPendaftar}
              onOpenDelete={setDeletingPendaftar}
              onPrintIndividu={printIndividu}
            />
          </>
        )}
      </div>

      {/* Modals & Printing Template */}
      <EditPendaftarModal
        pendaftar={editingPendaftar}
        onClose={() => setEditingPendaftar(null)}
        onSave={handleSaveEdit}
        isSubmitting={isSubmittingEdit}
      />

      <DeleteConfirmModal
        pendaftar={deletingPendaftar}
        onClose={() => setDeletingPendaftar(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />

      <PrintBuktiIndividu pendaftar={selectedIndividu} panitiaName={panitiaName} />
    </div>
  );
}