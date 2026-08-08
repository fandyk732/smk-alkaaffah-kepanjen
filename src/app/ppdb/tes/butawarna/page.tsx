"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, KeyRound, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TesButaWarna, { HasilTesButaWarna } from "@/components/ppdb/TesButaWarna";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

export default function TesButaWarnaPage() {
  // State Verifikasi NISN
  const [nisnInput, setNisnInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [pendaftar, setPendaftar] = useState<{ id: string; nama: string } | null>(null);

  // State Status Penyimpanan
  const [isSavedToDb, setIsSavedToDb] = useState(false);

  // 1. Fungsi Cek NISN ke Firestore
  const handleVerifikasiNISN = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nisnInput.trim()) return alert("Masukkan NISN kamu terlebih dahulu!");

    setIsVerifying(true);
    try {
      // 🔒 Baca dari "ppdb_public" (docId = NISN), BUKAN "ppdb".
      // Collection "ppdb" read-nya udah dikunci admin/panitia only, jadi kalau
      // dibaca langsung di sini siswa yang belum login bakal kena permission-denied.
      // "ppdb_public" emang didesain buat dibaca publik dan docId-nya = NISN,
      // jadi ini getDoc langsung, lebih simpel & cepat daripada where-query.
      const docSnap = await getDoc(doc(db, "ppdb_public", nisnInput.trim()));

      if (!docSnap.exists()) {
        alert("NISN tidak ditemukan! Pastikan kamu sudah mengisi form pendaftaran terlebih dahulu.");
        setIsVerifying(false);
        return;
      }

      setPendaftar({
        id: docSnap.id, // = NISN, sama persis dengan docId di "ppdb"
        nama: docSnap.data().namaLengkap || "Calon Siswa",
      });
    } catch (error) {
      console.error("Gagal verifikasi NISN:", error);
      alert("Terjadi kesalahan saat memeriksa NISN. Coba lagi!");
    } finally {
      setIsVerifying(false);
    }
  };

  // 2. Fungsi Simpan Hasil Tes (Silent Background Save)
  const handleHasilButaWarna = async (hasil: HasilTesButaWarna) => {
    if (!pendaftar) return;

    try {
      // Tulis hasil tes ke "ppdb" (BUKAN ppdb_public — hasil tes bukan data publik).
      // Rules Firestore ngizinin publik update "ppdb" SELAMA cuma nyentuh field 'tes',
      // jadi ini masih jalan walau pendaftar belum/nggak login sebagai admin.
      const docRef = doc(db, "ppdb", pendaftar.id);

      await updateDoc(docRef, {
        "tes.butaWarna": {
          skor: hasil.skor,
          totalSoal: hasil.totalSoal,
          status: hasil.status,
          selesaiPada: serverTimestamp(),
        },
      });

      setIsSavedToDb(true); // Tandai bahwa data sudah berhasil tersimpan ke DB
    } catch (error) {
      console.error("Gagal menyimpan hasil tes:", error);
      alert("Gagal menyimpan hasil tes ke database. Silakan coba lagi!");
    }
  };

  return (
    <main className="container-page py-12 px-4 max-w-4xl mx-auto text-foreground">
      <div className="mb-6 flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="rounded-xl">
          <Link href="/ppdb/tes">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Kembali ke Pilihan Tes
          </Link>
        </Button>
      </div>

        <div className="text-center max-w-xl mx-auto mb-10">
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Tes Buta Warna
              </h1>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
                Tes ketajaman persepsi warna menggunakan metode gambar Ishihara. Wajib untuk calon siswa jurusan teknik.
              </p>
            </div>
      
      {/* TAMPILAN 1: Form Verifikasi NISN (Jika Belum Terverifikasi) */}
      {!pendaftar && (
        <div className="max-w-md mx-auto my-10 p-6 bg-card border rounded-2xl shadow-sm text-center">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <KeyRound className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold mb-2">Verifikasi Data Peserta</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Masukkan NISN yang kamu gunakan saat mengisi form pendaftaran PPDB.
          </p>

          <form onSubmit={handleVerifikasiNISN} className="space-y-4">
            <Input
              type="text"
              placeholder="Masukkan 10 digit NISN..."
              value={nisnInput}
              onChange={(e) => setNisnInput(e.target.value)}
              className="text-center font-mono text-lg tracking-widest rounded-xl"
              maxLength={10}
              required
            />
            <Button type="submit" className="w-full rounded-xl" disabled={isVerifying}>
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memeriksa Data...
                </>
              ) : (
                "Mulai Tes"
              )}
            </Button>
          </form>
        </div>
      )}

      {/* TAMPILAN 2: Lembar Tes + Tampilan Hasil Tes */}
      {pendaftar && (
        <div className="space-y-6">
          {/* Banner Informasi Peserta */}
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-emerald-900 dark:text-emerald-300">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold opacity-80 font-mono">Peserta Terverifikasi</p>
              <p className="font-bold text-base sm:text-lg">{pendaftar.nama}</p>
            </div>

            <div className="flex items-center gap-2">
              {isSavedToDb && (
                <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 px-3 py-1.5 rounded-xl font-medium border border-emerald-300 dark:border-emerald-700">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> Hasil Tersimpan
                </span>
              )}

              <Button asChild size="sm" className="rounded-xl gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white border-0">
                <Link href="/ppdb/tes">
                  Selesai & Menu Tes <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Komponen Tes Buta Warna */}
          <TesButaWarna onComplete={handleHasilButaWarna} />
        </div>
      )}
    </main>
  );
}