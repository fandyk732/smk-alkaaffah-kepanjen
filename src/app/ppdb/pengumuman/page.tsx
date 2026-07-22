"use client";

import React, { useState, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { Search, CheckCircle2, XCircle, Clock, Loader2, Award, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Siswa {
  namaLengkap: string;
  nisn: string;
  asalSekolah: string;
  pilihanJurusan: string;
  statusPendaftaran: "Menunggu Verifikasi" | "Diterima" | "Ditolak";
}

export default function PengumumanPage() {
  const [nisnInput, setNisnInput] = useState("");
  const [dataSiswa, setDataSiswa] = useState<Siswa | null>(null);
  const [loading, setLoading] = useState(false);
  const [sudahCari, setSudahCari] = useState(false);

  // Ref untuk Surat Keterangan Fisik
  const suratRef = useRef<HTMLDivElement>(null);

  // Fungsi Cek Kelulusan berdasarkan NISN
  const cekKelulusan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nisnInput.trim()) return;

    setLoading(true);
    setSudahCari(true);
    setDataSiswa(null);

    try {
      // Cari di Firestore yang NISN-nya cocok
      const q = query(
        collection(db, "ppdb"),
        where("nisn", "==", nisnInput.trim()),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          setDataSiswa(doc.data() as Siswa);
        });
      }
    } catch (error) {
      console.error("Gagal mengecek nomor NISN:", error);
      alert("Terjadi kesalahan sistem, silakan coba lagi beberapa saat.");
    } finally {
      setLoading(false);
    }
  };

  // 🎯 FUNGSI CETAK/SAVE PDF NATIVE (100% BEBAS ERROR LAB/OKLCH COLOR)
  const downloadPDFSurat = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20 text-foreground">
      <div className="max-w-2xl mx-auto px-4">
        
        {/* Card Input Pencarian */}
        <div className="bg-card border rounded-3xl p-6 sm:p-8 shadow-md text-center">
          <Award className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Pengumuman Hasil Seleksi PPDB</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            Masukkan Nomor Induk Siswa Nasional (NISN) resmi kamu untuk melihat status kelulusan penerimaan siswa baru.
          </p>

          <form onSubmit={cekKelulusan} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                required
                maxLength={10}
                placeholder="Contoh: 0081234567"
                value={nisnInput}
                onChange={(e) => setNisnInput(e.target.value.replace(/\D/g, ""))} // Hanya boleh angka
                className="w-full pl-9 rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition"
              />
            </div>
            <Button type="submit" disabled={loading} className="rounded-xl bg-gradient-primary">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Cek Hasil
            </Button>
          </form>
        </div>

        {/* ================= HASIL PENCARIAN ================= */}
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : sudahCari && !dataSiswa ? (
            <div className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 p-6 rounded-2xl border border-red-200 dark:border-red-900 text-center">
              <p className="font-semibold">Data Tidak Ditemukan</p>
              <p className="text-xs mt-1 text-red-600/80 dark:text-red-400/80">
                NISN <span className="font-mono font-bold">{nisnInput}</span> tidak terdaftar di sistem PPDB kami. Periksa kembali nomor yang kamu masukkan.
              </p>
            </div>
          ) : dataSiswa ? (
            <div className="bg-card border rounded-3xl p-6 sm:p-8 shadow-lg overflow-hidden relative">
              
              {/* Desain Header Status */}
              {dataSiswa.statusPendaftaran === "Diterima" && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 text-center mb-6">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                  <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Selamat, Kamu Diterima!</h3>
                  <p className="text-xs text-muted-foreground mt-1">Kamu dinyatakan lolos seleksi menjadi bagian dari SMK Al Kaaffah Kepanjen.</p>
                </div>
              )}

              {dataSiswa.statusPendaftaran === "Ditolak" && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-5 text-center mb-6">
                  <XCircle className="h-10 w-10 text-destructive mx-auto mb-2" />
                  <h3 className="text-xl font-bold text-destructive">Mohon Maaf, Kamu Belum Lolos</h3>
                  <p className="text-xs text-muted-foreground mt-1">Jangan patah semangat, jalan menuju masa depan gemilang masih terbuka lebar di tempat lain!</p>
                </div>
              )}

              {dataSiswa.statusPendaftaran === "Menunggu Verifikasi" && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 text-center mb-6">
                  <Clock className="h-10 w-10 text-amber-500 mx-auto mb-2" />
                  <h3 className="text-xl font-bold text-amber-600 dark:text-amber-400">Berkas Sedang Diverifikasi</h3>
                  <p className="text-xs text-muted-foreground mt-1">Panitia sedang memeriksa kelengkapan data kamu. Cek halaman ini secara berkala ya.</p>
                </div>
              )}

              {/* Detail Ringkas Siswa */}
              <div className="space-y-3 text-sm border-t pt-4">
                <div className="flex justify-between py-1 border-b border-dashed">
                  <span className="text-muted-foreground">Nama Lengkap</span>
                  <span className="font-bold">{dataSiswa.namaLengkap}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed">
                  <span className="text-muted-foreground">NISN</span>
                  <span className="font-mono font-semibold">{dataSiswa.nisn}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed">
                  <span className="text-muted-foreground">Asal Sekolah</span>
                  <span className="font-semibold">{dataSiswa.asalSekolah}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Pilihan Kompetensi Keahlian</span>
                  <span className="font-bold text-primary">{dataSiswa.pilihanJurusan}</span>
                </div>
              </div>

              {/* 🎯 TOMBOL CETAK / SIMPAN PDF */}
              {dataSiswa.statusPendaftaran !== "Menunggu Verifikasi" && (
                <div className="mt-8 flex justify-center">
                  <Button 
                    onClick={downloadPDFSurat}
                    className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 rounded-xl px-6"
                  >
                    <Printer className="h-4 w-4 mr-2" /> Cetak / Simpan Surat (PDF)
                  </Button>
                </div>
              )}

            </div>
          ) : null}
        </div>

      </div>

      {/* =========================================================================
          📄 KOP SURAT (TAMPIL HANYA KETIKA DI-PRINT / DITAMBAHKAN STYLESHEET PRINT)
          ========================================================================= */}
      {dataSiswa && (
        <>
          <style jsx global>{`
            @media print {
              /* Sembunyikan elemen visual situs saat print */
              body * {
                visibility: hidden !important;
              }

              /* Munculkan HANYA area surat resmi */
              #area-surat-pdf, #area-surat-pdf * {
                visibility: visible !important;
              }

              /* Posisi presisi di kertas A4 */
              #area-surat-pdf {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 10mm !important;
                box-shadow: none !important;
                background-color: #ffffff !important;
                color: #000000 !important;
              }

              @page {
                size: A4 portrait;
                margin: 0;
              }
            }
          `}</style>

          <div className="hidden print:block">
            <div
              id="area-surat-pdf"
              ref={suratRef}
              className="w-[210mm] min-h-[297mm] p-[15mm] text-black font-serif text-[15px] leading-relaxed bg-white"
              style={{ fontFamily: "'Times New Roman', Times, serif" }}
            >
              {/* Kop Surat Header */}
              <div className="text-center border-b-4 border-black pb-3 mb-6">
                <h2 className="text-[20px] font-bold uppercase tracking-wide m-0 text-black">YAYASAN AL KAAFFAH KEPANJEN</h2>
                <h1 className="text-[22px] font-bold uppercase tracking-wide m-0 text-black">SMK AL KAAFFAH KEPANJEN</h1>
                <p className="text-[13px] italic m-0 mt-1 text-black">Jl. Semeru Nomor 18a Dilem, Kepanjen, Kabupaten Malang, Jawa Timur</p>
              </div>

              {/* Judul Surat */}
              <div className="text-center mb-6">
                <p className="text-[17px] font-bold underline m-0 text-black">SURAT KETERANGAN HASIL SELEKSI PPDB</p>
                <p className="text-[14px] m-0 text-black">Nomor: P/045/PPDB-{new Date().getFullYear()}</p>
              </div>

              <p className="text-justify mb-4 text-black">
                Berdasarkan hasil seleksi administrasi, ujian akademik, dan wawancara yang telah dilaksanakan oleh Panitia Penerimaan Peserta Didik Baru (PPDB) SMK Al Kaaffah Kepanjen, dengan ini menerangkan bahwa:
              </p>

              {/* Tabel Identitas Siswa */}
              <table className="w-[90%] mx-auto my-4 border-collapse text-[15px] text-black">
                <tbody>
                  <tr>
                    <td className="py-1.5 w-[35%] font-medium">Nama Lengkap</td>
                    <td className="py-1.5">: <strong>{dataSiswa.namaLengkap}</strong></td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-medium">NISN</td>
                    <td className="py-1.5">: {dataSiswa.nisn}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-medium">Asal Sekolah</td>
                    <td className="py-1.5">: {dataSiswa.asalSekolah}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-medium">Kompetensi Keahlian</td>
                    <td className="py-1.5">: <strong>{dataSiswa.pilihanJurusan}</strong></td>
                  </tr>
                </tbody>
              </table>

              <p className="text-justify my-4 text-black">
                Berdasarkan hasil rapat pleno panitia seleksi, yang bersangkutan di atas:
              </p>

              {/* Box Keputusan */}
              <div 
                className="w-[80%] mx-auto my-6 p-4 text-center font-bold text-[18px] border-2 rounded-lg"
                style={{
                  backgroundColor: dataSiswa.statusPendaftaran === 'Diterima' ? '#f0fdf4' : '#fef2f2',
                  borderColor: dataSiswa.statusPendaftaran === 'Diterima' ? '#15803d' : '#b91c1c',
                  color: dataSiswa.statusPendaftaran === 'Diterima' ? '#166534' : '#991b1b'
                }}
              >
                {dataSiswa.statusPendaftaran === "Diterima" 
                  ? "DINYATAKAN LULUS / DITERIMA" 
                  : "DINYATAKAN TIDAK LULUS"}
              </div>

              <p className="text-justify my-4 text-black">
                {dataSiswa.statusPendaftaran === 'Diterima' 
                  ? 'Selamat bagi calon peserta didik yang dinyatakan diterima. Harap segera melakukan daftar ulang sesuai jadwal yang ditentukan oleh panitia.' 
                  : 'Terima kasih telah berpartisipasi dalam seleksi PPDB SMK Al Kaaffah. Tetap semangat dan semoga sukses di jenjang berikutnya.'}
              </p>

              {/* Tanda Tangan */}
              <div className="mt-12 float-right text-center w-62.5 text-black">
                <p className="m-0">Malang, {new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="m-0 mb-16">Kepala Sekolah,</p>
                <p className="m-0 font-bold underline">Maya Dian Rosita, S.A.P</p>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}