"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/page-hero";
import { galleryItems } from "@/data/site";

const categories = ["Semua", "Fasilitas", "Kegiatan", "Prestasi"];

export function GaleriPage() {
  const [cat, setCat] = useState("Semua");
  const items = galleryItems.filter((g) => cat === "Semua" || g.category === cat);

  return (
    <>
      <PageHero eyebrow="Galeri" title="Momen & dokumentasi sekolah" description="Lihat berbagai kegiatan, fasilitas, dan prestasi membanggakan kami." />

      <section className="container-page py-8">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${cat === c ? "bg-gradient-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-primary/10"}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {items.map((g, i) => (
            <motion.figure
              key={g.title}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (i % 6) * 0.05 }}
              className="group relative break-inside-avoid overflow-hidden rounded-2xl border"
            >
              <img src={g.image} alt={g.title} loading="lazy" className="w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="text-sm font-semibold text-background">{g.title}</p>
                <p className="text-xs text-background/80">{g.category}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>
    </>
  );
}
