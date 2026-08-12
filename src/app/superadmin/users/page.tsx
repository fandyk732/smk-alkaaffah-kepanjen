"use client";

import React from "react";
import { useSuperadminUsers } from "@/hooks/useSuperadminUsers";
import { UserAdminHeader } from "@/components/admin/users/UserAdminHeader";
import { UserAdminForm } from "@/components/admin/users/UserAdminForm";
import { UserAdminList } from "@/components/admin/users/UserAdminList";
import { Loader2 } from "lucide-react";

export default function SuperadminUsersPage() {
  const {
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
  } = useSuperadminUsers();

  if (loadingAuth) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-28 pb-20 px-4 sm:px-6 lg:px-8 [color-scheme:light]">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* HEADER BAR */}
        <UserAdminHeader onLogout={handleLogout} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* FORM TAMBAH USER */}
          <UserAdminForm
            formData={formData}
            setFormData={setFormData}
            loadingSubmit={loadingSubmit}
            onToggleRole={handleToggleRoleForm}
            onSubmit={handleTambahUser}
          />

          {/* DAFTAR USER & ROLE */}
          <UserAdminList
            usersList={usersList}
            loadingFetch={loadingFetch}
            currentUserEmail={currentUserEmail}
            onToggleUserRole={handleToggleExistingUserRole}
            onDeleteUser={handleHapusUser}
          />

        </div>

      </div>
    </div>
  );
}