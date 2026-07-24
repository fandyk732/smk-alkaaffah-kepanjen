"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navItems, school } from "@/data/site";
import { cn } from "@/lib/utils";
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
    <div
      className={cn(
        "w-full transition-all duration-300",
        scrolled ? "glass-card border-b py-2 shadow-sm" : "bg-transparent py-3"
      )}
    >
      <nav className="container-page flex items-center justify-between mx-auto" aria-label="Navigasi utama">
        
        {/* ================= BRAND LOGO SEKOLAH ================= */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="grid h-9 w-9 place-items-center rounded-xl transition-transform group-hover:scale-105">
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
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Ganti tema" className="rounded-full">
            {dark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
          </Button>

         {/* NAVBAR CTA - DIBIKIN KALEM & CLEAN */}
          <Button 
            asChild 
            variant="outline" 
            className="hidden sm:inline-flex rounded-xl font-semibold border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors"
          >
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
            className="lg:hidden overflow-hidden bg-background/95 backdrop-blur-md border-b"
          >
            <ul className="container-page flex flex-col gap-1 py-4 mx-auto">
              {navItems.map((item) => {
                const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
                return (
                  <li key={item.to}>
                    <Link
                      href={item.to}
                      className={cn(
                        "block rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                        active ? "bg-primary/10 text-primary font-bold" : "hover:bg-secondary text-foreground/80"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <div className="pt-2 px-1">
                <Button asChild className="w-full bg-gradient-primary sm:hidden rounded-xl py-5 font-bold">
                  <Link href="/ppdb">Daftar SPMB</Link>
                </Button>
              </div>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}