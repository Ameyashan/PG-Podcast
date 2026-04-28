"use client";

import { useEffect, useState } from "react";

export function CountUp({ to, durationMs = 1200, suffix = "" }: { to: number; durationMs?: number; suffix?: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    function step(t: number) {
      const p = Math.min(1, (t - start) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, durationMs]);
  return (
    <span className="font-mono tabular-nums">
      {v.toLocaleString()}
      {suffix}
    </span>
  );
}
