"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface PopupData {
  isPopupActive?: boolean;
  popupImage?: string;
  popupTargetUrl?: string;
}

export default function AnnouncementModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<{ gambarUrl: string; targetUrl: string } | null>(null);

  useEffect(() => {
    const fetchPopupData = async () => {
      try {
        // 1. Ambil data dari path document yang sama dengan admin
        const docRef = doc(db, "settings", "announcement");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const annData = docSnap.data() as PopupData;

          // Jika status di-admin MATI atau URL gambar kosong, batalkan render
          if (!annData.isPopupActive || !annData.popupImage) return;

          // 2. Cek status di localStorage (apakah user sudah pernah close dalam 24 jam terakhir?)
          const lastClosed = localStorage.getItem("announcement_closed_at");
          if (lastClosed) {
            const now = new Date().getTime();
            const closedTime = parseInt(lastClosed, 10);
            const hoursPassed = (now - closedTime) / (1000 * 60 * 60);

            if (hoursPassed < 24) return;
          }

          // 3. Simpan data dan beri delay 3 detik sebelum tampil
          setData({
            gambarUrl: annData.popupImage,
            targetUrl: annData.popupTargetUrl || "/ppdb",
          });
          
          setTimeout(() => setIsOpen(true), 3000);
        }
      } catch (error) {
        console.error("Gagal mengambil data pop-up:", error);
      }
    };

    fetchPopupData();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("announcement_closed_at", new Date().getTime().toString());
  };

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Backdrop overlay (klik di luar poster untuk menutup) */}
      <div className="absolute inset-0" onClick={handleClose} aria-label="Tutup" />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl transition-all animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        {/* Tombol Close (X) */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black transition-colors focus:outline-none"
          title="Tutup"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Gambar Poster */}
        <Link
          href={data.targetUrl}
          onClick={handleClose}
          className="group relative block overflow-hidden bg-slate-900"
        >
          <img
            src={data.gambarUrl}
            alt="Pengumuman Sekolah"
            className="w-full h-auto max-h-[75vh] object-contain mx-auto transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Footer Modal */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <p className="text-xs text-slate-500 font-medium hidden sm:block">
            Klik poster untuk informasi selengkapnya
          </p>
          <div className="flex items-center justify-end w-full sm:w-auto gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
            >
              Nanti Saja
            </button>
            <Link
              href={data.targetUrl}
              onClick={handleClose}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-sm text-center"
            >
              Lihat Detail
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}