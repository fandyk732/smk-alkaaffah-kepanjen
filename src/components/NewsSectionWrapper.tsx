"use client";

import { useHomeNews } from "@/hooks/useHomeNews";
import { HomeNewsSection } from "@/components/home/HomeNewsSection";

export default function NewsSectionWrapper() {
  const { beritaTerbaru, loadingBerita } = useHomeNews();

  return <HomeNewsSection berita={beritaTerbaru} loading={loadingBerita} />;
}