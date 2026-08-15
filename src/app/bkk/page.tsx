"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Briefcase, Building2, MapPin, Calendar, ArrowRight, Loader2, X } from "lucide-react";
import { ApplyModal } from "@/components/bkk/apply-modal";

interface Vacancy {
  id: string;
  title: string;
  company: string;
  location: string;
  targetJurusan: string[];
  description: string;
  deadline: string;
  status: string;
  posters?: string[]; // 🟢 Ditambahkan agar support array gambar
}

export default function BkkPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);

  // State untuk kontrol Modal Pelamar
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State untuk Preview Perbesar Gambar (Lightbox)
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const q = query(
          collection(db, "vacancies"),
          where("status", "==", "active"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const list: Vacancy[] = [];

        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Vacancy);
        });

        setVacancies(list);
      } catch (error) {
        console.error("Gagal mengambil daftar lowongan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVacancies();
  }, []);

  // Handler Buka Modal
  const handleApplyClick = (vacancy: Vacancy) => {
    setSelectedVacancy(vacancy);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-secondary/10 py-12 pt-24">
      <div className="container-page max-w-6xl mx-auto px-4">
        
        {/* HEADER SECTION */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Bursa Kerja Khusus (BKK)
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1 sm:text-4xl">
            Lowongan Kerja Mitra Industri
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Temukan peluang karir dan kesempatan kerja eksklusif khusus untuk lulusan & alumni SMK Al Kaaffah.
          </p>
        </div>

        {/* DAFTAR LOWONGAN */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : vacancies.length === 0 ? (
          <div className="text-center py-16 border border-dashed rounded-2xl bg-card">
            <Briefcase className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Saat ini belum ada lowongan kerja aktif yang dibuka.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {vacancies.map((item) => (
              <div
                key={item.id}
                className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 overflow-hidden"
              >
                <div className="space-y-3">
                  {/* 🖼️ GAMBAR / POSTER LOWONGAN */}
                  {item.posters && item.posters.length > 0 && (
                    <div className="w-full overflow-hidden rounded-xl bg-secondary/30 border border-border/50">
                      {item.posters.length === 1 ? (
                        /* 1 Gambar */
                        <div
                          onClick={() => setActiveImage(item.posters![0])}
                          className="cursor-pointer group relative overflow-hidden"
                        >
                          <img
                            src={item.posters[0]}
                            alt={item.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        </div>
                      ) : (
                        /* Multi Gambar (Grid) */
                        <div className="grid grid-cols-2 gap-1 p-1">
                          {item.posters.slice(0, 2).map((imgUrl, idx) => (
                            <div
                              key={idx}
                              onClick={() => setActiveImage(imgUrl)}
                              className="relative cursor-pointer group overflow-hidden rounded-lg"
                            >
                              <img
                                src={imgUrl}
                                alt={`${item.title} ${idx + 1}`}
                                className="w-full h-32 object-cover group-hover:scale-105 transition duration-300"
                              />
                              {idx === 1 && item.posters!.length > 2 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold backdrop-blur-[2px]">
                                  +{item.posters!.length - 2} Gambar Lainnya
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-bold text-lg leading-tight text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-xs font-medium text-muted-foreground flex items-center gap-1 mt-1">
                        <Building2 className="h-3.5 w-3.5 text-primary" /> {item.company}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Aktif
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1 bg-secondary/50 px-2.5 py-1 rounded-lg">
                      <MapPin className="h-3.5 w-3.5" /> {item.location || "Malang & Sekitarnya"}
                    </span>
                    <span className="flex items-center gap-1 bg-secondary/50 px-2.5 py-1 rounded-lg">
                      <Calendar className="h-3.5 w-3.5" /> Batas: {item.deadline || "TBA"}
                    </span>
                  </div>

                  {/* Badges Target Jurusan */}
                  {item.targetJurusan && item.targetJurusan.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[11px] font-medium text-muted-foreground">Jurusan:</span>
                      {item.targetJurusan.map((j) => (
                        <span key={j} className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                          {j}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground line-clamp-3 pt-2 border-t">
                    {item.description}
                  </p>
                </div>

                {/* 🚀 TOMBOL TRIGER MODAL APPLY */}
                <button
                  onClick={() => handleApplyClick(item)}
                  className="w-full mt-2 py-2.5 px-4 bg-primary text-primary-foreground font-semibold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-sm"
                >
                  Lamar Sekarang <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 🚀 MODAL PELAMAR */}
        {selectedVacancy && (
          <ApplyModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            vacancy={{
              id: selectedVacancy.id,
              title: selectedVacancy.title,
              company: selectedVacancy.company,
            }}
          />
        )}

        {/* 🔍 MODAL PERBESAR GAMBAR (LIGHTBOX) */}
        {activeImage && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActiveImage(null)}
          >
            <div className="relative max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl">
              <button
                onClick={() => setActiveImage(null)}
                className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full hover:bg-black/80 transition"
              >
                <X className="h-5 w-5" />
              </button>
              <img
                src={activeImage}
                alt="Poster Detail"
                className="max-h-[85vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        )}

      </div>
    </main>
  );
}