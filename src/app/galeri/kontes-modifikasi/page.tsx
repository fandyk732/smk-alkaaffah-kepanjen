"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Loader2,
  Search,
  Download,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  ChevronDown,
} from "lucide-react";

interface DriveFolderItem {
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  folderId: string;
  icon: React.ElementType;
  accent: string;
}

interface DrivePhoto {
  id: string;
  name: string;
  thumbUrl: string;
  fullUrl: string;
  fallbackUrl?: string;
  downloadUrl: string;
}

const ITEMS_PER_BATCH = 24; // 🟢 Tampilkan 24 foto per batch agar enteng di HP

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
  const [photos, setPhotos] = useState<DrivePhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 🟢 Batas jumlah foto yang dirender di layar
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);

  // State Lightbox Modal
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const driveDirectUrl = `https://drive.google.com/drive/folders/${activeFolder.folderId}`;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setErrorMsg(null);
    setSearchQuery("");
    setSelectedIndex(null);
    setVisibleCount(ITEMS_PER_BATCH); // Reset jumlah tampil tiap ganti folder

    fetch(`/api/drive-photos?folderId=${activeFolder.folderId}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal memuat foto");
        return data.photos || [];
      })
      .then((list: DrivePhoto[]) => {
        if (isMounted) setPhotos(list);
      })
      .catch((err: Error) => {
        if (isMounted) setErrorMsg(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeFolder.folderId]);

  // Filter Pencarian dari SELURUH foto di folder
  const filteredPhotos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return photos;
    return photos.filter((p) => p.name.toLowerCase().includes(q));
  }, [photos, searchQuery]);

  // Potong array sesuai visibleCount agar DOM tetap ringan
  const displayedPhotos = useMemo(() => {
    return filteredPhotos.slice(0, visibleCount);
  }, [filteredPhotos, visibleCount]);

  const remainingCount = filteredPhotos.length - displayedPhotos.length;

  // Kontrol Lightbox (navigasi tetap bisa menjelajah seluruh hasil filter)
  const closeModal = useCallback(() => setSelectedIndex(null), []);

  const showPrev = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === null ? null : (prev - 1 + filteredPhotos.length) % filteredPhotos.length
    );
  }, [filteredPhotos.length]);

  const showNext = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === null ? null : (prev + 1) % filteredPhotos.length
    );
  }, [filteredPhotos.length]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedIndex, closeModal, showPrev, showNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) showNext();
    if (diff < -50) showPrev();
    touchStartX.current = null;
  };

  const activePhoto = selectedIndex !== null ? filteredPhotos[selectedIndex] : null;

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
                Klik salah satu kategori di bawah untuk melihat galeri foto atau mengunduh versi HD.
              </p>
            </div>

            <span className="md:hidden text-[11px] font-medium text-muted-foreground shrink-0">
              Geser kategori →
            </span>
            <span className="hidden md:inline-block text-xs font-semibold px-3 py-1 rounded-full bg-secondary text-secondary-foreground shrink-0">
              {DRIVE_FOLDERS.length} Folder
            </span>
          </div>

          {/* MOBILE (< md): Horizontal Scrollable Pill Tabs */}
          <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
            {DRIVE_FOLDERS.map((folder) => {
              const Icon = folder.icon;
              const isSelected = activeFolder.id === folder.id;

              return (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => setActiveFolder(folder)}
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

          {/* DESKTOP (md+): Grid Card Lengkap */}
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
                  onClick={() => setActiveFolder(folder)}
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
                      title="Buka langsung di Google Drive"
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

        {/* 2. CUSTOM GALLERY SHOWCASE CONTAINER */}
        <div className="rounded-2xl md:rounded-3xl border bg-card shadow-xl overflow-hidden">
          {/* Header Bar */}
          <div className="p-4 md:p-6 border-b bg-secondary/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 md:p-3 rounded-xl border shrink-0 ${activeFolder.accent}`}>
                <FolderOpen className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-base md:text-lg text-foreground">
                    {activeFolder.title}
                  </h3>
                  {!loading && !errorMsg && (
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      Menampilkan {displayedPhotos.length} dari {filteredPhotos.length} Foto
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activeFolder.subtitle}
                </p>
              </div>
            </div>

            {/* Search Bar & Tombol Buka Semua di Drive */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="relative">
                <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setVisibleCount(ITEMS_PER_BATCH);
                  }}
                  placeholder="Cari nomor foto (mis. 0035)..."
                  className="w-full sm:w-56 pl-9 pr-3 py-2 rounded-xl border bg-background text-xs md:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <a
                href={driveDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-xs md:text-sm font-bold shadow-sm hover:opacity-95 transition shrink-0"
              >
                <ExternalLink className="h-4 w-4 shrink-0" />
                <span>Buka Folder Drive</span>
              </a>
            </div>
          </div>

          {/* Body Gallery Grid */}
          <div className="p-4 md:p-6 space-y-6">
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-xs md:text-sm font-medium">
                  Mengambil daftar foto dari Google Drive...
                </p>
              </div>
            ) : errorMsg ? (
              <div className="py-16 text-center space-y-3 max-w-md mx-auto">
                <ImageOff className="h-10 w-10 text-rose-500 mx-auto" />
                <p className="text-sm font-semibold text-foreground">
                  Gagal memuat pratinjau langsung
                </p>
                <p className="text-xs text-muted-foreground">{errorMsg}</p>
                <a
                  href={driveDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
                >
                  <ExternalLink className="h-4 w-4" /> Buka Langsung di Google Drive
                </a>
              </div>
            ) : displayedPhotos.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground text-sm">
                Tidak ada foto yang cocok dengan pencarian &ldquo;{searchQuery}&rdquo;.
              </div>
            ) : (
              <>
                {/* MASONRY PHOTO GRID */}
                <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 [&>*]:mb-3 md:[&>*]:mb-4">
                  {displayedPhotos.map((photo, idx) => (
                    <div
                      key={photo.id}
                      onClick={() => setSelectedIndex(idx)}
                      className="group relative break-inside-avoid rounded-xl md:rounded-2xl overflow-hidden border bg-muted cursor-zoom-in shadow-sm hover:shadow-lg transition-shadow"
                    >
                      <img
                        src={photo.thumbUrl}
                        alt={photo.name}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.triedFallback && photo.fallbackUrl) {
                            target.dataset.triedFallback = "true";
                            target.src = photo.fallbackUrl;
                          }
                        }}
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Overlay Gelap Saat Hover (Desktop) + Tombol Aksi */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3">
                        <div className="flex justify-end">
                          <span className="p-2 rounded-full bg-white/15 backdrop-blur-md text-white">
                            <ZoomIn className="h-4 w-4" />
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-semibold text-white truncate">
                            {photo.name}
                          </span>
                          <a
                            href={photo.downloadUrl}
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title="Download Foto HD"
                            className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shrink-0 transition"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 🟢 TOMBOL LOAD MORE (MUAT LEBIH BANYAK) */}
                {remainingCount > 0 && (
                  <div className="pt-2 flex flex-col items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_BATCH)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground font-bold text-xs md:text-sm border transition-all shadow-sm active:scale-95"
                    >
                      <ChevronDown className="h-4 w-4" />
                      <span>
                        Muat {Math.min(ITEMS_PER_BATCH, remainingCount)} Foto Lagi (Sisa {remainingCount} foto)
                      </span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* 3. LIGHTBOX MODAL FULLSCREEN + DOWNLOAD HD */}
      <AnimatePresence>
        {activePhoto && selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8"
          >
            {/* Top Bar */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-between w-full max-w-6xl mx-auto z-10 gap-3"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xs md:text-sm font-semibold text-slate-200 bg-white/10 px-3.5 py-1.5 rounded-full">
                  {selectedIndex + 1} / {filteredPhotos.length}
                </span>
                <span className="hidden sm:inline-block text-xs text-slate-400 font-mono">
                  {activePhoto.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={activePhoto.downloadUrl}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs md:text-sm font-bold shadow-lg transition"
                >
                  <Download className="h-4 w-4" />
                  <span>Download HD</span>
                </a>
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Tutup tampilan penuh"
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Center Photo + Panah Desktop */}
            <div className="relative flex-1 flex items-center justify-center my-2 overflow-hidden">
              {filteredPhotos.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    showPrev();
                  }}
                  aria-label="Foto sebelumnya"
                  className="hidden md:flex absolute left-2 lg:left-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              <motion.div
                key={activePhoto.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-5xl max-h-full flex items-center justify-center"
              >
                <img
                  src={activePhoto.fullUrl}
                  alt={activePhoto.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.triedFallback) {
                      target.dataset.triedFallback = "true";
                      target.src = `https://drive.google.com/thumbnail?id=${activePhoto.id}&sz=w1600`;
                    }
                  }}
                  className="max-h-[68vh] md:max-h-[76vh] w-auto max-w-full rounded-xl object-contain shadow-2xl select-none"
                />
              </motion.div>

              {filteredPhotos.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    showNext();
                  }}
                  aria-label="Foto berikutnya"
                  className="hidden md:flex absolute right-2 lg:right-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>

            {/* Bottom Bar (Mobile Swipe Hint & Prev/Next) */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl mx-auto text-center space-y-2 z-10"
            >
              <p className="sm:hidden text-xs font-mono text-slate-300">{activePhoto.name}</p>

              {filteredPhotos.length > 1 && (
                <div className="flex md:hidden items-center justify-center gap-6 pt-1">
                  <button
                    type="button"
                    onClick={showPrev}
                    className="flex items-center gap-1 px-4 py-2 rounded-full bg-white/10 active:bg-white/20 text-white text-xs font-semibold"
                  >
                    <ChevronLeft className="h-4 w-4" /> Sebelumnya
                  </button>
                  <span className="text-[11px] text-slate-400">Geser foto</span>
                  <button
                    type="button"
                    onClick={showNext}
                    className="flex items-center gap-1 px-4 py-2 rounded-full bg-white/10 active:bg-white/20 text-white text-xs font-semibold"
                  >
                    Berikutnya <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}