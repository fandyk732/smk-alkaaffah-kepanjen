import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ClipboardList, UserPlus, CheckCircle2, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal, SectionHeading } from "@/components/motion-primitives";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { school } from "@/data/site";
import { FormPPDB } from "@/components/pages/form-ppdb"; // Import komponen form barusan

export const metadata: Metadata = {
  title: `PPDB — ${school.name}`,
  description: "Informasi Penerimaan Peserta Didik Baru (PPDB) SMK Al Kaaffah Kepanjen: syarat, alur, dan pendaftaran online.",
  alternates: { canonical: "/PPDB" },
  openGraph: { title: `PPDB — ${school.name}`, url: "/PPDB" },
};

const requirements = [
  "Fotokopi Ijazah / SKL SMP / MTs", "Fotokopi Akta Kelahiran", "Fotokopi Kartu Keluarga",
  "Pas foto 3x4 (3 lembar)", "Fotokopi Rapor Semester 1-5", "Surat Keterangan Sehat",
];
const steps = [
  { icon: FileText, t: "Isi Formulir", d: "Lengkapi formulir pendaftaran online." },
  { icon: ClipboardList, t: "Unggah Berkas", d: "Upload dokumen persyaratan." },
  { icon: UserPlus, t: "Seleksi", d: "Ikuti tes & wawancara." },
  { icon: CheckCircle2, t: "Pengumuman", d: "Daftar ulang bagi yang lolos." },
];
const faqs = [
  { q: "Kapan PPDB dibuka?", a: "PPDB dibuka mulai gelombang 1 hingga kuota terpenuhi. Pantau pengumuman resmi sekolah." },
  { q: "Apakah ada biaya pendaftaran?", a: "Biaya pendaftaran sangat terjangkau dan tersedia program beasiswa bagi siswa berprestasi maupun kurang mampu." },
  { q: "Bisakah mendaftar secara online?", a: "Ya, seluruh proses pendaftaran dapat dilakukan secara online melalui website ini." },
  { q: "Program keahlian apa saja yang tersedia?", a: "Tersedia TKJ, TAV, TKR, dan DM." },
];

export default function PPDBPage() {
  return (
    <>
      <PageHero eyebrow="PPDB 2026/2027" title="Penerimaan Peserta Didik Baru" description="Bergabunglah dengan SMK Al Kaaffah Kepanjen dan mulai perjalanan menuju masa depan gemilang." />

     {/* BANNER CEK PENGUMUMAN SELEKSI */}
<section className="container-page py-6 max-w-2xl mx-auto">
  <Reveal>
    <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 text-center shadow-sm">
      <h3 className="text-lg font-bold text-foreground">Sudah Mengikuti Seleksi Gelombang Sebelumnya?</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Bagi calon siswa yang sudah mengikuti tahapan tes dan wawancara, silakan cek status kelulusanmu sekarang.
      </p>
      <Button asChild className="mt-4 rounded-xl bg-gradient-primary" size="sm">
        <Link href="/ppdb/pengumuman">
          Cek Hasil Kelulusan Disini <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </div>
  </Reveal>
</section>
     
      {/* SECTION FORM PPDB INTEGRASI FIRESTORE */}
      <section className="container-page py-8 max-w-2xl mx-auto">
        <Reveal>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">Formulir Pendaftaran Online</h2>
            <p className="text-sm text-muted-foreground mt-1">Kuota terbatas — silakan amankan kursi pendaftaranmu sekarang.</p>
          </div>
          <FormPPDB />
        </Reveal>
      </section>

      {/* PERSYARATAN & ALUR */}
      <section className="container-page py-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading align="left" eyebrow="Persyaratan" title="Dokumen yang diperlukan" />
            <ul className="mt-8 grid gap-3">
              {requirements.map((r, i) => (
                <Reveal key={r} delay={i * 0.05}>
                  <li className="flex items-center gap-3 rounded-xl border bg-card p-4">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm font-medium">{r}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading align="left" eyebrow="Alur Pendaftaran" title="Empat langkah mudah" />
            <div className="mt-8 space-y-4">
              {steps.map((s, i) => (
                <Reveal key={s.t} delay={i * 0.07}>
                  <div className="flex gap-4 rounded-xl border bg-card p-5">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-secondary text-primary"><s.icon className="h-6 w-6" /></span>
                    <div>
                      <p className="font-semibold">{i + 1}. {s.t}</p>
                      <p className="text-sm text-muted-foreground">{s.d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-section py-16">
        <div className="container-page max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Pertanyaan yang sering diajukan" />
          <Accordion type="single" collapsible className="mt-8">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="text-center">
          <Button asChild variant="ghost">
            <Link href="/kontak">Masih ada pertanyaan? Hubungi kami <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}