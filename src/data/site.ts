export const school = {
  name: "SMK Al Kaaffah Kepanjen",
  short: "SMK Al Kaaffah",
  tagline: "Belum Lulus, Sudah Produktif",
  description:
    "Membekali siswa dengan kompetensi dan keterampilan untuk berkarya, menciptakan peluang, dan mandiri sejak di bangku sekolah.",
  address: "Jl. Semeru Nomor 18a Dilem, Kepanjen, Kabupaten Malang, Jawa Timur",
  phone: "081-3333-28174",
  whatsapp: "6281333328174",
  email: "smkalkaaffahkpj@gmail.com",
  maps: "https://www.google.com/maps?q=@-8.117560147253995, 112.57358442882493&output=embed",
  socials: {
    instagram: "https://www.instagram.com/smkalkaaffah/",
    facebook: "https://www.facebook.com/smkalkaaffah",
    tiktok: "https://www.tiktok.com/@smkalkaaffah",
  },
};

export const navItems = [
  { label: "Beranda", to: "/" },
  { label: "Profil", to: "/profil" },
  { label: "Program", to: "/program" },
  { label: "Berita", to: "/berita" },
  { label: "Galeri", to: "/galeri" },
  { label: "Alumni", to: "/alumni" },
  { label: "SPMB", to: "/ppdb" },
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
    title: "Kelas Bahasa Jepang",
    code: "JB",
    desc: "Bahasa untuk Membuka Peluang Global",
    icon: "BookOpen",
  },
  {
    title: "Teknik Komputer & Jaringan",
    code: "TKJ",
    desc: "Bangun Skill IT, Ciptakan Peluang",
    icon: "Network",
  },
  {
    title: "Teknik Audio Video",
    code: "TAV",
    desc: "Kuasai Elektronika, Ciptakan Karya",
    icon: "Video",
  },
  {
    title: "Teknik Kendaraan Ringan",
    code: "TKR",
    desc: "Kuasai Otomotif, Siap Berkarya",
    icon: "Wrench",
  },
  {
    title: "Kelas Digital Marketing",
    code: "DM",
    desc: "Skill Digital untuk Dunia Bisnis",
    icon: "TrendingUp",
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
  { title: "Juara 3 Lomba Modifikasi Sepeda Motor", field: "TKR", year: "2025" },
  { title: "Juara 2 Robotik tingkat Kabupaten Malang", field: "TAV", year: "2024" },
  { title: "Best Booth Expo Industri", field: "Lintas Jurusan", year: "2023" },
];

export const testimonials = [
  {
    name: "Yuanoca",
    role: "Alumni TKJ — Mahasiswa Filkom UB",
    quote:
      "Pendampingan yang intens dari Bapak Ibu Guru membantu saya berhasil lolos SPMB UB jalur beasiswa.",
  },
  {
    name: "Rico Marcelino",
    role: "Alumni TKR — Operator Traktor di PT Merauke Sugar Group",
    quote:
      "Terimakasih Guru-guru SMK Al Kaaffah, saya sekarang sudah bekerja di Industri Impian saya.",
  },
  {
    name: "Doni Amargo",
    role: "Alumni TKJ — Content Creator",
    quote:
      "Fasilitas sekolah dan bimbingan industri benar-benar membuka jalan karier kreatif saya.",
  },
];

export const partners = ["Telkom", "Bengkel Sitondi", "Tiara Auto Service", "Whitecret.id", "BKKBN Kab.Malang", "RS Wava Husada", "Polinema", "Fajar Internasional"];

export const galleryItems = [
 
  { title: "Bengkel Listrik", category: "Kegiatan", image: "https://6a56f44fcec0a76b21484386.imgix.net/IMG-20240301-WA0004.jpg" },
  
  
  { title: "Masjid Sekolah", category: "Prestasi", image: "https://6a56f44fcec0a76b21484386.imgix.net/Screenshot%202024-10-09%2008.18.04.png" },
  
];
