"use client";

import React from "react";
import { useAlumniAdmin } from "@/hooks/useAlumniAdmin";
import { AlumniStats } from "@/components/admin/alumni/AlumniStats";
import { AlumniForm } from "@/components/admin/alumni/AlumniForm";
import { AlumniTable } from "@/components/admin/alumni/AlumniTable";
import { Button } from "@/components/ui/button";
import {
  UserCheck,
  FileSpreadsheet,
  LayoutGrid,
  LogOut,
  Loader2,
} from "lucide-react";

export default function AdminAlumniPage() {
  const {
    loadingAuth,
    loadingData,
    adminName,
    formData,
    setFormData,
    isSubmitting,
    stats,
    filteredAlumni,
    searchQuery,
    setSearchQuery,
    filterJurusan,
    setFilterJurusan,
    filterStatus,
    setFilterStatus,
    handleTambahAlumni,
    handleHapusAlumni,
    handleKembaliKeDashboard,
    handleLogout,
    handleExport,
  } = useAlumniAdmin();

  if (loadingAuth) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">Memeriksa hak akses...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-secondary/20 pt-20 pb-12 text-foreground">
      <div className="container-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* TOPBAR HEAD */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-card border p-4 sm:p-6 rounded-2xl shadow-sm gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">Dashboard BKK & Alumni</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Petugas: <span className="font-semibold text-foreground">{adminName}</span> • Pengelolaan Direktori Tracer Study
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="gap-1.5 rounded-xl border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            >
              <FileSpreadsheet className="h-4 w-4" /> Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleKembaliKeDashboard}
              className="gap-1.5 rounded-xl border-slate-300"
            >
              <LayoutGrid className="h-4 w-4" /> Kembali ke Dashboard
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLogout} className="gap-1.5 rounded-xl">
              <LogOut className="h-4 w-4" /> Keluar
            </Button>
          </div>
        </div>

        {/* 📊 STATISTIK RINGKAS */}
        <AlumniStats stats={stats} />

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* PANEL FORM INPUT (KIRI) */}
          <AlumniForm
            formData={formData}
            setFormData={setFormData}
            isSubmitting={isSubmitting}
            onSubmit={handleTambahAlumni}
          />

          {/* TABEL MONITOR DATA (KANAN) */}
          <AlumniTable
            alumniList={filteredAlumni}
            loading={loadingData}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterJurusan={filterJurusan}
            setFilterJurusan={setFilterJurusan}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            onDelete={handleHapusAlumni}
          />

        </div>

      </div>
    </main>
  );
}