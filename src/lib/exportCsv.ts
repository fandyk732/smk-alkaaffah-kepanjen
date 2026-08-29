// lib/exportCsv.ts
import { Berita } from "@/types/berita";

export function exportBeritaToCSV(data: Berita[], filename = "Laporan_Artikel_SMK.csv") {
  if (!data || data.length === 0) {
    alert("Tidak ada data artikel untuk diekspor!");
    return;
  }

  // Header Kolom CSV
  const headers = ["ID", "Judul Artikel", "Kategori", "Tanggal Rilis", "Jumlah Views", "Status Pin"];

  // Baris Data CSV (Handle koma & kutip)
  const rows = data.map((item) => [
    `"${item.id || ""}"`,
    `"${(item.judul || "").replace(/"/g, '""')}"`,
    `"${item.kategori || ""}"`,
    `"${item.tanggal || ""}"`,
    item.views || 0,
    item.isPinned ? "Disematkan" : "Biasa",
  ]);

  const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

  // Tambahkan UTF-8 BOM (\uFEFF) agar Microsoft Excel membaca format karakter secara presisi
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}