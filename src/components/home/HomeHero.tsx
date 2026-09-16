import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, CheckCircle2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { school } from "@/data/site";

// Impor 4 Gambar Aset (Pastikan file webp sudah tersedia di src/assets/)
import heroImg from "@/assets/hero.webp";
import heroTkj from "@/assets/hero-tkj.webp";   // 💡 Foto Praktik TKJ
import heroTav from "@/assets/hero-tav.webp";   // 💡 Foto Praktik TAV
import heroTkr from "@/assets/hero-tkr.webp";   // 💡 Foto Praktik TKR

export function HomeHero() {
  return (
    <section className="container-page relative grid items-center gap-10 py-10 lg:grid-cols-12 lg:py-16">
      
      {/* SISI KIRI: TEXT CONTENT (6 KOLOMLG) */}
      <div className="lg:col-span-6">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 rounded-full glass-card px-4 py-1.5 text-xs font-semibold text-primary animate-fade-in">
          <Sparkles className="h-3.5 w-3.5" /> Tagline dan Visi Kami
        </span>

        {/* LCP Target: Judul Utama */}
        <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
          <span className="text-gradient">Belum Lulus, </span> Sudah Produktif
        </h1>

        <p className="mt-5 max-w-xl text-lg text-muted-foreground leading-relaxed">
          {school.description}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" className="bg-gradient-primary">
            <Link href="/ppdb">
              Daftar SPMB <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/program">Kenali Program Kami</Link>
          </Button>
        </div>

        {/* Feature List */}
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
          {["Terakreditasi B", "Kurikulum Industri", "Sertifikasi Kompetensi"].map((t) => (
            <span key={t} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" /> {t}
            </span>
          ))}
        </div>
      </div>

      {/* SISI KANAN: BENTO GRID IMAGES (6 KOLOMLG) */}
      <div className="lg:col-span-6">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* BENTO 1: Foto Utama Keakraban Siswa (7 Kolom SM) */}
          <div className="sm:col-span-7 relative h-[300px] sm:h-[420px] rounded-3xl overflow-hidden border shadow-elegant group">
            <Image
              src={heroImg}
              alt="Siswa SMK Al Kaaffah"
              priority // ⚡ Target LCP Fast Paint
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
              quality={80}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Overlay Gradient Halus */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            
          </div>

          {/* BENTO KANAN: 3 Foto Jurusan Ditumpuk Vertikal (5 Kolom SM) */}
          <div className="sm:col-span-5 grid grid-cols-3 sm:grid-cols-1 gap-2.5">
            
            {/* Jurusan 1: TKJ */}
            <div className="relative h-[95px] sm:h-[131px] rounded-2xl overflow-hidden border shadow-sm group">
              <Image
                src={heroTkj}
                alt="Teknik Komputer & Jaringan"
                fill
                sizes="(max-width: 640px) 33vw, 200px"
                quality={75}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <span className="absolute bottom-2 left-2 text-[10px] sm:text-[11px] font-semibold text-white/90 backdrop-blur-md px-2 py-0.5 rounded-md bg-black/40 border border-white/10">
                TKJ
              </span>
            </div>

            {/* Jurusan 2: TAV */}
            <div className="relative h-[95px] sm:h-[131px] rounded-2xl overflow-hidden border shadow-sm group">
              <Image
                src={heroTav}
                alt="Teknik Audio Video"
                fill
                sizes="(max-width: 640px) 33vw, 200px"
                quality={75}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <span className="absolute bottom-2 left-2 text-[10px] sm:text-[11px] font-semibold text-white/90 backdrop-blur-md px-2 py-0.5 rounded-md bg-black/40 border border-white/10">
                TAV
              </span>
            </div>

            {/* Jurusan 3: TKR */}
            <div className="relative h-[95px] sm:h-[131px] rounded-2xl overflow-hidden border shadow-sm group">
              <Image
                src={heroTkr}
                alt="Teknik Kendaraan Ringan"
                fill
                sizes="(max-width: 640px) 33vw, 200px"
                quality={75}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <span className="absolute bottom-2 left-2 text-[10px] sm:text-[11px] font-semibold text-white/90 backdrop-blur-md px-2 py-0.5 rounded-md bg-black/40 border border-white/10">
                TKR
              </span>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
}