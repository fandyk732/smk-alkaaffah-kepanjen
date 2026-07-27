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
// TKJ
const tkjCurriculum = [
  "Dasar Komputer & Jaringan", "Administrasi Sistem Jaringan", "Routing & Switching", "Keamanan Jaringan (network security)", "Internet of Things (IoT)",
  "Keamanan Jaringan", 
];
const competencies = [
  "Mampu merancang & membangun jaringan LAN/WAN", "Mampu Mengkonfigurasi router & switch",
  "Mampu mengelola server Linux maupun Windows", "Mampu menerapkan keamanan Jaringan Komputer", "Mampu melakukan Troubleshooting infrastruktur Jaringan", "Mampu mengimplementasikan layanan Cloud dan Virtualisasi dasar",
];
const certifications = ["Cisco CCNA", "MikroTik MTCNA", "BNSP Junior Network Administrator", "Sertifikasi Administrasi Server"];
const prospekKarier = [ "Network Engineer", "System Administrator", "IT Support", "Cyber Security Analyst", "Cloud Engineer", "IoT Developer", "IT Consultant", "Freelance Network Specialist"];

// TKR
const kurikulumtkr = [
  "Dasar Mesin Otomotif", "Tune Up Mesin", "Sistem Kelistrikan Kendaraan", "Chassis dan Suspensi", "Sistem Injeksi", "Engine Management System", "Diagnostik Kendaraan",
  "Servis Kendaraan Listrik", "Modifikasi motor", 
];
const kompetensitkr = [
  "Mampu melakukan servis berkala kendaraan", "Mampu melakukan diagnosis kerusakan kendaraan",
  "Mampu melakukan tune up mesin", "Mampu memperbaiki sistem kelistrikan kendaraan", "Mampu menggunakan scanner otomotif modern", "Mampu menerapkan prosedur keselamatan kerja di Bengkel", 
];
const sertifikasitkr = ["BNSP Teknik Otomotif", "Yamaha Technical Skill", "Honda Technical Skill", "Sertitikasi Teknisi Kendaraan Ringan"];
const prospekKarierTKR = ["Teknisi Bengkel Resmi (Astra, Honda, Yamaha, Suzuki)", "Teknisi Bengkel Umum", "Teknisi Kendaraan Listrik", "Teknisi Modifikasi Motor", "Freelance Teknisi Otomotif"];

// TAV
const kurikulumtav = [
  "Dasar Elektronika", "Sistem Audio Video", "Instalasi Perangkat Elektronik",
  "Perawatan Elektronik", "Robotik Dasar", "PLTS (Pembangkit Listrik Tenaga Surya)", "Internet of Things (IoT)",
];
const kompetensitav = [
  "Mampu melakukan instalasi sistem audio dan video", "Mampu merawat dan memperbaiki perangkat elektornika",
  "Mampu membaca diagram dan rangkaian elektronika", "Mampu mengembangkan proyek berbasis IoT", "Mampu melakukan troubleshooting perangkat elektronik",
];
const sertifikasitav = ["BNSP Teknik Elektronika", "Sertifikasi Instalasi Audio Video", "Sertifikasi Teknik Elektronika Dasar", ];
const prospekKarierTAV = ["Teknisi Elektronika", "Teknisi Audio Video", "Teknisi IoT", "Freelance Teknisi Elektronika"];

// DIGITAL MARKETING
const kurikulumdm = [
  "Content Marketing", "Social Media Marketing", "Search Engine Optimization (SEO)",
  "Marketplace Management", "Afiliate Marketing", "Prompt Engineering", "Copywriting", "Branding", "Web Devlopment Dasar", "Podcast & Video Content"
];
const kompetensidm = [
  "Mampu menyusun strategi Pemasaran Digital", "Mampu mengelola media sosial secara profesional",
  "Mampu membuat konten visual dan copywriting yang menarik", "Mampu mengoptimalkan website menggunakan SEO", "Mampu menjalankan kampanye iklan digital", "Mampu memanfaatkan AI sebagai alat produktivitas pemasaran"
];
const sertifikasidm = ["Google Digital Marketing", "Google Analytics", "Google Ads", "Meta Digital Marketing", "BNSP Digital Marketing"];
const prospekKarierDM = ["Digital Marketing Specialist", "Social Media Manager", "Content Creator", "SEO Specialist", "Affiliate Marketing Manager", "Brand Strategist", "Freelance Digital Marketer"];
  
