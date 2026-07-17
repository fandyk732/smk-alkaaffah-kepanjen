import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { Reveal } from "@/components/motion-primitives";
import { Button } from "@/components/ui/button";
import { school } from "@/data/site";

// Import Firestore SDK sisi server (Admin atau standard web sdk aman digunakan di server component)
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

type Params = Promise<{ slug: string }>;

// Interface data berita agar sesuai database
interface Berita {
  judul: string;
  kategori: string;
  tanggal: string;
  penulis: string;
  gambar: string;
  konten: string;
  slug: string;
}

// Fungsi pembantu untuk mengambil detail berita dari Firestore berdasarkan slug
async function dapatkanBeritaDariFirestore(slug: string): Promise<Berita | null> {
  try {
    const q = query(collection(db, "berita"), where("slug", "==", slug), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as Berita;
    }
    return null;
  } catch (error) {
    console.error("Gagal mengambil detail berita di server:", error);
    return null;
  }
}

// Fungsi pembantu untuk mengambil berita terkait (3 berita selain berita yang sedang dibuka)
async function dapatkanBeritaTerkait(slugSekarang: string): Promise<Berita[]> {
  try {
    const q = query(collection(db, "berita"), limit(4));
    const querySnapshot = await getDocs(q);
    const list: Berita[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Berita;
      if (data.slug !== slugSekarang) {
        list.push(data);
      }
    });

    return list.slice(0, 3);
  } catch (error) {
    return [];
  }
}

// 1. Generate Metadata secara Dinamis berdasarkan data Firestore
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const a = await dapatkanBeritaDariFirestore(slug);

  if (!a) return { title: "Berita tidak ditemukan — " + school.name, robots: { index: false } };

  // Ambil 150 karakter pertama dari konten sebagai deskripsi SEO
  const deskripsiSeo = a.konten.substring(0, 150) + "...";

  return {
    title: `${a.judul} — ${school.name}`,
    description: deskripsiSeo,
    alternates: { canonical: `/berita/${a.slug}` },
    openGraph: {
      title: a.judul,
      description: deskripsiSeo,
      type: "article",
      images: [a.gambar],
    },
  };
}

// 2. Tampilan Utama Artikel (Server Component)
export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = await dapatkanBeritaDariFirestore(slug);

  // Jika slug tidak ditemukan di Firestore, langsung arahkan ke halaman 404 buatan Next.js
  if (!article) notFound();

  const related = await dapatkanBeritaTerkait(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.judul,
    image: article.gambar,
    datePublished: article.tanggal,
    articleSection: article.kategori,
    author: {
      "@type": "Person",
      name: article.penulis || "Guru SMK Al Kaaffah"
    }
  };

  return (
    <article className="container-page max-w-3xl py-32 text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Tombol Kembali */}
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href="/berita">
          <ArrowLeft className="mr-1 h-4 w-4" /> Semua berita
        </Link>
      </Button>

      {/* Kategori & Tanggal */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Tag className="h-4 w-4 text-primary" />
          {article.kategori}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-primary" />
          {article.tanggal}
        </span>
      </div>

      {/* Judul Utama */}
      <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
        {article.judul}
      </h1>

      {/* Gambar Utama */}
      <div className="mt-8 overflow-hidden rounded-2xl border shadow-soft aspect-video">
        <img 
          src={article.gambar} 
          alt={article.judul} 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Konten Artikel */}
      <div className="prose mt-8 max-w-none text-foreground dark:prose-invert">
        {article.konten.split('\n\n').map((paragraph, index) => (
          <p key={index} className="text-lg leading-relaxed mb-6 whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>

      <hr className="my-12" />

      {/* Artikel Terkait */}
      {related.length > 0 && (
        <>
          <h2 className="text-xl font-bold">Artikel terkait</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {related.map((n, i) => (
              <Reveal key={n.slug} delay={i * 0.07}>
                <Link 
                  href={`/berita/${n.slug}`} 
                  className="group block overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-soft h-full"
                >
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img 
                      src={n.gambar} 
                      alt={n.judul} 
                      loading="lazy" 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold leading-snug group-hover:text-primary line-clamp-2">
                      {n.judul}
                    </h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </>
      )}
    </article>
  );
}