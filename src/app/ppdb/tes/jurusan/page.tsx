import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { school } from "@/data/site";
import TesPenjurusan from "@/components/ppdb/TesPenjurusan";

export const metadata: Metadata = {
  title: `Tes Minat & Rekomendasi Jurusan — ${school.name}`,
  description:
    "Ikuti tes minat dan bakat online untuk menemukan jurusan SMK yang paling cocok dengan potensi kamu di SMK Al Kaaffah.",
};

export default function TesJurusanPage() {
  return (
    <main className="container-page max-w-4xl py-12 sm:py-20 text-foreground">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="rounded-xl">
          <Link href="/ppdb/tes">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Kembali ke Pilihan Tes
          </Link>
        </Button>
      </div>

      <div className="text-center max-w-xl mx-auto mb-10">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Tes Minat & Rekomendasi Jurusan
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
          Jawab 30 pertanyaan singkat berikut untuk mengetahui potensi, bakat,
          dan rekomendasi jurusan terbaikmu di {school.name}.
        </p>
      </div>

      <TesPenjurusan />
    </main>
  );
}