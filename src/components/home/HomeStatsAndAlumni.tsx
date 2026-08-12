"use client";

import Link from "next/link";
import { Award, Quote, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, SectionHeading, Counter } from "@/components/motion-primitives";
import { stats, achievements, testimonials, partners } from "@/data/site";

export function HomeStatsAndAlumni() {
  return (
    <>
      {/* STATS SECTION */}
      <section className="container-page py-16">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="rounded-2xl border bg-card p-6 text-center transition-shadow hover:shadow-soft">
                <p className="text-4xl font-extrabold text-gradient">
                  <Counter value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

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

      {/* TESTIMONIALS SECTION */}
      <section className="container-page py-16">
        <SectionHeading eyebrow="Alumni" title="Kata mereka tentang kami" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <div className="h-full rounded-2xl border bg-card p-6">
                <Quote className="h-8 w-8 text-primary/30" />
                <p className="mt-3 text-sm leading-relaxed">{t.quote}</p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

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