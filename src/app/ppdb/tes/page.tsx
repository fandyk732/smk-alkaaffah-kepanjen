import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Eye, Compass, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { school } from "@/data/site";

export const metadata: Metadata = {
  title: `Tes Online PPDB — ${school.name}`,
  description:
    "Ikuti tes buta warna dan tes minat jurusan online untuk melengkapi persyaratan registrasi PPDB di SMK Al Kaaffah.",
};

export default function TesPpdbPage() {
  return (
    <main className="container-page max-w-4xl py-12 sm:py-20 text-foreground">
      {/* Tombol Kembali */}
      <div className="mb-8">
        <Button asChild variant="ghost" size="sm" className="rounded-xl">
          <Link href="/ppdb">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Kembali ke SPMB
          </Link>
        </Button>
      </div>

      {/* Header Halaman */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 border border-primary/20">
          <Sparkles className="h-3.5 w-3.5" /> Tes Online Calon Siswa
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Tes Seleksi SPMB & Rekomendasi Jurusan
        </h1>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
          Silakan Kerjakan tes di bawah ini untuk melengkapi berkas pendaftaran dan
          mengetahui rekomendasi jurusan yang paling cocok dengan potensi kamu.
        </p>
      </div>

      {/* Grid Pilihan Tes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* CARD 1: TES BUTA WARNA */}
        <div className="group relative bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Eye className="h-6 w-6" />
            </div>

            <h2 className="text-xl font-bold mb-2 text-foreground">
              Tes Buta Warna
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Tes ketajaman persepsi warna menggunakan metode gambar Ishihara.
              Wajib untuk calon siswa jurusan teknik.
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-4 flex items-center justify-between border-t border-border/60 pt-4">
              <span>Jumlah Soal: 10 Soal</span>
              <span>Estimasi: ~3 Min</span>
            </div>
            <Button asChild className="w-full rounded-xl gap-2 font-semibold">
              <Link href="/ppdb/tes/butawarna">
                Mulai Tes Warna <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* CARD 2: TES REKOMENDASI JURUSAN */}
        <div className="group relative bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Compass className="h-6 w-6" />
            </div>

            <h2 className="text-xl font-bold mb-2 text-foreground">
              Tes Minat & Jurusan
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Kuesioner pemetaan minat & bakat untuk mencari kecocokan antara kamu dengan Kompetensi Keahlian Komputer, Otomotif, atau Listrik.
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-4 flex items-center justify-between border-t border-border/60 pt-4">
              <span>Jumlah Soal: 30 Soal</span>
              <span>Estimasi: ~7 Min</span>
            </div>
            <Button
              asChild
              variant="default"
              className="w-full rounded-xl gap-2 font-semibold bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Link href="/ppdb/tes/jurusan">
                Mulai Tes Jurusan <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}