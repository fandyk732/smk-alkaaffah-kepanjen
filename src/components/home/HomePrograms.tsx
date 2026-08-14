"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Network, Code2, Clapperboard, Calculator, Wifi, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, SectionHeading } from "@/components/motion-primitives";
import { programs } from "@/data/site";

const iconMap = { Network, Code2, Clapperboard, Calculator } as const;

export function HomePrograms() {
  return (
    <>
      {/* PROGRAMS SECTION */}
      <section className="container-page py-16">
        <SectionHeading
          eyebrow="Program Keahlian"
          title="Kompetensi yang Bisa Menjadi Bekal Masa Depan"
          description="Setiap program dirancang untuk membangun keterampilan yang dapat diterapkan dalam dunia industri, pendidikan, maupun pengembangan usaha secara mandiri."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((p, i) => {
            const Icon = iconMap[p.icon as keyof typeof iconMap];
            return (
              <Reveal key={p.code} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="group h-full rounded-2xl border bg-card p-6 transition-shadow hover:shadow-elegant"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-gradient-primary group-hover:text-primary-foreground">
                    {Icon && <Icon className="h-5 w-5" />}
                  </span>
                  <span className="mt-4 inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">
                    {p.code}
                  </span>
                  <h3 className="mt-2 font-bold leading-snug">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* KELAS JEPANG HIGHLIGHT */}
      <section className="container-page py-16">
        <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border bg-gradient-primary text-primary-foreground shadow-elegant">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:items-center lg:p-12">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                <Wifi className="h-3.5 w-3.5" /> Program Unggulan
              </span>
              <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl lg:text-4xl">
                Kelas Bahasa Jepang
              </h2>
              <p className="mt-4 max-w-md text-sm sm:text-base opacity-90">
                Kelas Khusus Bahasa Jepang yang kami siapkan untuk siswa maupun alumni,
                agar dapat bersaing di dunia kerja global, khususnya di Jepang.
              </p>
              <ul className="mt-6 grid gap-2 text-sm">
                {[
                  "Sensei berlisensi N1",
                  "Fasilitas kelas modern",
                  "Biaya Terjangkau",
                  "Peluang kerja di Jepang",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" /> <span>{t}</span>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" variant="secondary" className="mt-8 w-full sm:w-auto">
                <Link href="/program">
                  Pelajari Semua Program Kami <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { v: "10++", l: "Mitra Kerja di Jepang" },
                { v: "JLPT N5/N4", l: "Sertifikasi" },
                { v: "<1 tahun", l: "Peluang Karier" },
                { v: ">40%", l: "Dana Talangan" },
              ].map((b) => (
                <div key={b.l} className="rounded-2xl bg-white/10 p-4 sm:p-5 backdrop-blur flex flex-col justify-between">
                  <p className="text-2xl sm:text-3xl font-extrabold leading-tight">{b.v}</p>
                  <p className="mt-1 text-xs sm:text-sm opacity-90 leading-snug">{b.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}