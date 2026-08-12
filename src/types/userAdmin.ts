export interface RoleOption {
  id: string;
  label: string;
}

export const AVAILABLE_ROLES: RoleOption[] = [
  { id: "superadmin", label: "Superadmin (Akses Penuh)" },
  { id: "admin_artikel", label: "Admin Artikel (Berita & Blog)" },
  { id: "panitia_PPDB", label: "Panitia SPMB" },
  { id: "admin_alumni", label: "Admin Alumni & Tracer Study" },
  { id: "admin_bkk", label: "Admin BKK (Bursa Kerja Khusus)" },
  { id: "admin_galeri", label: "Admin Galeri (Foto & Dok)" },
  { id: "admin_prestasi", label: "Admin Prestasi (Kejuaraan)" },
  { id: "admin_announcement", label: "Admin Pengumuman (Announcement Bar)" },
];

export interface UserData {
  id: string; // Email dijadikan ID Document
  nama: string;
  email: string;
  role: string[];
  createdAt?: any;
}

export interface UserFormState {
  nama: string;
  email: string;
  password: string;
  roles: string[];
}