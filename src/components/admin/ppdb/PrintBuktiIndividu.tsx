"use client";

import React from "react";
import { Pendaftar } from "@/types/ppdb";
import { formatTanggalIndo } from "@/utils/formatters";

interface Props {
  pendaftar: Pendaftar | null;
  panitiaName: string;
}

export function PrintBuktiIndividu({ pendaftar, panitiaName }: Props) {
  if (!pendaftar) return null;

  return (
    <>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }

          #area-bukti-individu, #area-bukti-individu * {
            visibility: visible !important;
          }

          #area-bukti-individu {
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
          id="area-bukti-individu"
          className="w-[210mm] min-h-[297mm] p-[15mm] text-black font-serif text-[15px] leading-relaxed bg-white"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
        >
          <div className="w-full mb-6 text-center">
            <img
              src="/images/kop-sekolah.png"
              alt="Kop Surat SMK Al Kaaffah"
              className="w-full h-auto object-contain block mx-auto"
            />
          </div>

          <div className="text-center mb-6">
            <p className="text-[17px] font-bold underline m-0 text-black">BUKTI PENDAFTARAN & HASIL TES SPMB</p>
            <p className="text-[14px] m-0 text-black">Tahun Ajaran {new Date().getFullYear()}/{new Date().getFullYear() + 1}</p>
          </div>

          <p className="text-justify mb-4 text-black">
            Berikut adalah bukti data pendaftaran beserta hasil tes Sistem Penerimaan Murid Baru (SPMB) SMK Al Kaaffah Kepanjen:
          </p>

          <table className="w-[90%] mx-auto my-6 border-collapse text-[15px] text-black">
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="py-2.5 w-[38%] font-bold">No. Registrasi</td>
                <td className="py-2.5 font-bold font-mono">: {pendaftar.noRegistrasi || "-"}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2.5 font-bold">Waktu Pendaftaran</td>
                <td className="py-2.5">: {formatTanggalIndo(pendaftar.createdAt)}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2.5 font-bold">Nama Lengkap</td>
                <td className="py-2.5">: {pendaftar.namaLengkap}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2.5 font-bold">NISN</td>
                <td className="py-2.5">: {pendaftar.nisn}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2.5 font-bold">Asal Sekolah</td>
                <td className="py-2.5">: {pendaftar.asalSekolah}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2.5 font-bold">Pilihan Jurusan Utama</td>
                <td className="py-2.5">: <strong>{pendaftar.pilihanJurusan}</strong></td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2.5 font-bold">Minat Program Unggulan</td>
                <td className="py-2.5">: {pendaftar.programUnggulan || "Belum Memilih"}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2.5 font-bold">Minat Ekstrakurikuler</td>
                <td className="py-2.5">: {pendaftar.ekstrakurikuler || "Belum Memilih"}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2.5 font-bold">No. WhatsApp</td>
                <td className="py-2.5">: {pendaftar.whatsapp}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2.5 font-bold">Hasil Tes Buta Warna</td>
                <td className="py-2.5">: {pendaftar.tes?.butaWarna ? `${pendaftar.tes.butaWarna.status} (Skor: ${pendaftar.tes.butaWarna.skor}/${pendaftar.tes.butaWarna.totalSoal})` : "Belum Mengikuti Tes"}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2.5 font-bold">Rekomendasi Jurusan Tes</td>
                <td className="py-2.5">: <strong>{pendaftar.tes?.jurusan?.rekomendasi || "Belum Mengikuti Tes"}</strong></td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2.5 font-bold">Status Pendaftaran</td>
                <td className="py-2.5">: <strong>{pendaftar.statusPendaftaran || "Menunggu Verifikasi"}</strong></td>
              </tr>
            </tbody>
          </table>

          <p className="text-justify my-4 text-black text-[13px] italic">
            *Simpan bukti pendaftaran ini sebagai bukti verifikasi ulang saat proses pendaftaran fisik di sekolah.
          </p>

          <div className="mt-16 float-right text-center w-[250px] text-black">
            <p className="m-0">Kepanjen, {new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="m-0 mb-16">Panitia SPMB,</p>
            <p className="m-0 font-bold underline">{panitiaName || "Panitia PPDB"}</p>
          </div>
        </div>
      </div>
    </>
  );
}