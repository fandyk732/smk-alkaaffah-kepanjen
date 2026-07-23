"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  GraduationCap, 
  Rocket, 
  LogOut, 
  Plus, 
  Trash2, 
  UserCheck, 
  ShieldAlert, 
  LayoutGrid, 
  Loader2,
  Search,
  Filter,
  FileSpreadsheet,
  Users,
  SearchCheck,
  MessageSquare
} from "lucide-react";

interface Alumni {
  id: string;
  nama: string;
  angkatan: string;
  jurusan: string;
  status: "Bekerja" | "Kuliah" | "Wirausaha" | "Mencari Kerja";
  tempat: string;
  posisi?: string;
  whatsapp?: string;
  testimoni?: string;
}

export default function AdminAlumniPage() {
  const router = useRouter();
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [alumniList, setAlumniList] = useState<Alumni[]>([]);
  const [adminName, setAdminName] = useState("");

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterJurusan, setFilterJurusan] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");

  // Form States
  const [nama, setNama] = useState("");
  const [angkatan, setAngkatan] = useState("");
  const [jurusan, setJurusan] = useState("Teknik Kendaraan Ringan");
  const [status, setStatus] = useState<"Bekerja" | "Kuliah" | "Wirausaha" | "Mencari Kerja">("Bekerja");
  const [tempat, setTempat] = useState("");
  const [posisi, setPosisi] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [testimoni, setTestimoni] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. 🛡️ Proteksi Halaman & Verifikasi Hak Akses
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

          // Konversi role ke Array (Mendukung data string lama & array baru)
          const roles: string[] = Array.isArray(data.role) ? data.role : [data.role];

          // Cek akses admin_alumni atau superadmin
          const hasAccess = roles.includes("admin_alumni") || roles.includes("superadmin");

          if (hasAccess) {
            setAdminName(data.nama || "Admin Alumni");
            setLoadingAuth(false);
            await ambilDataAlumni();
          } else {
            alert("Anda tidak memiliki akses ke modul Alumni & BKK!");
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
    if (!nama || !angkatan) return alert("Mohon isi Nama Lengkap dan Angkatan!");
    if (status !== "Mencari Kerja" && !tempat) return alert("Mohon isi nama instansi / tempat!");

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "alumni"), {
        nama,
        angkatan,
        jurusan,
        status,
        tempat: status === "Mencari Kerja" ? "Sedang Mencari Kerja" : tempat,
        posisi: posisi || "",
        whatsapp: whatsapp || "",
        testimoni: testimoni || "",
        createdAt: new Date().toISOString()
      });

      // Reset Form
      setNama("");
      setAngkatan("");
      setTempat("");
      setPosisi("");
      setWhatsapp("");
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

  // 5. Export CSV
  const handleExportCSV = () => {
    if (filteredAlumni.length === 0) return alert("Tidak ada data alumni untuk di-export.");

    const headers = ["Nama Lengkap", "Angkatan", "Jurusan", "Status", "Tempat/Instansi", "Posisi/Jabatan", "WhatsApp", "Testimoni"];
    const rows = filteredAlumni.map(a => [
      `"${a.nama.replace(/"/g, '""')}"`,
      `"${a.angkatan}"`,
      `"${a.jurusan}"`,
      `"${a.status}"`,
      `"${a.tempat.replace(/"/g, '""')}"`,
      `"${(a.posisi || "-").replace(/"/g, '""')}"`,
      ` font-mono:"${a.whatsapp || "-"}"`,
      `"${(a.testimoni || "-").replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Tracer_Study_Alumni_${new Date().toLocaleDateString("id-ID")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 📊 Kalkulasi Statistik
  const stats = useMemo(() => {
    const total = alumniList.length;
    const bekerja = alumniList.filter(a => a.status === "Bekerja").length;
    const kuliah = alumniList.filter(a => a.status === "Kuliah").length;
    const wirausaha = alumniList.filter(a => a.status === "Wirausaha").length;
    const seeking = alumniList.filter(a => a.status === "Mencari Kerja").length;

    return { total, bekerja, kuliah, wirausaha, seeking };
  }, [alumniList]);

  // 🔍 Filtered List Data
  const filteredAlumni = useMemo(() => {
    return alumniList.filter(item => {
      const matchSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tempat.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.angkatan.includes(searchQuery);

      const matchJurusan = filterJurusan === "Semua" || item.jurusan === filterJurusan;
      const matchStatus = filterStatus === "Semua" || item.status === filterStatus;

      return matchSearch && matchJurusan && matchStatus;
    });
  }, [alumniList, searchQuery, filterJurusan, filterStatus]);

  // Handler Navigasi
  const handleKembaliKeDashboard = () => router.push("/admin/dashboard");
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
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
      <div className="container-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* TOPBAR HEAD */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-card border p-4 sm:p-6 rounded-2xl shadow-sm gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">Dashboard BKK & Alumni</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Petugas: <span className="font-semibold text-foreground">{adminName}</span> • Pengelolaan Direktori Tracer Study
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5 rounded-xl border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
              <FileSpreadsheet className="h-4 w-4" /> Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleKembaliKeDashboard} className="gap-1.5 rounded-xl border-slate-300">
              <LayoutGrid className="h-4 w-4" /> Dashboard Hub
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLogout} className="gap-1.5 rounded-xl">
              <LogOut className="h-4 w-4" /> Keluar
            </Button>
          </div>
        </div>

        {/* 📊 STATISTIK RINGKAS (TRACER STUDY WIDGETS) */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-card border p-4 rounded-2xl shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">Total Alumni</p>
              <p className="text-lg font-black">{stats.total}</p>
            </div>
          </div>

          <div className="bg-card border p-4 rounded-2xl shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">Bekerja</p>
              <p className="text-lg font-black text-sky-600">{stats.bekerja}</p>
            </div>
          </div>

          <div className="bg-card border p-4 rounded-2xl shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">Kuliah</p>
              <p className="text-lg font-black text-emerald-600">{stats.kuliah}</p>
            </div>
          </div>

          <div className="bg-card border p-4 rounded-2xl shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Rocket className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">Wirausaha</p>
              <p className="text-lg font-black text-amber-600">{stats.wirausaha}</p>
            </div>
          </div>

          <div className="bg-card border p-4 rounded-2xl shadow-sm flex items-center gap-3 col-span-2 lg:col-span-1">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
              <SearchCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">Mencari Kerja</p>
              <p className="text-lg font-black text-rose-600">{stats.seeking}</p>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* PANEL FORM INPUT (KIRI) */}
          <div className="bg-card border p-6 rounded-2xl shadow-sm lg:col-span-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
              <Plus className="h-4 w-4 text-primary" /> Input Data Alumni Baru
            </h2>
            <form onSubmit={handleTambahAlumni} className="space-y-4">
              <div>
                <label className="text-xs font-semibold block mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Ahmad Dani" 
                  className="w-full bg-background border p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary transition" 
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
                    className="w-full bg-background border p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary transition" 
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Jurusan</label>
                  <select 
                    value={jurusan}
                    onChange={(e) => setJurusan(e.target.value)}
                    className="w-full bg-background border p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary transition"
                  >
                    <option value="Teknik Kendaraan Ringan">TKR</option>
                    <option value="Teknik Sepeda Motor">TSM</option>
                    <option value="Teknik Elektronika Industri">TEI</option>
                    <option value="Teknik Komputer Jaringan">TKJ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Status Lulusan Saat Ini</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-background border p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary transition"
                >
                  <option value="Bekerja">💼 Bekerja</option>
                  <option value="Kuliah">🎓 Kuliah / Lanjut Studi</option>
                  <option value="Wirausaha">🚀 Wirausaha / Bisnis</option>
                  <option value="Mencari Kerja">🔍 Mencari Kerja (Job Seeker)</option>
                </select>
              </div>

              {status !== "Mencari Kerja" && (
                <div>
                  <label className="text-xs font-semibold block mb-1">Nama Instansi / Univ / Usaha</label>
                  <input 
                    type="text" 
                    value={tempat}
                    onChange={(e) => setTempat(e.target.value)}
                    placeholder="Contoh: PT. Toyota / Universitas Brawijaya" 
                    className="w-full bg-background border p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary transition" 
                  />
                </div>
              )}

              {status === "Bekerja" && (
                <div>
                  <label className="text-xs font-semibold block mb-1">Jabatan / Posisi Kerja</label>
                  <input 
                    type="text" 
                    value={posisi}
                    onChange={(e) => setPosisi(e.target.value)}
                    placeholder="Contoh: Mekanik / Quality Control" 
                    className="w-full bg-background border p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary transition" 
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold block mb-1">No. WhatsApp Alumni (Opsional)</label>
                <input 
                  type="text" 
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="081234567890" 
                  className="w-full bg-background border p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary transition" 
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Testimoni / Message (Opsional)</label>
                <textarea 
                  value={testimoni}
                  onChange={(e) => setTestimoni(e.target.value)}
                  placeholder="Kesan pesan untuk adik kelas di SMK Al Kaaffah..." 
                  className="w-full bg-background border p-2.5 rounded-xl text-sm h-20 resize-none focus:outline-none focus:border-primary transition" 
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full py-5 rounded-xl font-bold text-sm mt-2">
                {isSubmitting ? "Menyimpan..." : "Simpan Data Alumni"}
              </Button>
            </form>
          </div>

          {/* TABEL MONITOR DATA (KANAN) */}
          <div className="bg-card border p-6 rounded-2xl shadow-sm lg:col-span-2 space-y-4">
            
            {/* Header & Search Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Direktori Alumni ({filteredAlumni.length})
              </h2>

              {/* Input Cari */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Cari Nama, Instansi, Angkatan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border bg-background text-xs outline-none focus:border-primary transition"
                />
              </div>
            </div>

            {/* Filter Dropdown */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="relative">
                <Filter className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <select 
                  value={filterJurusan}
                  onChange={(e) => setFilterJurusan(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border bg-background text-xs outline-none focus:border-primary transition appearance-none"
                >
                  <option value="Semua">Semua Jurusan</option>
                  <option value="Teknik Kendaraan Ringan">TKR</option>
                  <option value="Teknik Sepeda Motor">TSM</option>
                  <option value="Teknik Elektronika Industri">TEI</option>
                  <option value="Desain Komunikasi Visual">DKV</option>
                </select>
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border bg-background text-xs outline-none focus:border-primary transition appearance-none"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Bekerja">Bekerja</option>
                  <option value="Kuliah">Kuliah</option>
                  <option value="Wirausaha">Wirausaha</option>
                  <option value="Mencari Kerja">Mencari Kerja</option>
                </select>
              </div>
            </div>

            {/* Content Table */}
            {loadingData ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : filteredAlumni.length === 0 ? (
              <div className="text-center py-20 border border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground text-sm">
                <ShieldAlert className="h-8 w-8 text-muted-foreground/50 mb-2" />
                Tidak ada data alumni yang cocok.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border mt-2">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b text-muted-foreground font-semibold text-xs bg-secondary/30">
                      <th className="p-3">Nama & Angkatan</th>
                      <th className="p-3">Jurusan</th>
                      <th className="p-3">Status / Tempat</th>
                      <th className="p-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredAlumni.map((item) => (
                      <tr key={item.id} className="hover:bg-secondary/10 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-foreground">{item.nama}</div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                            <span>Angkatan {item.angkatan}</span>
                            {item.whatsapp && (
                              <a 
                                href={`https://wa.me/${item.whatsapp.replace(/\D/g, '')}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-emerald-600 hover:underline flex items-center gap-0.5"
                              >
                                <MessageSquare className="h-3 w-3" /> WA
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="p-3 font-medium text-xs text-muted-foreground">{item.jurusan}</td>
                        <td className="p-3">
                          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold mb-1 ${
                            item.status === "Bekerja" ? "bg-sky-50 text-sky-700 border border-sky-200" :
                            item.status === "Kuliah" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                            item.status === "Wirausaha" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                            "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}>
                            {item.status === "Bekerja" && <Briefcase className="h-3 w-3 text-sky-500" />}
                            {item.status === "Kuliah" && <GraduationCap className="h-3 w-3 text-emerald-500" />}
                            {item.status === "Wirausaha" && <Rocket className="h-3 w-3 text-amber-500" />}
                            {item.status === "Mencari Kerja" && <SearchCheck className="h-3 w-3 text-rose-500" />}
                            {item.status}
                          </div>
                          <div className="text-xs font-medium text-muted-foreground max-w-[180px] truncate">{item.tempat}</div>
                          {item.posisi && <div className="text-[11px] italic text-muted-foreground">{item.posisi}</div>}
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