"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // 👈 Added router
import { db } from "@/lib/firebase"; // Sesuaikan path config Firebase lo
import { doc, writeBatch, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { sendTelegramNotification } from "@/lib/telegram";

// 🚀 DAFTAR JURUSAN MANUAL
const JURUSAN_MANUAL = [
  { code: "TKJ", title: "Teknik Komputer & Jaringan" },
  { code: "TAV", title: "Teknik Audio Video" },
  { code: "TKR", title: "Teknik Kendaraan Ringan" },
];

// 🚀 DAFTAR EKSKUL MANUAL
const EKSKUL_MANUAL = [
  "Pramuka",
  "Paskibra",
  "Futsal / Sepakbola",
  "Bola Voli",
  "Seni Hadrah / Banjari",
  "Pencak Silat",
  "English Club",
];

// 🚀 DAFTAR PROGRAM UNGGULAN MANUAL
const PROGRAM_UNGGULAN_MANUAL = [
  "Kelas Bahasa Jepang",
  "Kelas Digital Marketing",
  "Tahfidz Al-Qur'an",
];

export function FormPPDB() {
  const router = useRouter(); // 👈 Inisialisasi Next.js Router
  
  const [formData, setFormData] = useState({
    namaLengkap: "",
    nisn: "",
    asalSekolah: "",
    whatsapp: "",
    pilihanJurusan: "",
    ekstrakurikuler: "",
    programUnggulan: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNisnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData({ ...formData, nisn: onlyDigits });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.nisn.length !== 10) {
      setError("NISN harus berjumlah tepat 10 digit.");
      setLoading(false);
      return;
    }

    try {
      const batch = writeBatch(db);

      // 🎫 1. Generate Nomor Registrasi Unik (Contoh: REG-2026-981234)
      const year = new Date().getFullYear();
      const randomDigits = Date.now().toString().slice(-6);
      const noRegistrasi = `REG-${year}-${randomDigits}`;

      // 2. Dokumen lengkap — cuma bisa dibaca admin/panitia
      batch.set(doc(db, "ppdb", formData.nisn), {
        ...formData,
        noRegistrasi, // 👈 Disimpan ke database
        ekstrakurikuler: formData.ekstrakurikuler || "Belum Memilih",
        programUnggulan: formData.programUnggulan || "Belum Memilih",
        statusPendaftaran: "Menunggu Verifikasi",
        createdAt: serverTimestamp(),
      });

      // 3. Dokumen publik
      batch.set(doc(db, "ppdb_public", formData.nisn), {
        namaLengkap: formData.namaLengkap,
        nisn: formData.nisn,
        noRegistrasi,
        asalSekolah: formData.asalSekolah,
        pilihanJurusan: formData.pilihanJurusan,
        statusPendaftaran: "Menunggu Verifikasi",
      });

      await batch.commit();

      // 📱 4. KIRIM NOTIFIKASI TELEGRAM OTOMATIS KE PANITIA
      try {
        await sendTelegramNotification({
          noRegistrasi, // 👈 Sertakan di Telegram
          namaLengkap: formData.namaLengkap,
          nisn: formData.nisn,
          asalSekolah: formData.asalSekolah,
          pilihanJurusan: formData.pilihanJurusan,
          programUnggulan: formData.programUnggulan,
          ekstrakurikuler: formData.ekstrakurikuler,
          whatsapp: formData.whatsapp,
        });
      } catch (telegramErr) {
        console.error("Gagal mengirim notif Telegram:", telegramErr);
      }

      // 🚀 5. REDIRECT LANGSUNG KE HALAMAN BUKTI BERSAMA DATA PEMOHON
      const queryParams = new URLSearchParams({
        id: noRegistrasi,
        nama: formData.namaLengkap,
        nisn: formData.nisn,
        jurusan: formData.pilihanJurusan,
        asal: formData.asalSekolah,
        wa: formData.whatsapp,
      }).toString();

      // Alihkan ke /spmb/sukses (sesuaikan path jika folder sukses lo beda)
      router.push(`/ppdb/sukses?${queryParams}`);

    } catch (err: any) {
      console.error(err);
      if (err?.code === "permission-denied") {
        setError("NISN ini sudah pernah terdaftar sebelumnya. Kalau ini bukan kamu, hubungi panitia SPMB.");
      } else {
        setError("Terjadi kesalahan sistem. Silakan coba lagi.");
      }
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

      {/* Nama Lengkap */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold">Nama Lengkap</label>
        <input type="text" name="namaLengkap" required value={formData.namaLengkap} onChange={handleChange} placeholder="Sesuai Ijazah" className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition" />
      </div>

      {/* NISN & Asal Sekolah */}
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

      {/* WhatsApp */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold">No. WhatsApp Aktif Kamu / Ortu Kamu</label>
        <input type="tel" name="whatsapp" required value={formData.whatsapp} onChange={handleChange} placeholder="Contoh: 081234567xxx" className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition" />
      </div>

      {/* Pilihan Jurusan */}
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

      {/* PILIHAN PROGRAM UNGGULAN (OPSIONAL) */}
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

      {/* PILIHAN EKSTRAKURIKULER (OPSIONAL) */}
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

      {/* Tombol Submit */}
      <Button type="submit" disabled={loading} className="w-full bg-gradient-primary rounded-xl py-6 font-semibold">
        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</> : <><Send className="mr-2 h-4 w-4" /> Kirim Formulir Pendaftaran</>}
      </Button>
    </form>
  );
}