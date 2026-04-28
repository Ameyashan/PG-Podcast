"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { fmtDuration } from "@/lib/essays";

function Waveform({ seed = 1, bars = 38 }: { seed?: number; bars?: number }) {
  const heights: number[] = [];
  let x = seed * 9301 + 49297;
  for (let i = 0; i < bars; i++) {
    x = (x * 9301 + 49297) % 233280;
    heights.push(0.25 + (x / 233280) * 0.75);
  }
  return (
    <div className="flex h-[26px] flex-1 items-center gap-[2px]">
      {heights.map((h, i) => (
        <div
          key={i}
          className="rounded-[1px] bg-[color:var(--ink2,#3D362E)]/55"
          style={{ width: 2, height: `${h * 100}%` }}
        />
      ))}
    </div>
  );
}

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
  const num = String(rank).padStart(2, "0");
  const minutes = durationSec ? Math.max(1, Math.round(durationSec / 60)) : null;

  return (
    <Link
      href={`/essay/${slug}`}
      className="group relative flex flex-col gap-[14px] rounded-[14px] border border-[color:var(--border)] bg-[color:var(--card)] p-[18px] pb-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-16px_rgba(26,23,20,0.25)]"
    >
      <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.4px] text-[color:var(--muted)]">
        <span>№ {num}</span>
        {minutes != null ? (
          <span className="flex items-center gap-1.5">
            <span>{minutes} min</span>
          </span>
        ) : (
          <span>audio soon</span>
        )}
      </div>

      <h3 className="m-0 min-h-[52px] select-text font-serif text-[22px] font-medium leading-[1.15] text-[color:var(--foreground)]">
        {title}
      </h3>

      <div className="flex items-center gap-2.5">
        <span className="relative flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[color:var(--foreground)] transition group-hover:bg-[color:var(--accent)]">
          <Play className="h-[11px] w-[11px] translate-x-[1px] text-white" fill="currentColor" />
        </span>
        <Waveform seed={rank + 3} bars={38} />
        <span className="ml-auto font-mono text-[10px] text-[color:var(--muted)]">
          {durationSec ? fmtDuration(durationSec) : "--:--"}
        </span>
      </div>
    </Link>
  );
}
