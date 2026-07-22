"use client";

import React, { useState } from "react";
import { db } from "@/lib/firebase"; // Sesuaikan path config Firebase lo
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Send, Loader2 } from "lucide-react";
import { programs } from "@/data/site"; // Mengambil list jurusan

export function FormPPDB() {
  const [formData, setFormData] = useState({
    namaLengkap: "",
    nisn: "",
    asalSekolah: "",
    whatsapp: "",
    pilihanJurusan: "",
  });

  const [loading, setLoading] = useState(false);
  const [sukses, setSukses] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.nisn.length < 10) {
      setError("NISN harus berjumlah 10 digit.");
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "PPDB"), {
        ...formData,
        statusPendaftaran: "Menunggu Verifikasi",
        createdAt: serverTimestamp(),
      });
      setSukses(true);
      setFormData({ namaLengkap: "", nisn: "", asalSekolah: "", whatsapp: "", pilihanJurusan: "" });
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan sistem. Silakan coba lagi.");
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
          Data pendaftaran kamu telah tersimpan. Panitia PPDB SMK Al Kaaffah akan segera menghubungi WhatsApp kamu.
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
      <div className="space-y-1.5">
        <label className="text-sm font-semibold">Nama Lengkap</label>
        <input type="text" name="namaLengkap" required value={formData.namaLengkap} onChange={handleChange} placeholder="Sesuai Ijazah" className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold">NISN</label>
          <input type="number" name="nisn" required value={formData.nisn} onChange={handleChange} placeholder="10 Digit" className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold">Asal Sekolah</label>
          <input type="text" name="asalSekolah" required value={formData.asalSekolah} onChange={handleChange} placeholder="SMP / MTs asal" className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition" />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-semibold">No. WhatsApp</label>
        <input type="tel" name="whatsapp" required value={formData.whatsapp} onChange={handleChange} placeholder="Contoh: 081234567xxx" className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition" />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-semibold">Pilihan Jurusan</label>
        <select name="pilihanJurusan" required value={formData.pilihanJurusan} onChange={handleChange} className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition">
          <option value="">-- Pilih Jurusan --</option>
          {programs.map((p) => (
            <option key={p.code} value={p.title}>{p.title} ({p.code})</option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-gradient-primary rounded-xl py-6 font-semibold">
        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</> : <><Send className="mr-2 h-4 w-4" /> Kirim Formulir Pendaftaran</>}
      </Button>
    </form>
  );
}