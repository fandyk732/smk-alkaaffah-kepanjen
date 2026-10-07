import { TeacherDirectory } from "@/components/guru/TeacherDirectory";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Direktori Guru & Staf | SMK Al Kaaffah Kepanjen",
  description:
    "Mengenal lebih dekat dewan guru, pengajar produktif, dan tenaga kependidikan profesional di SMK Al Kaaffah Kepanjen.",
};

export default function DirektoriGuruPage() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-200 py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* HERO / PAGE HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center justify-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 shadow-xs">
              Pendidik & Tenaga Kependidikan
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Direktori Guru & Staf
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Mengenal lebih dekat tim pengajar dan staf profesional yang siap melatih, membimbing, dan mencetak generasi unggul berkarakter di SMK Al Kaaffah.
          </p>
        </div>

        {/* CLIENT COMPONENT (SEARCH, FILTER & CARDS) */}
        <TeacherDirectory />

      </div>
    </main>
  );
}