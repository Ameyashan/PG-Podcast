import * as cheerio from "cheerio";

const BASE = "https://paulgraham.com";

export type EssayListing = { slug: string; title: string; url: string };

const SKIP = new Set([
  "index.html",
  "rss.html",
  "articles.html",
  "rootsoflisp.html",
  "kedrosky.html",
  "noop.html",
]);

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "user-agent": "pg-podcast/0.1 (+https://github.com/pg-podcast)" },
  });
  if (!res.ok) throw new Error(`fetch ${url} -> ${res.status}`);
  // PG's site is ISO-8859-1 in places; node fetch decodes as utf-8 which is fine for ASCII content.
  return await res.text();
}

export async function listAllEssays(): Promise<EssayListing[]> {
  const html = await fetchText(`${BASE}/articles.html`);
  const $ = cheerio.load(html);
  const out: EssayListing[] = [];
  const seen = new Set<string>();

  $("a").each((_, el) => {
    const href = ($(el).attr("href") ?? "").trim();
    const text = $(el).text().trim();
    if (!href || !text) return;
    // Only relative .html links (essay pages)
    if (!/^[a-z0-9_-]+\.html$/i.test(href)) return;
    if (SKIP.has(href)) return;
    if (seen.has(href)) return;
    seen.add(href);
    const slug = href.replace(/\.html$/i, "");
    out.push({ slug, title: text, url: `${BASE}/${href}` });
  });

  return out;
}

export type EssayContent = { slug: string; title: string; url: string; text: string };

export async function fetchEssay(slug: string): Promise<EssayContent> {
  const url = `${BASE}/${slug}.html`;
  const html = await fetchText(url);
  const $ = cheerio.load(html);

  $("script, style").remove();

  // PG's body text lives in a deeply nested <font> tag inside the main table.
  // Heuristic: find the <font> element with the most text content.
  let bestText = "";
  $("font").each((_, el) => {
    const t = $(el).text().trim();
    if (t.length > bestText.length) bestText = t;
  });

  let raw = bestText || $("body").text();

  // Normalize whitespace, collapse runs of blank lines to one.
  raw = raw
    .replace(/ /g, " ")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Drop trailing "Notes" / "Thanks to" footnotes if obvious.
  raw = raw.replace(/\n\nNotes?\n[\s\S]*$/i, "").replace(/\n\nThanks to[\s\S]*$/i, "");

  // Try to sniff title from <title>
  let title = ($("title").text() || "").trim();
  if (!title) title = slug;

  return { slug, title, url, text: raw };
}
