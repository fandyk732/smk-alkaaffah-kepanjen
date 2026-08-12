"use client";

import { useState } from "react";
import { CheckCircle2, AlertTriangle, CircleX, ArrowRight, RotateCcw } from "lucide-react";

export interface HasilTesButaWarna {
  skor: number;
  totalSoal: number;
  status: "Normal" | "Buta Warna Parsial" | "Buta Warna Total";
  jawabanDetail: { id: number; kunci: number; jawabanSiswa: number }[];
}

interface TesButaWarnaProps {
  onComplete?: (hasil: HasilTesButaWarna) => void;
}

// Data 10 Plat Ishihara (URL CDN Gambar Publik yang Aksesibel)
const DAFTAR_SOAL = [
  { id: 1, gambarUrl: "/images/ishihara/1.jpg", jawabanBenar: 12 },
  { id: 2, gambarUrl: "/images/ishihara/2.jpg", jawabanBenar: 74 },
  { id: 3, gambarUrl: "/images/ishihara/3.jpg", jawabanBenar: 6 },
  { id: 4, gambarUrl: "/images/ishihara/4.jpg", jawabanBenar: 16 },
  { id: 5, gambarUrl: "/images/ishihara/5.jpg", jawabanBenar: 2 },
  { id: 6, gambarUrl: "/images/ishihara/6.jpg", jawabanBenar: 29 },
  { id: 7, gambarUrl: "/images/ishihara/7.jpg", jawabanBenar: 7 },
  { id: 8, gambarUrl: "/images/ishihara/8.jpg", jawabanBenar: 45 },
  { id: 9, gambarUrl: "/images/ishihara/9.jpg", jawabanBenar: 5 },
  { id: 10, gambarUrl: "/images/ishihara/10.jpg", jawabanBenar: 97 },
  { id: 11, gambarUrl: "/images/ishihara/11.jpg", jawabanBenar: 8 },
  { id: 12, gambarUrl: "/images/ishihara/12.jpg", jawabanBenar: 42 },
  { id: 13, gambarUrl: "/images/ishihara/13.jpg", jawabanBenar: 3 },
];

