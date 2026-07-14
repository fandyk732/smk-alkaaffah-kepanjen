"use client";

export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute -left-32 top-10 h-80 w-80 animate-float-slow rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute right-[-6rem] top-40 h-96 w-96 animate-float-slower rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute bottom-10 left-1/3 h-72 w-72 animate-blob bg-secondary/40 blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          color: "var(--color-foreground)",
        }}
      />
    </div>
  );
}
