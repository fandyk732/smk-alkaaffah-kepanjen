export const school = {
  name: "SMK Al Kaaffah Kepanjen",
  short: "SMK Al Kaaffah",
  tagline: "Mencetak Generasi Unggul, Berkarakter, dan Siap Kerja",
  description:
    "Sekolah Menengah Kejuruan unggulan di Kepanjen yang memadukan kompetensi teknologi, karakter islami, dan kesiapan dunia industri.",
  address: "Jl. Raya Kepanjen, Kepanjen, Kabupaten Malang, Jawa Timur",
  phone: "+62 812-3456-7890",
  whatsapp: "6281234567890",
  email: "info@smkalkaaffah.sch.id",
  maps: "https://www.google.com/maps?q=Kepanjen,Malang&output=embed",
  socials: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    youtube: "https://youtube.com",
  },
};

export const navItems = [
  { label: "Beranda", to: "/" },
  { label: "Profil", to: "/profil" },
  { label: "Program", to: "/program" },
  { label: "Berita", to: "/berita" },
  { label: "Galeri", to: "/galeri" },
  { label: "PPDB", to: "/ppdb" },
  { label: "Kontak", to: "/kontak" },
] as const;

export const stats = [
  { value: 1200, suffix: "+", label: "Siswa Aktif" },
  { value: 85, suffix: "+", label: "Guru & Staf" },
  { value: 95, suffix: "%", label: "Lulusan Terserap" },
  { value: 40, suffix: "+", label: "Mitra Industri" },
];

export const programs = [
  {
    title: "Teknik Komputer & Jaringan",
    code: "TKJ",
    desc: "Membangun, mengelola, dan mengamankan infrastruktur jaringan komputer modern.",
    icon: "Network",
  },
  {
    title: "Rekayasa Perangkat Lunak",
    code: "RPL",
    desc: "Mengembangkan aplikasi web & mobile dengan standar industri terkini.",
    icon: "Code2",
  },
  {
    title: "Multimedia & Desain",
    code: "MM",
    desc: "Produksi konten digital, desain grafis, fotografi, dan videografi.",
    icon: "Clapperboard",
  },
  {
    title: "Akuntansi & Keuangan",
    code: "AKL",
    desc: "Kompetensi pengelolaan keuangan dan administrasi lembaga.",
    icon: "Calculator",
  },
];

export const news = [
  {
    slug: "wisuda-angkatan-2025",
    title: "Wisuda Angkatan 2025 Berlangsung Khidmat dan Meriah",
    excerpt: "Sebanyak 320 siswa resmi dinyatakan lulus dan siap memasuki dunia industri.",
    category: "Kegiatan",
    date: "2025-05-28",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "juara-lks-jaringan",
    title: "Tim TKJ Raih Juara 1 LKS Tingkat Provinsi Jawa Timur",
    excerpt: "Prestasi membanggakan di bidang IT Network System Administration.",
    category: "Prestasi",
    date: "2025-04-12",
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "kerja-sama-industri",
    title: "Penandatanganan MoU dengan 12 Perusahaan Teknologi",
    excerpt: "Memperluas kesempatan magang dan rekrutmen langsung bagi lulusan.",
    category: "Kerja Sama",
    date: "2025-03-03",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80",
  },
];

export const achievements = [
  { title: "Juara 1 LKS Provinsi", field: "IT Network", year: "2025" },
  { title: "Medali Emas KSN", field: "Informatika", year: "2024" },
  { title: "Juara 2 Hackathon Nasional", field: "RPL", year: "2024" },
  { title: "Best Booth Expo Industri", field: "Multimedia", year: "2023" },
];

export const testimonials = [
  {
    name: "Rizky Pratama",
    role: "Alumni TKJ — Network Engineer",
    quote:
      "Bekal kompetensi dan praktik nyata di sekolah membuat saya langsung siap bekerja setelah lulus.",
  },
  {
    name: "Salsabila Putri",
    role: "Alumni RPL — Software Developer",
    quote:
      "Lingkungan belajar yang suportif dan guru yang kompeten membentuk karakter dan skill saya.",
  },
  {
    name: "Ahmad Fauzi",
    role: "Alumni MM — Content Creator",
    quote:
      "Fasilitas studio dan bimbingan industri benar-benar membuka jalan karier kreatif saya.",
  },
];

export const partners = ["Telkom", "Cisco", "Microsoft", "Dicoding", "BNI", "Astra", "Indosat", "Pertamina"];

export const galleryItems = [
  { title: "Laboratorium Jaringan", category: "Fasilitas", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80" },
  { title: "Kegiatan Praktikum", category: "Kegiatan", image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=900&q=80" },
  { title: "Upacara Bendera", category: "Kegiatan", image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=900&q=80" },
  { title: "Studio Multimedia", category: "Fasilitas", image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=900&q=80" },
  { title: "Kompetisi Siswa", category: "Prestasi", image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80" },
  { title: "Perpustakaan", category: "Fasilitas", image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80" },
];
