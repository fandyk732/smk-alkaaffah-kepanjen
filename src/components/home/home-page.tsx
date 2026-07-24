"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight, Network, Code2, Clapperboard, Calculator, Award, Quote,
  CheckCircle2, Sparkles, Building2, GraduationCap, Cpu, ShieldCheck, Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, SectionHeading, Counter } from "@/components/motion-primitives";
import {
  stats, programs, achievements, testimonials, partners, school,
} from "@/data/site";
import heroImg from "@/assets/hero.jpg";

// Import Firestore
import { db } from "@/lib/firebase"; 
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

const iconMap = { Network, Code2, Clapperboard, Calculator } as const;

interface Berita {
  id: string;
  judul: string;
  slug: string;
  kategori: string;
  konten: string;
  gambar: string;
  tanggal: string;
}

// 🎯 HELPER STRIP HTML (Mencabutsemua tag <p>, <strong>, <a>, &nbsp; dll)
const stripHtml = (htmlString: string) => {
  if (!htmlString) return "";
  return htmlString
    .replace(/<[^>]*>/g, "") // Hapus semua tag HTML
    .replace(/&nbsp;/g, " ")  // Ubah &nbsp; jadi spasi normal
    .trim();
};

export function HomePage() {
  const [beritaTerbaru, setBeritaTerbaru] = useState<Berita[]>([]);
  const [loadingBerita, setLoadingBerita] = useState(true);

  useEffect(() => {
    const ambilBeritaTerbaru = async () => {
      try {
        const q = query(
          collection(db, "berita"),
          orderBy("createdAt", "desc"),
          limit(3)
        );
        const querySnapshot = await getDocs(q);
        const list: Berita[] = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Berita);
        });
        setBeritaTerbaru(list);
      } catch (error) {
        console.error("Gagal mengambil berita terbaru di Homepage:", error);
      } finally {
        setLoadingBerita(false);
      }
    };

    ambilBeritaTerbaru();
  }, []);

  return (
    <>
      {/* 1. HERO SECTION */}
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
              <Link href="/ppdb">Daftar SPMB<ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/program">Lihat Kompetensi Keahlian</Link>
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
          {/* 🚀 SESUDAH (NEXT.JS IMAGE DENGAN PRIORITY) */}
          <div className="overflow-hidden rounded-3xl border shadow-elegant relative h-[350px] sm:h-[450px] lg:h-[500px]">
            <Image 
              src={heroImg} 
              alt="Siswa SMK Al Kaaffah belajar di laboratorium komputer" 
              priority // 👈 INI KUNCI BIKIN SKOR LCP KENCANG & HIJAU!
              fill // Biar ukurannya responsive otomatis ngikutin container
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover" 
            />
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

      {/* 2. NEWS SECTION */}
      <section className="container-page py-16 border-t border-muted/30">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading align="left" eyebrow="Berita Terbaru" title="Kabar & kegiatan sekolah" />
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/berita">Semua berita <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>

        {loadingBerita ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : beritaTerbaru.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">Belum ada berita yang diterbitkan.</p>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {beritaTerbaru.map((n, i) => (
              <Reveal key={n.slug} delay={i * 0.08}>
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
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800";
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

                    {/* 🎯 BERSIHKAN KONTEN MENGGUNAKAN stripHtml */}
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

      {/* 3. INTRO SECTION */}
      <section className="container-page py-16 border-t border-muted/30">
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

      {/* 4. PRINCIPAL SECTION */}
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
            <p className="mt-5 font-semibold">Maya Dian Rosita, S.A.P</p>
            <p className="text-sm text-muted-foreground">Kepala SMK Al Kaaffah Kepanjen</p>
          </Reveal>
        </div>
      </section>

      {/* 5. STATS SECTION */}
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

      {/* 6. PROGRAMS SECTION */}
      <section className="container-page py-16">
        <SectionHeading eyebrow="Program Keahlian" title="Pilih Kompetensi Keahlian dan Program Unggulan Kami sesuai Passion-mu" description="Empat kompetensi Plus Program Unggulan keahlian yang dirancang mengikuti standar dunia industri." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((p, i) => {
            const Icon = iconMap[p.icon as keyof typeof iconMap];
            return (
              <Reveal key={p.code} delay={i * 0.07}>
                <motion.div whileHover={{ y: -6 }} className="group h-full rounded-2xl border bg-card p-6 transition-shadow hover:shadow-elegant">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-gradient-primary group-hover:text-primary-foreground">
                    {Icon && <Icon className="h-5 w-5" />}
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

      {/* 7. KELAS JEPANG HIGHLIGHT SECTION */}
      <section className="container-page py-16">
        <div className="overflow-hidden rounded-3xl border bg-gradient-primary text-primary-foreground shadow-elegant">
          <div className="grid gap-8 p-8 lg:grid-cols-2 lg:items-center lg:p-12">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                <Wifi className="h-3.5 w-3.5" /> Program Unggulan
              </span>
              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Kelas Bahasa Jepang</h2>
              <p className="mt-4 max-w-md opacity-90">
                Kelas Khusus Bahasa Jepang yang kami siapkan untuk siswa maupun alumni,
                agar dapat bersaing di dunia kerja global, khususnya di Jepang.
              </p>
              <ul className="mt-6 grid gap-2 text-sm">
                {["Sensei berlisensi N1", "Fasilitas kelas modern", "Biaya Terjangkau", "Peluang kerja di Jepang"].map((t) => (
                  <li key={t} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> {t}</li>
                ))}
              </ul>
              <Button asChild size="lg" variant="secondary" className="mt-8">
                <Link href="/program">Pelajari Semua Program Kami <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[{ v: "10++", l: "Mitra Kerja di Jepang" }, { v: "JLPT N4/N3", l: "Sertifikasi" }, { v: "<1 tahun", l: "Peluang Karier" }, { v: ">40%", l: "Dana Talangan" }].map((b) => (
                <div key={b.l} className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                  <p className="text-3xl font-extrabold">{b.v}</p>
                  <p className="mt-1 text-sm opacity-90">{b.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. ACHIEVEMENTS SECTION */}
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

      {/* 9. TESTIMONIALS SECTION */}
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

      {/* 10. PARTNERS SECTION */}
      <section className="container-page py-12">
        <p className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">Dipercaya oleh mitra industri</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {partners.map((p) => (
            <span key={p} className="text-lg font-bold text-muted-foreground/60 transition-colors hover:text-primary">{p}</span>
          ))}
        </div>
      </section>

      {/* 11. CTA SECTION */}
      <section className="container-page py-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border bg-section p-10 text-center shadow-soft lg:p-16">
            <div className="absolute -right-16 -top-16 h-56 w-56 animate-blob bg-primary/15 blur-2xl" />
            <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-4xl">Siap menjadi bagian dari kami?</h2>
            <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
              Sistem Penerimaan Murid Baru (SPMB) telah dibuka. Amankan kursimu sekarang dan mulai perjalanan menuju masa depan gemilang.
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