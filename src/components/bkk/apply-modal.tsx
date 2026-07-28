"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { Send, Link2, ExternalLink, Loader2, X, CheckCircle2 } from "lucide-react";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  vacancy: {
    id: string;
    title: string;
    company: string;
  };
}

export function ApplyModal({ isOpen, onClose, vacancy }: ApplyModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    namaLengkap: "",
    whatsapp: "",
    email: "",
    jurusan: "TKJ",
    tahunLulus: new Date().getFullYear().toString(),
    driveCvLink: "",
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi Sederhana Format Link Drive/Canva
    if (!formData.driveCvLink.includes("http")) {
      toast.error("Masukkan URL tautan yang valid (diawali dengan http:// atau https://)");
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "applications"), {
        vacancyId: vacancy.id,
        vacancyTitle: vacancy.title,
        company: vacancy.company,
        namaLengkap: formData.namaLengkap,
        whatsapp: formData.whatsapp,
        email: formData.email || "-",
        jurusan: formData.jurusan,
        tahunLulus: Number(formData.tahunLulus),
        driveCvLink: formData.driveCvLink,
        status: "pending",
        appliedAt: serverTimestamp(),
      });

      setIsSuccess(true);
      toast.success("Lamaran berhasil terkirim!");
    } catch (error) {
      console.error("Error applying job: ", error);
      toast.error("Gagal mengirim lamaran. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border bg-card p-6 shadow-xl sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-xl font-bold">Lamaran Terkirim!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Lamaran kamu untuk posisi <span className="font-semibold text-foreground">{vacancy.title}</span> di{" "}
              <span className="font-semibold text-foreground">{vacancy.company}</span> berhasil diteruskan ke tim BKK sekolah.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Tutup Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">BKK SMK Al Kaaffah</span>
              <h3 className="text-xl font-bold">Lamar Pekerjaan</h3>
              <p className="text-xs text-muted-foreground">
                {vacancy.title} — <span className="font-medium text-foreground">{vacancy.company}</span>
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold">Nama Lengkap *</label>
                <input
                  type="text"
                  name="namaLengkap"
                  required
                  value={formData.namaLengkap}
                  onChange={handleChange}
                  placeholder="Contoh: Muhammad Farhan"
                  className="w-full rounded-xl border bg-background px-3.5 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold">No. WhatsApp *</label>
                  <input
                    type="tel"
                    name="whatsapp"
                    required
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="08123456789"
                    className="w-full rounded-xl border bg-background px-3.5 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold">Jurusan *</label>
                  <select
                    name="jurusan"
                    value={formData.jurusan}
                    onChange={handleChange}
                    className="w-full rounded-xl border bg-background px-3.5 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="TKJ">TKJ</option>
                    <option value="TAV">TAV</option>
                    <option value="TKR">TKR</option>
                    <option value="DM">Digital Marketing</option>
                  </select>
                </div>
              </div>

              {/* INPUT DRIVE LINK CV */}
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3.5">
                <label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-primary">
                  <Link2 className="h-4 w-4" /> Link CV / Google Drive *
                </label>
                <input
                  type="url"
                  name="driveCvLink"
                  required
                  value={formData.driveCvLink}
                  onChange={handleChange}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full rounded-xl border bg-background px-3.5 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <p className="mt-1.5 text-[11px] text-muted-foreground leading-relaxed">
                  💡 <strong>Petunjuk:</strong> Upload CV PDF kamu ke Google Drive / Canva, ubah akses bagikan menjadi <em>"Siapa saja yang memiliki link"</em>, lalu paste link-nya di atas.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground shadow transition-all hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Mengirim Lamaran...
                </>
              ) : (
                <>
                  Kirim Lamaran Sekarang <Send className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}