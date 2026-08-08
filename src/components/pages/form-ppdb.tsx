"use client";

import React, { useState } from "react";
import { db } from "@/lib/firebase"; // Sesuaikan path config Firebase lo
import { doc, setDoc, writeBatch, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Send, Loader2 } from "lucide-react";

// 🚀 DAFTAR JURUSAN MANUAL (Bisa lo tambah / ubah / hapus bebas)
const JURUSAN_MANUAL = [
  { code: "TKJ", title: "Teknik Komputer & Jaringan" },
  { code: "TAV", title: "Teknik Audio Video" },
  { code: "TKR", title: "Teknik Kendaraan Ringan" },
];

// 🚀 DAFTAR EKSKUL MANUAL (Bisa lo tambah / ubah / hapus bebas di sini)
const EKSKUL_MANUAL = [
  "Pramuka",
  "Paskibra",
  "Futsal / Sepakbola",
  "Bola Voli",
  "Seni Hadrah / Banjari",
  "Pencak Silat",
  "English Club",
];

// 🚀 DAFTAR PROGRAM UNGGULAN MANUAL (Bisa lo tambah / ubah / hapus bebas di sini)
const PROGRAM_UNGGULAN_MANUAL = [
  "Kelas Bahasa Jepang",
  "Kelas Digital Marketing",
  "Tahfidz Al-Qur'an",
];

export function FormPPDB() {
  const [formData, setFormData] = useState({
    namaLengkap: "",
    nisn: "",
    asalSekolah: "",
    whatsapp: "",
    pilihanJurusan: "",
    ekstrakurikuler: "", // Field baru
    programUnggulan: "", // Field baru
  });

  const [loading, setLoading] = useState(false);
  const [sukses, setSukses] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handler khusus NISN: paksa cuma digit & maksimal 10 karakter.
  // Sengaja dipisah dari handleChange biasa dan TIDAK pakai <input type="number">,
  // karena type="number" otomatis strip leading zero (NISN sering diawali "0").
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
      // setDoc dengan docId = NISN (bukan addDoc dengan ID random).
      // Ini bikin rule Firestore "allow create: if !exists(...)" beneran ngefek
      // sebagai proteksi 1 NISN cuma boleh daftar 1x.
      const batch = writeBatch(db);

      // 1. Dokumen lengkap — cuma bisa dibaca admin/panitia (lihat firestore.rules)
      batch.set(doc(db, "ppdb", formData.nisn), {
        ...formData,
        // Jika tidak memilih, set default "Belum Memilih" biar rapi di database
        ekstrakurikuler: formData.ekstrakurikuler || "Belum Memilih",
        programUnggulan: formData.programUnggulan || "Belum Memilih",
        statusPendaftaran: "Menunggu Verifikasi",
        createdAt: serverTimestamp(),
      });

      // 2. Dokumen publik — SENGAJA cuma field yang aman buat ditampilin ke
      // siapapun di halaman /ppdb/pengumuman. whatsapp TIDAK PERNAH ditulis ke sini.
      batch.set(doc(db, "ppdb_public", formData.nisn), {
        namaLengkap: formData.namaLengkap,
        nisn: formData.nisn,
        asalSekolah: formData.asalSekolah,
        pilihanJurusan: formData.pilihanJurusan,
        statusPendaftaran: "Menunggu Verifikasi",
      });

      await batch.commit();
      
      setSukses(true);
      setFormData({
        namaLengkap: "",
        nisn: "",
        asalSekolah: "",
        whatsapp: "",
        pilihanJurusan: "",
        ekstrakurikuler: "",
        programUnggulan: "",
      });
    } catch (err: any) {
      console.error(err);
      // Rules Firestore nolak create kalau docId (=NISN) udah pernah dipakai sebelumnya
      if (err?.code === "permission-denied") {
        setError("NISN ini sudah pernah terdaftar sebelumnya. Kalau ini bukan kamu, hubungi panitia SPMB.");
      } else {
        setError("Terjadi kesalahan sistem. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (sukses) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/50 p-6 text-center dark:bg-emerald-950/20">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
        <h3 className="mt-4 text-xl font-bold text-emerald-900 dark:text-emerald-400">Pendaftaran Berhasil!</h3>
        <p className="mt-2 text-sm text-emerald-700/80 dark:text-emerald-500">
          Data pendaftaran kamu telah tersimpan. Panitia SPMB SMK Al Kaaffah akan segera menghubungi WhatsApp kamu.
        </p>
        <Button onClick={() => setSukses(false)} variant="outline" className="mt-6">
          Kirim Pendaftaran Lain
        </Button>
      </div>
    );
  }

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

      {/* 🚀 PILIHAN PROGRAM UNGGULAN (OPSIONAL) */}
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

      {/* 🚀 PILIHAN EKSTRAKURIKULER (OPSIONAL) */}
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