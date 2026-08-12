"use client";

import React from "react";
import { Pendaftar } from "@/types/ppdb";
import { formatTanggalIndo } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Sparkles, Award, Pencil, Trash2, Printer } from "lucide-react";

interface Props {
  data: Pendaftar[];
  onUbahStatus: (id: string, status: "Diterima" | "Ditolak") => void;
  onOpenEdit: (p: Pendaftar) => void;
  onOpenDelete: (p: Pendaftar) => void;
  onPrintIndividu: (p: Pendaftar) => void;
}

export function PPDBMobileList({
  data,
  onUbahStatus,
  onOpenEdit,
  onOpenDelete,
  onPrintIndividu,
}: Props) {
  return (
    <div className="grid gap-4 sm:hidden print:hidden">
      {data.map((p) => {
        const tesBW = p.tes?.butaWarna;
        const tesJur = p.tes?.jurusan;

        return (
          <div key={p.id} className="p-4 rounded-2xl border bg-card shadow-sm space-y-3">
            {/* Header Mobile */}
            <div className="flex items-center justify-between border-b pb-2.5">
              <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200/50">
                {p.noRegistrasi || "-"}
              </span>
              <div>
                {p.statusPendaftaran === "Diterima" && (
                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200">
                    Diterima
                  </span>
                )}
                {p.statusPendaftaran === "Ditolak" && (
                  <span className="rounded-full bg-red-100 dark:bg-red-950/30 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:text-red-400 border border-red-200">
                    Ditolak
                  </span>
                )}
                {(!p.statusPendaftaran || p.statusPendaftaran === "Menunggu Verifikasi") && (
                  <span className="rounded-full bg-amber-100 dark:bg-amber-950/30 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-500 border border-amber-200">
                    Pending
                  </span>
                )}
              </div>
            </div>

            {/* Nama & NISN */}
            <div>
              <h3 className="font-bold text-sm text-foreground">{p.namaLengkap}</h3>
              <p className="text-xs text-muted-foreground font-mono">NISN: {p.nisn}</p>
            </div>

            {/* Detail Utama */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px]">WAKTU DAFTAR</span>
                <span className="font-medium">{formatTanggalIndo(p.createdAt)}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">ASAL SEKOLAH</span>
                <span className="font-medium">{p.asalSekolah}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">PILIHAN JURUSAN</span>
                <span className="font-semibold text-primary">{p.pilihanJurusan}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">KONTAK WA</span>
                <a
                  href={`https://wa.me/${p.whatsapp ? p.whatsapp.replace(/^0/, "62") : ""}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline font-medium"
                >
                  {p.whatsapp}
                </a>
              </div>
            </div>

            {/* Program & Ekskul */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                <span className="text-muted-foreground text-[11px]">Program:</span>
                <span className="font-semibold text-foreground">{p.programUnggulan || "Belum Memilih"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span className="text-muted-foreground text-[11px]">Ekskul:</span>
                <span className="font-semibold text-foreground">{p.ekstrakurikuler || "Belum Memilih"}</span>
              </div>
            </div>

            {/* Hasil Tes */}
            <div className="pt-2 border-t flex items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px]">TES BUTA WARNA</span>
                {tesBW ? (
                  <span className={`font-semibold px-1.5 py-0.5 rounded text-[10px] ${tesBW.status === "Normal" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {tesBW.status} ({tesBW.skor}/{tesBW.totalSoal})
                  </span>
                ) : (
                  <span className="italic text-muted-foreground text-[11px]">Belum Tes</span>
                )}
              </div>
              <div className="text-right">
                <span className="text-muted-foreground block text-[10px]">REKOMENDASI TES</span>
                {tesJur ? (
                  <span className="font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px]">
                    {tesJur.rekomendasi}
                  </span>
                ) : (
                  <span className="italic text-muted-foreground text-[11px]">Belum Tes</span>
                )}
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="pt-2 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUbahStatus(p.id, "Diterima")}
                  disabled={p.statusPendaftaran === "Diterima"}
                  className="flex-1 text-emerald-600 hover:text-white hover:bg-emerald-600 border-emerald-200 h-8 text-xs"
                >
                  Terima
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUbahStatus(p.id, "Ditolak")}
                  disabled={p.statusPendaftaran === "Ditolak"}
                  className="flex-1 text-destructive hover:text-white hover:bg-destructive h-8 text-xs"
                >
                  Tolak
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onOpenEdit(p)}
                  className="flex-1 border-slate-300 h-8 text-xs text-blue-600 hover:bg-blue-50"
                >
                  <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onOpenDelete(p)}
                  className="flex-1 border-red-200 h-8 text-xs text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Hapus
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onPrintIndividu(p)}
                  className="h-8 text-xs px-3"
                >
                  <Printer className="h-3.5 w-3.5 mr-1" /> Bukti
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}