// KELAS BAHASA JEPANG
const kurikulumbj = [
  "Nihongo Raku Raku (Dasar)", "Mina no Nihongo", "Kaiwa (Percakapan) ",
  "Kanji Dasar", "Persiapan JFT/JLPT", "Budaya & Etika Kerja Jepang",
];
const kompetensibj = [
  "Mampu berkomunikasi dalam bahasa Jepang tingkat dasar hingga menengah", "Memahami budaya dan etika kerja Masyarakat Jepang", "Mampu menghadapi wawancara (Mensetsu) perusahaan Jepang",
  "Siap mengikuti sertifikasi kemampuan bahasa Jepang (JLPT/JFT)", "Memiliki bekal untuk program magang maupun kerja di Jepang",
];
const sertifikasibj = ["Japanese Language Proficiency Test (JLPT) dan Japan Foundation Test (JFT)", "Sertifikat Kompetensi Bahasa Jepang Internal", "Sertifikat Pelatihan Budaya Jepang",];
const prospekKarierBJ = ["Penerjemah Bahasa Jepang", "Tour Guide Jepang", "Bekerja di Banyak Perusahaan di Negara Jepang", "Freelance Penerjemah & Tutor Bahasa Jepang"];

export default function ProgramPage() {
  return (
    <>
      <PageHero eyebrow="Program Keahlian" title="Kompetensi keahlian masa depan" description="Empat program keahlian plus program unggulan yang dirancang mengikuti standar dan kebutuhan dunia industri." />

      {/* Grid Card Program dengan Autoscroll */}
      <section className="container-page py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((p, i) => {
            const Icon = iconMap[p.icon as keyof typeof iconMap];
            // 🎯 Mapping p.code ke id section target
            const targetId = p.code.toLowerCase(); // 'jb' / 'bj', 'tkj', 'tav', 'tkr', 'dm'

            return (
              <Reveal key={p.code} delay={i * 0.07}>
                <a 
                  href={`#${targetId === 'jb' ? 'bj' : targetId}`} 
                  className="group block h-full rounded-2xl border bg-card p-6 transition-all hover:border-primary hover:shadow-md cursor-pointer"
                >
                  <span className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    {p.code}
                  </span>
                  <h3 className="mt-3 font-bold leading-snug transition-colors group-hover:text-primary">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                </a>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* section Bahasa Jepang */}
      <section className="bg-section py-16 scroll-mt-24" id="bj">
        <div className="container-page">
          <div className="overflow-hidden rounded-3xl bg-gradient-primary p-8 text-primary-foreground lg:p-12">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Program Unggulan</span>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Kelas Bahasa Jepang</h2>
            <p className="mt-4 max-w-2xl opacity-90">Kuasai bahasa Jepang sejak SMK dan buka peluang magang, kuliah, hingga bekerja di perusahaan Jepang.</p>
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
                <p className="mt-3 text-sm text-muted-foreground">Pembelajaran dikemas secara interaktif melalui praktik percakapan (Kaiwa), simulasi wawancara kerja (Mensetsu), pengenalan budaya Jepang, latihan mendengar (Listening), hingga pembinaan intensif sebagai persiapan mengikuti sertifikasi dan seleksi kerja.</p>
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
            <Reveal delay={0.1}>
              <div className="h-full rounded-2xl border bg-card p-7">
                <Award className="h-8 w-8 text-primary" />
                <h3 className="mt-3 text-xl font-bold">Prospek Karier</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {prospekKarierBJ.map((c) => <span key={c} className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">{c}</span>)}
                </div>
                 <div className="mt-8 flex justify-end">
                  <a 
                    href="#" 
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    ↑ Kembali ke pilihan program
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* section TKJ */}
      <section className="bg-section py-16 scroll-mt-24" id="tkj">
        <div className="container-page">
          <div className="overflow-hidden rounded-3xl bg-gradient-primary p-8 text-primary-foreground lg:p-12">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Kompetensi Keahlian</span>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Teknik Komputer &amp; Jaringan (TKJ)</h2>
            <p className="mt-4 max-w-2xl opacity-90">Belajar jaringan komputer, server, cloud, dan cybersecurity melalui praktik langsung bersama teknologi yang digunakan industri.</p>
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
                <p className="mt-3 text-sm text-muted-foreground">Siswa belajar melalui praktik laboratorium jaringan, simulasi proyek industri, konfigurasi perangkat Cisco dan MikroTik, pembangunan server, kompetisi LKS, kunjungan industri, serta Praktik Kerja Lapangan (PKL) di perusahaan mitra.</p>
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
            <Reveal delay={0.1}>
              <div className="h-full rounded-2xl border bg-card p-7">
                <Award className="h-8 w-8 text-primary" />
                <h3 className="mt-3 text-xl font-bold">Prospek Karier</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {prospekKarier.map((c) => <span key={c} className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">{c}</span>)}
                </div>
                 <div className="mt-8 flex justify-end">
                  <a 
                    href="#" 
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    ↑ Kembali ke pilihan program
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* section TAV */}
      <section className="bg-section py-16 scroll-mt-24" id="tav">
        <div className="container-page">
          <div className="overflow-hidden rounded-3xl bg-gradient-primary p-8 text-primary-foreground lg:p-12">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Kompetensi Keahlian</span>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Teknik Audio Video (TAV)</h2>
            <p className="mt-4 max-w-2xl opacity-90">Kuasai instalasi, perawatan, dan pengembangan sistem elektronika modern melalui pembelajaran berbasis praktik.</p>
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
                <p className="mt-3 text-sm text-muted-foreground">Siswa melaksanakan praktik perakitan rangkaian elektronika, instalasi audio video, proyek IoT, perawatan perangkat elektronik, kunjungan industri, serta Praktik Kerja Lapangan (PKL) bersama mitra industri.</p>
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
            <Reveal delay={0.1}>
              <div className="h-full rounded-2xl border bg-card p-7">
                <Award className="h-8 w-8 text-primary" />
                <h3 className="mt-3 text-xl font-bold">Prospek Karier</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {prospekKarierTAV.map((c) => <span key={c} className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">{c}</span>)}
                </div>
                 <div className="mt-8 flex justify-end">
                  <a 
                    href="#" 
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    ↑ Kembali ke pilihan program
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* section TKR */}
      <section className="bg-section py-16 scroll-mt-24" id="tkr">
        <div className="container-page">
          <div className="overflow-hidden rounded-3xl bg-gradient-primary p-8 text-primary-foreground lg:p-12">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Kompetensi Keahlian</span>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Teknik Kendaraan Ringan (TKR)</h2>
            <p className="mt-4 max-w-2xl opacity-90">Kuasai teknologi kendaraan modern melalui praktik intensif dan pembelajaran berbasis standar industri.</p>
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
                <p className="mt-3 text-sm text-muted-foreground">Pembelajaran dilakukan melalui praktik bengkel, tune up kendaraan, overhaul mesin, penggunaan scanner modern, proyek perbaikan kendaraan, kunjungan industri, serta Praktik Kerja Lapangan (PKL) di bengkel dan perusahaan otomotif.</p>
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
            <Reveal delay={0.1}>
              <div className="h-full rounded-2xl border bg-card p-7">
                <Award className="h-8 w-8 text-primary" />
                <h3 className="mt-3 text-xl font-bold">Prospek Karier</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {prospekKarierTKR.map((c) => <span key={c} className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">{c}</span>)}
                </div>
                 <div className="mt-8 flex justify-end">
                  <a 
                    href="#" 
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    ↑ Kembali ke pilihan program
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* section Digital Marketing */}
      <section className="bg-section py-16 scroll-mt-24" id="dm">
        <div className="container-page">
          <div className="overflow-hidden rounded-3xl bg-gradient-primary p-8 text-primary-foreground lg:p-12">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Kompetensi Keahlian</span>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Digital Marketing (DM)</h2>
            <p className="mt-4 max-w-2xl opacity-90">Pelajari strategi pemasaran digital, AI, media sosial, dan bisnis online untuk menjadi talenta yang dibutuhkan industri.</p>
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
                <p className="mt-3 text-sm text-muted-foreground">Pembelajaran dilakukan melalui project-based learning berupa pengelolaan media sosial, pembuatan website bisnis, produksi konten foto dan video, praktik optimasi SEO, simulasi kampanye digital, hingga kerja sama dengan pelaku UMKM dan industri.</p>
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
            <Reveal delay={0.1}>
              <div className="h-full rounded-2xl border bg-card p-7">
                <Award className="h-8 w-8 text-primary" />
                <h3 className="mt-3 text-xl font-bold">Prospek Karier</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {prospekKarierDM.map((c) => <span key={c} className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">{c}</span>)}
                </div>
                <div className="mt-8 flex justify-end">
                  <a 
                    href="#" 
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    ↑ Kembali ke pilihan program
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}