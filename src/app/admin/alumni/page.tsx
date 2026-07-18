"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Briefcase, GraduationCap, Rocket, LogOut, Plus, Trash2, UserCheck, ShieldAlert } from "lucide-react";

interface Alumni {
  id: string;
  nama: string;
  angkatan: string;
  jurusan: string;
  status: "Bekerja" | "Kuliah" | "Wirausaha";
  tempat: string;
  posisi?: string;
  testimoni?: string;
}

export default function AdminAlumniPage() {
  const router = useRouter();
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [alumniList, setAlumniList] = useState<Alumni[]>([]);

  // Form States
  const [nama, setNama] = useState("");
  const [angkatan, setAngkatan] = useState("");
  const [jurusan, setJurusan] = useState("Teknik Komputer & Jaringan");
  const [status, setStatus] = useState<"Bekerja" | "Kuliah" | "Wirausaha">("Bekerja");
  const [tempat, setTempat] = useState("");
  const [posisi, setPosisi] = useState("");
  const [testimoni, setTestimoni] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Proteksi Halaman & Cek Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setLoadingAuth(false);
        ambilDataAlumni();
      }
    });
    return () => unsubscribe();
  }, [router]);

  // 2. Ambil Data dari Firestore
  const ambilDataAlumni = async () => {
    setLoadingData(true);
    try {
      const q = query(collection(db, "alumni"), orderBy("angkatan", "desc"));
      const querySnapshot = await getDocs(q);
      const list: Alumni[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Alumni);
      });
      setAlumniList(list);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  // 3. Handler Tambah Data Alumni
  const handleTambahAlumni = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !angkatan || !tempat) return alert("Mohon isi field utama (Nama, Angkatan, Tempat)!");
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "alumni"), {
        nama,
        angkatan,
        jurusan,
        status,
        tempat,
        posisi: posisi || "",
        testimoni: testimoni || "",
        createdAt: new Date().toISOString()
      });

      // Reset Form
      setNama("");
      setAngkatan("");
      setTempat("");
      setPosisi("");
      setTestimoni("");
      
      // Refresh list data
      await ambilDataAlumni();
      alert("Data alumni berhasil disimpan!");
    } catch (error) {
      console.error("Gagal menambah data:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Handler Hapus Data Alumni
  const handleHapusAlumni = async (id: string, namaAlumni: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data alumni "${namaAlumni}"?`)) {
      try {
        await deleteDoc(doc(db, "alumni", id));
        setAlumniList((prev) => prev.filter((item) => item.id !== id));
        alert("Data berhasil dihapus.");
      } catch (error) {
        console.error("Gagal menghapus:", error);
      }
    }
  };

  // 5. Handler Logout
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-secondary/20 pt-6 pb-12">
      <div className="container-page max-w-7xl">
        
        {/* TOPBAR HEAD */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-card border p-4 rounded-2xl shadow-soft mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none">Dashboard BKK</h1>
              <p className="text-xs text-muted-foreground mt-1">Pengelolaan Direktori & Tracer Study Alumni</p>
            </div>
          </div>
          <Button variant="destructive" size="sm" onClick={handleLogout} className="gap-2 rounded-xl">
            <LogOut className="h-4 w-4" /> Keluar
          </Button>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* PANEL FORM INPUT (KIRI) */}
          <div className="bg-card border p-6 rounded-2xl shadow-soft lg:col-span-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
              <Plus className="h-4 w-4 text-primary" /> Input Data Baru
            </h2>
            <form onSubmit={handleTambahAlumni} className="space-y-4">
              <div>
                <label className="text-xs font-semibold block mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Ahmad Dani" 
                  className="w-full bg-background border p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold block mb-1">Angkatan (Tahun)</label>
                  <input 
                    type="number" 
                    value={angkatan}
                    onChange={(e) => setAngkatan(e.target.value)}
                    placeholder="2024" 
                    className="w-full bg-background border p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary" 
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Jurusan</label>
                  <select 
                    value={jurusan}
                    onChange={(e) => setJurusan(e.target.value)}
                    className="w-full bg-background border p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="Teknik Komputer & Jaringan">TKJ</option>
                    <option value="Rekayasa Perangkat Lunak">TE</option>
                    <option value="Multimedia">TKR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Status Lulusan</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-background border p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary"
                >
                  <option value="Bekerja">💼 Bekerja</option>
                  <option value="Kuliah">🎓 Kuliah / Lanjut Studi</option>
                  <option value="Wirausaha">🚀 Wirausaha / Bisnis</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Nama Instansi / Univ / Usaha</label>
                <input 
                  type="text" 
                  value={tempat}
                  onChange={(e) => setTempat(e.target.value)}
                  placeholder="Contoh: PT. Telkom / Universitas Brawijaya" 
                  className="w-full bg-background border p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary" 
                />
              </div>

              {status === "Bekerja" && (
                <div>
                  <label className="text-xs font-semibold block mb-1">Jabatan / Posisi Kerja</label>
                  <input 
                    type="text" 
                    value={posisi}
                    onChange={(e) => setPosisi(e.target.value)}
                    placeholder="Contoh: Network Engineer" 
                    className="w-full bg-background border p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary" 
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold block mb-1">Testimoni Singkat (Opsional)</label>
                <textarea 
                  value={testimoni}
                  onChange={(e) => setTestimoni(e.target.value)}
                  placeholder="Kesan pesan untuk memotivasi adik kelas..." 
                  className="w-full bg-background border p-2.5 rounded-xl text-sm h-20 resize-none focus:outline-none focus:border-primary" 
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-primary text-white py-5 rounded-xl font-bold text-sm mt-2">
                {isSubmitting ? "Menyimpan..." : "Simpan Data Alumni"}
              </Button>
            </form>
          </div>

          {/* TABEL MONITOR DATA (KANAN) */}
          <div className="bg-card border p-6 rounded-2xl shadow-soft lg:col-span-2 min-h-[400px]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Database Direktori Aktif ({alumniList.length})
            </h2>

            {loadingData ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : alumniList.length === 0 ? (
              <div className="text-center py-20 border border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground text-sm">
                <ShieldAlert className="h-8 w-8 text-muted-foreground/50 mb-2" />
                Belum ada data alumni yang diinput.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b text-muted-foreground font-semibold text-xs bg-secondary/30">
                      <th className="p-3">Nama & Angkatan</th>
                      <th className="p-3">Jurusan</th>
                      <th className="p-3">Status / Tempat</th>
                      <th className="p-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alumniList.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-secondary/10 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-foreground">{item.nama}</div>
                          <div className="text-[11px] text-muted-foreground">Angkatan {item.angkatan}</div>
                        </td>
                        <td className="p-3 font-medium text-xs text-muted-foreground">{item.jurusan}</td>
                        <td className="p-3">
                          <div className="inline-flex items-center gap-1 bg-secondary px-2 py-0.5 rounded-md text-xs font-semibold text-foreground mb-0.5">
                            {item.status === "Bekerja" && <Briefcase className="h-3 w-3 text-blue-500" />}
                            {item.status === "Kuliah" && <GraduationCap className="h-3 w-3 text-emerald-500" />}
                            {item.status === "Wirausaha" && <Rocket className="h-3 w-3 text-amber-500" />}
                            {item.status}
                          </div>
                          <div className="text-xs font-medium text-muted-foreground max-w-[180px] truncate">{item.tempat}</div>
                        </td>
                        <td className="p-3 text-center">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleHapusAlumni(item.id, item.nama)}
                            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
    </main>
  );
}