import { Alumni } from "@/types/alumni";

// Helper untuk membersihkan string dari enter (\n) dan tanda petik ganda (")
export const cleanCsvText = (text?: string): string => {
  if (!text) return "-";
  return text.toString().replace(/(\r\n|\n|\r)/gm, " ").replace(/"/g, '""');
};

// Function Export Blob CSV
export const exportAlumniToCSV = (alumniList: Alumni[]) => {
  if (alumniList.length === 0) {
    alert("Tidak ada data alumni untuk di-export.");
    return;
  }

  const headers = [
    "Nama Lengkap",
    "Angkatan",
    "Jurusan",
    "Status",
    "Tempat/Instansi",
    "Posisi/Jabatan",
    "WhatsApp",
    "Testimoni",
  ];

  const rows = alumniList.map((a) => [
    `"${cleanCsvText(a.nama)}"`,
    `"${cleanCsvText(a.angkatan)}"`,
    `"${cleanCsvText(a.jurusan)}"`,
    `"${cleanCsvText(a.status)}"`,
    `"${cleanCsvText(a.tempat)}"`,
    `"${cleanCsvText(a.posisi)}"`,
    `"${cleanCsvText(a.whatsapp)}"`,
    `"${cleanCsvText(a.testimoni)}"`,
  ]);

  const csvString =
    "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `Tracer_Study_Alumni_Full_${new Date().toLocaleDateString("id-ID")}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};