// src/components/home/HomeVideoSection.tsx
"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { extractYouTubeId, getYouTubeEmbedUrl } from "@/lib/youtube";
import { Play, Youtube } from "lucide-react";

const DEFAULT_VIDEO_URL = "https://youtu.be/d867JKNs2xQ?si=_tX4o4WqrDNjfqo2";

export function HomeVideoSection() {
  const [isVisible, setIsVisible] = useState(true);
  const [title, setTitle] = useState("Profil & Kegiatan Sekolah");
  const [subtitle, setSubtitle] = useState(
    "Simak tayangan video profil dan beragam aktivitas pembelajaran di SMK Al-Kaaffah."
  );
  const [videoUrl, setVideoUrl] = useState(DEFAULT_VIDEO_URL);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchVideoSettings = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "announcement"));
        if (snap.exists()) {
          const data = snap.data();
          if (typeof data.isVideoActive === "boolean") {
            setIsVisible(data.isVideoActive);
          }
          if (data.videoTitle) setTitle(data.videoTitle);
          if (data.videoSubtitle !== undefined) setSubtitle(data.videoSubtitle);
          if (data.videoUrl) setVideoUrl(data.videoUrl);
        }
      } catch (err) {
        console.error("Gagal memuat pengaturan video homepage:", err);
      }
    };

    fetchVideoSettings();
  }, []);

  if (!isVisible) return null;

  const videoId = extractYouTubeId(videoUrl);
  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  if (!videoId || !embedUrl) return null;

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    // 🟢 Background transparan & tanpa border-y agar menyatu dengan grid website
    <section className="py-12 md:py-16 bg-transparent">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 dark:border-rose-500/30 backdrop-blur-sm">
            <Youtube className="h-3.5 w-3.5" /> Video Unggulan
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Wrapper dengan Ambient Glow & Drop Shadow */}
        <div className="relative group">
          {/* Efek Ambient Glow halus di belakang video */}
          <div
            aria-hidden="true"
            className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-blue-500/20 via-sky-400/15 to-rose-500/20 dark:from-blue-600/25 dark:via-sky-500/15 dark:to-rose-600/25 blur-xl opacity-75 group-hover:opacity-100 transition duration-500 pointer-events-none"
          />

          {/* Responsive 16:9 Video Frame */}
          <div className="relative aspect-video w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.18)] dark:shadow-[0_22px_60px_rgba(0,0,0,0.85)] border border-slate-200/90 dark:border-slate-800/90 bg-slate-900">
            {!isPlaying ? (
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                aria-label={`Putar video: ${title}`}
                className="relative w-full h-full block text-left focus:outline-none"
              >
                <img
                  src={thumbnailUrl}
                  onError={(e) => {
                    e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                  }}
                  alt={title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/35 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl shadow-rose-600/40 group-hover:scale-110 transition-transform duration-300">
                    <Play className="h-7 w-7 md:h-8 md:w-8 fill-white ml-1" />
                  </div>
                </div>
              </button>
            ) : (
              <iframe
                src={`${embedUrl}&autoplay=1`}
                title={title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}