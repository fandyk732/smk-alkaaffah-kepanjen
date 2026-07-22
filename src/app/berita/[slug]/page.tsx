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

// 🎯 HELPER 1: Unescape Entitas HTML yang Ter-escape dari Firestore/Quill Editor
const decodeHtml = (htmlString: string) => {
  if (!htmlString) return "";
  return htmlString
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
};

// 🎯 HELPER 2: Strip HTML Bersih Total (Untuk Meta SEO & Excerpt)
const stripHtml = (htmlString: string) => {
  if (!htmlString) return "";
  const decoded = decodeHtml(htmlString);
  return decoded
    .replace(/<[^>]*>?/gm, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
};

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

  // 🎯 Pakai stripHtml biar deskripsi SEO di Google bersih dari tag & entity HTML
  const deskripsiBersih = stripHtml(a.konten);
  const deskripsiSeo = deskripsiBersih.substring(0, 150) + (deskripsiBersih.length > 150 ? "..." : "");

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
    <article className="container-page max-w-3xl py-24 sm:py-32 text-foreground">
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
        <span className="flex items-center gap-1.5 font-medium text-primary">
          <Tag className="h-4 w-4" />
          {article.kategori}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {article.tanggal}
        </span>
      </div>

      {/* Judul Utama */}
      <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl wrap-break-word">
        {article.judul}
      </h1>

      {/* Gambar Utama */}
      <div className="mt-8 overflow-hidden rounded-2xl border shadow-soft aspect-video bg-muted">
        <img 
          src={article.gambar} 
          alt={article.judul} 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* KONTEN ARTIKEL UTAMA */}
      <div className="mt-8 max-w-none text-foreground leading-relaxed w-full overflow-hidden">
        {/* 🎯 DI SINI KUNCI BIKIN KONTEN ARTIKEL RAPI DAN FORMATNYA JALAN */}
        <div 
          dangerouslySetInnerHTML={{ __html: decodeHtml(article.konten) }} 
          className="
            prose prose-slate dark:prose-invert max-w-none
            wrap-break-word
            prose-p:text-base sm:prose-p:text-lg prose-p:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:w-full prose-img:object-cover
            prose-strong:font-bold prose-strong:text-foreground
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
                  className="group block overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-soft h-full flex flex-col"
                >
                  <div className="aspect-video overflow-hidden bg-muted relative shrink-0">
                    <img 
                      src={n.gambar} 
                      alt={n.judul} 
                      loading="lazy" 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-between grow">
                    <h3 className="text-sm font-semibold leading-snug group-hover:text-primary line-clamp-2 wrap-break-word">
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