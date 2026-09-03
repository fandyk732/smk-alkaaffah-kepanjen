"use client";

import React, { useEffect } from "react";
import { Search, Link as LinkIcon, RefreshCw } from "lucide-react";

interface ArticleSEOProps {
  judul: string;

  slug: string;
  setSlug: React.Dispatch<React.SetStateAction<string>>;

  seoTitle: string;
  setSeoTitle: React.Dispatch<React.SetStateAction<string>>;

  metaDescription: string;
  setMetaDescription: React.Dispatch<React.SetStateAction<string>>;

  focusKeyword: string;
  setFocusKeyword: React.Dispatch<React.SetStateAction<string>>;

  excerpt: string;

  loading: boolean;
}

// ⚡ Helper Generator Slug Pendek (Maksimal 5 Kata Utama, Tanpa Stopwords)
function generateShortSlug(title: string, maxWords = 5): string {
  const stopWords = new Set([
    "yang", "di", "ke", "dari", "dan", "atau", "untuk", "bagi", "pada", 
    "dengan", "adalah", "ini", "itu", "akan", "juga", "serta", "hadirkan"
  ]);

  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 0 && !stopWords.has(word))
    .slice(0, maxWords)
    .join("-");
}

export function ArticleSEO({
  judul,
  slug,
  setSlug,
  seoTitle,
  setSeoTitle,
  metaDescription,
  setMetaDescription,
  focusKeyword,
  setFocusKeyword,
  excerpt,
  loading,
}: ArticleSEOProps) {
  const safeSlug = slug ?? "";
  const safeSeoTitle = seoTitle ?? "";
  const safeMetaDescription = metaDescription ?? "";
  const safeFocusKeyword = focusKeyword ?? "";
  const safeExcerpt = excerpt ?? "";

  // 🔄 Auto-generate slug ketika Judul diisi (Hanya jika slug masih kosong)
  useEffect(() => {
    if (judul && !slug) {
      setSlug(generateShortSlug(judul));
    }
  }, [judul, slug, setSlug]);

  const handleManualSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format otomatis: huruf kecil, ganti spasi dengan strip (-), buang karakter ilegal
    const formattedSlug = e.target.value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setSlug(formattedSlug);
  };

  const handleResetSlug = () => {
    if (judul) {
      setSlug(generateShortSlug(judul));
    }
  };

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
              Pengaturan SEO & Link
            </h3>

            <p className="text-[11px] text-slate-500 mt-0.5">
              Optimalkan URL dan meta informasi agar lebih mudah dipahami mesin pencari.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* 🔗 CUSTOM SLUG / PERMALINK (BARU) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-slate-700">
              URL Permalink (Slug)
            </label>

            <button
              type="button"
              onClick={handleResetSlug}
              disabled={loading || !judul}
              className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 disabled:opacity-50 transition"
              title="Generate ulang slug dari judul"
            >
              <RefreshCw className="h-3 w-3" /> Auto-generate
            </button>
          </div>

          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-slate-400">
              <LinkIcon className="h-4 w-4" />
            </div>
            <input
              type="text"
              disabled={loading}
              value={safeSlug}
              onChange={handleManualSlugChange}
              placeholder="contoh-slug-artikel-pendek"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-mono"
            />
          </div>

          <p className="text-[11px] text-slate-400 mt-1.5">
            Gunakan kata kunci ringkas yang dipisahkan dengan tanda strip (-).
          </p>
        </div>

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
            {/* Live Breadcrumb / Link Preview */}
            <div className="text-sm text-green-700 truncate mb-1 flex items-center gap-1 font-mono text-xs">
              <span>smkalkaaffah.sch.id</span>
              <span>›</span>
              <span>berita</span>
              <span>›</span>
              <span className="font-semibold text-emerald-800">
                {safeSlug || "slug-artikel"}
              </span>
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