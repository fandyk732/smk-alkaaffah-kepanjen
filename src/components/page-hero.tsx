"use client";

import { motion } from "framer-motion";

export function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="container-page py-12 text-center">
      <motion.span
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-foreground"
      >
        {eyebrow}
      </motion.span>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl"
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="mx-auto mt-4 max-w-2xl text-muted-foreground"
      >
        {description}
      </motion.p>
    </section>
  );
}
