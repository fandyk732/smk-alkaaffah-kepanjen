export interface GelombangSPMB {
  id: string;
  namaGelombang: string; // Contoh: "Gelombang Inden", "Gelombang 1", "Gelombang 2"
  tanggalMulai: string;   // Format: YYYY-MM-DD
  tanggalSelesai: string; // Format: YYYY-MM-DD
  isActive: boolean;      // Status saklar aktif (manual override oleh admin)
  kuota?: number;         // Opsional: Batas maksimal pendaftar
  keterangan?: string;    // Contoh: "Potongan DPP 50%", "Gratis Seragam"
  createdAt?: any;
  updatedAt?: any;
}