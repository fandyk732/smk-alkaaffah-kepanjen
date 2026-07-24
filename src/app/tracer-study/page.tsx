"use client";

import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { GraduationCap, Briefcase, Rocket, SearchCheck, CheckCircle2, Send, Loader2 } from "lucide-react";

export default function TracerPublicPage() {
  const [nama, setNama] = useState("");
  const [angkatan, setAngkatan] = useState("");
  const [jurusan, setJurusan] = useState("Teknik Kendaraan Ringan");
  const [status, setStatus] = useState<"Bekerja" | "Kuliah" | "Wirausaha" | "Mencari Kerja">("Bekerja");
  const [tempat, setTempat] = useState("");
  const [posisi, setPosisi] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [testimoni, setTestimoni] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !angkatan) return alert("Harap isi Nama Lengkap dan Angkatan!");
    if (status !== "Mencari Kerja" && !tempat) return alert("Harap isi Nama Instansi / Perusahaan / Kampus!");

    setLoading(true);
    try {
      await addDoc(collection(db, "alumni"), {
        nama,
        angkatan,
        jurusan,
        status,
        tempat: status === "Mencari Kerja" ? "Sedang Mencari Kerja" : tempat,
        posisi: posisi || "",
        whatsapp: whatsapp || "",
        testimoni: testimoni || "",
        createdAt: new Date().toISOString(),
        isSelfSubmit: true // Penanda bahwa data diisi sendiri oleh alumni
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Gagal mengirim data:", error);
      alert("Terjadi kesalahan saat menyimpan data. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen grid place-items-center bg-background p-4">
        <div className="max-w-md w-full bg-card rounded-3xl p-8 border shadow-soft text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Terima Kasih!</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Data Tracer Study kamu berhasil terkirim. Kontribusimu sangat membantu pemetaan alumni dan kemajuan SMK Al Kaaffah Kepanjen.
          </p>
          <Button 
            onClick={() => {
              setSubmitted(false);
              setNama("");
              setAngkatan("");
              setTempat("");
              setPosisi("");
              setWhatsapp("");
              setTestimoni("");
            }} 
            className="w-full rounded-xl py-5"
          >
            Isi Data Lainnya
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="max-w-xl w-full space-y-8">
        
        {/* Header Form */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-primary/10 text-primary rounded-2xl mb-2">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Tracer Study Alumni
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Formulir Pendataan Alumni SMK Al Kaaffah Kepanjen untuk pemetaan karir dan pengembangan jejaring BKK.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-card border rounded-3xl p-6 sm:p-8 shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div>
              <label className="text-xs font-bold text-foreground block mb-1.5">Nama Lengkap *</label>
              <input 
                type="text" 
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama lengkap kamu..." 
                className="w-full bg-secondary/50 border border-input text-foreground placeholder:text-muted-foreground p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5">Tahun Lulus (Angkatan) *</label>
                <input 
                  type="number" 
                  required
                  value={angkatan}
                  onChange={(e) => setAngkatan(e.target.value)}
                  placeholder="Contoh: 2023" 
                  className="w-full bg-secondary/50 border border-input text-foreground placeholder:text-muted-foreground p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5">Jurusan *</label>
                <select 
                  value={jurusan}
                  onChange={(e) => setJurusan(e.target.value)}
                  className="w-full bg-secondary/50 border border-input text-foreground p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                >
                  <option value="Teknik Kendaraan Ringan" className="bg-card text-foreground">TKR (Kendaraan Ringan)</option>
                  <option value="Digital Marketing" className="bg-card text-foreground">DM (Digital Marketing)</option>
                  <option value="Teknik Audio Video" className="bg-card text-foreground">TAV (Audio Video)</option>
                  <option value="Teknik Komputer Jaringan" className="bg-card text-foreground">TKJ (Komputer Jaringan)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1.5">Status Kegiatan Saat Ini *</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "Bekerja", label: "Bekerja", icon: Briefcase },
                  { id: "Kuliah", label: "Kuliah", icon: GraduationCap },
                  { id: "Wirausaha", label: "Wirausaha", icon: Rocket },
                  { id: "Mencari Kerja", label: "Mencari Kerja", icon: SearchCheck },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = status === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setStatus(item.id as any)}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition text-left ${
                        isSelected 
                          ? "border-primary bg-primary/10 text-primary" 
                          : "border-input bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {status !== "Mencari Kerja" && (
              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5">
                  {status === "Bekerja" ? "Nama Perusahaan / Workplace *" : status === "Kuliah" ? "Nama Perguruan Tinggi / Kampus *" : "Nama Usaha / Bisnis *"}
                </label>
                <input 
                  type="text" 
                  required
                  value={tempat}
                  onChange={(e) => setTempat(e.target.value)}
                  placeholder={status === "Bekerja" ? "PT. Honda Prospect Motor" : status === "Kuliah" ? "Universitas Brawijaya" : "Bengkel Motor Jaya"} 
                  className="w-full bg-secondary/50 border border-input text-foreground placeholder:text-muted-foreground p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" 
                />
              </div>
            )}

            {status === "Bekerja" && (
              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5">Jabatan / Posisi Kerja</label>
                <input 
                  type="text" 
                  value={posisi}
                  onChange={(e) => setPosisi(e.target.value)}
                  placeholder="Mekanik / Quality Control / Staff Admin" 
                  className="w-full bg-secondary/50 border border-input text-foreground placeholder:text-muted-foreground p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" 
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-foreground block mb-1.5">No. WhatsApp Aktif (Opsional)</label>
              <input 
                type="text" 
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="081234567890" 
                className="w-full bg-secondary/50 border border-input text-foreground placeholder:text-muted-foreground p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" 
              />
              <p className="text-[11px] text-muted-foreground mt-1">Guna penyaluran info lowongan kerja BKK (jika membutuhkan).</p>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1.5">Testimoni / Pesan untuk Adik Kelas (Opsional)</label>
              <textarea 
                value={testimoni}
                onChange={(e) => setTestimoni(e.target.value)}
                placeholder="Bagikan pengalaman atau motivasi kamu selama/setelah lulus dari SMK Al Kaaffah..." 
                className="w-full bg-secondary/50 border border-input text-foreground placeholder:text-muted-foreground p-3 rounded-xl text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" 
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full py-6 rounded-xl font-bold text-sm gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Kirim Data Tracer Study
                </>
              )}
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
}