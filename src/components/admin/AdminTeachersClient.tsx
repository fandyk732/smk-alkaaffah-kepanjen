"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { supabase } from "@/lib/supabase"; // Menggunakan client supabase terpusat dari lib/supabase
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, 
  onSnapshot, query, orderBy, serverTimestamp 
} from "firebase/firestore";
import { Trash2, Edit, Plus, Loader2, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Teacher {
  id: string;
  name: string;
  role: string;
  type: string;
  quote: string;
  photoUrl: string;
}

export function AdminTeachersClient() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [type, setType] = useState("produktif");
  const [quote, setQuote] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState("");

  // Realtime Fetch Data Guru
  useEffect(() => {
    const q = query(collection(db, "teachers"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Teacher[];
      setTeachers(docs);
    });
    return () => unsubscribe();
  }, []);

  // Upload Foto ke Supabase Storage
  const uploadPhotoToSupabase = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `guru_${Date.now()}.${fileExt}`;
    const filePath = `teachers/${fileName}`;

    const { error } = await supabase.storage
      .from("school-assets")
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("school-assets")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  // Handle Create / Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalPhotoUrl = currentPhotoUrl;

      if (photoFile) {
        finalPhotoUrl = await uploadPhotoToSupabase(photoFile);
      }

      const payload = {
        name,
        role,
        type,
        quote,
        photoUrl: finalPhotoUrl,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, "teachers", editingId), payload);
      } else {
        await addDoc(collection(db, "teachers"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      }

      resetForm();
    } catch (err) {
      console.error("Gagal menyimpan data:", err);
      alert("Gagal menyimpan data! Periksa koneksi atau izin role akun.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit Click
  const handleEdit = (t: Teacher) => {
    setEditingId(t.id);
    setName(t.name);
    setRole(t.role);
    setType(t.type || "produktif");
    setQuote(t.quote || "");
    setCurrentPhotoUrl(t.photoUrl || "");
    setPhotoFile(null);
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus data guru ini?")) return;
    try {
      await deleteDoc(doc(db, "teachers", id));
    } catch (err) {
      console.error("Gagal menghapus:", err);
      alert("Gagal menghapus data guru!");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setRole("");
    setType("produktif");
    setQuote("");
    setPhotoFile(null);
    setCurrentPhotoUrl("");
  };

  return (
    <div className="space-y-8 min-w-0 text-foreground">
      {/* FORM INPUT / EDIT */}
      <form onSubmit={handleSubmit} className="p-6 border border-border rounded-2xl bg-card shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-card-foreground">
            {editingId ? "Edit Data Guru" : "Tambah Guru Baru"}
          </h3>
          {editingId && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">
              Mode Edit
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Nama Lengkap & Gelar *
            </label>
            <input
              type="text"
              placeholder="mis: Bpk. Ahmad, S.Pd"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-input rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Jabatan / Mapel *
            </label>
            <input
              type="text"
              placeholder="mis: Guru Produktif RPL / Kesiswaan"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full px-4 py-2 border border-input rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Kategori / Tipe
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="pimpinan_kepsek">Kepala Sekolah</option>
              <option value="pimpinan_wakepsek">Wakil Kepala Sekolah</option>
              <option value="produktif">Guru Produktif (Kejuruan)</option>
              <option value="normatif_adaptif">Guru Normatif / Adaptif</option>
              <option value="staf">Staf & Tenaga Kependidikan</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Foto Guru (Upload ke Supabase)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-1 border border-input rounded-xl bg-background text-foreground text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>
        </div>

        {/* Preview Foto Jika Ada */}
        {(currentPhotoUrl || photoFile) && (
          <div className="flex items-center gap-3 p-2 border border-border rounded-xl bg-muted/40 text-xs text-muted-foreground">
            <ImageIcon className="h-4 w-4 text-primary" />
            <span>
              {photoFile ? `Foto baru dipilih: ${photoFile.name}` : "Foto tersimpan di server"}
            </span>
            {currentPhotoUrl && !photoFile && (
              <img src={currentPhotoUrl} alt="Preview" className="h-8 w-8 rounded-full object-cover ml-auto" />
            )}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">
            Quote / Motto Mengajar
          </label>
          <textarea
            placeholder="mis: Mendidik dengan hati, menginspirasi dengan karya."
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border border-input rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex gap-2 justify-end pt-2">
          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm} className="rounded-xl">
              <X className="h-4 w-4 mr-1" /> Batal
            </Button>
          )}
          <Button type="submit" disabled={loading} className="rounded-xl">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            {editingId ? "Update Data Guru" : "Simpan Data Guru"}
          </Button>
        </div>
      </form>

      {/* TABEL LIST GURU */}
      <div className="border border-border rounded-2xl bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
          <h4 className="font-bold text-sm text-card-foreground">
            Daftar Guru & Staf ({teachers.length})
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="p-4">Foto</th>
                <th className="p-4">Nama</th>
                <th className="p-4">Jabatan</th>
                <th className="p-4">Tipe</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {teachers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground text-sm">
                    Belum ada data guru. Silakan tambah data baru di atas.
                  </td>
                </tr>
              ) : (
                teachers.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      {t.photoUrl ? (
                        <img src={t.photoUrl} alt={t.name} className="h-10 w-10 rounded-full object-cover border border-border" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary grid place-items-center font-bold text-sm border border-primary/20">
                          {t.name ? t.name.charAt(0).toUpperCase() : "G"}
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-semibold text-foreground">{t.name}</td>
                    <td className="p-4 text-muted-foreground">{t.role}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground capitalize">
                        {t.type}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(t)} className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(t.id)} className="h-8 w-8 p-0">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}