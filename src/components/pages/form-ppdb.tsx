"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { GelombangSPMB } from "@/types/gelombang";
import { getGelombangAktif } from "@/services/gelombangService";
import { Turnstile } from "@marsidev/react-turnstile"; // 🟢 1. Import Turnstile

const JURUSAN_MANUAL = [
  { code: "TKJ", title: "Teknik Komputer & Jaringan" },
  { code: "TAV", title: "Teknik Audio Video" },
  { code: "TKR", title: "Teknik Kendaraan Ringan" },
];

const EKSKUL_MANUAL = [
  "Pramuka",
  "Paskibra",
  "Futsal / Sepakbola",
  "Bola Voli",
  "Seni Hadrah / Banjari",
  "Pencak Silat",
  "English Club",
];

const PROGRAM_UNGGULAN_MANUAL = [
  "Kelas Bahasa Jepang",
  "Kelas Digital Marketing",
  "Tahfidz Al-Qur'an",
];

export function FormPPDB() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    namaLengkap: "",
    nisn: "",
    asalSekolah: "",
    whatsapp: "",
    pilihanJurusan: "",
    ekstrakurikuler: "",
    programUnggulan: "",
  });

  const [gelombangAktif, setGelombangAktif] = useState<GelombangSPMB | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>(""); // 🟢 2. State Token
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGelombang = async () => {
      try {
        const data = await getGelombangAktif();
        setGelombangAktif(data);
      } catch (err) {
        console.error("Gagal mengambil data gelombang aktif:", err);
      }
    };

    fetchGelombang();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNisnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData({ ...formData, nisn: onlyDigits });
  };

  // 🟢 3. Panggil API Route di handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.nisn.length !== 10) {
      setError("NISN harus berjumlah tepat 10 digit.");
      setLoading(false);
      return;
    }

    if (!turnstileToken) {
      setError("Silakan centang/selesaikan verifikasi captcha terlebih dahulu.");
      setLoading(false);
      return;
    }

    try {
      // Tembak ke API Route /api/ppdb
      const res = await fetch("/api/ppdb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          gelombangId: gelombangAktif?.id || "manual",
          namaGelombang: gelombangAktif?.namaGelombang || "Umum / Tanpa Gelombang",
          token: turnstileToken, // Kirim captcha token
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Gagal mengirim data pendaftaran");
      }

      // Redirect ke halaman bukti
      const queryParams = new URLSearchParams({
        id: result.data.noRegistrasi,
        nama: result.data.namaLengkap,
        nisn: result.data.nisn,
        jurusan: result.data.pilihanJurusan,
        asal: result.data.asalSekolah,
        wa: result.data.whatsapp,
      }).toString();

      router.push(`/ppdb/sukses?${queryParams}`);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan sistem. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border bg-card p-6 shadow-soft sm:p-8 text-foreground text-left">
      {error && (
        <div className="p-3 text-sm rounded-lg bg-destructive/10 text-destructive border border-destructive/20 font-medium">
          {error}
        </div>
      )}

      {/* Input Nama, NISN, dll tetap sama seperti sebelumnya */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold">Nama Lengkap</label>
        <input type="text" name="namaLengkap" required value={formData.namaLengkap} onChange={handleChange} placeholder="Sesuai Ijazah" className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold">NISN</label>
          <input type="text" inputMode="numeric" pattern="[0-9]*" name="nisn" required maxLength={10} value={formData.nisn} onChange={handleNisnChange} placeholder="Contoh: 0081234567" className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold">Asal Sekolah</label>
          <input type="text" name="asalSekolah" required value={formData.asalSekolah} onChange={handleChange} placeholder="SMP / MTs asal" className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold">No. WhatsApp Aktif Kamu / Ortu Kamu</label>
        <input type="tel" name="whatsapp" required value={formData.whatsapp} onChange={handleChange} placeholder="Contoh: 081234567xxx" className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition" />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold">Pilihan Jurusan</label>
        <select name="pilihanJurusan" required value={formData.pilihanJurusan} onChange={handleChange} className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition">
          <option value="">-- Pilih Jurusan Utama --</option>
          {JURUSAN_MANUAL.map((p) => (
            <option key={p.code} value={p.title}>
              {p.title} ({p.code})
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold">Pilihan Program Unggulan</label>
          <span className="text-xs text-muted-foreground font-normal">(Opsional)</span>
        </div>
        <select name="programUnggulan" value={formData.programUnggulan} onChange={handleChange} className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition">
          <option value="">-- Belum Memilih / Nanti Saja --</option>
          {PROGRAM_UNGGULAN_MANUAL.map((prog, idx) => (
            <option key={idx} value={prog}>
              {prog}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold">Pilihan Ekstrakurikuler Minat</label>
          <span className="text-xs text-muted-foreground font-normal">(Opsional)</span>
        </div>
        <select name="ekstrakurikuler" value={formData.ekstrakurikuler} onChange={handleChange} className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition">
          <option value="">-- Belum Memilih / Nanti Saja --</option>
          {EKSKUL_MANUAL.map((eks, idx) => (
            <option key={idx} value={eks}>
              {eks}
            </option>
          ))}
        </select>
      </div>

      {/* 🟢 4. Pasang Widget Turnstile Tepat Di Atas Tombol Submit */}
      <div className="py-2 flex justify-center">
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
          onSuccess={(token) => setTurnstileToken(token)}
          onExpire={() => setTurnstileToken("")}
        />
      </div>

      <Button type="submit" disabled={loading || !turnstileToken} className="w-full bg-gradient-primary rounded-xl py-6 font-semibold">
        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</> : <><Send className="mr-2 h-4 w-4" /> Kirim Formulir Pendaftaran</>}
      </Button>
    </form>
  );
}