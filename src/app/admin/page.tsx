"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase"; 
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { Edit2, Trash2, Plus, Save, X } from "lucide-react";

interface Berita {
  id: string;
  judul: string;
  slug: string;
  kategori: string;
  konten: string;
  gambar: string;
  tanggal: string;
}

export default function AdminPage() {
  // State Form
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("Berita");
  const [konten, setKonten] = useState("");
  const [gambarUrl, setGambarUrl] = useState("");
  
  // State App & Database
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(true);
  
  // State Mode Edit
  const [editId, setEditId] = useState<string | null>(null);

  // 1. Ambil List Berita dari Firestore
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
      console.error("Gagal mengambil data berita:", error);
    } finally {
      setLoadingFetch(false);
    }
  };

  useEffect(() => {
    ambilBerita();
  }, []);

  // Fungsi pembantu membuat slug
  const buatSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // 2. Handle Submit (Tambah Baru ATAU Update Data)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!gambarUrl.trim()) {
      alert("Harap masukkan URL gambar utama!");
      return;
    }

    setLoading(true);

    try {
      const slug = buatSlug(judul);

      if (editId) {
        // --- PROSES UPDATE (EDIT) ---
        const docRef = doc(db, "berita", editId);
        await updateDoc(docRef, {
          judul,
          slug,
          kategori,
          konten,
          gambar: gambarUrl,
          // Tanggal edit tidak diubah agar tanggal publish asli tetap terjaga, 
          // tapi bisa disesuaikan sesuai kebutuhan sekolah.
        });
        alert("Berita berhasil diperbarui!");
      } else {
        // --- PROSES TAMBAH BARU ---
        const opsiTanggal: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        const tanggalFormat = new Date().toLocaleDateString('id-ID', opsiTanggal);

        await addDoc(collection(db, "berita"), {
          judul,
          slug,
          kategori,
          konten,
          gambar: gambarUrl,
          tanggal: tanggalFormat,
          penulis: "Guru SMK Al Kaaffah",
          createdAt: serverTimestamp()
        });
        alert("Berita berhasil dipublikasikan!");
      }

      // Reset Form & Mode
      batalEdit();
      // Tarik ulang data terbaru dari Firestore
      ambilBerita();

    } catch (error) {
      console.error("Error menyimpan data:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Masuk ke Mode Edit (Naikkan data ke Form)
  const handleEditPersiapan = (item: Berita) => {
    setEditId(item.id);
    setJudul(item.judul);
    setKategori(item.kategori);
    setKonten(item.konten);
    setGambarUrl(item.gambar);
    // Scroll otomatis ke bagian form paling atas biar user tidak bingung
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4. Batalkan Mode Edit
  const batalEdit = () => {
    setEditId(null);
    setJudul("");
    setKategori("Berita");
    setKonten("");
    setGambarUrl("");
  };

  // 5. Fungsi Hapus Berita
  const handleHapus = async (id: string, judulBerita: string) => {
    const konfirmasi = window.confirm(`Apakah Anda yakin ingin menghapus berita:\n"${judulBerita}"?`);
    
    if (konfirmasi) {
      try {
        await deleteDoc(doc(db, "berita", id));
        alert("Berita berhasil dihapus!");
        // Refresh list
        ambilBerita();
      } catch (error) {
        console.error("Gagal menghapus berita:", error);
        alert("Gagal menghapus berita.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-28 pb-20 px-4 sm:px-6 lg:px-8 [color-scheme:light]">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* ================= FORM INPUT / EDIT ================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8 text-slate-900">
          <div className="border-b border-slate-100 pb-6 mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                {editId ? "Edit Artikel" : "Tulis Artikel Baru"}
              </h1>
              <p className="text-slate-500 mt-1">
                {editId ? "Ubah konten berita yang sudah diterbitkan." : "Tulis dan publikasikan berita sekolah terbaru."}
              </p>
            </div>
            {editId && (
              <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                Mode Edit Aktif
              </span>
            )}
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
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Isi Artikel / Berita
              </label>
              <textarea
                required
                disabled={loading}
                rows={8}
                placeholder="Tuliskan berita lengkap di sini..."
                value={konten}
                onChange={(e) => setKonten(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              />
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
                    ? "bg-amber-600 hover:bg-amber-700 shadow-amber-200" 
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
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
            <p className="text-slate-500 text-sm mt-1">Daftar artikel yang saat ini aktif di website.</p>
          </div>

          {loadingFetch ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : beritaList.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              Belum ada berita yang diterbitkan. Tulis berita pertama Anda di atas!
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
                      {/* Mini Thumbnail */}
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
                      
                      {/* Detail Judul & Tanggal */}
                      <td className="py-4 px-4 max-w-xs md:max-w-md">
                        <h4 className="font-semibold text-slate-800 line-clamp-2">{item.judul}</h4>
                        <span className="text-xs text-slate-400 block mt-1">{item.tanggal}</span>
                      </td>

                      {/* Kategori Badge */}
                      <td className="py-4 px-4">
                        <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
                          {item.kategori}
                        </span>
                      </td>

                      {/* Tombol Aksi */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleEditPersiapan(item)}
                            className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition"
                            title="Edit Artikel"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
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
          )}
        </div>

      </div>
    </div>
  );
}