import { MetadataRoute } from "next";
import { db } from "@/lib/firebase";
import { collection, getDocs, query } from "firebase/firestore";

// Helper fungsi untuk convert tanggal Firestore / String / Undefined ke Date JS yang aman
function parseSafeDate(dateVal: any): Date {
  if (!dateVal) return new Date();
  
  // Jika tipe data adalah Firestore Timestamp (punya method toDate)
  if (typeof dateVal === "object" && typeof dateVal.toDate === "function") {
    return dateVal.toDate();
  }
  
  // Jika tipe data sudah Date JS
  if (dateVal instanceof Date && !isNaN(dateVal.getTime())) {
    return dateVal;
  }

  // Jika tipe data String/Number
  const parsed = new Date(dateVal);
  return !isNaN(parsed.getTime()) ? parsed : new Date();
}

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

  // 4. URL Dynamic Artikel Berita dari Firestore (Aman dari error Date)
  let beritaRoutes: MetadataRoute.Sitemap = [];
  try {
    const q = query(collection(db, "berita"));
    const querySnapshot = await getDocs(q);

    beritaRoutes = querySnapshot.docs
      .map((doc) => {
        const data = doc.data();
        if (!data.slug) return null; // Skip jika dokumen tidak punya slug

        return {
          url: `${baseUrl}/berita/${data.slug}`,
          lastModified: parseSafeDate(data.updatedAt || data.createdAt), // 🚀 Pakai helper parser aman
          changeFrequency: "monthly" as const,
          priority: 0.7,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  } catch (error) {
    console.error("Gagal mengambil data berita untuk sitemap:", error);
  }

  return [...staticRoutes, ...programRoutes, ...kategoriRoutes, ...beritaRoutes];
}