import type { Metadata } from "next";
import { KontakPage } from "@/components/pages/kontak-page";
import { school } from "@/data/site";

export const metadata: Metadata = {
  title: `Kontak — ${school.name}`,
  description: "Hubungi SMK Al Kaaffah Kepanjen: alamat, telepon, WhatsApp, dan formulir kontak.",
  alternates: { canonical: "/kontak" },
  openGraph: { title: `Kontak — ${school.name}`, url: "/kontak" },
};

export default function Page() {
  return <KontakPage />;
}
