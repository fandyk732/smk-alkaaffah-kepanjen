// lib/telegram.ts

interface PendaftarNotifPayload {
  noRegistrasi?: string;
  namaLengkap: string;
  nisn: string;
  asalSekolah: string;
  pilihanJurusan: string;
  programUnggulan?: string;
  ekstrakurikuler?: string;
  whatsapp: string;
}

// 🟢 Interface Notif Kotak Saran Baru
interface KotakSaranNotifPayload {
  isAnonim: boolean;
  nama?: string;
  whatsapp?: string;
  kategori: string;
  subjek: string;
  pesan: string;
}

export async function sendTelegramNotification(data: PendaftarNotifPayload) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error("❌ Telegram Env Missing: TELEGRAM_BOT_TOKEN atau TELEGRAM_CHAT_ID belum diset di .env.local");
    return { success: false, error: "Env not configured" };
  }

  const message = `
🚨 *PENDAFTARAN PPDB BARU!* 🚨

📝 *No. Registrasi:* \`${data.noRegistrasi || "-"}\`
👤 *Nama:* ${data.namaLengkap}
🔢 *NISN:* ${data.nisn}
🏫 *Asal Sekolah:* ${data.asalSekolah}
🎓 *Jurusan:* ${data.pilihanJurusan}
⭐ *Program Unggulan:* ${data.programUnggulan || "-"}
🎨 *Ekstrakurikuler:* ${data.ekstrakurikuler || "-"}
📱 *WhatsApp:* [${data.whatsapp}](https://wa.me/${data.whatsapp.replace(/[^0-9]/g, "")})

_Mohon segera diproses oleh Panitia PPDB._
  `.trim();

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    const result = await res.json();
    if (!res.ok || !result.ok) {
      console.error("❌ Telegram Bot API Error:", result);
      return { success: false, error: result.description };
    }

    console.log("✅ Pesan Telegram PPDB berhasil dikirim!");
    return { success: true };
  } catch (error) {
    console.error("❌ Catch Error Telegram:", error);
    return { success: false, error };
  }
}

// 🟢 FUNGSI BARU: NOTIFIKASI KOTAK SARAN AUTOMATION
export async function sendTelegramKotakSaranNotification(data: KotakSaranNotifPayload) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  // Gunakan TELEGRAM_CHAT_ID_SARAN jika ada grup khusus admin saran, atau fallback ke TELEGRAM_CHAT_ID utama
  const chatId = process.env.TELEGRAM_CHAT_ID_SARAN || process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error("❌ Telegram Env Missing: Token atau Chat ID belum diset.");
    return { success: false, error: "Env not configured" };
  }

  // Sanitasi nomor WA untuk link klik otomatis
  const waClean = data.whatsapp ? data.whatsapp.replace(/[^0-9]/g, "") : "";
  const infoPengirim = data.isAnonim
    ? "👻 *Pengirim:* Anonim"
    : `👤 *Pengirim:* ${data.nama || "Tanpa Nama"}\n📱 *WhatsApp:* ${
        waClean ? `[${data.whatsapp}](https://wa.me/62${waClean.replace(/^0/, "")})` : "-"
      }`;

  const message = `
📩 *ASPIRASI / SARAN BARU!* 📩
━━━━━━━━━━━━━━━━━━
📌 *Kategori:* ${data.kategori.toUpperCase()}
${infoPengirim}

📝 *Subjek:*
*${data.subjek}*

💬 *Detail Pesan:*
_"${data.pesan}"_
━━━━━━━━━━━━━━━━━━
⚡ _Mohon segera ditinjau via Dashboard Admin Kotak Saran._
  `.trim();

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });

    const result = await res.json();
    if (!res.ok || !result.ok) {
      console.error("❌ Telegram Bot API Error (Kotak Saran):", result);
      return { success: false, error: result.description };
    }

    console.log("✅ Notifikasi Telegram Kotak Saran berhasil dikirim!");
    return { success: true };
  } catch (error) {
    console.error("❌ Catch Error Telegram (Kotak Saran):", error);
    return { success: false, error };
  }
}