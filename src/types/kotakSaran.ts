// src/types/kotakSaran.ts
import { z } from "zod";

export interface KotakSaran {
  id?: string;
  isAnonim: boolean;
  nama?: string;
  whatsapp?: string;
  kategori: "fasilitas" | "pembelajaran" | "ekskul" | "pelayanan" | "lainnya";
  subjek: string;
  pesan: string;
  status: "baru" | "diproses" | "selesai" | "diarsipkan";
  createdAt: any;
}

export const kotakSaranSchema = z.object({
  isAnonim: z.boolean(),
  nama: z.string().optional().default("Anonim"),
  whatsapp: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return "";
      let cleaned = val.replace(/\D/g, "");
      if (cleaned.startsWith("62")) cleaned = "0" + cleaned.slice(2);
      return cleaned;
    }),
  kategori: z.enum(["fasilitas", "pembelajaran", "ekskul", "pelayanan", "lainnya"]),
  subjek: z.string().min(3, "Subjek minimal 3 karakter").max(100, "Subjek maksimal 100 karakter"),
  pesan: z.string().min(10, "Pesan/Saran minimal 10 karakter").max(1000, "Pesan maksimal 1000 karakter"),
  website_confirm: z.string().optional(),
});