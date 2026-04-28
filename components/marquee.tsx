"use client";

import { motion } from "framer-motion";

export function Marquee({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  const loop = [...items, ...items];
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-6 overflow-hidden opacity-[0.07] dark:opacity-[0.12]"
    >
      <motion.div
        className="flex whitespace-nowrap text-7xl sm:text-8xl font-semibold tracking-tighter"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      >
        {loop.map((t, i) => (
          <span key={i} className="mx-8">
            {t} ·
          </span>
        ))}
      </motion.div>
    </div>
  );
}
