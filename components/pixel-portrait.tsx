"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const PIXEL_W = 56;
const PIXEL_H = 64;

export function PixelPortrait() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/paul-graham.jpg";
    img.onload = () => {
      canvas.width = PIXEL_W;
      canvas.height = PIXEL_H;

      const srcRatio = img.width / img.height;
      const dstRatio = PIXEL_W / PIXEL_H;
      let sx = 0,
        sy = 0,
        sw = img.width,
        sh = img.height;
      if (srcRatio > dstRatio) {
        sw = img.height * dstRatio;
        sx = (img.width - sw) / 2;
      } else {
        sh = img.width / dstRatio;
        sy = (img.height - sh) / 2;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, PIXEL_W, PIXEL_H);

      const imageData = ctx.getImageData(0, 0, PIXEL_W, PIXEL_H);
      const d = imageData.data;
      const levels = 5;
      for (let i = 0; i < d.length; i += 4) {
        d[i] = Math.round((d[i] / 255) * (levels - 1)) * (255 / (levels - 1));
        d[i + 1] = Math.round((d[i + 1] / 255) * (levels - 1)) * (255 / (levels - 1));
        d[i + 2] = Math.round((d[i + 2] / 255) * (levels - 1)) * (255 / (levels - 1));
      }
      ctx.putImageData(imageData, 0, 0);
      setLoaded(true);
    };
  }, []);

  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4.2, ease: "easeInOut", repeat: Infinity }}
      className="relative mx-auto w-[260px] select-none"
    >
      <div
        aria-hidden
        className="absolute -inset-3 -z-10 rounded-[28px] blur-2xl opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 40%, rgba(212,98,42,0.55), transparent 70%)",
        }}
      />
      <div className="relative overflow-hidden rounded-2xl border-4 border-[color:var(--accent)] bg-[#e85a1a] shadow-[0_20px_60px_-20px_rgba(212,98,42,0.6)]">
        <canvas
          ref={canvasRef}
          width={PIXEL_W}
          height={PIXEL_H}
          aria-label="Paul Graham, pixelated"
          className="block w-full h-auto"
          style={{
            imageRendering: "pixelated",
            opacity: loaded ? 1 : 0,
            transition: "opacity 200ms",
            aspectRatio: `${PIXEL_W} / ${PIXEL_H}`,
          }}
        />
        <span
          aria-hidden
          className="pixel-blink pointer-events-none absolute left-[14%] right-[14%] top-[40%] block h-[6%] rounded-[1px] bg-[#2a1a10]"
        />
      </div>
      <div className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)]">
        Paul · 8-bit
      </div>
      <style jsx>{`
        .pixel-blink {
          opacity: 0;
          animation: pg-blink 5.2s infinite;
        }
        @keyframes pg-blink {
          0%, 94%, 100% { opacity: 0; }
          96%, 98% { opacity: 1; }
        }
      `}</style>
    </motion.div>
  );
}
