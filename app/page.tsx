import Link from "next/link";
import { ArrowRight, Play, Rss } from "lucide-react";
import { Hero } from "@/components/hero";
import { EssayList } from "@/components/essay-list";
import { RuntimeBanner } from "@/components/runtime-banner";
import { getEssays } from "@/lib/essays";

export const revalidate = 60;

export default async function Home() {
  const essays = await getEssays();
  const audioReady = essays.filter((e) => e.is_unlocked && e.duration_sec);
  const totalSec = audioReady.reduce((acc, e) => acc + (e.duration_sec ?? 0), 0);
  const totalMin = Math.round(totalSec / 60);

  return (
    <main className="relative z-10">
      {/* nav */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[color:var(--border)] bg-[color:var(--background)]/85 px-5 py-3 backdrop-blur md:px-10 md:py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[color:var(--foreground)]">
            <Play className="h-2.5 w-2.5 translate-x-[1.5px] text-[color:var(--background)]" fill="currentColor" />
          </span>
          <span className="font-serif text-[18px] font-medium tracking-[-0.3px]">
            PG <span className="italic text-[color:var(--accent)]">Podcast</span>
          </span>
        </Link>
        <div className="hidden items-center gap-[18px] text-[13px] text-[color:var(--ink2,#3D362E)] md:flex">
          <span className="flex items-center gap-1.5">
            <Rss className="h-3 w-3" />
            RSS feed
            <span className="rounded-full bg-[color:var(--paper2,#EAE1CC)] px-1.5 py-[2px] font-mono text-[10px] text-[color:var(--muted)]">
              soon
            </span>
          </span>
          <a href="#waitlist" className="flex h-[34px] items-center gap-1.5 rounded-full bg-[color:var(--foreground)] px-3.5 text-[13px] font-medium text-white">
            Join waitlist <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </header>

      <Hero unlockedCount={audioReady.length} />

      <RuntimeBanner totalMinutes={totalMin} episodeCount={audioReady.length} />

      <EssayList essays={audioReady} />

      <footer className="mt-6 flex flex-col justify-between gap-[18px] border-t border-[color:var(--border)] px-6 py-10 font-mono text-xs text-[color:var(--muted)] md:flex-row md:items-center md:px-16 md:py-14">
        <div className="leading-[1.7]">
          <div className="mb-1 font-serif text-base italic text-[color:var(--foreground)]">
            PG Podcast
          </div>
          A hobby project. Not affiliated with Paul Graham or Y Combinator.
          <br />
          Essays © their author. Audio narration generated with permission.
        </div>
        <div className="flex gap-[18px]">
          <span>© 2026</span>
          <span>contact</span>
          <span>about</span>
        </div>
      </footer>
    </main>
  );
}
