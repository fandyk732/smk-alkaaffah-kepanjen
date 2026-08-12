"use client";

import { useState } from "react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion-primitives";
import { 
  GraduationCap, 
  User, 
  Briefcase, 
  Send, 
  CheckCircle2, 
  BookOpen, 
  Phone, 
  Sparkles,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

// Import Firebase Firestore
import { db } from "@/lib/firebase"; // 👈 sesuaikan path dengan file firebase kamu
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

// Pilihan Jurusan
const majorOptions = [
  { value: "TKJ", label: "Teknik Komputer & Jaringan (TKJ)" },
  { value: "TAV", label: "Teknik Audio Video (TAV)" },
  { value: "TKR", label: "Teknik Kendaraan Ringan (TKR)" },
  { value: "DM", label: "Digital Marketing (DM)" },
];

// Status Kesibukan Alumni
const statusOptions = [
  { value: "kerja", label: "Bekerja (Wirausaha / Karyawan)", icon: Briefcase },
  { value: "kuliah", label: "Melanjutkan Studi (Kuliah)", icon: GraduationCap },
  { value: "kerja_kuliah", label: "Bekerja Sambil Kuliah", icon: BookOpen },
  { value: "mencari_kerja", label: "Mencari Kerja / Persiapan", icon: User },
];

export default function TracerStudyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    namaLengkap: "",
    nisn: "",
    tahunLulus: new Date().getFullYear().toString(),
    jurusan: "TKJ",
    email: "",
    noWhatsapp: "",
    statusAlumni: "kerja",
    namaInstansi: "",
    jabatanJurusan: "",
    kesanPesan: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 🔑 GUNAKAN NO HP ATAU NISN SEBAGAI DOCUMENT ID UNIK
      // (Kita bersihkan karakter non-angka biar ID-nya rapi)
      const cleanPhone = formData.noWhatsapp.replace(/[^0-9]/g, "");
      const customId = cleanPhone || formData.nisn || `alumni-${Date.now()}`;

      // 1. 🟢 Simpan ke koleksi PUBLIC
      await setDoc(doc(db, "alumni", customId), {
        nama: formData.namaLengkap,
        tahunLulus: Number(formData.tahunLulus),
        jurusan: formData.jurusan,
        status: formData.statusAlumni,
        tempat: formData.statusAlumni !== "mencari_kerja" ? formData.namaInstansi : "-",
        posisi: formData.statusAlumni !== "mencari_kerja" ? formData.jabatanJurusan : "-",
        testimoni: formData.kesanPesan || "-",
        createdAt: serverTimestamp(),
      });

      // 2. 🔴 Simpan ke koleksi PRIVATE (PAKAI customId YANG SAMA!)
      await setDoc(doc(db, "tracer_private", customId), {
        namaLengkap: formData.namaLengkap,
        nisn: formData.nisn || "-",
        noWhatsapp: formData.noWhatsapp,
        email: formData.email || "-",
        tahunLulus: Number(formData.tahunLulus),
        jurusan: formData.jurusan,
        statusAlumni: formData.statusAlumni,
        namaInstansi: formData.statusAlumni !== "mencari_kerja" ? formData.namaInstansi : "-",
        jabatanJurusan: formData.statusAlumni !== "mencari_kerja" ? formData.jabatanJurusan : "-",
        kesanPesan: formData.kesanPesan || "-",
        createdAt: serverTimestamp(),
      });

      setIsSubmitted(true);
      toast.success("Data alumni berhasil dikirim ke database!");
    } catch (error) {
      console.error("Firebase Error: ", error);
      toast.error("Gagal mengirim data ke database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Tracer Study & Alumni"
        title="Formulir Pendataan Alumni"
        description="Bantu sekolah memetakan rekam jejak alumni untuk peningkatan mutu pendidikan dan jaringan karir SMK."
      />

      <section className="container-page py-12">
        <div className="mx-auto max-w-3xl">
          {isSubmitted ? (
            /* Card Sukses Setelah Submit */
            <Reveal>
              <div className="rounded-3xl border bg-card p-8 text-center shadow-soft lg:p-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h2 className="mt-6 text-2xl font-bold sm:text-3xl">Data Berhasil Terkirim!</h2>
                <p className="mt-3 text-muted-foreground">
                  Terima kasih, <span className="font-semibold text-foreground">{formData.namaLengkap}</span>. Data rekam jejak alumni kamu telah tersimpan dalam sistem Tracer Study sekolah.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        namaLengkap: "",
                        nisn: "",
                        tahunLulus: new Date().getFullYear().toString(),
                        jurusan: "TKJ",
                        email: "",
                        noWhatsapp: "",
                        statusAlumni: "kerja",
                        namaInstansi: "",
                        jabatanJurusan: "",
                        kesanPesan: "",
                      });
                    }}
                    className="rounded-xl border border-input bg-background px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-accent"
                  >
                    Isi Lagi Data Lain
                  </button>
                </div>
              </div>
            </Reveal>
          ) : (
            /* Form Input Alumni */
            <Reveal>
              <form onSubmit={handleSubmit} className="space-y-8 rounded-3xl border bg-card p-6 shadow-soft sm:p-10">
                {/* Header Form */}
                <div className="border-b pb-6">
                  <div className="flex items-center gap-2 text-primary">
                    <Sparkles className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Tracer Study</span>
                  </div>
                  <h2 className="mt-2 text-2xl font-bold">Identitas & Status Alumni</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Isi data diri kamu dengan benar dan akurat.</p>
                </div>

                {/* Section 1: Data Diri */}
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-base font-semibold">
                    <User className="h-4 w-4 text-primary" /> Data Diri
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-xs font-semibold">
                        Nama Lengkap <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        name="namaLengkap"
                        required
                        value={formData.namaLengkap}
                        onChange={handleChange}
                        placeholder="Contoh: Budi Santoso"
                        className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold">NISN (Opsional)</label>
                      <input
                        type="text"
                        name="nisn"
                        value={formData.nisn}
                        onChange={handleChange}
                        placeholder="00xxxxxxxx"
                        className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold">
                        Tahun Lulus <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="number"
                        name="tahunLulus"
                        required
                        min="2000"
                        max={new Date().getFullYear()}
                        value={formData.tahunLulus}
                        onChange={handleChange}
                        className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-xs font-semibold">
                        Jurusan / Kompetensi Keahlian <span className="text-destructive">*</span>
                      </label>
                      <select
                        name="jurusan"
                        value={formData.jurusan}
                        onChange={handleChange}
                        className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                      >
                        {majorOptions.map((m) => (
                          <option key={m.value} value={m.value}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Kontak */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="flex items-center gap-2 text-base font-semibold">
                    <Phone className="h-4 w-4 text-primary" /> Informasi Kontak
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold">
                        No. WhatsApp / HP <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="tel"
                        name="noWhatsapp"
                        required
                        value={formData.noWhatsapp}
                        onChange={handleChange}
                        placeholder="08xxxxxxxxxx"
                        className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold">Email (Opsional)</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="alumni@email.com"
                        className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Status Karir / Studi */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="flex items-center gap-2 text-base font-semibold">
                    <Briefcase className="h-4 w-4 text-primary" /> Status Kesibukan Saat Ini
                  </h3>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {statusOptions.map((st) => {
                      const Icon = st.icon;
                      const isSelected = formData.statusAlumni === st.value;
                      return (
                        <label
                          key={st.value}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5 text-primary shadow-sm"
                              : "hover:border-muted-foreground/30"
                          }`}
                        >
                          <input
                            type="radio"
                            name="statusAlumni"
                            value={st.value}
                            checked={isSelected}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <Icon className="h-5 w-5 shrink-0" />
                          <span className="text-xs font-medium text-foreground">{st.label}</span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Input Tambahan Jika Bekerja/Kuliah */}
                  {formData.statusAlumni !== "mencari_kerja" && (
                    <div className="grid gap-4 pt-2 sm:grid-cols-2 animate-in fade-in slide-in-from-top-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold">
                          {formData.statusAlumni.includes("kuliah") ? "Nama Perguruan Tinggi / Universitas" : "Nama Perusahaan / Tempat Kerja"}
                        </label>
                        <input
                          type="text"
                          name="namaInstansi"
                          value={formData.namaInstansi}
                          onChange={handleChange}
                          placeholder={formData.statusAlumni.includes("kuliah") ? "Contoh: Universitas Brawijaya" : "Contoh: PT. Telekomunikasi Indonesia"}
                          className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold">
                          {formData.statusAlumni.includes("kuliah") ? "Program Studi / Jurusan" : "Jabatan / Posisi Kerja"}
                        </label>
                        <input
                          type="text"
                          name="jabatanJurusan"
                          value={formData.jabatanJurusan}
                          onChange={handleChange}
                          placeholder={formData.statusAlumni.includes("kuliah") ? "Contoh: Teknik Informatika" : "Contoh: Network Engineer"}
                          className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 4: Kesan & Pesan */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="flex items-center gap-2 text-base font-semibold">
                    <BookOpen className="h-4 w-4 text-primary" /> Kesan & Pesan untuk Sekolah
                  </h3>

                  <div>
                    <textarea
                      name="kesanPesan"
                      rows={4}
                      value={formData.kesanPesan}
                      onChange={handleChange}
                      placeholder="Bagikan saran, masukan, atau pesan motivasi untuk adik-adik kelas di sekolah..."
                      className="w-full rounded-xl border bg-background p-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg active:scale-[0.99] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Menyimpan ke Database...
                    </>
                  ) : (
                    <>
                      Kirim Data Alumni <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}