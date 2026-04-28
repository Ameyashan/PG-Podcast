import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

let _client: SupabaseClient | null = null;
function supabase(): SupabaseClient {
  if (_client) return _client;
  _client = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
  return _client;
}

export async function uploadEpisode(opts: {
  slug: string;
  title: string;
  sourceUrl: string;
  rank: number;
  mp3Path: string;
  durationSec: number;
  script: string;
}) {
  const audioPath = `${opts.slug}.mp3`;
  const bytes = readFileSync(opts.mp3Path);

  const up = await supabase().storage
    .from("audio")
    .upload(audioPath, bytes, { contentType: "audio/mpeg", upsert: true });
  if (up.error) throw up.error;

  const row = {
    slug: opts.slug,
    title: opts.title,
    source_url: opts.sourceUrl,
    rank: opts.rank,
    is_unlocked: true,
    audio_path: audioPath,
    duration_sec: opts.durationSec,
    script: opts.script,
  };
  const ins = await supabase().from("essays").upsert(row, { onConflict: "slug" });
  if (ins.error) throw ins.error;
}

export async function seedLocked(rows: { slug: string; title: string; rank: number; sourceUrl: string }[]) {
  // Insert as locked. Don't clobber rows that are already unlocked.
  const payload = rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    source_url: r.sourceUrl,
    rank: r.rank,
    is_unlocked: false,
  }));
  // upsert with ignoreDuplicates so unlocked rows keep their state
  const res = await supabase().from("essays").upsert(payload, { onConflict: "slug", ignoreDuplicates: true });
  if (res.error) throw res.error;
}
