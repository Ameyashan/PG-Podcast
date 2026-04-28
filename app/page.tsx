import { Hero } from "@/components/hero";
import { EssayList } from "@/components/essay-list";
import { WaitlistForm } from "@/components/waitlist-form";
import { MouseBlob } from "@/components/mouse-blob";
import { getEssays } from "@/lib/essays";

export const revalidate = 60;

export default async function Home() {
  const essays = await getEssays();
  const unlocked = essays.filter((e) => e.is_unlocked);
  const totalSec = unlocked.reduce((acc, e) => acc + (e.duration_sec ?? 0), 0);
  const totalMin = Math.round(totalSec / 60);
  const marqueeTitles = essays.slice(0, 25).map((e) => e.title);

  return (
    <main className="relative">
      <MouseBlob />
      <Hero
        unlockedCount={unlocked.length}
        totalCount={essays.length}
        totalMinutes={totalMin}
        marqueeTitles={marqueeTitles}
      />
      <EssayList essays={essays} />

      <section className="border-t border-[color:var(--border)] bg-[color:var(--card)]/40">
        <div className="mx-auto max-w-2xl px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold">Want more episodes?</h2>
          <p className="mt-2 text-[color:var(--muted)]">
            Tell us you&apos;re interested and we&apos;ll prioritize the next batch.
          </p>
          <div className="mt-6 mx-auto max-w-md">
            <WaitlistForm />
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-xs text-[color:var(--muted)]">
        Essays © Paul Graham · paulgraham.com · Audio digests for personal listening only.
      </footer>
    </main>
  );
}
