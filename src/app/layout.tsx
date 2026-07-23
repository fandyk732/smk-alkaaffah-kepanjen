import type { Metadata } from "next";
// 1. Import font langsung dari Next.js
import { Plus_Jakarta_Sans } from "next/font/google"; 
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AnimatedBackground } from "@/components/animated-background";
import { Toaster } from "@/components/ui/sonner";
import { school } from "@/data/site";

// 2. Konfigurasi Font Plus Jakarta Sans
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"], // Sesuai weight yang lo panggil sebelumnya
  display: "swap", // Mencegah text tak terlihat saat loading (Zero Render-Blocking)
  variable: "--font-plus-jakarta", // Untuk integrasi Tailwind CSS
});

export const metadata: Metadata = {
  metadataBase: new URL("https://smkalkaaffah.sch.id"),
  title: {
    default: `${school.name} — ${school.tagline}`,
    template: `%s — ${school.name}`,
  },
  description: school.description,
  authors: [{ name: school.name }],
  openGraph: {
    title: school.name,
    description: school.description,
    type: "website",
    siteName: school.name,
  },
  twitter: {
    card: "summary_large_image",
    title: school.name,
    description: school.description,
  },
  icons: { icon: "/favicon.ico" },
};

export const viewport = {
  themeColor: "#2563EB",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: school.name,
  description: school.description,
  address: school.address,
  email: school.email,
  telephone: school.phone,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // 3. Pasang className font di html & hapus suppressHydrationWarning jika tidak terpaksa
    <html lang="id" className={`${plusJakarta.className} ${plusJakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <AnimatedBackground />
        <Navbar />
        <main className="min-h-screen pt-20">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}