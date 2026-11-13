// src/lib/youtube.ts
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  // 🟢 Sudah support: watch?v=, youtu.be/, embed/, shorts/, dan live/
  const regExp =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.trim().match(regExp);
  return match ? match[1] : null;
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const videoId = extractYouTubeId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0` : null;
}