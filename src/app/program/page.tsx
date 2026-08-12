import type { Metadata } from "next";
import Link from "next/link";
import {
  Network,
  Code2,
  Clapperboard,
  Calculator,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion-primitives";
import { Button } from "@/components/ui/button";
import { programs, school } from "@/data/site";

export const metadata: Metadata = {
  title: `Program Keahlian — ${school.name}`,
  description:
    "Program keahlian TKJ, TAV, TKR, Digital Marketing, dan  dengan kurikulum berbasis industri.",
  alternates: { canonical: "/program" },
  openGraph: { title: `Program Keahlian — ${school.name}`, url: "/program" },
};

const iconMap = { Network, Code2, Clapperboard, Calculator } as const;

// Helper mapping code ke slug URL sub-halaman
const getProgramSlug = (code: string) => {
  const c = code.toLowerCase();
  if (c === "bj" || c === "jb") return "bahasa-jepang";
  if (c === "dm") return "digital-marketing";
  return c;
};

export default function ProgramPage() {
  return (
    <>
      <PageHero
        eyebrow="Program Keahlian"
        title="Kompetensi Keahlian Masa Depan"
        description="Tiga Program Keahlian Utama plus Dua Program Unggulan yang dirancang khusus mengikuti standar dan kebutuhan dunia industri modern."
      />

      {/* 📚 KATALOG PROGRAM KEAHLIAN */}
      <section className="container-page py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((p, i) => {
            const Icon = iconMap[p.icon as keyof typeof iconMap] || GraduationCap;
            const slug = getProgramSlug(p.code);
            const isFeatured = p.code === "BJ" || p.code === "DM";

            return (
              <Reveal key={p.code} delay={i * 0.08}>
                <div className="group relative flex flex-col justify-between h-full rounded-3xl border bg-card p-8 transition-all duration-300 hover:border-primary hover:shadow-xl hover:-translate-y-1">
                  
                  <div>
                    {/* Badge & Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3.5 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          isFeatured
                            ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {/* custom teks */}
                        {p.code === "JB" || p.code === "BJ" || p.code === "DM"
                          ? "✨ Program Unggulan" // Atau ganti jadi "Kelas JP", "Program Jepang", dll.
                          : `✨ Jurusan ${p.code}`}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {p.desc}
                    </p>
                  </div>

                  {/* Action Link */}
                  <div className="mt-8 pt-6 border-t flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                      Pelajari Kurikulum & Praktikum
                    </span>
                    <Button
                      asChild
                      size="icon"
                      variant="ghost"
                      className="rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                    >
                      <Link href={`/program/${slug}`}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* 🚀 HIGHLIGHT KEUNGGULAN PEMBELAJARAN */}
      <section className="bg-secondary/30 py-16 border-y">
        <div className="container-page">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
              <Sparkles className="h-3.5 w-3.5" /> Mengapa Belajar di SMK Al Kaaffah?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Kurikulum Presisi yang Diselaraskan dengan Dunia Kerja
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-card p-6 rounded-2xl border shadow-sm">
              <CheckCircle2 className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-bold text-base mb-2">Sertifikasi Industri & BNSP</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Lulusan dibekali sertifikat kompetensi yang diakui secara nasional maupun internasional (Cisco, Google, BNSP, JLPT).
              </p>
            </div>

            <div className="bg-card p-6 rounded-2xl border shadow-sm">
              <CheckCircle2 className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-bold text-base mb-2">Penyaluran Kerja via BKK</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Bursa Kerja Khusus (BKK) aktif membantu siswa mendapatkan tempat PKL berkualitas hingga penyaluran kerja lulusan.
              </p>
            </div>

            <div className="bg-card p-6 rounded-2xl border shadow-sm">
              <CheckCircle2 className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-bold text-base mb-2">Praktikum Berbasis Proyek</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Pembelajaran mengutamakan 70% praktik langsung dengan lab bernorma industri modern dan bimbingan praktisi.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}