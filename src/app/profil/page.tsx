import type { Metadata } from "next";
import { Target, Eye, HeartHandshake, Building, Users, TreePine } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal, SectionHeading } from "@/components/motion-primitives";
import { school } from "@/data/site";

export const metadata: Metadata = {
  title: `Profil Sekolah — ${school.name}`,
  description: "Sejarah, visi misi, nilai, struktur organisasi, dan fasilitas SMK Al Kaaffah Kepanjen.",
  alternates: { canonical: "/profil" },
  openGraph: { title: `Profil Sekolah — ${school.name}`, url: "/profil" },
};

const values = [
  { icon: HeartHandshake, t: "Integritas", d: "Menjunjung tinggi kejujuran dan tanggung jawab." },
  { icon: Users, t: "Kolaborasi", d: "Tumbuh bersama dalam kebersamaan." },
  { icon: Target, t: "Profesionalisme", d: "Bekerja dengan standar terbaik." },
  { icon: TreePine, t: "Berkelanjutan", d: "Peduli lingkungan dan masa depan." },
];

const facilities = ["Laboratorium Komputer & Jaringan", "Bengkel Listrik", "Bengkel Otomotif", "Studio Digital Marketing", "Perpustakaan Digital", "Masjid Sekolah", "Lapangan Olahraga", "Kantin Sehat",  "Aula Serbaguna", "Bus Sekolah", "Ruang UKS", "Laboratorium Elektronika", "Laboratorium Kendaraan Ringan", "Ruang Guru & Staf", "Ruang Administrasi", "Area Parkir Luas", "Taman Edukasi"];

export default function ProfilPage() {
  return (
    <>
      <PageHero eyebrow="Profil Sekolah" title="Mengenal SMK Al Kaaffah Kepanjen" description="Komitmen kami membangun pendidikan vokasi berkarakter dan berdaya saing." />

      <section className="container-page py-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHeading align="left" eyebrow="Sejarah" title="Perjalanan kami sejak berdiri"
            description="Berdiri dengan semangat menghadirkan pendidikan kejuruan yang memadukan kompetensi teknologi dan nilai islami, SMK Al Kaaffah Kepanjen terus berkembang menjadi sekolah rujukan di wilayah Malang Selatan. Dari tahun ke tahun, kami memperkuat kemitraan industri, memperbarui fasilitas, dan meluluskan ribuan alumni yang tersebar di dunia kerja maupun perguruan tinggi." />
          <Reveal>
            <div className="overflow-hidden rounded-3xl border shadow-soft">
              <img src="https://6a56f44fcec0a76b21484386.imgix.net/bg_alkaaffah.jpg" alt="Gedung sekolah" loading="lazy" className="h-full w-full object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-section py-16">
        <div className="container-page grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border bg-card p-8">
              <Target className="h-9 w-9 text-primary" />
              <h2 className="mt-4 text-2xl font-bold">Visi</h2>
              <p className="mt-3 text-muted-foreground">Menjadi sekolah menengah kejuruan unggulan yang menghasilkan lulusan berkompeten, berkarakter islami, dan siap bersaing di tingkat nasional maupun global.</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-2xl border bg-card p-8">
              <Eye className="h-9 w-9 text-primary" />
              <h2 className="mt-4 text-2xl font-bold">Misi</h2>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                <li>• Menyelenggarakan pembelajaran berbasis kompetensi industri.</li>
                <li>• Membentuk karakter islami dan berakhlak mulia.</li>
                <li>• Mengembangkan kemitraan dengan dunia usaha &amp; industri.</li>
                <li>• Mendorong inovasi, kreativitas, dan jiwa wirausaha.</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-page py-16">
        <SectionHeading eyebrow="Nilai Sekolah" title="Prinsip yang kami pegang" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal key={v.t} delay={i * 0.07}>
              <div className="h-full rounded-2xl border bg-card p-6">
                <v.icon className="h-8 w-8 text-primary" />
                <h3 className="mt-3 font-bold">{v.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-section py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Struktur Organisasi" title="Tim manajemen sekolah" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { n: "Maya Dian Rosita, S.A.P", r: "Kepala Sekolah" },
              { n: "Arif Mafatia Karim, S.Pd., Gr. Mt.Rt", r: "Wakil Kurikulum & Kaprodi TAV" },
              { n: "Khusnul Huda, S.H.I", r: "Wakil Kesiswaan & Kaprodi TKR" },
              { n: "Asfa Al Makmun Muttakin, S.Kom", r: "Kepala Tata Usaha" },
              { n: "Rubika Nastiti", r: "Kaprodi TKJ & DM" },
            ].map((p, i) => (
              <Reveal key={p.n} delay={i * 0.05}>
                <div className="flex items-center gap-4 rounded-2xl border bg-card p-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-primary font-bold text-primary-foreground">{p.n.charAt(0)}</span>
                  <div>
                    <p className="font-semibold leading-tight">{p.n}</p>
                    <p className="text-sm text-muted-foreground">{p.r}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <SectionHeading eyebrow="Fasilitas" title="Sarana belajar yang lengkap" />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {facilities.map((f, i) => (
            <Reveal key={f} delay={i * 0.04}>
              <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
                <Building className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm font-medium">{f}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
