export interface Alumni {
  id: string;
  nama: string;
  angkatan: string;
  jurusan: string;
  status: "Bekerja" | "Kuliah" | "Wirausaha" | "Mencari Kerja" | string;
  tempat: string;
  posisi?: string;
  whatsapp?: string;
  testimoni?: string;
}

export interface AlumniFormState {
  nama: string;
  angkatan: string;
  jurusan: string;
  status: "Bekerja" | "Kuliah" | "Wirausaha" | "Mencari Kerja";
  tempat: string;
  posisi: string;
  whatsapp: string;
  testimoni: string;
}