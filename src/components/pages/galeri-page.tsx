"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHero } from "@/components/page-hero";
import { galleryItems } from "@/data/site";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

const categories = ["Semua", "Fasilitas", "Kegiatan", "Prestasi", "Ekstrakurikuler", "Event"];

interface GalleryItemType {
  title: string;
  category: string;
  image: string;
}

export function GaleriPage() {
  const [cat, setCat] = useState("Semua");
  const [firestoreItems, setFirestoreItems] = useState<GalleryItemType[]>([]);
  const [loading, setLoading] = useState(true);

  // State Lightbox Modal
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  // Ambil Data Dynamic dari Firestore
  useEffect(() => {
    const fetchGaleri = async () => {
      try {
        const q = query(collection(db, "galeri"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const list: GalleryItemType[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          list.push({
            title: data.judul,
            category: data.kategori,
            image: data.imageUrl,
          });
        });
        setFirestoreItems(list);
      } catch (err) {
        console.error("Gagal mengambil galeri dari Firestore:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGaleri();
  }, []);

  // Gabungkan Data Firestore (Di Atas) + Data Static Bawaan (Di Bawah)
  const combinedItems = useMemo(() => {
    return [...firestoreItems, ...galleryItems];
  }, [firestoreItems]);

  // Filter Berdasarkan Kategori
  const items = useMemo(() => {
    return combinedItems.filter((g) => {
      if (cat === "Semua") return true;
      if (cat === "Kegiatan" && g.category === "Event") return true;
      return g.category === cat;
    });
  }, [combinedItems, cat]);

  // Reset modal jika kategori diganti
  useEffect(() => {
    setSelectedIndex(null);
  }, [cat]);

  const closeModal = useCallback(() => setSelectedIndex(null), []);

  const showPrev = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === null ? null : (prev - 1 + items.length) % items.length
    );
  }, [items.length]);

  const showNext = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === null ? null : (prev + 1) % items.length
    );
  }, [items.length]);

  // Keyboard Navigation & Scroll Lock saat Lightbox aktif
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedIndex, closeModal, showPrev, showNext]);

  // Handler Touch Swipe Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;

    if (diff > 50) showNext();
    if (diff < -50) showPrev();

    touchStartX.current = null;
  };

  const activeItem = selectedIndex !== null ? items[selectedIndex] : null;

  return (
    <>
      <PageHero 
        eyebrow="Galeri" 
        title="Momen & dokumentasi sekolah" 
        description="Lihat berbagai kegiatan, fasilitas, dan prestasi membanggakan kami." 
      />

      <section className="container-page py-8">
        {/* FILTER CATEGORY BUTTONS */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                cat === c 
                  ? "bg-gradient-primary text-primary-foreground shadow-sm" 
                  : "bg-secondary text-secondary-foreground hover:bg-primary/10"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-sm">
            Tidak ada foto pada kategori ini.
          </div>
        ) : (
          /* MASONRY GRID LAYOUT */
          <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {items.map((g, i) => (
              <motion.figure
                key={`${g.title}-${i}`}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (i % 6) * 0.05 }}
                onClick={() => setSelectedIndex(i)}
                className="group relative break-inside-avoid overflow-hidden rounded-2xl border bg-card cursor-zoom-in"
              >
                <img 
                  src={g.image} 
                  alt={g.title} 
                  loading="lazy" 
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1562774053-701939374585?w=500";
                  }}
                />

                {/* Indikator Ikon Zoom di Pojok Kanan Atas */}
                <div className="absolute top-3 right-3 rounded-full bg-black/45 p-2 text-white backdrop-blur-sm opacity-80 md:opacity-0 transition-opacity group-hover:opacity-100">
                  <ZoomIn className="h-4 w-4" />
                </div>

                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="text-sm font-semibold text-background">{g.title}</p>
                  <p className="text-xs text-background/80">{g.category}</p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        )}
      </section>

      {/* LIGHTBOX MODAL RESPONSIVE */}
      <AnimatePresence>
        {activeItem && selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8"
          >
            {/* Top Bar: Counter & Tombol Close */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-between w-full max-w-6xl mx-auto z-10"
            >
              <span className="text-xs md:text-sm font-medium text-slate-300 bg-white/10 px-3.5 py-1.5 rounded-full">
                {selectedIndex + 1} / {items.length}
              </span>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Tutup tampilan penuh"
                className="p-2.5 md:p-3 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white transition"
              >
                <X className="h-5 w-5 md:h-6 md:w-6" />
              </button>
            </div>

            {/* Center Area: Foto + Tombol Panah Khusus Desktop */}
            <div className="relative flex-1 flex items-center justify-center my-2 overflow-hidden">
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    showPrev();
                  }}
                  aria-label="Foto sebelumnya"
                  className="hidden md:flex absolute left-2 lg:left-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-5xl max-h-full flex flex-col items-center justify-center"
              >
                <img
                  src={activeItem.image}
                  alt={activeItem.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1562774053-701939374585?w=800";
                  }}
                  className="max-h-[68vh] md:max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-2xl select-none"
                />
              </motion.div>

              {items.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    showNext();
                  }}
                  aria-label="Foto berikutnya"
                  className="hidden md:flex absolute right-2 lg:right-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>

            {/* Bottom Bar: Caption & Navigasi Jempol Khusus Mobile */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl mx-auto text-center space-y-3 z-10"
            >
              <div className="space-y-1 px-2">
                <p className="text-white font-semibold text-sm md:text-base line-clamp-2">
                  {activeItem.title}
                </p>
                {activeItem.category && (
                  <span className="inline-block text-[11px] font-medium text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                    {activeItem.category}
                  </span>
                )}
              </div>

              {/* Kontrol Navigasi Bawah Khusus Layar HP */}
              {items.length > 1 && (
                <div className="flex md:hidden items-center justify-center gap-6 pt-1">
                  <button
                    type="button"
                    onClick={showPrev}
                    className="flex items-center gap-1 px-4 py-2 rounded-full bg-white/10 active:bg-white/20 text-white text-xs font-semibold"
                  >
                    <ChevronLeft className="h-4 w-4" /> Sebelumnya
                  </button>
                  <span className="text-[11px] text-slate-400">Geser foto</span>
                  <button
                    type="button"
                    onClick={showNext}
                    className="flex items-center gap-1 px-4 py-2 rounded-full bg-white/10 active:bg-white/20 text-white text-xs font-semibold"
                  >
                    Berikutnya <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}