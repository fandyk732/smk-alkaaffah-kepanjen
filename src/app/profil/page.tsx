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

      {/* SECTION VISI & MISI */}
      <section className="bg-section py-16">
        <div className="container-page grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* VISI (4 Kolom di Dekstop) */}
          <Reveal className="lg:col-span-5">
            <div className="rounded-2xl border bg-card p-8 shadow-soft">
              <Target className="h-9 w-9 text-primary" />
              <h2 className="mt-4 text-2xl font-bold">Visi</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Mewujudkan generasi yang tangguh, berkarakter, dan berwawasan (religi, sains, teknologi).
              </p>
            </div>
          </Reveal>

          {/* MISI (7 Kolom di Dekstop) */}
          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="rounded-2xl border bg-card p-8 shadow-soft">
              <Eye className="h-9 w-9 text-primary" />
              <h2 className="mt-4 text-2xl font-bold">Misi</h2>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Mengoptimalkan pengelolaan lembaga secara professional yang menyeluruh dan berkesinambungan di semua elemen sekolah.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Memperkuat pendidikan karakter, mengembangkan dan menerapkan program pendidikan karakter.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Mendorong Pengembangan Ketahanan Emosional dengan membuat program - program yang dapat melatih kedisiplinan dan ketahanan mental siswa.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Meningkatkan kegiatan Literasi (Agama, Sains, dan Teknologi) untuk seluruh warga sekolah.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Memfasilitasi Kolaborasi antara Agama, Sains, dan Teknologi.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Meningkatkan Keterampilan Teknologi dan Pemanfaatannya dengan membuat produk dan jasa yang dapat memberi manfaat bagi masyarakat banyak.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Membangun Kemitraan dengan Masyarakat, Instansi Pemerintahan, dan Industri untuk menunjang program, inovasi karya, serta SDM sekolah.</span>
                </li>
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
