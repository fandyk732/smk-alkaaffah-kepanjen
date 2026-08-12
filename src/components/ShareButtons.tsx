"use client";

import { useState } from "react";
import { Share2, Check, Link as LinkIcon } from "lucide-react";

export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  // Ambil URL artikel saat ini
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  // Link khusus WhatsApp
  const waText = encodeURIComponent(`Halo! Coba baca artikel keren ini dari SMK Al Kaaffah:\n\n*"${title}"*\n\nSelengkapnya di: ${currentUrl}`);
  const waUrl = `https://api.whatsapp.com/send?text=${waText}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 py-4 border-y border-border my-6">
      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <Share2 className="h-4 w-4" /> Bagikan:
      </span>

      {/* WhatsApp */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm hover:scale-105 active:scale-95"
      >
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
        </svg>
        WhatsApp
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border border-border"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <LinkIcon className="h-3.5 w-3.5" />}
        {copied ? "Tersalin!" : "Salin Link"}
      </button>
    </div>
  );
}