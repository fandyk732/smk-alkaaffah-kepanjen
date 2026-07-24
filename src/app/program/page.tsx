import type { Metadata } from "next";
import { Network, Code2, Clapperboard, Calculator, CheckCircle2, BookOpen, Award, Activity } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion-primitives";
import { programs, school } from "@/data/site";

export const metadata: Metadata = {
  title: `Program Keahlian — ${school.name}`,
  description: "Program keahlian TKJ, TAV, TKR, Digital Marketing, dan Kelas Bahasa Jepang dengan kurikulum berbasis industri.",
  alternates: { canonical: "/program" },
  openGraph: { title: `Program Keahlian — ${school.name}`, url: "/program" },
};

const iconMap = { Network, Code2, Clapperboard, Calculator } as const;

// Data untuk masing-masing program keahlian
  //TKJ
const tkjCurriculum = [
  "Dasar Komputer & Jaringan", "Administrasi Sistem Jaringan", "Teknologi Jaringan Berbasis Luas (WAN)",
  "Keamanan Jaringan", "Komputasi Awan (Cloud)", "Internet of Things (IoT)",
];
const competencies = [
  "Merancang & membangun jaringan LAN/WAN", "Konfigurasi router & switch",
  "Administrasi server Linux & Windows", "Manajemen keamanan jaringan", "Troubleshooting infrastruktur IT",
];
const certifications = ["Cisco CCNA", "MikroTik MTCNA", "BNSP Teknik Jaringan", "Junior Network Administrator"];

  //TKR
const kurikulumtkr = [
  "Perawatan Mesin", "Ganti Oli", "Balancing Roda",
  "Servis Kendaraan Listrik", "Modifikasi motor", "Internet of Things (IoT)",
];
const kompetensitkr = [
  "Mbuh ga eruh", "Konfigurasi router & switch",
  "Administrasi server Linux & Windows", "Manajemen keamanan jaringan", "Troubleshooting infrastruktur IT",
];
const sertifikasitkr = ["MPM Honda", "Suzuki Motor", "BNSP Teknik otomotif", "LSP Yamaha"];

  //TAV
const kurikulumtav = [
  "Perawatan AC dan Mesin Cuci", "Instalasi AC", "PLTS",
  "Cetak Grafir", "Robotik", "Internet of Things (IoT)",
];
const kompetensitav = [
  "Mbuh ga eruh", "123",
  "Administrasi server Linux & Windows", "Manajemen keamanan jaringan", "Troubleshooting infrastruktur IT",
];
const sertifikasitav = ["MPM Honda", "Suzuki Motor", "BNSP Teknik otomotif", "LSP Yamaha"];

  //DIGITAL MARKETING
  const kurikulumdm = [
  "Affiliate Marketing", "Content Marketing", "prompt engineering",
  "web scraping", "podcasting", "Internet of Things (IoT)",
];
const kompetensidm = [
  "Mbuh ga eruh", "Konfigurasi router & switch",
  "Administrasi server Linux & Windows", "Manajemen keamanan jaringan", "Troubleshooting infrastruktur IT",
];
const sertifikasidm = ["MPM Honda", "Suzuki Motor", "BNSP Teknik otomotif", "LSP Yamaha"];

  //KELAS BAHASA JEPANG
const kurikulumbj = [
  "Basic Raku Raku", "Mina no Nihonggo", "Balancing Roda",
  "Servis Kendaraan Listrik", "Modifikasi motor", "Internet of Things (IoT)",
];
const kompetensibj = [
  "Mbuh ga eruh", "Konfigurasi router & switch",
  "Administrasi server Linux & Windows", "Manajemen keamanan jaringan", "Troubleshooting infrastruktur IT",
];
const sertifikasibj = ["MPM Honda", "Suzuki Motor", "BNSP Teknik otomotif", "LSP Yamaha"];

