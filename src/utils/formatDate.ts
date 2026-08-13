// Helper format tanggal Indonesia (contoh: "2026-08-12" -> "12 Agustus 2026")
const formatTanggalIndo = (dateString?: string) => {
  if (!dateString) return "-";
  
  const date = new Date(dateString);
  // Mengecek apakah string tanggal valid
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};