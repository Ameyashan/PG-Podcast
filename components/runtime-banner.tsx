export function RuntimeBanner({
  totalMinutes,
  episodeCount,
}: {
  totalMinutes: number;
  episodeCount: number;
}) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const runtime = h > 0 ? `${h}h ${m}m` : `${m}m`;

  return (
    <div className="mx-auto mt-2 flex max-w-6xl flex-col items-start justify-between gap-4 rounded-2xl bg-[#1A1714] px-6 py-4 text-[color:var(--background)] md:mx-6 md:flex-row md:items-center md:gap-6 md:px-6 md:py-[18px] lg:mx-auto">
      <div className="flex items-center gap-4">
        <div
          className="font-serif italic leading-none text-[color:var(--accent)]"
          style={{ fontSize: 40, fontWeight: 400 }}
        >
          {runtime}
        </div>
        <div className="text-[13px] leading-snug text-[rgba(242,235,220,0.7)] max-w-[280px]">
          of pure PG, queued up.
          <br />
          <span className="font-mono text-[11px] text-[rgba(242,235,220,0.45)]">
            ≈ NYC → Boston, twice
          </span>
        </div>
      </div>
      <div className="hidden items-center gap-1.5 font-mono text-[11px] uppercase tracking-[1px] text-[rgba(242,235,220,0.5)] md:flex">
        {Array.from({ length: episodeCount }).map((_, i) => (
          <div
            key={i}
            className="rounded-[2px]"
            style={{
              width: 10,
              height: 22,
              background: `rgba(242,235,220,${
                0.15 + (i / Math.max(episodeCount, 1)) * 0.35
              })`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
