import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { GelombangSPMB } from "@/types/gelombang";

const COLLECTION_NAME = "gelombang_spmb";

// 1. Ambil Semua Gelombang (untuk Admin)
export const getAllGelombang = async (): Promise<GelombangSPMB[]> => {
  const q = query(collection(db, COLLECTION_NAME), orderBy("tanggalMulai", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as GelombangSPMB));
};

// 2. Ambil Gelombang yang Sedang Aktif Hari Ini (untuk Form Publik)
export const getGelombangAktif = async (): Promise<GelombangSPMB | null> => {
  const today = new Date().toISOString().split("T")[0]; // Tanggal hari ini (YYYY-MM-DD)
  
  // Prioritas 1: Ambil gelombang yang flag isActive = true
  const q = query(
    collection(db, COLLECTION_NAME),
    where("isActive", "==", true)
  );
  
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  // Filter tambahan berdasarkan rentang tanggal jika ada
  const activeGel = snapshot.docs
    .map((d) => ({ id: d.id, ...d.data() } as GelombangSPMB))
    .find((g) => g.tanggalMulai <= today && g.tanggalSelesai >= today);

  // Jika tidak ada yang pas tanggalnya, ambil gelombang pertama yang di-flag isActive
  return activeGel || ({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as GelombangSPMB);
};

// 3. Tambah Gelombang Baru
export const addGelombang = async (data: Omit<GelombangSPMB, "id">) => {
  return await addDoc(collection(db, COLLECTION_NAME), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

// 4. Update Gelombang
export const updateGelombang = async (id: string, data: Partial<GelombangSPMB>) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  return await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

// 5. Hapus Gelombang
export const deleteGelombang = async (id: string) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  return await deleteDoc(docRef);
};

// 6. Set Saklar Aktif (Hanya 1 gelombang yang boleh aktif)
export const setActiveGelombangOnly = async (gelombangList: GelombangSPMB[], activeId: string) => {
  for (const g of gelombangList) {
    const isTarget = g.id === activeId;
    if (g.isActive !== isTarget) {
      await updateGelombang(g.id, { isActive: isTarget });
    }
  }
};