'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Sparkles, ExternalLink, Loader2, ArrowUpRight, MapPin, Building2, ChevronRight, X, Building, Mail, Globe, Calendar } from 'lucide-react';

interface LowonganKerja {
  id: string;
  created_at: string;
  title: string;
  company: string;
  company_logo?: string | null;
  type: 'PKL' | 'Kerja' | 'Keduanya' | string;
  majors: string[] | string;
  location?: string | null;
  quota?: number | null;
  quota_used?: number | null;
  is_active: boolean;
}

interface MitraIndustri {
  id: string;
  nama: string;
  logo?: string | null;
  sektor?: string | null;
  lokasi?: string | null;
  jurusan: string[] | string;
  deskripsi?: string | null;
  status?: string | null;
  website?: string | null;
  program_kemitraan?: string[] | string | null;
  jobdesk_overview?: string | null;
  kualifikasi_umum?: string | null;
  fasilitas_benefit?: string | null;
}

const SUPABASE_URL = "https://uytuckdnmkmqlkctwvnx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5dHVja2RubWttcWxrY3R3dm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2NDg1OTUsImV4cCI6MjEwNTIyNDU5NX0.UbHX51sbKQTjYhGuw8GP-qXODqGnD9xGbYBmiAtTe1s";
const BKK_APP_URL = "https://bkk.smkalkaaffah.sch.id/";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function PusatKarirPage(): React.ReactElement {
  const [jobs, setJobs] = useState<LowonganKerja[]>([]);
  const [mitraList, setMitraList] = useState<MitraIndustri[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMajor, setSelectedMajor] = useState<string>("Semua");

  // 🟢 State Pop-up Detail Mitra
  const [selectedMitra, setSelectedMitra] = useState<MitraIndustri | null>(null);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setLoading(true);

        // 1. Fetch Lowongan Kerja
        const { data: dataJobs, error: errorJobs } = await supabase
          .from('lowongan_kerja')
          .select('*')
          .eq('is_active', true)
          .eq('is_approved', true)
          .order('created_at', { ascending: false })
          .limit(6);

        if (errorJobs) throw errorJobs;
        setJobs(dataJobs as LowonganKerja[]);

        // 2. Fetch Mitra Industri Realtime dari Supabase
        const { data: dataMitra, error: errorMitra } = await supabase
          .from('mitra_industri')
          .select('*')
          .eq('status', 'Aktif')
          .order('created_at', { ascending: false });

        if (errorMitra) throw errorMitra;
        setMitraList(dataMitra as MitraIndustri[]);

      } catch (err) {
        console.error('Gagal mengambil data Pusat Karir:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper untuk memparsing field jurusan
  const parseJurusan = (jurusanData: string[] | string): string[] => {
    if (Array.isArray(jurusanData)) return jurusanData;
    if (typeof jurusanData === 'string') {
      try {
        const parsed = JSON.parse(jurusanData);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return [jurusanData];
      }
    }
    return [];
  };

  // Filter Mitra berdasarkan Jurusan
  const filteredMitra = mitraList.filter((m) => {
    if (selectedMajor === "Semua") return true;
    const listJurusan = parseJurusan(m.jurusan);
    return listJurusan.some((j) => j.toUpperCase() === selectedMajor.toUpperCase());
  });

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 font-sans space-y-12">
      
      {/* SECTION 1: LOWONGAN KERJA & PKL (BKK) */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-blue-600/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-300 border border-blue-600/20 dark:border-blue-400/20 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Sparkles size={14} className="text-blue-600 dark:text-blue-400" /> Bursa Kerja Khusus (BKK)
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Peluang Karir & PKL
            </h1>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
              Lowongan kerja dan tempat PKL terintegrasi realtime untuk siswa & alumni.
            </p>
          </div>

          <a 
            href={BKK_APP_URL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-blue-500/25 active:scale-95 w-fit whitespace-nowrap"
          >
            Portal Utama BKK <ExternalLink size={15} />
          </a>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16 gap-3 text-slate-500 dark:text-slate-400 font-semibold text-sm">
            <Loader2 size={20} className="animate-spin text-blue-600 dark:text-blue-400" />
            <span>Memuat data lowongan...</span>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                <p className="text-slate-600 dark:text-slate-400 font-semibold text-sm">Belum ada lowongan aktif saat ini.</p>
              </div>
            ) : (
              jobs.map((job) => {
                const majorsArray = parseJurusan(job.majors);
                const remainingQuota = (job.quota || 0) - (job.quota_used || 0);

                return (
                  <a
                    key={job.id}
                    href={BKK_APP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative bg-white dark:bg-slate-900/80 hover:dark:bg-slate-800/90 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          {job.company_logo ? (
                            <img 
                              src={job.company_logo} 
                              alt={job.company} 
                              className="w-11 h-11 object-contain rounded-xl bg-slate-50 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700" 
                            />
                          ) : (
                            <div className="w-11 h-11 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold rounded-xl flex items-center justify-center text-sm border border-blue-200 dark:border-blue-800">
                              <Building2 size={20} />
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider line-clamp-1">
                              {job.company}
                            </p>
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                              {job.title}
                            </h3>
                          </div>
                        </div>

                        <span className={`text-xs font-black px-2.5 py-1 rounded-lg border whitespace-nowrap shadow-sm ${
                          job.type === 'PKL' 
                            ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700/50' 
                            : 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-700/50'
                        }`}>
                          {job.type}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 mb-5">
                        {majorsArray.map((m, idx) => (
                          <span key={idx} className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60">
                            {m}
                          </span>
                        ))}
                        {job.location && (
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 ml-1">
                            <MapPin size={12} className="text-slate-400 dark:text-slate-500" /> {job.location}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                      <span>
                        Kuota: <strong className="text-slate-900 dark:text-white font-extrabold">{remainingQuota > 0 ? `${remainingQuota} slot` : 'Penuh'}</strong>
                      </span>
                      <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-extrabold group-hover:translate-x-1 transition-transform">
                        Lihat Detail <ArrowUpRight size={15} />
                      </span>
                    </div>
                  </a>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* SECTION 2: MITRA INDUSTRI (DU DI) */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Mitra Industri
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              {filteredMitra.length} perusahaan mitra aktif
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-full border border-slate-200/80 dark:border-slate-800 w-fit">
            {["Semua", "TKJ", "TAV", "TKR"].map((major) => (
              <button
                key={major}
                onClick={() => setSelectedMajor(major)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedMajor === major
                    ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {major}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredMitra.length === 0 ? (
            <div className="col-span-full text-center py-10 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
                Tidak ada mitra industri untuk jurusan {selectedMajor}.
              </p>
            </div>
          ) : (
            filteredMitra.map((mitra) => {
              const listJurusan = parseJurusan(mitra.jurusan);

              return (
                <div
                  key={mitra.id}
                  onClick={() => setSelectedMitra(mitra)}
                  className="group bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md hover:border-blue-500/50 transition-all cursor-pointer"
                >
                  <div>
                    {/* Header Mitra */}
                    <div className="flex items-start gap-3.5 mb-3">
                      {mitra.logo ? (
                        <img
                          src={mitra.logo}
                          alt={mitra.nama}
                          className="w-12 h-12 object-contain rounded-full border border-slate-200 dark:border-slate-700 p-1 shrink-0 bg-white"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center border shrink-0">
                          {mitra.nama.charAt(0)}
                        </div>
                      )}

                      <div>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {mitra.nama}
                        </h3>
                        {mitra.lokasi && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium mt-0.5">
                            <MapPin size={13} className="text-slate-400 shrink-0" />
                            {mitra.lokasi}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Badges Sektor & Jurusan */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {mitra.sektor && (
                        <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/60 px-2.5 py-0.5 rounded-full">
                          {mitra.sektor}
                        </span>
                      )}
                      {listJurusan.map((j, idx) => (
                        <span key={idx} className="text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md">
                          {j}
                        </span>
                      ))}
                    </div>

                    {/* Deskripsi Singkat */}
                    {mitra.deskripsi && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {mitra.deskripsi}
                      </p>
                    )}
                  </div>

                  {/* Footer Action */}
                  <div className="pt-2 flex justify-end">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                      Lihat Detail <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* 🟢 MODAL POP-UP DETAIL MITRA INDUSTRI */}
      {selectedMitra && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol Close */}
            <button
              onClick={() => setSelectedMitra(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition"
            >
              <X size={18} />
            </button>

            {/* Header Modal */}
            <div className="flex items-start gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              {selectedMitra.logo ? (
                <img
                  src={selectedMitra.logo}
                  alt={selectedMitra.nama}
                  className="w-16 h-16 object-contain rounded-2xl border border-slate-200 dark:border-slate-700 p-2 bg-white shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-extrabold text-2xl flex items-center justify-center border border-blue-200 shrink-0">
                  {selectedMitra.nama.charAt(0)}
                </div>
              )}

              <div className="space-y-1 pr-6">
                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                  {selectedMitra.nama}
                </h3>
                {selectedMitra.lokasi && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                    <MapPin size={14} className="text-slate-400 shrink-0" />
                    {selectedMitra.lokasi}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {selectedMitra.sektor && (
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/60 px-2.5 py-0.5 rounded-full">
                      {selectedMitra.sektor}
                    </span>
                  )}
                  {parseJurusan(selectedMitra.jurusan).map((j, idx) => (
                    <span key={idx} className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md">
                      Jurusan {j}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Deskripsi Perusahaan */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Tentang Perusahaan
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {selectedMitra.deskripsi || "Belum ada deskripsi profil untuk perusahaan ini."}
              </p>
            </div>

            {/* Link Website Jika Ada */}
            {selectedMitra.website && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <a
                  href={selectedMitra.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Globe size={14} /> Kunjungi Website Resmi Perusahaan / Kampus
                </a>
                <button
                  onClick={() => setSelectedMitra(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200 transition"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}