"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Plus, Save, X, Pin, Video, Tag as TagIcon } from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-48 w-full bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-slate-400 text-sm">
      Memuat Editor Artikel...
    </div>
  ),
});

interface ArticleFormProps {
  editId: string | null;
  judul: string;
  setJudul: (val: string) => void;
  kategori: string;
  setKategori: (val: string) => void;
  // 🏷️ PROPS BARU UNTUK TAGS
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  konten: string;
  setKonten: (val: string) => void;
  gambarUrl: string;
  setGambarUrl: (val: string) => void;
  isPinned: boolean;
  setIsPinned: (val: boolean) => void;
  // 🎬 PROPS UNTUK EMBED MEDIA
  embedType: "none" | "youtube" | "instagram" | "tiktok";
  setEmbedType: (val: "none" | "youtube" | "instagram" | "tiktok") => void;
  embedUrl: string;
  setEmbedUrl: (val: string) => void;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  batalEdit: () => void;
}

const quillModules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link", "clean"],
  ],
};

export function ArticleForm({
  editId,
  judul,
  setJudul,
  kategori,
  setKategori,
  tags,
  setTags,
  konten,
  setKonten,
  gambarUrl,
  setGambarUrl,
  isPinned,
  setIsPinned,
  embedType,
  setEmbedType,
  embedUrl,
  setEmbedUrl,
  loading,
  handleSubmit,
  batalEdit,
}: ArticleFormProps) {
  // State lokal untuk input ketikan tag sementara
  const [inputTag, setInputTag] = useState("");

  // Handler Tambah Tag via Enter atau Koma
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = inputTag.trim().replace(/^#/, ""); // Hapus simbol # kalau ketikan user ada #
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setInputTag("");
      }
    }
  };

  // Handler Hapus Tag
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Judul Berita / Artikel
        </label>
        <input
          type="text"
          required
          disabled={loading}
          placeholder="Masukkan judul berita..."
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Kategori
          </label>
          <select
            disabled={loading}
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="Berita">Berita Sekolah</option>
            <option value="Pengumuman">Pengumuman</option>
            <option value="Prestasi">Prestasi Siswa</option>
            <option value="Event">Event / Acara</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Link URL Gambar Utama
          </label>
          <input
            type="url"
            required
            disabled={loading}
            placeholder="https://example.com/gambar.jpg"
            value={gambarUrl}
            onChange={(e) => setGambarUrl(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>

      {/* 🏷️ FITUR INPUT TAGS BARU */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
          <TagIcon className="h-4 w-4 text-blue-600" /> Tag Artikel
        </label>
        <div className="flex flex-wrap items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 transition min-h-[46px]">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md border border-blue-200"
            >
              #{tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-red-500 transition focus:outline-none ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          <input
            type="text"
            disabled={loading}
            value={inputTag}
            onChange={(e) => setInputTag(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder={
              tags.length === 0
                ? "Ketik tag lalu tekan Enter (misal: Prestasi, TKJ, LKS)"
                : "Tambah tag..."
            }
            className="flex-1 bg-transparent text-xs outline-none px-1 py-1 text-slate-800 placeholder:text-slate-400 min-w-[180px]"
          />
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Tekan <kbd className="px-1 py-0.5 bg-slate-100 border rounded text-[10px] font-mono">Enter</kbd> atau <kbd className="px-1 py-0.5 bg-slate-100 border rounded text-[10px] font-mono">,</kbd> (koma) untuk menambahkan tag.
        </p>
      </div>

      {/* 📌 FITUR PIN ARTIKEL */}
      <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-start gap-3">
        <input
          type="checkbox"
          id="isPinned"
          disabled={loading}
          checked={isPinned}
          onChange={(e) => setIsPinned(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
        />
        <label htmlFor="isPinned" className="text-xs text-amber-900 cursor-pointer select-none">
          <span className="font-bold flex items-center gap-1 text-amber-950">
            <Pin className="h-3.5 w-3.5 fill-amber-600 text-amber-600" /> Sematkan Berita Ini (Pin to Top)
          </span>
          <p className="text-amber-800/80 mt-0.5">
            Berita ini akan selalu tampil di urutan paling atas Homepage.
          </p>
        </label>
      </div>

      {/* 🎬 FITUR EMBED VIDEO & SOSMED */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Video className="h-4 w-4 text-blue-600" /> Sematkan Video / Post Sosmed (Opsional)
        </span>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <select
              value={embedType}
              onChange={(e) => setEmbedType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white text-slate-800"
            >
              <option value="none">Tanpa Embed Media</option>
              <option value="youtube">📹 YouTube Video</option>
              <option value="instagram">📸 Instagram Post / Reel</option>
              <option value="tiktok">🎵 TikTok Video</option>
            </select>
          </div>

          {embedType !== "none" && (
            <div className="md:col-span-2">
              <input
                type="url"
                placeholder={
                  embedType === "youtube"
                    ? "https://www.youtube.com/watch?v=..."
                    : embedType === "instagram"
                    ? "https://www.instagram.com/p/..."
                    : "https://www.tiktok.com/@user/video/..."
                }
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Isi Artikel / Berita
        </label>
        <div className="bg-white text-slate-900 rounded-lg border border-slate-200 overflow-hidden 
          [&_.ql-editor]:min-h-[220px] 
          [&_.ql-editor]:max-h-[500px]
          [&_.ql-editor]:overflow-y-auto">
          <ReactQuill
            theme="snow"
            value={konten}
            onChange={setKonten}
            modules={quillModules}
            placeholder="Tuliskan berita lengkap di sini..."
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
        {editId && (
          <button
            type="button"
            onClick={batalEdit}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition flex items-center gap-1"
          >
            <X className="h-4 w-4" /> Batal Edit
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2.5 rounded-lg text-white font-medium shadow-sm transition flex items-center gap-2 ${
            editId ? "bg-amber-600 hover:bg-amber-700" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
          ) : editId ? (
            <>
              <Save className="h-4 w-4" /> Simpan Perubahan
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> Terbitkan Berita
            </>
          )}
        </button>
      </div>
    </form>
  );
}