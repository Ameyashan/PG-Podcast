import { ElevenLabsClient } from "elevenlabs";
import { writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";

const MAX_CHARS = 4500;

function chunkScript(script: string): string[] {
  if (script.length <= MAX_CHARS) return [script];
  const paragraphs = script.split(/\n\n+/);
  const chunks: string[] = [];
  let buf = "";
  for (const p of paragraphs) {
    if ((buf + "\n\n" + p).length > MAX_CHARS && buf) {
      chunks.push(buf);
      buf = p;
    } else {
      buf = buf ? buf + "\n\n" + p : p;
    }
  }
  if (buf) chunks.push(buf);
  return chunks;
}

async function synthesize(text: string): Promise<Buffer> {
  const voiceId = process.env.ELEVENLABS_VOICE_ID;
  const model = process.env.ELEVENLABS_MODEL || "eleven_turbo_v2_5";
  if (!voiceId) throw new Error("ELEVENLABS_VOICE_ID not set");
  const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
  const audio = await client.textToSpeech.convert(voiceId, {
    text,
    model_id: model,
    output_format: "mp3_44100_128",
  });
  // The SDK returns a Readable stream
  const reader = audio as unknown as AsyncIterable<Uint8Array>;
  const parts: Buffer[] = [];
  for await (const chunk of reader) parts.push(Buffer.from(chunk));
  return Buffer.concat(parts);
}

function concatMp3s(buffers: Buffer[], outPath: string) {
  if (buffers.length === 1) {
    writeFileSync(outPath, buffers[0]);
    return;
  }
  const dir = mkdtempSync(join(tmpdir(), "pgp-"));
  const partPaths: string[] = [];
  buffers.forEach((b, i) => {
    const p = join(dir, `part-${i}.mp3`);
    writeFileSync(p, b);
    partPaths.push(p);
  });
  const listFile = join(dir, "list.txt");
  writeFileSync(listFile, partPaths.map((p) => `file '${p}'`).join("\n"));
  const r = spawnSync("ffmpeg", ["-y", "-f", "concat", "-safe", "0", "-i", listFile, "-c", "copy", outPath], {
    encoding: "utf-8",
  });
  rmSync(dir, { recursive: true, force: true });
  if (r.status !== 0) throw new Error(`ffmpeg failed: ${r.stderr}`);
}

function probeDuration(path: string): number {
  const r = spawnSync(
    "ffprobe",
    ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", path],
    { encoding: "utf-8" },
  );
  if (r.status !== 0) throw new Error(`ffprobe failed: ${r.stderr}`);
  return Math.round(parseFloat(r.stdout.trim()));
}

export async function scriptToMp3(opts: { script: string; outPath: string }): Promise<{ durationSec: number }> {
  const chunks = chunkScript(opts.script);
  const buffers: Buffer[] = [];
  for (const [i, chunk] of chunks.entries()) {
    process.stderr.write(`  [tts] chunk ${i + 1}/${chunks.length} (${chunk.length} chars)\n`);
    buffers.push(await synthesize(chunk));
  }
  concatMp3s(buffers, opts.outPath);
  const durationSec = probeDuration(opts.outPath);
  return { durationSec };
}
