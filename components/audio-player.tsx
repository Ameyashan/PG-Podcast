"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";
import { fmtDuration } from "@/lib/essays";

const SPEEDS = [1, 1.25, 1.5, 1.75, 2];

export function AudioPlayer({ src, durationSec }: { src: string; durationSec: number }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [duration, setDuration] = useState(durationSec);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setT(a.currentTime);
    const onLoaded = () => setDuration(a.duration || durationSec);
    const onEnd = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("ended", onEnd);
    };
  }, [durationSec]);

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play();
      setPlaying(true);
    }
  }

  function seek(pct: number) {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = pct * duration;
    setT(a.currentTime);
  }

  function back15() {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.max(0, a.currentTime - 15);
  }

  function cycleSpeed() {
    const a = audioRef.current;
    if (!a) return;
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
    a.playbackRate = next;
    setSpeed(next);
  }

  const pct = duration ? t / duration : 0;

  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-5 shadow-sm">
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--accent)] text-white shadow-md hover:scale-105 transition"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <motion.span
              className="absolute inset-0 rounded-full"
              animate={{ boxShadow: ["0 0 0 0 rgba(212,98,42,0.4)", "0 0 0 12px rgba(212,98,42,0)"] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
          ) : null}
          {playing ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="h-5 w-5 translate-x-[1px]" fill="currentColor" />}
        </button>

        <button
          onClick={back15}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border)] hover:bg-[color:var(--border)]/40"
          aria-label="Back 15 seconds"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        <div className="flex-1">
          <div
            className="relative h-2 cursor-pointer rounded-full bg-[color:var(--border)]"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              seek((e.clientX - r.left) / r.width);
            }}
          >
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${pct * 100}%`,
                background: "linear-gradient(90deg, #d4622a, #ff8a4c)",
              }}
              transition={{ type: "tween", duration: 0.1 }}
            />
          </div>
          <div className="mt-2 flex justify-between font-mono text-xs text-[color:var(--muted)]">
            <span>{fmtDuration(Math.floor(t))}</span>
            <span>{fmtDuration(Math.floor(duration))}</span>
          </div>
        </div>

        <button
          onClick={cycleSpeed}
          className="rounded-full border border-[color:var(--border)] px-3 py-1.5 text-xs font-mono hover:bg-[color:var(--border)]/40"
          aria-label="Playback speed"
        >
          {speed}×
        </button>
      </div>
    </div>
  );
}
