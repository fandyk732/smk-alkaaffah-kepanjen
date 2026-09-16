// app/api/revalidate-meta/route.ts
import { NextResponse } from "next/server";

// 🔒 Cuma boleh minta Facebook re-scrape URL milik domain sekolah sendiri —
// sebelumnya endpoint ini nerima URL APAPUN dari siapapun tanpa batasan,
// jadi bisa dipake siapa aja sebagai relay buat nembak Facebook Graph API
// buat URL pihak ketiga manapun (nggak ada auth/rate-limit sama sekali).
const ALLOWED_HOSTS = [
  "smkalkaaffah.sch.id",
  "www.smkalkaaffah.sch.id",
  "smk-alkaaffah-kepanjen.vercel.app"
  // tambahin domain Vercel preview/production lain di sini kalau perlu
];

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ error: "URL wajib diisi" }, { status: 400 });

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return NextResponse.json({ error: "URL tidak valid" }, { status: 400 });
    }

    if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
      return NextResponse.json(
        { error: "Cuma boleh minta re-scrape URL milik domain sekolah sendiri" },
        { status: 403 }
      );
    }

    const fbResponse = await fetch(`https://graph.facebook.com/?id=${encodeURIComponent(url)}&scrape=true`, {
      method: "POST",
    });

    const data = await fbResponse.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memicu scraping Meta" }, { status: 500 });
  }
}