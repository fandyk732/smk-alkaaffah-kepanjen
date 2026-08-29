import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// 🎯 Schema Validasi Zod disesuaikan dengan AlumniFormState
const alumniSchema = z.object({
  nama: z
    .string()
    .min(3, "Nama minimal 3 karakter")
    .max(100, "Nama terlalu panjang")
    .trim(),
  angkatan: z
    .string()
    .regex(/^[0-9]{4}$/, "Angkatan harus berupa tahun 4 digit (misal: 2026)"),
  jurusan: z
    .enum(["TKJ", "TAV", "TKR", "DM"], { message: "Jurusan tidak valid" }),
  status: z
    .enum(["Bekerja", "Kuliah", "Wirausaha", "Mencari Kerja"], {
      message: "Status tidak valid",
    }),
  tempat: z.string().optional().default(""),
  posisi: z.string().optional().default(""),
  whatsapp: z
    .string()
    .refine((val) => val === "" || /^[0-9]{10,15}$/.test(val), {
      message: "Nomor WhatsApp tidak valid (10-15 digit)",
    })
    .optional()
    .default(""),
  testimoni: z.string().max(500, "Testimoni maksimal 500 karakter").optional().default(""),
  token: z.string().min(1, "Token Captcha tidak ditemukan"), // Turnstile Token
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Validasi Zod
    const validation = alumniSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: "Validasi gagal", errors: validation.error.flatten() },
        { status: 400 }
      );
    }

    const {
      nama,
      angkatan,
      jurusan,
      status,
      tempat,
      posisi,
      whatsapp,
      testimoni,
      token,
    } = validation.data;

    // 2. Verifikasi Turnstile ke Cloudflare
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

    // 3. Simpan ke Firestore
    const docRef = await addDoc(collection(db, "alumni"), {
      nama,
      angkatan,
      jurusan,
      status,
      tempat: status === "Mencari Kerja" ? "-" : tempat,
      posisi: status === "Bekerja" ? posisi : "-",
      whatsapp,
      testimoni,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      message: "Data alumni berhasil disimpan!",
      id: docRef.id,
    });
  } catch (err: any) {
    console.error("Error Alumni Route:", err);
    return NextResponse.json(
      { message: "Terjadi kesalahan sistem saat menyimpan data alumni." },
      { status: 500 }
    );
  }
}