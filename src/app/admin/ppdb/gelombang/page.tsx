"use client";

import React, { useEffect, useState } from "react";
import { GelombangSPMB } from "@/types/gelombang";
import { 
  getAllGelombang, 
  addGelombang, 
  updateGelombang, 
  deleteGelombang,
  setActiveGelombangOnly 
} from "@/services/gelombangService";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2, CheckCircle2, Calendar, Sparkles, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ManagementGelombangPage(): React.JSX.Element {
  const [listGelombang, setListGelombang] = useState<GelombangSPMB[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [namaGelombang, setNamaGelombang] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [kuota, setKuota] = useState<number | "">("");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllGelombang();
      setListGelombang(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setNamaGelombang("");
    setTanggalMulai("");
    setTanggalSelesai("");
    setKeterangan("");
    setKuota("");
  };

  const handleEditClick = (g: GelombangSPMB) => {
    setEditingId(g.id);
    setNamaGelombang(g.namaGelombang);
    setTanggalMulai(g.tanggalMulai);
    setTanggalSelesai(g.tanggalSelesai);
    setKeterangan(g.keterangan || "");
    setKuota(g.kuota || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaGelombang || !tanggalMulai || !tanggalSelesai) return;

    setSubmitting(true);
    try {
      if (editingId) {
        await updateGelombang(editingId, {
          namaGelombang,
          tanggalMulai,
          tanggalSelesai,
          keterangan,
          kuota: kuota ? Number(kuota) : undefined,
        });
      } else {
        await addGelombang({
          namaGelombang,
          tanggalMulai,
          tanggalSelesai,
          keterangan,
          kuota: kuota ? Number(kuota) : undefined,
          isActive: listGelombang.length === 0, // Aktif otomatis jika gelombang pertama
        });
      }
      resetForm();
      await loadData();
    } catch (err) {
      alert("Gagal menyimpan data gelombang.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleAktif = async (id: string) => {
    setLoading(true);
    try {
      await setActiveGelombangOnly(listGelombang, id);
      await loadData();
    } catch (err) {
      alert("Gagal memperbarui status aktif.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus gelombang ini?")) return;
    try {
      await deleteGelombang(id);
      await loadData();
    } catch (err) {
      alert("Gagal menghapus.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16 text-foreground">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/admin/ppdb" className="inline-flex items-center text-xs text-muted-foreground hover:text-primary mb-2">
              <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Kembali ke Dashboard SPMB
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">Manajemen Gelombang SPMB</h1>
            <p className="text-xs text-muted-foreground">Atur periode dan status gelombang pendaftaran murid baru</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* FORM INPUT GELOMBANG */}
          <div className="lg:col-span-5 border rounded-2xl p-6 bg-card text-card-foreground shadow-xs h-fit">
            <h2 className="text-base font-bold mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              {editingId ? "Edit Gelombang" : "Tambah Gelombang Baru"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Nama Gelombang</label>
                <input
                  type="text"
                  placeholder="Contoh: Gelombang 1 / Inden"
                  required
                  value={namaGelombang}
                  onChange={(e) => setNamaGelombang(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-xl bg-background text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Tanggal Mulai</label>
                  <input
                    type="date"
                    required
                    value={tanggalMulai}
                    onChange={(e) => setTanggalMulai(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-xl bg-background text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Tanggal Selesai</label>
                  <input
                    type="date"
                    required
                    value={tanggalSelesai}
                    onChange={(e) => setTanggalSelesai(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-xl bg-background text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Target Kuota Siswa (Opsional)</label>
                <input
                  type="number"
                  placeholder="Contoh: 100"
                  value={kuota}
                  onChange={(e) => setKuota(e.target.value ? Number(e.target.value) : "")}
                  className="w-full mt-1 px-3 py-2 border rounded-xl bg-background text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Keterangan / Benefit Promo</label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Potongan DPP 50% & Gratis Seragam"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-xl bg-background text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button type="submit" disabled={submitting} size="sm" className="w-full rounded-xl">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? "Update Gelombang" : "Simpan Gelombang"}
                </Button>
                {editingId && (
                  <Button type="button" onClick={resetForm} variant="outline" size="sm" className="rounded-xl">
                    Batal
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* LIST GELOMBANG */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-base font-bold">Daftar Gelombang Pendaftaran</h2>

            {loading ? (
              <div className="py-12 text-center text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                Memuat gelombang...
              </div>
            ) : listGelombang.length === 0 ? (
              <div className="border rounded-2xl p-8 text-center bg-card text-muted-foreground">
                Belum ada gelombang pendaftaran yang dibuat.
              </div>
            ) : (
              listGelombang.map((g) => (
                <div
                  key={g.id}
                  className={`border rounded-2xl p-5 bg-card transition-all ${
                    g.isActive ? "border-emerald-500 shadow-xs ring-1 ring-emerald-500/20" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base">{g.namaGelombang}</h3>
                        {g.isActive ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-500 text-[11px] px-2.5 py-0.5 rounded-full font-bold">
                            <CheckCircle2 className="h-3 w-3" /> Gelombang Aktif saat Ini
                          </span>
                        ) : (
                          <span className="bg-muted text-muted-foreground text-[11px] px-2.5 py-0.5 rounded-full font-semibold">
                            Tidak Aktif
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        🗓️ {g.tanggalMulai} s/d {g.tanggalSelesai}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditClick(g)}
                        className="p-2 text-muted-foreground hover:text-primary rounded-lg transition"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(g.id)}
                        className="p-2 text-muted-foreground hover:text-red-500 rounded-lg transition"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {g.keterangan && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 p-2.5 rounded-xl">
                      <Sparkles className="h-3.5 w-3.5 shrink-0" />
                      <span>{g.keterangan}</span>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Target Kuota: <strong className="text-foreground">{g.kuota ? `${g.kuota} Siswa` : "Tanpa Batas"}</strong>
                    </span>
                    {!g.isActive && (
                      <Button
                        onClick={() => handleToggleAktif(g.id)}
                        variant="outline"
                        size="sm"
                        className="rounded-lg text-xs"
                      >
                        Set Sebagai Gelombang Aktif
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}