export default function ProgramPage() {
  return (
    <>
      <PageHero eyebrow="Program Keahlian" title="Kompetensi keahlian masa depan" description="Empat program keahlian plus program unggulan yang dirancang mengikuti standar dan kebutuhan dunia industri." />

      <section className="container-page py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((p, i) => {
            const Icon = iconMap[p.icon as keyof typeof iconMap];
            return (
              <Reveal key={p.code} delay={i * 0.07}>
                <div className="h-full rounded-2xl border bg-card p-6">
                  
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
                  <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Kompetensi Keahlian</span>
                  <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Kelas Bahasa Jepang</h2>
                  <p className="mt-4 max-w-2xl opacity-90">Program khusus untuk memperkuat kemampuan berbahasa Jepang siswa dan alumni.</p>
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-2">
                  <Reveal>
                    <div className="h-full rounded-2xl border bg-card p-7">
                      <BookOpen className="h-8 w-8 text-primary" />
                      <h3 className="mt-3 text-xl font-bold">Kurikulum</h3>
                      <ul className="mt-4 space-y-2">
                        {kurikulumbj.map((c) => <li key={c} className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />{c}</li>)}
                      </ul>
                    </div>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <div className="h-full rounded-2xl border bg-card p-7">
                      <Activity className="h-8 w-8 text-primary" />
                      <h3 className="mt-3 text-xl font-bold">Standar Kompetensi</h3>
                      <ul className="mt-4 space-y-2">
                        {kompetensibj.map((c) => <li key={c} className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />{c}</li>)}
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
                        {sertifikasibj.map((c) => <span key={c} className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">{c}</span>)}
                      </div>
                    </div>
                  </Reveal>
                </div>
              </div>
            </section>

<section className="bg-section py-16" id="tkj">
        <div className="container-page">
          <div className="overflow-hidden rounded-3xl bg-gradient-primary p-8 text-primary-foreground lg:p-12">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Kompetensi Keahlian</span>
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

      <section className="bg-section py-16" id="tkj">
        <div className="container-page">
          <div className="overflow-hidden rounded-3xl bg-gradient-primary p-8 text-primary-foreground lg:p-12">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Kompetensi Keahlian</span>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Teknik Audio Video (TAV)</h2>
            <p className="mt-4 max-w-2xl opacity-90">Program keahlian unggulan yang membekali siswa dengan kemampuan merancang, membangun, dan mengelola infrastruktur jaringan komputer berskala industri.</p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border bg-card p-7">
                <BookOpen className="h-8 w-8 text-primary" />
                <h3 className="mt-3 text-xl font-bold">Kurikulum</h3>
                <ul className="mt-4 space-y-2">
                  {kurikulumtav.map((c) => <li key={c} className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />{c}</li>)}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="h-full rounded-2xl border bg-card p-7">
                <Activity className="h-8 w-8 text-primary" />
                <h3 className="mt-3 text-xl font-bold">Standar Kompetensi</h3>
                <ul className="mt-4 space-y-2">
                  {kompetensitav.map((c) => <li key={c} className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />{c}</li>)}
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
                  {sertifikasitav.map((c) => <span key={c} className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">{c}</span>)}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-section py-16" id="tkj">
        <div className="container-page">
          <div className="overflow-hidden rounded-3xl bg-gradient-primary p-8 text-primary-foreground lg:p-12">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Kompetensi Keahlian</span>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Teknik Kendaraan Ringan (TKR)</h2>
            <p className="mt-4 max-w-2xl opacity-90">Program keahlian unggulan yang membekali siswa dengan kemampuan merancang, membangun, dan mengelola infrastruktur jaringan komputer berskala industri.</p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border bg-card p-7">
                <BookOpen className="h-8 w-8 text-primary" />
                <h3 className="mt-3 text-xl font-bold">Kurikulum</h3>
                <ul className="mt-4 space-y-2">
                  {kurikulumtkr.map((c) => <li key={c} className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />{c}</li>)}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="h-full rounded-2xl border bg-card p-7">
                <Activity className="h-8 w-8 text-primary" />
                <h3 className="mt-3 text-xl font-bold">Standar Kompetensi</h3>
                <ul className="mt-4 space-y-2">
                  {kompetensitkr.map((c) => <li key={c} className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />{c}</li>)}
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
                  {sertifikasitkr.map((c) => <span key={c} className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">{c}</span>)}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

       <section className="bg-section py-16" id="tkj">
        <div className="container-page">
          <div className="overflow-hidden rounded-3xl bg-gradient-primary p-8 text-primary-foreground lg:p-12">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Kompetensi Keahlian</span>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Digital Marketing (DM)</h2>
            <p className="mt-4 max-w-2xl opacity-90">Program keahlian unggulan yang membekali siswa dengan kemampuan merancang, membangun, dan mengelola infrastruktur jaringan komputer berskala industri.</p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border bg-card p-7">
                <BookOpen className="h-8 w-8 text-primary" />
                <h3 className="mt-3 text-xl font-bold">Kurikulum</h3>
                <ul className="mt-4 space-y-2">
                  {kurikulumdm.map((c) => <li key={c} className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />{c}</li>)}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="h-full rounded-2xl border bg-card p-7">
                <Activity className="h-8 w-8 text-primary" />
                <h3 className="mt-3 text-xl font-bold">Standar Kompetensi</h3>
                <ul className="mt-4 space-y-2">
                  {kompetensidm.map((c) => <li key={c} className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />{c}</li>)}
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
                  {sertifikasidm.map((c) => <span key={c} className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">{c}</span>)}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
