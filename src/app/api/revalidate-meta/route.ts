// app/api/revalidate-meta/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ error: "URL wajib diisi" }, { status: 400 });

    // Tembak Graph API Facebook tanpa Access Token (Public Scraping Endpoint)
    const fbResponse = await fetch(`https://graph.facebook.com/?id=${encodeURIComponent(url)}&scrape=true`, {
      method: "POST",
    });

    const data = await fbResponse.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memicu scraping Meta" }, { status: 500 });
  }
}