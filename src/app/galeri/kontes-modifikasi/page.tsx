"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/page-hero";
import {
  FolderOpen,
  ExternalLink,
  Trophy,
  Bike,
  Camera,
  Sparkles,
  Users,
  Gift,
  LogOut,
  Grid,
  List,
  Loader2,
} from "lucide-react";

interface DriveFolderItem {
  id: string;
  title: string;
  shortTitle: string; // Label ringkas khusus pill tab di mobile
  subtitle: string;
  folderId: string;
  icon: React.ElementType;
  accent: string;
}

const DRIVE_FOLDERS: DriveFolderItem[] = [
  {
    id: "juara",
    title: "Foto Penyerahan Juara",
    shortTitle: "Penyerahan Juara",
    subtitle: "Momen podium & penyerahan trofi pemenang kontes",
    folderId: "1ojiX50mSgomqzFqYlqyHYWkzCDwDGt5M",
    icon: Trophy,
    accent: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  },
  {
    id: "motor",
    title: "Foto Sepeda Motor Peserta",
    shortTitle: "Motor Peserta",
    subtitle: "Detail modifikasi & unit motor seluruh peserta",
    folderId: "1cWntv7r7iXVGI4f-hCPWweY3se262smc",
    icon: Bike,
    accent: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  },
  {
    id: "peserta",
    title: "Foto Peserta",
    shortTitle: "Peserta",
    subtitle: "Potret peserta kontes bersama motor kebanggaannya",
    folderId: "12RUW7YJH6jrLx4Ux4ties1tewmk_js1v",
    icon: Users,
    accent: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    id: "photobooth",
    title: "Photobooth",
    shortTitle: "Photobooth",
    subtitle: "Dokumentasi gaya bebas di area photobooth event",
    folderId: "1G9IK64JwYIM6BF_JBi0Ai8_RAraOOlQb",
    icon: Camera,
    accent: "text-purple-500 bg-purple-500/10 border-purple-500/20",
  },
  {
    id: "moment",
    title: "Foto Moment",
    shortTitle: "Moment Acara",
    subtitle: "Keseruan suasana acara, juri, dan antusiasme penonton",
    folderId: "1PYRwCHv8A9nM7x0X8qHY-OS0zCwbyg0y",
    icon: Sparkles,
    accent: "text-rose-500 bg-rose-500/10 border-rose-500/20",
  },
  {
    id: "exit-gate",
    title: "Foto Exit Gate",
    shortTitle: "Exit Gate",
    subtitle: "Momen iring-iringan peserta saat keluar area kontes",
    folderId: "1JfqsEPRslUO8FwqqtjLVshe7p3228H39",
    icon: LogOut,
    accent: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
  },
  {
    id: "doorprize",
    title: "Foto Penyerahan Doorprize",
    shortTitle: "Doorprize",
    subtitle: "Momen pembagian hadiah & doorprize menarik",
    folderId: "1ndtWmSQNJdS1rUNAagy93AzYztpLyy4c",
    icon: Gift,
    accent: "text-orange-500 bg-orange-500/10 border-orange-500/20",
  },
];

