"use client";

import React, { useState } from "react";
import { Send, Loader2, MessageSquare, CheckCircle2, ShieldCheck, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";
import { sanitizeWhatsApp } from "@/lib/utils";

const KATEGORI_OPTIONS = [
  { value: "fasilitas", label: "Fasilitas & Sarana Sekolah" },
  { value: "pembelajaran", label: "Proses Pembelajaran & Guru" },
  { value: "ekskul", label: "Kegiatan Ekstrakurikuler" },
  { value: "pelayanan", label: "Pelayanan Administrasi & Staf" },
  { value: "lainnya", label: "Kritik / Masukan Umum" },
];

export function FormKotakSaran() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    isAnonim: true,
    nama: "",
    whatsapp: "",
    kategori: "fasilitas",
    subjek: "",
    pesan: "",
    // Honeypot field (hidden dari UI asli)
    website_confirm: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanNumber = sanitizeWhatsApp(e.target.value);
    setFormData((prev) => ({ ...prev, whatsapp: cleanNumber }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/kotak-saran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Gagal mengirim masukan");
      }

      setSubmitted(true);
      toast.success("Aspirasi kamu berhasil terkirim!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan sistem. Silakan coba lagi.");
      toast.error(err.message || "Gagal mengirim masukan.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData({
      isAnonim: true,
      nama: "",
      whatsapp: "",
      kategori: "fasilitas",
      subjek: "",
      pesan: "",
      website_confirm: "",
    });
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border bg-card p-8 text-center shadow-soft sm:p-12 text-foreground">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h3 className="mt-6 text-2xl font-bold">Terima Kasih atas Masukanmu!</h3>
        <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
          Aspirasi kamu telah tersimpan aman di sistem kami. Pihak manajemen sekolah akan meninjau saran ini demi kemajuan bersama.
        </p>
        <button
          onClick={resetForm}
          className="mt-8 rounded-xl border border-input bg-background px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-accent"
        >
          Kirim Saran Lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border bg-card p-6 shadow-soft sm:p-8 text-foreground text-left">
      {/* Header Kecil Form */}
      <div className="flex items-center gap-2 text-primary border-b pb-4">
        <MessageSquare className="h-5 w-5" />
        <span className="text-xs font-bold uppercase tracking-wider">Kotak Saran Online</span>
      </div>

      {error && (
        <div className="p-3 text-sm rounded-lg bg-destructive/10 text-destructive border border-destructive/20 font-medium">
          {error}
        </div>
      )}

      {/* Honeypot Anti-Bot Field (Hidden) */}
      <div className="hidden" aria-hidden="true">
        <input
          type="text"
          name="website_confirm"
          tabIndex={-1}
          autoComplete="off"
          value={formData.website_confirm}
          onChange={handleChange}
        />
      </div>

      {/* Mode Anonim Toggle Card */}
      <div className="rounded-2xl border bg-muted/40 p-4 space-y-3">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Identitas Pengirim</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, isAnonim: true }))}
            className={`flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-semibold transition-all ${
              formData.isAnonim
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-background text-muted-foreground border hover:text-foreground"
            }`}
          >
            <UserX className="h-4 w-4" /> Kirim Anonim
          </button>
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, isAnonim: false }))}
            className={`flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-semibold transition-all ${
              !formData.isAnonim
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-background text-muted-foreground border hover:text-foreground"
            }`}
          >
            <UserCheck className="h-4 w-4" /> Cantumkan Identitas
          </button>
        </div>

        {formData.isAnonim ? (
          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-1">
            <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" /> Identitas kamu tidak akan tersimpan di database kami.
          </p>
        ) : (
          <div className="grid gap-4 pt-2 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Nama Lengkap</label>
              <input
                type="text"
                name="nama"
                required={!formData.isAnonim}
                value={formData.nama}
                onChange={handleChange}
                placeholder="Contoh: Ahmad Fauzi"
                className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">No. WhatsApp (Opsional)</label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleWhatsAppChange}
                placeholder="Contoh: 081234567xxx"
                className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition"
              />
            </div>
          </div>
        )}
      </div>

      {/* Kategori */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold">Kategori Aspirasi / Masukan</label>
        <select
          name="kategori"
          value={formData.kategori}
          onChange={handleChange}
          className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition"
        >
          {KATEGORI_OPTIONS.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>
      </div>

      {/* Subjek */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold">Subjek / Judul Singkat</label>
        <input
          type="text"
          name="subjek"
          required
          maxLength={100}
          value={formData.subjek}
          onChange={handleChange}
          placeholder="Contoh: Perbaikan AC di Ruang Lab Komputer 2"
          className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition"
        />
      </div>

      {/* Pesan */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold">Detail Pesan / Saran</label>
        <textarea
          name="pesan"
          required
          rows={4}
          minLength={10}
          maxLength={1000}
          value={formData.pesan}
          onChange={handleChange}
          placeholder="Tuliskan saran atau kritik membangun kamu secara jelas..."
          className="w-full rounded-xl border bg-background p-4 text-sm outline-none focus:border-primary transition"
        />
        <div className="flex justify-end text-[11px] text-muted-foreground">
          {formData.pesan.length}/1000 karakter
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Mengirim Masukan...
          </>
        ) : (
          <>
            Kirim Aspirasi <Send className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}