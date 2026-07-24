"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
// 1. HAPUS GraduationCap dari lucide-react
import { Menu, X, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navItems, school } from "@/data/site";
import { cn } from "@/lib/utils";

// 2. IMPORT LOGO SMK KUSTOM HASIL OPTIMASI LO
import { LogoSmkIcon } from "@/components/logo-smk-icon";

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
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass-card border-b py-2" : "bg-transparent py-4"
      )}
    >
      <nav className="container-page flex items-center justify-between" aria-label="Navigasi utama">
        
        {/* ================= BRAND LOGO SEKOLAH ================= */}
<Link href="/" className="flex items-center gap-2.5 group">
  {/* Hapus bg-gradient-primary dan text-primary-foreground, ganti p-1.5 jadi p-0 */}
  <span className="grid h-8 w-8 place-items-center rounded-xl transition-transform group-hover:scale-105">
    {/* LOGO SMK KUSTOM */}
    <LogoSmkIcon className="h-full w-full object-contain" />
  </span>
  <span className="flex flex-col leading-tight">
    <span className="text-sm font-extrabold tracking-tight">{school.short}</span>
    <span className="text-[11px] text-muted-foreground">Kepanjen</span>
  </span>
</Link>

        {/* Desktop Menu */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <li key={item.to}>
                <Link
                  href={item.to}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                    active ? "text-primary" : "text-foreground/80"
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
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Ganti tema">
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button asChild className="hidden sm:inline-flex bg-gradient-primary">
            <Link href="/ppdb">Daftar SPMB</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Buka menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden bg-background/95 backdrop-blur-md border-b" 
          >
            <ul className="container-page flex flex-col gap-1 py-4">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    href={item.to}
                    className="block rounded-lg px-4 py-3 text-sm font-medium hover:bg-secondary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <Button asChild className="mt-2 w-full bg-gradient-primary sm:hidden">
                <Link href="/ppdb">Daftar SPMB</Link>
              </Button>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}