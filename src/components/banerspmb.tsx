"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BannerSPMB() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8 sm:my-12">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
        
        {/* CONTAINER GAMBAR BANNER */}
        <div className="relative w-full h-[220px] sm:h-[350px] md:h-[420px] bg-slate-200 dark:bg-slate-800">
          
          {/* 1. 💀 SKELETON ANIMATION (Tampil saat gambar sedang proses diambil) */}
          {!isLoaded && (
            <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 flex items-center justify-center">
              <div className="text-slate-400 text-xs font-semibold flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                <span>Memuat Banner...</span>
              </div>
            </div>
          )}

          {/* 2. 🖼️ GAMBAR BANNER WITH LAZY LOAD & FADE-IN ANIMATION */}
          <Image
            src="/images/baner.webp"
            alt="Informasi SPMB / PPDB Online"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            onLoad={() => setIsLoaded(true)} // 👈 Triggers saat gambar beres di-load
            className={`object-cover object-center transition-all duration-700 ease-in-out hover:scale-105 ${
              isLoaded 
                ? "opacity-100 blur-0 scale-100" 
                : "opacity-0 blur-md scale-105"
            }`}
          />

          {/* 3. OVERLAY GRADIENT & CONTENT */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-10 z-20">
            <div className="max-w-2xl space-y-3">
              
              {/* Badge info */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground w-fit shadow-md">
                <Sparkles className="h-3.5 w-3.5" /> SPMB Tahun 2027/2028
              </span>

              {/* Judul & Deskripsi Singkat */}
              <h2 className="text-xl sm:text-3xl font-extrabold text-white drop-shadow-md leading-tight">
                Pendaftaran Siswa Baru Telah Dibuka!
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 drop-shadow">
                Bergabunglah bersama kami. Nikmati berbagai fasilitas unggulan, beasiswa, dan tes minat jurusan interaktif secara gratis.
              </p>

              {/* Tombol Aksi (CTA) */}
              <div className="pt-2 flex flex-wrap gap-3">
                <Button asChild className="rounded-xl font-bold gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
                  <Link href="/ppdb">
                    Daftar Sekarang <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}