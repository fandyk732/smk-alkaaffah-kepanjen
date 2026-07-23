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

    // 4. Remote Patterns (Sudah ditambah wildcard biar bebas nempes link mana aja)
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
      // WILDCARD HTTPS: Bebas pakai link CDN luar apa aja tanpa error!
      {
        protocol: 'https',
        hostname: '**',
      },
      // WILDCARD HTTP (opsional kalau ada link image lama pakai http)
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;