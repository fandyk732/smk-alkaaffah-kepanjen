import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://smkalkaaffah.sch.id"; // Sesuaikan domain kamu

  // 1. URL Statis Utama
  const staticRoutes = [
    "",
    "/profil",
    "/program",
    "/berita",
    "/galeri",
    "/kontak",
    "/ppdb",
    "/alumni",
    "/tracer-study",
    "/bkk",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // 2. URL Dynamic Sub-Program Keahlian
  const programSlugs = ["tkj", "tkr", "tav", "bahasa-jepang", "digital-marketing"];
  const programRoutes = programSlugs.map((slug) => ({
    url: `${baseUrl}/program/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  // 3. URL Kategori Berita
  const kategoriBerita = ["sekolah", "prestasi", "tekno"];
  const kategoriRoutes = kategoriBerita.map((kat) => ({
    url: `${baseUrl}/berita/kategori/${kat}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // 💡 CATATAN: Jika ingin menambahkan artikel berita dari Firestore secara otomatis:
  // Kamu bisa fetch data slug berita di sini lalu di-map ke format sitemap!

  return [...staticRoutes, ...programRoutes, ...kategoriRoutes];
}