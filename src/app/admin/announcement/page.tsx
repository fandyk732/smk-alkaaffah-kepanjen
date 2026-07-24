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
  ExternalLink,
  Power
} from "lucide-react";

export default function AnnouncementAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form State
  const [isActive, setIsActive] = useState(true);
  const [text, setText] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        // 1. Verifikasi Role Admin
        const userDoc = await getDoc(doc(db, "users", user.email || ""));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const rawRoles = Array.isArray(data.role) ? data.role : [data.role];
          const normalizedRoles = rawRoles.map((r: string) => String(r).toLowerCase().trim());

          const hasAccess = normalizedRoles.includes("superadmin") || normalizedRoles.includes("admin_announcement");

          if (!hasAccess) {
            alert("Anda tidak memiliki hak akses ke halaman ini.");
            router.push("/admin/dashboard");
            return;
          }
        } else {
          router.push("/login");
          return;
        }

        // 2. Fetch Data Announcement yang sedang aktif/tersimpan
        const annDoc = await getDoc(doc(db, "settings", "announcement"));
        if (annDoc.exists()) {
          const annData = annDoc.data();
          setIsActive(annData.isActive ?? true);
          setText(annData.text || "");
          setLink(annData.linkUrl || "");
        }
      } catch (err) {
        console.error("Error loading page data:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // 2. Pastikan fungsi Simpan mengikutsertakan `isActive`
const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();
  setSaving(true);

  try {
    const docRef = doc(db, "settings", "announcement");
    
    // 🎯 SIMPAN KE FIRESTORE (Pastikan nama property 'isActive' persis!)
    await setDoc(docRef, {
      text: text,
      link: link, // atau link
      isActive: Boolean(isActive), // 👈 Pakai Boolean() biar terjamin true/false (bukan string/undefined)
      updatedAt: new Date().toISOString()
    }, { merge: true });

    alert("Pengumuman berhasil diperbarui!");
  } catch (err) {
    console.error("Gagal simpan:", err);
    alert("Gagal menyimpan data.");
  } finally {
    setSaving(false);
  }
};

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
        
        {/* Header + Navigasi Dashboard Hub */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-3">
              <Megaphone className="h-8 w-8 text-amber-500" /> Pengumuman Running Bar
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Kelola pesan running text / banner informasi yang muncul di halaman depan web.
            </p>
          </div>

          {/* 🎯 TOMBOL SWITCH HUB */}
          <Link
            href="/admin/dashboard"
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition shrink-0 self-start md:self-auto shadow-sm"
          >
            <LayoutGrid className="h-4 w-4 text-blue-400" />
            Dashboard Hub
          </Link>
        </div>

        {/* Notifikasi Pesan */}
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

        {/* Form Setelan Pengumuman */}
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
  
          {/* 🎯 SWITCH TOGGLE MODERN (DARK THEME ELEGANT) */}
          <div className="flex items-center justify-between p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <label htmlFor="isActiveToggle" className="text-sm font-bold text-slate-100 cursor-pointer select-none">
                  Status Banner Pengumuman
                </label>
                {/* Status Badge Indicator */}
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 animate-pulse"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-400" : "bg-rose-400"}`} />
                  {isActive ? "Aktif" : "Nonaktif"}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isActive
                  ? "Banner pengumuman tayang di bagian paling atas website utama."
                  : "Banner disembunyikan total dari pengunjung website."}
              </p>
            </div>

            {/* Custom iOS/Flowbite Style Switch */}
            <label htmlFor="isActiveToggle" className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                id="isActiveToggle"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-checked:shadow-lg peer-checked:shadow-blue-500/30"></div>
            </label>
          </div>

          {/* INPUT TEKS PENGUMUMAN */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Teks Informasi <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Contoh: SPMB 2027/2028 Telah Dibuka! Bebas Uang Gedung & Free SPP 1 Semester"
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-3.5 rounded-xl text-sm text-white placeholder-slate-500 transition outline-none"
            />
          </div>

          {/* INPUT LINK TUJUAN */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Link Tujuan / Tombol "Selengkapnya" <span className="text-slate-500 font-normal">(Opsional)</span>
            </label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Contoh: /ppdb atau https://wa.me/62812345678"
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-3.5 rounded-xl text-sm text-white placeholder-slate-500 transition outline-none font-mono"
            />
          </div>

          {/* TOMBOL SIMPAN */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition duration-200 shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Simpan Perubahan Banner
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}