"use client";

import React from "react";
import { X, Loader2, ImagePlus } from "lucide-react";

interface Props {
  isOpen: boolean;
  title: string;
  setTitle: (v: string) => void;
  company: string;
  setCompany: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  deadline: string;
  setDeadline: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  // 🟢 Props Baru untuk Gambar/Poster
  posters: string;
  setPosters: (v: string) => void;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function CreateVacancyModal({
  isOpen,
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
  posters,
  setPosters,
  submitting,
  onClose,
  onSubmit,
}: Props) {
  if (!isOpen) return null;

  // Memecah input string poster (dipisah koma) jadi Array URL bersih
  const posterList = posters
    .split(",")
    .map((url) => url.trim())
    .filter((url) => url.length > 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-base">Tambah Lowongan Kerja Baru</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Judul Posisi Lowongan</label>
            <input
              type="text"
              required
              placeholder="mis: Junior Web Developer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Nama Perusahaan Mitra</label>
            <input
              type="text"
              required
              placeholder="mis: PT Telekomunikasi Indonesia"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-400 mb-1">Lokasi Penempatan</label>
              <input
                type="text"
                placeholder="mis: Malang / Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Batas Akhir (Deadline)</label>
              <input
                type="text"
                placeholder="mis: 30 Agustus 2026"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Deskripsi & Kualifikasi Pekerjaan</label>
            <textarea
              rows={3}
              required
              placeholder="Tuliskan syarat dan tugas pekerjaan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 resize-none transition"
            />
          </div>

          {/* 🖼️ INPUT URL GAMBAR / POSTER */}
          <div>
            <label className="flex items-center gap-1.5 text-slate-400 mb-1">
              <ImagePlus className="h-3.5 w-3.5 text-indigo-400" />
              URL Poster / Gambar Info Lowongan
            </label>
            <input
              type="text"
              placeholder="https://.../poster1.jpg, https://.../poster2.png"
              value={posters}
              onChange={(e) => setPosters(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 transition"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              *Bisa masukkan lebih dari 1 link gambar (pisahkan dengan tanda koma).
            </p>
          </div>

          {/* 🖼️ LIVE PREVIEW GAMBAR */}
          {posterList.length > 0 && (
            <div className="space-y-1 pt-1">
              <p className="text-[11px] font-medium text-slate-300">
                Preview Poster ({posterList.length}):
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {posterList.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-700 bg-slate-950"
                  >
                    <img
                      src={url}
                      alt={`Poster ${idx + 1}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/100x100/1e293b/94a3b8?text=Error+Link";
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition flex justify-center items-center gap-2 mt-2"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Terbitkan Lowongan"}
          </button>
        </form>
      </div>
    </div>
  );
}