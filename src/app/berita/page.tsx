import type { Metadata } from "next";
import { Suspense } from "react";
import { BeritaPage } from "@/components/pages/berita-page";
import { school } from "@/data/site";

export const dynamic = "force-dynamic";

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
    <Suspense fallback={<BeritaLoadingFallback />}>
      <BeritaPage />
    </Suspense>   
    </main>
  );
}

function BeritaLoadingFallback() {
  return (
    <div className="container-page py-24 flex justify-center items-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
    </div>
  );
}