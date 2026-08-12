"use client";

import React from "react";
import { UserPlus, User as UserIcon, Mail, KeyRound, Check, Loader2 } from "lucide-react";
import { UserFormState, AVAILABLE_ROLES } from "@/types/userAdmin";

interface Props {
  formData: UserFormState;
  setFormData: React.Dispatch<React.SetStateAction<UserFormState>>;
  loadingSubmit: boolean;
  onToggleRole: (roleId: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function UserAdminForm({
  formData,
  setFormData,
  loadingSubmit,
  onToggleRole,
  onSubmit,
}: Props) {
  return (
    <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm h-fit">
      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
        <UserPlus className="h-5 w-5 text-blue-600" /> Tambah Akun Baru
      </h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Nama Lengkap Guru / Staf
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              required
              placeholder="mis: Bpk. Ahmad, S.Pd"
              value={formData.nama}
              onChange={(e) => setFormData((prev) => ({ ...prev, nama: e.target.value }))}
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Email Akun (Native / Custom)
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="email"
              required
              placeholder="guru@smkalkaaffah.sch.id"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Password Akun (Min. 6 Karakter)
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* MULTI-SELECT ROLE CHECKBOXES */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">
            Hak Akses / Role (Bisa pilih lebih dari 1)
          </label>
          <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80 max-h-64 overflow-y-auto">
            {AVAILABLE_ROLES.map((r) => {
              const isChecked = formData.roles.includes(r.id);
              return (
                <div
                  key={r.id}
                  onClick={() => onToggleRole(r.id)}
                  className={`flex items-center justify-between p-2 rounded-lg border text-xs font-medium cursor-pointer transition select-none ${
                    isChecked
                      ? "bg-blue-50 border-blue-300 text-blue-900"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span>{r.label}</span>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border ${
                      isChecked ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300"
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={loadingSubmit}
          className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition flex justify-center items-center gap-2"
        >
          {loadingSubmit ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <UserPlus className="h-4 w-4" /> Daftarkan Akun
            </>
          )}
        </button>
      </form>
    </div>
  );
}