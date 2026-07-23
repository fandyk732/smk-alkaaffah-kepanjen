"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Image, Plus, Trash2, LayoutGrid, LogOut, Loader2, ShieldAlert, Tag, ExternalLink } from "lucide-react";

interface GaleriItem {
  id: string;
  judul: string;
  kategori: "Fasilitas" | "Ekstrakurikuler" | "Event" | "Kegiatan" | "Prestasi";
  imageUrl: string;
  deskripsi?: string;
}

export default function AdminGaleriPage() {
  const router = useRouter();
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [adminName, setAdminName] = useState("");
  const [galeriList, setGaleriList] = useState<GaleriItem[]>([]);

  // Form States
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState<"Fasilitas" | "Ekstrakurikuler" | "Event" | "Kegiatan" | "Prestasi">("Fasilitas");
  const [imageUrl, setImageUrl] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🛡️ 1. Proteksi Halaman & Verifikasi Admin
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
          
          // Izinkan jika punya role superadmin atau admin_galeri / admin_artikel
          const hasAccess = roles.includes("superadmin") || roles.includes("admin_galeri") || roles.includes("admin_artikel");

          if (hasAccess) {
            setAdminName(data.nama || "Admin Galeri");
            setLoadingAuth(false);
            await ambilDataGaleri();
          } else {
            alert("Anda tidak memiliki akses ke modul Galeri!");
            router.push("/admin/dashboard");
          }
        } else {
          await auth.signOut();
          router.push("/login");
        }
      } catch (err) {
        console.error("Verifikasi error:", err);
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // 2. Ambil Data Galeri dari Firestore
  const ambilDataGaleri = async () => {
    setLoadingData(true);
    try {
      const q = query(collection(db, "galeri"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const list: GaleriItem[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as GaleriItem);
      });
      setGaleriList(list);
    } catch (error) {
      console.error("Gagal mengambil data galeri:", error);
    } finally {
      setLoadingData(false);
    }
  };

  // 3. Simpan Foto Baru ke Firestore
  const handleTambahGaleri = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul || !imageUrl) return alert("Judul dan URL Foto wajib diisi!");

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "galeri"), {
        judul,
        kategori,
        imageUrl,
        deskripsi: deskripsi || "",
        createdAt: new Date().toISOString()
      });

      // Reset Form
      setJudul("");
      setImageUrl("");
      setDeskripsi("");
      
      await ambilDataGaleri();
      alert("Foto berhasil ditambahkan ke Galeri!");
    } catch (error) {
      console.error("Gagal menambah foto:", error);
      alert("Terjadi kesalahan saat menyimpan foto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Hapus Foto
  const handleHapus = async (id: string, judulFoto: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus foto "${judulFoto}"?`)) {
      try {
        await deleteDoc(doc(db, "galeri", id));
        setGaleriList((prev) => prev.filter((item) => item.id !== id));
        alert("Foto berhasil dihapus.");
      } catch (error) {
        console.error("Gagal menghapus:", error);
      }
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">Memeriksa hak akses...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-secondary/20 pt-20 pb-12 text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* TOPBAR */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-card border p-4 sm:p-6 rounded-2xl shadow-sm gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <Image className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold">Kelola Galeri & Dokumentasi</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Petugas: <span className="font-semibold text-foreground">{adminName}</span> • Upload & Atur foto kegiatan sekolah
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.open("/galeri", "_blank")} 
              className="gap-1.5 rounded-xl border-slate-300"
            >
              <ExternalLink className="h-4 w-4" /> Lihat Halaman Publik
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push("/admin/dashboard")} 
              className="gap-1.5 rounded-xl border-slate-300"
            >
              <LayoutGrid className="h-4 w-4" /> Dashboard Hub
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={async () => { await signOut(auth); router.push("/login"); }} 
              className="gap-1.5 rounded-xl"
            >
              <LogOut className="h-4 w-4" /> Keluar
            </Button>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* PANEL FORM INPUT (KIRI) */}
          <div className="bg-card border p-6 rounded-2xl shadow-sm lg:col-span-1 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Plus className="h-4 w-4 text-primary" /> Tambah Foto Galeri Baru
            </h2>

            <form onSubmit={handleTambahGaleri} className="space-y-4">
              <div>
                <label className="text-xs font-semibold block mb-1">Judul / Nama Momen *</label>
                <input 
                  type="text" 
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Contoh: Praktik Industri Jurusan TKR" 
                  className="w-full bg-background border p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary transition" 
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Kategori *</label>
                <select 
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value as any)}
                  className="w-full bg-background border p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary transition"
                >
                  <option value="Fasilitas">🏛️ Fasilitas Sekolah</option>
                  <option value="Kegiatan">📸 Kegiatan Sekolah</option>
                  <option value="Ekstrakurikuler">⚽ Ekstrakurikuler</option>
                  <option value="Prestasi">🏆 Prestasi</option>
                  <option value="Event">🎉 Event & Peringatan Hari Besar</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">URL Gambar (Link Foto) *</label>
                <input 
                  type="url" 
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..." 
                  className="w-full bg-background border p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary transition" 
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Bisa pakai link Cloudinary, Imgur, Unsplash, atau CDN Storage.
                </p>
              </div>

              {/* Preview Gambar Sebelum Submit */}
              {imageUrl && (
                <div className="mt-2 rounded-xl overflow-hidden border aspect-video bg-slate-100 relative">
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1562774053-701939374585?w=500";
                    }}
                  />
                  <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur">
                    Preview Foto
                  </span>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold block mb-1">Deskripsi / Keterangan (Opsional)</label>
                <textarea 
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Penjelasan singkat mengenai foto ini..." 
                  className="w-full bg-background border p-2.5 rounded-xl text-sm h-20 resize-none focus:outline-none focus:border-primary transition" 
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full py-5 rounded-xl font-bold text-sm">
                {isSubmitting ? "Menyimpan Foto..." : "Simpan ke Galeri"}
              </Button>
            </form>
          </div>

          {/* GRID KOLEKSI FOTO (KANAN) */}
          <div className="bg-card border p-6 rounded-2xl shadow-sm lg:col-span-2 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Daftar Foto di Firestore ({galeriList.length})
            </h2>

            {loadingData ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : galeriList.length === 0 ? (
              <div className="text-center py-20 border border-dashed rounded-xl text-muted-foreground text-sm flex flex-col items-center justify-center">
                <ShieldAlert className="h-8 w-8 text-muted-foreground/50 mb-2" />
                Belum ada foto yang diinput ke Firestore.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {galeriList.map((item) => (
                  <div key={item.id} className="group relative border rounded-2xl overflow-hidden bg-background">
                    <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
                      <img 
                        src={item.imageUrl} 
                        alt={item.judul} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1562774053-701939374585?w=500";
                        }}
                      />
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1">
                        <Tag className="h-3 w-3" /> {item.kategori}
                      </div>
                    </div>

                    <div className="p-3 flex justify-between items-start gap-2">
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-sm line-clamp-1">{item.judul}</h4>
                        {item.deskripsi && <p className="text-xs text-muted-foreground line-clamp-1">{item.deskripsi}</p>}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleHapus(item.id, item.judul)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </main>
  );
}