export default function TesButaWarna({ onComplete }: TesButaWarnaProps) {
  const [indexSoal, setIndexSoal] = useState(0);
  const [inputAngka, setInputAngka] = useState("");
  const [jawabanList, setJawabanList] = useState<{ id: number; kunci: number; jawabanSiswa: number }[]>([]);
  const [hasilAkhir, setHasilAkhir] = useState<HasilTesButaWarna | null>(null);

  const soalSekarang = DAFTAR_SOAL[indexSoal];

  // Handler Lanjut Soal / Submit Jawaban
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputAngka.trim() === "") return;

    const angkaUser = parseInt(inputAngka, 10);
    const updatedJawaban = [
      ...jawabanList,
      { id: soalSekarang.id, kunci: soalSekarang.jawabanBenar, jawabanSiswa: isNaN(angkaUser) ? 0 : angkaUser }
    ];

    setJawabanList(updatedJawaban);
    setInputAngka("");

    // Cek Apakah Sudah Soal Terakhir
    if (indexSoal < DAFTAR_SOAL.length - 1) {
      setIndexSoal((prev) => prev + 1);
    } else {
      // Hitung Hasil Akhir
      kalkulasiHasil(updatedJawaban);
    }
  };

  // Kalkulasi Skor & Status Buta Warna
  const kalkulasiHasil = (details: { id: number; kunci: number; jawabanSiswa: number }[]) => {
    let skor = 0;
    details.forEach((item) => {
      if (item.jawabanSiswa === item.kunci) {
        skor += 1;
      }
    });

    let status: "Normal" | "Buta Warna Parsial" | "Buta Warna Total" = "Normal";
    if (skor >= 8) {
      status = "Normal";
    } else if (skor >= 4) {
      status = "Buta Warna Parsial";
    } else {
      status = "Buta Warna Total";
    }

    const dataHasil: HasilTesButaWarna = {
      skor,
      totalSoal: DAFTAR_SOAL.length,
      status,
      jawabanDetail: details,
    };

    setHasilAkhir(dataHasil);
    if (onComplete) {
      onComplete(dataHasil);
    }
  };

  // Handler Reset / Ulangi Tes
  const handleReset = () => {
    setIndexSoal(0);
    setInputAngka("");
    setJawabanList([]);
    setHasilAkhir(null);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-card border rounded-3xl p-5 sm:p-8 shadow-soft text-foreground">
      {/* 🚀 HEADER TES */}
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-foreground">
          Tes Buta Warna (Ishihara)
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Modul Tes Kesehatan Penglihatan SPMB SMK Al Kaaffah
        </p>
      </div>

      {!hasilAkhir ? (
        /* 🚀 TAMPILAN PENGERJAAN SOAL */
        <div>
          {/* Progress Bar */}
          <div className="w-full bg-secondary rounded-full h-2.5 mb-6 overflow-hidden">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${((indexSoal + 1) / DAFTAR_SOAL.length) * 100}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-xs font-bold text-muted-foreground mb-4">
            <span>Soal No. {indexSoal + 1} dari {DAFTAR_SOAL.length}</span>
            <span>{Math.round(((indexSoal + 1) / DAFTAR_SOAL.length) * 100)}% Selesai</span>
          </div>

          {/* Gambar Plat Ishihara */}
          <div className="relative aspect-square max-w-[280px] sm:max-w-[320px] mx-auto bg-slate-900 rounded-2xl overflow-hidden shadow-md border p-2 flex items-center justify-center">
            <img
                src={soalSekarang.gambarUrl}
                alt={`Plat Ishihara ${soalSekarang.id}`}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                className="h-full w-full object-contain rounded-xl select-none"
                />
          </div>

          {/* Form Input Angka */}
          <form onSubmit={handleNext} className="mt-6 space-y-4">
            <div>
              <label className="block text-center text-xs font-semibold text-muted-foreground mb-2">
                Tebak angka yang tersembunyi di dalam lingkaran di atas:
              </label>
              <input
                type="number"
                required
                autoFocus
                placeholder="Ketik angka di sini (misal: 12)"
                value={inputAngka}
                onChange={(e) => setInputAngka(e.target.value)}
                className="w-full text-center text-xl font-bold bg-secondary/50 rounded-2xl px-4 py-3 border focus:outline-none focus:border-primary transition-colors tracking-widest"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-primary text-white font-bold py-3.5 px-6 rounded-2xl text-sm shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              <span>{indexSoal === DAFTAR_SOAL.length - 1 ? "Selesai & Lihat Hasil" : "Soal Berikutnya"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      ) : (
        /* 🚀 TAMPILAN HASIL TES */
        <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="inline-flex p-4 rounded-full bg-secondary/80">
            {hasilAkhir.status === "Normal" && <CheckCircle2 className="h-16 w-16 text-emerald-500" />}
            {hasilAkhir.status === "Buta Warna Parsial" && <AlertTriangle className="h-16 w-16 text-amber-500" />}
            {hasilAkhir.status === "Buta Warna Total" && <CircleX className="h-16 w-16 text-red-500" />}
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hasil Diagnosis</p>
            <h3 className={`text-2xl font-black mt-1 ${
              hasilAkhir.status === "Normal" ? "text-emerald-500" :
              hasilAkhir.status === "Buta Warna Parsial" ? "text-amber-500" : "text-red-500"
            }`}>
              {hasilAkhir.status}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Jawaban Benar: <strong className="text-foreground">{hasilAkhir.skor}</strong> dari {hasilAkhir.totalSoal} Soal
            </p>
          </div>

          {/* Catatan / Rekomendasi Jurusan */}
          <div className="bg-secondary/40 border border-dashed rounded-2xl p-4 text-left text-xs space-y-1.5">
            <span className="font-bold text-foreground">Rekomendasi Seleksi SPMB:</span>
            {hasilAkhir.status === "Normal" ? (
              <p className="text-muted-foreground leading-relaxed">
                Penglihatan warna Anda dalam kondisi sangat baik. Sangat direkomendasikan untuk mengambil seluruh jurusan teknik seperti <strong>TKJ, Listrik, atau Otomotif</strong>.
              </p>
            ) : (
              <p className="text-muted-foreground leading-relaxed">
                Terdeteksi kendala dalam persepsi warna. Disarankan untuk mengambil jurusan non-teknik yang tidak membutuhkan identifikasi warna presisi seperti <strong>Perhotelan / Bisnis Manajemen</strong>.
              </p>
            )}
          </div>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground bg-secondary px-4 py-2.5 rounded-xl border transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Ulangi Tes
          </button>
        </div>
      )}
    </div>
  );
}