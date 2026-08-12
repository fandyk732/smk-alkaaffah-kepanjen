"use client";

import React from "react";
import { Pendaftar } from "@/types/ppdb";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";

interface Props {
  pendaftar: Pendaftar | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export function DeleteConfirmModal({ pendaftar, onClose, onConfirm, isDeleting }: Props) {
  if (!pendaftar) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm print:hidden">
      <div className="bg-card w-full max-w-sm rounded-2xl border shadow-xl overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200 text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center mx-auto">
          <Trash2 className="h-6 w-6" />
        </div>

        <div className="space-y-1">
          <h2 className="text-lg font-bold">Hapus Data Pendaftar?</h2>
          <p className="text-xs text-muted-foreground">
            Apakah Anda yakin ingin menghapus data <strong className="text-foreground">{pendaftar.namaLengkap}</strong> (NISN: {pendaftar.nisn})? Action ini tidak dapat dibatalkan.
          </p>
        </div>

        <div className="flex justify-center gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isDeleting} className="w-full">
            Batal
          </Button>
          <Button variant="destructive" size="sm" onClick={onConfirm} disabled={isDeleting} className="w-full gap-1.5">
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Menghapus...
              </>
            ) : (
              "Ya, Hapus"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}