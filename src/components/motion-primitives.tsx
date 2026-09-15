"use client";

import { motion, useInView, useMotionValue, useSpring, type Variants } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants: Variants = {
  hidden: { opacity: 0, y: 15 }, // 🚀 Diturunkan ke 15px agar jarak render GPU lebih pendek & cepat
  visible: { opacity: 1, y: 0 },
};

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20px" }} // 🚀 Ringan & aman untuk scroll mobile
      transition={{ duration: 0.35, delay, ease: [0.21, 0.47, 0.32, 0.98] }} // 🚀 Durasi dipersingkat ke 0.35s
      style={{
        willChange: "transform, opacity",
        transform: "translateZ(0)", // 🚀 Hardware Acceleration paksa GPU (Ringan di CPU HP jadul)
      }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left")}>
      {eyebrow && (
        <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-foreground">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base text-muted-foreground">{description}</p>}
    </Reveal>
  );
}

export function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { damping: 40, stiffness: 90 });

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, value, mv]);

  useEffect(() => {
    return spring.on("change", (v) => {
      // 🚀 Bungkus update DOM dengan requestAnimationFrame agar FPS tidak drop di HP RAM 2GB
      requestAnimationFrame(() => {
        if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`;
      });
    });
  }, [spring, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}