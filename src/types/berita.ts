export interface MediaEmbed {
  type: "none" | "youtube" | "instagram" | "tiktok";
  url: string;
}

export interface Berita {
  id: string;
  judul: string;
  slug: string;
  kategori: string;
  tags?: string[];        // 👈 Tambahkan ini buat fitur Tag
  konten: string;
  gambar: string;
  isPinned?: boolean;
  views?: number;
  mediaEmbed?: MediaEmbed | null;
  penulis?: string;
  tanggal?: string;
  createdAt?: any;
  updatedAt?: any;
}