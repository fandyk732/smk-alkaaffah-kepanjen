import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { Reveal } from "@/components/motion-primitives";
import { Button } from "@/components/ui/button";
import { school } from "@/data/site";

// Import Firestore SDK sisi server
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

type Params = Promise<{ slug: string }>;

interface Berita {
  judul: string;
  kategori: string;
  tanggal: string;
  penulis: string;
  gambar: string;
  konten: string;
  slug: string;
}

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

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const a = await dapatkanBeritaDariFirestore(slug);

  if (!a) return { title: "Berita tidak ditemukan — " + school.name, robots: { index: false } };

  const deskripsiBersih = a.konten.replace(/<[^>]*>?/gm, '');
  const deskripsiSeo = deskripsiBersih.substring(0, 150) + "...";

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

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = await dapatkanBeritaDariFirestore(slug);

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
      <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl break-words">
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

      {/* 🎯 KONTEN ARTIKEL DENGAN AUTO-WRAP CSS & BREAK-WORDS */}
      <div className="prose prose-slate dark:prose-invert mt-8 max-w-none text-foreground leading-relaxed w-full overflow-hidden">
        <div 
          dangerouslySetInnerHTML={{ __html: article.konten }} 
          className="
            break-words [overflow-wrap:anywhere]
            [&_p]:mb-4 [&_p]:text-lg [&_p]:leading-relaxed [&_p]:break-words
            [&_a]:text-primary [&_a]:underline [&_a]:break-all hover:[&_a]:opacity-80
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
            [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6
            [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:break-words
            [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:break-words
            [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl
          "
        />
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
                    <h3 className="text-sm font-semibold leading-snug group-hover:text-primary line-clamp-2 break-words">
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