"use client";

import { useHomeNews } from "@/hooks/useHomeNews";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeNewsSection } from "@/components/home/HomeNewsSection";
import { HomeIntro } from "@/components/home/HomeIntro";
import { HomePrograms } from "@/components/home/HomePrograms";
import { HomeStatsAndAlumni } from "@/components/home/HomeStatsAndAlumni";
import BannerSPMB from "./banerspmb";

export function HomePage() {
  const { beritaTerbaru, loadingBerita } = useHomeNews();

  return (
    <>
      {/* 1. HERO SECTION */}
      <HomeHero />

      {/* BANNER SPMB */}
      <BannerSPMB />

      {/* 2. NEWS SECTION */}
      <HomeNewsSection berita={beritaTerbaru} loading={loadingBerita} />

      {/* 3. INTRO & SAMBUTAN KEPALA SEKOLAH */}
      <HomeIntro />

      {/* 4. PROGRAM KEAHLIAN & KELAS JEPANG */}
      <HomePrograms />

      {/* 5. STATS, PRESTASI, ALUMNI, PARTNERS, & CTA */}
      <HomeStatsAndAlumni />
    </>
  );
}