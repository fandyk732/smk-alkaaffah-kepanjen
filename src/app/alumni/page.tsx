"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  GraduationCap as CollegeIcon, 
  Rocket, 
  Search, 
  Quote, 
  Sparkles, 
  ArrowRight,
  UserCheck
} from "lucide-react";
import { SectionHeading, Reveal } from "@/components/motion-primitives";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

interface Alumni {
  id: string;
  nama: string;
  angkatan: string;
  jurusan: string;
  status: "Bekerja" | "Kuliah" | "Wirausaha" | string;
  tempat: string;
  posisi: string;
  testimoni: string;
  fotoUrl?: string;
}

function AlumniCard({ 
  alumni, 
  i, 
  getStatusIcon 
}: { 
  alumni: Alumni; 
  i: number; 
  getStatusIcon: (status: string) => React.ReactNode 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongTestimoni = alumni.testimoni && alumni.testimoni.length > 130;

  return (
    <Reveal delay={i * 0.05}>
      {/* 🚀 responsive padding: p-4 di HP, p-6 di Layar Besar */}
      <div className="w-full h-full border bg-card/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-soft flex flex-col justify-between group hover:shadow-elegant transition-all overflow-hidden">
        
        {/* BAGIAN ATAS: PROFIL ALUMNI */}
        <div className="space-y-3.5 w-full min-w-0">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full bg-gradient-primary text-white text-base sm:text-lg font-bold overflow-hidden shrink-0">
              {alumni.fotoUrl ? (
                <img src={alumni.fotoUrl} alt={alumni.nama} className="h-full w-full object-cover" />
              ) : (
                alumni.nama.charAt(0).toUpperCase()
              )}
            </div>
            {/* 🚀 min-w-0 cegah nama panjang bikin melebar */}
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-foreground text-sm sm:text-base leading-snug break-words">
                {alumni.nama}
              </h3>
              <p className="text-[11px] sm:text-xs text-muted-foreground truncate">
                Angkatan {alumni.angkatan} • {alumni.jurusan}
              </p>
            </div>
          </div>

          {/* 🚀 Badge Status yang flexible di HP */}
          <div className="flex items-center gap-1.5 bg-secondary/60 rounded-xl px-2.5 py-1.5 text-xs font-medium w-full min-w-0">
            <div className="shrink-0">{getStatusIcon(alumni.status)}</div>
            <p className="truncate text-[11px] sm:text-xs text-muted-foreground">
              {alumni.status}: <strong className="text-foreground">{alumni.tempat}</strong>
            </p>
          </div>

          {alumni.posisi && alumni.posisi !== "-" && (
            <p className="text-[11px] sm:text-xs text-muted-foreground pl-1 truncate">
              Sebagai: <span className="font-medium text-foreground">{alumni.posisi}</span>
            </p>
          )}
        </div>

        {/* BAGIAN BANYAK QUOTES / TESTIMONI */}
        {alumni.testimoni && alumni.testimoni !== "-" && (
          <blockquote className="mt-4 relative bg-secondary/40 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-dashed border-primary/20 flex flex-col justify-between w-full min-w-0">
            <Quote className="h-4 w-4 sm:h-5 sm:w-5 text-primary/30 absolute right-2.5 top-2.5 select-none pointer-events-none" />
            
            <p
              className={`text-[11px] sm:text-xs italic text-muted-foreground leading-relaxed pr-5 break-words transition-all ${
                !isExpanded ? "line-clamp-3" : ""
              }`}
            >
              "{alumni.testimoni}"
            </p>

            {isLongTestimoni && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-[10px] sm:text-[11px] font-bold text-primary hover:underline text-left self-start"
              >
                {isExpanded ? "← Sembunyikan" : "Baca Selengkapnya..."}
              </button>
            )}
          </blockquote>
        )}

      </div>
    </Reveal>
  );
}

