import { Pendaftar } from "@/types/ppdb";
import { formatTanggalIndo } from "./formatters";

export const downloadExcel = (pendaftarList: Pendaftar[]) => {
  if (pendaftarList.length === 0) {
    alert("Tidak ada data untuk diexport");
    return;
  }

  const headers = [
    "No. Registrasi",
    "Waktu Daftar",
    "Nama Lengkap",
    "NISN",
    "Asal Sekolah",
    "WhatsApp",
    "Pilihan Jurusan",
    "Program Unggulan",
    "Ekstrakurikuler",
    "Tes Buta Warna",
    "Rekomendasi Tes Jurusan",
    "Status Pendaftaran",
  ];

  const clean = (text: any) => `"${String(text || "").replace(/"/g, '""')}"`;

  const rows = pendaftarList.map((p) => [
    clean(p.noRegistrasi || "-"),
    clean(formatTanggalIndo(p.createdAt)),
    clean(p.namaLengkap),
    clean(`'${p.nisn}`),
    clean(p.asalSekolah),
    clean(`'${p.whatsapp}`),
    clean(p.pilihanJurusan),
    clean(p.programUnggulan || "Belum Memilih"),
    clean(p.ekstrakurikuler || "Belum Memilih"),
    clean(
      p.tes?.butaWarna
        ? `${p.tes.butaWarna.status} (${p.tes.butaWarna.skor}/${p.tes.butaWarna.totalSoal})`
        : "Belum Tes"
    ),
    clean(p.tes?.jurusan?.rekomendasi || "Belum Tes"),
    clean(p.statusPendaftaran || "Menunggu Verifikasi"),
  ]);

  const csvArray = [headers.map(clean).join(","), ...rows.map((row) => row.join(","))];
  const csvString = csvArray.join("\r\n");

  const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `Data_PPDB_Export_${new Date().toLocaleDateString("id-ID")}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};