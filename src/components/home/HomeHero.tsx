"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { school } from "@/data/site";
import heroImg from "@/assets/hero.jpg";

export function HomeHero() {
  return (
    <section className="container-page relative grid items-center gap-12 py-12 lg:grid-cols-2 lg:py-20">
      <div>
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full glass-card px-4 py-1.5 text-xs font-semibold text-primary"
        >
          <Sparkles className="h-3.5 w-3.5" /> Tagline dan Visi Kami
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
        >
          <span className="text-gradient">Belum Lulus, </span> Sudah Produktif
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="mt-5 max-w-xl text-lg text-muted-foreground"
        >
          {school.description}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <Button asChild size="lg" className="bg-gradient-primary">
            <Link href="/ppdb">
              Daftar SPMB <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/program">Kenali Program Kami</Link>
          </Button>
        </motion.div>
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
          {["Terakreditasi B", "Kurikulum Industri", "Sertifikasi Kompetensi"].map((t) => (
            <span key={t} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" /> {t}
            </span>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative"
      >
        <div className="overflow-hidden rounded-3xl border shadow-elegant relative h-[350px] sm:h-[450px] lg:h-[500px]">
          <Image
            src={heroImg}
            alt="Siswa SMK Al Kaaffah belajar di laboratorium komputer"
            priority
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute -bottom-6 -left-6 glass-card rounded-2xl p-4"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
              <Award className="h-5 w-5" />
            </span>
            <div>
              <p className="text-lg font-extrabold leading-none">95%</p>
              <p className="text-xs text-muted-foreground">Lulusan terserap industri</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}