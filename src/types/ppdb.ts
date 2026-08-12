export interface Pendaftar {
  status: string;
  id: string;
  noRegistrasi?: string;
  namaLengkap: string;
  nisn: string;
  asalSekolah: string;
  whatsapp: string;
  pilihanJurusan: string;
  ekstrakurikuler?: string;
  programUnggulan?: string;
  statusPendaftaran: "Menunggu Verifikasi" | "Diterima" | "Ditolak";
  createdAt: any;
  tes?: {
    butaWarna?: {
      skor: number;
      totalSoal: number;
      status: string;
      selesaiPada?: any;
    };
    jurusan?: {
      rekomendasi: string;
      skor: Record<string, number>;
      selesaiPada?: any;
    };
  };
}