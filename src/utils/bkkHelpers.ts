// 🛡️ Helper untuk menyaring & memvalidasi URL CV secara aman
export const getSafeCvUrl = (url?: string): string | null => {
  if (!url || typeof url !== "string") return null;

  try {
    const parsedUrl = new URL(url.trim());

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return null;
    }

    const allowedDomains = [
      "drive.google.com",
      "docs.google.com",
      "dropbox.com",
      "onedrive.live.com",
      "firebasestorage.googleapis.com",
      "vercel-storage.com",
    ];

    const isAllowed = allowedDomains.some((domain) =>
      parsedUrl.hostname.endsWith(domain)
    );

    if (!isAllowed) return null;

    return parsedUrl.href;
  } catch {
    return null;
  }
};

// Helper Format Nomor WhatsApp (08123... -> 628123...)
export const formatWaNumber = (phone?: string): string => {
  if (!phone) return "";
  let clean = phone.replace(/[^0-9]/g, "");
  if (clean.startsWith("0")) {
    clean = "62" + clean.slice(1);
  }
  return clean;
};