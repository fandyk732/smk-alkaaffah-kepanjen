"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push("/berita");
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="mb-6"
      onClick={handleBack}
    >
      <ArrowLeft className="mr-1 h-4 w-4" /> Semua berita
    </Button>
  );
}