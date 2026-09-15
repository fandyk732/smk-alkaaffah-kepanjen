"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Calendar, AlertCircle, Gift, CheckCircle2 } from "lucide-react";
import { getGelombangAktif } from "@/services/gelombangService";
import { GelombangSPMB } from "@/types/gelombang";

export function BannerGelombang() {
  const [gelombangAktif, setGelombangAktif] = useState<GelombangSPMB | null>(null);
  const [loadingGelombang, setLoadingGelombang] = useState(true);

  const formatTanggalIndo = (tanggal: string) => {
    if (!tanggal) return "";
    const date = new Date(tanggal);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  // 🎯 HELPER SMART SPLITTER: Memecah teks benefit bertingkat (1., 2., 3. atau newline atau koma)
  const parseBenefits = (text: string): string[] => {
    if (!text) return [];
    
    // Jika teks ada penomoran angka (contoh: "1. Promo A 2. Promo B" atau "1) Promo A 2) Promo B")
    if (/\d+[\.\)]/.test(text)) {
      return text
        .split(/\d+[\.\)]/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }
    
    // Jika dipisah enter/line break
    if (text.includes("\n")) {
      return text
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }

    // Default: Jika dipisah koma atau titik koma
    if (text.includes(";") || text.includes(",")) {
      return text
        .split(/[;,]/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }

    return [text.trim()];
  };

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
    return <div className="mb-8 h-32 w-full animate-pulse rounded-2xl bg-muted border" />;
  }

  if (!gelombangAktif) {
    return (
      <div className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-700 dark:text-red-300 flex items-center gap-3 text-sm font-semibold shadow-sm">
        <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
        <span>Pendaftaran saat ini sedang ditutup atau belum ada gelombang aktif.</span>
      </div>
    );
  }

  const benefits = parseBenefits(gelombangAktif.keterangan || "");

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border-2 border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-orange-500/15 p-6 shadow-md backdrop-blur-sm dark:border-amber-500/30 dark:bg-amber-950/40">
      {/* Decorative Blur Background Element */}
      <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

      {/* HEADER GELOMBANG & TANGGAL */}
      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Sisi Kiri: Ikon & Nama Gelombang */}
        <div className="flex items-start gap-3.5 sm:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-amber-950 shadow-md shadow-amber-500/20 dark:bg-amber-400">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-amber-900 dark:bg-amber-400/20 dark:text-amber-300">
                Pendaftaran Berjalan
              </span>
            </div>
            <h3 className="mt-1 text-xl font-black tracking-tight text-amber-950 dark:text-amber-100 sm:text-2xl">
              {gelombangAktif.namaGelombang}
            </h3>
          </div>
        </div>

        {/* Sisi Kanan: Tanggal Pendaftaran */}
        <div className="flex shrink-0 items-center gap-2 rounded-xl border border-amber-500/30 bg-background/80 px-4 py-2.5 text-xs font-bold text-amber-950 shadow-sm backdrop-blur-md dark:border-amber-500/20 dark:bg-amber-950/80 dark:text-amber-200 sm:text-sm">
          <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            {formatTanggalIndo(gelombangAktif.tanggalMulai)} — {formatTanggalIndo(gelombangAktif.tanggalSelesai)}
          </span>
        </div>
      </div>

      {/* 🚀 PROMO / BENEFIT LIST GRID (SANGAT RAPI BERBENTUK BADGE CARD) */}
      {benefits.length > 0 && (
        <div className="relative z-10 mt-5 border-t border-amber-500/20 pt-4">
          <div className="mb-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
            <Gift className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Promo & Special Benefit Pendaftar:</span>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-2.5 rounded-xl border border-amber-500/25 bg-background/90 p-3 text-xs font-semibold text-amber-950 shadow-xs dark:border-amber-500/20 dark:bg-amber-950/60 dark:text-amber-100 sm:text-sm"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span className="leading-snug">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}