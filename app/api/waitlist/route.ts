import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAnon } from "@/lib/supabase";

const Body = z.object({
  email: z.string().email(),
  essaySlug: z.string().min(1).max(120).nullable().optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }
  const { email, essaySlug } = parsed.data;

  const sb = supabaseAnon();
  const { error } = await sb.from("waitlist").insert({
    email: email.toLowerCase().trim(),
    essay_slug: essaySlug ?? null,
  });

  // Treat unique-violation as success (idempotent signup).
  if (error && !/duplicate key|unique/i.test(error.message)) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
