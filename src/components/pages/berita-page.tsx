"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion-primitives";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { news } from "@/data/site";

const categories = ["Semua", "Kegiatan", "Prestasi", "Kerja Sama"];
const PER_PAGE = 6;

export function BeritaPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Semua");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return news.filter((n) =>
      (cat === "Semua" || n.category === cat) &&
      n.title.toLowerCase().includes(q.toLowerCase())
    );
  }, [q, cat]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const items = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <PageHero eyebrow="Berita & Artikel" title="Kabar terbaru dari sekolah" description="Ikuti perkembangan kegiatan, prestasi, dan informasi terbaru SMK Al Kaaffah Kepanjen." />

      <section className="container-page py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Cari berita..." className="pl-9" aria-label="Cari berita" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => { setCat(c); setPage(1); }}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${cat === c ? "bg-gradient-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-primary/10"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {items.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">Tidak ada berita yang cocok.</p>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((n, i) => (
              <Reveal key={n.slug} delay={i * 0.06}>
                <Link href={`/berita/${n.slug}`} className="group block h-full overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-elegant">
                  <div className="aspect-video overflow-hidden">
                    <img src={n.image} alt={n.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-semibold text-primary">{n.category}</span>
                    <h3 className="mt-2 font-bold leading-snug group-hover:text-primary">{n.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{n.excerpt}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button key={i} variant={page === i + 1 ? "default" : "outline"} size="icon" onClick={() => setPage(i + 1)} aria-label={`Halaman ${i + 1}`}>
                {i + 1}
              </Button>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
