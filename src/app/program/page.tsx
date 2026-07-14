import type { Metadata } from "next";
import { Network, Code2, Clapperboard, Calculator, CheckCircle2, BookOpen, Award, Activity } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion-primitives";
import { programs, school } from "@/data/site";

export const metadata: Metadata = {
  title: `Program Keahlian — ${school.name}`,
  description: "Program keahlian TKJ, RPL, Multimedia, dan Akuntansi dengan kurikulum berbasis industri.",
  alternates: { canonical: "/program" },
  openGraph: { title: `Program Keahlian — ${school.name}`, url: "/program" },
};

const iconMap = { Network, Code2, Clapperboard, Calculator } as const;

const tkjCurriculum = [
  "Dasar Komputer & Jaringan", "Administrasi Sistem Jaringan", "Teknologi Jaringan Berbasis Luas (WAN)",
  "Keamanan Jaringan", "Komputasi Awan (Cloud)", "Internet of Things (IoT)",
];
const competencies = [
  "Merancang & membangun jaringan LAN/WAN", "Konfigurasi router & switch",
  "Administrasi server Linux & Windows", "Manajemen keamanan jaringan", "Troubleshooting infrastruktur IT",
];
const certifications = ["Cisco CCNA", "MikroTik MTCNA", "BNSP Teknik Jaringan", "Junior Network Administrator"];

export default function ProgramPage() {
  return (
    <>
      <PageHero eyebrow="Program Keahlian" title="Kompetensi keahlian masa depan" description="Empat program keahlian yang dirancang mengikuti standar dan kebutuhan dunia industri." />

      <section className="container-page py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((p, i) => {
            const Icon = iconMap[p.icon as keyof typeof iconMap];
            return (
              <Reveal key={p.code} delay={i * 0.07}>
                <div className="h-full rounded-2xl border bg-card p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-primary"><Icon className="h-6 w-6" /></span>
                  <span className="mt-4 inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">{p.code}</span>
                  <h3 className="mt-2 font-bold leading-snug">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="bg-section py-16" id="tkj">
        <div className="container-page">
          <div className="overflow-hidden rounded-3xl bg-gradient-primary p-8 text-primary-foreground lg:p-12">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Program Unggulan</span>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Teknik Komputer &amp; Jaringan (TKJ)</h2>
            <p className="mt-4 max-w-2xl opacity-90">Program keahlian unggulan yang membekali siswa dengan kemampuan merancang, membangun, dan mengelola infrastruktur jaringan komputer berskala industri.</p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border bg-card p-7">
                <BookOpen className="h-8 w-8 text-primary" />
                <h3 className="mt-3 text-xl font-bold">Kurikulum</h3>
                <ul className="mt-4 space-y-2">
                  {tkjCurriculum.map((c) => <li key={c} className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />{c}</li>)}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="h-full rounded-2xl border bg-card p-7">
                <Activity className="h-8 w-8 text-primary" />
                <h3 className="mt-3 text-xl font-bold">Standar Kompetensi</h3>
                <ul className="mt-4 space-y-2">
                  {competencies.map((c) => <li key={c} className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />{c}</li>)}
                </ul>
              </div>
            </Reveal>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border bg-card p-7">
                <Activity className="h-8 w-8 text-primary" />
                <h3 className="mt-3 text-xl font-bold">Kegiatan Pembelajaran</h3>
                <p className="mt-3 text-sm text-muted-foreground">Pembelajaran 70% praktik di laboratorium modern, proyek nyata, kunjungan industri, magang (PKL), serta pembinaan kompetisi LKS dan sertifikasi profesi.</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="h-full rounded-2xl border bg-card p-7">
                <Award className="h-8 w-8 text-primary" />
                <h3 className="mt-3 text-xl font-bold">Sertifikasi</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {certifications.map((c) => <span key={c} className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">{c}</span>)}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
