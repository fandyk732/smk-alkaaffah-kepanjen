"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Send, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion-primitives";
import { school } from "@/data/site";

// 🎯 Ganti dengan Web App URL dari Google Apps Script kamu
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzyf_qkBTAxEe4FrYqIxrIHQt447GsmPnDulqXA6YeKcCKj45-oUF-5UvkpG_zZ-ifJ/exec";

const MAPEL_PILIKAN = [
  "Matematika Tingkat Lanjut",
  "Bahasa Indonesia Tingkat Lanjut",
  "Bahasa Inggris Tingkat Lanjut",
  "Fisika",
  "Kimia",
  "Biologi",
  "Ekonomi",
  "Sosiologi",
  "Geografi",
  "Sejarah",
  "Antropologi",
  "PPKn / Pendidikan Pancasila",
  "Bahasa Arab",
  "Bahasa Jerman",
  "Bahasa Perancis",
  "Bahasa Jepang",
  "Bahasa Korea",
  "Bahasa Mandarin",
  "Produk/Projek Kreatif dan Kewirausahaan",
  "Program Keahlian",
];

export default function FormTKAPage() {
  const [formData, setFormData] = useState({
    nama: "",
    kelas: "",
    jurusan: "",
    mapelPilihan: [] as string[],
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCheckboxChange = (mapel: string) => {
    setFormData((prev) => {
      const isSelected = prev.mapelPilihan.includes(mapel);
      if (isSelected) {
        return {
          ...prev,
          mapelPilihan: prev.mapelPilihan.filter((m) => m !== mapel),
        };
      } else {
        if (prev.mapelPilihan.length >= 2) {
          setErrorMsg("Maksimal hanya boleh memilih 2 mata pelajaran pilihan!");
          return prev;
        }
        setErrorMsg("");
        return {
          ...prev,
          mapelPilihan: [...prev.mapelPilihan, mapel],
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.kelas || !formData.jurusan) {
      setErrorMsg("Mohon lengkapi seluruh data diri siswa!");
      return;
    }

    if (formData.mapelPilihan.length !== 2) {
      setErrorMsg("Wajib memilih tepat 2 mata pelajaran pilihan!");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setLoading(false);
      setSubmitted(true);
    } catch (err) {
      setLoading(false);
      setErrorMsg("Gagal mengirim data. Silakan coba lagi beberapa saat lagi.");
    }
  };

  return (
    <div className="min-h-screen py-24 sm:py-32 px-4 container-page max-w-3xl mx-auto text-foreground">
      <Reveal>
        <div className="text-center mb-8">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary mb-3">
            Pendaftaran Resmi TKA 2026
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Pemilihan Mata Pelajaran TKA
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            {school.name} — Pilih 2 mata pelajaran pilihan sesuai minat Anda.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="rounded-3xl border border-white/20 dark:border-white/10 bg-background/60 dark:bg-background/40 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mb-2">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold">Data Berhasil Terkirim!</h2>
              <p className="text-muted-foreground max-w-md mx-auto text-sm">
                Terima kasih <span className="font-semibold text-foreground">{formData.nama}</span>, data pilihan mata uji TKA Anda telah direkap secara otomatis.
              </p>
              <Button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ nama: "", kelas: "", jurusan: "", mapelPilihan: [] });
                }}
                className="mt-4 rounded-xl"
                variant="outline"
              >
                Isi Formulir Lagi
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* SECTION: DATA DIRI */}
              <div className="space-y-4">
                <h3 className="text-base font-bold flex items-center gap-2 border-b pb-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-bold">
                    1
                  </span>
                  Data Diri Siswa
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Netra Setia Prima"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full rounded-xl border bg-background/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Kelas
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: XII"
                    value={formData.kelas}
                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                    className="w-full rounded-xl border bg-background/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                {/* RADIO BUTTON JURUSAN */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-2">
                    Jurusan / Program Keahlian
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["TKR", "TAV", "TKJ"].map((j) => (
                      <label
                        key={j}
                        className={`flex items-center justify-center rounded-xl border p-3 cursor-pointer text-sm font-semibold transition-all ${
                          formData.jurusan === j
                            ? "border-primary bg-primary/10 text-primary shadow-sm"
                            : "border-border bg-background/30 hover:bg-secondary/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="jurusan"
                          value={j}
                          checked={formData.jurusan === j}
                          onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })}
                          className="sr-only"
                        />
                        {j}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION: MAPEL PILIHAN */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-bold">
                      2
                    </span>
                    Mata Pelajaran Pilihan (Pilih 2)
                  </h3>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                    {formData.mapelPilihan.length} / 2 Terpilih
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {MAPEL_PILIKAN.map((mapel, index) => {
                    const isChecked = formData.mapelPilihan.includes(mapel);
                    return (
                      <label
                        key={mapel}
                        onClick={() => handleCheckboxChange(mapel)}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-xs sm:text-sm transition-all select-none ${
                          isChecked
                            ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                            : "border-border bg-background/20 hover:bg-secondary/40 text-foreground/80"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                            isChecked ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/40"
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <span className="leading-snug">{index + 1}. {mapel}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-primary rounded-xl py-6 font-bold shadow-lg hover:opacity-90 transition-opacity mt-6"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Menyimpan Data...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Kirim Pilihan TKA
                  </span>
                )}
              </Button>
            </form>
          )}
        </div>
      </Reveal>
    </div>
  );
}