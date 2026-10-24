import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sanitizeWhatsApp = (value: string): string => {
  // 1. Ambil hanya karakter angka (+, spasi, strip, tanda kurung dibuang)
  let cleaned = value.replace(/\D/g, "");

  // 2. Jika user copas format internasional "628...", ubah awalan jadi "08..."
  if (cleaned.startsWith("62")) {
    cleaned = "0" + cleaned.slice(2);
  }

  return cleaned;
};