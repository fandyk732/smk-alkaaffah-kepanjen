import type { MetadataRoute } from "next";

const BASE_URL = "https://smkalkaaffah.sch.id";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/profil",
    "/program",
    "/berita",
    "/galeri",
    "/ppdb",
    "/kontak",
    "/buku-pelanggaran",
  ];

  return paths.map((p) => ({
    url: `${BASE_URL}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: p === "/" ? 1.0 : 0.7,
  }));
}