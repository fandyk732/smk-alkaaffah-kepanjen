"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Award, Quote, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, SectionHeading } from "@/components/motion-primitives";
import { achievements, testimonials as staticTestimonials, partners } from "@/data/site";
import { getFeaturedAlumni, AlumniData } from "@/lib/firebase";

export function HomeStatsAndAlumni() {
  const [alumniList, setAlumniList] = useState<AlumniData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniData | null>(null);

  useEffect(() => {
    async function fetchAlumni() {
      try {
        const data = await getFeaturedAlumni();
        if (data && data.length > 0) {
          setAlumniList(data);
        } else {
          setAlumniList(staticTestimonials);
        }
      } catch (err) {
        console.error("Failed to load alumni data:", err);
        setAlumniList(staticTestimonials);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAlumni();
  }, []);

  return (
    <>
      {/* ACHIEVEMENTS SECTION */}
      <section className="bg-section py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Prestasi" title="Membanggakan di berbagai bidang" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {achievements.map((a, i) => (
              <Reveal key={a.title} delay={i * 0.07}>
                <div className="h-full rounded-2xl border bg-card p-6">
                  <Award className="h-8 w-8 text-accent" />
                  <h3 className="mt-3 font-bold leading-snug">{a.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {a.field} • {a.year}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS / ALUMNI SECTION */}
      <section className="container-page py-16 overflow-hidden">
        <SectionHeading eyebrow="Alumni" title="Kata mereka tentang kami" />

        {isLoading ? (
          <div className="mt-10 flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {alumniList.map((t, i) => {
              const isLongQuote = t.quote.length > 140;
              const displayQuote = isLongQuote ? `${t.quote.substring(0, 140)}...` : t.quote;

              return (
                <Reveal key={t.id || t.name} delay={i * 0.08} className="h-full w-full min-w-0">
                  <div className="flex h-full w-full flex-col justify-between rounded-2xl border bg-card p-5 shadow-sm transition-all hover:shadow-md sm:p-6 min-w-0 overflow-hidden">
                    
                    {/* Upper Part: Quote & Content */}
                    <div className="w-full min-w-0">
                      <Quote className="h-8 w-8 text-primary/30 shrink-0" />
                      <p className="mt-3 text-sm leading-relaxed text-foreground/90 break-words whitespace-normal">
                        {displayQuote}
                      </p>
                      {isLongQuote && (
                        <button
                          onClick={() => setSelectedAlumni(t)}
                          className="mt-2 text-xs font-semibold text-primary hover:underline focus:outline-none"
                        >
                          Baca selengkapnya
                        </button>
                      )}
                    </div>

                    {/* Lower Part: Profile Info */}
                    <div className="mt-6 flex w-full items-center gap-3 border-t pt-4 min-w-0">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground">
                        {t.name ? t.name.charAt(0) : "A"}
                      </span>
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <p className="truncate text-sm font-semibold text-foreground">{t.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>

                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>

      {/* MODAL / POPUP READ MORE */}
      {selectedAlumni && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border bg-card p-6 shadow-xl">
            <Quote className="h-8 w-8 text-primary/30" />
            <p className="mt-4 max-h-[60vh] overflow-y-auto break-words text-sm leading-relaxed text-foreground">
              {selectedAlumni.quote}
            </p>
            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground">
                  {selectedAlumni.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="truncate text-sm font-semibold">{selectedAlumni.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{selectedAlumni.role}</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="ml-3 shrink-0" onClick={() => setSelectedAlumni(null)}>
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* PARTNERS SECTION */}
      <section className="container-page py-12">
        <p className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Dipercaya oleh mitra industri
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {partners.map((p) => (
            <span
              key={p}
              className="text-lg font-bold text-muted-foreground/60 transition-colors hover:text-primary"
            >
              {p}
            </span>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="container-page py-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border bg-section p-10 text-center shadow-soft lg:p-16">
            <div className="absolute -right-16 -top-16 h-56 w-56 animate-blob bg-primary/15 blur-2xl" />
            <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-4xl">
              Siap menjadi bagian dari kami?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
              Sistem Penerimaan Murid Baru (SPMB) telah dibuka. Amankan kursimu sekarang dan mulai perjalanan menuju masa depan gemilang.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-gradient-primary">
                <Link href="/ppdb">
                  Daftar Sekarang <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/kontak">Hubungi Kami</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}