export default function DokumentasiKontesModifikasiPage() {
  const [activeFolder, setActiveFolder] = useState<DriveFolderItem>(DRIVE_FOLDERS[0]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [iframeLoading, setIframeLoading] = useState(true);
  const viewerRef = useRef<HTMLDivElement | null>(null);

  const driveDirectUrl = `https://drive.google.com/drive/folders/${activeFolder.folderId}`;
  const driveEmbedUrl = `https://drive.google.com/embeddedfolderview?id=${activeFolder.folderId}#${viewMode}`;

  const handleSelectFolder = (folder: DriveFolderItem) => {
    if (folder.id !== activeFolder.id) {
      setIframeLoading(true);
      setActiveFolder(folder);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Media & Dokumentasi Event"
        title="Kontes Modifikasi Sepeda Motor"
        description="Akses dan unduh dokumentasi foto resmi berkualitas tinggi berdasarkan kategori folder di bawah ini."
      />

      <section className="container-page py-8 md:py-10 space-y-6 md:space-y-8">
        {/* 1. NAVIGASI KATEGORI FOLDER */}
        <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
            <div>
                <h2 className="text-base md:text-xl font-bold text-foreground">
                Pilih Folder Dokumentasi
                </h2>
                <p className="hidden md:block text-sm text-muted-foreground">
                Klik salah satu kategori di bawah untuk melihat pratinjau foto atau membuka folder Google Drive.
                </p>
            </div>

            {/* Badge khusus HP: kasih hint bahwa tab bisa di-swipe */}
            <span className="md:hidden text-[11px] font-medium text-muted-foreground shrink-0">
                Geser kategori →
            </span>

            {/* Badge khusus Desktop */}
            <span className="hidden md:inline-block text-xs font-semibold px-3 py-1 rounded-full bg-secondary text-secondary-foreground shrink-0">
                {DRIVE_FOLDERS.length} Folder
            </span>
            </div>

          {/* TAMPILAN MOBILE (< md): Horizontal Scrollable Pill Tabs (Ringkas, langsung lihat preview) */}
          <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
            {DRIVE_FOLDERS.map((folder) => {
              const Icon = folder.icon;
              const isSelected = activeFolder.id === folder.id;

              return (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => handleSelectFolder(folder)}
                  className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2.5 rounded-full border text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                      : "bg-card text-foreground border-border hover:bg-secondary/60"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{folder.shortTitle}</span>
                </button>
              );
            })}
          </div>

          {/* TAMPILAN DESKTOP (md+): Grid Card Lengkap */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {DRIVE_FOLDERS.map((folder, index) => {
              const Icon = folder.icon;
              const isSelected = activeFolder.id === folder.id;

              return (
                <motion.button
                  key={folder.id}
                  type="button"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() => handleSelectFolder(folder)}
                  className={`group text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-3 ${
                    isSelected
                      ? "bg-primary/5 border-primary ring-2 ring-primary/20 shadow-md"
                      : "bg-card hover:bg-secondary/50 border-border hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 w-full">
                    <div className={`p-2.5 rounded-xl border ${folder.accent}`}>
                      <Icon className="h-5 w-5" />
                    </div>

                    <a
                      href={`https://drive.google.com/drive/folders/${folder.folderId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      title="Buka langsung di tab baru"
                      className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                      {folder.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {folder.subtitle}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* 2. LIVE PREVIEW CONTAINER + TOMBOL DOWNLOAD HD */}
        <div
          ref={viewerRef}
          className="rounded-2xl md:rounded-3xl border bg-card shadow-xl overflow-hidden"
        >
          {/* Header Bar Viewer */}
          <div className="p-4 md:p-6 border-b bg-secondary/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 md:p-3 rounded-xl border shrink-0 ${activeFolder.accent}`}>
                <FolderOpen className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-base md:text-lg text-foreground">
                    {activeFolder.title}
                  </h3>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Google Drive Live
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activeFolder.subtitle}
                </p>
              </div>
            </div>

            {/* Kontrol View & Tombol Buka Drive */}
            <div className="flex items-center justify-between md:justify-end gap-2.5 w-full md:w-auto">
              {/* Toggle Grid / List View */}
              <div className="inline-flex rounded-xl border bg-background p-1 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (viewMode !== "grid") {
                      setIframeLoading(true);
                      setViewMode("grid");
                    }
                  }}
                  title="Tampilan Grid"
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === "grid"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (viewMode !== "list") {
                      setIframeLoading(true);
                      setViewMode("list");
                    }
                  }}
                  title="Tampilan Daftar"
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === "list"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              <a
                href={driveDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-xs md:text-sm font-bold shadow-sm hover:opacity-95 transition flex-1 md:flex-initial"
              >
                <ExternalLink className="h-4 w-4 shrink-0" />
                <span>Buka & Download HD</span>
              </a>
            </div>
          </div>

          {/* Embedded Google Drive Folder Viewer */}
          <div className="relative w-full h-[500px] md:h-[650px] bg-slate-50/70 dark:bg-slate-950/60 p-2 md:p-5 transition-colors">
            {iframeLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-slate-50/90 dark:bg-slate-950/90 text-slate-600 dark:text-slate-300">
                <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
                <span className="text-xs font-medium">Memuat pratinjau folder...</span>
              </div>
            )}

            <iframe
              key={`${activeFolder.folderId}-${viewMode}`}
              src={driveEmbedUrl}
              title={activeFolder.title}
              onLoad={() => setIframeLoading(false)}
              className={`w-full h-full border-0 rounded-xl transition-all ${
                viewMode === "list"
                  ? "dark:invert dark:hue-rotate-180 dark:contrast-90"
                  : ""
              }`}
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  );
}