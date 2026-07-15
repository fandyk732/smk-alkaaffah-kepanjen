export const school = {
  name: "SMK Al Kaaffah Kepanjen",
  short: "SMK Al Kaaffah",
  tagline: "Mencetak Generasi Unggul, Berkarakter, dan Siap Kerja",
  description:
    "Sekolah Menengah Kejuruan unggulan di Kepanjen yang memadukan kompetensi teknologi, karakter islami, dan kesiapan dunia industri.",
  address: "Jl. Semeru Nomor 18a Dilem, Kepanjen, Kabupaten Malang, Jawa Timur",
  phone: "+62 813-3332-8174",
  whatsapp: "6281333328174",
  email: "smkalkaaffahkpj@gmail.com",
  maps: "https://www.google.com/maps?q=@-8.117257930336452, 112.5735618389007&output=embed",
  socials: {
    instagram: "https://www.instagram.com/smkalkaaffah/",
    facebook: "https://facebook.com",
    tiktok: "https://www.tiktok.com/@smkalkaaffah",
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
  { value: 65, suffix: "+", label: "Siswa Aktif" },
  { value: 20, suffix: "+", label: "Guru & Staf" },
  { value: 90, suffix: "%", label: "Lulusan Terserap" },
  { value: 10, suffix: "+", label: "Mitra Industri" },
];

export const programs = [
  {
    title: "Teknik Komputer & Jaringan",
    code: "TKJ",
    desc: "Membangun, mengelola, dan mengamankan infrastruktur jaringan komputer modern.",
    icon: "Network",
  },
  {
    title: "Teknik Elektronika Industri",
    code: "TE",
    desc: "Memrancang Bangun Komponen Eletkronika, Instalasi Listik Industri, Instalasi PLTS, dan IoT.",
    icon: "",
  },
  {
    title: "Teknik Kendaraan Ringan",
    code: "TKR",
    desc: "Perawatan dan perbaikan kendaraan bermotor serta sistem elektriknya.",
    icon: "",
  },
  {
    title: "Digital Marketing",
    code: "DM",
    desc: "Mempelajari strategi pemasaran digital dan pengelolaan media sosial.",
    icon: "",
  },
];

export const news = [
  {
    slug: "wisuda-angkatan-2026",
    title: "Wisuda Angkatan 2026 Berlangsung Khidmat dan Meriah",
    excerpt: "Sebanyak 15 siswa resmi dinyatakan lulus dan siap memasuki dunia industri.",
    category: "Kegiatan",
    date: "2026-05-28",
    image:
      "https://6a56f44fcec0a76b21484386.imgix.net/2dba840e-7c2e-46c2-ae89-f6e2f6620bcf(1).jpg",
  },
  {
    slug: "juara-lks-jaringan",
    title: "Tim TKJ Raih Juara 1 LKS Tingkat Provinsi Jawa Timur",
    excerpt: "Prestasi membanggakan di bidang IT Network System Administration.",
    category: "Prestasi",
    date: "2025-04-12",
    image:
      "https://6a56f44fcec0a76b21484386.imgix.net/WhatsApp%20Image%202024-11-13%20at%2009.50.42.jpg",
  },
  {
    slug: "kerja-sama-industri",
    title: "Penandatanganan MoU dengan 12 Perusahaan Teknologi",
    excerpt: "Memperluas kesempatan magang dan rekrutmen langsung bagi lulusan.",
    category: "Kerja Sama",
    date: "2025-03-03",
    image:
      "https://6a56f44fcec0a76b21484386.imgix.net/WhatsApp%20Image%202026-07-07%20at%2010.12.12.jpg",
  },
];

export const achievements = [
  { title: "Juara 1 LBB Kecamatan Kepanjen", field: "LBB", year: "2025" },
  { title: "Medali Emas KSN", field: "Informatika", year: "2024" },
  { title: "Juara 2 Hackathon Nasional", field: "RPL", year: "2024" },
  { title: "Best Booth Expo Industri", field: "Multimedia", year: "2023" },
];

export const testimonials = [
  {
    name: "Ocha",
    role: "Alumni TKJ — Mahasiswa Teknik Komputer UB",
    quote:
      "Pendampingan yang intens dari Bapak Ibu Guru membantu saya berhasil lolos SPMB UB jalur beasiswa.",
  },
  {
    name: "Rico Marcelino",
    role: "Alumni TKR — Operator Traktor Merauke Sugar Group",
    quote:
      "Terimakasih Guru-guru SMK Al Kaaffah, saya sekarang sudah bekerja di Industri Impian saya.",
  },
  {
    name: "Doni Amargo",
    role: "Alumni MM — Content Creator",
    quote:
      "Fasilitas studio dan bimbingan industri benar-benar membuka jalan karier kreatif saya.",
  },
];

export const partners = ["Telkom", "Cisco", "Microsoft", "Dicoding", "BNI", "Astra", "Indosat", "Pertamina"];

export const galleryItems = [
  { title: "Laboratorium Jaringan", category: "Fasilitas", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80" },
  { title: "Bengkel Listrik", category: "Kegiatan", image: "https://6a56f44fcec0a76b21484386.imgix.net/IMG-20240301-WA0004.jpg" },
  { title: "Bengkel Otomotif", category: "Kegiatan", image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=900&q=80" },
  { title: "Kelas Bahasa Jepang", category: "Fasilitas", image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=900&q=80" },
  { title: "Masjid Sekolah", category: "Prestasi", image: "https://6a56f44fcec0a76b21484386.imgix.net/Screenshot%202024-10-09%2008.18.04.png" },
  { title: "Perpustakaan", category: "Fasilitas", image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80" },
];
