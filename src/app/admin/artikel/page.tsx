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
  getDoc
} from "firebase/firestore";
import { Edit2, Trash2, Plus, Save, X, Loader2, LogOut } from "lucide-react";

// 🎯 DYNAMIC IMPORT REACT QUILL VERSI BARU (Biar Anti SSR Error)
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css"; // Jika pake package 'react-quill-new'

const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false,
  loading: () => (
    <div className="h-48 w-full bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-slate-400 text-sm">
      Memuat Editor Artikel...
    </div>
  )
});

interface Berita {
  id: string;
  judul: string;
  slug: string;
  kategori: string;
  konten: string;
  gambar: string;
  tanggal: string;
}

export default function AdminArtikelPage() {
  const router = useRouter();
  
  // State Form
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("Berita");
  const [konten, setKonten] = useState("");
  const [gambarUrl, setGambarUrl] = useState("");

  // State App & Database
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingAuth, setLoadingAuth] = useState(true); 
  const [adminName, setAdminName] = useState(""); 
  
  // State Mode Edit
  const [editId, setEditId] = useState<string | null>(null);

  // 🎛️ CONFIG TOOLBAR QUILL
  const quillModules = {
    toolbar: [
      [{ header: [2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "clean"],
    ],
  };
  // --- 🛡️ PROTEKSI HALAMAN (SUPPORT ARRAY ROLE & STRING ROLE) ---
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
          
          // 🎯 Backward compatibility: Handle jika role masih String atau Array
          const roles: string[] = Array.isArray(data.role) ? data.role : [data.role];

          // 🎯 Cek Akses: Izinkan jika punya role 'admin_artikel' ATAU 'superadmin'
          const hasAccess = roles.includes("admin_artikel") || roles.includes("superadmin");

          if (hasAccess) {
            setAdminName(data.nama || "Admin Artikel");
            setLoadingAuth(false);
            ambilBerita(); 
          } else {
            alert("Anda tidak memiliki akses ke modul Artikel!");
            router.push("/admin/dashboard"); // Lempar balik ke dashboard portal jika tidak berhak
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

  // 1. Ambil List Berita
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

  // Helper membuat slug
  const buatSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // 2. Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!konten || konten === "<p><br></p>") {
      alert("Isi artikel tidak boleh kosong!");
      return;
    }
    
    if (!gambarUrl.trim()) {
      alert("Harap masukkan URL gambar utama!");
      return;
    }

    setLoading(true);

    try {
      const slug = buatSlug(judul);

      if (editId) {
        const docRef = doc(db, "berita", editId);
        await updateDoc(docRef, {
          judul,
          slug,
          kategori,
          konten,
          gambar: gambarUrl,
        });
        alert("Berita berhasil diperbarui!");
      } else {
        const opsiTanggal: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        const tanggalFormat = new Date().toLocaleDateString('id-ID', opsiTanggal);

        await addDoc(collection(db, "berita"), {
          judul,
          slug,
          kategori,
          konten,
          gambar: gambarUrl,
          tanggal: tanggalFormat,
          penulis: adminName || "Guru SMK Al Kaaffah",
          createdAt: serverTimestamp()
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

  const handleEditPersiapan = (item: Berita) => {
    setEditId(item.id);
    setJudul(item.judul);
    setKategori(item.kategori);
    setKonten(item.konten);
    setGambarUrl(item.gambar);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const batalEdit = () => {
    setEditId(null);
    setJudul("");
    setKategori("Berita");
    setKonten("");
    setGambarUrl("");
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

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
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
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* ================= FORM INPUT / EDIT ================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8 text-slate-900">
          <div className="border-b border-slate-100 pb-6 mb-8 flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                {editId ? "Edit Artikel" : "Tulis Artikel Baru"}
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Petugas: <span className="font-semibold text-slate-700">{adminName}</span>
              </p>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              {editId && (
                <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                  Mode Edit Aktif
                </span>
              )}
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <LogOut className="h-3.5 w-3.5" /> Keluar
              </button>
            </div>
          </div>

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

            {/* 🎯 IMPLEMENTASI REACT QUILL EDITOR */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Isi Artikel / Berita
              </label>
              <div className="bg-white text-slate-900 rounded-lg border border-slate-200 overflow-hidden [&_.ql-editor]:min-h-[220px]">
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
                  editId 
                    ? "bg-amber-600 hover:bg-amber-700" 
                    : "bg-blue-600 hover:bg-blue-700"
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
        </div>

        {/* ================= DAFTAR MANAJEMEN ARTIKEL ================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8 text-slate-900">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Manajemen Artikel ({beritaList.length})</h2>
          </div>

          {loadingFetch ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : beritaList.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              Belum ada berita yang diterbitkan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 font-semibold">Gambar</th>
                    <th className="py-3 px-4 font-semibold">Info Artikel</th>
                    <th className="py-3 px-4 font-semibold">Kategori</th>
                    <th className="py-3 px-4 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {beritaList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-4">
                        <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-100 bg-slate-100">
                          <img 
                            src={item.gambar} 
                            alt={item.judul} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100";
                            }}
                          />
                        </div>
                      </td>
                      
                      <td className="py-4 px-4 max-w-xs md:max-w-md">
                        <h4 className="font-semibold text-slate-800 line-clamp-2">{item.judul}</h4>
                        <span className="text-xs text-slate-400 block mt-1">{item.tanggal}</span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
                          {item.kategori}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleEditPersiapan(item)}
                            className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleHapus(item.id, item.judul)}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
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

      </div>
    </div>
  );
}