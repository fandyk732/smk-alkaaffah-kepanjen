"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Calendar, AlertCircle } from "lucide-react";
import { getGelombangAktif } from "@/services/gelombangService";
import { GelombangSPMB } from "@/types/gelombang";

export function BannerGelombang() {
  const [gelombangAktif, setGelombangAktif] = useState<GelombangSPMB | null>(null);
  const [loadingGelombang, setLoadingGelombang] = useState(true);
  const formatTanggalIndo = (tanggal: string) => {
  const date = new Date(tanggal);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

  useEffect(() => {
    const fetchGelombang = async () => {
      try {
        const data = await getGelombangAktif();
        setGelombangAktif(data);
      } catch (err) {
        console.error("Gagal load gelombang aktif:", err);
      } finally {
        setLoadingGelombang(false);
      }
    };

    fetchGelombang();
  }, []);

  if (loadingGelombang) {
    return <div className="mb-6 h-16 w-full animate-pulse rounded-2xl bg-muted" />;
  }

  if (!gelombangAktif) {
    return (
      <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-600 dark:text-red-400 flex items-center gap-2 text-xs font-semibold">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>Pendaftaran saat ini sedang ditutup atau belum ada gelombang aktif.</span>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Sparkles className="h-5 w-5 text-amber-500 shrink-0" />
          <div>
            <p className="text-xs font-semibold opacity-80">Periode Pendaftaran Berjalan:</p>
            <h4 className="text-sm font-bold text-amber-600 dark:text-amber-400">
              {gelombangAktif.namaGelombang}
            </h4>
          </div>
        </div>
        <div className="text-right text-xs opacity-80 hidden sm:block">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatTanggalIndo(gelombangAktif.tanggalMulai)} s/d {formatTanggalIndo(gelombangAktif.tanggalSelesai)}</span>
          </div>
        </div>
      </div>

      {gelombangAktif.keterangan && (
        <p className="mt-2 text-xs border-t border-amber-500/20 pt-2 italic">
          💡 Promo / Benefit: {gelombangAktif.keterangan}
        </p>
      )}
    </div>
  );
}