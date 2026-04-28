"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Play } from "lucide-react";
import { fmtDuration } from "@/lib/essays";

export function EssayCard({
  rank,
  slug,
  title,
  durationSec,
}: {
  rank: number;
  slug: string;
  title: string;
  durationSec: number | null;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 18 });
  const sy = useSpring(my, { stiffness: 220, damping: 18 });
  const rotate = useTransform(sx, [-40, 40], [-1.5, 1.5]);
  const lift = useTransform(sy, [-40, 40], [-3, 3]);

  function onMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left - r.width / 2);
    my.set(e.clientY - r.top - r.height / 2);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0 },
      }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className="group"
    >
      <motion.a
        ref={ref}
        href={`/essay/${slug}`}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotate, y: lift }}
        className="flex items-center gap-5 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] px-5 py-4 transition-shadow hover:shadow-xl hover:shadow-black/[0.06] hover:border-[color:var(--accent)]/30"
      >
        <span className="w-8 text-right font-mono text-sm text-[color:var(--muted)] group-hover:text-[color:var(--accent)] transition-colors">
          {String(rank).padStart(2, "0")}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-base sm:text-lg leading-tight truncate">
            <Link href={`/essay/${slug}`} className="outline-none">
              {title}
            </Link>
          </h3>
          {durationSec ? (
            <p className="mt-1 text-xs text-[color:var(--muted)] flex items-center gap-1.5">
              <span className="inline-block h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
              {fmtDuration(durationSec)} · ready
            </p>
          ) : (
            <p className="mt-1 text-xs text-[color:var(--muted)]">audio coming soon</p>
          )}
        </div>
        <motion.span
          className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--accent)] text-white shadow-sm"
          whileHover={{ scale: 1.12 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
        >
          <span className="absolute inset-0 rounded-full bg-[color:var(--accent)] opacity-0 group-hover:opacity-30 group-hover:scale-150 transition-all duration-500" />
          <Play className="relative h-4 w-4 translate-x-[1px]" fill="currentColor" />
        </motion.span>
      </motion.a>
    </motion.li>
  );
}
