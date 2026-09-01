import dynamic from "next/dynamic";
import { useHomeNews } from "@/hooks/useHomeNews"; // Jika useHomeNews butuh Client, kita bungkus section-nya saja
import { HomeHero } from "@/components/home/HomeHero";
import { HomeIntro } from "@/components/home/HomeIntro";
import { HomePrograms } from "@/components/home/HomePrograms";

// ⚡ Dynamic Import (Lazy Load) untuk Section Berita agar fetch JS-nya terpisah
const HomeNewsSection = dynamic(
  () => import("@/components/home/HomeNewsSection").then((mod) => mod.HomeNewsSection),
  { ssr: true }
);

// ⚡ Dynamic Import (Lazy Load) untuk Section Bawah (Below-The-Fold)
// Ini memangkas TBT drastis karena JS Partners, Alumni & Stats baru dimuat saat di-scroll
const HomeStatsAndAlumni = dynamic(
  () => import("@/components/home/HomeStatsAndAlumni").then((mod) => mod.HomeStatsAndAlumni),
  {
    loading: () => <div className="h-40 w-full animate-pulse bg-slate-50/50" />,
  }
);

// Komponen Pembungkus Berita Client Side (Agara "use client" terisolasi hanya di sini)
import NewsSectionWrapper from "./NewsSectionWrapper";

export function HomePage() {
  return (
    <>
      {/* 1. HERO SECTION (Fast Server Rendered & LCP Priority) */}
      <HomeHero />

      {/* 2. NEWS SECTION (Terisolasi) */}
      <NewsSectionWrapper />

      {/* 3. INTRO & SAMBUTAN KEPALA SEKOLAH (Pure HTML Server Rendered) */}
      <HomeIntro />

      {/* 4. PROGRAM KEAHLIAN & KELAS JEPANG */}
      <HomePrograms />

      {/* 5. STATS, PRESTASI, ALUMNI, PARTNERS, & CTA (Lazy Loaded) */}
      <HomeStatsAndAlumni />
    </>
  );
}