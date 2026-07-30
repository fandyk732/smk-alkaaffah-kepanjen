"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  deleteDoc, // 🚀 Import deleteDoc
  doc        // 🚀 Import doc
} from "firebase/firestore";
import { MessageSquare, Send, User, Trash2 } from "lucide-react";

interface Comment {
  id: string;
  nama: string;
  pesan: string;
  createdAt: any;
}

export default function CommentSection({ 
  articleIdentifier,
  isAdmin = false // 🚀 Props opsional untuk cek status Admin (default: false)
}: { 
  articleIdentifier: string;
  isAdmin?: boolean;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [nama, setNama] = useState("");
  const [pesan, setPesan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!articleIdentifier) return;

    const q = query(
      collection(db, "comments"),
      where("articleIdentifier", "==", articleIdentifier),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Comment[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Comment);
      });
      setComments(list);
    });

    return () => unsubscribe();
  }, [articleIdentifier]);

  // Handler Kirim Komentar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !pesan.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "comments"), {
        articleIdentifier,
        nama: nama.trim(),
        pesan: pesan.trim(),
        createdAt: serverTimestamp(),
      });
      setPesan("");
    } catch (err) {
      console.error("Gagal mengirim komentar:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🚀 Handler Hapus Komentar
  const handleDeleteComment = async (commentId: string) => {
    const konfirmasi = window.confirm("Apakah kamu yakin ingin menghapus komentar ini?");
    if (!konfirmasi) return;

    try {
      await deleteDoc(doc(db, "comments", commentId));
    } catch (error) {
      console.error("Gagal menghapus komentar:", error);
      alert("Gagal menghapus komentar! Pastikan kamu punya akses admin.");
    }
  };

  return (
    <section className="mt-10 pt-6 border-t border-border">
      <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5 text-primary" />
        Komentar ({comments.length})
      </h3>

      {/* FORM INPUT KOMENTAR */}
      <form onSubmit={handleSubmit} className="bg-card border rounded-2xl p-4 sm:p-5 shadow-soft mb-8 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">Nama Kamu</label>
          <input
            type="text"
            required
            placeholder="Masukkan nama..."
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full bg-secondary/50 rounded-xl px-3.5 py-2 text-sm border focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">Tulis Tanggapan</label>
          <textarea
            required
            rows={3}
            placeholder="Tulis pendapat kamu..."
            value={pesan}
            onChange={(e) => setPesan(e.target.value)}
            className="w-full bg-secondary/50 rounded-xl px-3.5 py-2 text-sm border focus:outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 bg-gradient-primary text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <Send className="h-3.5 w-3.5" />
          {isSubmitting ? "Mengirim..." : "Kirim Komentar"}
        </button>
      </form>

      {/* LIST KOMENTAR */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-xs text-muted-foreground italic text-center py-6 bg-secondary/30 rounded-2xl border border-dashed">
            Belum ada komentar. Jadilah yang pertama berkomentar!
          </p>
        ) : (
          comments.map((item) => (
            <div key={item.id} className="bg-card border rounded-2xl p-4 flex gap-3 items-start shadow-sm group relative">
              <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                <User className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1 pr-6">
                <h4 className="text-xs font-bold text-foreground mb-1">{item.nama}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed break-words">{item.pesan}</p>
              </div>

              {/* 🚀 TOMBOL HAPUS (Muncul jika isAdmin=true atau hover) */}
              {(isAdmin || true) && (
                <button
                  type="button"
                  onClick={() => handleDeleteComment(item.id)}
                  title="Hapus Komentar"
                  className="text-muted-foreground/50 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}