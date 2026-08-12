"use client";

import React from "react";
import Link from "next/link";
import { useBKKAdmin } from "@/hooks/useBKKAdmin";
import { ApplicantsModal } from "@/components/admin/bkk/ApplicantsModal";
import { CreateVacancyModal } from "@/components/admin/bkk/CreateVacancyModal";
import {
  Briefcase,
  Plus,
  Trash2,
  Users,
  Loader2,
  Building2,
  MapPin,
  Calendar,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

export default function AdminBkkPage() {
  const {
    vacancies,
    loading,
    submitting,
    isFormOpen,
    setIsFormOpen,
    title,
    setTitle,
    company,
    setCompany,
    location,
    setLocation,
    deadline,
    setDeadline,
    description,
    setDescription,
    selectedVacancyForApps,
    applications,
    loadingApps,
    isAppsModalOpen,
    setIsAppsModalOpen,
    handleLogout,
    handleOpenApplications,
    handleCreateVacancy,
    handleToggleStatus,
    handleDeleteVacancy,
  } = useBKKAdmin();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-950 text-white">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div>
            <h1 className="text-2xl font-extrabold flex items-center gap-2.5 text-white">
              <Briefcase className="h-7 w-7 text-indigo-400" /> Manajemen BKK (Bursa Kerja Khusus)
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Kelola lowongan kerja mitra industri dan tinjau berkas pelamar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition"
            >
              <Plus className="h-4 w-4" /> Tambah Lowongan
            </button>

            <Link
              href="/admin/dashboard"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
            >
              <LogOut className="h-4 w-4" /> Keluar
            </button>
          </div>
        </div>

        {/* DAFTAR LOWONGAN */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-200">Daftar Lowongan Kerja</h2>

          {vacancies.length === 0 ? (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-sm">
              Belum ada lowongan kerja tersimpan.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {vacancies.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-bold text-base text-white">{item.title}</h3>
                        <p className="text-xs text-indigo-400 font-medium flex items-center gap-1 mt-0.5">
                          <Building2 className="h-3.5 w-3.5" /> {item.company}
                        </p>
                      </div>

                      <button
                        onClick={() => handleToggleStatus(item.id, item.status)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition ${
                          item.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}
                      >
                        {item.status === "active" ? "Aktif" : "Tutup"}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-md">
                        <MapPin className="h-3 w-3" /> {item.location || "-"}
                      </span>
                      <span className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-md">
                        <Calendar className="h-3 w-3" /> Batas: {item.deadline || "-"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 pt-1">{item.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                    <button
                      onClick={() => handleOpenApplications(item)}
                      className="px-3.5 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
                    >
                      <Users className="h-4 w-4" /> Lihat Pelamar
                    </button>

                    <button
                      onClick={() => handleDeleteVacancy(item.id, item.title)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition"
                      title="Hapus Lowongan"
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

      {/* MODAL LIHAT PELAMAR */}
      <ApplicantsModal
        isOpen={isAppsModalOpen}
        vacancy={selectedVacancyForApps}
        applications={applications}
        loading={loadingApps}
        onClose={() => setIsAppsModalOpen(false)}
      />

      {/* MODAL TAMBAH LOWKER */}
      <CreateVacancyModal
        isOpen={isFormOpen}
        title={title}
        setTitle={setTitle}
        company={company}
        setCompany={setCompany}
        location={location}
        setLocation={setLocation}
        deadline={deadline}
        setDeadline={setDeadline}
        description={description}
        setDescription={setDescription}
        submitting={submitting}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateVacancy}
      />
    </div>
  );
}