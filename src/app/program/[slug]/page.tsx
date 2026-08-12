import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, PlayCircle, Wrench, GraduationCap, Briefcase } from "lucide-react";

// Data Program Keahlian & Unggulan
const PROGRAM_DATA: Record<
  string,
  {
    title: string;
    code: string;
    desc: string;
    overview: string;
    skills: string[];
    careers: string[];
    videoUrl?: string; // YouTube Embed ID jika ada
    youtubeId?: string;
  }
> = {
  tkj: {
    title: "Teknik Komputer & Jaringan",
    code: "TKJ",
    desc: "Spesialisasi dalam administrasi server, instalasi jaringan fiber optic, cybersecurity, dan infrastruktur cloud.",
    overview:
      "Program Keahlian TKJ SMK Al Kaaffah membekali siswa dengan keahlian praktis dalam membangun, mengelola, dan mengamankan jaringan komputer modern skala industri.",
    skills: [
      "Infrastruktur Jaringan & Routing (MikroTik/Cisco)",
      "Administrasi Server & Cloud Computing",
      "Keamanan Jaringan (Cybersecurity Basic)",
      "Perakitan & Troubleshooting Hardware Computer",
    ],
    careers: ["Network Engineer", "System Administrator", "IT Support Specialist", "Cyber Security Analyst Junior"],
    youtubeId: "EIeeUqwMTdo",  
},
  tkr: {
    title: "Teknik Kendaraan Ringan",
    code: "TKR",
    desc: "Dunia otomotif modern, teknologi mesin injeksi (EFI), perbaikan kelistrikan mobil, dan diagnosis berbasis komputer.",
    overview:
      "Menggembleng mekanik handal yang siap menguasai teknologi otomotif kendaraan ringan terkini serta standar manajemen bengkel modern.",
    skills: [
      "Diagnosis Mesin Injeksi (EFI & Scanner Engine)",
      "Perbaikan Sistem Kelistrikan & AC Mobil",
      "Maintenance Chasis & Transmisi Otomatis/Manual",
      "Manajemen Service & Quality Control Bengkel",
    ],
    careers: ["Mekanik Otomatis Modern", "Service Advisor", "Quality Control Inspector", "Wirausaha Bengkel Mandiri"],
    youtubeId: "wsNhGKC7Xj0",
  },
  tav: {
    title: "Teknik Audio Video",
    code: "TAV",
    desc: "Pemrosesan sinyal audio-video, sistem akustik, mikrokontroler/IoT, serta perbaikan perangkat elektronik terapan.",
    overview:
      "Fokus pada penguasaan elektronik kreatif, instalasi sound system profesional, pengerjaan perangkat IoT, dan perbaikan perangkat elektronik audio-video.",
    skills: [
      "Penerapan Elektronika Analog & Digital",
      "Programming Mikrokontroler & IoT Basic",
      "Instalasi & Tuning Sound System Pro",
      "Troubleshooting Perangkat Audio-Video",
    ],
    careers: ["Teknisi Elektronika & IoT", "Audio Engineer / Soundman", "Technopreneur Elektronik", "Teknisi Broadcast/TV"],
    youtubeId: "XBtToP9p0Xo",
  },
  "bahasa-jepang": {
    title: "Kelas Bahasa Jepang",
    code: "JPN",
    desc: "Kelas intensif percakapan (Kaiwa), budaya kerja Jepang, dan persiapan karir Magang/Kerja ke Jepang (Tokutei Ginou).",
    overview:
      "Program plus SMK Al Kaaffah untuk menyiapkan lulusan yang fasih berbahasa Jepang dan siap bersaing di pasar kerja internasional maupun studi lanjut ke Jepang.",
    skills: [
      "Penguasaan Huruf Hiragana, Katakana & Kanji Dasar",
      "Kemampuan Percakapan Harian & Dunia Kerja (Kaiwa)",
      "Pemahaman Etika & Budaya Kerja Jepang (Aisatsu & Hourenso)",
      "Persiapan Sertifikasi JLPT N5/N4",
    ],
    careers: ["Tenaga Kerja / Magang di Jepang", "Penerjemah / Interpreter Junior", "Staf Perusahaan PMA Jepang", "Studi Lanjut ke Universitas Jepang"],
    youtubeId: "w9lWGd1T3u4",
  },
// TAMBAHKAN OBJECT DATA DIGITAL MARKETING:
  "digital-marketing": {
    title: "Kelas Digital Marketing",
    code: "DM",
    desc: "Strategi pemasaran digital, Social Media Management, Search Engine Optimization (SEO), Content Creation, dan Advertising (Ads).",
    overview:
      "Kelas Digital Marketing SMK Al Kaaffah menyiapkan talenta kreatif yang mahir menguasai strategi pemasaran digital modern, optimasi media sosial, analisis data pasar, hingga eksekusi kampanye iklan online.",
    skills: [
      "Social Media Strategy & Content Creation (TikTok, IG, YT)",
      "Search Engine Optimization (SEO) & Copywriting",
      "Digital Advertising (Meta Ads & Google Ads)",
      "Marketplace Management & E-Commerce Live Streaming",
    ],
    careers: [
      "Digital Marketer",
      "Social Media Specialist",
      "SEO Content Writer / Specialist",
      "Content Creator & Live Streamer Pro",
      "E-Commerce & Digital Technopreneur",
    ],
    youtubeId: "aQbZdee5PXI",
  },

};

