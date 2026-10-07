"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { AdminTeachersClient } from "@/components/admin/AdminTeachersClient";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminGuruPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        if (isMounted) router.push("/login");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.email || ""));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const rawRoles = Array.isArray(data.role) ? data.role : [data.role];
          const roles = rawRoles.map((r: string) => String(r).toLowerCase().trim());

          if (roles.includes("superadmin") || roles.includes("admin_guru")) {
            if (isMounted) setAuthorized(true);
          } else {
            alert("Anda tidak memiliki hak akses ke modul Direktori Guru.");
            if (isMounted) router.push("/admin/dashboard");
          }
        } else {
          if (isMounted) router.push("/login");
        }
      } catch (err) {
        console.error("Error Auth check:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background text-foreground transition-colors duration-200">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-medium animate-pulse">
            Memverifikasi Hak Akses...
          </p>
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <Link
            href="/admin/dashboard"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
          </Link>
          <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 font-medium shadow-xs">
            Modul Direktori Guru & Staf
          </span>
        </div>

        {/* Client Component CRUD */}
        <AdminTeachersClient />

      </div>
    </div>
  );
}