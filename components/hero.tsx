"use client";

import { motion } from "framer-motion";
import { Headphones, Sparkles } from "lucide-react";
import { AnimatedHeadline } from "./animated-headline";
import { CountUp } from "./count-up";
import { Marquee } from "./marquee";

export function Hero({
  unlockedCount,
  totalCount,
  totalMinutes,
  marqueeTitles,
}: {
  unlockedCount: number;
  totalCount: number;
  totalMinutes: number;
  marqueeTitles: string[];
}) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 30% 20%, rgba(212,98,42,0.18), transparent 60%), radial-gradient(50% 40% at 80% 0%, rgba(255,200,140,0.18), transparent 60%)",
        }}
      />
      <Marquee items={marqueeTitles} />

      <div className="relative mx-auto max-w-3xl px-6 pt-24 pb-12 sm:pt-32 sm:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--card)]/60 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[color:var(--muted)] backdrop-blur"
        >
          <Sparkles className="h-3 w-3 text-[color:var(--accent)]" />
          Paul Graham, in your ears
        </motion.div>

        <AnimatedHeadline />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.85 }}
          className="mt-6 text-lg text-[color:var(--muted)] max-w-2xl"
        >
          Nine-minute podcast versions of Paul Graham&apos;s essays, distilled and narrated. Press play
          on any of the unlocked episodes below — or tell us which of the rest you want next.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 1.0 }}
          className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm"
        >
          <Stat label="episodes ready" value={<CountUp to={unlockedCount} />} accent />
          <Stat label="essays in catalog" value={<CountUp to={totalCount} />} />
          <Stat
            label="minutes of audio"
            value={
              <>
                <CountUp to={totalMinutes} />
              </>
            }
            icon={<Headphones className="h-3.5 w-3.5" />}
          />
        </motion.div>
      </div>
    </section>
  );
}

function Stat({
  value,
  label,
  accent,
  icon,
}: {
  value: React.ReactNode;
  label: string;
  accent?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-2">
      <span
        className={`text-2xl font-semibold tabular-nums ${
          accent ? "text-[color:var(--accent)]" : "text-[color:var(--foreground)]"
        }`}
      >
        {value}
      </span>
      <span className="flex items-center gap-1 text-xs uppercase tracking-wider text-[color:var(--muted)]">
        {icon}
        {label}
      </span>
    </div>
  );
}
