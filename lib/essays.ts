import { supabaseAnon } from "./supabase";

export type Essay = {
  slug: string;
  title: string;
  source_url: string;
  rank: number;
  is_unlocked: boolean;
  audio_path: string | null;
  duration_sec: number | null;
  script: string | null;
};

export async function getEssays(): Promise<Essay[]> {
  const sb = supabaseAnon();
  const { data, error } = await sb
    .from("essays")
    .select("slug,title,source_url,rank,is_unlocked,audio_path,duration_sec,script")
    .order("rank", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Essay[];
}

export async function getEssay(slug: string): Promise<Essay | null> {
  const sb = supabaseAnon();
  const { data, error } = await sb
    .from("essays")
    .select("slug,title,source_url,rank,is_unlocked,audio_path,duration_sec,script")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data as Essay | null) ?? null;
}

export function audioUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${base}/storage/v1/object/public/audio/${path}`;
}

export function fmtDuration(sec: number | null | undefined): string {
  if (!sec) return "";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
