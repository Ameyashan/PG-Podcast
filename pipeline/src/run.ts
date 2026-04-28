import { config as loadEnv } from "dotenv";
loadEnv({ override: true });
import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { CURATED_SLUGS } from "./curated.js";
import { fetchEssay, listAllEssays } from "./scrape.js";
import { generateScript } from "./script.js";
import { scriptToMp3 } from "./tts.js";
import { uploadEpisode, seedLocked } from "./upload.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "out");

function getArg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const FLAGS = new Set(process.argv.slice(2));

async function buildOne(slug: string, rank: number, dryRun: boolean) {
  console.log(`\n=== ${slug} (rank ${rank}) ===`);
  const essay = await fetchEssay(slug);
  console.log(`  fetched: ${essay.text.length} chars, title="${essay.title}"`);

  const scriptPath = join(OUT_DIR, "scripts", `${slug}.txt`);
  let script: string;
  if (existsSync(scriptPath) && !FLAGS.has("--regen-script")) {
    script = readFileSync(scriptPath, "utf-8");
    console.log(`  script: cached (${script.length} chars). Use --regen-script to regenerate.`);
  } else {
    console.log(`  script: generating with Claude...`);
    script = await generateScript({ title: essay.title, essayText: essay.text });
    writeFileSync(scriptPath, script);
    console.log(`  script: ${script.length} chars, saved to ${scriptPath}`);
  }

  if (dryRun) {
    console.log(`  --dry-run: stopping before TTS`);
    return;
  }

  const mp3Path = join(OUT_DIR, "audio", `${slug}.mp3`);
  console.log(`  tts: synthesizing...`);
  const { durationSec } = await scriptToMp3({ script, outPath: mp3Path });
  console.log(`  tts: ${durationSec}s mp3 -> ${mp3Path}`);

  console.log(`  upload: pushing to Supabase...`);
  await uploadEpisode({
    slug,
    title: CURATED_SLUGS.find((c) => c.slug === slug)?.title ?? essay.title,
    sourceUrl: essay.url,
    rank,
    mp3Path,
    durationSec,
    script,
  });
  console.log(`  ✓ done`);
}

async function cmdBuildTop() {
  const dryRun = FLAGS.has("--dry-run");
  const only = getArg("--only");
  const targets = only
    ? CURATED_SLUGS.filter((c) => c.slug === only).map((c, i) => ({ ...c, rank: CURATED_SLUGS.findIndex((x) => x.slug === c.slug) + 1 }))
    : CURATED_SLUGS.map((c, i) => ({ ...c, rank: i + 1 }));
  if (only && targets.length === 0) throw new Error(`--only ${only} not in curated list`);
  for (const t of targets) {
    try {
      await buildOne(t.slug, t.rank, dryRun);
    } catch (e) {
      console.error(`  ✗ failed: ${(e as Error).message}`);
    }
  }
}

async function cmdSeedLocked() {
  console.log(`scraping articles.html...`);
  const all = await listAllEssays();
  console.log(`  found ${all.length} essay links`);
  const curatedSlugs = new Set(CURATED_SLUGS.map((c) => c.slug));
  // Locked rows get ranks starting at 100 so curated slugs (1..15) sort first.
  const locked = all
    .filter((e) => !curatedSlugs.has(e.slug))
    .map((e, i) => ({ slug: e.slug, title: e.title, rank: 100 + i, sourceUrl: e.url }));
  console.log(`  inserting ${locked.length} locked rows...`);
  await seedLocked(locked);

  // Also seed curated rows as locked placeholders so the landing page renders even
  // before TTS runs. build-top will flip is_unlocked=true.
  await seedLocked(
    CURATED_SLUGS.map((c, i) => ({
      slug: c.slug,
      title: c.title,
      rank: i + 1,
      sourceUrl: `https://paulgraham.com/${c.slug}.html`,
    })),
  );
  console.log(`✓ seed complete`);
}

const cmd = process.argv[2];
if (cmd === "seed-locked") {
  await cmdSeedLocked();
} else if (cmd === "build-top") {
  await cmdBuildTop();
} else if (cmd === "build-one") {
  const slug = process.argv[3];
  if (!slug) throw new Error("usage: build-one <slug>");
  const rank = CURATED_SLUGS.findIndex((c) => c.slug === slug) + 1 || 1;
  await buildOne(slug, rank, FLAGS.has("--dry-run"));
} else {
  console.error("usage: tsx src/run.ts <seed-locked|build-top|build-one> [--only slug] [--dry-run] [--regen-script]");
  process.exit(1);
}
