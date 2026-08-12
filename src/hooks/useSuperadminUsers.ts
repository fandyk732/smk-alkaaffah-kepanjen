"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, secondaryAuth } from "@/lib/firebase";
import { UserData, UserFormState } from "@/types/userAdmin";

const INITIAL_FORM: UserFormState = {
  nama: "",
  email: "",
  password: "",
  roles: ["admin_artikel"],
};

export function useSuperadminUsers() {
  const router = useRouter();

  // State User & App
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [usersList, setUsersList] = useState<UserData[]>([]);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Form State
  const [formData, setFormData] = useState<UserFormState>(INITIAL_FORM);

  // 1. Ambil List User dari Firestore
  const ambilDaftarUser = useCallback(async () => {
    setLoadingFetch(true);
    try {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      const list: UserData[] = [];

      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();

        let formattedRoles: string[] = [];
        if (Array.isArray(data.role)) {
          formattedRoles = data.role;
        } else if (typeof data.role === "string") {
          formattedRoles = [data.role];
        }

        list.push({
          id: docSnapshot.id,
          nama: data.nama || "",
          email: data.email || docSnapshot.id,
          role: formattedRoles,
          createdAt: data.createdAt,
        });
      });

      setUsersList(list);
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    } finally {
      setLoadingFetch(false);
    }
  }, []);

  // Proteksi Halaman: Hanya Superadmin yang Boleh Masuk
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
          const isSuperadmin = Array.isArray(roles)
            ? roles.includes("superadmin")
            : roles === "superadmin";

          if (isSuperadmin) {
            setCurrentUserEmail(user.email || "");
            setLoadingAuth(false);
            await ambilDaftarUser();
            return;
          }
        }

        alert("Akses ditolak! Halaman ini khusus Superadmin.");
        router.push("/admin/dashboard");
      } catch (err) {
        console.error("Gagal verifikasi role superadmin:", err);
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router, ambilDaftarUser]);

  // Toggle Role pada Form Tambah User
  const handleToggleRoleForm = (roleId: string) => {
    setFormData((prev) => {
      const isExist = prev.roles.includes(roleId);
      if (isExist) {
        if (prev.roles.length === 1) {
          alert("Minimal user harus memiliki 1 role!");
          return prev;
        }
        return { ...prev, roles: prev.roles.filter((r) => r !== roleId) };
      } else {
        return { ...prev, roles: [...prev.roles, roleId] };
      }
    });
  };

  // 2. Tambah Data User Baru (Firebase Auth + Firestore)
  const handleTambahUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const { nama, email, password, roles } = formData;

    if (!email.trim() || !nama.trim() || !password.trim()) {
      alert("Harap isi semua bidang termasuk password!");
      return;
    }

    if (password.length < 6) {
      alert("Password minimal harus 6 karakter!");
      return;
    }

    if (roles.length === 0) {
      alert("Pilih minimal 1 role untuk pengguna baru!");
      return;
    }

    setLoadingSubmit(true);
    const emailNormalized = email.toLowerCase().trim();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        emailNormalized,
        password
      );

      await secondaryAuth.signOut();

      await setDoc(doc(db, "users", emailNormalized), {
        uid: userCredential.user.uid,
        nama: nama.trim(),
        email: emailNormalized,
        role: roles,
        createdAt: serverTimestamp(),
      });

      alert(`Pengguna ${nama} berhasil didaftarkan dengan ${roles.length} role!`);

      setFormData(INITIAL_FORM);
      await ambilDaftarUser();
    } catch (error: any) {
      console.error("Gagal menambahkan user:", error);
      if (error.code === "auth/email-already-in-use") {
        alert("Email ini sudah terdaftar di Firebase Authentication!");
      } else {
        alert(`Gagal membuat akun: ${error.message}`);
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  // 3. Ubah Role User dari Daftar List Real-time
  const handleToggleExistingUserRole = async (
    userEmail: string,
    currentRoles: string[],
    targetRole: string
  ) => {
    let updatedRoles: string[];

    if (currentRoles.includes(targetRole)) {
      if (currentRoles.length === 1) {
        alert("Pengguna harus memiliki minimal 1 role!");
        return;
      }
      updatedRoles = currentRoles.filter((r) => r !== targetRole);
    } else {
      updatedRoles = [...currentRoles, targetRole];
    }

    try {
      const userRef = doc(db, "users", userEmail);
      await updateDoc(userRef, { role: updatedRoles });

      setUsersList((prev) =>
        prev.map((u) => (u.email === userEmail ? { ...u, role: updatedRoles } : u))
      );
    } catch (error) {
      console.error("Gagal mengubah role:", error);
      alert("Gagal memperbarui role user.");
    }
  };

  // 4. Hapus User
  const handleHapusUser = async (userEmail: string, namaUser: string) => {
    if (userEmail === currentUserEmail) {
      alert("Anda tidak bisa menghapus akun Anda sendiri yang sedang login!");
      return;
    }

    const konfirmasi = window.confirm(
      `Apakah Anda yakin ingin menghapus hak akses Firestore untuk:\n"${namaUser}" (${userEmail})?`
    );
    if (konfirmasi) {
      try {
        await deleteDoc(doc(db, "users", userEmail));
        alert("Akses pengguna berhasil dihapus dari database!");
        await ambilDaftarUser();
      } catch (error) {
        console.error("Gagal menghapus user:", error);
        alert("Gagal menghapus user.");
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return {
    currentUserEmail,
    usersList,
    loadingAuth,
    loadingFetch,
    loadingSubmit,
    formData,
    setFormData,
    handleToggleRoleForm,
    handleTambahUser,
    handleToggleExistingUserRole,
    handleHapusUser,
    handleLogout,
  };
}