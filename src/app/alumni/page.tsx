"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Briefcase, GraduationCap as CollegeIcon, Rocket, Search, Quote } from "lucide-react";
import { SectionHeading, Reveal } from "@/components/motion-primitives";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

interface Alumni {
  id: string;
  nama: string;
  angkatan: string;
  jurusan: string;
  status: "Bekerja" | "Kuliah" | "Wirausaha";
  tempat: string;
  posisi: string;
  testimoni: string;
  fotoUrl?: string;
}

export default function AlumniPage() {
  const [alumniList, setAlumniList] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Semua");

  useEffect(() => {
    const ambilAlumni = async () => {
      try {
        const q = query(collection(db, "alumni"), orderBy("angkatan", "desc"));
        const querySnapshot = await getDocs(q);
        const list: Alumni[] = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Alumni);
        });
        setAlumniList(list);
      } catch (error) {
        console.error("Gagal mengambil data alumni:", error);
      } finally {
        setLoading(false);
      }
    };
    ambilAlumni();
  }, []);

  // Handler Filter & Search Logic
  const filteredAlumni = alumniList.filter((alumni) => {
    const matchesSearch = alumni.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          alumni.tempat.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "Semua" || alumni.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    if (status === "Bekerja") return <Briefcase className="h-4 w-4 text-blue-500" />;
    if (status === "Kuliah") return <CollegeIcon className="h-4 w-4 text-emerald-500" />;
    return <Rocket className="h-4 w-4 text-amber-500" />;
  };

  return (
    <div className="py-6 sm:py-10">
      {/* HEADER SECTION */}
      <section className="container-page py-8">
        <SectionHeading 
          eyebrow="Tracer Study & Direktori" 
          title="Kisah Sukses Alumni SMK Al Kaaffah" 
          description="Bukti nyata dedikasi kami mencetak lulusan unggul yang terserap di dunia industri, melanjutkan ke perguruan tinggi, dan sukses berwirausaha."
          align="center"
        />

        {/* SEARCH & FILTER BAR */}
        <div className="mt-10 flex flex-col md:flex-row gap-4 items-center justify-between border bg-card/80 backdrop-blur-sm p-4 rounded-2xl shadow-soft">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Cari nama atau tempat..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary/50 rounded-xl pl-9 pr-4 py-2 text-sm border focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {["Semua", "Bekerja", "Kuliah", "Wirausaha"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeFilter === f 
                    ? "bg-gradient-primary text-white shadow-sm" 
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CARDS LIST SECTION */}
      <section className="container-page pb-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredAlumni.length === 0 ? (
          <div className="text-center py-20 border rounded-2xl bg-card/50 backdrop-blur-sm">
            <p className="text-muted-foreground">Data alumni tidak ditemukan.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAlumni.map((alumni, i) => (
              <Reveal key={alumni.id} delay={i * 0.05}>
                <div className="h-full border bg-card/90 backdrop-blur-sm rounded-2xl p-6 shadow-soft flex flex-col justify-between group hover:shadow-elegant transition-all">
                  <div>
                    <div className="flex items-center gap-4">
                      <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-primary text-white text-lg font-bold overflow-hidden shrink-0">
                        {alumni.fotoUrl ? (
                          <img src={alumni.fotoUrl} alt={alumni.nama} className="h-full w-full object-cover" />
                        ) : (
                          alumni.nama.charAt(0)
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground leading-snug">{alumni.nama}</h3>
                        <p className="text-xs text-muted-foreground">Angkatan {alumni.angkatan} • {alumni.jurusan}</p>
                      </div>
                    </div>

                    <div className="mt-4 inline-flex items-center gap-1.5 bg-secondary/60 rounded-lg px-2.5 py-1 text-xs font-medium">
                      {getStatusIcon(alumni.status)}
                      <span>{alumni.status}: <strong className="text-foreground">{alumni.tempat}</strong></span>
                    </div>

                    {alumni.posisi && (
                      <p className="text-xs text-muted-foreground mt-1.5 pl-1">Sebagai: <span className="font-medium text-foreground">{alumni.posisi}</span></p>
                    )}

                    {alumni.testimoni && (
                      <div className="mt-4 relative bg-secondary/30 rounded-xl p-3 border border-dashed">
                        <Quote className="h-4 w-4 text-primary/20 absolute right-2 top-2" />
                        <p className="text-xs italic text-muted-foreground line-clamp-3">"{alumni.testimoni}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}