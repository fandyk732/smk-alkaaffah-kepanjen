import { NextRequest, NextResponse } from "next/server";

// Whitelist folder resmi sekolah agar kuota API Key tidak disalahgunakan pihak luar
const ALLOWED_FOLDER_IDS = new Set([
  "1ojiX50mSgomqzFqYlqyHYWkzCDwDGt5M", // Foto Penyerahan Juara
  "1cWntv7r7iXVGI4f-hCPWweY3se262smc", // Foto Sepeda Motor Peserta
  "12RUW7YJH6jrLx4Ux4ties1tewmk_js1v", // Foto Peserta
  "1G9IK64JwYIM6BF_JBi0Ai8_RAraOOlQb", // Photobooth
  "1PYRwCHv8A9nM7x0X8qHY-OS0zCwbyg0y", // Foto Moment
  "1JfqsEPRslUO8FwqqtjLVshe7p3228H39", // Foto Exit Gate
  "1ndtWmSQNJdS1rUNAagy93AzYztpLyy4c", // Foto Penyerahan Doorprize
]);

export async function GET(request: NextRequest) {
  const folderId = request.nextUrl.searchParams.get("folderId")?.trim();

  if (!folderId) {
    return NextResponse.json({ error: "Parameter folderId wajib diisi" }, { status: 400 });
  }

  if (!ALLOWED_FOLDER_IDS.has(folderId)) {
    return NextResponse.json({ error: "Akses folder tidak diizinkan" }, { status: 403 });
  }

  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  if (!apiKey) {
    console.error("GOOGLE_DRIVE_API_KEY belum dikonfigurasi di environment variables.");
    return NextResponse.json(
      { error: "Konfigurasi layanan galeri belum siap" },
      { status: 500 }
    );
  }

  const query = encodeURIComponent(
    `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`
  );
  const fields = encodeURIComponent("files(id, name, thumbnailLink)");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&orderBy=name&pageSize=300&key=${apiKey}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();

    if (!res.ok) {
      console.error("Google Drive API Error:", data.error);
      return NextResponse.json(
        { error: "Gagal mengambil data foto dari Google Drive" },
        { status: res.status }
      );
    }

    const photos = (data.files || []).map(
      (file: { id: string; name: string }) => ({
        id: file.id,
        name: file.name.replace(/\.[^/.]+$/, ""),
        thumbUrl: `https://drive.google.com/thumbnail?id=${file.id}&sz=w500`,
        fullUrl: `https://drive.google.com/thumbnail?id=${file.id}&sz=w1600`,
        downloadUrl: `https://drive.google.com/uc?export=download&id=${file.id}`,
      })
    );

    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Drive API Fetch Exception:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}