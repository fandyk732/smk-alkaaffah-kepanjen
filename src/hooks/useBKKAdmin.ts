"use client";

import { useState, useEffect, useCallback } from "react";
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
  getDoc,
} from "firebase/firestore";
import { Vacancy, Application } from "@/types/bkk";

export function useBKKAdmin() {
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

  // Fetch Lowongan Kerja
  const fetchVacancies = useCallback(async () => {
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
  }, []);

  // Proteksi Hak Akses & Initial Fetch
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
  }, [router, fetchVacancies]);

  // Handler Logout
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  // Ambil Data Pelamar
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

  // Tambah Lowker Baru
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
        createdAt: serverTimestamp(),
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

  // Toggle Status Lowker
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

  // Hapus Lowker
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

  return {
    vacancies,
    loading,
    submitting,
    isFormOpen,
    setIsFormOpen,
    title,
    setTitle,
    company,
    setCompany,
    location,
    setLocation,
    targetJurusan,
    setTargetJurusan,
    description,
    setDescription,
    deadline,
    setDeadline,
    selectedVacancyForApps,
    applications,
    loadingApps,
    isAppsModalOpen,
    setIsAppsModalOpen,
    handleLogout,
    handleOpenApplications,
    handleCreateVacancy,
    handleToggleStatus,
    handleDeleteVacancy,
  };
}