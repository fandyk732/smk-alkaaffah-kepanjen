"use client";

import React from "react";
import { Berita } from "@/types/berita";
import { Eye, Edit2, Trash2, Pin } from "lucide-react";

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
  if (loadingFetch) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (beritaList.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        Belum ada berita yang diterbitkan.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full min-w-[650px] text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
            <th className="py-3 px-4 font-semibold w-20">Gambar</th>
            <th className="py-3 px-4 font-semibold">Info Artikel</th>
            <th className="py-3 px-4 font-semibold w-28">Kategori</th>
            <th className="py-3 px-4 font-semibold text-center w-36">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {beritaList.map((item) => (
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

             {/* 👁️ TAMPILKAN VIEW COUNTER DI SINI */}
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
  );
}