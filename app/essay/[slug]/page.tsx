import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { audioUrl, getEssay } from "@/lib/essays";
import { AudioPlayer } from "@/components/audio-player";

export const revalidate = 60;

export default async function EssayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const essay = await getEssay(slug);
  if (!essay || !essay.is_unlocked || !essay.audio_path) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
      >
        <ArrowLeft className="h-4 w-4" /> All episodes
      </Link>

      <h1 className="mt-6 text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">
        {essay.title}
      </h1>
      <p className="mt-2 text-sm text-[color:var(--muted)]">
        Adapted from{" "}
        <a href={essay.source_url} target="_blank" rel="noopener" className="underline hover:text-[color:var(--foreground)]">
          paulgraham.com/{slug}.html
        </a>
      </p>

      <div className="sticky top-4 z-10 mt-8">
        <AudioPlayer src={audioUrl(essay.audio_path)} durationSec={essay.duration_sec ?? 0} />
      </div>

      {essay.script ? (
        <article className="prose prose-neutral mt-10 max-w-none whitespace-pre-wrap leading-relaxed text-[color:var(--foreground)]">
          {essay.script}
        </article>
      ) : null}
    </main>
  );
}
