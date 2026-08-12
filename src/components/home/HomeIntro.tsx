"use client";

import { Reveal, SectionHeading } from "@/components/motion-primitives";
import { Cpu, ShieldCheck, Building2, GraduationCap, Quote } from "lucide-react";

export function HomeIntro() {
  const features = [
    { icon: Cpu, t: "Belajar melalui praktik", d: "Kompetensi tidak hanya dipelajari, tetapi diterapkan dalam pengalaman nyata." },
    { icon: ShieldCheck, t: "Terhubung dengan industri", d: "PKL dan kemitraan membantu siswa mengenal budaya serta kebutuhan dunia kerja." },
    { icon: Building2, t: "Mengembangkan kemandirian", d: "Siswa didorong mengenal kewirausahaan dan memanfaatkan kompetensi untuk menciptakan peluang." },
    { icon: GraduationCap, t: "Religi, Sains, Teknologi", d: "Membangun keseimbangan antara karakter, pengetahuan, dan keterampilan." },
  ];

  return (
    <>
      {/* INTRO SECTION */}
      <section className="container-page py-16 border-t border-muted/30">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            align="left"
            eyebrow="Tentang Kami"
            title="Di Sini, Belajar Bukan Sekadar untuk Lulus"
            description="Di SMK Al Kaaffah, siswa tidak hanya belajar teori. Mereka diberi ruang untuk mempraktikkan kompetensi, membuat karya, mengenal dunia industri, dan mengembangkan keterampilan yang dapat menjadi bekal untuk menciptakan peluang di masa depan."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((f, i) => (
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

      {/* PRINCIPAL SECTION */}
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
    </>
  );
}