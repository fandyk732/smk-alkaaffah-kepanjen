import dynamic from "next/dynamic";
import { HomeHero } from "@/components/home/HomeHero";
import { HomePrograms } from "@/components/home/HomePrograms";
import NewsSectionWrapper from "./NewsSectionWrapper";

// ⚡ Dynamic Import agar bundle tetap ringan
const HomeVideoSection = dynamic(
  () => import("@/components/home/HomeVideoSection").then((mod) => mod.HomeVideoSection),
  {
    loading: () => <div className="h-96 w-full bg-transparent" />,
  }
);

const HomeStatsAndAlumni = dynamic(
  () => import("@/components/home/HomeStatsAndAlumni").then((mod) => mod.HomeStatsAndAlumni),
  {
    loading: () => <div className="h-40 w-full animate-pulse bg-slate-50/50" />,
  }
);

export function HomePage() {
  return (
    <>
      {/* 1. HERO SECTION */}
      <HomeHero />

      {/* 2. EMBED VIDEO UNGGULAN (Dinamis dari Admin Announcement) */}
      <HomeVideoSection />

      {/* 3. NEWS SECTION */}
      <NewsSectionWrapper />

      {/* 4. PROGRAM KEAHLIAN & KELAS JEPANG */}
      <HomePrograms />

      {/* 5. STATS, PRESTASI, ALUMNI, PARTNERS, & CTA */}
      <HomeStatsAndAlumni />
    </>
  );
}