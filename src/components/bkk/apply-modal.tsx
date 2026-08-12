"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { Send, Link2, Loader2, X, CheckCircle2, Briefcase } from "lucide-react";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  vacancy: {
    id: string;
    title: string;
    company: string;
  };
}

const INITIAL_FORM_DATA = {
  namaLengkap: "",
  whatsapp: "",
  email: "",
  jurusan: "TKJ",
  tahunLulus: new Date().getFullYear().toString(),
  driveCvLink: "",
};

export function ApplyModal({ isOpen, onClose, vacancy }: ApplyModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsSuccess(false);
    setFormData(INITIAL_FORM_DATA);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi URL
    if (!formData.driveCvLink.startsWith("http://") && !formData.driveCvLink.startsWith("https://")) {
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
        tahunLulus: formData.tahunLulus,
        driveCvLink: formData.driveCvLink,
        status: "pending",
        createdAt: serverTimestamp(),
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
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 text-slate-100 shadow-2xl sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Lamaran Terkirim!</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                Lamaran kamu untuk posisi <span className="font-semibold text-indigo-300">{vacancy.title}</span> di{" "}
                <span className="font-semibold text-indigo-300">{vacancy.company}</span> berhasil diteruskan ke tim BKK sekolah.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition"
            >
              Tutup Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5" /> BKK SMK Al Kaaffah
              </span>
              <h3 className="text-lg font-bold text-white mt-1">Formulir Lamaran Kerja</h3>
              <p className="text-xs text-slate-400">
                Posisi: <span className="font-semibold text-indigo-300">{vacancy.title}</span> — {vacancy.company}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="mb-1 block font-medium text-slate-300">Nama Lengkap *</label>
                <input
                  type="text"
                  name="namaLengkap"
                  required
                  value={formData.namaLengkap}
                  onChange={handleChange}
                  placeholder="Contoh: Muhammad Farhan"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-white outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">No. WhatsApp *</label>
                  <input
                    type="tel"
                    name="whatsapp"
                    required
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="08123456789"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-white outline-none focus:border-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">Jurusan *</label>
                  <select
                    name="jurusan"
                    value={formData.jurusan}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-white outline-none focus:border-indigo-500 transition"
                  >
                    <option value="TKJ">TKJ</option>
                    <option value="TAV">TAV</option>
                    <option value="TKR">TKR</option>
                    <option value="DM">Digital Marketing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-medium text-slate-300">Email (Opsional)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nama@gmail.com"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-white outline-none focus:border-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-300">Tahun Lulus *</label>
                  <input
                    type="number"
                    name="tahunLulus"
                    required
                    value={formData.tahunLulus}
                    onChange={handleChange}
                    placeholder="2026"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-white outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              {/* INPUT DRIVE LINK CV */}
              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-3.5 space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
                  <Link2 className="h-4 w-4" /> Link CV / Google Drive / Canva *
                </label>
                <input
                  type="url"
                  name="driveCvLink"
                  required
                  value={formData.driveCvLink}
                  onChange={handleChange}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white outline-none focus:border-indigo-500 transition"
                />
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  💡 <strong>Tips:</strong> Pastikan akses link diubah menjadi <em>"Siapa saja yang memiliki link"</em>.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-lg transition hover:bg-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Mengirim Lamaran...
                </>
              ) : (
                <>
                  Kirim Lamaran Sekarang <Send className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}