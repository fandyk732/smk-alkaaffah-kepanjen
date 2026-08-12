export type JurusanKey = "TKJ" | "TKR" | "TAV" | "DM";

export interface OpsiJawaban {
  teks: string;
  jurusan: JurusanKey;
}

export interface SoalPenjurusan {
  id: number;
  pertanyaan: string;
  opsi: OpsiJawaban[];
}

export const DATA_JURUSAN: Record<JurusanKey, { nama: string; deskripsi: string; warna: string }> = {
  TKJ: {
    nama: "Teknik Komputer & Jaringan (TKJ)",
    deskripsi: "Kamu punya logis analitis yang kuat, suka memecahkan masalah sistem, jaringan internet, komputer, dan dunia teknologi modern.",
    warna: "from-blue-600 to-cyan-500",
  },
  TKR: {
    nama: "Teknik Kendaraan Ringan (TKR / Otomotif)",
    deskripsi: "Kamu sosok yang praktis, menyukai mesin, fisik motor/mobil, perbaikan mekanis, dan tidak ragu bekerja langsung dengan tangan.",
    warna: "from-amber-600 to-red-500",
  },
  TAV: {
    nama: "Teknik Audio Video (TAV / Elektro-Listrik)",
    deskripsi: "Kamu tertarik pada arus listrik, komponen elektronik, perangkat audio-video, serta detail perakitan sirkuit elektro.",
    warna: "from-emerald-600 to-teal-500",
  },
  DM: {
    nama: "Digital Marketing (Pemasaran Digital)",
    deskripsi: "Kamu kreatif, suka komunikasi, paham tren media sosial, strategi jualan online, branding, dan dunia konten kreatif.",
    warna: "from-purple-600 to-pink-500",
  },
};

