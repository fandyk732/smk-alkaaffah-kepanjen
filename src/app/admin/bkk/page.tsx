"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  serverTimestamp,
  getDoc
} from "firebase/firestore";
import {
  Briefcase,
  Plus,
  Trash2,
  Users,
  Loader2,
  Building2,
  MapPin,
  Calendar,
  X,
  ExternalLink,
  Mail,
  Phone,
  GraduationCap,
  LogOut,
  LayoutDashboard,
  MessageCircle,
  FileText
} from "lucide-react";
import Link from "next/link";

interface Vacancy {
  id: string;
  title: string;
  company: string;
  location: string;
  targetJurusan: string[];
  description: string;
  deadline: string;
  status: string;
  createdAt?: any;
}

interface Application {
  id: string;
  vacancyId?: string;
  jobId?: string;
  vacancyTitle?: string;
  // Fleksibilitas key nama
  nama?: string;
  fullName?: string;
  name?: string;
  namaLengkap?: string;
  // Fleksibilitas kontak & sekolah
  email?: string;
  whatsapp?: string;
  phone?: string;
  noHp?: string;
  jurusan?: string;
  tahunLulus?: string;
  // Fleksibilitas file CV
  linkCv?: string;
  cvLink?: string;
  cvUrl?: string;
  cv?: string;
  fileCv?: string;
  resumeUrl?: string;
  driveCvLink?: string;
  driveLink?: string;
  link?: string;
  
  createdAt?: any;
}

// 🛡️ Helper untuk menyaring & memvalidasi URL CV secara aman
const getSafeCvUrl = (url?: string) => {
  if (!url || typeof url !== "string") return null;

  try {
    const parsedUrl = new URL(url.trim());

    // 1. Wajib protokol HTTP/HTTPS (Mencegah javascript: XSS attack)
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return null;
    }

    // 2. Domain Whitelist (Daftar platform penyimpanan CV yang aman)
    const allowedDomains = [
      "drive.google.com",
      "docs.google.com",
      "dropbox.com",
      "onedrive.live.com",
      "firebasestorage.googleapis.com",
      "vercel-storage.com"
    ];

    const isAllowed = allowedDomains.some((domain) =>
      parsedUrl.hostname.endsWith(domain)
    );

    // Filter domain agar hanya link dokumen terpercaya yang bisa dibuka admin
    if (!isAllowed) return null;

    return parsedUrl.href;
  } catch (e) {
    return null;
  }
};

