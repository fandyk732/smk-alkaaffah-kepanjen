import type { Metadata } from "next";
import { BeritaPage } from "@/components/pages/berita-page";
import { school } from "@/data/site";

export const metadata: Metadata = {
  title: `Berita & Informasi — ${school.name}`,
  description:
    "Kabar terbaru, kegiatan sekolah, pengumuman, dan prestasi siswa SMK Al Kaaffah Kepanjen.",
  alternates: {
    canonical: "/berita",
  },
};

export default function Page() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden pt-20 pb-16">
      <BeritaPage />
    </main>
  );
}