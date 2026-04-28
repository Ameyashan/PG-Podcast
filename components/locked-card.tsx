"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export function LockedCard({
  rank,
  slug,
  title,
  onWaitlist,
}: {
  rank: number;
  slug: string;
  title: string;
  onWaitlist: (slug: string, title: string) => void;
}) {
  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0 },
      }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className="group relative"
    >
      <div className="relative flex items-center gap-5 rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--card)]/60 px-5 py-4 cursor-default select-none overflow-hidden transition-colors hover:border-[color:var(--accent)]/40">
        {/* Shimmer sweep across the card */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-[1200ms] ease-out"
        />

        <span className="w-8 text-right font-mono text-sm text-[color:var(--muted)]/70">
          {String(rank).padStart(2, "0")}
        </span>
        <div className="flex-1 min-w-0">
          <h3
            className="font-medium text-base sm:text-lg leading-tight truncate transition-all duration-500 group-hover:blur-[3px]"
            style={{ filter: "blur(7px)" }}
          >
            {title}
          </h3>
          <p className="mt-1 text-xs text-[color:var(--muted)] flex items-center gap-1.5">
            <Lock className="h-3 w-3" /> locked
          </p>
        </div>

        <motion.div
          initial={false}
          className="pointer-events-none absolute inset-0 flex items-center justify-end pr-4 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity"
        >
          <button
            onClick={() => onWaitlist(slug, title)}
            className="pointer-events-auto rounded-full bg-[color:var(--foreground)] text-[color:var(--background)] px-4 py-2 text-xs font-medium shadow-md hover:scale-105 transition-transform"
          >
            Unlock this one →
          </button>
        </motion.div>
      </div>
    </motion.li>
  );
}
