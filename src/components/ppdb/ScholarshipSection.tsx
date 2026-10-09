"use client";

import { Award, HeartHandshake, ShieldCheck, MessageCircle } from "lucide-react";

const SCHOLARSHIPS = [
  {
    icon: Award,
    title: "Jalur Prestasi",
    subtitle: "Tingkat Kecamatan s/d Nasional",
    desc: "Khusus bagi siswa berprestasi di bidang akademik, olahraga, seni, sains, maupun keagamaan.",
    benefit: "Potongan Biaya Pendidikan, Syarat & Ketentuan Berlaku",
    color: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    icon: HeartHandshake,
    title: "Jalur Yatim / Yatim Piatu",
    subtitle: "Khusus Siswa Yatim/Piatu",
    desc: "Bentuk kepedulian sekolah untuk memastikan keberlanjutan pendidikan anak yatim.",
    benefit: "Potongan Biaya Pendidikan-(kuota terbatas), Syarat & Ketentuan Berlaku",
    color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: ShieldCheck,
    title: "Jalur Kurang Mampu",
    subtitle: "Pemilik KIP / PKH / SKTM",
    desc: "Bantuan keringanan biaya pendidikan bagi keluarga penerima KIP/PKH atau pemegang SKTM.",
    benefit: "Potongan Biaya Pendidikan-(kuota terbatas), Syarat & Ketentuan Berlaku",
    color: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
];

export function ScholarshipSection() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
          Program Khusus SPMB
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
          Program Beasiswa & Bantuan Pendidikan
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground max-w-xl mx-auto">
          Program beasiswa ini berlaku untuk pendaftar di <strong className="text-foreground">Semua Gelombang (Gelombang 1 - 3)</strong>.
        </p>
      </div>

      {/* Grid Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {SCHOLARSHIPS.map((item) => (
          <div
            key={item.title}
            className="flex flex-col justify-between rounded-2xl border bg-card p-5 shadow-xs space-y-4 text-left"
          >
            <div className="space-y-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.color}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground leading-snug">{item.title}</h3>
                <span className="text-[11px] font-medium text-muted-foreground">{item.subtitle}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>

            <div className="pt-3 border-t border-border/60">
              <span className="text-xs font-bold text-primary">{item.benefit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Info Konsultasi WA */}
      <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4 text-center space-y-2">
        <p className="text-xs md:text-sm text-muted-foreground">
          *Syarat, ketentuan, & penentuan besaran beasiswa dapat dikonsultasikan langsung saat verifikasi berkas di sekolah.
        </p>
        <a
          href="https://wa.me/6281223343331?text=Halo%20Panitia%20SPMB,%20saya%20ingin%20bertanya%20mengenai%20Program%20Beasiswa"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline pt-0.5"
        >
          <MessageCircle className="h-4 w-4" />
          Tanyakan Syarat Beasiswa via WhatsApp Panitia
        </a>
      </div>
    </div>
  );
}