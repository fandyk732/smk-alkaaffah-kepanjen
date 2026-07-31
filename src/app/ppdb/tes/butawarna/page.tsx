"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import TesButaWarna, { HasilTesButaWarna } from "@/components/ppdb/TesButaWarna";

export default function TesPpdbPage() {
  const handleHasilButaWarna = (hasil: HasilTesButaWarna) => {
    console.log("Hasil tes siap disimpan ke Firestore:", hasil);
    // Nanti di sini kita jalankan updateDoc / addDoc ke Firestore
  };

  return (
    <main className="container-page py-12 px-4 max-w-4xl mx-auto">
      {/* Tombol Kembali ke /ppdb/tes */}
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="rounded-xl">
          <Link href="/ppdb/tes">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Kembali ke Pilihan Tes
          </Link>
        </Button>
      </div>

      {/* Komponen Tes Buta Warna */}
      <TesButaWarna onComplete={handleHasilButaWarna} />
    </main>
  );
}