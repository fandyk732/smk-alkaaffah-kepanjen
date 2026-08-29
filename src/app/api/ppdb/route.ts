import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/firebase";
import { doc, writeBatch, serverTimestamp } from "firebase/firestore";
import { sendTelegramNotification } from "@/lib/telegram";

// 🎯 Schema Validasi Zod disesuaikan dengan FormPPDB
const ppdbSchema = z.object({
  namaLengkap: z
    .string()
    .min(3, "Nama minimal 3 karakter")
    .max(100, "Nama terlalu panjang")
    .trim(),
  nisn: z
    .string()
    .length(10, "NISN harus tepat 10 digit")
    .regex(/^[0-9]+$/, "NISN hanya boleh berisi angka"),
  asalSekolah: z
    .string()
    .min(2, "Asal sekolah wajib diisi")
    .trim(),
  whatsapp: z
    .string()
    .min(10, "Nomor WhatsApp minimal 10 digit")
    .max(15, "Nomor WhatsApp maksimal 15 digit")
    .regex(/^[0-9]+$/, "Nomor WhatsApp hanya boleh berisi angka"),
  pilihanJurusan: z
    .string()
    .min(1, "Pilihan jurusan wajib dipilih"),
  ekstrakurikuler: z.string().optional().default("Belum Memilih"),
  programUnggulan: z.string().optional().default("Belum Memilih"),
  gelombangId: z.string().optional().default("manual"),
  namaGelombang: z.string().optional().default("Umum / Tanpa Gelombang"),
  token: z.string().min(1, "Token Captcha tidak ditemukan"), // Turnstile Token
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Validasi Zod Input
    const validation = ppdbSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: "Validasi gagal", errors: validation.error.flatten() },
        { status: 400 }
      );
    }

    const {
      namaLengkap,
      nisn,
      asalSekolah,
      whatsapp,
      pilihanJurusan,
      ekstrakurikuler,
      programUnggulan,
      gelombangId,
      namaGelombang,
      token,
    } = validation.data;

    // 2. Verifikasi Turnstile Captcha ke Cloudflare
    const turnstileRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET_KEY || "",
          response: token,
        }),
      }
    );

    const turnstileData = await turnstileRes.json();
    if (!turnstileData.success) {
      return NextResponse.json(
        { message: "Verifikasi Captcha Gagal/Kadaluwarsa. Silakan coba lagi." },
        { status: 400 }
      );
    }

    // 3. Generate Nomor Registrasi & Simpan Batch ke Firestore
    const batch = writeBatch(db);
    const year = new Date().getFullYear();
    const randomDigits = Date.now().toString().slice(-6);
    const noRegistrasi = `REG-${year}-${randomDigits}`;

    // Batch Set Admin
    batch.set(doc(db, "ppdb", nisn), {
      namaLengkap,
      nisn,
      asalSekolah,
      whatsapp,
      pilihanJurusan,
      ekstrakurikuler: ekstrakurikuler || "Belum Memilih",
      programUnggulan: programUnggulan || "Belum Memilih",
      gelombangId,
      namaGelombang,
      noRegistrasi,
      statusPendaftaran: "Menunggu Verifikasi",
      createdAt: serverTimestamp(),
    });

    // Batch Set Public
    batch.set(doc(db, "ppdb_public", nisn), {
      namaLengkap,
      nisn,
      noRegistrasi,
      asalSekolah,
      pilihanJurusan,
      gelombangId,
      namaGelombang,
      statusPendaftaran: "Menunggu Verifikasi",
    });

    await batch.commit();

    // 4. Notifikasi Telegram Panitia
    try {
      const telegramResult = await sendTelegramNotification({
        noRegistrasi,
        namaLengkap,
        nisn,
        asalSekolah,
        pilihanJurusan,
        programUnggulan: programUnggulan || "Belum Memilih",
        ekstrakurikuler: ekstrakurikuler || "Belum Memilih",
        whatsapp,
      });

      if (!telegramResult?.success) {
        console.warn("⚠️ Warning Telegram:", telegramResult?.error);
      }
    } catch (telegramErr) {
      console.error("❌ Catch Error mengirim notif Telegram:", telegramErr);
    }

    return NextResponse.json({
      success: true,
      message: "Pendaftaran berhasil!",
      data: {
        noRegistrasi,
        namaLengkap,
        nisn,
        pilihanJurusan,
        asalSekolah,
        whatsapp,
      },
    });
  } catch (err: any) {
    console.error("Error PPDB Route:", err);
    if (err?.code === "permission-denied") {
      return NextResponse.json(
        { message: "NISN ini sudah pernah terdaftar sebelumnya." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Terjadi kesalahan sistem saat memproses pendaftaran." },
      { status: 500 }
    );
  }
}