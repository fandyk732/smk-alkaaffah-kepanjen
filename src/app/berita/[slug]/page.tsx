import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { Reveal } from "@/components/motion-primitives";
import { Button } from "@/components/ui/button";
import { school } from "@/data/site";
import { MediaRenderer } from "@/components/berita/MediaRenderer";
// Import Komponen Client-Side
import ShareButtons from "@/components/ShareButtons";
import CommentSection from "@/components/CommentSection";

// Import Firestore SDK sisi server
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

import { ViewCounter } from "@/components/berita/ViewCounter";

type Params = Promise<{ slug: string }>;

interface Berita {
  id: string;
  mediaEmbed: { type: "youtube" | "instagram" | "tiktok"; url: string } | undefined;
  judul: string;
  kategori: string;
  tanggal: string;
  penulis: string;
  gambar: string;
  konten: string;
  slug: string;
}

// transformasi imagekit untuk og image
  const getOgImageUrl = (url: string) => {
    if (!url) return "https://www.smkalkaaffah.sch.id/images/og-default.jpg";

  //jika menggunakan Imagekit, otomatis beri instruksi resize 1200x630 dan kompresi 80%
    if (url.includes("ik.imagekit.io")) {
      const cleanUrl = url.split('?')[0].trim();
      return `${cleanUrl}?tr=w-1200,h-630,q-80`;
    }

    return url.trim();
  };

// 🎯 HELPER 1: Unescape Entitas HTML + Sanitasi Spasi Tersembunyi (\u00a0 & &nbsp;)
const decodeHtml = (htmlString: string) => {
  if (!htmlString) return "";

  let decoded = htmlString
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");

  return decoded
    .replace(/&nbsp;/gi, " ")
    .replace(/\u00a0/g, " ");
};

// 🎯 HELPER 2: Strip HTML Bersih Total (Untuk Meta SEO & Excerpt)
const stripHtml = (htmlString: string) => {
  if (!htmlString) return "";
  const decoded = decodeHtml(htmlString);
  return decoded
    .replace(/<[^>]*>?/gm, " ")
    .replace(/\s+/g, " ")
    .trim();
};

async function dapatkanBeritaDariFirestore(slug: string): Promise<Berita | null> {
  try {
    const q = query(collection(db, "berita"), where("slug", "==", slug), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docData = querySnapshot.docs[0].data();
      return { ...docData, id: querySnapshot.docs[0].id } as Berita;
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

  
  // 1. Sanitasi Deskripsi SEO
  const deskripsiBersih = stripHtml(a.konten);
  const deskripsiSeo = deskripsiBersih.substring(0, 150) + (deskripsiBersih.length > 150 ? "..." : "");

  // 2. Kunci URL Halaman & Gambar Bersih (Anti-Redirect & WA Scraper Friendly)
  const baseUrl = "https://www.smkalkaaffah.sch.id";
  const pageUrl = `${baseUrl}/berita/${a.slug}`;
  
  // Pastikan URL gambar bersih dari spasi tidak perlu (jika ada spasi terenkode %20 di-replace/sanitasi)
  const imageUrl = a.gambar ? a.gambar.trim() : `${baseUrl}/images/og-default.jpg`;
  const ogImageUrl = getOgImageUrl(imageUrl);

  return {
    metadataBase: new URL(baseUrl),
    title: `${a.judul} — ${school.name}`,
    description: deskripsiSeo,
    alternates: { 
      canonical: pageUrl 
    },
    openGraph: {
      title: a.judul,
      description: deskripsiSeo,
      url: pageUrl,
      siteName: school.name,
      locale: "id_ID",
      type: "article",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: a.judul,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: a.judul,
      description: deskripsiSeo,
      images: [imageUrl],
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
      name: article.penulis || "Guru SMK Al Kaaffah",
    },
  };

  return (
    <article className="container-page max-w-3xl py-24 sm:py-32 text-foreground">
      {/* 👁️ VIEW COUNTER INVISIBLE LOGIC */}
      <ViewCounter articleId={article.id} />
      
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
      <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl break-words [word-break:normal] [overflow-wrap:anywhere]">
        {article.judul}
      </h1>

      {/* Gambar Utama */}
      <div className="relative mt-8 w-full max-h-[500px] overflow-hidden rounded-2xl border shadow-soft bg-muted flex items-center justify-center">
        {/* 1. Background Blur */}
        <img 
          src={article.gambar} 
          alt="" 
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover blur-xl opacity-40 scale-110 pointer-events-none" 
        />

        {/* 2. Gambar Asli di Tengah */}
        <img 
          src={article.gambar} 
          alt={article.judul} 
          className="relative z-10 max-h-[500px] w-auto object-contain mx-auto rounded-lg shadow-md" 
        />
      </div>

      {/* KONTEN ARTIKEL UTAMA */}
      <div className="mt-8 max-w-none text-foreground leading-relaxed w-full overflow-hidden">
        <div 
          dangerouslySetInnerHTML={{ 
            __html: decodeHtml(article.konten) 
          }} 
          className="
            prose prose-slate dark:prose-invert max-w-none
            berita-content
            break-words [word-break:normal] [overflow-wrap:anywhere] [hyphens:none]
            [&_*]:[word-break:normal] [&_*]:[overflow-wrap:anywhere]
            prose-p:text-base sm:prose-p:text-lg prose-p:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:w-full prose-img:object-cover
            prose-strong:font-bold prose-strong:text-foreground
          "
        />
      </div>

      {/* 🎬 VIDEO EMBED (Jika Ada) */}
      <MediaRenderer embed={article?.mediaEmbed} />
      
      {/* 🚀 FITUR FITUR BARU */}
      {/* 1. Tombol Bagikan ke WhatsApp & Salin Link */}
      <ShareButtons title={article.judul} />

      {/* 2. Kolom Komentar Realtime */}
      <CommentSection articleIdentifier={article.slug} />

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
                    <h3 className="text-sm font-semibold leading-snug group-hover:text-primary line-clamp-2 break-words [word-break:normal] [overflow-wrap:anywhere]">
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