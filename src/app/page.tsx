import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";
import { school } from "@/data/site";
import AnnouncementModal from "@/components/AnnouncementModal";

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

      {/* 🚀 POP-UP MODAL ANNOUNCEMENT (DINAMIS DARI FIRESTORE) */}
      <AnnouncementModal />
    </>
  );
}