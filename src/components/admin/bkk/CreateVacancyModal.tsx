"use client";

import React from "react";
import { X, Loader2 } from "lucide-react";

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
  submitting,
  onClose,
  onSubmit,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
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
              rows={4}
              required
              placeholder="Tuliskan syarat dan tugas pekerjaan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 resize-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition flex justify-center items-center gap-2"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Terbitkan Lowongan"}
          </button>
        </form>
      </div>
    </div>
  );
}