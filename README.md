# SMK Al Kaaffah Kepanjen — Website

Website resmi SMK Al Kaaffah Kepanjen. Dibangun dengan **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **shadcn/ui**, dan **Framer Motion**. Siap deploy ke **Vercel**.

## Fitur

- Homepage, Profil, Program Keahlian, Berita (list + detail dinamis), Galeri, PPDB, Kontak
- SEO: metadata per halaman, Open Graph, Twitter Card, JSON-LD, `sitemap.xml`, `robots.txt`
- Dark mode (toggle di navbar)
- Animasi Framer Motion & desain responsif
- Halaman berita di-*static generate* (`generateStaticParams`)

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000

## Build produksi

```bash
npm run build
npm run start
```

## Deploy ke Vercel

1. Push repositori ini ke GitHub.
2. Buka [vercel.com/new](https://vercel.com/new) dan import repo tersebut.
3. Vercel otomatis mendeteksi Next.js — cukup klik **Deploy**.

## Struktur

```
src/
  app/            # Routing App Router + metadata + sitemap/robots
  components/     # Navbar, Footer, UI (shadcn), halaman interaktif
  data/site.ts    # Sumber data konten (mudah dihubungkan ke CMS)
  assets/         # Gambar
```

## Menghubungkan ke CMS

Seluruh konten dinamis berasal dari `src/data/site.ts`. Untuk integrasi Sanity/CMS,
ganti ekspor pada file tersebut dengan hasil query CMS (mis. di dalam Server Component / loader).
