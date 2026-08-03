import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BannerSPMB() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8 sm:my-12">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
        
        {/* GAMBAR BANNER */}
        <div className="relative w-full h-[220px] sm:h-[350px] md:h-[420px]">
          <Image
            src="/images/baner-spmb.png" // 👈 Path gambar kamu di folder public
            alt="Informasi SPMB / PPDB Online"
            fill
            priority // 💡 Wajib dipasang agar gambar di homepage ini ter-load instant tanpa lag!
            className="object-cover object-center transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          />

          {/* Overlay Gradient (Opsional: Agar tulisan/tombol di atas gambar makin terbaca) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-10">
            <div className="max-w-2xl space-y-3">
              
              {/* Badge info */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground w-fit shadow-md">
                <Sparkles className="h-3.5 w-3.5" /> SPMB / PPDB Tahun 2026/2027
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