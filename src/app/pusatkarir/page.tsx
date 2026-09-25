'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Sparkles, ExternalLink, Loader2, ArrowUpRight, MapPin, Building2 } from 'lucide-react';

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

const SUPABASE_URL = "https://uytuckdnmkmqlkctwvnx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5dHVja2RubWttcWxrY3R3dm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2NDg1OTUsImV4cCI6MjEwNTIyNDU5NX0.UbHX51sbKQTjYhGuw8GP-qXODqGnD9xGbYBmiAtTe1s"; // Gantilah dengan Anon Key Supabase
const BKK_APP_URL = "https://bkk.smkalkaaffah.sch.id/";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function PusatKarirPage(): React.ReactElement {
  const [jobs, setJobs] = useState<LowonganKerja[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchJobs = async (): Promise<void> => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('lowongan_kerja')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) throw error;
        setJobs(data as LowonganKerja[]);
      } catch (err) {
        console.error('Gagal mengambil data BKK:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 font-sans">
      
      {/* Header Section */}
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

        {/* CTA Portal BKK */}
        <a 
          href={BKK_APP_URL} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-blue-500/25 active:scale-95 w-fit whitespace-nowrap"
        >
          Portal Utama BKK <ExternalLink size={15} />
        </a>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16 gap-3 text-slate-500 dark:text-slate-400 font-semibold text-sm">
          <Loader2 size={20} className="animate-spin text-blue-600 dark:text-blue-400" />
          <span>Memuat lowongan kerja terbaru...</span>
        </div>
      )}

      {/* Bento Grid Lowker */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-slate-600 dark:text-slate-400 font-semibold text-sm">Belum ada lowongan aktif saat ini.</p>
            </div>
          ) : (
            jobs.map((job) => {
              const majorsArray: string[] = Array.isArray(job.majors)
                ? job.majors
                : typeof job.majors === 'string'
                ? [job.majors]
                : ['Semua Jurusan'];

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
                    {/* Header Card (Logo + Company + Type Badge) */}
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

                      {/* Badge PKL / Kerja */}
                      <span className={`text-xs font-black px-2.5 py-1 rounded-lg border whitespace-nowrap shadow-sm ${
                        job.type === 'PKL' 
                          ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700/50' 
                          : 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-700/50'
                      }`}>
                        {job.type}
                      </span>
                    </div>

                    {/* Tag Jurusan & Lokasi */}
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

                  {/* Footer Card */}
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
  );
}