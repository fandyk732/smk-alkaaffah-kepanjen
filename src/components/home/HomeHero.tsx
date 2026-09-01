import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, CheckCircle2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { school } from "@/data/site";
import heroImg from "@/assets/hero.webp";

export function HomeHero() {
  return (
    <section className="container-page relative grid items-center gap-12 py-12 lg:grid-cols-2 lg:py-20">
      <div>
        {/* Badge */}
        <span className="inline-flex items-center gap-2 rounded-full glass-card px-4 py-1.5 text-xs font-semibold text-primary animate-fade-in">
          <Sparkles className="h-3.5 w-3.5" /> Tagline dan Visi Kami
        </span>

        {/* LCP Target: Judul Utama (Tanpa JS Animation biar 1.0s FCP/LCP) */}
        <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
          <span className="text-gradient">Belum Lulus, </span> Sudah Produktif
        </h1>

        <p className="mt-5 max-w-xl text-lg text-muted-foreground">
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

      {/* Gambar Hero Utama */}
      <div className="relative">
        <div className="overflow-hidden rounded-3xl border shadow-elegant relative h-[350px] sm:h-[450px] lg:h-[500px]">
          <Image
            src={heroImg}
            alt="Hero SMK Al Kaaffah"
            priority // ⚡ Wajib Priority untuk LCP Fast Paint
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            quality={80} // ⚡ Atur kualitas ke 80 biar ukurannya jauh lebih ringan
            className="object-cover"
          />
        </div>

        {/* Floating Card */}
        <div className="absolute -bottom-6 -left-6 glass-card rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
              <Award className="h-5 w-5" />
            </span>
            <div>
              <p className="text-lg font-extrabold leading-none">95%</p>
              <p className="text-xs text-muted-foreground">Lulusan terserap industri</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}