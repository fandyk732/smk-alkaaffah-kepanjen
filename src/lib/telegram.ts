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

// Kirim data pendaftar TERSTRUKTUR ke API route — bukan string HTML jadi.
// Pesan Telegram-nya dibangun di server (src/app/api/telegram/route.ts),
// biar client nggak pernah bisa nentuin isi pesan bot secara bebas.
export async function sendTelegramNotification(data: PendaftarNotifPayload) {
  try {
    const response = await fetch("/api/telegram", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error("Gagal terhubung ke API Telegram local route. Status:", response.status);
      return { success: false };
    }

    const result = await response.json();
    if (!result.success) {
      console.error("Gagal kirim notif Telegram:", result.error || result);
    }
    return result;
  } catch (error) {
    console.error("Error mengirim notifikasi Telegram:", error);
    return { success: false };
  }
}