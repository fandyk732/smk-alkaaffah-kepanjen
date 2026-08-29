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

export async function sendTelegramNotification(data: PendaftarNotifPayload) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // Cek apakah env terpasang
  if (!botToken || !chatId) {
    console.error("❌ Telegram Env Missing: TELEGRAM_BOT_TOKEN atau TELEGRAM_CHAT_ID belum diset di .env.local");
    return { success: false, error: "Env not configured" };
  }

  // Format pesan Telegram
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

    console.log("✅ Pesan Telegram berhasil dikirim!");
    return { success: true };
  } catch (error) {
    console.error("❌ Catch Error Telegram:", error);
    return { success: false, error };
  }
}