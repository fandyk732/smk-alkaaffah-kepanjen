"use client";

import { useState, useEffect } from "react";
import { SOAL_PENJURUSAN, DATA_JURUSAN, JurusanKey } from "@/data/dataPenjurusan";
import { CheckCircle2, RotateCcw, ArrowRight, ArrowLeft, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TesPenjurusanProps {
  onComplete?: (rekomendasi: string, skorDetail: Record<string, number>) => void;
}

export default function TesPenjurusan({ onComplete }: TesPenjurusanProps) {
  const [indeksSoal, setIndeksSoal] = useState(0);
  const [jawabanUser, setJawabanUser] = useState<Record<number, JurusanKey>>({});
  const [selesai, setSelesai] = useState(false);

  const soalSekarang = SOAL_PENJURUSAN[indeksSoal];
  const totalSoal = SOAL_PENJURUSAN.length;
  const progress = Math.round(((indeksSoal + 1) / totalSoal) * 100);

  const handlePilihJawaban = (jurusan: JurusanKey) => {
    setJawabanUser((prev) => ({
      ...prev,
      [soalSekarang.id]: jurusan,
    }));
  };

  // 1. Murni hanya untuk menghitung nilai (TANPA trigger side-effect / onComplete)
  const hitungHasil = () => {
    const skor: Record<JurusanKey, number> = { TKJ: 0, TKR: 0, TAV: 0, DM: 0 };

    Object.values(jawabanUser).forEach((jurusan) => {
      skor[jurusan] = (skor[jurusan] || 0) + 1;
    });

    let jurusanRekomendasi: JurusanKey = "TKJ";
    let skorMaksimal = -1;

    (Object.keys(skor) as JurusanKey[]).forEach((key) => {
      if (skor[key] > skorMaksimal) {
        skorMaksimal = skor[key];
        jurusanRekomendasi = key;
      }
    });

    return { skor, jurusanRekomendasi };
  };

  const { skor, jurusanRekomendasi } = hitungHasil();

  // 2. Trigger onComplete HANYA ketika status 'selesai' berubah menjadi true
  useEffect(() => {
    if (selesai && onComplete) {
      onComplete(jurusanRekomendasi, skor);
    }
  }, [selesai]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLanjut = () => {
    if (indeksSoal < totalSoal - 1) {
      setIndeksSoal((prev) => prev + 1);
    } else {
      setSelesai(true); // Selesai tes -> useEffect di atas bakal jalan
    }
  };

  const handleKembali = () => {
    if (indeksSoal > 0) {
      setIndeksSoal((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIndeksSoal(0);
    setJawabanUser({});
    setSelesai(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl">
      {!selesai ? (
        <>
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-2">
              <span className="flex items-center gap-1.5 text-primary">
                <Sparkles className="h-4 w-4" /> Tes Rekomendasi Jurusan
              </span>
              <span>
                Soal {indeksSoal + 1} dari {totalSoal}
              </span>
            </div>

            <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-cyan-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-foreground mb-6 leading-snug">
            {soalSekarang.pertanyaan}
          </h3>

          <div className="space-y-3 mb-8">
            {soalSekarang.opsi.map((opsi, idx) => {
              const terpilih = jawabanUser[soalSekarang.id] === opsi.jurusan;
              return (
                <button
                  key={idx}
                  onClick={() => handlePilihJawaban(opsi.jurusan)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all text-sm font-medium flex items-center justify-between gap-3 ${
                    terpilih
                      ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                      : "border-border bg-secondary/30 hover:bg-secondary text-foreground"
                  }`}
                >
                  <span>{opsi.teks}</span>
                  {terpilih && <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleKembali}
              disabled={indeksSoal === 0}
              className="rounded-xl"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
            </Button>

            <Button
              onClick={handleLanjut}
              disabled={!jawabanUser[soalSekarang.id]}
              className="rounded-xl bg-primary text-primary-foreground font-semibold"
            >
              {indeksSoal === totalSoal - 1 ? "Lihat Hasil" : "Lanjut"}{" "}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-4 space-y-6">
          <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-2">
            <Award className="h-12 w-12" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Hasil Rekomendasi Jurusan Kamu
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
              {DATA_JURUSAN[jurusanRekomendasi].nama}
            </h2>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto bg-secondary/50 p-4 rounded-2xl border">
            {DATA_JURUSAN[jurusanRekomendasi].deskripsi}
          </p>

          <div className="space-y-3 pt-2 text-left">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Persentase Kecocokan Jurusan:
            </h4>
            {(Object.keys(skor) as JurusanKey[]).map((key) => {
              const persentase = Math.round((skor[key] / totalSoal) * 100);
              return (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>{DATA_JURUSAN[key].nama}</span>
                    <span>{persentase}%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${DATA_JURUSAN[key].warna}`}
                      style={{ width: `${persentase}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <Button onClick={handleReset} variant="outline" className="mt-6 rounded-xl gap-2">
            <RotateCcw className="h-4 w-4" /> Ulangi Tes
          </Button>
        </div>
      )}
    </div>
  );
}