export default function AdminBkkPage() {
  const router = useRouter();

  // State Main
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // State Form Tambah Lowker
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [targetJurusan, setTargetJurusan] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  // State Modal Pelamar
  const [selectedVacancyForApps, setSelectedVacancyForApps] = useState<Vacancy | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [isAppsModalOpen, setIsAppsModalOpen] = useState(false);

  // 🛡️ Proteksi Hak Akses
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.email || ""));
        if (userDoc.exists()) {
          const roles = userDoc.data().role;
          const userRoles = Array.isArray(roles) ? roles : [roles];
          const hasAccess = userRoles.some((r: string) =>
            ["superadmin", "admin_bkk", "admin_alumni"].includes(String(r).toLowerCase())
          );

          if (!hasAccess) {
            alert("Akses ditolak! Anda tidak memiliki akses Admin BKK.");
            router.push("/admin/dashboard");
            return;
          }

          fetchVacancies();
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Gagal verifikasi role:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Logout Handler
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  // 1. Ambil Data Lowker
  const fetchVacancies = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "vacancies"));
      const snap = await getDocs(q);
      const list: Vacancy[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as Vacancy));
      
      list.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setVacancies(list);
    } catch (err) {
      console.error("Gagal mengambil data lowker:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Ambil Data Pelamar
  const handleOpenApplications = async (vacancy: Vacancy) => {
    setSelectedVacancyForApps(vacancy);
    setIsAppsModalOpen(true);
    setLoadingApps(true);

    try {
      const fetchedList: Application[] = [];
      const collectionsToTry = ["job_applications", "applications"];

      for (const colName of collectionsToTry) {
        const colSnap = await getDocs(collection(db, colName));
        colSnap.forEach((d) => {
          const data = d.data();
          if (data.vacancyId === vacancy.id || data.jobId === vacancy.id) {
            fetchedList.push({ id: d.id, ...data } as Application);
          }
        });
      }

      fetchedList.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setApplications(fetchedList);
    } catch (err) {
      console.error("Gagal mengambil daftar pelamar:", err);
    } finally {
      setLoadingApps(false);
    }
  };

  // Helper Format Nomor WhatsApp (Ubah 08123... jadi 628123...)
  const formatWaNumber = (phone?: string) => {
    if (!phone) return "";
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) {
      clean = "62" + clean.slice(1);
    }
    return clean;
  };

  // 3. Tambah Lowker Baru
  const handleCreateVacancy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company || !description) {
      alert("Harap isi Judul, Perusahaan, dan Deskripsi!");
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "vacancies"), {
        title,
        company,
        location,
        targetJurusan,
        description,
        deadline,
        status: "active",
        createdAt: serverTimestamp()
      });

      alert("Lowongan kerja berhasil diterbitkan!");
      setIsFormOpen(false);
      setTitle("");
      setCompany("");
      setLocation("");
      setTargetJurusan([]);
      setDescription("");
      setDeadline("");
      fetchVacancies();
    } catch (err) {
      console.error("Gagal menyimpan lowker:", err);
      alert("Gagal menyimpan lowker.");
    } finally {
      setSubmitting(false);
    }
  };

  // 4. Ubah Status Lowker (Active / Closed)
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "closed" : "active";
    try {
      await updateDoc(doc(db, "vacancies", id), { status: nextStatus });
      setVacancies((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
      );
    } catch (err) {
      console.error("Gagal update status:", err);
    }
  };

  // 5. Hapus Lowker
  const handleDeleteVacancy = async (id: string, title: string) => {
    if (confirm(`Yakin ingin menghapus lowongan "${title}"?`)) {
      try {
        await deleteDoc(doc(db, "vacancies", id));
        fetchVacancies();
      } catch (err) {
        console.error("Gagal menghapus lowker:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-950 text-white">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div>
            <h1 className="text-2xl font-extrabold flex items-center gap-2.5 text-white">
              <Briefcase className="h-7 w-7 text-indigo-400" /> Manajemen BKK (Bursa Kerja Khusus)
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Kelola lowongan kerja mitra industri dan tinjau berkas pelamar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition"
            >
              <Plus className="h-4 w-4" /> Tambah Lowongan
            </button>

            <Link
              href="/admin/dashboard"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
            >
              <LogOut className="h-4 w-4" /> Keluar
            </button>
          </div>
        </div>

        {/* DAFTAR LOWONGAN */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-200">Daftar Lowongan Kerja</h2>

          {vacancies.length === 0 ? (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-sm">
              Belum ada lowongan kerja tersimpan.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {vacancies.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-bold text-base text-white">{item.title}</h3>
                        <p className="text-xs text-indigo-400 font-medium flex items-center gap-1 mt-0.5">
                          <Building2 className="h-3.5 w-3.5" /> {item.company}
                        </p>
                      </div>

                      <button
                        onClick={() => handleToggleStatus(item.id, item.status)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition ${
                          item.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}
                      >
                        {item.status === "active" ? "Aktif" : "Tutup"}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-md">
                        <MapPin className="h-3 w-3" /> {item.location || "-"}
                      </span>
                      <span className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-md">
                        <Calendar className="h-3 w-3" /> Batas: {item.deadline || "-"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 pt-1">{item.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                    <button
                      onClick={() => handleOpenApplications(item)}
                      className="px-3.5 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
                    >
                      <Users className="h-4 w-4" /> Lihat Pelamar
                    </button>

                    <button
                      onClick={() => handleDeleteVacancy(item.id, item.title)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition"
                      title="Hapus Lowongan"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* MODAL DAFTAR PELAMAR */}
      {isAppsModalOpen && selectedVacancyForApps && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div>
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-400" /> Daftar Pelamar Kerja
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Posisi: <span className="text-indigo-300 font-semibold">{selectedVacancyForApps.title}</span> - {selectedVacancyForApps.company}
                </p>
              </div>

              <button
                onClick={() => setIsAppsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {loadingApps ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  Belum ada pelamar yang terdaftar untuk posisi ini.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs text-slate-400 font-medium">
                    Total Pelamar: <strong className="text-white">{applications.length} orang</strong>
                  </div>

                  <div className="divide-y divide-slate-800 bg-slate-950/50 rounded-xl border border-slate-800 overflow-hidden">
                    {applications.map((app, index) => {
                      // 1. Ekstraksi Nama
                      const namaPelamar =
                        app.nama ||
                        app.fullName ||
                        app.namaLengkap ||
                        app.name ||
                        "Pelamar Tanpa Nama";

                      // 2. Ekstraksi Kontak WA
                      const rawPhone = app.whatsapp || app.phone || app.noHp || "";
                      const formattedWa = formatWaNumber(rawPhone);

                      // 3. Ekstraksi & Filter Keamanan Link CV
                      const rawCvUrl =
                        app.linkCv ||
                        app.cvLink ||
                        app.cvUrl ||
                        app.cv ||
                        app.fileCv ||
                        app.resumeUrl ||
                        app.driveCvLink ||
                        app.driveLink ||
                        app.link ||
                        "";

                      const safeCvUrl = getSafeCvUrl(rawCvUrl);

                      return (
                        <div
                          key={app.id || index}
                          className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/30 transition"
                        >
                          <div className="space-y-1.5">
                            {/* NAMA DAN BADGE */}
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-bold text-sm text-white">{namaPelamar}</h4>
                              {app.tahunLulus && (
                                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-medium">
                                  Lulus {app.tahunLulus}
                                </span>
                              )}
                            </div>

                            {/* DETAILS: JURUSAN & EMAIL */}
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                              {app.jurusan && (
                                <span className="flex items-center gap-1">
                                  <GraduationCap className="h-3.5 w-3.5 text-indigo-400" /> Jurusan: {app.jurusan}
                                </span>
                              )}
                              {app.email && app.email !== "-" && (
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3.5 w-3.5 text-slate-500" /> {app.email}
                                </span>
                              )}
                              {rawPhone && (
                                <span className="flex items-center gap-1 font-mono text-slate-300">
                                  <Phone className="h-3.5 w-3.5 text-slate-500" /> {rawPhone}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* ACTION BUTTONS */}
                          <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0">
                            {/* WhatsApp Button */}
                            {formattedWa ? (
                              <a
                                href={`https://wa.me/${formattedWa}?text=${encodeURIComponent(
                                  `Halo ${namaPelamar}, kami dari Tim BKK terkait lamaran Anda untuk posisi *${selectedVacancyForApps.title}* di *${selectedVacancyForApps.company}*.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                              >
                                <MessageCircle className="h-3.5 w-3.5" /> Chat WA
                              </a>
                            ) : null}

                            {/* CV Button */}
                            {safeCvUrl ? (
                              <a
                                href={safeCvUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                              >
                                <FileText className="h-3.5 w-3.5" /> Buka CV <ExternalLink className="h-3 w-3" />
                              </a>
                            ) : (
                              <span className="text-xs text-slate-500 italic bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                                {rawCvUrl ? "Link CV Tidak Sesuai" : "CV tidak ada"}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* MODAL FORM TAMBAH LOWKER BARU */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Tambah Lowongan Kerja Baru</h3>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVacancy} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Judul Posisi Lowongan</label>
                <input
                  type="text"
                  required
                  placeholder="mis: Junior Web Developer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nama Perusahaan Mitra</label>
                <input
                  type="text"
                  required
                  placeholder="mis: PT Telekomunikasi Indonesia"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Lokasi Penempatan</label>
                  <input
                    type="text"
                    placeholder="mis: Malang / Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Batas Akhir (Deadline)</label>
                  <input
                    type="text"
                    placeholder="mis: 30 Agustus 2026"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Deskripsi & Kualifikasi Pekerjaan</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan syarat dan tugas pekerjaan..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition flex justify-center items-center gap-2"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Terbitkan Lowongan"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}