// 🌐 KOMPONEN UTAMA HALAMAN ALUMNI
export default function AlumniPage() {
  const [alumniList, setAlumniList] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Semua");

  useEffect(() => {
    const ambilAlumni = async () => {
      try {
        const q = query(collection(db, "alumni"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const list: Alumni[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();

          const mappedStatus = () => {
            const rawStatus = data.status || data.statusAlumni || "";
            if (rawStatus === "kerja" || rawStatus === "Bekerja") return "Bekerja";
            if (rawStatus === "kuliah" || rawStatus === "Kuliah") return "Kuliah";
            if (rawStatus === "kerja_kuliah") return "Kerja & Kuliah";
            if (rawStatus === "wirausaha" || rawStatus === "Wirausaha") return "Wirausaha";
            return "Mencari Kerja";
          };

          list.push({
            id: doc.id,
            nama: data.nama || data.namaLengkap || "Alumni SMK",
            angkatan: data.angkatan || data.tahunLulus?.toString() || "-",
            jurusan: data.jurusan || "-",
            status: mappedStatus(),
            tempat: data.tempat || data.namaInstansi || "-",
            posisi: data.posisi || data.jabatanJurusan || "-",
            testimoni: data.testimoni || data.kesanPesan || "",
            fotoUrl: data.fotoUrl || "",
          });
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

  const filteredAlumni = alumniList.filter((alumni) => {
    const matchesSearch =
      alumni.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumni.tempat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumni.jurusan.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === "Semua" ||
      (activeFilter === "Bekerja" && (alumni.status === "Bekerja" || alumni.status === "Kerja & Kuliah")) ||
      (activeFilter === "Kuliah" && (alumni.status === "Kuliah" || alumni.status === "Kerja & Kuliah")) ||
      alumni.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    if (status.includes("Bekerja") || status.includes("Kerja")) return <Briefcase className="h-4 w-4 text-blue-500" />;
    if (status.includes("Kuliah")) return <CollegeIcon className="h-4 w-4 text-emerald-500" />;
    if (status.includes("Wirausaha")) return <Rocket className="h-4 w-4 text-amber-500" />;
    return <UserCheck className="h-4 w-4 text-purple-500" />;
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

        {/* BANNER / BUTTON CTA KE TRACER STUDY & BKK */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/tracer-study"
            className="group relative inline-flex items-center gap-3 rounded-2xl bg-gradient-primary px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="h-5 w-5 animate-pulse text-amber-300" />
            <span>Kamu Alumni? Isi Data Kamu di Sini</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/bkk"
            className="group relative inline-flex items-center gap-3 rounded-2xl bg-secondary hover:bg-secondary/80 border border-border px-6 py-3.5 text-sm font-bold text-foreground shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Briefcase className="h-5 w-5 text-primary" />
            <span>Cek Lowongan Kerja BKK</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="mt-10 flex flex-col gap-4 items-center justify-between border bg-card/80 backdrop-blur-sm p-4 rounded-2xl shadow-soft md:flex-row">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari nama, tempat, atau jurusan..."
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
      <section className="container-page px-4 sm:px-6 pb-16 w-full overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredAlumni.length === 0 ? (
          <div className="text-center py-20 border rounded-2xl bg-card/50 backdrop-blur-sm">
            <p className="text-muted-foreground">Belum ada data alumni yang ditemukan.</p>
            <Link
              href="/tracer-study"
              className="mt-4 inline-block text-xs font-bold text-primary hover:underline"
            >
              Jadilah alumni pertama yang mengisi pendataan →
            </Link>
          </div>
        ) : (
          /* 🎯 Grid responsive: 1 kolom di HP (gap-4), 2 kolom di tablet, 3 kolom di desktop (gap-6) */
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start w-full">
            {filteredAlumni.map((alumni, i) => (
              <AlumniCard
                key={alumni.id}
                alumni={alumni}
                i={i}
                getStatusIcon={getStatusIcon}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}