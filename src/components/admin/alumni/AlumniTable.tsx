"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  GraduationCap,
  Rocket,
  SearchCheck,
  Trash2,
  ShieldAlert,
  Loader2,
  Search,
  Filter,
  MessageSquare,
} from "lucide-react";
import { Alumni } from "@/types/alumni";

interface Props {
  alumniList: Alumni[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  filterJurusan: string;
  setFilterJurusan: (v: string) => void;
  filterStatus: string;
  setFilterStatus: (v: string) => void;
  onDelete: (id: string, nama: string) => void;
}

export function AlumniTable({
  alumniList,
  loading,
  searchQuery,
  setSearchQuery,
  filterJurusan,
  setFilterJurusan,
  filterStatus,
  setFilterStatus,
  onDelete,
}: Props) {
  return (
    <div className="bg-card border p-6 rounded-2xl shadow-sm lg:col-span-2 space-y-4">
      {/* Header & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Direktori Alumni ({alumniList.length})
        </h2>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari Nama, Instansi, Angkatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border bg-background text-xs outline-none focus:border-primary transition"
          />
        </div>
      </div>

      {/* Filter Dropdown */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="relative">
          <Filter className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <select
            value={filterJurusan}
            onChange={(e) => setFilterJurusan(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border bg-background text-xs outline-none focus:border-primary transition appearance-none"
          >
            <option value="Semua">Semua Jurusan</option>
            <option value="TKJ">TKJ</option>
            <option value="TAV">TAV</option>
            <option value="TKR">TKR</option>
            <option value="DM">Digital Marketing</option>
          </select>
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border bg-background text-xs outline-none focus:border-primary transition appearance-none"
          >
            <option value="Semua">Semua Status</option>
            <option value="Bekerja">Bekerja</option>
            <option value="Kuliah">Kuliah</option>
            <option value="Wirausaha">Wirausaha</option>
            <option value="Mencari Kerja">Mencari Kerja</option>
          </select>
        </div>
      </div>

      {/* Content Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : alumniList.length === 0 ? (
        <div className="text-center py-20 border border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground text-sm">
          <ShieldAlert className="h-8 w-8 text-muted-foreground/50 mb-2" />
          Tidak ada data alumni yang cocok.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border mt-2">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b text-muted-foreground font-semibold text-xs bg-secondary/30">
                <th className="p-3">Nama & Angkatan</th>
                <th className="p-3">Jurusan</th>
                <th className="p-3">Status / Tempat</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {alumniList.map((item) => (
                <tr key={item.id} className="hover:bg-secondary/10 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-foreground">{item.nama}</div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                      <span>Angkatan {item.angkatan}</span>
                      {item.whatsapp && item.whatsapp !== "-" && (
                        <a
                          href={`https://wa.me/${item.whatsapp.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-600 hover:underline flex items-center gap-0.5"
                        >
                          <MessageSquare className="h-3 w-3" /> WA
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="p-3 font-medium text-xs text-muted-foreground">{item.jurusan}</td>
                  <td className="p-3">
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold mb-1 ${
                        item.status === "Bekerja"
                          ? "bg-sky-50 text-sky-700 border border-sky-200"
                          : item.status === "Kuliah"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : item.status === "Wirausaha"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {item.status === "Bekerja" && <Briefcase className="h-3 w-3 text-sky-500" />}
                      {item.status === "Kuliah" && <GraduationCap className="h-3 w-3 text-emerald-500" />}
                      {item.status === "Wirausaha" && <Rocket className="h-3 w-3 text-amber-500" />}
                      {item.status === "Mencari Kerja" && <SearchCheck className="h-3 w-3 text-rose-500" />}
                      {item.status}
                    </div>
                    <div className="text-xs font-medium text-muted-foreground max-w-[180px] truncate">
                      {item.tempat}
                    </div>
                    {item.posisi && item.posisi !== "-" && (
                      <div className="text-[11px] italic text-muted-foreground">{item.posisi}</div>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(item.id, item.nama)}
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}