import Link from "next/link";
import { GraduationCap, MapPin, Phone, Mail, Instagram, Facebook, Youtube } from "lucide-react";
import { navItems, school } from "@/data/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-section">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-sm font-extrabold">{school.short}</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{school.description}</p>
          <div className="mt-4 flex gap-2">
            <a href={school.socials.instagram} aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
              <Instagram className="h-4 w-4" />
            </a>
            <a href={school.socials.facebook} aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Navigasi</h3>
          <ul className="mt-4 space-y-2">
            {navItems.map((i) => (
              <li key={i.to}>
                <Link href={i.to} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Program Keahlian</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Teknik Komputer &amp; Jaringan</li>
            <li>Teknik Elektronika</li>
            <li>Teknik Kendaraan Ringan</li>
            <li>Digital Marketing</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Kontak</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{school.address}</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 shrink-0 text-primary" />{school.phone}</li>
            <li className="flex gap-2"><Mail className="h-4 w-4 shrink-0 text-primary" />{school.email}</li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} {school.name}. Hak cipta dilindungi.</p>
          <p>Dibuat oleh : "FAL&RTS" dengan dedikasi untuk legacy SMK Al Kaaffah.</p>
        </div>
      </div>
    </footer>
  );
}
