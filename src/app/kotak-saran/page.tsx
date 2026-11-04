import React from "react";
import { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion-primitives";
import { FormKotakSaran } from "@/components/kotak-saran-form"; // Sesuaikan path komponen jika berbeda
import { Shield, Sparkles, MessageSquareHeart } from "lucide-react";

export const metadata: Metadata = {
  title: "Kotak Saran & Aspirasi | SMK Al-Kaaffah",
  description: "Wadah penyampaian masukan, kritik, dan aspirasi demi kemajuan kualitas pelayanan serta pendidikan di SMK Al-Kaaffah.",
};

export default function KotakSaranPage() {
  return (
    <>
      <PageHero
        eyebrow="Aspirasi & Layanan Publik"
        title="Kotak Saran Online"
        description="Suara dan masukan kamu sangat berharga untuk membangun lingkungan sekolah yang lebih baik, transparan, dan nyaman."
      />

      <section className="container-page py-12">
        <div className="mx-auto max-w-4xl space-y-10">
          {/* Info Card Pengantar */}
          <Reveal>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col items-center rounded-2xl border bg-card p-5 text-center shadow-soft">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Shield className="h-5 w-5" />
                </div>
                <h4 className="mt-3 text-sm font-semibold">100% Aman & Anonim</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Bebas menyampaikan masukan tanpa ragu dengan opsi pengiriman anonim.
                </p>
              </div>

              <div className="flex flex-col items-center rounded-2xl border bg-card p-5 text-center shadow-soft">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MessageSquareHeart className="h-5 w-5" />
                </div>
                <h4 className="mt-3 text-sm font-semibold">Respon & Evaluasi</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Setiap saran yang masuk ditinjau secara berkala oleh tim manajemen sekolah.
                </p>
              </div>

              <div className="flex flex-col items-center rounded-2xl border bg-card p-5 text-center shadow-soft">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h4 className="mt-3 text-sm font-semibold">Peningkatan Berkelanjutan</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Kritik membangun membantu meningkatkan kualitas sarana dan pembelajaran.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Form Kotak Saran */}
          <Reveal delay={0.1}>
            <div className="mx-auto max-w-2xl">
              <FormKotakSaran />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}