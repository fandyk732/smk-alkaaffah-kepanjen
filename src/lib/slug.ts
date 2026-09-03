// lib/slug.ts
export function generateShortSlug(title: string, maxWords = 5): string {
  // Kata-kata yang dibuang biar slug ringkas & fokus ke Keyword SEO
  const stopWords = new Set([
    "yang", "di", "ke", "dari", "dan", "atau", "untuk", "bagi", "pada", 
    "dengan", "adalah", "ini", "itu", "akan", "juga", "serta", "hadirkan"
  ]);

  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Hapus karakter khusus
    .split(/\s+/)
    .filter((word) => word.length > 0 && !stopWords.has(word)) // Buang stop words
    .slice(0, maxWords) // Ambil maksimal 5 kata pertama saja
    .join("-");
}