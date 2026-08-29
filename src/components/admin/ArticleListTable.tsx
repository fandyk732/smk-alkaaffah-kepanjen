"use client";

import React, { useState, useMemo } from "react";
import { Berita } from "@/types/berita";
import { Eye, Edit2, Trash2, Pin, Search, X, Download, Calendar, FileText, TrendingUp, Filter } from "lucide-react";
import { exportBeritaToCSV } from "@/lib/exportCsv";

interface ArticleListTableProps {
  beritaList: Berita[];
  loadingFetch: boolean;
  handleEditPersiapan: (item: Berita) => void;
  handleHapus: (id: string, judul: string) => void;
  handleTogglePinQuick: (item: Berita) => void;
}

export function ArticleListTable({
  beritaList,
  loadingFetch,
  handleEditPersiapan,
  handleHapus,
  handleTogglePinQuick,
}: ArticleListTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 🔍 Filter Berita Berdasarkan Search Query & Range Tanggal
  const filteredBerita = useMemo(() => {
    return beritaList.filter((item) => {
      // 1. Search Filter
      const query = searchQuery.toLowerCase();
      const matchSearch =
        item.judul.toLowerCase().includes(query) ||
        item.kategori?.toLowerCase().includes(query);

      // 2. Date Filter
      let matchDate = true;
      if (item.createdAt) {
        // Asumsi item.createdAt berformat Firestore Timestamp / Date string / ISO string
        const itemDate = new Date(
          typeof item.createdAt === "object" && "seconds" in item.createdAt
            ? item.createdAt.seconds * 1000
            : item.createdAt
        );

        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (itemDate < start) matchDate = false;
        }

        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (itemDate > end) matchDate = false;
        }
      }

      return matchSearch && matchDate;
    });
  }, [beritaList, searchQuery, startDate, endDate]);

  // 📊 Perhitungan Statistik Ringkasan Analytics
  const totalArticles = filteredBerita.length;
  const totalViews = useMemo(() => {
    return filteredBerita.reduce((acc, curr) => acc + (curr.views || 0), 0);
  }, [filteredBerita]);

  const resetFilter = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
  };

  if (loadingFetch) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      {/* 📈 ANALYTICS & STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Artikel Terbit</p>
            <h3 className="text-2xl font-bold text-slate-800">{totalArticles.toLocaleString("id-ID")}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pembaca (Views)</p>
            <h3 className="text-2xl font-bold text-slate-800">{totalViews.toLocaleString("id-ID")}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ekspor Laporan</p>
            <p className="text-xs text-slate-500 mt-0.5">Format .CSV untuk Kepala Sekolah</p>
          </div>
          <button
            type="button"
            onClick={() => exportBeritaToCSV(filteredBerita, `Laporan_Artikel_${startDate || "All"}_sd_${endDate || "All"}.csv`)}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition shadow-sm"
          >
            <Download className="h-4 w-4" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* 🔍 FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan judul atau kategori..."
              className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200 transition"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Date Filter Inputs */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Dari:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent outline-none cursor-pointer text-slate-700 font-medium"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Sampai:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent outline-none cursor-pointer text-slate-700 font-medium"
              />
            </div>

            {(searchQuery || startDate || endDate) && (
              <button
                onClick={resetFilter}
                className="flex items-center gap-1 text-xs text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg font-medium transition"
              >
                <Filter className="h-3 w-3" /> Reset
              </button>
            )}
          </div>
        </div>

        <div className="text-xs text-slate-500 border-t border-slate-100 pt-2 flex justify-between items-center">
          <span>
            Menampilkan <strong className="text-slate-700">{filteredBerita.length}</strong> dari <strong className="text-slate-700">{beritaList.length}</strong> total artikel
          </span>
        </div>
      </div>

      {/* 📋 TABEL ARTIKEL */}
      {filteredBerita.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <p className="text-slate-500 font-medium">
            Tidak ada artikel yang cocok dengan filter kamu.
          </p>
          <button
            onClick={resetFilter}
            className="mt-2 text-xs text-blue-600 hover:underline font-semibold"
          >
            Reset filter pencarian
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto w-full border border-slate-100 rounded-xl bg-white shadow-sm">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider bg-slate-50/50">
                <th className="py-3 px-4 font-semibold w-20">Gambar</th>
                <th className="py-3 px-4 font-semibold">Info Artikel</th>
                <th className="py-3 px-4 font-semibold w-28">Kategori</th>
                <th className="py-3 px-4 font-semibold text-center w-28">Views</th>
                <th className="py-3 px-4 font-semibold text-center w-36">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredBerita.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-4">
                    <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-100 bg-slate-100 shrink-0 relative">
                      <img
                        src={item.gambar}
                        alt={item.judul}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100";
                        }}
                      />
                      {item.isPinned && (
                        <span className="absolute top-1 left-1 bg-amber-500 text-white p-1 rounded-md shadow">
                          <Pin className="h-2.5 w-2.5 fill-white" />
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {item.isPinned && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                          <Pin className="h-2.5 w-2.5 fill-amber-800" /> PINNED
                        </span>
                      )}
                      <h4 className="font-semibold text-slate-800 line-clamp-2 leading-snug">
                        {item.judul}
                      </h4>
                    </div>
                    <span className="text-xs text-slate-400 block mt-1">{item.tanggal}</span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700 whitespace-nowrap">
                      {item.kategori}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                      <Eye className="h-3.5 w-3.5 text-blue-500" />
                      <span>{(item.views || 0).toLocaleString("id-ID")}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <div className="flex justify-center items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleTogglePinQuick(item)}
                        className={`p-2 rounded-lg transition ${
                          item.isPinned
                            ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                            : "hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                        }`}
                        title={item.isPinned ? "Lepas Pin" : "Sematkan Artikel"}
                      >
                        <Pin className={`h-4 w-4 ${item.isPinned ? "fill-amber-700" : ""}`} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEditPersiapan(item)}
                        className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition"
                        title="Edit Artikel"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleHapus(item.id, item.judul)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
                        title="Hapus Artikel"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}