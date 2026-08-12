"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  getDoc,
  writeBatch,
} from "firebase/firestore";
import { Loader2, LogOut, LayoutGrid } from "lucide-react";
import { Berita } from "@/types/berita";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { ArticleListTable } from "@/components/admin/ArticleListTable";

export default function AdminArtikelPage() {
  const router = useRouter();

  // State Embed Media
  const [embedType, setEmbedType] = useState<"none" | "youtube" | "instagram" | "tiktok">("none");
  const [embedUrl, setEmbedUrl] = useState("");
  
  // State Form
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("Berita");
  const [konten, setKonten] = useState("");
  const [gambarUrl, setGambarUrl] = useState("");
  const [isPinned, setIsPinned] = useState(false);

  // 🏷️ STATE BARU: Tags (Array of Strings)
  const [tags, setTags] = useState<string[]>([]);

  // State App & Database
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [adminName, setAdminName] = useState("");

  // State Mode Edit
  const [editId, setEditId] = useState<string | null>(null);

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
          const roles: string[] = Array.isArray(data.role) ? data.role : [data.role];
          const hasAccess = roles.includes("admin_artikel") || roles.includes("superadmin");

          if (hasAccess) {
            setAdminName(data.nama || "Admin Artikel");
            setLoadingAuth(false);
            ambilBerita();
          } else {
            alert("Anda tidak memiliki akses ke modul Artikel!");
            router.push("/admin/dashboard");
          }
        } else {
          await auth.signOut();
          router.push("/login");
        }
      } catch (err) {
        console.error("Gagal verifikasi hak akses:", err);
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const ambilBerita = async () => {
    setLoadingFetch(true);
    try {
      const q = query(collection(db, "berita"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const list: Berita[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Berita);
      });
      setBeritaList(list);
    } catch (error) {
      console.error("Gagal mengambil berita:", error);
    } finally {
      setLoadingFetch(false);
    }
  };

  const unpinAllBerita = async () => {
    const batch = writeBatch(db);
    const pinnedDocs = beritaList.filter((b) => b.isPinned);
    pinnedDocs.forEach((b) => {
      batch.update(doc(db, "berita", b.id), { isPinned: false });
    });
    if (pinnedDocs.length > 0) {
      await batch.commit();
    }
  };

  const buatSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // 🏷️ HELPER BARU: Bersihkan Tag dari spasi berlebih & duplikat
  const sanitizeTags = (tagList: string[]) => {
    return Array.from(
      new Set(
        tagList
          .map((t) => t.trim().toLowerCase())
          .filter((t) => t.length > 0)
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanKonten = konten.replace(/<[^>]*>/g, "").trim();
    if (!cleanKonten) {
      alert("Isi artikel tidak boleh kosong!");
      return;
    }

    if (!gambarUrl.trim()) {
      alert("Harap masukkan URL gambar utama!");
      return;
    }

    setLoading(true);

    try {
      if (isPinned) {
        await unpinAllBerita();
      }

      const slug = buatSlug(judul);
      const cleanedTags = sanitizeTags(tags); // 🏷️ Sanitasi tag sebelum disimpan
    
      const mediaData = embedType !== "none" && embedUrl.trim()
        ? { type: embedType, url: embedUrl.trim() }
        : null;  
      
      if (editId) {
        const docRef = doc(db, "berita", editId);
        await updateDoc(docRef, {
          judul,
          slug,
          kategori,
          tags: cleanedTags, // 🏷️ Update Tag
          konten,
          gambar: gambarUrl,
          isPinned,
          mediaEmbed: mediaData,
          updatedAt: serverTimestamp(),
        });
        alert("Berita berhasil diperbarui!");
      } else {
        const opsiTanggal: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
        const tanggalFormat = new Date().toLocaleDateString("id-ID", opsiTanggal);

        await addDoc(collection(db, "berita"), {
          judul,
          slug,
          kategori,
          tags: cleanedTags, // 🏷️ Simpan Tag baru
          konten,
          gambar: gambarUrl,
          isPinned,
          mediaEmbed: mediaData,
          tanggal: tanggalFormat,
          penulis: adminName || "Guru SMK Al Kaaffah",
          createdAt: serverTimestamp(),
        });
        alert("Berita berhasil dipublikasikan!");
      }

      batalEdit();
      ambilBerita();
    } catch (error) {
      console.error("Error menyimpan data:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePinQuick = async (item: Berita) => {
    try {
      if (!item.isPinned) {
        await unpinAllBerita();
        await updateDoc(doc(db, "berita", item.id), { isPinned: true });
        alert(`Artikel "${item.judul}" berhasil disematkan!`);
      } else {
        await updateDoc(doc(db, "berita", item.id), { isPinned: false });
        alert(`Pin dilepaskan dari artikel "${item.judul}".`);
      }
      ambilBerita();
    } catch (error) {
      console.error("Gagal mengubah status pin:", error);
    }
  };

  const handleEditPersiapan = (item: Berita) => {
    setEditId(item.id);
    setJudul(item.judul);
    setKategori(item.kategori);
    setTags(item.tags || []); // 🏷️ Set tag ke state jika tersedia
    setKonten(item.konten);
    setGambarUrl(item.gambar);
    setIsPinned(item.isPinned || false);
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (item.mediaEmbed) {
      setEmbedType(item.mediaEmbed.type);
      setEmbedUrl(item.mediaEmbed.url);
    } else {
      setEmbedType("none");
      setEmbedUrl("");
    }
  };

  const batalEdit = () => {
    setEditId(null);
    setJudul("");
    setKategori("Berita");
    setTags([]); // 🏷️ Reset tag
    setKonten("");
    setGambarUrl("");
    setIsPinned(false);
    setEmbedType("none");
    setEmbedUrl("");
  };

  const handleHapus = async (id: string, judulBerita: string) => {
    if (window.confirm(`Hapus berita:\n"${judulBerita}"?`)) {
      try {
        await deleteDoc(doc(db, "berita", id));
        alert("Berita berhasil dihapus!");
        ambilBerita();
      } catch (error) {
        console.error("Gagal menghapus:", error);
      }
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-28 pb-20 px-4 sm:px-6 lg:px-8 [color-scheme:light]">
      <div className="max-w-4xl w-full mx-auto space-y-12 overflow-hidden">
        {/* FORM SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 sm:p-8 text-slate-900">
          <div className="border-b border-slate-100 pb-6 mb-8 flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                {editId ? "Edit Artikel" : "Tulis Artikel Baru"}
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Petugas: <span className="font-semibold text-slate-700">{adminName}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
              {editId && (
                <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full mr-1">
                  Mode Edit Aktif
                </span>
              )}

              <button
                type="button"
                onClick={() => router.push("/admin/dashboard")}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border border-slate-200"
              >
                <LayoutGrid className="h-3.5 w-3.5" /> Kembali ke Dashboard
              </button>

              <button
                type="button"
                onClick={async () => {
                  await signOut(auth);
                  router.push("/login");
                }}
                className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <LogOut className="h-3.5 w-3.5" /> Keluar
              </button>
            </div>
          </div>

          <ArticleForm
            editId={editId}
            judul={judul}
            setJudul={setJudul}
            kategori={kategori}
            setKategori={setKategori}
            tags={tags}           // 🏷️ Kirim props tags
            setTags={setTags}     // 🏷️ Kirim props setTags
            konten={konten}
            setKonten={setKonten}
            gambarUrl={gambarUrl}
            setGambarUrl={setGambarUrl}
            isPinned={isPinned}
            setIsPinned={setIsPinned}
            embedType={embedType}
            setEmbedType={setEmbedType}
            embedUrl={embedUrl}
            setEmbedUrl={setEmbedUrl}
            loading={loading}
            handleSubmit={handleSubmit}
            batalEdit={batalEdit}
          />
        </div>

        {/* TABEL SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 sm:p-8 text-slate-900">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              Manajemen Artikel ({beritaList.length})
            </h2>
          </div>

          <ArticleListTable
            beritaList={beritaList}
            loadingFetch={loadingFetch}
            handleEditPersiapan={handleEditPersiapan}
            handleHapus={handleHapus}
            handleTogglePinQuick={handleTogglePinQuick}
          />
        </div>
      </div>
    </div>
  );
}