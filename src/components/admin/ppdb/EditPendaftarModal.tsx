"use client";

import React, { useState, useEffect } from "react";
import { Pendaftar } from "@/types/ppdb";
import { DAFTAR_JURUSAN, DAFTAR_PROGRAM_UNGGULAN, DAFTAR_EKSKUL } from "@/constants/ppdb";
import { Button } from "@/components/ui/button";
import { Pencil, X, Save, Loader2 } from "lucide-react";

interface Props {
  pendaftar: Pendaftar | null;
  onClose: () => void;
  onSave: (data: {
    namaLengkap: string;
    nisn: string;
    whatsapp: string;
    asalSekolah: string;
    pilihanJurusan: string;
    programUnggulan: string;
    ekstrakurikuler: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export function EditPendaftarModal({ pendaftar, onClose, onSave, isSubmitting }: Props) {
  const [nama, setNama] = useState("");
  const [nisn, setNisn] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [asalSekolah, setAsalSekolah] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [programUnggulan, setProgramUnggulan] = useState("");
  const [ekskul, setEkskul] = useState("");

  useEffect(() => {
    if (pendaftar) {
      setNama(pendaftar.namaLengkap || "");
      setNisn(pendaftar.nisn || "");
      setWhatsapp(pendaftar.whatsapp || "");
      setAsalSekolah(pendaftar.asalSekolah || "");
      setJurusan(pendaftar.pilihanJurusan || "");
      setProgramUnggulan(pendaftar.programUnggulan || "");
      setEkskul(pendaftar.ekstrakurikuler || "");
    }
  }, [pendaftar]);

  if (!pendaftar) return null;

  const handleSubmit = () => {
    if (!nama.trim() || !nisn.trim() || !asalSekolah.trim() || !whatsapp.trim() || !jurusan.trim()) {
      alert("Nama, NISN, WhatsApp, Asal Sekolah, dan Pilihan Jurusan tidak boleh kosong!");
      return;
    }

    onSave({
      namaLengkap: nama.trim(),
      nisn: nisn.trim(),
      whatsapp: whatsapp.trim(),
      asalSekolah: asalSekolah.trim(),
      pilihanJurusan: jurusan.trim(),
      programUnggulan: programUnggulan.trim(),
      ekstrakurikuler: ekskul.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm print:hidden">
      <div className="bg-card w-full max-w-lg rounded-2xl border shadow-xl overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Pencil className="h-5 w-5 text-blue-600" /> Edit Data Pendaftar
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition rounded-lg p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 text-sm max-h-[70vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition"
              placeholder="Masukkan Nama Lengkap"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">NISN</label>
              <input
                type="text"
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                className="w-full rounded-xl border bg-background px-3 py-2 text-sm font-mono outline-none focus:border-primary transition"
                placeholder="Masukkan NISN"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">No. WhatsApp</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition"
                placeholder="08123456789"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Asal Sekolah</label>
            <input
              type="text"
              value={asalSekolah}
              onChange={(e) => setAsalSekolah(e.target.value)}
              className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition"
              placeholder="Masukkan Asal Sekolah"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Pilihan Jurusan Utama</label>
            <select
              value={jurusan}
              onChange={(e) => setJurusan(e.target.value)}
              className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition"
            >
              <option value="">-- Pilih Jurusan --</option>
              {DAFTAR_JURUSAN.map((j) => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Program Unggulan</label>
              <select
                value={programUnggulan}
                onChange={(e) => setProgramUnggulan(e.target.value)}
                className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition"
              >
                <option value="Belum Memilih">-- Pilih Program --</option>
                {DAFTAR_PROGRAM_UNGGULAN.map((prog) => (
                  <option key={prog} value={prog}>{prog}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Ekstrakurikuler</label>
              <select
                value={ekskul}
                onChange={(e) => setEkskul(e.target.value)}
                className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition"
              >
                <option value="Belum Memilih">-- Pilih Ekskul --</option>
                {DAFTAR_EKSKUL.map((eks) => (
                  <option key={eks} value={eks}>{eks}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Simpan Perubahan
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}