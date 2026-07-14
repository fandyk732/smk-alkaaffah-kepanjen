import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AnimatedBackground } from "@/components/animated-background";
import { Toaster } from "@/components/ui/sonner";
import { school } from "@/data/site";

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
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        />
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
