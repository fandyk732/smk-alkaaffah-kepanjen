"use client";

import React from "react";
import { Users, CheckCircle2, Trash2, Check, Loader2 } from "lucide-react";
import { UserData, AVAILABLE_ROLES } from "@/types/userAdmin";

interface Props {
  usersList: UserData[];
  loadingFetch: boolean;
  currentUserEmail: string;
  onToggleUserRole: (userEmail: string, currentRoles: string[], targetRole: string) => Promise<void>;
  onDeleteUser: (userEmail: string, namaUser: string) => Promise<void>;
}

export function UserAdminList({
  usersList,
  loadingFetch,
  currentUserEmail,
  onToggleUserRole,
  onDeleteUser,
}: Props) {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" /> Daftar Pengguna ({usersList.length})
        </h2>
      </div>

      {loadingFetch ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : usersList.length === 0 ? (
        <p className="text-center py-8 text-slate-400 text-sm">Belum ada data user terdaftar.</p>
      ) : (
        <div className="divide-y divide-slate-100">
          {usersList.map((item) => (
            <div key={item.id} className="py-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-800 text-sm">{item.nama}</h4>
                  {item.email === currentUserEmail && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Anda
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-mono">{item.email}</p>
              </div>

              {/* MULTI ROLE BADGES / TOGGLES PER USER */}
              <div className="flex flex-wrap items-center gap-1.5 max-w-xs md:justify-end">
                {AVAILABLE_ROLES.map((r) => {
                  const hasRole = item.role.includes(r.id);
                  const isSelf = item.email === currentUserEmail;

                  return (
                    <button
                      key={r.id}
                      disabled={isSelf}
                      onClick={() => onToggleUserRole(item.email, item.role, r.id)}
                      title={
                        isSelf
                          ? "Anda tidak bisa merubah role Anda sendiri"
                          : `Klik untuk ${hasRole ? "mencabut" : "memberikan"} role ${r.label}`
                      }
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border transition flex items-center gap-1 ${
                        hasRole
                          ? r.id === "superadmin"
                            ? "bg-purple-100 text-purple-800 border-purple-300"
                            : "bg-blue-100 text-blue-800 border-blue-300"
                          : "bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300"
                      } ${isSelf ? "cursor-not-allowed opacity-80" : "cursor-pointer"}`}
                    >
                      <span>{r.id.replace(/_/g, " ").toUpperCase()}</span>
                      {hasRole && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                  );
                })}

                {/* Tombol Hapus */}
                <button
                  onClick={() => onDeleteUser(item.email, item.nama)}
                  disabled={item.email === currentUserEmail}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-30 ml-2"
                  title="Hapus Hak Akses"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}