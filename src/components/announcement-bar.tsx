"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, X } from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AnnouncementData {
  text: string;
  linkUrl?: string;
  isActive: boolean;
}

export function AnnouncementBar() {
  const [data, setData] = useState<AnnouncementData | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "settings", "announcement"),
      (docSnap) => {
        if (docSnap.exists()) {
          setData(docSnap.data() as AnnouncementData);
        }
      },
      (error) => {
        console.error("Gagal mengambil info pengumuman:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  if (!data || !data.isActive || !isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white text-xs sm:text-sm py-2.5 px-4 shadow-sm z-50 overflow-hidden">
      <div className="container-page flex items-center justify-between gap-3 mx-auto">
        
        {/* Badge / Tag Info Left */}
        <span className="inline-flex items-center gap-1 bg-white/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 backdrop-blur-sm z-10">
          <Sparkles className="h-3 w-3" /> Info SPMB
        </span>

        {/* 🎯 KUNCI FIX: HANYA 1 TEKS RUNNING UNTUK SEMUA LAYAR */}
        <div className="flex-1 overflow-hidden relative mx-2">
          <div className="flex whitespace-nowrap animate-marquee">
            
            {/* Loop Pertama */}
            <div className="flex items-center gap-2 pr-12">
              <span className="font-medium">{data.text}</span>
              {data.linkUrl && (
                <Link 
                  href={data.linkUrl} 
                  className="inline-flex items-center gap-1 font-bold underline underline-offset-4 hover:text-white/80 transition"
                >
                  Selengkapnya <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>

            {/* Loop Kedua (Seamless Marquee Effect) */}
            <div className="flex items-center gap-2 pr-12">
              <span className="font-medium">{data.text}</span>
              {data.linkUrl && (
                <Link 
                  href={data.linkUrl} 
                  className="inline-flex items-center gap-1 font-bold underline underline-offset-4 hover:text-white/80 transition"
                >
                  Selengkapnya <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>

          </div>
        </div>

        {/* Tombol Close Right */}
        <div className="flex items-center shrink-0 z-10">
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
            aria-label="Tutup Pengumuman"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
}