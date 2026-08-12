"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, LogOut } from "lucide-react";

interface Props {
  onLogout: () => Promise<void>;
}

export function UserAdminHeader({ onLogout }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
      <div>
        <div className="flex items-center gap-2">
          <Link href="/admin/dashboard" className="text-slate-400 hover:text-slate-600 transition">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-blue-600" /> Superadmin Portal
          </h1>
        </div>
        <p className="text-slate-500 text-sm mt-1">
          Kelola daftar akun guru dan kombinasi hak akses/role administrator.
        </p>
      </div>

      <button
        onClick={onLogout}
        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition self-start md:self-auto"
      >
        <LogOut className="h-3.5 w-3.5" /> Keluar
      </button>
    </div>
  );
}