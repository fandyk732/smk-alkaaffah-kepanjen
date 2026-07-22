"use client";

import React, { useState } from "react";
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
        collection(db, "PPDB"),
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

  // Fungsi Print Surat Keterangan Hasil Seleksi Pribadi
  const printSuratKelulusan = (siswa: Siswa) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const statusTeks = 
      siswa.statusPendaftaran === "Diterima" ? "DINYATAKAN LULUS / DITERIMA" :
      siswa.statusPendaftaran === "Ditolak" ? "DINYATAKAN TIDAK LULUS" : "MASIH DALAM PROSES VERIFIKASI";

    printWindow.document.write(`
      <html>
        <head>
          <title>Surat Hasil Seleksi PPDB - ${siswa.namaLengkap}</title>
          <style>
            body { font-family: 'Times New Roman', Times, serif; padding: 50px; color: #000; line-height: 1.6; }
            .kop-surat { text-align: center; border-bottom: 4px solid #000; padding-bottom: 10px; margin-bottom: 30px; }
            .kop-title { font-size: 22px; font-weight: bold; margin: 0; }
            .kop-sub { font-size: 14px; margin: 5px 0 0 0; }
            .nomor-surat { text-align: center; margin-bottom: 30px; font-size: 16px; }
            .content { font-size: 16px; text-align: justify; }
            .tabel-data { width: 80%; margin: 20px auto; border-collapse: collapse; }
            .tabel-data td { padding: 8px; font-size: 16px; }
            .box-status { width: 70%; margin: 30px auto; padding: 15px; text-align: center; font-size: 18px; font-weight: bold; border: 3px solid #000; }
            .diterima { background-color: #f0fdf4; border-color: #166534; color: #166534; }
            .ditolak { background-color: #fef2f2; border-color: #991b1b; color: #991b1b; }
            .footer { margin-top: 50px; float: right; text-align: center; font-size: 16px; width: 250px; }
          </style>
        </head>
        <body>
          <div class="kop-surat">
            <div class="kop-title">YAYASAN AL KAAFFAH KEPANJEN</div>
            <div class="kop-title">SMK AL KAAFFAH KEPANJEN</div>
            <div class="kop-sub">Jl. Raya Dilem No.07, Dilem, Kepanjen, Malang, Jawa Timur</div>
          </div>
          
          <div class="nomor-surat">
            <strong><u>SURAT KETERANGAN HASIL SELEKSI PPDB</u></strong><br/>
            Nomor: P/045/PPDB-${new Date().getFullYear()}
          </div>
          
          <div class="content">
            Berdasarkan hasil seleksi administrasi, ujian akademik, dan wawancara yang telah dilaksanakan oleh Panitia Penerimaan Peserta Didik Baru (PPDB) SMK Al Kaaffah Kepanjen, dengan ini menerangkan bahwa:
          </div>
          
          <table class="tabel-data">
            <tr><td style="width: 35%;">Nama Lengkap</td><td>: ${siswa.namaLengkap}</td></tr>
            <tr><td>NISN</td><td>: ${siswa.nisn}</td></tr>
            <tr><td>Asal Sekolah</td><td>: ${siswa.asalSekolah}</td></tr>
            <tr><td>Kompetensi Keahlian</td><td>: ${siswa.pilihanJurusan}</td></tr>
          </table>
          
          <div class="content">
            Berdasarkan hasil rapat pleno panitia seleksi, yang bersangkutan di atas:
          </div>
          
          <div class="box-status ${siswa.statusPendaftaran === 'Diterima' ? 'diterima' : siswa.statusPendaftaran === 'Ditolak' ? 'ditolak' : ''}">
            ${statusTeks}
          </div>
          
          <div class="content" style="margin-top: 20px;">
            ${siswa.statusPendaftaran === 'Diterima' 
              ? 'Selamat bagi calon peserta didik yang dinyatakan diterima. Harap segera melakukan daftar ulang sesuai jadwal yang ditentukan oleh panitia.' 
              : siswa.statusPendaftaran === 'Ditolak' 
              ? 'Terima kasih telah berpartisipasi dalam seleksi PPDB SMK Al Kaaffah. Tetap semangat dan semoga sukses di jenjang berikutnya.'
              : 'Data Anda masih dalam tahap review berkas oleh panitia. Mohon cek kembali halaman ini secara berkala.'}
          </div>

          <div class="footer">
            Malang, ${new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}<br/>
            Kepala Sekolah,
            <br/><br/><br/><br/>
            <strong><u>Maya Dian Rosita, S.A.P</u></strong>
          </div>

          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
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

              {/* Tombol Print Surat Kelulusan Resmi */}
              {dataSiswa.statusPendaftaran !== "Menunggu Verifikasi" && (
                <div className="mt-8 flex justify-center">
                  <Button 
                    onClick={() => printSuratKelulusan(dataSiswa)}
                    className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 rounded-xl"
                  >
                    <Printer className="h-4 w-4 mr-2" /> Cetak Surat Keterangan Resmi
                  </Button>
                </div>
              )}

            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
}