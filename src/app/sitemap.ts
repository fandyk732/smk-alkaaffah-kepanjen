import { MetadataRoute } from "next";
import { db } from "@/lib/firebase";
import { collection, getDocs, query } from "firebase/firestore";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://smkalkaaffah.sch.id";

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

  // 🚀 4. URL Dynamic Artikel Berita dari Firestore
  let beritaRoutes: MetadataRoute.Sitemap = [];
  try {
    const q = query(collection(db, "berita"));
    const querySnapshot = await getDocs(q);

    beritaRoutes = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        url: `${baseUrl}/berita/${data.slug}`,
        lastModified: data.updatedAt ? new Date(data.updatedAt) : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      };
    });
  } catch (error) {
    console.error("Gagal mengambil data berita untuk sitemap:", error);
  }

  return [...staticRoutes, ...programRoutes, ...kategoriRoutes, ...beritaRoutes];
}