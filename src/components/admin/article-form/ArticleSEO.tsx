"use client";

import React from "react";
import { Search } from "lucide-react";

interface ArticleSEOProps {
  judul: string;

  seoTitle: string;
  setSeoTitle: React.Dispatch<React.SetStateAction<string>>;

  metaDescription: string;
  setMetaDescription: React.Dispatch<React.SetStateAction<string>>;

  focusKeyword: string;
  setFocusKeyword: React.Dispatch<React.SetStateAction<string>>;

  excerpt: string;

  loading: boolean;
}

export function ArticleSEO({
  judul,
  seoTitle,
  setSeoTitle,
  metaDescription,
  setMetaDescription,
  focusKeyword,
  setFocusKeyword,
  excerpt,
  loading,
}: ArticleSEOProps) {
  const safeSeoTitle = seoTitle ?? "";
  const safeMetaDescription = metaDescription ?? "";
  const safeFocusKeyword = focusKeyword ?? "";
  const safeExcerpt = excerpt ?? "";

  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/40 overflow-hidden">
      {/* HEADER */}
      <div className="px-5 py-4 border-b border-blue-100 bg-blue-50/70">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
            <Search className="h-4 w-4" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Pengaturan SEO
            </h3>

            <p className="text-[11px] text-slate-500 mt-0.5">
              Optimalkan artikel agar lebih mudah dipahami mesin pencari.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* SEO TITLE */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-slate-700">
              SEO Title
            </label>

            <span className="text-[11px] text-slate-400">
              {safeSeoTitle.length}/70
            </span>
          </div>

          <input
            type="text"
            disabled={loading}
            value={safeSeoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            maxLength={70}
            placeholder={
              judul || "Judul yang akan digunakan mesin pencari"
            }
            className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <p className="text-[11px] text-slate-400 mt-1.5">
            Kosongkan jika ingin menggunakan judul artikel sebagai SEO Title.
          </p>
        </div>

        {/* META DESCRIPTION */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-slate-700">
              Meta Description
            </label>

            <span
              className={`text-[11px] ${
                safeMetaDescription.length > 160
                  ? "text-red-500"
                  : "text-slate-400"
              }`}
            >
              {safeMetaDescription.length}/160
            </span>
          </div>

          <textarea
            rows={3}
            disabled={loading}
            value={safeMetaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            maxLength={160}
            placeholder="Contoh: Siswa TKR SMK Al Kaaffah praktik servis shockbreaker dan komstir menggunakan sepeda motor sebagai media pembelajaran nyata."
            className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
          />

          <p className="text-[11px] text-slate-400 mt-1.5">
            Buat ringkasan singkat yang menarik dan menggambarkan isi artikel.
          </p>
        </div>

        {/* FOCUS KEYWORD */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Focus Keyword
          </label>

          <input
            type="text"
            disabled={loading}
            value={safeFocusKeyword}
            onChange={(e) => setFocusKeyword(e.target.value)}
            placeholder="Contoh: praktik TKR SMK Al Kaaffah"
            className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <p className="text-[11px] text-slate-400 mt-1.5">
            Kata atau frasa utama yang menjadi fokus artikel. Digunakan
            sebagai referensi internal SEO.
          </p>
        </div>

        {/* GOOGLE PREVIEW */}
        <div className="pt-4 border-t border-blue-100">
          <p className="text-xs font-semibold text-slate-600 mb-3">
            Preview di Mesin Pencari
          </p>

          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <div className="text-sm text-green-700 truncate mb-1">
              smkalkaaffah.sch.id › berita › artikel
            </div>

            <div className="text-lg font-medium text-blue-700 line-clamp-2 leading-snug">
              {safeSeoTitle.trim() ||
                judul ||
                "Judul artikel akan tampil di sini"}
            </div>

            <div className="text-sm text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
              {safeMetaDescription.trim() ||
                safeExcerpt.trim() ||
                "Deskripsi artikel akan tampil di sini ketika artikel dipublikasikan."}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-2">
            Preview ini hanya sebagai gambaran. Tampilan hasil pencarian
            Google dapat berbeda.
          </p>
        </div>
      </div>
    </div>
  );
}