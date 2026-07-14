import type { Metadata } from "next";
import { BeritaPage } from "@/components/pages/berita-page";
import { school } from "@/data/site";

export const metadata: Metadata = {
  title: `Berita & Artikel — ${school.name}`,
  description: "Kabar terbaru, kegiatan, prestasi, dan artikel dari SMK Al Kaaffah Kepanjen.",
  alternates: { canonical: "/berita" },
  openGraph: { title: `Berita & Artikel — ${school.name}`, url: "/berita" },
};

export default function Page() {
  return <BeritaPage />;
}