// Dynamic SEO Metadata per Program
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = PROGRAM_DATA[slug];

  if (!program) return { title: "Program Tidak Ditemukan" };

  return {
    title: `${program.title} (${program.code}) | SMK Al Kaaffah Kepanjen`,
    description: program.desc,
    openGraph: {
      title: `${program.title} - SMK Al Kaaffah`,
      description: program.desc,
    },
  };
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = PROGRAM_DATA[slug];

  if (!program) notFound();

  return (
    <main className="min-h-screen pb-16">
      <PageHero
        eyebrow={`Program Keahlian ${program.code}`}
        title={program.title}
        description={program.desc}
      />

      <div className="container-page mx-auto mt-8">
        {/* Tombol Back */}
        <div className="mb-8">
          <Button asChild variant="outline" size="sm" className="rounded-xl">
            <Link href="/program">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Semua Program
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Kiri - Deskripsi, Kompetensi & Video */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Overview Card */}
            <div className="rounded-3xl border bg-card p-8 shadow-soft">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <GraduationCap className="h-5 w-5 text-primary" /> Ringkasan Program
              </h2>
              <p className="text-muted-foreground leading-relaxed">{program.overview}</p>
            </div>

            {/* Skills Card */}
            <div className="rounded-3xl border bg-card p-8 shadow-soft">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Wrench className="h-5 w-5 text-primary" /> Target Kompetensi Utama yang Harus Dikuasai
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {program.skills.map((skill, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-2xl bg-secondary/50">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Media Praktikum (Video Embed / Placeholder) */}
            <div className="rounded-3xl border bg-card p-8 shadow-soft">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <PlayCircle className="h-5 w-5 text-primary" /> Video Kegiatan
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Video yang berkaitan {program.title} akan memberikan gambaran nyata tentang kegiatan pembelajaran, proyek siswa, dan penerapan kompetensi yang telah dipelajari di kelas.
              </p>

              {program.youtubeId ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl border shadow-md">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${program.youtubeId}`}
                    title={`Video Praktikum ${program.title}`}
                    className="absolute inset-0 h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="aspect-video w-full rounded-2xl bg-secondary/80 grid place-items-center border border-dashed">
                  <div className="text-center p-6">
                    <PlayCircle className="h-12 w-12 text-primary mx-auto mb-2 opacity-80" />
                    <p className="text-sm font-semibold">Video Praktikum {program.code}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Video dokumentasi praktikum akan segera diunggah.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Kolom Kanan - Prospek Kerja & CTA */}
          <div className="flex flex-col gap-8">
            {/* Career Card */}
            <div className="rounded-3xl border bg-card p-8 shadow-soft">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Briefcase className="h-5 w-5 text-primary" /> Prospek Karir Lulusan
              </h2>
              <ul className="flex flex-col gap-3">
                {program.careers.map((career, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    {career}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Box Pendaftaran */}
            <div className="rounded-3xl bg-gradient-primary p-8 text-primary-foreground shadow-lg">
              <h3 className="text-xl font-extrabold mb-2">Minat masuk jurusan / program ini ?</h3>
              <p className="text-sm opacity-90 mb-6">
                Kuota pendaftaran terbatas. Amankan kursimu sekarang juga!
              </p>
              <Button asChild size="lg" variant="secondary" className="w-full rounded-xl font-bold">
                <Link href="/ppdb">Daftar SPMB Sekarang</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}