"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
  writeBatch,
} from "firebase/firestore";
import { Pendaftar } from "@/types/ppdb";

export function usePPDBAdmin() {
  const router = useRouter();
  const [listPendaftar, setListPendaftar] = useState<Pendaftar[]>([]);
  const [loading, setLoading] = useState(true);
  const [panitiaName, setPanitiaName] = useState("");

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterJurusan, setFilterJurusan] = useState("");

  // Modal & Printable Selection States
  const [selectedIndividu, setSelectedIndividu] = useState<Pendaftar | null>(null);
  const [editingPendaftar, setEditingPendaftar] = useState<Pendaftar | null>(null);
  const [deletingPendaftar, setDeletingPendaftar] = useState<Pendaftar | null>(null);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- AMBIL DATA PPDB ---
  const ambilDataPPDB = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "ppdb"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data: Pendaftar[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Pendaftar);
      });
      setListPendaftar(data);
    } catch (error) {
      console.error("Gagal mengambil data SPMB:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- PROTEKSI AUTH & AUTO FETCH ---
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
          const hasAccess =
            roles.includes("panitia_PPDB") ||
            roles.includes("admin_ppdb") ||
            roles.includes("superadmin");

          if (hasAccess) {
            setPanitiaName(data.nama || "Panitia SPMB");
            await ambilDataPPDB();
          } else {
            alert("Anda tidak memiliki akses ke modul SPMB!");
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
  }, [router, ambilDataPPDB]);

  // --- ACTIONS ---
  const handleKembaliKeDashboard = () => router.push("/admin/dashboard");

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const ubahStatus = async (id: string, statusBaru: "Diterima" | "Ditolak") => {
    try {
      const siswa = listPendaftar.find((item) => item.id === id);

      const batch = writeBatch(db);
      batch.update(doc(doc(db, "ppdb", id).firestore, "ppdb", id), {
        statusPendaftaran: statusBaru,
      });
      batch.set(
        doc(db, "ppdb_public", id),
        {
          statusPendaftaran: statusBaru,
          ...(siswa && {
            namaLengkap: siswa.namaLengkap,
            nisn: siswa.nisn,
            noRegistrasi: siswa.noRegistrasi || "",
            asalSekolah: siswa.asalSekolah,
            pilihanJurusan: siswa.pilihanJurusan,
          }),
        },
        { merge: true }
      );
      await batch.commit();

      setListPendaftar((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, statusPendaftaran: statusBaru } : item
        )
      );
    } catch (error) {
      alert("Gagal mengubah status pendaftaran.");
      console.error(error);
    }
  };

  const handleSaveEdit = async (updatedData: {
    namaLengkap: string;
    nisn: string;
    whatsapp: string;
    asalSekolah: string;
    pilihanJurusan: string;
    programUnggulan: string;
    ekstrakurikuler: string;
  }) => {
    if (!editingPendaftar) return;

    if (updatedData.nisn !== editingPendaftar.nisn) {
      const lanjut = confirm(
        "Kamu mengubah NISN. Perlu diketahui: ini CUMA mengubah nilai field NISN di data, bukan memindahkan dokumennya. Fitur cek status di halaman publik akan tetap mencari pakai NISN yang baru dan TIDAK akan ketemu.\n\nUntuk NISN yang bener-bener berubah, disarankan hapus data ini lalu minta siswa daftar ulang pakai NISN yang benar.\n\nLanjutkan simpan perubahan lain (tanpa memperbaiki masalah ini)?"
      );
      if (!lanjut) return;
    }

    setIsSubmittingEdit(true);
    try {
      const batch = writeBatch(db);

      batch.update(doc(db, "ppdb", editingPendaftar.id), updatedData);

      batch.set(
        doc(db, "ppdb_public", editingPendaftar.id),
        {
          namaLengkap: updatedData.namaLengkap,
          asalSekolah: updatedData.asalSekolah,
          pilihanJurusan: updatedData.pilihanJurusan,
          noRegistrasi: editingPendaftar.noRegistrasi || "",
          nisn: editingPendaftar.nisn,
          statusPendaftaran: editingPendaftar.statusPendaftaran || "Menunggu Verifikasi",
        },
        { merge: true }
      );

      await batch.commit();

      setListPendaftar((prev) =>
        prev.map((item) =>
          item.id === editingPendaftar.id ? { ...item, ...updatedData } : item
        )
      );

      setEditingPendaftar(null);
    } catch (error) {
      console.error("Gagal mengupdate data pendaftar:", error);
      alert("Gagal memperbarui data pendaftar.");
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingPendaftar) return;

    setIsDeleting(true);
    try {
      const batch = writeBatch(db);
      batch.delete(doc(db, "ppdb", deletingPendaftar.id));
      batch.delete(doc(db, "ppdb_public", deletingPendaftar.id));
      await batch.commit();

      setListPendaftar((prev) =>
        prev.filter((item) => item.id !== deletingPendaftar.id)
      );
      setDeletingPendaftar(null);
    } catch (error) {
      console.error("Gagal menghapus data pendaftar:", error);
      alert("Gagal menghapus data pendaftar.");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- FILTERING ---
  const pendaftarDifilter = listPendaftar.filter((p) => {
    const cocokSearch =
      (p.namaLengkap || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.nisn || "").includes(searchQuery) ||
      (p.noRegistrasi || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.asalSekolah || "").toLowerCase().includes(searchQuery.toLowerCase());

    const cocokJurusan = filterJurusan === "" || p.pilihanJurusan === filterJurusan;
    return cocokSearch && cocokJurusan;
  });

  return {
    listPendaftar,
    pendaftarDifilter,
    loading,
    panitiaName,
    searchQuery,
    setSearchQuery,
    filterJurusan,
    setFilterJurusan,
    selectedIndividu,
    setSelectedIndividu,
    editingPendaftar,
    setEditingPendaftar,
    deletingPendaftar,
    setDeletingPendaftar,
    isSubmittingEdit,
    isDeleting,
    ambilDataPPDB,
    handleKembaliKeDashboard,
    handleLogout,
    ubahStatus,
    handleSaveEdit,
    handleDelete,
  };
}