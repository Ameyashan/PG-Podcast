"use client";

import { motion } from "framer-motion";

const PARTS: { text: string; accent?: boolean }[] = [
  { text: "The" },
  { text: "essays" },
  { text: "you" },
  { text: "keep" },
  { text: "meaning" },
  { text: "to" },
  { text: "read,", accent: false },
  { text: "finally", accent: true },
  { text: "finished.", accent: true },
];

export function AnimatedHeadline() {
  return (
    <h1 className="mt-3 text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05]">
      {PARTS.map((p, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.15 + i * 0.06, duration: 0.55, ease: [0.21, 0.47, 0.32, 0.99] }}
          className={`inline-block mr-[0.22em] ${p.accent ? "text-[color:var(--accent)] italic" : ""}`}
        >
          {p.text}
        </motion.span>
      ))}
    </h1>
  );
}
