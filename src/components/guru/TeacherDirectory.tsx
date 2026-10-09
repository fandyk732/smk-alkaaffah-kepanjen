"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Search, GraduationCap, Briefcase, Users, Quote, ShieldCheck } from "lucide-react";

interface Teacher {
  id: string;
  name: string;
  role: string;
  type: string;
  quote?: string;
  photoUrl?: string;
}

const TYPE_LABELS: Record<string, string> = {
  pimpinan_kepsek: "Kepala Sekolah",
  pimpinan_wakepsek: "Wakil Kepala Sekolah",
  produktif: "Guru Produktif",
  normatif_adaptif: "Guru Umum",
  staf: "Staf & Tendik",
};

export function TeacherDirectory() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  useEffect(() => {
    const q = query(collection(db, "teachers"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Teacher[];
        setTeachers(docs);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching teachers:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filter berdasarkan nama/jabatan dan tipe/kategori
  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedType === "all" ||
      (selectedType === "pimpinan" && t.type?.startsWith("pimpinan_")) ||
      t.type === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8">
      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl border border-border shadow-xs">
        {/* Input Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama atau jabatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground transition"
          />
        </div>

        {/* Tab Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {[
            { id: "all", label: "Semua", icon: Users },
            { id: "pimpinan", label: "Pimpinan", icon: ShieldCheck },
            { id: "produktif", label: "Guru Kejuruan", icon: GraduationCap },
            { id: "normatif_adaptif", label: "Guru Umum", icon: Briefcase },
            { id: "staf", label: "Staf / Tendik", icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = selectedType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* CARD GRID DISPLAY */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-muted/40 animate-pulse border border-border"
            />
          ))}
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-card">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium text-foreground">
            Tidak ada data guru atau staf ditemukan.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Coba ganti kata kunci pencarian atau kategori filter.
          </p>
        </div>
      ) : (
        /* 🟢 GRID OPTIMIZED: 5 Kolom di Layar Besar */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-card border border-border p-3 shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-300"
            >
              <div>
                {/* Photo Container (Square Aspect) */}
                <div className="relative mb-3 overflow-hidden rounded-xl aspect-square bg-muted/30">
                  {teacher.photoUrl ? (
                    <img
                      src={teacher.photoUrl}
                      alt={teacher.name}
                      className="w-full h-full object-cover object-top contrast-[1.03] group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center bg-primary/10 text-primary font-bold text-2xl">
                      {teacher.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Badge Tipe */}
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-background/80 backdrop-blur-md text-foreground border border-border shadow-2xs">
                    {TYPE_LABELS[teacher.type] || teacher.type}
                  </span>
                </div>

                {/* Name & Role */}
                <div className="space-y-1 px-0.5 text-left">
                  <h3 className="font-bold text-xs sm:text-sm text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {teacher.name}
                  </h3>
                  <p className="text-[11px] text-muted-foreground font-medium leading-tight line-clamp-2">
                    {teacher.role}
                  </p>
                </div>
              </div>

              {/* Quote / Motto */}
              {teacher.quote && (
                <div className="mt-2.5 pt-2 border-t border-border/60 flex items-start gap-1.5 text-[10px] italic text-muted-foreground px-0.5">
                  <Quote className="h-3 w-3 text-primary shrink-0 rotate-180 opacity-70 mt-0.5" />
                  <p className="line-clamp-2 leading-tight">{teacher.quote}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}