"use client";

import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, SectionHeading } from "@/components/motion-primitives";
import { Berita, stripHtml } from "@/hooks/useHomeNews";

interface Props {
  berita: Berita[];
  loading: boolean;
}

export function HomeNewsSection({ berita, loading }: Props) {
  return (
    <section className="container-page py-16 border-t border-muted/30">
      <div className="flex items-end justify-between gap-4">
        <SectionHeading align="left" eyebrow="Berita Terbaru" title="Kabar & kegiatan sekolah" />
        <Button asChild variant="ghost" className="hidden sm:inline-flex">
          <Link href="/berita">
            Semua berita <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : berita.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">Belum ada berita yang diterbitkan.</p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {berita.map((n, i) => (
            <Reveal key={n.slug || n.id} delay={i * 0.08}>
              <Link
                href={`/berita/${n.slug}`}
                className="group block h-full overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-elegant"
              >
                <div className="aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={n.gambar}
                    alt={n.judul}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800";
                    }}
                  />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-center text-xs font-semibold text-primary">
                    <span>{n.kategori}</span>
                    <span className="text-muted-foreground font-normal">{n.tanggal}</span>
                  </div>
                  <h3 className="mt-2 font-bold leading-snug group-hover:text-primary line-clamp-2">
                    {n.judul}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {stripHtml(n.konten)}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}