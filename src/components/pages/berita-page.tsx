"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion-primitives";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Import Firestore
import { db } from "@/lib/firebase"; 
import { collection, getDocs, query, orderBy } from "firebase/firestore";

// Definisikan tipe data berita dari Firestore
interface Berita {
  id: string;
  judul: string;
  slug: string;
  kategori: string;
  konten: string;
  gambar: string;
  tanggal: string;
  penulis: string;
}

// Kategorinya disesuaikan dengan opsi di form admin lo kemarin
const categories = ["Semua", "Berita", "Pengumuman", "Prestasi", "Event"];
const PER_PAGE = 6;

const stripHtml = (htmlString: string) => {
  if (!htmlString) return "";

  // 1. Unescape dulu entitas HTML yang ter-escape (misal &lt;p&gt; atau string mentah)
  let decoded = htmlString
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");

  // 2. Bersihkan semua tag HTML (<p>, <strong>, <em>, dll)
  let cleanText = decoded.replace(/<[^>]*>?/gm, " ");

  // 3. Bersihkan sisa spasi khusus (&nbsp; dll) & spasi ganda
  cleanText = cleanText
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleanText;
};

export function BeritaPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Semua");
  const [page, setPage] = useState(1);
  
  // State untuk menampung data dari Firestore dan status loading
  const [daftarBerita, setDaftarBerita] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);

  // Ambil data dari Firestore saat halaman di-load
  useEffect(() => {
    const ambilBerita = async () => {
      try {
        const qSnapshot = await getDocs(
          query(collection(db, "berita"), orderBy("createdAt", "desc"))
        );
        
        const data: Berita[] = [];
        qSnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as Berita);
        });

        setDaftarBerita(data);
      } catch (error) {
        console.error("Gagal mengambil data berita dari Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    ambilBerita();
  }, []);

  // Filter pencarian & kategori bekerja secara real-time di sisi client
  const filtered = useMemo(() => {
    return daftarBerita.filter((n) =>
      (cat === "Semua" || n.kategori === cat) &&
      n.judul.toLowerCase().includes(q.toLowerCase())
    );
  }, [q, cat, daftarBerita]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const items = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <PageHero 
        eyebrow="Berita & Artikel" 
        title="Kabar terbaru dari sekolah" 
        description="Ikuti perkembangan kegiatan, prestasi, dan informasi terbaru SMK Al Kaaffah Kepanjen." 
      />

      <section className="container-page py-8">
        {/* Filter Pencarian & Kategori */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              value={q} 
              onChange={(e) => { setQ(e.target.value); setPage(1); }} 
              placeholder="Cari berita..." 
              className="pl-9" 
              aria-label="Cari berita" 
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => { setCat(c); setPage(1); }}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  cat === c 
                    ? "bg-gradient-primary text-primary-foreground" 
                    : "bg-secondary text-secondary-foreground hover:bg-primary/10"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* State Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : items.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">Tidak ada berita yang cocok.</p>
        ) : (
          /* Grid Berita Utama */
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((n, i) => (
              <Reveal key={n.slug} delay={i * 0.06}>
                <Link 
                  href={`/berita/${n.slug}`} 
                  className="group block h-full overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-elegant flex flex-col"
                >
                  {/* 🎯 FIX GAMBAR MOBILE: Dikunci dengan aspect-video & object-cover */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                    <img 
                      src={n.gambar} 
                      alt={n.judul} 
                      loading="lazy" 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800";
                      }}
                    />
                  </div>
                  
                  <div className="p-5 flex flex-col justify-between grow">
                    <div>
                      <div className="flex justify-between items-center text-xs font-semibold text-primary">
                        <span>{n.kategori}</span>
                        <span className="text-muted-foreground font-normal">{n.tanggal}</span>
                      </div>
                      <h3 className="mt-2 font-bold leading-snug group-hover:text-primary line-clamp-2 wrap-break-word">
                        {n.judul}
                      </h3>
                      
                      {/* 🎯 FIX TEKS PREVIEW BERSIH TOTAL */}
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground wrap-break-word">
                        {stripHtml(n.konten)}
                      </p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button 
                key={i} 
                variant={page === i + 1 ? "default" : "outline"} 
                size="icon" 
                onClick={() => setPage(i + 1)} 
                aria-label={`Halaman ${i + 1}`}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        )}
      </section>
    </>
  );
}