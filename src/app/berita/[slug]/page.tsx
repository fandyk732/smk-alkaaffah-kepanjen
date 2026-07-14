import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { Reveal } from "@/components/motion-primitives";
import { Button } from "@/components/ui/button";
import { news, school } from "@/data/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const a = news.find((n) => n.slug === slug);
  if (!a) return { title: "Berita tidak ditemukan", robots: { index: false } };
  return {
    title: `${a.title} — ${school.name}`,
    description: a.excerpt,
    alternates: { canonical: `/berita/${a.slug}` },
    openGraph: {
      title: a.title,
      description: a.excerpt,
      type: "article",
      url: `/berita/${a.slug}`,
      images: [a.image],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = news.find((n) => n.slug === slug);
  if (!article) notFound();

  const related = news.filter((n) => n.slug !== article.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    image: article.image,
    datePublished: article.date,
    articleSection: article.category,
  };

  return (
    <article className="container-page max-w-3xl py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href="/berita"><ArrowLeft className="mr-1 h-4 w-4" /> Semua berita</Link>
      </Button>

      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5"><Tag className="h-4 w-4 text-primary" />{article.category}</span>
        <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" />{new Date(article.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
      </div>

      <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{article.title}</h1>

      <div className="mt-8 overflow-hidden rounded-2xl border shadow-soft">
        <img src={article.image} alt={article.title} className="w-full object-cover" />
      </div>

      <div className="prose mt-8 max-w-none text-foreground">
        <p className="text-lg text-muted-foreground">{article.excerpt}</p>
        <p className="mt-4 leading-relaxed">
          SMK Al Kaaffah Kepanjen terus berkomitmen menghadirkan kegiatan dan pencapaian yang membanggakan
          bagi seluruh warga sekolah. Kegiatan ini menjadi bagian dari upaya berkelanjutan untuk meningkatkan
          mutu pendidikan, memperkuat karakter siswa, dan mempererat sinergi dengan dunia industri.
        </p>
        <p className="mt-4 leading-relaxed">
          Dukungan dari seluruh elemen sekolah, orang tua, serta mitra menjadi kunci keberhasilan setiap
          program yang dijalankan. Semoga capaian ini memberi inspirasi dan motivasi untuk terus berkarya.
        </p>
      </div>

      <hr className="my-12" />

      <h2 className="text-xl font-bold">Artikel terkait</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {related.map((n, i) => (
          <Reveal key={n.slug} delay={i * 0.07}>
            <Link href={`/berita/${n.slug}`} className="group block overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-soft">
              <div className="aspect-video overflow-hidden">
                <img src={n.image} alt={n.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold leading-snug group-hover:text-primary">{n.title}</h3>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </article>
  );
}
