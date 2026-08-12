"use client";

import React from "react";
import { Users, Briefcase, GraduationCap, Rocket, SearchCheck } from "lucide-react";

interface Props {
  stats: {
    total: number;
    bekerja: number;
    kuliah: number;
    wirausaha: number;
    seeking: number;
  };
}

export function AlumniStats({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      <div className="bg-card border p-4 rounded-2xl shadow-sm flex items-center gap-3">
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-muted-foreground">Total Alumni</p>
          <p className="text-lg font-black">{stats.total}</p>
        </div>
      </div>

      <div className="bg-card border p-4 rounded-2xl shadow-sm flex items-center gap-3">
        <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
          <Briefcase className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-muted-foreground">Bekerja</p>
          <p className="text-lg font-black text-sky-600">{stats.bekerja}</p>
        </div>
      </div>

      <div className="bg-card border p-4 rounded-2xl shadow-sm flex items-center gap-3">
        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-muted-foreground">Kuliah</p>
          <p className="text-lg font-black text-emerald-600">{stats.kuliah}</p>
        </div>
      </div>

      <div className="bg-card border p-4 rounded-2xl shadow-sm flex items-center gap-3">
        <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
          <Rocket className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-muted-foreground">Wirausaha</p>
          <p className="text-lg font-black text-amber-600">{stats.wirausaha}</p>
        </div>
      </div>

      <div className="bg-card border p-4 rounded-2xl shadow-sm flex items-center gap-3 col-span-2 lg:col-span-1">
        <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
          <SearchCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-muted-foreground">Mencari Kerja</p>
          <p className="text-lg font-black text-rose-600">{stats.seeking}</p>
        </div>
      </div>
    </div>
  );
}