"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, Network, Code2, Clapperboard, Calculator, Award, Quote,
  CheckCircle2, Sparkles, Building2, GraduationCap, Cpu, ShieldCheck, Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, SectionHeading, Counter } from "@/components/motion-primitives";
import {
  stats, programs, news, achievements, testimonials, partners, school,
} from "@/data/site";
import heroImg from "@/assets/hero.jpg";

const iconMap = { Network, Code2, Clapperboard, Calculator } as const;

export function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="container-page relative grid items-center gap-12 py-12 lg:grid-cols-2 lg:py-20">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full glass-card px-4 py-1.5 text-xs font-semibold text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" /> Sekolah Vokasi Unggulan Kepanjen
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Mencetak Generasi <span className="text-gradient">Unggul</span> &amp; Siap Kerja
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-5 max-w-xl text-lg text-muted-foreground"
          >
            {school.description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Button asChild size="lg" className="bg-gradient-primary">
              <Link href="/ppdb">Daftar PPDB <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/program">Lihat Program</Link>
            </Button>
          </motion.div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
            {["Terakreditasi A", "Kurikulum Industri", "Sertifikasi Kompetensi"].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> {t}
              </span>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative"
        >
          <div className="overflow-hidden rounded-3xl border shadow-elegant">
            <img src={heroImg.src} width={1280} height={960} alt="Siswa SMK Al Kaaffah belajar di laboratorium komputer" className="h-full w-full object-cover" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-6 -left-6 glass-card rounded-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
                <Award className="h-5 w-5" />
              </span>
              <div>
                <p className="text-lg font-extrabold leading-none">95%</p>
                <p className="text-xs text-muted-foreground">Lulusan terserap industri</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* INTRO */}
      <section className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            align="left"
            eyebrow="Tentang Kami"
            title="Pendidikan vokasi yang relevan dengan masa depan"
            description="SMK Al Kaaffah Kepanjen hadir untuk membekali siswa dengan kompetensi teknis, karakter islami yang kuat, serta kesiapan menghadapi dunia kerja dan wirausaha di era digital."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Cpu, t: "Teknologi Terkini", d: "Lab modern & perangkat industri." },
              { icon: ShieldCheck, t: "Karakter Islami", d: "Pembinaan akhlak setiap hari." },
              { icon: Building2, t: "Mitra Industri", d: "Magang & rekrutmen langsung." },
              { icon: GraduationCap, t: "Guru Kompeten", d: "Tenaga pendidik tersertifikasi." },
            ].map((f, i) => (
              <Reveal key={f.t} delay={i * 0.07}>
                <div className="h-full rounded-2xl border bg-card p-5 transition-shadow hover:shadow-soft">
                  <f.icon className="h-7 w-7 text-primary" />
                  <h3 className="mt-3 font-semibold">{f.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRINCIPAL */}
      <section className="bg-section py-16">
        <div className="container-page grid gap-8 lg:grid-cols-3 lg:items-center">
          <Reveal>
            <div className="rounded-3xl bg-gradient-primary p-8 text-primary-foreground shadow-elegant">
              <Quote className="h-10 w-10 opacity-80" />
              <p className="mt-4 text-sm font-medium opacity-90">Sambutan</p>
              <p className="text-xl font-bold">Kepala Sekolah</p>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-2">
            <blockquote className="text-lg leading-relaxed text-foreground">
              &quot;Selamat datang di SMK Al Kaaffah Kepanjen. Kami berkomitmen menghadirkan pendidikan
              vokasi berkualitas yang memadukan kompetensi, karakter, dan inovasi. Bersama, kita
              siapkan generasi yang tangguh, beriman, dan unggul menghadapi tantangan masa depan.&quot;
            </blockquote>
            <p className="mt-5 font-semibold">Drs. H. Ahmad Kaaffah, M.Pd.</p>
            <p className="text-sm text-muted-foreground">Kepala SMK Al Kaaffah Kepanjen</p>
          </Reveal>
        </div>
      </section>

      {/* STATS */}
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

      {/* PROGRAMS */}
      <section className="container-page py-16">
        <SectionHeading eyebrow="Program Keahlian" title="Pilih jurusan sesuai passion-mu" description="Empat kompetensi keahlian yang dirancang mengikuti standar dunia industri." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((p, i) => {
            const Icon = iconMap[p.icon as keyof typeof iconMap];
            return (
              <Reveal key={p.code} delay={i * 0.07}>
                <motion.div whileHover={{ y: -6 }} className="group h-full rounded-2xl border bg-card p-6 transition-shadow hover:shadow-elegant">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-gradient-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="mt-4 inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">{p.code}</span>
                  <h3 className="mt-2 font-bold leading-snug">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* TKJ HIGHLIGHT */}
      <section className="container-page py-16">
        <div className="overflow-hidden rounded-3xl border bg-gradient-primary text-primary-foreground shadow-elegant">
          <div className="grid gap-8 p-8 lg:grid-cols-2 lg:items-center lg:p-12">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                <Wifi className="h-3.5 w-3.5" /> Program Unggulan
              </span>
              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Teknik Komputer &amp; Jaringan</h2>
              <p className="mt-4 max-w-md opacity-90">
                Jurusan favorit dengan fasilitas laboratorium jaringan lengkap, sertifikasi vendor,
                dan langganan juara LKS. Siapkan dirimu menjadi network engineer profesional.
              </p>
              <ul className="mt-6 grid gap-2 text-sm">
                {["Routing & Switching", "Server & Cloud", "Keamanan Jaringan", "Sertifikasi Cisco & MikroTik"].map((t) => (
                  <li key={t} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> {t}</li>
                ))}
              </ul>
              <Button asChild size="lg" variant="secondary" className="mt-8">
                <Link href="/program">Pelajari TKJ <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[{ v: "100%", l: "Praktik Industri" }, { v: "8+", l: "Sertifikasi" }, { v: "1st", l: "Juara LKS Provinsi" }, { v: "15+", l: "Mitra IT" }].map((b) => (
                <div key={b.l} className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                  <p className="text-3xl font-extrabold">{b.v}</p>
                  <p className="mt-1 text-sm opacity-90">{b.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section className="container-page py-16">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading align="left" eyebrow="Berita Terbaru" title="Kabar & kegiatan sekolah" />
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/berita">Semua berita <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {news.map((n, i) => (
            <Reveal key={n.slug} delay={i * 0.08}>
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
      </section>

      {/* ACHIEVEMENTS */}
      <section className="bg-section py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Prestasi" title="Membanggakan di berbagai bidang" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {achievements.map((a, i) => (
              <Reveal key={a.title} delay={i * 0.07}>
                <div className="h-full rounded-2xl border bg-card p-6">
                  <Award className="h-8 w-8 text-accent" />
                  <h3 className="mt-3 font-bold leading-snug">{a.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{a.field} • {a.year}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
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

      {/* PARTNERS */}
      <section className="container-page py-12">
        <p className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">Dipercaya oleh mitra industri</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {partners.map((p) => (
            <span key={p} className="text-lg font-bold text-muted-foreground/60 transition-colors hover:text-primary">{p}</span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border bg-section p-10 text-center shadow-soft lg:p-16">
            <div className="absolute -right-16 -top-16 h-56 w-56 animate-blob bg-primary/15 blur-2xl" />
            <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-4xl">Siap menjadi bagian dari kami?</h2>
            <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
              Pendaftaran Peserta Didik Baru (PPDB) telah dibuka. Amankan kursimu sekarang dan mulai perjalanan menuju masa depan gemilang.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-gradient-primary">
                <Link href="/ppdb">Daftar Sekarang <ArrowRight className="ml-1 h-4 w-4" /></Link>
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
