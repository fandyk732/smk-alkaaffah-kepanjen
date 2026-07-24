import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google"; 
import "./globals.css";
import { AnnouncementBar } from "@/components/announcement-bar"; 
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AnimatedBackground } from "@/components/animated-background";
import { Toaster } from "@/components/ui/sonner";
import { school } from "@/data/site";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-plus-jakarta",
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
    <html lang="id" className={`${plusJakarta.className} ${plusJakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <AnimatedBackground />
        
        {/* 🚀 KUNCI BIAR KEDUA KOMPONEN NGIKUTIN SAAT DI-SCROLL */}
        <header className="fixed top-0 left-0 right-0 z-50">
          <AnnouncementBar />
          <Navbar />
        </header>

        {/* Padding top disesuaikan biar konten halaman nggak tertutup header */}
        <main className="min-h-screen pt-28 sm:pt-32">{children}</main>
        
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}