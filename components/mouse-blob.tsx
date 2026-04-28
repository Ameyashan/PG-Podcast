"use client";

import { useEffect, useRef } from "react";

export function MouseBlob() {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      target.current = { x: e.clientX, y: e.clientY };
    }
    function tick() {
      pos.current.x += (target.current.x - pos.current.x) * 0.08;
      pos.current.y += (target.current.y - pos.current.y) * 0.08;
      const el = ref.current;
      if (el) el.style.transform = `translate3d(${pos.current.x - 200}px, ${pos.current.y - 200}px, 0)`;
      raf.current = requestAnimationFrame(tick);
    }
    target.current = { x: window.innerWidth / 2, y: 200 };
    pos.current = { ...target.current };
    window.addEventListener("mousemove", onMove);
    raf.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-0 h-[400px] w-[400px] rounded-full opacity-60 blur-3xl will-change-transform"
      style={{
        background: "radial-gradient(circle, rgba(212,98,42,0.55), rgba(255,170,80,0.15) 60%, transparent 75%)",
      }}
    />
  );
}
