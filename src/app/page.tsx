import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { HomePage } from "@/components/home-page";
import { school } from "@/data/site";

// ⚡ Dynamic Import dengan SSR Disabled untuk Modal Pengumuman
// Ini akan memangkas TBT drastis karena JS Modal & Firestore query-nya 
// tidak dimuat di detik pertama loading halaman utama!
const AnnouncementModal = dynamic(
  () => import("@/components/AnnouncementModal"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: `${school.name} — ${school.tagline}`,
  description: school.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: school.name,
    description: school.description,
    url: "/",
  },
};

export default function Page() {
  return (
    <>
      <HomePage />

      {/* 🚀 POP-UP MODAL ANNOUNCEMENT (Lazy Loaded) */}
      <AnnouncementModal />
    </>
  );
}