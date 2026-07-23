"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/page-hero";
import { galleryItems } from "@/data/site";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

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
      // Memastikan matching category tidak sensitif kapital atau beda istilah
      if (cat === "Kegiatan" && g.category === "Event") return true;
      return g.category === cat;
    });
  }, [combinedItems, cat]);

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
                className="group relative break-inside-avoid overflow-hidden rounded-2xl border bg-card"
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
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="text-sm font-semibold text-background">{g.title}</p>
                  <p className="text-xs text-background/80">{g.category}</p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        )}
      </section>
    </>
  );
}