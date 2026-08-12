"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signOut, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Alumni, AlumniFormState } from "@/types/alumni";
import { exportAlumniToCSV } from "@/utils/alumniHelpers";

const INITIAL_FORM: AlumniFormState = {
  nama: "",
  angkatan: "",
  jurusan: "TKJ",
  status: "Bekerja",
  tempat: "",
  posisi: "",
  whatsapp: "",
  testimoni: "",
};

export function useAlumniAdmin() {
  const router = useRouter();

  // State Auth & Data
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [alumniList, setAlumniList] = useState<Alumni[]>([]);
  const [adminName, setAdminName] = useState("");

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterJurusan, setFilterJurusan] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");

  // Form State
  const [formData, setFormData] = useState<AlumniFormState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ambil Data Live Alumni
  const ambilDataAlumni = useCallback(async () => {
    setLoadingData(true);
    try {
      const q = query(collection(db, "alumni"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const list: Alumni[] = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();

        const normalizeStatus = () => {
          const rawStatus = data.status || data.statusAlumni || "";
          if (rawStatus === "kerja" || rawStatus === "Bekerja") return "Bekerja";
          if (rawStatus === "kuliah" || rawStatus === "Kuliah") return "Kuliah";
          if (rawStatus === "wirausaha" || rawStatus === "Wirausaha") return "Wirausaha";
          if (rawStatus === "kerja_kuliah") return "Bekerja";
          return "Mencari Kerja";
        };

        list.push({
          id: docSnap.id,
          nama: data.nama || data.namaLengkap || "Tanpa Nama",
          angkatan: (data.angkatan || data.tahunLulus || "-").toString(),
          jurusan: data.jurusan || "-",
          status: normalizeStatus(),
          tempat: data.tempat || data.namaInstansi || "-",
          posisi: data.posisi || data.jabatanJurusan || "",
          whatsapp: data.whatsapp || data.noWhatsapp || "",
          testimoni: data.testimoni || data.kesanPesan || "",
        });
      });

      setAlumniList(list);
    } catch (error) {
      console.error("Gagal mengambil data alumni:", error);
    } finally {
      setLoadingData(false);
    }
  }, []);

  // Proteksi Hak Akses
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
  }, [router, ambilDataAlumni]);

  // Handler Tambah Alumni
  const handleTambahAlumni = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.angkatan) return alert("Mohon isi Nama Lengkap dan Angkatan!");
    if (formData.status !== "Mencari Kerja" && !formData.tempat)
      return alert("Mohon isi nama instansi / tempat!");

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "alumni"), {
        namaLengkap: formData.nama,
        nama: formData.nama,
        tahunLulus: Number(formData.angkatan),
        angkatan: formData.angkatan,
        jurusan: formData.jurusan,
        statusAlumni: formData.status.toLowerCase().replace(" ", "_"),
        status: formData.status,
        namaInstansi: formData.status === "Mencari Kerja" ? "-" : formData.tempat,
        tempat: formData.status === "Mencari Kerja" ? "Sedang Mencari Kerja" : formData.tempat,
        jabatanJurusan: formData.posisi || "-",
        posisi: formData.posisi || "",
        noWhatsapp: formData.whatsapp || "",
        whatsapp: formData.whatsapp || "",
        kesanPesan: formData.testimoni || "",
        testimoni: formData.testimoni || "",
        createdAt: serverTimestamp(),
      });

      setFormData(INITIAL_FORM);
      await ambilDataAlumni();
      alert("Data alumni berhasil disimpan!");
    } catch (error) {
      console.error("Gagal menambah data:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler Hapus Alumni
  const handleHapusAlumni = async (id: string, namaAlumni: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data alumni "${namaAlumni}"?`)) {
      try {
        await deleteDoc(doc(db, "alumni", id));
        await deleteDoc(doc(db, "tracer_private", id));
        setAlumniList((prev) => prev.filter((item) => item.id !== id));
        alert("Data berhasil dihapus.");
      } catch (error) {
        console.error("Gagal menghapus:", error);
      }
    }
  };

  // Kalkulasi Statistik Ringkas
  const stats = useMemo(() => {
    const total = alumniList.length;
    const bekerja = alumniList.filter((a) => a.status === "Bekerja").length;
    const kuliah = alumniList.filter((a) => a.status === "Kuliah").length;
    const wirausaha = alumniList.filter((a) => a.status === "Wirausaha").length;
    const seeking = alumniList.filter((a) => a.status === "Mencari Kerja").length;

    return { total, bekerja, kuliah, wirausaha, seeking };
  }, [alumniList]);

  // Filtered List Data Alumni
  const filteredAlumni = useMemo(() => {
    return alumniList.filter((item) => {
      const matchSearch =
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tempat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.angkatan.includes(searchQuery);

      const matchJurusan =
        filterJurusan === "Semua" ||
        item.jurusan.toLowerCase().includes(filterJurusan.toLowerCase());
      const matchStatus = filterStatus === "Semua" || item.status === filterStatus;

      return matchSearch && matchJurusan && matchStatus;
    });
  }, [alumniList, searchQuery, filterJurusan, filterStatus]);

  // Navigation & Export
  const handleKembaliKeDashboard = () => router.push("/admin/dashboard");
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };
  const handleExport = () => exportAlumniToCSV(alumniList);

  return {
    loadingAuth,
    loadingData,
    adminName,
    formData,
    setFormData,
    isSubmitting,
    stats,
    filteredAlumni,
    searchQuery,
    setSearchQuery,
    filterJurusan,
    setFilterJurusan,
    filterStatus,
    setFilterStatus,
    handleTambahAlumni,
    handleHapusAlumni,
    handleKembaliKeDashboard,
    handleLogout,
    handleExport,
  };
}