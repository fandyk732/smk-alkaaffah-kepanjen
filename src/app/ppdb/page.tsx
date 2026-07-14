import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ClipboardList, UserPlus, CheckCircle2, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal, SectionHeading } from "@/components/motion-primitives";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { school } from "@/data/site";

export const metadata: Metadata = {
  title: `PPDB — ${school.name}`,
  description: "Informasi Penerimaan Peserta Didik Baru (PPDB) SMK Al Kaaffah Kepanjen: syarat, alur, dan pendaftaran online.",
  alternates: { canonical: "/ppdb" },
  openGraph: { title: `PPDB — ${school.name}`, url: "/ppdb" },
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
  { q: "Program keahlian apa saja yang tersedia?", a: "Tersedia TKJ, RPL, Multimedia, dan Akuntansi & Keuangan." },
];

export default function PpdbPage() {
  return (
    <>
      <PageHero eyebrow="PPDB 2025/2026" title="Penerimaan Peserta Didik Baru" description="Bergabunglah dengan SMK Al Kaaffah Kepanjen dan mulai perjalanan menuju masa depan gemilang." />

      <section className="container-page py-8">
        <Reveal>
          <div className="rounded-3xl bg-gradient-primary p-8 text-primary-foreground shadow-elegant lg:p-10">
            <h2 className="text-2xl font-bold">Informasi Pendaftaran</h2>
            <p className="mt-3 max-w-2xl opacity-90">Pendaftaran dibuka untuk seluruh program keahlian. Kuota terbatas — segera amankan kursimu. Tersedia jalur prestasi, reguler, dan beasiswa.</p>
            <Button asChild size="lg" variant="secondary" className="mt-6">
              <a href={`https://wa.me/${school.whatsapp}`} target="_blank" rel="noreferrer">Daftar Online Sekarang <ArrowRight className="ml-1 h-4 w-4" /></a>
            </Button>
          </div>
        </Reveal>
      </section>

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
