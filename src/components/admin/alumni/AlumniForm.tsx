"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AlumniFormState } from "@/types/alumni";

interface Props {
  formData: AlumniFormState;
  setFormData: React.Dispatch<React.SetStateAction<AlumniFormState>>;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function AlumniForm({ formData, setFormData, isSubmitting, onSubmit }: Props) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="bg-card border p-6 rounded-2xl shadow-sm lg:col-span-1">
      <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
        <Plus className="h-4 w-4 text-primary" /> Input Data Alumni Baru
      </h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold block mb-1">Nama Lengkap</label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            placeholder="Contoh: Ahmad Dani"
            className="w-full bg-background border p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold block mb-1">Angkatan (Tahun)</label>
            <input
              type="number"
              name="angkatan"
              value={formData.angkatan}
              onChange={handleChange}
              placeholder="2026"
              className="w-full bg-background border p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary transition"
            />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Jurusan</label>
            <select
              name="jurusan"
              value={formData.jurusan}
              onChange={handleChange}
              className="w-full bg-background border p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary transition"
            >
              <option value="TKJ">TKJ</option>
              <option value="TAV">TAV</option>
              <option value="TKR">TKR</option>
              <option value="DM">Digital Marketing</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold block mb-1">Status Lulusan Saat Ini</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full bg-background border p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary transition"
          >
            <option value="Bekerja">💼 Bekerja</option>
            <option value="Kuliah">🎓 Kuliah / Lanjut Studi</option>
            <option value="Wirausaha">🚀 Wirausaha / Bisnis</option>
            <option value="Mencari Kerja">🔍 Mencari Kerja (Job Seeker)</option>
          </select>
        </div>

        {formData.status !== "Mencari Kerja" && (
          <div>
            <label className="text-xs font-semibold block mb-1">Nama Instansi / Univ / Usaha</label>
            <input
              type="text"
              name="tempat"
              value={formData.tempat}
              onChange={handleChange}
              placeholder="Contoh: PT. Toyota / Universitas Brawijaya"
              className="w-full bg-background border p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary transition"
            />
          </div>
        )}

        {formData.status === "Bekerja" && (
          <div>
            <label className="text-xs font-semibold block mb-1">Jabatan / Posisi Kerja</label>
            <input
              type="text"
              name="posisi"
              value={formData.posisi}
              onChange={handleChange}
              placeholder="Contoh: Mekanik / Quality Control"
              className="w-full bg-background border p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary transition"
            />
          </div>
        )}

        <div>
          <label className="text-xs font-semibold block mb-1">No. WhatsApp Alumni (Opsional)</label>
          <input
            type="text"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            placeholder="081234567890"
            className="w-full bg-background border p-2.5 rounded-xl text-sm focus:outline-none focus:border-primary transition"
          />
        </div>

        <div>
          <label className="text-xs font-semibold block mb-1">Testimoni / Message (Opsional)</label>
          <textarea
            name="testimoni"
            value={formData.testimoni}
            onChange={handleChange}
            placeholder="Kesan pesan untuk adik kelas di SMK Al Kaaffah..."
            className="w-full bg-background border p-2.5 rounded-xl text-sm h-20 resize-none focus:outline-none focus:border-primary transition"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-5 rounded-xl font-bold text-sm mt-2"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Data Alumni"}
        </Button>
      </form>
    </div>
  );
}