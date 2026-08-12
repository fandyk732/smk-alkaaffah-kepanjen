import type { Metadata } from "next";
import { GaleriPage } from "@/components/pages/galeri-page";
import { school } from "@/data/site";

export const metadata: Metadata = {
  title: `Galeri — ${school.name}`,
  description: "Dokumentasi foto kegiatan, fasilitas, dan prestasi SMK Al Kaaffah Kepanjen.",
  alternates: { canonical: "/galeri" },
  openGraph: { title: `Galeri — ${school.name}`, url: "/galeri" },
};

export default function Page() {
  return <GaleriPage />;
}
