import { Lock } from "lucide-react";
import { EssayCard } from "./essay-card";
import { WaitlistForm } from "./waitlist-form";
import type { Essay } from "@/lib/essays";

const NUMBER_WORDS: Record<number, string> = {
  1: "one", 2: "two", 3: "three", 4: "four", 5: "five",
  6: "six", 7: "seven", 8: "eight", 9: "nine", 10: "ten",
  11: "eleven", 12: "twelve", 13: "thirteen", 14: "fourteen", 15: "fifteen",
};

export function EssayList({ essays }: { essays: Essay[] }) {
  const heading = NUMBER_WORDS[essays.length]
    ? `The ${NUMBER_WORDS[essays.length]}`
    : `The ${essays.length}`;

  return (
    <section className="px-6 pb-6 pt-10 md:px-16 md:pb-6 md:pt-14">
      <div className="mb-[18px] flex flex-wrap items-baseline justify-between gap-2.5">
        <h2 className="m-0 font-serif text-[26px] font-normal tracking-[-0.6px] md:text-[32px]">
          {heading}
        </h2>
        <span className="font-mono text-[11px] uppercase tracking-[0.5px] text-[color:var(--muted)]">
          tap any card to listen
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
        {essays.map((e) => (
          <EssayCard
            key={e.slug}
            rank={e.rank}
            slug={e.slug}
            title={e.title}
            durationSec={e.duration_sec}
          />
        ))}
      </div>

      <MoreComing startRank={essays.length + 1} />
    </section>
  );
}

function LockedCard({ rank }: { rank: number }) {
  return (
    <div className="relative flex flex-col gap-[14px] rounded-[14px] border border-dashed border-[color:var(--border)] bg-[color:var(--card)]/60 p-[18px] pb-4">
      <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.4px] text-[color:var(--muted)]">
        <span>№ {String(rank).padStart(2, "0")}</span>
        <span className="flex items-center gap-1.5">
          <Lock className="h-3 w-3" />
          <span>locked</span>
        </span>
      </div>
      <div
        className="min-h-[52px] select-none font-serif text-[22px] font-medium leading-[1.15] text-[color:var(--foreground)]"
        style={{ filter: "blur(7px)" }}
        aria-hidden
      >
        An essay still in the studio
      </div>
      <div className="flex items-center gap-2.5">
        <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[color:var(--foreground)]/40">
          <Lock className="h-3 w-3 text-white" />
        </span>
        <div className="flex h-[26px] flex-1 items-center gap-[2px] opacity-50">
          {Array.from({ length: 38 }).map((_, i) => (
            <div
              key={i}
              className="rounded-[1px] bg-[color:var(--ink2,#3D362E)]/40"
              style={{ width: 2, height: `${30 + ((i * 37) % 60)}%` }}
            />
          ))}
        </div>
        <span className="ml-auto font-mono text-[10px] text-[color:var(--muted)]">--:--</span>
      </div>
    </div>
  );
}

function MoreComing({ startRank }: { startRank: number }) {
  return (
    <div className="relative mt-10">
      <div
        aria-hidden
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3"
      >
        {[0, 1, 2].map((i) => (
          <LockedCard key={i} rank={startRank + i} />
        ))}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-b from-transparent via-[color:var(--background)]/60 to-[color:var(--background)]"
      />

      <div className="relative -mt-16 mx-auto max-w-xl rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-[0_20px_50px_-30px_rgba(26,23,20,0.35)] sm:p-7">
        <div className="mb-1.5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.5px] text-[color:var(--muted)]">
          <Lock className="h-3 w-3" />
          <span>more on the way</span>
        </div>
        <h3 className="m-0 font-serif text-[22px] font-medium leading-tight text-[color:var(--foreground)] sm:text-[26px]">
          More PG, brewing in the studio.
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-[color:var(--ink2,#3D362E)]">
          Drop your email and we&apos;ll holler the moment the next batch of
          essays goes live. No spam — just a single &ldquo;go listen&rdquo; note.
        </p>
        <div className="mt-4">
          <WaitlistForm />
        </div>
      </div>
    </div>
  );
}
