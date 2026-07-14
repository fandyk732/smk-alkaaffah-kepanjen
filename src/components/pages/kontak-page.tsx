"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, MessageCircle, Send, Instagram, Facebook, Youtube } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion-primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { school } from "@/data/site";

export function KontakPage() {
  const [sending, setSending] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Pesan terkirim! Kami akan segera menghubungi Anda.");
      (e.target as HTMLFormElement).reset();
    }, 900);
  };

  const contacts = [
    { icon: MapPin, t: "Alamat", d: school.address },
    { icon: Phone, t: "Telepon", d: school.phone },
    { icon: Mail, t: "Email", d: school.email },
  ];

  return (
    <>
      <PageHero eyebrow="Kontak" title="Hubungi kami" description="Punya pertanyaan? Tim kami siap membantu Anda." />

      <section className="container-page py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="space-y-4">
              {contacts.map((c) => (
                <div key={c.t} className="flex gap-4 rounded-2xl border bg-card p-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary"><c.icon className="h-5 w-5" /></span>
                  <div>
                    <p className="font-semibold">{c.t}</p>
                    <p className="text-sm text-muted-foreground">{c.d}</p>
                  </div>
                </div>
              ))}

              <a href={`https://wa.me/${school.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-primary p-4 font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.01]">
                <MessageCircle className="h-5 w-5" /> Chat via WhatsApp
              </a>

              <div className="flex gap-2 pt-2">
                <a href={school.socials.instagram} aria-label="Instagram" className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"><Instagram className="h-5 w-5" /></a>
                <a href={school.socials.facebook} aria-label="Facebook" className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"><Facebook className="h-5 w-5" /></a>
                <a href={school.socials.youtube} aria-label="YouTube" className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"><Youtube className="h-5 w-5" /></a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border bg-card p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Nama</Label>
                  <Input id="name" required placeholder="Nama lengkap" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required placeholder="email@contoh.com" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subject">Subjek</Label>
                <Input id="subject" required placeholder="Perihal pesan" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">Pesan</Label>
                <Textarea id="message" required rows={5} placeholder="Tulis pesan Anda..." />
              </div>
              <Button type="submit" disabled={sending} className="w-full bg-gradient-primary">
                {sending ? "Mengirim..." : <>Kirim Pesan <Send className="ml-1 h-4 w-4" /></>}
              </Button>
            </form>
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-8 overflow-hidden rounded-2xl border">
            <iframe src={school.maps} title="Lokasi sekolah" loading="lazy" className="h-80 w-full" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </Reveal>
      </section>
    </>
  );
}
