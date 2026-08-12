"use client";

import React from "react";
import { Vacancy, Application } from "@/types/bkk";
import { getSafeCvUrl, formatWaNumber } from "@/utils/bkkHelpers";
import { Users, X, Loader2, GraduationCap, Mail, Phone, MessageCircle, FileText, ExternalLink } from "lucide-react";

interface Props {
  isOpen: boolean;
  vacancy: Vacancy | null;
  applications: Application[];
  loading: boolean;
  onClose: () => void;
}

export function ApplicantsModal({ isOpen, vacancy, applications, loading, onClose }: Props) {
  if (!isOpen || !vacancy) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-400" /> Daftar Pelamar Kerja
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Posisi: <span className="text-indigo-300 font-semibold">{vacancy.title}</span> - {vacancy.company}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Belum ada pelamar yang terdaftar untuk posisi ini.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs text-slate-400 font-medium">
                Total Pelamar: <strong className="text-white">{applications.length} orang</strong>
              </div>

              <div className="divide-y divide-slate-800 bg-slate-950/50 rounded-xl border border-slate-800 overflow-hidden">
                {applications.map((app, index) => {
                  const namaPelamar =
                    app.nama ||
                    app.fullName ||
                    app.namaLengkap ||
                    app.name ||
                    "Pelamar Tanpa Nama";

                  const rawPhone = app.whatsapp || app.phone || app.noHp || "";
                  const formattedWa = formatWaNumber(rawPhone);

                  const rawCvUrl =
                    app.linkCv ||
                    app.cvLink ||
                    app.cvUrl ||
                    app.cv ||
                    app.fileCv ||
                    app.resumeUrl ||
                    app.driveCvLink ||
                    app.driveLink ||
                    app.link ||
                    "";

                  const safeCvUrl = getSafeCvUrl(rawCvUrl);

                  return (
                    <div
                      key={app.id || index}
                      className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/30 transition"
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-sm text-white">{namaPelamar}</h4>
                          {app.tahunLulus && (
                            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-medium">
                              Lulus {app.tahunLulus}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                          {app.jurusan && (
                            <span className="flex items-center gap-1">
                              <GraduationCap className="h-3.5 w-3.5 text-indigo-400" /> Jurusan: {app.jurusan}
                            </span>
                          )}
                          {app.email && app.email !== "-" && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3.5 w-3.5 text-slate-500" /> {app.email}
                            </span>
                          )}
                          {rawPhone && (
                            <span className="flex items-center gap-1 font-mono text-slate-300">
                              <Phone className="h-3.5 w-3.5 text-slate-500" /> {rawPhone}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0">
                        {formattedWa ? (
                          <a
                            href={`https://wa.me/${formattedWa}?text=${encodeURIComponent(
                              `Halo ${namaPelamar}, kami dari Tim BKK terkait lamaran Anda untuk posisi *${vacancy.title}* di *${vacancy.company}*.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                          >
                            <MessageCircle className="h-3.5 w-3.5" /> Chat WA
                          </a>
                        ) : null}

                        {safeCvUrl ? (
                          <a
                            href={safeCvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                          >
                            <FileText className="h-3.5 w-3.5" /> Buka CV <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-500 italic bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                            {rawCvUrl ? "Link CV Tidak Sesuai" : "CV tidak ada"}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}