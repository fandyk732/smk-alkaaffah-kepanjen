"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import { Users, GraduationCap, Clock, XCircle, Award, Sparkles } from "lucide-react";

export interface PendaftarSpmb {
  id: string;
  namaLengkap: string;
  jurusanPilihan: string;
  statusSeleksi: "diterima" | "proses" | "ditolak";
  ekstrakurikuler?: string;
  programUnggulan?: string;
}

interface SpmbStatsChartProps {
  dataPendaftar: PendaftarSpmb[];
}

// Palette warna chart yang ramah Dark & Light mode
const COLOR_PALETTE = ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#06b6d4"];

const COLOR_STATUS = {
  diterima: "#22c55e", // Green
  proses: "#f59e0b",   // Amber
  ditolak: "#ef4444",   // Red
};

export const SpmbStatsChart: React.FC<SpmbStatsChartProps> = ({ dataPendaftar }) => {
  // 1. Kalkulasi KPI Ringkasan
  const summary = useMemo(() => {
    const total = dataPendaftar.length;
    const diterima = dataPendaftar.filter((d) => d.statusSeleksi === "diterima").length;
    const proses = dataPendaftar.filter((d) => d.statusSeleksi === "proses").length;
    const ditolak = dataPendaftar.filter((d) => d.statusSeleksi === "ditolak").length;
    return { total, diterima, proses, ditolak };
  }, [dataPendaftar]);

  // 2. Format Data Chart Jurusan (Dynamic Support untuk Nama Panjang / Pendek)
  const dataJurusan = useMemo(() => {
    const counts: Record<string, number> = {};
    dataPendaftar.forEach((item) => {
      const j = item.jurusanPilihan?.trim() || "Belum Pilih";
      counts[j] = (counts[j] || 0) + 1;
    });

    return Object.keys(counts).map((key, index) => ({
      name: key,
      total: counts[key],
      fill: COLOR_PALETTE[index % COLOR_PALETTE.length],
    }));
  }, [dataPendaftar]);

  // 3. Format Data Chart Status Seleksi
  const dataStatus = useMemo(() => {
    return [
      { name: "Diterima", value: summary.diterima, color: COLOR_STATUS.diterima },
      { name: "Dalam Proses", value: summary.proses, color: COLOR_STATUS.proses },
      { name: "Ditolak / Batal", value: summary.ditolak, color: COLOR_STATUS.ditolak },
    ].filter((item) => item.value > 0);
  }, [summary]);

  // 4. Format Data Ekstrakurikuler Terfavorit
  const dataEkskul = useMemo(() => {
    const counts: Record<string, number> = {};
    dataPendaftar.forEach((item) => {
      if (item.ekstrakurikuler && item.ekstrakurikuler.trim() !== "" && item.ekstrakurikuler !== "-") {
        const eks = item.ekstrakurikuler.trim();
        counts[eks] = (counts[eks] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [dataPendaftar]);

// 5. Format Data Program Unggulan Terfavorit
  const dataProgramUnggulan = useMemo(() => {
    const counts: Record<string, number> = {};
    dataPendaftar.forEach((item) => {
      if (item.programUnggulan && item.programUnggulan.trim() !== "" && item.programUnggulan !== "-") {
        const prog = item.programUnggulan.trim();
        counts[prog] = (counts[prog] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [dataPendaftar]);

  return (
    <div className="space-y-6">
      {/* 🟢 KPI METRIC CARDS - MENDUKUNG DARK MODE & LIGHT MODE */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Total Pendaftar */}
        <div className="rounded-2xl border bg-card p-5 text-card-foreground shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Total Pendaftar</span>
            <div className="rounded-xl bg-blue-500/10 p-2 text-blue-500">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold">{summary.total}</p>
          <span className="text-[11px] text-muted-foreground">Siswa Terdaftar</span>
        </div>

        {/* Diterima */}
        <div className="rounded-2xl border bg-card p-5 text-card-foreground shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Diterima</span>
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-emerald-500">{summary.diterima}</p>
          <span className="text-[11px] text-muted-foreground">
            {summary.total ? Math.round((summary.diterima / summary.total) * 100) : 0}% Kelulusan
          </span>
        </div>

        {/* Dalam Proses */}
        <div className="rounded-2xl border bg-card p-5 text-card-foreground shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Proses Seleksi</span>
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-500">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-amber-500">{summary.proses}</p>
          <span className="text-[11px] text-muted-foreground">Menunggu Verifikasi</span>
        </div>

        {/* Ditolak */}
        <div className="rounded-2xl border bg-card p-5 text-card-foreground shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Ditolak / Batal</span>
            <div className="rounded-xl bg-red-500/10 p-2 text-red-500">
              <XCircle className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-red-500">{summary.ditolak}</p>
          <span className="text-[11px] text-muted-foreground">Tidak Memenuhi</span>
        </div>
      </div>

      {/* 📊 GRAFIK STATISTIK GRID */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* 1. Bar Chart: Pendaftar Per Jurusan */}
        <div className="rounded-2xl border bg-card p-6 text-card-foreground shadow-xs lg:col-span-7 transition-colors">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold">Peminatan Jurusan</h3>
              <p className="text-xs text-muted-foreground">Jumlah pendaftar berdasarkan kompetensi keahlian</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataJurusan} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                <XAxis 
                  dataKey="name" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fontSize: 10, fill: "currentColor" }}
                  interval={0}
                  angle={-10}
                  textAnchor="end"
                  className="text-muted-foreground"
                />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "currentColor" }} allowDecimals={false} className="text-muted-foreground" />
                <Tooltip
                  cursor={{ fill: "rgba(150, 150, 150, 0.1)" }}
                  contentStyle={{ 
                    backgroundColor: "var(--card)", 
                    borderColor: "var(--border)", 
                    borderRadius: "12px",
                    color: "var(--card-foreground)"
                  }}
                />
                <Bar dataKey="total" radius={[8, 8, 0, 0]} barSize={36}>
                  {dataJurusan.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Donut Chart: Persentase Status Seleksi */}
        <div className="rounded-2xl border bg-card p-6 text-card-foreground shadow-xs lg:col-span-5 flex flex-col justify-between transition-colors">
          <div>
            <h3 className="text-base font-bold">Status Seleksi</h3>
            <p className="text-xs text-muted-foreground">Persentase kelulusan berkas & tes</p>
          </div>

          <div className="h-56 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {dataStatus.map((entry, index) => (
                    <Cell key={`cell-status-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: "var(--card)", 
                    borderColor: "var(--border)", 
                    borderRadius: "12px",
                    color: "var(--card-foreground)"
                  }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 🏆 BOTTOM SECTION: GRID 2 KOLOM (EKSKUL & PROGRAM UNGGULAN) */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* KOLOM KIRI: MINAT EKSTRAKURIKULER */}
        <div className="rounded-2xl border bg-card p-6 text-card-foreground shadow-xs transition-colors">
          <div className="mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-500" />
            <h3 className="text-base font-bold">Minat Ekstrakurikuler Terbanyak</h3>
          </div>
          {dataEkskul.length > 0 ? (
            <div className="grid gap-2.5 sm:grid-cols-2">
              {dataEkskul.map((ekskul, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-xl bg-muted/50 p-3 border">
                  <span className="text-xs font-semibold">{ekskul.name}</span>
                  <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-bold text-indigo-500">
                    {ekskul.total}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground py-4 text-center">Belum ada data ekstrakurikuler</p>
          )}
        </div>

        {/* KOLOM KANAN: PROGRAM UNGGULAN TERFAVORIT */}
        <div className="rounded-2xl border bg-card p-6 text-card-foreground shadow-xs transition-colors">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <h3 className="text-base font-bold">Program Unggulan Terfavorit</h3>
          </div>
          {dataProgramUnggulan.length > 0 ? (
            <div className="grid gap-2.5 sm:grid-cols-2">
              {dataProgramUnggulan.map((prog, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-xl bg-muted/50 p-3 border">
                  <span className="text-xs font-semibold">{prog.name}</span>
                  <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-bold text-indigo-500">
                    {prog.total}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground py-4 text-center">Belum ada data program unggulan</p>
          )}
        </div>
      </div>
    </div>
  );
};