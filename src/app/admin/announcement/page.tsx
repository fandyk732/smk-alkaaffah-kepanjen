"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Link from "next/link";
import {
  Megaphone,
  LayoutGrid,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Youtube, // 🟢 Icon YouTube
} from "lucide-react";
import { getYouTubeEmbedUrl } from "@/lib/youtube"; // 🟢 Import parser

export default function AnnouncementAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form State - Running Text
  const [isActive, setIsActive] = useState(true);
  const [text, setText] = useState("");
  const [link, setLink] = useState("");

  // Form State - Pop-up Modal
  const [isPopupActive, setIsPopupActive] = useState(false);
  const [popupImage, setPopupImage] = useState("");
  const [popupTargetUrl, setPopupTargetUrl] = useState("");

  // 🟢 Form State - Embed Video Homepage
  const [isVideoActive, setIsVideoActive] = useState(true);
  const [videoTitle, setVideoTitle] = useState("Profil & Kegiatan Sekolah");
  const [videoSubtitle, setVideoSubtitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("https://youtu.be/d867JKNs2xQ?si=_tX4o4WqrDNjfqo2");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.email || ""));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const rawRoles = Array.isArray(data.role) ? data.role : [data.role];
          const normalizedRoles = rawRoles.map((r: string) => String(r).toLowerCase().trim());

          const hasAccess =
            normalizedRoles.includes("superadmin") || normalizedRoles.includes("admin_announcement");

          if (!hasAccess) {
            alert("Anda tidak memiliki hak akses ke halaman ini.");
            router.push("/admin/dashboard");
            return;
          }
        } else {
          router.push("/login");
          return;
        }

        // Fetch Data Pengumuman, Pop-up & Video
        const annDoc = await getDoc(doc(db, "settings", "announcement"));
        if (annDoc.exists()) {
          const annData = annDoc.data();
          // Running Text
          setIsActive(annData.isActive ?? true);
          setText(annData.text || "");
          setLink(annData.linkUrl || "");

          // Pop-up Poster
          setIsPopupActive(annData.isPopupActive ?? false);
          setPopupImage(annData.popupImage || "");
          setPopupTargetUrl(annData.popupTargetUrl || "");

          // 🟢 Video Embed
          setIsVideoActive(annData.isVideoActive ?? true);
          setVideoTitle(annData.videoTitle || "Profil & Kegiatan Sekolah");
          setVideoSubtitle(annData.videoSubtitle || "");
          setVideoUrl(annData.videoUrl || "https://youtu.be/d867JKNs2xQ?si=_tX4o4WqrDNjfqo2");
        }
      } catch (err) {
        console.error("Error loading page data:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    // Validasi link YouTube jika fitur video diaktifkan
    if (isVideoActive && videoUrl.trim() && !getYouTubeEmbedUrl(videoUrl)) {
      setMessage({
        type: "error",
        text: "Link YouTube tidak valid! Pastikan format URL YouTube benar.",
      });
      setSaving(false);
      return;
    }

    try {
      const docRef = doc(db, "settings", "announcement");

      await setDoc(docRef, {
        text: text.trim(),
        linkUrl: link.trim(),
        isActive: Boolean(isActive),
        isPopupActive: Boolean(isPopupActive),
        popupImage: popupImage.trim(),
        popupTargetUrl: popupTargetUrl.trim(),
        // 🟢 Field Video
        isVideoActive: Boolean(isVideoActive),
        videoTitle: videoTitle.trim(),
        videoSubtitle: videoSubtitle.trim(),
        videoUrl: videoUrl.trim(),
        updatedAt: new Date().toISOString(),
      });

      setMessage({ type: "success", text: "Semua pengaturan pengumuman, pop-up & video berhasil diperbarui!" });
    } catch (err) {
      console.error("Gagal simpan:", err);
      setMessage({ type: "error", text: "Gagal menyimpan data ke database." });
    } finally {
      setSaving(false);
    }
  };

  const previewEmbedUrl = getYouTubeEmbedUrl(videoUrl);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-950 text-white">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header + Navigasi */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-3">
              <Megaphone className="h-8 w-8 text-amber-500" /> Pengumuman, Pop-up & Video
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Kelola running text, pop-up poster promo, dan video unggulan di halaman utama.
            </p>
          </div>

          <Link
            href="/admin/dashboard"
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition shrink-0 self-start md:self-auto shadow-sm"
          >
            <LayoutGrid className="h-4 w-4 text-blue-400" />
            Kembali ke Dashboard
          </Link>
        </div>

        {/* Notifikasi Pesan Status */}
        {message && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
              message.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0" />
            )}
            <p>{message.text}</p>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* SECTION 1: RUNNING TEXT BAR */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
            <h2 className="text-lg font-bold text-amber-400 border-b border-slate-800 pb-3 flex items-center gap-2">
              <Megaphone className="h-5 w-5" /> 1. Banner Running Bar (Atas Website)
            </h2>

            <div className="flex items-center justify-between p-5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <label htmlFor="isActiveToggle" className="text-sm font-bold text-slate-100 cursor-pointer select-none">
                    Status Running Bar
                  </label>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider flex items-center gap-1.5 ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-400" : "bg-rose-400"}`} />
                    {isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {isActive ? "Tayang di bagian paling atas website utama." : "Disembunyikan dari pengunjung."}
                </p>
              </div>

              <label htmlFor="isActiveToggle" className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  id="isActiveToggle"
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Teks Informasi <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required={isActive}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Contoh: SPMB 2027/2028 Telah Dibuka! Bebas Uang Gedung & Free SPP"
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-3.5 rounded-xl text-sm text-white placeholder-slate-500 transition outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Link Tujuan / Tombol "Selengkapnya" <span className="text-slate-500 font-normal">(Opsional)</span>
              </label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="/ppdb atau https://wa.me/62812345678"
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-3.5 rounded-xl text-sm text-white placeholder-slate-500 transition outline-none font-mono"
              />
            </div>
          </div>

          {/* SECTION 2: POP-UP POSTER MODAL */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
            <h2 className="text-lg font-bold text-blue-400 border-b border-slate-800 pb-3 flex items-center gap-2">
              <ImageIcon className="h-5 w-5" /> 2. Pop-up Poster Melayang (Homepage)
            </h2>

            <div className="flex items-center justify-between p-5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <label htmlFor="isPopupActiveToggle" className="text-sm font-bold text-slate-100 cursor-pointer select-none">
                    Status Pop-up Poster
                  </label>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider flex items-center gap-1.5 ${
                      isPopupActive
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isPopupActive ? "bg-emerald-400" : "bg-rose-400"}`} />
                    {isPopupActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {isPopupActive ? "Pop-up poster akan muncul melayang saat homepage dibuka." : "Pop-up dinonaktifkan."}
                </p>
              </div>

              <label htmlFor="isPopupActiveToggle" className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  id="isPopupActiveToggle"
                  type="checkbox"
                  checked={isPopupActive}
                  onChange={(e) => setIsPopupActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {isPopupActive && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    URL Gambar Poster (ImageKit / Cloudinary) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="url"
                    required={isPopupActive}
                    value={popupImage}
                    onChange={(e) => setPopupImage(e.target.value)}
                    placeholder="https://ik.imagekit.io/alkaaffah/poster-kegiatan.jpg"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-3.5 rounded-xl text-sm text-white placeholder-slate-500 transition outline-none font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Link Tujuan Saat Poster Diklik <span className="text-slate-500 font-normal">(Opsional)</span>
                  </label>
                  <input
                    type="text"
                    value={popupTargetUrl}
                    onChange={(e) => setPopupTargetUrl(e.target.value)}
                    placeholder="Contoh: /ppdb atau /berita/juara-lomba"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-3.5 rounded-xl text-sm text-white placeholder-slate-500 transition outline-none font-mono"
                  />
                </div>

                {popupImage && (
                  <div className="p-4 border border-slate-800 rounded-xl bg-slate-950 text-center">
                    <p className="text-xs text-slate-400 mb-2 font-medium">Preview Poster:</p>
                    <img src={popupImage} alt="Preview Poster" className="max-h-52 mx-auto rounded-lg object-contain" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 🟢 SECTION 3: EMBED VIDEO YOUTUBE HOMEPAGE */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
            <h2 className="text-lg font-bold text-rose-400 border-b border-slate-800 pb-3 flex items-center gap-2">
              <Youtube className="h-5 w-5" /> 3. Embed Video YouTube (Homepage)
            </h2>

            {/* TOGGLE VIDEO */}
            <div className="flex items-center justify-between p-5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <label htmlFor="isVideoActiveToggle" className="text-sm font-bold text-slate-100 cursor-pointer select-none">
                    Status Section Video
                  </label>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider flex items-center gap-1.5 ${
                      isVideoActive
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isVideoActive ? "bg-emerald-400" : "bg-rose-400"}`} />
                    {isVideoActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {isVideoActive ? "Video YouTube ditampilkan di halaman utama." : "Section video disembunyikan."}
                </p>
              </div>

              <label htmlFor="isVideoActiveToggle" className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  id="isVideoActiveToggle"
                  type="checkbox"
                  checked={isVideoActive}
                  onChange={(e) => setIsVideoActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {isVideoActive && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Link Video YouTube <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="url"
                    required={isVideoActive}
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtu.be/d867JKNs2xQ atau https://www.youtube.com/watch?v=..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-3.5 rounded-xl text-sm text-white placeholder-slate-500 transition outline-none font-mono"
                  />
                  <p className="text-[11px] text-slate-500">
                    Bisa langsung copy-paste link dari browser atau tombol Share di aplikasi YouTube.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Judul Section Video <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required={isVideoActive}
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      placeholder="Contoh: Profil SMK Al-Kaaffah"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-3.5 rounded-xl text-sm text-white placeholder-slate-500 transition outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Subjudul / Deskripsi Singkat <span className="text-slate-500 font-normal">(Opsional)</span>
                    </label>
                    <input
                      type="text"
                      value={videoSubtitle}
                      onChange={(e) => setVideoSubtitle(e.target.value)}
                      placeholder="Contoh: Mengenal lebih dekat fasilitas & budaya belajar"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-3.5 rounded-xl text-sm text-white placeholder-slate-500 transition outline-none"
                    />
                  </div>
                </div>

                {/* Live Preview Embed */}
                {previewEmbedUrl ? (
                  <div className="p-4 border border-slate-800 rounded-xl bg-slate-950 space-y-2">
                    <p className="text-xs text-slate-400 font-medium">Live Preview Video:</p>
                    <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-800">
                      <iframe
                        src={previewEmbedUrl}
                        title="Preview YouTube Video"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ) : (
                  videoUrl.trim() !== "" && (
                    <p className="text-xs text-rose-400">
                      ⚠️ Link YouTube tidak dikenali. Cek kembali URL yang kamu masukkan.
                    </p>
                  )
                )}
              </div>
            )}
          </div>

          {/* TOMBOL SIMPAN GLOBAL */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition duration-200 shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Menyimpan Perubahan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Simpan Semua Pengaturan
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}