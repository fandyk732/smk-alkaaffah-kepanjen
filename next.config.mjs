/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Mengaktifkan kompresi Gzip/Brotli bawaan Next.js
  compress: true,

  images: {
    // 2. Prioritaskan format gambar modern yang ukurannya jauh lebih ringan
    formats: ['image/avif', 'image/webp'],
    
    // 3. Batasi device sizes biar Next.js nggak generate gambar kegedean buat mobile
    deviceSizes: [375, 640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // 4. Remote Patterns — HANYA domain yang beneran dipake buat serve gambar.
    // Sebelumnya ada wildcard hostname: '**' di sini, yang bikin endpoint
    // /_next/image bisa dipake siapapun buat proxy URL APAPUN dari internet
    // lewat domain sekolah sendiri (resource abuse + risiko reputasi domain).
    // Kalau nanti nambah sumber gambar baru, tambahin hostname-nya di sini
    // satu-satu — JANGAN pakai wildcard lagi.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '6a56f44fcec0a76b21484386.imgix.net',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        // Supabase Storage — asset sekolah yang dimigrasi biar nggak kena
        // block Internet Positif.
        protocol: 'https',
        hostname: 'bciawezxmfvosfftvgwa.supabase.co',
      },
    ],
  },
};

export default nextConfig;