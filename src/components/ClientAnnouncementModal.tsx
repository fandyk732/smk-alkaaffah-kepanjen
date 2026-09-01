"use client";

import dynamic from "next/dynamic";

// ⚡ Opsi ssr: false aman dipakai di sini karena file ini adalah Client Component
const AnnouncementModal = dynamic(
  () => import("@/components/AnnouncementModal"),
  { ssr: false }
);

export default function ClientAnnouncementModal() {
  return <AnnouncementModal />;
}