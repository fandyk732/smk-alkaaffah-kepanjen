"use client";

import { useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

interface ViewCounterProps {
  articleId: string;
}

export function ViewCounter({ articleId }: ViewCounterProps) {
  const hasIncremented = useRef(false);

  useEffect(() => {
    // Memastikan increment hanya dipanggil SEKALI per kunjungan halaman
    if (!articleId || hasIncremented.current) return;

    const recordView = async () => {
      try {
        hasIncremented.current = true;
        const docRef = doc(db, "berita", articleId);
        await updateDoc(docRef, {
          views: increment(1),
        });
      } catch (error) {
        console.error("Gagal menambah view counter:", error);
      }
    };

    recordView();
  }, [articleId]);

  // Komponent ini invisible (hanya logic di background)
  return null;
}