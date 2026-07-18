import Image from "next/image";

export function LogoSmkIcon({ className }: { className?: string }) {
  return (
    <Image 
      src="/logo-smk.svg" // Ini otomatis ngebaca folder public
      alt="Logo SMK" 
      width={1482} 
      height={1816} 
      className={className} 
      priority // Biar loading logonya cepat dan gak kedap-kedip
    />
  );
}