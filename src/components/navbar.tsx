"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { school } from "@/data/site"; // navItems kita define lokal dulu di bawah
import { cn } from "@/lib/utils";
import { LogoSmkIcon } from "@/components/logo-smk-icon";

// 🚀 DAFTAR MENU BARU DENGAN SUB-ITEM (DROPDOWN)
const mainNavItems = [
  { label: "Beranda", to: "/" },
  { label: "Profil", to: "/profil" },
  {
    label: "Program",
    to: "/program",
    subItems: [
      { label: "Teknik Komputer & Jaringan", to: "/program/tkj" },
      { label: "Teknik Kendaraan Ringan", to: "/program/tkr" },
      { label: "Teknik Audio Video", to: "/program/tav" },
      { label: "Kelas Bahasa Jepang", to: "/program/bahasa-jepang" },
      { label: "Kelas Digital Marketing", to: "/program/digital-marketing" },
    ],
  },
  {
    label: "Berita",
    to: "/berita",
    subItems: [
      { label: "Semua Berita", to: "/berita" },
      { label: "Berita Sekolah", to: "/berita/kategori/sekolah" },
      { label: "Prestasi", to: "/berita/kategori/prestasi" },
      { label: "Teknologi", to: "/berita/kategori/tekno" },
    ],
  },
  { label: "Galeri", to: "/galeri" },
  { label: "Alumni", to: "/alumni" },
  { label: "SPMB", to: "/ppdb" },
  { label: "Kontak", to: "/kontak" },
];

function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  return { dark, toggle };
}

// Komponen Sub-Menu khusus Mobile (Biar bisa Expand/Collapse)
function MobileNavItem({ item, pathname, closeMenu }: { item: any; pathname: string; closeMenu: () => void }) {
  const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
  const [isOpen, setIsOpen] = useState(active);

  if (item.subItems) {
    return (
      <li className="flex flex-col">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary",
            active ? "text-primary font-semibold" : "text-foreground/80"
          )}
        >
          {item.label}
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pl-4 pr-2"
            >
              <div className="mt-1 flex flex-col gap-1 border-l-2 border-primary/20 pl-2">
                {item.subItems.map((sub: any) => {
                  const subActive = pathname === sub.to;
                  return (
                    <Link
                      key={sub.to}
                      href={sub.to}
                      onClick={closeMenu}
                      className={cn(
                        "block rounded-lg px-4 py-2.5 text-sm transition-colors",
                        subActive ? "bg-primary/10 text-primary font-semibold" : "hover:bg-secondary text-foreground/70"
                      )}
                    >
                      {sub.label}
                    </Link>
                  );
                })}
              </div>
            </motion.ul>
          )}
        </AnimatePresence>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={item.to}
        onClick={closeMenu}
        className={cn(
          "block rounded-xl px-4 py-3 text-sm font-medium transition-colors",
          active ? "bg-primary/10 text-primary font-bold" : "hover:bg-secondary text-foreground/80"
        )}
      >
        {item.label}
      </Link>
    </li>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { dark, toggle } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div
      className={cn(
        "w-full transition-all duration-300 z-50 relative",
        scrolled ? "glass-card border-b py-2 shadow-sm" : "bg-transparent py-3"
      )}
    >
      <nav className="container-page flex items-center justify-between mx-auto" aria-label="Navigasi utama">
        
        {/* ================= BRAND LOGO SEKOLAH ================= */}
        <Link href="/" className="flex items-center gap-2.5 group z-50">
          <span className="grid h-9 w-9 place-items-center rounded-xl transition-transform group-hover:scale-105">
            <LogoSmkIcon className="h-full w-full object-contain" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-extrabold tracking-tight">{school.short}</span>
            <span className="text-[11px] text-muted-foreground">Kepanjen</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden items-center gap-1 lg:flex z-50">
          {mainNavItems.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            
            // Render jika ada Sub Items (Dropdown)
            if (item.subItems) {
              return (
                <li key={item.to} className="relative group">
                  <Link
                    href={item.to}
                    className={cn(
                      "flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                      active ? "text-primary font-semibold" : "text-foreground/80"
                    )}
                  >
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                  </Link>
                  
                  {/* Dropdown Panel Desktop */}
                  <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-56 z-50">
                    <div className="flex flex-col gap-1 rounded-2xl border bg-background/95 backdrop-blur-xl p-2 shadow-xl">
                      {item.subItems.map((sub) => {
                        const subActive = pathname === sub.to;
                        return (
                          <Link
                            key={sub.to}
                            href={sub.to}
                            className={cn(
                              "block rounded-xl px-3 py-2.5 text-sm transition-colors",
                              subActive ? "bg-primary/10 text-primary font-semibold" : "hover:bg-secondary hover:text-foreground text-foreground/70"
                            )}
                          >
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </li>
              );
            }

            // Render Menu Normal
            return (
              <li key={item.to}>
                <Link
                  href={item.to}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                    active ? "text-primary font-semibold" : "text-foreground/80"
                  )}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-secondary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right Actions */}
        <div className="flex items-center gap-2 z-50">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Ganti tema" className="rounded-full">
            {dark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button asChild className="hidden sm:inline-flex bg-gradient-primary rounded-xl font-semibold shadow-sm">
            <Link href="/ppdb">Daftar SPMB</Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-full"
            onClick={() => setOpen((o) => !o)}
            aria-label="Buka menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full lg:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-b shadow-lg z-40"
          >
            <ul className="container-page flex flex-col gap-1 py-4 mx-auto max-h-[75vh] overflow-y-auto">
              {mainNavItems.map((item) => (
                <MobileNavItem key={item.to} item={item} pathname={pathname} closeMenu={() => setOpen(false)} />
              ))}
              <div className="pt-4 px-1 mt-2 border-t border-border/50">
                <Button asChild className="w-full bg-gradient-primary sm:hidden rounded-xl py-5 font-bold">
                  <Link href="/ppdb" onClick={() => setOpen(false)}>Daftar SPMB</Link>
                </Button>
              </div>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}