import { NextResponse } from "next/server";

// 🔒 Cuma nerima data terstruktur, BUKAN string HTML bebas dari client.
// Ini nutup celah "open relay" — client nggak bisa lagi nyuruh bot kirim
// pesan sembarang (termasuk link phishing yang keliatan resmi).
interface PendaftarPayload {
  namaLengkap: string;
  nisn: string;
  asalSekolah: string;
  pilihanJurusan: string;
  programUnggulan?: string;
  ekstrakurikuler?: string;
  whatsapp: string;
}

// Batas panjang wajar buat tiap field, biar nggak ada yang nyoba nge-flood
// pesan raksasa atau nyelipin karakter aneh dalam jumlah besar.
const MAX_LEN = 150;

function isValidField(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= MAX_LEN;
}

// Escape HTML dasar biar isi field nggak bisa "keluar" dari konteks teks
// dan ngerusak/nge-inject tag Telegram HTML (misal bikin link palsu sendiri).
function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      namaLengkap,
      nisn,
      asalSekolah,
      pilihanJurusan,
      programUnggulan,
      ekstrakurikuler,
      whatsapp,
    } = body as Partial<PendaftarPayload>;

    // Validasi ketat: field wajib harus ada, sesuai tipe, dan nggak kepanjangan.
    if (
      !isValidField(namaLengkap) ||
      !isValidField(nisn) ||
      !isValidField(asalSekolah) ||
      !isValidField(pilihanJurusan) ||
      !isValidField(whatsapp) ||
      !/^\d{10}$/.test(nisn) // NISN wajib 10 digit angka
    ) {
      return NextResponse.json(
        { success: false, error: "Data pendaftar tidak valid." },
        { status: 400 }
      );
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      return NextResponse.json(
        { success: false, error: "Telegram Token / Chat ID belum terpasang di .env.local" },
        { status: 500 }
      );
    }

    // Pesan dibangun di SERVER dari field yang udah divalidasi, bukan dari
    // string bebas kiriman client — jadi client nggak bisa nentuin bentuk
    // akhir pesannya sama sekali, cuma bisa ngisi field yang disediain.
    const cleanWa = whatsapp.startsWith("0") ? "62" + whatsapp.slice(1) : whatsapp;

    const message = `
🎓 <b>ADA PENDAFTAR SPMB BARU!</b>
--------------------------------------------
   <b>No. Registrasi:</b> <code>${body.noRegistrasi || '-'}</code>
👤 <b>Nama:</b> ${escapeHtml(namaLengkap)}
🆔 <b>NISN:</b> <code>${escapeHtml(nisn)}</code>
🏫 <b>Asal Sekolah:</b> ${escapeHtml(asalSekolah)}
📚 <b>Jurusan:</b> ${escapeHtml(pilihanJurusan)}
⭐ <b>Program Unggulan:</b> ${escapeHtml(programUnggulan || "Belum Memilih")}
🎨 <b>Ekskul Minat:</b> ${escapeHtml(ekstrakurikuler || "Belum Memilih")}
--------------------------------------------
📱 <b>WhatsApp Siswa:</b> <a href="https://wa.me/${encodeURIComponent(cleanWa)}">https://wa.me/${escapeHtml(cleanWa)}</a>
🔗 <a href="https://smkalkaaffah.sch.id/admin/ppdb">Buka Dashboard Admin PPDB</a>

<i>Sistem Otomatis SPMB SMK Al Kaaffah</i>
`;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    const data = await response.json();
    return NextResponse.json({ success: data.ok, data });
  } catch (error: any) {
    console.error("🔥 CRASH DI ROUTE TELEGRAM:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}