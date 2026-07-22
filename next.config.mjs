/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '6a56f44fcec0a76b21484386.imgix.net', // Domain CDN gambar lo
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com', // Kalau gambar berita di-upload ke Firebase Storage
      },
    ],
  },
};

export default nextConfig;