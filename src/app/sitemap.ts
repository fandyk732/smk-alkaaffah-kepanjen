import type { MetadataRoute } from "next";
import { news } from "@/data/site";

const BASE_URL = "https://smkalkaaffah.sch.id";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/profil", "/program", "/berita", "/galeri", "/PPDB", "/kontak",
    ...news.map((n) => `/berita/${n.slug}`)];
  return paths.map((p) => ({
    url: `${BASE_URL}${p}`,
    changeFrequency: "weekly",
    priority: p === "/" ? 1 : 0.7,
  }));
}
