import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Tag as TagIcon, ArrowRight } from "lucide-react";

// Import Firestore
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

interface Berita {
  id: string;
  judul: string;
  slug: string;
  kategori: string;
  tags?: string[];
  tanggal: string;
  gambar: string;
  konten: string;
}

// Map nama kategori & slug
const KATEGORI_MAP: Record<string, { title: string; desc: string; matchCategory: string }> = {
  sekolah: {
    title: "Berita Sekolah",
    desc: "Informasi terbaru mengenai kegiatan, pengumuman, dan agenda SMK Al Kaaffah.",
    matchCategory: "Berita",
  },
  prestasi: {
    title: "Prestasi Siswa & Guru",
    desc: "Catatan kebanggaan dan kejuaraan yang diraih oleh civitas akademika SMK Al Kaaffah.",
    matchCategory: "Prestasi",
  },
  tekno: {
    title: "Berita Teknologi & Edukasi",
    desc: "Wawasan dunia IT, otomotif, perkakas modern, dan edukasi populer.",
    matchCategory: "Artikel",
  },
};

// Fungsi Ambil Berita dari Firestore berdasarkan Kategori / Tag
async function getBeritaByKategoriAtauTag(slugKategori: string): Promise<Berita[]> {
  try {
    const q = query(collection(db, "berita"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const list: Berita[] = [];

    const target = slugKategori.toLowerCase();
    const katInfo = KATEGORI_MAP[target];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as Berita;
      const kategoriMatch =
        data.kategori?.toLowerCase() === katInfo?.matchCategory.toLowerCase() ||
        data.kategori?.toLowerCase() === target;

      // Check apakah ada tag yang cocok (misal: "sekolah")
      const tagMatch = data.tags?.some((t) => t.toLowerCase() === target);

      // Jika Kategori cocok ATAU Tag cocok, masukkan ke list
      if (kategoriMatch || tagMatch) {
        list.push({ ...data, id: doc.id }); // 👈 DIBENAHI DI SINI
      }
    });

    return list;
  } catch (error) {
    console.error("Gagal mengambil berita kategori:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kategori: string }>;
}): Promise<Metadata> {
  const { kategori } = await params;
  const katInfo = KATEGORI_MAP[kategori];

  if (!katInfo) return { title: "Kategori Tidak Ditemukan" };

  return {
    title: `${katInfo.title} | SMK Al Kaaffah Kepanjen`,
    description: katInfo.desc,
  };
}

export default async function KategoriBeritaPage({
  params,
}: {
  params: Promise<{ kategori: string }>;
}) {
  const { kategori } = await params;
  const katInfo = KATEGORI_MAP[kategori];

  if (!katInfo) notFound();

  // Ambil daftar berita asli dari Firestore
  const beritaList = await getBeritaByKategoriAtauTag(kategori);

  return (
    <main className="min-h-screen pb-16">
      <PageHero eyebrow="Kategori & Tag Berita" title={katInfo.title} description={katInfo.desc} />

      <div className="container-page mx-auto mt-8">
        {/* Tombol Kembali & Switcher Kategori Cepat */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Button asChild variant="outline" size="sm" className="rounded-xl">
            <Link href="/berita">
              <ArrowLeft className="mr-2 h-4 w-4" /> Semua Berita
            </Link>
          </Button>

          <div className="flex flex-wrap gap-2">
            {Object.entries(KATEGORI_MAP).map(([key, item]) => (
              <Button
                key={key}
                asChild
                variant={kategori === key ? "default" : "ghost"}
                size="sm"
                className="rounded-xl text-xs"
              >
                <Link href={`/berita/kategori/${key}`}>{item.title}</Link>
              </Button>
            ))}
          </div>
        </div>

        {/* LIST BERITA */}
        {beritaList.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {beritaList.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-soft transition-all hover:shadow-md"
              >
                <div className="aspect-video w-full overflow-hidden bg-muted relative">
                  <img
                    src={item.gambar}
                    alt={item.judul}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <span className="font-semibold text-primary">{item.kategori}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {item.tanggal}
                      </span>
                    </div>
                    <h3 className="font-bold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {item.judul}
                    </h3>
                  </div>

                  {/* Render Badges Tag */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {item.tags.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-0.5 text-[10px] bg-secondary px-2 py-0.5 rounded-md font-medium text-secondary-foreground"
                        >
                          <TagIcon className="h-2.5 w-2.5" /> #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link
                    href={`/berita/${item.slug}`}
                    className="mt-4 inline-flex items-center text-xs font-bold text-primary hover:underline"
                  >
                    Baca Selengkapnya <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* KONDISI JIKA BELUM ADA ARTIKEL */
          <div className="rounded-3xl border bg-card p-12 text-center shadow-soft">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
              <TagIcon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Belum Ada Artikel</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
              Belum ada artikel yang dipublikasikan untuk kategori atau tag <b>#{kategori}</b>.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}