export const SOAL_PENJURUSAN: SoalPenjurusan[] = [
  {
    id: 1,
    pertanyaan: "Saat ada waktu luang di rumah, kegiatan apa yang paling kamu nikmati?",
    opsi: [
      { teks: "Membongkar komputer/HP atau ngulik aplikasi baru", jurusan: "TKJ" },
      { teks: "Ngoprek motor, membersihkan rantai, atau ganti oli", jurusan: "TKR" },
      { teks: "Eksperimen merakit speaker/lampu LED atau instalasi listrik", jurusan: "TAV" },
      { teks: "Bikin konten video, main sosmed, atau jualan barang online", jurusan: "DM" },
    ],
  },
  {
    id: 2,
    pertanyaan: "Ketika melihat peralatan canggih atau kendaraan keren, apa yang muncul di pikiranmu?",
    opsi: [
      { teks: "Gimana cara mesin di dalamnya berputar dan menghasilkan tenaga", jurusan: "TKR" },
      { teks: "Gimana sistem software dan koneksi internetnya bekerja", jurusan: "TKJ" },
      { teks: "Gimana skema arus listrik dan kelistrikannya dirangkai", jurusan: "TAV" },
      { teks: "Gimana cara strategi pemasaran brand tersebut biar laku keras", jurusan: "DM" },
    ],
  },
  {
    id: 3,
    pertanyaan: "Pelajaran atau topik apa yang paling membuatmu tertarik di sekolah?",
    opsi: [
      { teks: "Informatika, logika angka, dan komputer", jurusan: "TKJ" },
      { teks: "Fisika mekanika dan teknik otomotif", jurusan: "TKR" },
      { teks: "Fisika arus listrik, gelombang, dan elektronika", jurusan: "TAV" },
      { teks: "Ekonomi, bahasa, dan komunikasi bisnis", jurusan: "DM" },
    ],
  },
  {
    id: 4,
    pertanyaan: "Masalah apa yang paling menantang buat kamu selesaikan?",
    opsi: [
      { teks: "Koneksi Wi-Fi lemot atau komputer yang sering ngelag", jurusan: "TKJ" },
      { teks: "Motor yang mendadak mogok atau suaranya kasar", jurusan: "TKR" },
      { teks: "Speaker yang suaranya kresek-kresek atau lampu mati total", jurusan: "TAV" },
      { teks: "Sepi pembeli saat menawarkan produk atau jualan", jurusan: "DM" },
    ],
  },
  {
    id: 5,
    pertanyaan: "Jika disuruh memilih alat kerja favoritmu, mana yang akan kamu pilih?",
    opsi: [
      { teks: "Laptop spec tinggi, kabel LAN, dan crimping tool", jurusan: "TKJ" },
      { teks: "Kunci pas, obeng set, dan tanggem workshop", jurusan: "TKR" },
      { teks: "Solder, multitester (Avometer), dan komponen elco", jurusan: "TAV" },
      { teks: "Smartphone ber-kamera bagus, tripod, dan software editing", jurusan: "DM" },
    ],
  },
  {
    id: 6,
    pertanyaan: "Aplikasi Smartphone apa yang paling sering kamu buka?",
    opsi: [
      { teks: "TikTok / Instagram / Shopee untuk lihat tren & belanja", jurusan: "DM" },
      { teks: "YouTube tutorial bongkar mesin / balap otomotif", jurusan: "TKR" },
      { teks: "YouTube tutorial elektro / sound system / perakitan", jurusan: "TAV" },
      { teks: "Browser, terminal, aplikasi pengatur jaringan / IT news", jurusan: "TKJ" },
    ],
  },
  {
    id: 7,
    pertanyaan: "Gaya belajar seperti apa yang paling bikin kamu cepat paham?",
    opsi: [
      { teks: "Praktik simulasi jaringan/konfigurasi di sistem komputer", jurusan: "TKJ" },
      { teks: "Langsung bongkar-pasang komponen barang fisiknya", jurusan: "TKR" },
      { teks: "Menganalisis arus listrik pakai alat ukur dan menyolder", jurusan: "TAV" },
      { teks: "Diskusi, presentasi ide ide kreatif, dan praktik promosi", jurusan: "DM" },
    ],
  },
  {
    id: 8,
    pertanyaan: "Jika teman-temanmu mengadakan acara sekolah, peran apa yang mau kamu ambil?",
    opsi: [
      { teks: "Tim Humas & Promosi (bikin poster, cetak flyer, mengelola sosmed acara)", jurusan: "DM" },
      { teks: "Tim Perlengkapan Sound System & Tata Lampu Panggung", jurusan: "TAV" },
      { teks: "Tim IT & Operator Jaringan (mengatur Wi-Fi, live streaming & server)", jurusan: "TKJ" },
      { teks: "Tim Logistik & Transportasi (memastikan kendaraan & mesin siap)", jurusan: "TKR" },
    ],
  },
  {
    id: 9,
    pertanyaan: "Bagaimana cara kamu menyikapi perkembangan teknologi AI (Kecerdasan Buatan)?",
    opsi: [
      { teks: "Ingin paham infrastruktur server dan keamanan siber di baliknya", jurusan: "TKJ" },
      { teks: "Ingin pakai AI buat bantu bikin konten marketing & copywriting", jurusan: "DM" },
      { teks: "Ingin tahu integrasi AI ke sensor elektronika dan mikroprosesor", jurusan: "TAV" },
      { teks: "Ingin lihat penerapan AI di teknologi mobil otonom / kendaraan listrik", jurusan: "TKR" },
    ],
  },
  {
    id: 10,
    pertanyaan: "Apa cita-cita karier impianmu di masa depan?",
    opsi: [
      { teks: "Network Engineer, IT Support, atau Cyber Security", jurusan: "TKJ" },
      { teks: "Mekanik Profesional, Owner Bengkel, atau Teknisi Otomotif", jurusan: "TKR" },
      { teks: "Teknisi Audio-Video, Ahli Kelistrikan, atau Audio Engineer", jurusan: "TAV" },
      { teks: "Digital Marketer, Content Creator, atau Entrepreneur/Pebisnis", jurusan: "DM" },
    ],
  },
  {
    id: 11,
    pertanyaan: "Karakter kerja seperti apa yang paling mendeskripsikan dirimu?",
    opsi: [
      { teks: "Fokus pada detail kecil, teliti membaca rumus/skema, dan rapi", jurusan: "TAV" },
      { teks: "Bekerja dengan logika logis, terstruktur, dan analitis", jurusan: "TKJ" },
      { teks: "Tangguh, fisik kuat, dan menyukai tantangan praktis", jurusan: "TKR" },
      { teks: "Supel, pandai berbicarakan ide, persuasive, dan kreatif", jurusan: "DM" },
    ],
  },
  {
    id: 12,
    pertanyaan: "Lingkungan kerja seperti apa yang membuatmu merasa nyaman?",
    opsi: [
      { teks: "Di dalam ruang ber-AC dengan deretan komputer dan server", jurusan: "TKJ" },
      { teks: "Di bengkel kerja yang luas dengan aroma oli dan peralatan teknik", jurusan: "TKR" },
      { teks: "Di laboratorium elektronik atau studio sound system", jurusan: "TAV" },
      { teks: "Di studio kreatif, co-working space, atau ruang terbuka", jurusan: "DM" },
    ],
  },
  {
    id: 13,
    pertanyaan: "Apa yang kamu lakukan jika internet di rumahmu mendadak mati?",
    opsi: [
      { teks: "Memeriksa modem, setting router, atau cek IP address", jurusan: "TKJ" },
      { teks: "Memeriksa kabel adaptor modemnya apakah terputus atau rusak listriknya", jurusan: "TAV" },
      { teks: "Ganti kegiatan ngoprek barang fisik di garasi", jurusan: "TKR" },
      { teks: "Pindah pakai paket data HP biar tetep bisa buka sosmed/jualan", jurusan: "DM" },
    ],
  },
  {
    id: 14,
    pertanyaan: "Konten video YouTube seperti apa yang betah kamu tonton berjam-jam?",
    opsi: [
      { teks: "Review gadget, rakit PC, atau tutorial jaringan mikrotik", jurusan: "TKJ" },
      { teks: "Restorasi mobil tua, modifikasi motor, atau balapan", jurusan: "TKR" },
      { teks: "Perbaikan TV/ampli, cek sound ghover, atau miniatur sound system", jurusan: "TAV" },
      { teks: "Strategi jualan Shopee/TikTok affiliate atau podcast bisnis", jurusan: "DM" },
    ],
  },
  {
    id: 15,
    pertanyaan: "Jika kamu dikasih modal usaha Rp 10 Juta, akan kamu pakai untuk apa?",
    opsi: [
      { teks: "Beli stok produk untuk dijual online + bayar iklan Instagram/TikTok Ads", jurusan: "DM" },
      { teks: "Beli kunci-kunci lengkap & hydrolic jack buat alat bengkel mini", jurusan: "TKR" },
      { teks: "Beli perlengkapan tes elektro, alat solder pro, dan suku cadang audio", jurusan: "TAV" },
      { teks: "Beli server bekas, Mikrotik, & crimper buat bikin RT/RW Net", jurusan: "TKJ" },
    ],
  },
  {
    id: 16,
    pertanyaan: "Bagian tubuh mana yang paling aktif saat kamu melakukan hobi?",
    opsi: [
      { teks: "Mata dan otak (menganalisis layar monitor dan baris logika)", jurusan: "TKJ" },
      { teks: "Tangan dan otot (mengangkat, memutar, dan memegang kunci teknik)", jurusan: "TKR" },
      { teks: "Jari tangan & telinga (menyolder halus dan mendengarkan frekuensi suara)", jurusan: "TAV" },
      { teks: "Mata & mulut (melihat tren visuals dan berkomunikasi dengan orang)", jurusan: "DM" },
    ],
  },
  {
    id: 17,
    pertanyaan: "Bagaimana cara kamu memersuasi teman agar mau membeli ide milikmu?",
    opsi: [
      { teks: "Tunjukkan data angka, keuntungan, dan visualisasi menarik", jurusan: "DM" },
      { teks: "Jelaskan dengan logika yang masuk akal dan langkah berurutan", jurusan: "TKJ" },
      { teks: "Tunjukkan contoh fisik nyata barangnya yang langsung berfungsi", jurusan: "TKR" },
      { teks: "Demokan hasil suara/visual elektroniknya secara langsung", jurusan: "TAV" },
    ],
  },
  {
    id: 18,
    pertanyaan: "Apa pendapatmu tentang tren kendaraan listrik (EV) saat ini?",
    opsi: [
      { teks: "Sangat menarik dari sisi kombinasi motor penggerak & baterainya", jurusan: "TKR" },
      { teks: "Penasaran sama skema sirkuit kelistrikan dan controller pengisiannya", jurusan: "TAV" },
      { teks: "Fokus pada software IoT dan jaringan kontrol jarak jauhnya", jurusan: "TKJ" },
      { teks: "Tertarik pada strategi edukasi pasar & cara penjualannya", jurusan: "DM" },
    ],
  },
  {
    id: 19,
    pertanyaan: "Ketika kamu membeli barang elektronik, hal apa yang paling kamu perhatikan?",
    opsi: [
      { teks: "Merek, desain, keandalan promosi, dan review dari para influencer", jurusan: "DM" },
      { teks: "Spesifikasi processor, kapasitas RAM, dan port konektivitasnya", jurusan: "TKJ" },
      { teks: "Ketahanan fisik, material bodi luar, dan daya tahannya", jurusan: "TKR" },
      { teks: "Kualitas output suara/gambar dan konsumsi daya watt-nya", jurusan: "TAV" },
    ],
  },
  {
    id: 20,
    pertanyaan: "Apa reaksi kamu jika diminta menyolder atau menghubungkan kabel?",
    opsi: [
      { teks: "Sangat antusias! Itu hal yang menyenangkan dan memuaskan", jurusan: "TAV" },
      { teks: "Bisa saja, terutama kalau kabel LAN/jaringan komputer", jurusan: "TKJ" },
      { teks: "Bisa, asalkan kabel kelistrikan pada mesin motor/kabel aki", jurusan: "TKR" },
      { teks: "Lebih suka mengurusi tampilan fisiknya atau memasarkannya saja", jurusan: "DM" },
    ],
  },
  {
    id: 21,
    pertanyaan: "Kata kunci mana yang paling menarik perhatianmu?",
    opsi: [
      { teks: "Router, Cloud, Server, Firewall, Cybersecurity", jurusan: "TKJ" },
      { teks: "Injeksi, Piston, Transmisi, Turbo, Service", jurusan: "TKR" },
      { teks: "Ampli, PCB, Transistor, Resistor, Equalizer", jurusan: "TAV" },
      { teks: "SEO, Copywriting, Content Creator, Branding, Monetisasi", jurusan: "DM" },
    ],
  },
  {
    id: 22,
    pertanyaan: "Bagaimana tanggapanmu terhadap bau minyak pelumas, oli, atau bensin?",
    opsi: [
      { teks: "Sudah terbiasa dan wajar karena itu aroma khas dunia mekanik", jurusan: "TKR" },
      { teks: "Lebih suka bau asap timah solder saat mengerjakan sirkuit", jurusan: "TAV" },
      { teks: "Lebih nyaman di ruangan bersih bebas bau oli", jurusan: "TKJ" },
      { teks: "Sama sekali tidak masalah selama ruangan kerjanya estetis", jurusan: "DM" },
    ],
  },
  {
    id: 23,
    pertanyaan: "Ketika mendengarkan musik di konser atau sound sistem besar, apa yang kamu amati?",
    opsi: [
      { teks: "Kejelasan suara bass, treble, dan susunan speaker subwoofer-nya", jurusan: "TAV" },
      { teks: "Kreativitas panggung, promosi tiket, dan ramainya pengunjung", jurusan: "DM" },
      { teks: "Sistem jaringan jaringan digital mixer dan koneksi nirkabelnya", jurusan: "TKJ" },
      { teks: "Kekuatan truk pengangkut alat dan genset pembangkit tenaganya", jurusan: "TKR" },
    ],
  },
  {
    id: 24,
    pertanyaan: "Pekerjaan sampingan (freelance) apa yang paling ingin kamu coba?",
    opsi: [
      { teks: "Admin Media Sosial / Social Media Specialist / Affiliate", jurusan: "DM" },
      { teks: "Jasa Servis Komputer & Setting Wi-Fi Rumah/Toko", jurusan: "TKJ" },
      { teks: "Jasa Perbaikan Sepeda Motor / Tune-up panggil", jurusan: "TKR" },
      { teks: "Jasa Rakit Sound System Miniatur / Servis Elektronik", jurusan: "TAV" },
    ],
  },
  {
    id: 25,
    pertanyaan: "Apa hal terpenting menurutmu dari sebuah HP baru?",
    opsi: [
      { teks: "Kamera jernih buat bikin konten foto/video promosi", jurusan: "DM" },
      { teks: "Koneksi 5G kencang, processor cepat, dan RAM besar", jurusan: "TKJ" },
      { teks: "Daya tahan baterai badak dan material bodi yang kokoh", jurusan: "TKR" },
      { teks: "Kualitas speaker stereo jernih dan port jack audio", jurusan: "TAV" },
    ],
  },
  {
    id: 26,
    pertanyaan: "Seberapa suka kamu membaca tabel data atau grafik performa?",
    opsi: [
      { teks: "Suka, terutama grafik data penjualan, pengunjung web, atau engagement sosial media", jurusan: "DM" },
      { teks: "Suka, terutama tabel konfigurasi IP, trafik bandwidth, dan ping jaringan", jurusan: "TKJ" },
      { teks: "Suka, terutama grafik gelombang sinyal audio/frekuensi suara", jurusan: "TAV" },
      { teks: "Suka, terutama grafik kurva RPM dan torsi mesin kendaraan", jurusan: "TKR" },
    ],
  },
  {
    id: 27,
    pertanyaan: "Bagaimana sikapmu jika ada instruksi kerja yang rumit?",
    opsi: [
      { teks: "Saya ikuti skema gambar rangkaian/elektronikanya satu per satu", jurusan: "TAV" },
      { teks: "Saya ikuti langkah demi langkah sistem logisnya sampai berhasil", jurusan: "TKJ" },
      { teks: "Saya langsung coba bongkar fisiknya sambil belajar dari kesalahan", jurusan: "TKR" },
      { teks: "Saya amati poin utamanya lalu saya modifikasi dengan cara kreatif", jurusan: "DM" },
    ],
  },
  {
    id: 28,
    pertanyaan: "Apa hal paling memuaskan setelah kamu menyelesaikan suatu tugas?",
    opsi: [
      { teks: "Saat mesin motor/mobil yang tadinya mati, langsung berbunyi mulus", jurusan: "TKR" },
      { teks: "Saat jaringan internet terhubung stabil dan semua PC bisa terkoneksi", jurusan: "TKJ" },
      { teks: "Saat barang elektronik menyala sempurna tanpa ada korsleting", jurusan: "TAV" },
      { teks: "Saat postingan konten banjir likes, komentar, dan produk laku keras", jurusan: "DM" },
    ],
  },
  {
    id: 29,
    pertanyaan: "Jika kamu harus memilih satu soft-skill utama untuk diasah, apa pilihanmu?",
    opsi: [
      { teks: "Digital Communication & Persuasive Marketing", jurusan: "DM" },
      { teks: "Analytical Thinking & Logical Problem Solving", jurusan: "TKJ" },
      { teks: "Technical Skill & Practical Work Ethics", jurusan: "TKR" },
      { teks: "Precision, Accuracy & Circuit Understanding", jurusan: "TAV" },
    ],
  },
  {
    id: 30,
    pertanyaan: "Alasan utama kamu ingin sekolah di SMK Al Kaaffah adalah...",
    opsi: [
      { teks: "Bisa langsung ahli menguasai jaringan & dunia IT modern", jurusan: "TKJ" },
      { teks: "Bisa jago ilmu mekanik & punya keahlian otomotif tingkat lanjut", jurusan: "TKR" },
      { teks: "Bisa paham dunia elektronika, audio-video & kelistrikan", jurusan: "TAV" },
      { teks: "Bisa jadi pengusaha muda, jago jualan online & menguasai digital marketing", jurusan: "DM" },
    ],
  },
];