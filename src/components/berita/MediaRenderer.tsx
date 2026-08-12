"use client";

import React, { useEffect } from "react";
import { InstagramEmbed, TikTokEmbed } from "react-social-media-embed";

interface MediaRendererProps {
  embed?: {
    type: "youtube" | "instagram" | "tiktok";
    url: string;
  };
}

export function MediaRenderer({ embed }: MediaRendererProps) {
  if (!embed || !embed.url) return null;

  // 🧹 Helper bersihkan query string pelacak dari URL
  const cleanUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return `${parsed.origin}${parsed.pathname}`;
    } catch {
      return url;
    }
  };

  const formattedUrl = cleanUrl(embed.url);

  // Helper Ambil YouTube ID
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // 🔄 Re-process Instagram SDK secara manual
  useEffect(() => {
    if (embed.type === "instagram" && typeof window !== "undefined" && (window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
    }
  }, [formattedUrl, embed.type]);

  return (
    <div className="my-8 flex justify-center w-full">
      {/* 📹 YOUTUBE EMBED */}
      {embed.type === "youtube" && (() => {
        const videoId = getYoutubeId(formattedUrl);
        if (!videoId) return null;
        return (
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-md border border-slate-200">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${videoId}`}
              title="YouTube video player"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      })()}

      {/* 📸 INSTAGRAM EMBED (PORTRAIT & CAPTIONED) */}
      {embed.type === "instagram" && (
        <div className="w-full max-w-[400px] mx-auto min-h-[580px] flex justify-center overflow-hidden rounded-2xl border border-slate-100 shadow-sm [&_iframe]:!w-full [&_iframe]:!min-h-[550px]">
          <InstagramEmbed url={formattedUrl} width="100%" captioned />
        </div>
      )}

     {/* 🎵 TIKTOK EMBED (UTUH & TIDAK KEPOTONG) */}
      {embed.type === "tiktok" && (
        <div className="w-full max-w-[325px] mx-auto min-h-[740px] flex justify-center overflow-hidden rounded-2xl border border-slate-100 shadow-sm [&_iframe]:!w-full [&_iframe]:!min-h-[730px]">
          <TikTokEmbed url={formattedUrl} width="100%" />
        </div>
      )}
    </div>
  );
}