"use client";

import React from "react";
import { Pendaftar } from "@/types/ppdb";
import { formatTanggalIndo } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Calendar, Sparkles, Award, Eye, Compass, Pencil, Trash2, Printer } from "lucide-react";

interface Props {
  data: Pendaftar[];
  onUbahStatus: (id: string, status: "Diterima" | "Ditolak") => void;
  onOpenEdit: (p: Pendaftar) => void;
  onOpenDelete: (p: Pendaftar) => void;
  onPrintIndividu: (p: Pendaftar) => void;
}

export function PPDBDesktopTable({
  data,
  onUbahStatus,
  onOpenEdit,
  onOpenDelete,
  onPrintIndividu,
}: Props) {
  return (
    <div className="hidden sm:block overflow-x-auto rounded-2xl border bg-card shadow-sm print:block print:border-none print:shadow-none">
      <table className="w-full text-xs text-left">
        <thead className="bg-slate-100 dark:bg-slate-900 uppercase font-semibold text-muted-foreground border-b print:bg-transparent print:text-black">
          <tr>
            <th className="px-3 py-3.5">No. Registrasi</th>
            <th className="px-3 py-3.5">Waktu / NISN</th>
            <th className="px-3 py-3.5">Nama & Sekolah</th>
            <th className="px-3 py-3.5">Jurusan Utama</th>
            <th className="px-3 py-3.5">Program & Ekskul</th>
            <th className="px-3 py-3.5">Kontak WA</th>
            <th className="px-3 py-3.5">Hasil Tes</th>
            <th className="px-3 py-3.5">Status</th>
            <th className="px-3 py-3.5 text-center print:hidden sticky right-0 bg-slate-100 dark:bg-slate-900 shadow-l">
              Aksi & Berkas
            </th>
          </tr>
        </thead>
        <tbody className="divide-y print:divide-y-2">
          {data.map((p) => {
            const tesBW = p.tes?.butaWarna;
            const tesJur = p.tes?.jurusan;

            return (
              <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition print:hover:bg-transparent">
                <td className="px-3 py-3 whitespace-nowrap">
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded border border-emerald-200/50 print:bg-transparent print:border-none print:p-0 print:text-black">
                    {p.noRegistrasi || "-"}
                  </span>
                </td>

                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium print:text-black">
                    <Calendar className="h-3 w-3 shrink-0 print:hidden text-slate-400" />
                    <span>{formatTanggalIndo(p.createdAt)}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono print:text-black mt-0.5">
                    NISN: {p.nisn}
                  </p>
                </td>

                <td className="px-3 py-3">
                  <p className="font-bold text-xs print:text-black">{p.namaLengkap}</p>
                  <p className="text-[11px] text-muted-foreground font-medium print:text-black">{p.asalSekolah}</p>
                </td>

                <td className="px-3 py-3 whitespace-nowrap">
                  <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-800 dark:text-slate-100 border print:border-none print:bg-transparent print:p-0 print:text-black">
                    {p.pilihanJurusan}
                  </span>
                </td>

                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-[11px]">
                      <Sparkles className="h-3 w-3 text-purple-600 print:hidden shrink-0" />
                      <span className="font-medium text-slate-700 dark:text-slate-300 print:text-black">
                        {p.programUnggulan || "Belum Memilih"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px]">
                      <Award className="h-3 w-3 text-amber-600 print:hidden shrink-0" />
                      <span className="text-muted-foreground print:text-black">
                        {p.ekstrakurikuler || "Belum Memilih"}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-3 py-3 whitespace-nowrap">
                  <a
                    href={`https://wa.me/${p.whatsapp ? p.whatsapp.replace(/^0/, "62") : ""}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline font-medium text-xs print:text-black print:no-underline"
                  >
                    {p.whatsapp}
                  </a>
                </td>

                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="space-y-1">
                    {tesBW ? (
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3 text-cyan-600 print:hidden" />
                        <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${
                          tesBW.status === "Normal"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400"
                        }`}>
                          BW: {tesBW.status} ({tesBW.skor}/{tesBW.totalSoal})
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic block">BW: Belum Tes</span>
                    )}

                    {tesJur ? (
                      <div className="flex items-center gap-1">
                        <Compass className="h-3 w-3 text-indigo-600 print:hidden" />
                        <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 px-1.5 py-0.2 rounded">
                          Rek: {tesJur.rekomendasi}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic block">Rek: Belum Tes</span>
                    )}
                  </div>
                </td>

                <td className="px-3 py-3 whitespace-nowrap">
                  {p.statusPendaftaran === "Diterima" && (
                    <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-950/30 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 print:text-black print:border-none">
                      Diterima
                    </span>
                  )}
                  {p.statusPendaftaran === "Ditolak" && (
                    <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-950/30 px-2 py-0.5 text-[11px] font-semibold text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900 print:text-black print:border-none">
                      Ditolak
                    </span>
                  )}
                  {(!p.statusPendaftaran || p.statusPendaftaran === "Menunggu Verifikasi") && (
                    <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-950/30 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-500 border border-amber-200 dark:border-amber-900 print:text-black print:border-none">
                      Pending
                    </span>
                  )}
                </td>

                <td className="px-3 py-3 print:hidden whitespace-nowrap sticky right-0 bg-card shadow-l">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUbahStatus(p.id, "Diterima")}
                      disabled={p.statusPendaftaran === "Diterima"}
                      className="text-emerald-600 hover:text-white hover:bg-emerald-600 border-emerald-200 dark:border-emerald-900 h-7 px-2 text-[11px]"
                    >
                      Terima
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUbahStatus(p.id, "Ditolak")}
                      disabled={p.statusPendaftaran === "Ditolak"}
                      className="text-destructive hover:text-white hover:bg-destructive h-7 px-2 text-[11px]"
                    >
                      Tolak
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onOpenEdit(p)}
                      className="h-7 px-2 text-[11px] text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950"
                      title="Edit Data Pendaftar"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onOpenDelete(p)}
                      className="h-7 px-2 text-[11px] text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950"
                      title="Hapus Pendaftar"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>

                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onPrintIndividu(p)}
                      className="h-7 px-2 text-[11px]"
                      title="Cetak Bukti"
                    >
                      <Printer className="h-3 w-3 mr-1" /> Bukti
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}