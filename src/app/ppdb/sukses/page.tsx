"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";

// 1. Pindahkan seluruh logika utama ke dalam sub-komponen ini
function KartuBuktiContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const noReg = searchParams.get("id") || "REG-2026-XXXX";
  const nama = searchParams.get("nama") || "Nama Siswa";
  const jurusan = searchParams.get("jurusan") || "Jurusan Pilihan";
  const tanggal = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Tombol Aksi / Navigasi (Hilang saat diprint) */}
      <div className="max-w-2xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <button
          onClick={() => router.push("/")}
          className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1"
        >
          ← Kembali ke Beranda
        </button>
        <button
          onClick={handlePrint}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md transition flex items-center gap-2"
        >
          🖨️ Cetak / Download PDF
        </button>
      </div>

      {/* 📄 KARTU BUKTI PENDAFTARAN */}
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-8 print:shadow-none print:border-none print:p-0">
        <div className="flex items-center justify-between border-b-2 border-emerald-600 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 relative flex-shrink-0">
              <Image
                src="/logo-smk.svg" // 👈 Sesuaikan path logo
                alt="Logo SMK Al Kaaffah"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                SMK AL KAAFFAH KEPANJEN
              </h2>
              <p className="text-xs text-gray-500">
                Jl. Semeru No. 18a Dilem Kepanjen Kabupaten Malang
              </p>
              <p className="text-xs font-semibold text-emerald-600 mt-1">
                BUKTI REGISTRASI PENDAFTARAN SPMB
              </p>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 text-center">
          <p className="text-xs text-emerald-700 font-medium uppercase tracking-wider">
            Status Pendaftaran
          </p>
          <p className="text-lg font-bold text-emerald-800">
            DATA ANDA SUDAH KAMI TERIMA
          </p>
        </div>

        <div className="space-y-4 text-sm text-gray-700 mb-8">
          <div className="grid grid-cols-3 py-2 border-b border-gray-100">
            <span className="font-semibold text-gray-500">No. Registrasi</span>
            <span className="col-span-2 font-mono font-bold text-emerald-700 text-base">
              : {noReg}
            </span>
          </div>
          <div className="grid grid-cols-3 py-2 border-b border-gray-100">
            <span className="font-semibold text-gray-500">Nama Lengkap</span>
            <span className="col-span-2 font-semibold text-gray-900">
              : {nama}
            </span>
          </div>
          <div className="grid grid-cols-3 py-2 border-b border-gray-100">
            <span className="font-semibold text-gray-500">Jurusan Pilihan</span>
            <span className="col-span-2 font-semibold text-gray-900">
              : {jurusan}
            </span>
          </div>
          <div className="grid grid-cols-3 py-2 border-b border-gray-100">
            <span className="font-semibold text-gray-500">Tanggal Daftar</span>
            <span className="col-span-2 text-gray-900">: {tanggal}</span>
          </div>
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl text-xs text-amber-800 mb-8 print:bg-gray-50 print:border-gray-400 print:text-gray-700">
          <p className="font-bold mb-1">📌 Langkah Selanjutnya:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Simpan atau cetak kartu bukti pendaftaran ini.</li>
            <li>Panitia SPMB akan menghubungi Anda melalui WhatsApp untuk verifikasi berkas.</li>
            <li>Bawa kartu ini saat melakukan verifikasi fisik/tes seleksi di sekolah.</li>
          </ol>
        </div>

        <div className="hidden print:flex justify-between items-end mt-12 pt-6 border-t border-gray-200 text-xs text-gray-500">
          <div>
            <p>Dicetak secara otomatis oleh sistem SPMB Online</p>
            <p>smkalkaaffah.sch.id</p>
          </div>
          <div className="text-center">
            <p>Ketua Panitia SPMB 2027</p>
            <div className="h-12"></div>
            <p className="font-bold underline">Khusnul Huda, S.HI</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Komponen Ekspor Utama yang dibungkus dengan <Suspense>
export default function SuksesPendaftaranPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            <span>Memuat kartu bukti pendaftaran...</span>
          </div>
        </div>
      }
    >
      <KartuBuktiContent />
    </Suspense>
  );
}