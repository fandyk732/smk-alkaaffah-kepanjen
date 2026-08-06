const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

initializeApp();
const db = getFirestore();

// Rate limit sederhana: maksimal 8 percobaan per IP per 10 menit.
// Ini nyegah brute-force nyoba-nyoba nebak NISN orang lain secara masif.
const RATE_LIMIT_MAX_ATTEMPTS = 8;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 menit

async function cekDanCatatRateLimit(ip) {
  const ref = db.collection("_rateLimits").doc(`ppdb_${ip}`);
  const now = Date.now();

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.exists ? snap.data() : null;

    if (!data || now - data.windowStart > RATE_LIMIT_WINDOW_MS) {
      // Window baru
      tx.set(ref, { windowStart: now, count: 1 });
      return;
    }

    if (data.count >= RATE_LIMIT_MAX_ATTEMPTS) {
      throw new HttpsError(
        "resource-exhausted",
        "Terlalu banyak percobaan. Coba lagi beberapa menit lagi."
      );
    }

    tx.update(ref, { count: FieldValue.increment(1) });
  });
}

exports.cekStatusPpdb = onCall({ region: "asia-southeast2" }, async (request) => {
  const nisn = (request.data?.nisn || "").toString().trim();

  if (!/^\d{10}$/.test(nisn)) {
    throw new HttpsError("invalid-argument", "NISN harus berupa 10 digit angka.");
  }

  // Best-effort rate limit per IP (rawRequest tersedia di Cloud Functions v2 onCall)
  const ip =
    request.rawRequest?.headers?.["x-forwarded-for"]?.toString().split(",")[0]?.trim() ||
    request.rawRequest?.ip ||
    "unknown";
  await cekDanCatatRateLimit(ip);

  // docId koleksi "ppdb" = NISN (lihat perubahan setDoc di form-ppdb.tsx),
  // jadi ini getDoc langsung, bukan query where().
  const docRef = db.collection("ppdb").doc(nisn);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    throw new HttpsError("not-found", "NISN tidak terdaftar di sistem SPMB.");
  }

  const data = docSnap.data();

  // 🔑 INI INTINYA: cuma field yang MEMANG boleh publik lihat yang di-return.
  // whatsapp, createdAt, dan field internal lain SENGAJA nggak diikutkan.
  return {
    namaLengkap: data.namaLengkap || "",
    nisn: nisn,
    asalSekolah: data.asalSekolah || "",
    pilihanJurusan: data.pilihanJurusan || "",
    statusPendaftaran: data.statusPendaftaran || "Menunggu Verifikasi",
  };
});