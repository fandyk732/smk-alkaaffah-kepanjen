// src/app/api/kotak-saran/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { kotakSaranSchema } from "@/types/kotakSaran";
import { sendTelegramKotakSaranNotification } from "@/lib/telegram"; // 🟢 Import fungsi notif

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parseResult = kotakSaranSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { message: "Validasi gagal", errors: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Honeypot check
    if (data.website_confirm && data.website_confirm.trim() !== "") {
      return NextResponse.json(
        { success: true, message: "Saran berhasil dikirim" },
        { status: 200 }
      );
    }

    // 1. Simpan ke Firestore
    const docRef = await addDoc(collection(db, "kotak_saran"), {
      isAnonim: data.isAnonim,
      nama: data.isAnonim ? "Anonim" : data.nama || "Anonim",
      whatsapp: data.isAnonim ? "" : data.whatsapp || "",
      kategori: data.kategori,
      subjek: data.subjek,
      pesan: data.pesan,
      status: "baru",
      createdAt: serverTimestamp(),
    });

    // 2. 🟢 Kirim Notifikasi Telegram (Non-blocking / Async)
    await sendTelegramKotakSaranNotification({
      isAnonim: data.isAnonim,
      nama: data.nama,
      whatsapp: data.whatsapp,
      kategori: data.kategori,
      subjek: data.subjek,
      pesan: data.pesan,
    }).catch((err) => console.error("Error async telegram notification:", err));

    return NextResponse.json({
      success: true,
      message: "Terima kasih! Saran kamu berhasil terkirim.",
      id: docRef.id,
    });
  } catch (error: any) {
    console.error("Error submitting kotak saran:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan sistem. Silakan coba lagi nanti." },
      { status: 500 }
    );
  }
}