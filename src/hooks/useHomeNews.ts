"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export interface Berita {
  id: string;
  judul: string;
  slug: string;
  kategori: string;
  konten: string;
  gambar: string;
  tanggal: string;
  isPinned?: boolean;
}

export const stripHtml = (htmlString: string) => {
  if (!htmlString) return "";
  return htmlString
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
};

export function useHomeNews() {
  const [beritaTerbaru, setBeritaTerbaru] = useState<Berita[]>([]);
  const [loadingBerita, setLoadingBerita] = useState(true);

  useEffect(() => {
    const ambilBeritaTerbaru = async () => {
      try {
        const q = query(collection(db, "berita"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const list: Berita[] = [];

        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Berita);
        });

        const pinnedNews = list.find((item) => item.isPinned === true);
        const otherNews = list.filter((item) => item.id !== pinnedNews?.id);

        const combinedNews = [
          ...(pinnedNews ? [pinnedNews] : []),
          ...otherNews,
        ].slice(0, 3);

        setBeritaTerbaru(combinedNews);
      } catch (error) {
        console.error("Gagal mengambil berita terbaru di Homepage:", error);
      } finally {
        setLoadingBerita(false);
      }
    };

    ambilBeritaTerbaru();
  }, []);

  return { beritaTerbaru, loadingBerita };
}