"use client";

import React, { useState } from "react";
import { Berita } from "@/types/berita";
import { Eye, Edit2, Trash2, Pin, Search, X } from "lucide-react";

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

  // 🔍 Filter berita berdasarkan Judul atau Kategori
  const filteredBerita = beritaList.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchJudul = item.judul.toLowerCase().includes(query);
    const matchKategori = item.kategori?.toLowerCase().includes(query);
    return matchJudul || matchKategori;
  });

  if (loadingFetch) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* 🔍 Search Bar & Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-1 rounded-xl">
        <div className="relative flex-1 max-w-md">
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

        <div className="text-xs text-slate-500 px-1">
          Menampilkan <span className="font-semibold text-slate-700">{filteredBerita.length}</span> dari{" "}
          <span className="font-semibold text-slate-700">{beritaList.length}</span> artikel
        </div>
      </div>

      {/* 📋 Tabel / Empty State */}
      {filteredBerita.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <p className="text-slate-500 font-medium">
            {searchQuery ? (
              <>Tidak ada artikel yang cocok dengan kata kunci &quot;<span className="text-slate-800 font-semibold">{searchQuery}</span>&quot;</>
            ) : (
              "Belum ada berita yang diterbitkan."
            )}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="mt-2 text-xs text-blue-600 hover:underline font-semibold"
            >
              Reset pencarian
            </button>
          )}
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